from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import HasWorkDivisionAccess, IsAuthenticatedTenantMember, resolve_user_tenant_context
from core.permissions.models import WorkDivision
from .models import AcademicMilestone, AcademicSession, ClassSubjectMapping, GradeClass, Section, Subject
from .serializers import (
    AcademicMilestoneSerializer,
    AcademicSessionSerializer,
    ClassSubjectMappingSerializer,
    GradeClassSerializer,
    SectionSerializer,
    SubjectSerializer,
)
from .services import activate_academic_session, create_or_update_class_subject


class AcademicSessionListCreateView(APIView):
    work_division = WorkDivision.ACADEMICS
    serializer_class = AcademicSessionSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = AcademicSession.objects.for_school(request.school.id)
        payload = AcademicSessionSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = AcademicSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session = serializer.save(school=request.school, created_by_id=membership.user_id)
        if session.is_current:
            activate_academic_session(session=session, actor_membership=membership)
        payload = AcademicSessionSerializer(session).data
        return Response(
            {"success": True, "data": payload, "session": payload},
            status=status.HTTP_201_CREATED,
        )


class GradeClassListCreateView(APIView):
    work_division = WorkDivision.ACADEMICS
    serializer_class = GradeClassSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = GradeClass.objects.for_school(request.school.id).prefetch_related(
            "sections", "subject_mappings__subject"
        )
        payload = GradeClassSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = GradeClassSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        grade_class = serializer.save(school=request.school, created_by_id=membership.user_id)
        for sec_name in request.data.get("section_names", ["A", "B"]):
            Section.objects.get_or_create(
                school=request.school,
                grade_class=grade_class,
                name=sec_name,
                defaults={"code": f"{grade_class.numeric_grade}-{sec_name}"},
            )
        payload = GradeClassSerializer(grade_class).data
        return Response(
            {"success": True, "data": payload, "grade_class": payload},
            status=status.HTTP_201_CREATED,
        )


class GradeClassDetailView(APIView):
    work_division = WorkDivision.ACADEMICS
    serializer_class = GradeClassSerializer
    permission_classes = [HasWorkDivisionAccess]

    def patch(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        grade_class = get_object_or_404(GradeClass, id=pk, school=request.school)
        serializer = GradeClassSerializer(grade_class, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        grade_class = serializer.save(updated_by_id=membership.user_id)
        payload = GradeClassSerializer(grade_class).data
        return Response({"success": True, "data": payload, "grade_class": payload})


class ClassSubjectUpsertView(APIView):
    work_division = WorkDivision.ACADEMICS
    serializer_class = ClassSubjectMappingSerializer
    permission_classes = [HasWorkDivisionAccess]

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        class_id = request.data.get("grade_class_id")
        class_code = request.data.get("class_code")
        if class_id:
            grade_class = get_object_or_404(GradeClass, id=class_id, school=request.school)
        else:
            grade_class = get_object_or_404(GradeClass, code=class_code, school=request.school)

        subj_code = str(request.data.get("subject_code") or request.data.get("code") or "")
        subj_name = str(request.data.get("subject_name") or request.data.get("name") or "")
        tier = str(
            request.data.get("curriculum_tier")
            or request.data.get("type")
            or Subject.Tier.CORE_COMPULSORY
        )

        mapping = create_or_update_class_subject(
            school=request.school,
            actor_membership=membership,
            grade_class=grade_class,
            subject_code=subj_code,
            subject_name=subj_name,
            curriculum_tier=tier,
            weekly_periods=int(request.data.get("weekly_periods", 6)),
            theory_marks=int(request.data.get("theory_marks", 80)),
            internal_marks=int(request.data.get("internal_marks", 20)),
            teacher_in_charge=str(request.data.get("teacher_in_charge", "")),
            syllabus_chapters=int(request.data.get("syllabus_chapters", 12)),
            prescribed_book=request.data.get("prescribed_book_json") or {},
            status_val=str(request.data.get("status", "Active")),
        )
        payload = ClassSubjectMappingSerializer(mapping).data
        return Response(
            {"success": True, "data": payload, "mapping": payload},
            status=status.HTTP_200_OK,
        )


class AcademicMilestoneListCreateView(APIView):
    work_division = WorkDivision.ACADEMICS
    serializer_class = AcademicMilestoneSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = AcademicMilestone.objects.for_school(request.school.id).select_related("grade_class")
        class_code = request.query_params.get("class_code")
        if class_code:
            qs = qs.filter(grade_class__code=class_code)
        payload = AcademicMilestoneSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        data = dict(request.data)
        if "grade_class" not in data and "class_code" in data:
            gc = get_object_or_404(GradeClass, code=data["class_code"], school=request.school)
            data["grade_class"] = str(gc.id)
        serializer = AcademicMilestoneSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        milestone = serializer.save(school=request.school, created_by_id=membership.user_id)
        payload = AcademicMilestoneSerializer(milestone).data
        return Response(
            {"success": True, "data": payload, "milestone": payload},
            status=status.HTTP_201_CREATED,
        )
