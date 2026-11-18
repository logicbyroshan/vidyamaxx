from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import HasWorkDivisionAccess, resolve_user_tenant_context
from core.users.models import Membership
from .models import ResponsibilityAssignmentHistory, SecurityPolicy, StaffResponsibilityAssignment, WorkDivision
from .serializers import (
    CreateResponsibilitySerializer,
    ResponsibilityHistorySerializer,
    SecurityPolicySerializer,
    StaffResponsibilitySerializer,
)
from .services import assign_staff_responsibility, revoke_staff_responsibility, update_security_policy


class ResponsibilityListCreateView(APIView):
    """Manage scoped Staff work responsibilities (30 divisions)."""

    work_division = WorkDivision.SECURITY_AUDIT
    permission_classes = [HasWorkDivisionAccess]

    @extend_schema(responses={200: StaffResponsibilitySerializer(many=True)})
    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = StaffResponsibilityAssignment.objects.select_related("membership__user").for_school(request.school.id)
        membership_id = request.query_params.get("membership_id")
        if membership_id:
            qs = qs.filter(membership_id=membership_id)
        division = request.query_params.get("work_division")
        if division:
            qs = qs.filter(work_division=division)
        return Response({"success": True, "results": StaffResponsibilitySerializer(qs, many=True).data})

    @extend_schema(request=CreateResponsibilitySerializer, responses={201: StaffResponsibilitySerializer})
    def post(self, request):
        actor_membership = resolve_user_tenant_context(request, require_school=True)
        serializer = CreateResponsibilitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        target = get_object_or_404(Membership, id=d["membership_id"])
        assignment = assign_staff_responsibility(
            school=request.school,
            actor_membership=actor_membership,
            target_membership=target,
            work_division=d["work_division"],
            submodule_code=d.get("submodule_code", "*"),
            actions=d["actions"],
            branch_ids=d.get("branch_ids"),
            grade_class_ids=d.get("grade_class_ids"),
            section_ids=d.get("section_ids"),
            subject_ids=d.get("subject_ids"),
            student_ids=d.get("student_ids"),
            valid_from=d.get("valid_from"),
            valid_until=d.get("valid_until"),
            notes=d.get("notes", ""),
        )
        return Response(
            {"success": True, "assignment": StaffResponsibilitySerializer(assignment).data},
            status=status.HTTP_201_CREATED,
        )


class ResponsibilityRevokeView(APIView):
    work_division = WorkDivision.SECURITY_AUDIT
    required_action = "delete"
    permission_classes = [HasWorkDivisionAccess]
    serializer_class = StaffResponsibilitySerializer

    def delete(self, request, pk):
        actor_membership = resolve_user_tenant_context(request, require_school=True)
        assignment = get_object_or_404(StaffResponsibilityAssignment, id=pk, school=request.school)
        revoked = revoke_staff_responsibility(assignment=assignment, actor_membership=actor_membership)
        return Response({"success": True, "assignment": StaffResponsibilitySerializer(revoked).data})


class ResponsibilityHistoryView(APIView):
    work_division = WorkDivision.SECURITY_AUDIT
    permission_classes = [HasWorkDivisionAccess]
    serializer_class = ResponsibilityHistorySerializer

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        history = ResponsibilityAssignmentHistory.objects.filter(school_id=request.school.id)[:100]
        return Response({"success": True, "results": ResponsibilityHistorySerializer(history, many=True).data})


class SecurityPolicyView(APIView):
    work_division = WorkDivision.SECURITY_AUDIT
    permission_classes = [HasWorkDivisionAccess]
    serializer_class = SecurityPolicySerializer

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        policy, _ = SecurityPolicy.objects.get_or_create(school=request.school)
        return Response({"success": True, "policy": SecurityPolicySerializer(policy).data})

    def patch(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        policy, _ = SecurityPolicy.objects.get_or_create(school=request.school)
        serializer = SecurityPolicySerializer(policy, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = update_security_policy(
            school=request.school,
            actor_membership=membership,
            validated_data=serializer.validated_data,
        )
        return Response({"success": True, "policy": SecurityPolicySerializer(updated).data})
