"""
VidyaFloww — DPDP Act, 2023 & DPDP Rules, 2025 Audit & Privacy Models
Digital Personal Data Protection Compliance Architecture
"""

from django.db import models
from django.utils import timezone
import uuid


class ConsentAuditRecord(models.Model):
    """
    Section 6 DPDP Act, 2023: Verifiable, itemised consent audit log.
    Stores immutable proof of consent grant and withdrawal.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    principal_id = models.CharField(max_length=64, db_index=True)
    principal_name = models.CharField(max_length=255)
    principal_role = models.CharField(
        max_length=32,
        choices=[
            ('Student', 'Student'),
            ('Parent', 'Parent'),
            ('Teacher', 'Teacher'),
            ('Staff', 'Staff'),
        ],
        default='Student',
    )
    purpose_id = models.CharField(
        max_length=64,
        choices=[
            ('core_academics', 'Core Academics & Enrolment'),
            ('emergency_medical', 'Emergency Medical Healthcare'),
            ('transport_telemetry', 'Live Transport & GPS Telemetry'),
            ('biometric_access', 'Turnstile Biometric & Smart Access'),
            ('communication_broadcasts', 'Communication Broadcasts & Alerts'),
            ('scholarships_aid', 'Scholarships & Financial Aid'),
        ],
    )
    status = models.CharField(
        max_length=16,
        choices=[
            ('granted', 'Granted'),
            ('withdrawn', 'Withdrawn'),
            ('pending', 'Pending'),
            ('expired', 'Expired'),
        ],
        default='granted',
    )
    notice_version = models.CharField(max_length=32, default='2026.1-DPDP')
    granted_at = models.DateTimeField(default=timezone.now)
    withdrawn_at = models.DateTimeField(null=True, blank=True)
    revocation_reason = models.TextField(blank=True, default='')
    ip_address_masked = models.CharField(max_length=64, default='127.0.0.1')
    user_agent_snippet = models.CharField(max_length=255, blank=True, default='')
    is_parental_consent = models.BooleanField(default=False)
    guardian_principal_id = models.CharField(max_length=64, blank=True, default='')

    class Meta:
        db_table = 'dpdp_consent_records'
        ordering = ['-granted_at']
        indexes = [
            models.Index(fields=['principal_id', 'purpose_id']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"Consent({self.principal_name} - {self.purpose_id} - {self.status})"


class VerifiableParentalConsentRecord(models.Model):
    """
    Section 9 DPDP Act, 2023: Processing of personal data of children.
    Mandatory verifiable consent from parent or lawful guardian.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_id = models.CharField(max_length=64, db_index=True)
    student_name = models.CharField(max_length=255)
    student_dob = models.CharField(max_length=32)
    is_minor = models.BooleanField(default=True)
    guardian_name = models.CharField(max_length=255)
    guardian_relationship = models.CharField(
        max_length=32,
        choices=[
            ('Father', 'Father'),
            ('Mother', 'Mother'),
            ('Legal Guardian', 'Legal Guardian'),
        ],
    )
    guardian_phone = models.CharField(max_length=32)
    guardian_email = models.EmailField()
    verification_method = models.CharField(
        max_length=32,
        choices=[
            ('Aadhaar_OTP', 'Aadhaar OTP (UIDAI Sandbox)'),
            ('Digital_Sign', 'Digital Signature Token'),
            ('Physical_Dossier', 'Physical Signed Admission Dossier'),
            ('Portal_Auth', 'Authenticated Parent Portal Session'),
        ],
        default='Portal_Auth',
    )
    verification_status = models.CharField(
        max_length=32,
        choices=[
            ('Verified', 'Verified'),
            ('Pending Verification', 'Pending Verification'),
            ('Rejected', 'Rejected'),
        ],
        default='Verified',
    )
    consent_granted_at = models.DateTimeField(default=timezone.now)
    tokenized_proof_id = models.CharField(max_length=128, unique=True)
    prohibit_tracking_affirmed = models.BooleanField(default=True)
    prohibit_targeted_ads_affirmed = models.BooleanField(default=True)

    class Meta:
        db_table = 'dpdp_parental_consents'
        ordering = ['-consent_granted_at']

    def __str__(self):
        return f"VPC({self.student_name} by {self.guardian_name} - {self.verification_status})"


