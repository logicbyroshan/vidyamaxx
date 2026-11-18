from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import HasWorkDivisionAccess, IsAuthenticatedTenantMember, resolve_user_tenant_context
from core.permissions.models import WorkDivision
from .models import AttendanceCorrectionLog, LeaveApplication, StudentAttendanceRecord
from .services import decide_leave_application, mark_bulk_student_attendance


class StudentAttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAttendanceRecord
        fields = [
            "id",
            "student",
            "admission_number",
            "student_name",
            "roll_number",
            "class_section_label",
            "attendance_date",
            "status",
            "check_in_time",
            "remarks",
            "is_locked",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class BulkAttendanceEntrySerializer(serializers.Serializer):
    admission_number = serializers.CharField(max_length=50)
    student_name = serializers.CharField(max_length=150, required=False, allow_blank=True, default="")
    roll_number = serializers.CharField(max_length=20, required=False, allow_blank=True, default="")
    status = serializers.ChoiceField(choices=StudentAttendanceRecord.Status.choices)
    check_in_time = serializers.CharField(max_length=25, required=False, default="07:50 AM")
    remarks = serializers.CharField(max_length=255, required=False, allow_blank=True, default="")


class BulkAttendanceMarkSerializer(serializers.Serializer):
    attendance_date = serializers.DateField(default=timezone.localdate)
    class_section_label = serializers.CharField(max_length=40, default="10-A")
    correction_reason = serializers.CharField(max_length=255, required=False, default="Register update")
    entries = BulkAttendanceEntrySerializer(many=True)


class LeaveApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveApplication
        fields = [
            "id",
            "applicant_type",
            "applicant_code",
            "applicant_name",
            "class_or_dept",
            "leave_type",
            "from_date",
            "to_date",
            "days_count",
            "reason",
            "status",
            "decision_remarks",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class LeaveDecisionSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=[("Approved", "Approved"), ("Rejected", "Rejected")])
    remarks = serializers.CharField(required=False, allow_blank=True, default="")


class AttendanceRecordListView(APIView):
    work_division = WorkDivision.ATTENDANCE
    serializer_class = StudentAttendanceRecordSerializer
    permission_classes = [IsAuthenticatedTenantMember]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = StudentAttendanceRecord.objects.for_school(request.school.id)
        dt = request.query_params.get("date")
        if dt:
            qs = qs.filter(attendance_date=dt)
        class_sec = request.query_params.get("class_section")
        if class_sec:
            qs = qs.filter(class_section_label__iexact=class_sec)
        payload = StudentAttendanceRecordSerializer(qs[:300], many=True).data
        return Response({"success": True, "data": payload, "results": payload})


class AttendanceBulkMarkView(APIView):
    work_division = WorkDivision.ATTENDANCE
    serializer_class = BulkAttendanceMarkSerializer
    permission_classes = [HasWorkDivisionAccess]

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = BulkAttendanceMarkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        records = mark_bulk_student_attendance(
            school=request.school,
            branch=getattr(request, "branch", None),
            actor_membership=membership,
            attendance_date=d["attendance_date"],
            class_section_label=d["class_section_label"],
            entries=d["entries"],
            correction_reason=d.get("correction_reason", "Register update"),
        )
        payload = StudentAttendanceRecordSerializer(records, many=True).data
        return Response(
            {"success": True, "data": payload, "records": payload},
            status=status.HTTP_200_OK,
        )


class LeaveApplicationListCreateView(APIView):
    work_division = WorkDivision.ATTENDANCE
    serializer_class = LeaveApplicationSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = LeaveApplication.objects.for_school(request.school.id)
        payload = LeaveApplicationSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = LeaveApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        leave_app = serializer.save(
            school=request.school,
            branch=getattr(request, "branch", None),
            created_by_id=membership.user_id,
        )
        payload = LeaveApplicationSerializer(leave_app).data
        return Response(
            {"success": True, "data": payload, "leave": payload},
            status=status.HTTP_201_CREATED,
        )


class LeaveApplicationDecideView(APIView):
    work_division = WorkDivision.ATTENDANCE
    required_action = "approve"
    serializer_class = LeaveDecisionSerializer
    permission_classes = [HasWorkDivisionAccess]

    def post(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        leave_app = get_object_or_404(LeaveApplication, id=pk, school=request.school)
        serializer = LeaveDecisionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        updated = decide_leave_application(
            leave_app=leave_app,
            actor_membership=membership,
            decision=serializer.validated_data["status"],
            remarks=serializer.validated_data.get("remarks", ""),
        )
        payload = LeaveApplicationSerializer(updated).data
        return Response({"success": True, "data": payload, "leave": payload})
