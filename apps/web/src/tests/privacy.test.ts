import { describe, it, expect, beforeEach } from 'vitest';
import { useGlobalStore } from '../stores/globalStore';
import {
  maskAadhaar,
  maskPhoneNumber,
  maskEmail,
  isMinor,
  calculateAge,
  sanitizePersonalDataExport,
  generateComplianceAuditHash,
} from '@vidyafloww/utils';
import {
  DPDP_NOTICE_VERSION,
  INITIAL_VERIFIABLE_PARENTAL_CONSENTS,
  INITIAL_DATA_SUBJECT_REQUESTS,
  INITIAL_PRIVACY_GRIEVANCES,
  INITIAL_DATA_BREACH_LOGS,
} from '@vidyafloww/constants';

describe('DPDP Act, 2023 & DPDP Rules, 2025 Compliance Engine', () => {
  beforeEach(() => {
    // Reset or ensure baseline store state
    useGlobalStore.setState({
      parentalConsents: [...INITIAL_VERIFIABLE_PARENTAL_CONSENTS],
      dataSubjectRequests: [...INITIAL_DATA_SUBJECT_REQUESTS],
      privacyGrievances: [...INITIAL_PRIVACY_GRIEVANCES],
      dataBreaches: [...INITIAL_DATA_BREACH_LOGS],
    });
    useGlobalStore.getState().grantConsent('transport_telemetry');
  });

  describe('Section 6: Purpose Limitation, Consent & Instant Revocation', () => {
    it('should grant purpose-specific consent with valid notice version timestamp', () => {
      const state = useGlobalStore.getState();
      state.grantConsent('biometric_access');

      const updated = useGlobalStore.getState().consents.biometric_access;
      expect(updated.status).toBe('granted');
      expect(updated.noticeVersion).toBe(DPDP_NOTICE_VERSION);
      expect(updated.grantedAt).toBeDefined();
    });

    it('should support instant consent withdrawal with reason and audit timestamp', () => {
      const state = useGlobalStore.getState();
      const testReason = 'Parent requested opt-out of real-time GPS telemetry';
      state.withdrawConsent('transport_telemetry', testReason);

      const updated = useGlobalStore.getState().consents.transport_telemetry;
      expect(updated.status).toBe('withdrawn');
      expect(updated.revocationReason).toBe(testReason);
      expect(updated.withdrawnAt).toBeDefined();
    });
  });

  describe('Section 9: Child Personal Data & Verifiable Parental Consent (VPC)', () => {
    it('should correctly identify minors (< 18 years) under Indian DPDP law', () => {
      // 14 years old
      expect(isMinor('12-05-2012')).toBe(true);
      expect(calculateAge('12-05-2012')).toBe(14);

      // Adult (> 18 years)
      expect(isMinor('01-01-2000')).toBe(false);
      expect(calculateAge('01-01-2000')).toBeGreaterThanOrEqual(26);
    });

    it('should register and bind verifiable parental consent with zero-tracking affirmations', () => {
      const state = useGlobalStore.getState();
      const initialCount = state.parentalConsents.length;

      state.addVerifiableParentalConsent({
        studentId: 'STU-TEST-99',
        studentName: 'Kabir Verma',
        studentDob: '15-08-2012',
        isMinor: true,
        guardianName: 'Sunil Verma',
        guardianRelationship: 'Father',
        guardianPhone: '+91 98111 22334',
        guardianEmail: 'sunil.verma@example.com',
        verificationMethod: 'Aadhaar_OTP',
        verificationStatus: 'Verified',
        prohibitTrackingAffirmed: true,
        prohibitTargetedAdsAffirmed: true,
      });

      const updatedConsents = useGlobalStore.getState().parentalConsents;
      expect(updatedConsents.length).toBe(initialCount + 1);

      const record = updatedConsents[0];
      expect(record.studentName).toBe('Kabir Verma');
      expect(record.verificationStatus).toBe('Verified');
      expect(record.tokenizedProofId).toMatch(/^VPC-SIG-SHA256-/);
      expect(record.prohibitTrackingAffirmed).toBe(true);
      expect(record.prohibitTargetedAdsAffirmed).toBe(true);
    });
  });

  describe('Data Minimisation & Masking Safeguards', () => {
    it('should mask Indian Aadhaar numbers to XXXX-XXXX-1234 format', () => {
      expect(maskAadhaar('1234 5678 9012')).toBe('XXXX-XXXX-9012');
      expect(maskAadhaar('1234-5678-9012')).toBe('XXXX-XXXX-9012');
      expect(maskAadhaar('123456789012')).toBe('XXXX-XXXX-9012');
      expect(maskAadhaar(null)).toBe('XXXX-XXXX-XXXX');
      expect(maskAadhaar(undefined)).toBe('XXXX-XXXX-XXXX');
    });

    it('should mask phone numbers and email addresses for privacy-preserving display', () => {
      expect(maskPhoneNumber('+91 98101 23456')).toBe('+91 ***** **456');
      expect(maskEmail('rajesh.sharma@example.com')).toBe('r***a@example.com');
      expect(maskEmail('a@b.com')).toBe('a***@b.com');
    });

    it('should sanitize export payloads and strip credentials', () => {
      const rawStudent = {
        name: 'Aarav Sharma',
        aadhaarNo: '987654321098',
        phone: '+91 98101 23456',
        password: 'PlainTextSecret123',
        jwtToken: 'eyJhbGciOi...',
      };

      const sanitized = sanitizePersonalDataExport(rawStudent);
      expect(sanitized.aadhaarNo).toBe('XXXX-XXXX-1098');
      expect((sanitized as any).password).toBeUndefined();
      expect((sanitized as any).jwtToken).toBeUndefined();
    });

    it('should generate verifiable compliance audit hash seals', () => {
      const hash1 = generateComplianceAuditHash({ user: 'Dr. Sharma' });
      const hash2 = generateComplianceAuditHash({ user: 'Dr. Sharma' });
      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^DPDP-VERIFIED-SHA256-/);
    });
  });

  describe('Sections 11, 12, 14: Data Principal Rights (DSR) Workflows', () => {
    it('should submit DSR with 30-day statutory SLA and track status progression', () => {
      const state = useGlobalStore.getState();
      const initialCount = state.dataSubjectRequests.length;

      state.submitDataSubjectRequest({
        principalId: 'PAR-TEST-01',
        principalName: 'Meera Patel',
        principalRole: 'Parent',
        requesterContact: 'meera.p@example.com',
        rightType: 'access_summary',
        description: 'Electronic summary dossier request for ward Diya Patel',
      });

      const updatedRequests = useGlobalStore.getState().dataSubjectRequests;
      expect(updatedRequests.length).toBe(initialCount + 1);

      const newReq = updatedRequests[0];
      expect(newReq.status).toBe('Submitted');
      expect(newReq.slaDeadline).toContain('30-day statutory SLA');

      // Update to completed
      state.updateDSRStatus(newReq.id, 'Completed', 'Dispatched encrypted ZIP dossier archive');
      const completed = useGlobalStore.getState().dataSubjectRequests.find((d) => d.id === newReq.id);
      expect(completed?.status).toBe('Completed');
      expect(completed?.resolutionNotes).toBe('Dispatched encrypted ZIP dossier archive');
      expect(completed?.completedAt).toBeDefined();
    });
  });

  describe('Section 13: Privacy Grievance Redressal Mechanism', () => {
    it('should lodge grievance with max 90-day statutory SLA and support resolution', () => {
      const state = useGlobalStore.getState();
      const initialCount = state.privacyGrievances.length;

      state.submitPrivacyGrievance({
        complainantName: 'Kavita Sundaram',
        complainantRole: 'Parent',
        complainantEmail: 'kavita.s@example.com',
        complainantPhone: '+91 98200 11223',
        category: 'Biometric / Telemetry Tracking Concern',
        subject: 'Query on turnstile biometric templates',
        description: 'Requesting confirmation of local template storage and RFID card alternative.',
        priority: 'Medium',
      });

      const updatedGrievances = useGlobalStore.getState().privacyGrievances;
      expect(updatedGrievances.length).toBe(initialCount + 1);

      const ticket = updatedGrievances[0];
      expect(ticket.status).toBe('Open');
      expect(ticket.statutorySlaDeadline).toContain('90-day DPDP limit');
      expect(ticket.internalSlaTarget).toContain('7-day institutional SLA');

      // Resolve grievance
      state.resolvePrivacyGrievance(ticket.id, 'Issued passive RFID card as alternative; explained SHA-256 local storage.');
      const resolved = useGlobalStore.getState().privacyGrievances.find((g) => g.id === ticket.id);
      expect(resolved?.status).toBe('Resolved');
      expect(resolved?.resolvedAt).toBeDefined();
    });
  });

  describe('Section 8(6): Personal Data Breach Incident Handling', () => {
    it('should record breach incident and update containment status', () => {
      const state = useGlobalStore.getState();
      state.reportDataBreach({
        title: 'Perimeter Rate Limit Exceeded Drill',
        severity: 'Low',
        categoriesAffected: ['Gateway Header Telemetry'],
        estimatedAffectedPrincipals: 0,
        boardNotificationRequired: false,
        boardNotificationStatus: 'Not Required',
        principalNotificationStatus: 'Not Required',
        containmentMeasures: 'WAF rate limiting rule tightened.',
        remediationPlan: 'Automated alarm threshold lowered.',
      });

      const breaches = useGlobalStore.getState().dataBreaches;
      const latest = breaches[0];
      expect(latest.status).toBe('Detected');

      state.updateBreachStatus(latest.id, 'Remediated', 'Drill verified and completed.');
      const updated = useGlobalStore.getState().dataBreaches.find((b) => b.id === latest.id);
      expect(updated?.status).toBe('Remediated');
      expect(updated?.containedAt).toBeDefined();
    });
  });
});
