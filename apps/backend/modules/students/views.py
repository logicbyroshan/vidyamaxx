from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import HasWorkDivisionAccess, IsAuthenticatedTenantMember, resolve_user_tenant_context
from core.permissions.models import WorkDivision
from modules.academics.models import AcademicSession, GradeClass, Section
from .models import Student, StudentDossierFieldConfig, StudentLifecycleEvent
from .serializers import (
    LifecycleActionSerializer,
    PromoteStudentSerializer,
    StudentDossierFieldSerializer,
    StudentEnrollmentSerializer,
    StudentLifecycleEventSerializer,
    StudentSerializer,
)
from .services import (
    change_student_lifecycle_status,
    create_student_with_enrollment,
    promote_student_to_session,
)


class StudentListCreateView(APIView):
    work_division = WorkDivision.STUDENTS
    serializer_class = StudentSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = Student.objects.for_school(request.school.id)

        status_param = request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)
        class_sec = request.query_params.get("class_section")
        if class_sec:
            qs = qs.filter(class_section_label__iexact=class_sec)
        fee_status = request.query_params.get("fee_status")
        if fee_status:
            qs = qs.filter(fee_status__iexact=fee_status)
        search = request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(full_name__icontains=search)
                | Q(admission_number__icontains=search)
                | Q(guardian_phone__icontains=search)
                | Q(primary_guardian_name__icontains=search)
            )
        payload = StudentSerializer(qs[:200], many=True).data
        return Response({"success": True, "count": qs.count(), "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        data = dict(request.data)
        if "grade_class_id" in data and "current_grade_class" not in data:
            data["current_grade_class"] = data["grade_class_id"]
        if "section_id" in data and "current_section" not in data:
            data["current_section"] = data["section_id"]
        if "roll_number" in data and "current_roll_number" not in data:
            data["current_roll_number"] = data["roll_number"]
        serializer = StudentSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        student = create_student_with_enrollment(
            school=request.school,
            branch=getattr(request, "branch", None),
            actor_membership=membership,
            validated_data=serializer.validated_data,
        )
        payload = StudentSerializer(student).data
        return Response(
            {"success": True, "data": payload, "student": payload},
            status=status.HTTP_201_CREATED,
        )


class StudentDetailView(APIView):
    work_division = WorkDivision.STUDENTS
    serializer_class = StudentSerializer
    permission_classes = [HasWorkDivisionAccess]

    def get(self, request, pk):
        resolve_user_tenant_context(request, require_school=True)
        student = get_object_or_404(Student, id=pk, school=request.school)
        enrollments = student.enrollments.select_related("academic_session", "grade_class", "section").all()
        events = student.lifecycle_events.all()[:25]
        stu_data = StudentSerializer(student).data
        return Response(
            {
                "success": True,
                "data": stu_data,
                "student": stu_data,
                "enrollments": StudentEnrollmentSerializer(enrollments, many=True).data,
                "lifecycle_events": StudentLifecycleEventSerializer(events, many=True).data,
            }
        )

    def patch(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        student = get_object_or_404(Student, id=pk, school=request.school)
        serializer = StudentSerializer(student, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        student = serializer.save(updated_by_id=membership.user_id)
        payload = StudentSerializer(student).data
        return Response({"success": True, "data": payload, "student": payload})

    def delete(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        student = get_object_or_404(Student, id=pk, school=request.school)
        student.soft_delete(by_user_id=membership.user_id)
        return Response({"success": True, "data": {"id": str(pk), "deleted": True}}, status=status.HTTP_200_OK)


class StudentPromoteView(APIView):
    work_division = WorkDivision.STUDENTS
    serializer_class = PromoteStudentSerializer
    permission_classes = [HasWorkDivisionAccess]

    def post(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        student = get_object_or_404(Student, id=pk, school=request.school)
        serializer = PromoteStudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        target_session = get_object_or_404(AcademicSession, id=d["target_session_id"], school=request.school)
        target_class = get_object_or_404(GradeClass, id=d["target_grade_class_id"], school=request.school)
        target_sec = (
            get_object_or_404(Section, id=d["target_section_id"], school=request.school)
            if d.get("target_section_id")
            else None
        )

        enrollment = promote_student_to_session(
            student=student,
            target_session=target_session,
            target_grade_class=target_class,
            target_section=target_sec,
            new_roll_number=d.get("new_roll_number", ""),
            final_gpa=d.get("final_gpa"),
            final_attendance_pct=d.get("final_attendance_pct"),
            remarks=d.get("remarks", ""),
            actor_membership=membership,
        )
        enr_payload = StudentEnrollmentSerializer(enrollment).data
        return Response(
            {
                "success": True,
                "data": enr_payload,
                "student": StudentSerializer(student).data,
                "enrollment": enr_payload,
            },
            status=status.HTTP_200_OK,
        )


class StudentWithdrawView(APIView):
    work_division = WorkDivision.STUDENTS
    serializer_class = LifecycleActionSerializer
    permission_classes = [HasWorkDivisionAccess]

    def post(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        student = get_object_or_404(Student, id=pk, school=request.school)
        serializer = LifecycleActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        updated = change_student_lifecycle_status(
            student=student,
            new_status=Student.Status.WITHDRAWN,
            event_type=StudentLifecycleEvent.EventType.WITHDRAWN,
            reason=serializer.validated_data.get("reason", ""),
            actor_membership=membership,
        )
        return Response({"success": True, "student": StudentSerializer(updated).data})


class StudentReadmitView(APIView):
    work_division = WorkDivision.STUDENTS
    serializer_class = LifecycleActionSerializer
    permission_classes = [HasWorkDivisionAccess]

    def post(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        student = get_object_or_404(Student, id=pk, school=request.school)
        serializer = LifecycleActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        updated = change_student_lifecycle_status(
            student=student,
            new_status=Student.Status.ACTIVE,
            event_type=StudentLifecycleEvent.EventType.READMITTED,
            reason=serializer.validated_data.get("reason", ""),
            actor_membership=membership,
        )
        return Response({"success": True, "student": StudentSerializer(updated).data})


class StudentDossierFieldListCreateView(APIView):
    work_division = WorkDivision.STUDENTS
    serializer_class = StudentDossierFieldSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = StudentDossierFieldConfig.objects.for_school(request.school.id)
        return Response({"success": True, "results": StudentDossierFieldSerializer(qs, many=True).data})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = StudentDossierFieldSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        field_cfg = serializer.save(school=request.school, created_by_id=membership.user_id)
        return Response(
            {"success": True, "field": StudentDossierFieldSerializer(field_cfg).data},
            status=status.HTTP_201_CREATED,
        )
