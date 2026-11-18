"""
VidyaFloww Multi-Tenant Resolution & Scoped Responsibility Permission Evaluators
"""

from typing import Iterable, Optional
from django.utils import timezone
from rest_framework.permissions import BasePermission

from common.context import set_request_context
from common.exceptions import TenantAccessDeniedError
from common.middleware import bind_postgres_rls_school
from common.utils import get_client_ip


def resolve_user_tenant_context(request, *, require_school: bool = True):
    """
    Validates that `request.user` holds an active `Membership` for the requested
    `X-School-ID` (or resolves unambiguously if user has a single active school membership).
    Never trusts unverified school IDs.
    """
    from core.users.models import Membership, UserType
    from core.campuses.models import Branch
    from platform_services.audit.services import record_audit_event

    if getattr(request, "membership", None) is not None:
        return request.membership

    user = getattr(request, "user", None)
    if not user or not user.is_authenticated:
        return None

    requested_school_id = getattr(request, "requested_school_id", None)
    requested_branch_id = getattr(request, "requested_branch_id", None)

    active_memberships = Membership.objects.select_related(
        "tenant", "school", "default_branch"
    ).filter(user=user, is_active=True)

    membership = None
    if requested_school_id:
        membership = active_memberships.filter(school_id=requested_school_id).first()
        if not membership:
            # Check if user is a platform-level admin/executive owning this school's tenant
            platform_membership = active_memberships.filter(
                user_type__in=[UserType.SUPER_ADMIN, UserType.SUPER_EXECUTIVE],
                tenant__schools__id=requested_school_id,
            ).first()
            if platform_membership:
                from core.organizations.models import School

                school = School.objects.select_related("tenant").filter(id=requested_school_id).first()
                if school:
                    request.school = school
                    request.membership = platform_membership
            if not getattr(request, "membership", None):
                record_audit_event(
                    school_id=requested_school_id,
                    actor_user_id=user.id,
                    actor_name=user.full_name,
                    actor_role_label="Unknown",
                    category="Permissions",
                    action="CROSS_TENANT_ACCESS_BLOCKED",
                    target_type="School",
                    target_id=str(requested_school_id),
                    ip_address=get_client_ip(request),
                    status="Blocked",
                )
                raise TenantAccessDeniedError(
                    message="You do not have an active membership for the requested school."
                )
    else:
        school_memberships = list(active_memberships.filter(school__isnull=False)[:2])
        if len(school_memberships) == 1:
            membership = school_memberships[0]
        elif not require_school:
            membership = active_memberships.first()
        elif len(school_memberships) > 1:
            raise TenantAccessDeniedError(
                message="Multiple schools are linked to your account. Specify X-School-ID header.",
                code="SCHOOL_HEADER_REQUIRED",
            )
        else:
            # User may be platform-level without school header
            membership = active_memberships.filter(
                user_type__in=[UserType.SUPER_ADMIN, UserType.SUPER_EXECUTIVE]
            ).first()
            if require_school:
                raise TenantAccessDeniedError(
                    message="No active school membership found or X-School-ID missing.",
                    code="SCHOOL_CONTEXT_REQUIRED",
                )

    if membership and getattr(request, "membership", None) is None:
        request.membership = membership
        request.school = membership.school

    school = getattr(request, "school", None)
    branch = None
    if school and requested_branch_id:
        branch = Branch.objects.filter(id=requested_branch_id, school=school, status="ACTIVE").first()
        if not branch:
            raise TenantAccessDeniedError(
                message="Invalid branch specified for the selected school.",
                code="INVALID_BRANCH_SCOPE",
            )
    elif getattr(request, "membership", None) and request.membership.default_branch_id:
        branch = request.membership.default_branch

    request.branch = branch
    set_request_context(
        user_id=user.id,
        tenant_id=membership.tenant_id if membership else None,
        school_id=school.id if school else None,
        branch_id=branch.id if branch else None,
    )
    if school:
        bind_postgres_rls_school(school.id)

    return getattr(request, "membership", None)


