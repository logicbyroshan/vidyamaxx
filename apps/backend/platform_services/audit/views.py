"""
VidyaFloww — DPDP Compliance ViewSets & Privacy API Endpoints
"""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
import uuid

from .models import (
    ConsentAuditRecord,
    VerifiableParentalConsentRecord,
    DataSubjectRequestRecord,
    PrivacyGrievanceRecord,
    DataBreachIncidentRecord,
)
from .serializers import (
    ConsentAuditRecordSerializer,
    VerifiableParentalConsentSerializer,
    DataSubjectRequestSerializer,
    PrivacyGrievanceSerializer,
    DataBreachIncidentSerializer,
)


class ConsentAuditViewSet(viewsets.ModelViewSet):
    queryset = ConsentAuditRecord.objects.all()
    serializer_class = ConsentAuditRecordSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'], url_path='withdraw')
    def withdraw_consent(self, request):
        principal_id = request.data.get('principal_id')
        purpose_id = request.data.get('purpose_id')
        reason = request.data.get('revocation_reason', 'User initiated withdrawal')

        if not principal_id or not purpose_id:
            return Response(
                {'error': 'principal_id and purpose_id are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        record = ConsentAuditRecord.objects.create(
            principal_id=principal_id,
            principal_name=request.data.get('principal_name', 'Principal'),
            principal_role=request.data.get('principal_role', 'Student'),
            purpose_id=purpose_id,
            status='withdrawn',
            withdrawn_at=timezone.now(),
            revocation_reason=reason,
            ip_address_masked=request.META.get('REMOTE_ADDR', '127.0.0.1'),
        )
        return Response(ConsentAuditRecordSerializer(record).data, status=status.HTTP_201_CREATED)


class VerifiableParentalConsentViewSet(viewsets.ModelViewSet):
    queryset = VerifiableParentalConsentRecord.objects.all()
    serializer_class = VerifiableParentalConsentSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        proof_token = f"VPC-PROOF-SHA256-{uuid.uuid4().hex[:12].upper()}"
        serializer.save(tokenized_proof_id=proof_token)


class DataSubjectRequestViewSet(viewsets.ModelViewSet):
    queryset = DataSubjectRequestRecord.objects.all()
    serializer_class = DataSubjectRequestSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        req_num = f"DSR-REQ-{uuid.uuid4().hex[:6].upper()}"
        sla = timezone.now() + timedelta(days=30)
        serializer.save(request_number=req_num, sla_deadline=sla)


class PrivacyGrievanceViewSet(viewsets.ModelViewSet):
    queryset = PrivacyGrievanceRecord.objects.all()
    serializer_class = PrivacyGrievanceSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        ticket_num = f"GRV-DPDP-{uuid.uuid4().hex[:6].upper()}"
        statutory_sla = timezone.now() + timedelta(days=90)  # Max 90 days statutory ceiling
        internal_sla = timezone.now() + timedelta(days=7)    # 7 days institutional SLA
        serializer.save(
            ticket_number=ticket_num,
            statutory_sla_deadline=statutory_sla,
            internal_sla_target=internal_sla,
        )


class DataBreachIncidentViewSet(viewsets.ModelViewSet):
    queryset = DataBreachIncidentRecord.objects.all()
    serializer_class = DataBreachIncidentSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        inc_ref = f"INC-SEC-{uuid.uuid4().hex[:6].upper()}"
        serializer.save(incident_ref=inc_ref)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def dpdp_telemetry_overview(request):
    """
    Public / Authenticated DPDP Compliance Health & Telemetry Status.
    """
    return Response({
        'status': 'DPDP 2023 & DPDP Rules 2025 Active & Enforced',
        'sovereign_region': 'AWS Asia Pacific (Mumbai) ap-south-1',
        'total_active_consents': ConsentAuditRecord.objects.filter(status='granted').count(),
        'parental_consents_verified': VerifiableParentalConsentRecord.objects.filter(verification_status='Verified').count(),
        'open_dsr_requests': DataSubjectRequestRecord.objects.exclude(status='Completed').count(),
        'open_grievances': PrivacyGrievanceRecord.objects.exclude(status='Resolved').count(),
        'active_breaches': DataBreachIncidentRecord.objects.exclude(status='Remediated').count(),
        'dpo_contact': {
            'name': 'Adv. Ananya Deshmukh',
            'email': 'dpo@vidyafloww.com',
            'phone': '+91 11 4987 2300',
            'statutory_grievance_sla_days': 90,
            'internal_sla_days': 7,
            'dpbi_board_url': 'https://dpb.gov.in',
        },
    })
