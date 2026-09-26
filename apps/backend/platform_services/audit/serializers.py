"""
VidyaFloww — DPDP Compliance DRF Serializers
"""

from rest_framework import serializers
from .models import (
    ConsentAuditRecord,
    VerifiableParentalConsentRecord,
    DataSubjectRequestRecord,
    PrivacyGrievanceRecord,
    DataBreachIncidentRecord,
)


class ConsentAuditRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsentAuditRecord
        fields = '__all__'
        read_only_fields = ['id', 'granted_at']


class VerifiableParentalConsentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerifiableParentalConsentRecord
        fields = '__all__'
        read_only_fields = ['id', 'consent_granted_at', 'tokenized_proof_id']


class DataSubjectRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSubjectRequestRecord
        fields = '__all__'
        read_only_fields = ['id', 'submitted_at']


class PrivacyGrievanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacyGrievanceRecord
        fields = '__all__'
        read_only_fields = ['id', 'lodged_date']


class DataBreachIncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataBreachIncidentRecord
        fields = '__all__'
        read_only_fields = ['id', 'detected_at']
