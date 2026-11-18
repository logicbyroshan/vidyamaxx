"""
VidyaFloww Multi-School User Membership & User Types
"""

from django.conf import settings
from django.db import models
from django.db.models import Q
from django.utils import timezone

from common.models import TimestampedModel


class UserType(models.TextChoices):
    # Platform-Level Management
    SUPER_ADMIN = "SUPER_ADMIN", "Super Admin"
    SUPER_EXECUTIVE = "SUPER_EXECUTIVE", "Super Executive"
    # School-Level Management
    SCHOOL_ADMIN = "SCHOOL_ADMIN", "School Admin"
    SCHOOL_EXECUTIVE = "SCHOOL_EXECUTIVE", "School Executive"
    # Unified General Staff (authorization solely via StaffResponsibilityAssignment)
    STAFF = "STAFF", "Staff"
    # End-User Portals
    STUDENT = "STUDENT", "Student"
    PARENT = "PARENT", "Parent"


class Membership(TimestampedModel):
    """
    Links a platform User to a CustomerTenant and (for school/staff/end-users) a specific School.
    A user may hold multiple Memberships across multiple schools with different responsibilities.
    """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="memberships")
    tenant = models.ForeignKey(
        "organizations.CustomerTenant", on_delete=models.CASCADE, related_name="memberships"
    )
    school = models.ForeignKey(
        "organizations.School",
        on_delete=models.CASCADE,
        related_name="memberships",
        null=True,
        blank=True,
    )
    default_branch = models.ForeignKey(
        "campuses.Branch",
        on_delete=models.SET_NULL,
        related_name="default_memberships",
        null=True,
        blank=True,
    )
    user_type = models.CharField(max_length=30, choices=UserType.choices, db_index=True)
    is_active = models.BooleanField(default=True)
    joined_at = models.DateTimeField(default=timezone.now)
    deactivated_at = models.DateTimeField(null=True, blank=True)
    preferences_json = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = "core_membership"
        verbose_name = "Membership"
        verbose_name_plural = "Memberships"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "school", "user_type"],
                condition=Q(school__isnull=False),
                name="uq_membership_user_school_type",
            ),
            models.UniqueConstraint(
                fields=["user", "tenant", "user_type"],
                condition=Q(school__isnull=True),
                name="uq_membership_user_tenant_platform_type",
            ),
        ]

    def __str__(self):
        scope = self.school.short_code if self.school else f"TENANT:{self.tenant.slug}"
        return f"{self.user.full_name} [{self.user_type} @ {scope}]"