class DataSubjectRequestRecord(models.Model):
    """
    Sections 11, 12, 14 DPDP Act, 2023:
    Right to Access, Correction, Completion, Updating, Erasure, and Nomination.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request_number = models.CharField(max_length=32, unique=True, db_index=True)
    principal_id = models.CharField(max_length=64, db_index=True)
    principal_name = models.CharField(max_length=255)
    principal_role = models.CharField(max_length=32, default='Student')
    requester_contact = models.CharField(max_length=255)
    right_type = models.CharField(
        max_length=32,
        choices=[
            ('access_summary', 'Right to Access Summary'),
            ('correction', 'Right to Correction'),
            ('completion', 'Right to Completion'),
            ('updating', 'Right to Updating'),
            ('erasure', 'Right to Erasure'),
            ('nomination', 'Right to Nominate'),
        ],
    )
    description = models.TextField()
    target_fields = models.JSONField(default=list, blank=True)
    requested_changes = models.JSONField(default=dict, blank=True)
    nominee_details = models.JSONField(default=dict, blank=True)
    status = models.CharField(
        max_length=32,
        choices=[
            ('Submitted', 'Submitted'),
            ('Identity Verified', 'Identity Verified'),
            ('Under Review', 'Under Review'),
            ('Processing', 'Processing'),
            ('Completed', 'Completed'),
            ('Rejected', 'Rejected'),
        ],
        default='Submitted',
    )
    submitted_at = models.DateTimeField(default=timezone.now)
    sla_deadline = models.DateTimeField()
    completed_at = models.DateTimeField(null=True, blank=True)
    assigned_officer = models.CharField(max_length=255, default='Data Protection Officer')
    resolution_notes = models.TextField(blank=True, default='')
    is_statutory_retention_exempt = models.BooleanField(default=False)

    class Meta:
        db_table = 'dpdp_subject_requests'
        ordering = ['-submitted_at']

    def __str__(self):
        return f"DSR({self.request_number} - {self.right_type} - {self.status})"


class PrivacyGrievanceRecord(models.Model):
    """
    Section 13 DPDP Act, 2023 & DPDP Rules, 2025:
    Grievance redressal mechanism. Statutory resolution limit <= 90 days.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket_number = models.CharField(max_length=32, unique=True, db_index=True)
    complainant_name = models.CharField(max_length=255)
    complainant_role = models.CharField(max_length=32, default='Parent')
    complainant_email = models.EmailField()
    complainant_phone = models.CharField(max_length=32)
    category = models.CharField(
        max_length=64,
        choices=[
            ('Consent Withdrawal Refusal', 'Consent Withdrawal Refusal'),
            ('Unauthorised Personal Data Processing', 'Unauthorised Personal Data Processing'),
            ('Data Inaccuracy & Correction Delay', 'Data Inaccuracy & Correction Delay'),
            ('Erasure Request Default', 'Erasure Request Default'),
            ('Minor Data Safeguards', 'Minor Data Safeguards'),
            ('Biometric / Telemetry Tracking Concern', 'Biometric / Telemetry Tracking Concern'),
            ('Security / Breach Concern', 'Security / Breach Concern'),
        ],
    )
    subject = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.CharField(
        max_length=16,
        choices=[
            ('Urgent', 'Urgent'),
            ('High', 'High'),
            ('Medium', 'Medium'),
            ('Low', 'Low'),
        ],
        default='Medium',
    )
    lodged_date = models.DateTimeField(default=timezone.now)
    statutory_sla_deadline = models.DateTimeField()
    internal_sla_target = models.DateTimeField()
    assigned_officer = models.CharField(max_length=255, default='Adv. Ananya Deshmukh (DPO)')
    status = models.CharField(
        max_length=32,
        choices=[
            ('Open', 'Open'),
            ('Under Investigation', 'Under Investigation'),
            ('Remediation in Progress', 'Remediation in Progress'),
            ('Resolved', 'Resolved'),
            ('Escalated to Board', 'Escalated to Board'),
        ],
        default='Open',
    )
    resolution_summary = models.TextField(blank=True, default='')
    resolved_at = models.DateTimeField(null=True, blank=True)
    dpbi_escalation_eligible = models.BooleanField(default=False)

    class Meta:
        db_table = 'dpdp_privacy_grievances'
        ordering = ['-lodged_date']

    def __str__(self):
        return f"Grievance({self.ticket_number} - {self.subject[:30]} - {self.status})"


class DataBreachIncidentRecord(models.Model):
    """
    Section 8(6) DPDP Act, 2023 & DPDP Rules, 2025:
    Mandatory reporting of personal data breaches to DPBI and affected Data Principals.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident_ref = models.CharField(max_length=32, unique=True, db_index=True)
    title = models.CharField(max_length=255)
    severity = models.CharField(
        max_length=16,
        choices=[
            ('Critical', 'Critical'),
            ('High', 'High'),
            ('Medium', 'Medium'),
            ('Low', 'Low'),
        ],
        default='Low',
    )
    categories_affected = models.JSONField(default=list)
    affected_principals_count = models.PositiveIntegerField(default=0)
    detected_at = models.DateTimeField(default=timezone.now)
    contained_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=32,
        choices=[
            ('Detected', 'Detected'),
            ('Triaged', 'Triaged'),
            ('Contained', 'Contained'),
            ('DPBI Notified', 'DPBI Notified'),
            ('Principals Notified', 'Principals Notified'),
            ('Remediated', 'Remediated'),
        ],
        default='Detected',
    )
    board_notification_required = models.BooleanField(default=False)
    board_notification_status = models.CharField(max_length=32, default='Not Required')
    board_notified_at = models.DateTimeField(null=True, blank=True)
    principal_notification_status = models.CharField(max_length=32, default='Not Required')
    containment_measures = models.TextField(blank=True, default='')
    remediation_plan = models.TextField(blank=True, default='')

    class Meta:
        db_table = 'dpdp_breach_incidents'
        ordering = ['-detected_at']

    def __str__(self):
        return f"Breach({self.incident_ref} - {self.severity} - {self.status})"