def evaluate_staff_responsibility(
    membership,
    *,
    work_division: str,
    action: str,
    submodule: str = "*",
    branch_id: Optional[str] = None,
    grade_class_id: Optional[str] = None,
    section_id: Optional[str] = None,
    subject_id: Optional[str] = None,
    student_id: Optional[str] = None,
) -> bool:
    """
    Evaluates whether a Membership satisfies a required division/action and optional data scope.
    """
    from core.users.models import UserType
    from core.permissions.models import StaffResponsibilityAssignment

    if not membership or not membership.is_active:
        return False

    if membership.user_type in {
        UserType.SUPER_ADMIN,
        UserType.SUPER_EXECUTIVE,
        UserType.SCHOOL_ADMIN,
        UserType.SCHOOL_EXECUTIVE,
    }:
        return True

    if membership.user_type != UserType.STAFF:
        return False

    now = timezone.now()
    assignments = StaffResponsibilityAssignment.objects.filter(
        membership=membership,
        work_division=work_division,
        revoked_at__isnull=True,
        valid_from__lte=now,
    ).filter(
        # null valid_until or valid_until > now
        **{}
    )

    for a in assignments:
        if a.valid_until and a.valid_until <= now:
            continue
        if a.submodule_code not in ("*", submodule):
            continue
        if action not in (a.actions or []) and "manage" not in (a.actions or []):
            continue
        if branch_id and a.branch_ids and str(branch_id) not in [str(x) for x in a.branch_ids]:
            continue
        if grade_class_id and a.grade_class_ids and str(grade_class_id) not in [str(x) for x in a.grade_class_ids]:
            continue
        if section_id and a.section_ids and str(section_id) not in [str(x) for x in a.section_ids]:
            continue
        if subject_id and a.subject_ids and str(subject_id) not in [str(x) for x in a.subject_ids]:
            continue
        if student_id and a.student_ids and str(student_id) not in [str(x) for x in a.student_ids]:
            continue
        return True

    return False


class IsAuthenticatedTenantMember(BasePermission):
    """Requires authenticated user with a verified active School Membership."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        membership = resolve_user_tenant_context(request, require_school=True)
        return membership is not None


class IsAuthenticatedPlatformUser(BasePermission):
    """Requires authenticated user belonging to Platform (SUPER_ADMIN or SUPER_EXECUTIVE)."""

    allowed_user_types: Iterable[str] = ()

    def has_permission(self, request, view):
        from core.users.models import UserType

        if not request.user or not request.user.is_authenticated:
            return False
        membership = resolve_user_tenant_context(request, require_school=False)
        if not membership:
            return False
        return membership.user_type in {UserType.SUPER_ADMIN, UserType.SUPER_EXECUTIVE}


class IsSuperAdminOnly(BasePermission):
    """Strictly requires SUPER_ADMIN (blocks SUPER_EXECUTIVE, e.g., for subscription cancellation)."""

    message = "Only the customer Super Admin can perform this action."

    def has_permission(self, request, view):
        from core.users.models import UserType

        if not request.user or not request.user.is_authenticated:
            return False
        membership = resolve_user_tenant_context(request, require_school=False)
        return bool(membership and membership.user_type == UserType.SUPER_ADMIN)


class HasWorkDivisionAccess(BasePermission):
    """
    DRF permission checking view.work_division and mapping HTTP method -> action.
    School Admin/Executive pass automatically; STAFF checks StaffResponsibilityAssignment.
    """

    METHOD_ACTION_MAP = {
        "GET": "view",
        "HEAD": "view",
        "OPTIONS": "view",
        "POST": "create",
        "PUT": "edit",
        "PATCH": "edit",
        "DELETE": "delete",
    }

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        membership = resolve_user_tenant_context(request, require_school=True)
        if not membership:
            return False

        division = getattr(view, "work_division", None)
        if not division:
            return False

        action = getattr(view, "required_action", None) or self.METHOD_ACTION_MAP.get(request.method, "view")
        submodule = getattr(view, "work_submodule", "*")

        return evaluate_staff_responsibility(
            membership,
            work_division=division,
            action=action,
            submodule=submodule,
            branch_id=str(request.branch.id) if getattr(request, "branch", None) else None,
        )
