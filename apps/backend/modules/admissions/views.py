from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import HasWorkDivisionAccess, IsAuthenticatedTenantMember, resolve_user_tenant_context
from core.permissions.models import WorkDivision
from modules.academics.models import Section
from .models import AdmissionApplication, AdmissionEnquiry
from .services import approve_admission_application, enroll_applicant_to_student


class AdmissionEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmissionEnquiry
        fields = [
            "id",
            "enquiry_number",
            "candidate_name",
            "applied_grade_label",
            "guardian_name",
            "phone",
            "email",
            "source",
            "status",
            "follow_up_notes",
            "next_follow_up_date",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class AdmissionApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmissionApplication
        fields = [
            "id",
            "application_number",
            "academic_session",
            "applied_class",
            "applied_grade_label",
            "candidate_name",
            "date_of_birth",
            "gender",
            "blood_group",
            "category_quota",
            "previous_school_name",
            "previous_score_pct",
            "primary_guardian_name",
            "primary_guardian_relation",
            "guardian_phone",
            "guardian_email",
            "guardian_occupation",
            "address",
            "city",
            "merit_score",
            "documents_verified",
            "stage",
            "enrolled_student",
            "decision_remarks",
            "decided_at",
            "created_at",
        ]
        read_only_fields = ["id", "enrolled_student", "decided_at", "created_at"]


class ApproveApplicationSerializer(serializers.Serializer):
    remarks = serializers.CharField(required=False, allow_blank=True, default="")


class EnrollApplicationSerializer(serializers.Serializer):
    admission_number = serializers.CharField(max_length=50)
    section_id = serializers.UUIDField(required=False, allow_null=True)
    roll_number = serializers.CharField(max_length=20, required=False, allow_blank=True, default="")
    house_name = serializers.CharField(max_length=60, required=False, default="Ashoka")


class AdmissionEnquiryListCreateView(APIView):
    work_division = WorkDivision.ADMISSIONS
    serializer_class = AdmissionEnquirySerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = AdmissionEnquiry.objects.for_school(request.school.id)
        return Response({"success": True, "results": AdmissionEnquirySerializer(qs, many=True).data})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = AdmissionEnquirySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        enquiry = serializer.save(school=request.school, created_by_id=membership.user_id)
        return Response(
            {"success": True, "enquiry": AdmissionEnquirySerializer(enquiry).data},
            status=status.HTTP_201_CREATED,
        )


class AdmissionApplicationListCreateView(APIView):
    work_division = WorkDivision.ADMISSIONS
    serializer_class = AdmissionApplicationSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = AdmissionApplication.objects.for_school(request.school.id)
        stage = request.query_params.get("stage")
        if stage:
            qs = qs.filter(stage=stage)
        search = request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(candidate_name__icontains=search)
                | Q(application_number__icontains=search)
                | Q(guardian_phone__icontains=search)
            )
        payload = AdmissionApplicationSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        data = dict(request.data)
        if "applied_class_id" in data and "applied_class" not in data:
            data["applied_class"] = data["applied_class_id"]
        serializer = AdmissionApplicationSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        app_obj = serializer.save(school=request.school, created_by_id=membership.user_id)
        payload = AdmissionApplicationSerializer(app_obj).data
        return Response(
            {"success": True, "data": payload, "application": payload},
            status=status.HTTP_201_CREATED,
        )


class AdmissionApproveView(APIView):
    work_division = WorkDivision.ADMISSIONS
    required_action = "approve"
    serializer_class = ApproveApplicationSerializer
    permission_classes = [HasWorkDivisionAccess]

    def post(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        app_obj = get_object_or_404(AdmissionApplication, id=pk, school=request.school)
        serializer = ApproveApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        approved = approve_admission_application(
            application=app_obj,
            actor_membership=membership,
            remarks=serializer.validated_data.get("remarks", ""),
        )
        payload = AdmissionApplicationSerializer(approved).data
        return Response({"success": True, "data": payload, "application": payload})


class AdmissionEnrollView(APIView):
    work_division = WorkDivision.ADMISSIONS
    required_action = "approve"
    serializer_class = EnrollApplicationSerializer
    permission_classes = [HasWorkDivisionAccess]

    def post(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        app_obj = get_object_or_404(AdmissionApplication, id=pk, school=request.school)
        serializer = EnrollApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        sec = (
            get_object_or_404(Section, id=d["section_id"], school=request.school)
            if d.get("section_id")
            else None
        )
        enrolled = enroll_applicant_to_student(
            application=app_obj,
            actor_membership=membership,
            admission_number=d["admission_number"],
            section=sec,
            roll_number=d.get("roll_number", ""),
            house_name=d.get("house_name", "Ashoka"),
        )
        app_payload = {
            **AdmissionApplicationSerializer(enrolled).data,
            "admission_number": d["admission_number"],
            "student_id": str(enrolled.enrolled_student_id),
        }
        return Response(
            {
                "success": True,
                "data": app_payload,
                "application": app_payload,
                "student_id": str(enrolled.enrolled_student_id),
            },
            status=status.HTTP_201_CREATED,
        )
