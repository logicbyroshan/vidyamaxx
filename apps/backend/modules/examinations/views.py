from decimal import Decimal
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.exceptions import ConflictError
from common.permissions import HasWorkDivisionAccess, IsAuthenticatedTenantMember, resolve_user_tenant_context
from core.permissions.models import WorkDivision
from platform_services.audit.services import record_audit_event
from .models import ExaminationCycle, StudentExamMark


class ExaminationCycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExaminationCycle
        fields = [
            "id",
            "academic_session",
            "code",
            "name",
            "term_label",
            "start_date",
            "end_date",
            "weightage_pct",
            "is_marks_locked",
            "is_published",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class StudentExamMarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentExamMark
        fields = [
            "id",
            "examination",
            "student",
            "admission_number",
            "student_name",
            "class_section_label",
            "subject_code",
            "subject_name",
            "theory_marks",
            "max_theory_marks",
            "practical_marks",
            "max_practical_marks",
            "total_marks",
            "max_total_marks",
            "grade",
            "is_absent",
            "is_locked",
            "remarks",
            "created_at",
        ]
        read_only_fields = ["id", "total_marks", "created_at"]
        validators = []


class LockCycleSerializer(serializers.Serializer):
    locked = serializers.BooleanField(default=True)


class ExaminationCycleListCreateView(APIView):
    work_division = WorkDivision.EXAMINATIONS
    serializer_class = ExaminationCycleSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = ExaminationCycle.objects.for_school(request.school.id)
        payload = ExaminationCycleSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = ExaminationCycleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cycle = serializer.save(
            school=request.school,
            branch=getattr(request, "branch", None),
            created_by_id=membership.user_id,
        )
        payload = ExaminationCycleSerializer(cycle).data
        return Response({"success": True, "data": payload, "cycle": payload}, status=status.HTTP_201_CREATED)


class ExaminationCycleLockView(APIView):
    work_division = WorkDivision.EXAMINATIONS
    required_action = "approve"
    serializer_class = LockCycleSerializer
    permission_classes = [HasWorkDivisionAccess]

    @transaction.atomic
    def post(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        cycle = get_object_or_404(ExaminationCycle, id=pk, school=request.school)
        serializer = LockCycleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        locked = serializer.validated_data["locked"]
        cycle.is_marks_locked = locked
        cycle.updated_by_id = membership.user_id
        cycle.save(update_fields=["is_marks_locked", "updated_by_id", "updated_at"])

        record_audit_event(
            school_id=request.school.id,
            tenant_id=request.school.tenant_id,
            actor_user_id=membership.user_id,
            actor_name=membership.user.full_name,
            actor_role_label=membership.user_type,
            category="Academics",
            action="EXAM_MARKS_LOCKED" if locked else "EXAM_MARKS_UNLOCKED",
            target_type="ExaminationCycle",
            target_id=str(cycle.id),
            metadata={"code": cycle.code, "locked": locked},
        )
        payload = ExaminationCycleSerializer(cycle).data
        return Response({"success": True, "data": payload, "cycle": payload})


class StudentExamMarkListCreateView(APIView):
    work_division = WorkDivision.EXAMINATIONS
    serializer_class = StudentExamMarkSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = StudentExamMark.objects.for_school(request.school.id)
        exam_id = request.query_params.get("examination")
        if exam_id:
            qs = qs.filter(examination_id=exam_id)
        adm_no = request.query_params.get("admission_number")
        if adm_no:
            qs = qs.filter(admission_number=adm_no)
        payload = StudentExamMarkSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    @transaction.atomic
    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = StudentExamMarkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        exam: ExaminationCycle = d["examination"]
        if exam.school_id != request.school.id:
            raise ConflictError(message="Examination cycle belongs to another school.", code="CROSS_SCHOOL_FORBIDDEN")
        if exam.is_marks_locked:
            raise ConflictError(
                message=f"Marks entry for examination '{exam.name}' is locked.",
                code="MARKS_LOCKED",
            )

        existing = StudentExamMark.objects.filter(
            examination=exam,
            admission_number=d["admission_number"],
            subject_code=d["subject_code"],
        ).first()
        if existing and existing.is_locked:
            raise ConflictError(
                message="Individual student mark entry is locked.",
                code="MARKS_LOCKED",
            )

        th = Decimal(str(d.get("theory_marks", 0)))
        pr = Decimal(str(d.get("practical_marks", 0)))
        total = th + pr

        mark_obj, _ = StudentExamMark.objects.update_or_create(
            school=request.school,
            examination=exam,
            admission_number=d["admission_number"],
            subject_code=d["subject_code"],
            defaults={
                "branch": getattr(request, "branch", None),
                "created_by_id": membership.user_id,
                "updated_by_id": membership.user_id,
                "student_name": d["student_name"],
                "class_section_label": d.get("class_section_label", "10-A"),
                "subject_name": d["subject_name"],
                "theory_marks": th,
                "max_theory_marks": d.get("max_theory_marks", Decimal("80.00")),
                "practical_marks": pr,
                "max_practical_marks": d.get("max_practical_marks", Decimal("20.00")),
                "total_marks": total,
                "max_total_marks": d.get("max_total_marks", Decimal("100.00")),
                "grade": d.get("grade", "A1"),
                "is_absent": d.get("is_absent", False),
                "remarks": d.get("remarks", ""),
            },
        )
        payload = StudentExamMarkSerializer(mark_obj).data
        return Response({"success": True, "data": payload, "mark": payload}, status=status.HTTP_201_CREATED)
