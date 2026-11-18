from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import HasWorkDivisionAccess, IsAuthenticatedTenantMember, resolve_user_tenant_context
from core.permissions.models import WorkDivision
from .models import HomeworkAssignment, HomeworkSubmission


class HomeworkAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeworkAssignment
        fields = [
            "id",
            "assignment_code",
            "title",
            "description",
            "class_section_label",
            "subject_name",
            "teacher_name",
            "assigned_date",
            "due_date",
            "max_marks",
            "submission_type",
            "total_students",
            "submitted_count",
            "evaluated_count",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class HomeworkSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeworkSubmission
        fields = [
            "id",
            "assignment",
            "student",
            "admission_number",
            "student_name",
            "status",
            "marks_obtained",
            "grade_label",
            "teacher_feedback",
            "attachment_url",
            "created_at",
        ]
        read_only_fields = ["id", "assignment", "created_at"]


class HomeworkAssignmentListCreateView(APIView):
    work_division = WorkDivision.HOMEWORK
    serializer_class = HomeworkAssignmentSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = HomeworkAssignment.objects.for_school(request.school.id)
        class_sec = request.query_params.get("class_section")
        if class_sec:
            qs = qs.filter(class_section_label__iexact=class_sec)
        payload = HomeworkAssignmentSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = HomeworkAssignmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        hw = serializer.save(
            school=request.school,
            branch=getattr(request, "branch", None),
            created_by_id=membership.user_id,
        )
        payload = HomeworkAssignmentSerializer(hw).data
        return Response({"success": True, "data": payload, "assignment": payload}, status=status.HTTP_201_CREATED)


class HomeworkAssignmentDetailView(APIView):
    work_division = WorkDivision.HOMEWORK
    serializer_class = HomeworkAssignmentSerializer
    permission_classes = [HasWorkDivisionAccess]

    def patch(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        hw = get_object_or_404(HomeworkAssignment, id=pk, school=request.school)
        serializer = HomeworkAssignmentSerializer(hw, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        hw = serializer.save(updated_by_id=membership.user_id)
        payload = HomeworkAssignmentSerializer(hw).data
        return Response({"success": True, "data": payload, "assignment": payload})

    def delete(self, request, pk):
        resolve_user_tenant_context(request, require_school=True)
        hw = get_object_or_404(HomeworkAssignment, id=pk, school=request.school)
        hw.delete()
        return Response({"success": True, "data": {"id": str(pk), "deleted": True}})


class HomeworkSubmissionListCreateView(APIView):
    work_division = WorkDivision.HOMEWORK
    serializer_class = HomeworkSubmissionSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request, pk):
        resolve_user_tenant_context(request, require_school=True)
        hw = get_object_or_404(HomeworkAssignment, id=pk, school=request.school)
        qs = hw.submissions.all()
        payload = HomeworkSubmissionSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        hw = get_object_or_404(HomeworkAssignment, id=pk, school=request.school)
        adm_no = str(request.data.get("admission_number", "")).strip()
        sub, _ = HomeworkSubmission.objects.update_or_create(
            school=request.school,
            assignment=hw,
            admission_number=adm_no,
            defaults={
                "branch": getattr(request, "branch", None),
                "created_by_id": membership.user_id,
                "updated_by_id": membership.user_id,
                "student_name": request.data.get("student_name", adm_no),
                "status": request.data.get("status", HomeworkSubmission.Status.GRADED),
                "marks_obtained": request.data.get("marks_obtained"),
                "grade_label": request.data.get("grade_label", "A"),
                "teacher_feedback": request.data.get("teacher_feedback", ""),
            },
        )
        payload = HomeworkSubmissionSerializer(sub).data
        return Response({"success": True, "data": payload, "submission": payload}, status=status.HTTP_201_CREATED)
