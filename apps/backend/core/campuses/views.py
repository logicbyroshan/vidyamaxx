from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from common.permissions import HasWorkDivisionAccess, IsAuthenticatedTenantMember, resolve_user_tenant_context
from core.permissions.models import WorkDivision
from platform_services.audit.services import record_audit_event
from .models import Branch


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = [
            "id",
            "school_id",
            "code",
            "name",
            "city",
            "address",
            "board",
            "session_label",
            "principal_name",
            "is_primary",
            "status",
            "cover_url",
            "logo_url",
            "created_at",
        ]
        read_only_fields = ["id", "school_id", "created_at"]


class BranchListCreateView(APIView):
    work_division = WorkDivision.SCHOOL_ADMINISTRATION
    serializer_class = BranchSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        branches = Branch.objects.filter(school=request.school).order_by("-is_primary", "code")
        return Response({"success": True, "results": BranchSerializer(branches, many=True).data})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = BranchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        branch = serializer.save(school=request.school)
        record_audit_event(
            school_id=request.school.id,
            tenant_id=request.school.tenant_id,
            actor_user_id=membership.user_id,
            actor_name=membership.user.full_name,
            actor_role_label=membership.user_type,
            category="Settings",
            action="BRANCH_CREATED",
            target_type="Branch",
            target_id=str(branch.id),
            metadata={"code": branch.code, "name": branch.name},
        )
        return Response({"success": True, "branch": BranchSerializer(branch).data}, status=status.HTTP_201_CREATED)


class BranchDetailView(APIView):
    work_division = WorkDivision.SCHOOL_ADMINISTRATION
    serializer_class = BranchSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def patch(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        branch = get_object_or_404(Branch, id=pk, school=request.school)
        serializer = BranchSerializer(branch, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        branch = serializer.save()
        record_audit_event(
            school_id=request.school.id,
            tenant_id=request.school.tenant_id,
            actor_user_id=membership.user_id,
            category="Settings",
            action="BRANCH_UPDATED",
            target_type="Branch",
            target_id=str(branch.id),
        )
        return Response({"success": True, "branch": BranchSerializer(branch).data})

    def delete(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        branch = get_object_or_404(Branch, id=pk, school=request.school)
        if branch.is_primary:
            return Response(
                {"success": False, "code": "PRIMARY_BRANCH_LOCKED", "message": "Cannot delete the primary campus branch."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        branch_code = branch.code
        branch.delete()
        record_audit_event(
            school_id=request.school.id,
            tenant_id=request.school.tenant_id,
            actor_user_id=membership.user_id,
            actor_name=membership.user.full_name,
            actor_role_label=membership.user_type,
            category="Settings",
            action="BRANCH_DELETED",
            target_type="Branch",
            target_id=str(pk),
            metadata={"code": branch_code},
        )
        return Response({"success": True, "deleted": True, "id": str(pk)}, status=status.HTTP_200_OK)
