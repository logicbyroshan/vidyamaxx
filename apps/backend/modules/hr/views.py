from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import HasWorkDivisionAccess, IsAuthenticatedTenantMember, resolve_user_tenant_context
from core.permissions.models import WorkDivision
from .models import StaffDossierFieldConfig, StaffProfile
from .services import create_staff_member


class StaffProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffProfile
        fields = [
            "id",
            "user_id",
            "membership_id",
            "employee_code",
            "full_name",
            "avatar_url",
            "designation_title",
            "department_name",
            "primary_subject",
            "secondary_subject",
            "qualification",
            "experience_years",
            "joining_date",
            "phone",
            "email",
            "class_mentor_label",
            "room_number",
            "weekly_periods_load",
            "max_weekly_periods",
            "employment_status",
            "base_salary_inr",
            "bank_account_masked",
            "assigned_classes_json",
            "custom_fields_json",
            "created_at",
        ]
        read_only_fields = ["id", "user_id", "membership_id", "created_at"]


class StaffDossierFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffDossierFieldConfig
        fields = ["id", "field_key", "label", "category", "field_type", "is_visible", "is_custom"]
        read_only_fields = ["id"]


class StaffListCreateView(APIView):
    work_division = WorkDivision.STAFF_HR
    serializer_class = StaffProfileSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = StaffProfile.objects.for_school(request.school.id)
        dept = request.query_params.get("department")
        if dept:
            qs = qs.filter(department_name__iexact=dept)
        search = request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(full_name__icontains=search)
                | Q(employee_code__icontains=search)
                | Q(primary_subject__icontains=search)
            )
        payload = StaffProfileSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = StaffProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        staff = create_staff_member(
            school=request.school,
            branch=getattr(request, "branch", None),
            actor_membership=membership,
            validated_data=serializer.validated_data,
        )
        payload = StaffProfileSerializer(staff).data
        return Response(
            {"success": True, "data": payload, "staff": payload},
            status=status.HTTP_201_CREATED,
        )


class StaffDetailView(APIView):
    work_division = WorkDivision.STAFF_HR
    serializer_class = StaffProfileSerializer
    permission_classes = [HasWorkDivisionAccess]

    def get(self, request, pk):
        resolve_user_tenant_context(request, require_school=True)
        staff = get_object_or_404(StaffProfile, id=pk, school=request.school)
        payload = StaffProfileSerializer(staff).data
        return Response({"success": True, "data": payload, "staff": payload})

    def patch(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        staff = get_object_or_404(StaffProfile, id=pk, school=request.school)
        serializer = StaffProfileSerializer(staff, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        staff = serializer.save(updated_by_id=membership.user_id)
        payload = StaffProfileSerializer(staff).data
        return Response({"success": True, "data": payload, "staff": payload})

    def delete(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        staff = get_object_or_404(StaffProfile, id=pk, school=request.school)
        staff.soft_delete(by_user_id=membership.user_id)
        return Response({"success": True, "data": {"id": str(pk), "deleted": True}}, status=status.HTTP_200_OK)


class StaffDossierFieldListCreateView(APIView):
    work_division = WorkDivision.STAFF_HR
    serializer_class = StaffDossierFieldSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = StaffDossierFieldConfig.objects.for_school(request.school.id)
        payload = StaffDossierFieldSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = StaffDossierFieldSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        field_cfg = serializer.save(school=request.school, created_by_id=membership.user_id)
        payload = StaffDossierFieldSerializer(field_cfg).data
        return Response(
            {"success": True, "data": payload, "field": payload},
            status=status.HTTP_201_CREATED,
        )
