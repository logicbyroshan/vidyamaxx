from django.db.models import F
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import HasWorkDivisionAccess, IsAuthenticatedTenantMember, resolve_user_tenant_context
from core.permissions.models import WorkDivision
from modules.communication.models import CircularBroadcast
from modules.medical.models import InfirmaryVisitLog
from modules.welfare.models import CounsellingRecord
from platform_services.audit.services import record_audit_event
from platform_services.forms.models import SurveyCampaign
from .models import GrievanceTicket


class InfirmaryVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfirmaryVisitLog
        fields = [
            "id",
            "admission_number",
            "student_name",
            "class_section_label",
            "visit_date",
            "symptoms",
            "treatment_given",
            "nurse_or_doctor_name",
            "parent_notified",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class CounsellingRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CounsellingRecord
        fields = [
            "id",
            "admission_number",
            "student_name",
            "counsellor_name",
            "session_date",
            "category",
            "confidential_notes",
            "follow_up_date",
            "is_strictly_confidential",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class CircularBroadcastSerializer(serializers.ModelSerializer):
    class Meta:
        model = CircularBroadcast
        fields = ["id", "circular_number", "title", "audience", "channel", "message_body", "status", "created_at"]
        read_only_fields = ["id", "created_at"]


class SurveyCampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyCampaign
        fields = [
            "id",
            "survey_code",
            "title",
            "target_audience",
            "category",
            "responses_count",
            "total_target",
            "satisfaction_score",
            "status",
            "end_date_label",
            "key_finding",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class GrievanceTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrievanceTicket
        fields = [
            "id",
            "ticket_number",
            "complainant_type",
            "complainant_name",
            "category",
            "subject",
            "description",
            "priority",
            "assigned_officer",
            "status",
            "resolution_notes",
            "expected_sla",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class InfirmaryVisitListCreateView(APIView):
    work_division = WorkDivision.STUDENT_HEALTH
    serializer_class = InfirmaryVisitSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = InfirmaryVisitLog.objects.for_school(request.school.id)
        payload = InfirmaryVisitSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = InfirmaryVisitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        visit = serializer.save(
            school=request.school,
            branch=getattr(request, "branch", None),
            created_by_id=membership.user_id,
        )
        payload = InfirmaryVisitSerializer(visit).data
        return Response({"success": True, "data": payload}, status=status.HTTP_201_CREATED)


class CounsellingRecordListCreateView(APIView):
    """
    Strictly enforces confidential RBAC on BOTH GET and POST:
    General STAFF without `counselling_support` responsibility cannot read confidential notes.
    """

    work_division = WorkDivision.COUNSELLING_SUPPORT
    serializer_class = CounsellingRecordSerializer
    permission_classes = [HasWorkDivisionAccess]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = CounsellingRecord.objects.for_school(request.school.id)
        payload = CounsellingRecordSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = CounsellingRecordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        rec = serializer.save(
            school=request.school,
            branch=getattr(request, "branch", None),
            created_by_id=membership.user_id,
        )
        record_audit_event(
            school_id=request.school.id,
            tenant_id=request.school.tenant_id,
            actor_user_id=membership.user_id,
            actor_name=membership.user.full_name,
            actor_role_label=membership.user_type,
            category="Security",
            action="CONFIDENTIAL_COUNSELLING_RECORD_CREATED",
            target_type="CounsellingRecord",
            target_id=str(rec.id),
            metadata={"admission_number": rec.admission_number},
        )
        payload = CounsellingRecordSerializer(rec).data
        return Response({"success": True, "data": payload}, status=status.HTTP_201_CREATED)


class CircularBroadcastListCreateView(APIView):
    work_division = WorkDivision.COMMUNICATION
    serializer_class = CircularBroadcastSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = CircularBroadcast.objects.for_school(request.school.id)
        payload = CircularBroadcastSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = CircularBroadcastSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        circ = serializer.save(
            school=request.school,
            branch=getattr(request, "branch", None),
            created_by_id=membership.user_id,
        )
        payload = CircularBroadcastSerializer(circ).data
        return Response({"success": True, "data": payload}, status=status.HTTP_201_CREATED)


class SurveyCampaignListCreateView(APIView):
    work_division = WorkDivision.SURVEYS_FORMS
    serializer_class = SurveyCampaignSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = SurveyCampaign.objects.for_school(request.school.id)
        payload = SurveyCampaignSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = SurveyCampaignSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        surv = serializer.save(
            school=request.school,
            branch=getattr(request, "branch", None),
            created_by_id=membership.user_id,
        )
        payload = SurveyCampaignSerializer(surv).data
        return Response({"success": True, "data": payload}, status=status.HTTP_201_CREATED)


class SurveyCampaignVoteView(APIView):
    work_division = WorkDivision.SURVEYS_FORMS
    serializer_class = SurveyCampaignSerializer
    permission_classes = [IsAuthenticatedTenantMember]

    def post(self, request, pk):
        resolve_user_tenant_context(request, require_school=True)
        surv = get_object_or_404(SurveyCampaign, id=pk, school=request.school)
        SurveyCampaign.objects.filter(id=surv.id).update(responses_count=F("responses_count") + 1)
        surv.refresh_from_db()
        payload = SurveyCampaignSerializer(surv).data
        return Response({"success": True, "data": payload})


class GrievanceTicketListCreateView(APIView):
    work_division = WorkDivision.COMPLAINTS_GRIEVANCES
    serializer_class = GrievanceTicketSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = GrievanceTicket.objects.for_school(request.school.id)
        status_param = request.query_params.get("status")
        if status_param:
            qs = qs.filter(status__iexact=status_param)
        payload = GrievanceTicketSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = GrievanceTicketSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tkt = serializer.save(
            school=request.school,
            branch=getattr(request, "branch", None),
            created_by_id=membership.user_id,
        )
        payload = GrievanceTicketSerializer(tkt).data
        return Response({"success": True, "data": payload}, status=status.HTTP_201_CREATED)


class GrievanceTicketDetailView(APIView):
    work_division = WorkDivision.COMPLAINTS_GRIEVANCES
    serializer_class = GrievanceTicketSerializer
    permission_classes = [HasWorkDivisionAccess]

    def patch(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        tkt = get_object_or_404(GrievanceTicket, id=pk, school=request.school)
        serializer = GrievanceTicketSerializer(tkt, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        tkt = serializer.save(updated_by_id=membership.user_id)
        payload = GrievanceTicketSerializer(tkt).data
        return Response({"success": True, "data": payload})
