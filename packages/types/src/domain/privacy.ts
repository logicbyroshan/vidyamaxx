/**
 * @vidyafloww/types - DPDP Act, 2023 & DPDP Rules, 2025 Domain Types
 * Digital Personal Data Protection Compliance Architecture
 */

export type DPDPRole = 'Data Fiduciary' | 'Data Processor' | 'Significant Data Fiduciary';

export type ConsentStatus = 'granted' | 'withdrawn' | 'pending' | 'expired';

export type ConsentPurposeId =
  | 'core_academics'
  | 'emergency_medical'
  | 'transport_telemetry'
  | 'biometric_access'
  | 'communication_broadcasts'
  | 'scholarships_aid';

export interface ConsentPurposeDefinition {
  id: ConsentPurposeId;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  dataCategories: string[];
  isEssential: boolean;
  lawfulBasis: 'consent' | 'legitimate_use' | 'statutory_obligation';
  retentionPeriod: string;
  thirdParties: string[];
}

export interface ConsentRecord {
  id: string;
  principalId: string;
  principalName: string;
  principalRole: 'Student' | 'Parent' | 'Teacher' | 'Staff';
  purposeId: ConsentPurposeId;
  status: ConsentStatus;
  noticeVersion: string;
  grantedAt: string;
  withdrawnAt?: string;
  revocationReason?: string;
  ipAddressMasked: string;
  userAgentSnippet: string;
  isParentalConsent: boolean;
  guardianPrincipalId?: string;
}

export interface VerifiableParentalConsent {
  id: string;
  studentId: string;
  studentName: string;
  studentDob: string;
  isMinor: boolean;
  guardianName: string;
  guardianRelationship: 'Father' | 'Mother' | 'Legal Guardian';
  guardianPhone: string;
  guardianEmail: string;
  verificationMethod: 'Aadhaar_OTP' | 'Digital_Sign' | 'Physical_Dossier' | 'Portal_Auth';
  verificationStatus: 'Verified' | 'Pending Verification' | 'Rejected';
  consentGrantedAt: string;
  tokenizedProofId: string;
  prohibitTrackingAffirmed: boolean;
  prohibitTargetedAdsAffirmed: boolean;
}

export type DataPrincipalRightType =
  | 'access_summary'
  | 'correction'
  | 'completion'
  | 'updating'
  | 'erasure'
  | 'nomination';

export type DSRStatus = 'Submitted' | 'Identity Verified' | 'Under Review' | 'Processing' | 'Completed' | 'Rejected';

export interface DataSubjectRequest {
  id: string;
  requestNumber: string;
  principalId: string;
  principalName: string;
  principalRole: 'Student' | 'Parent' | 'Teacher' | 'Staff';
  requesterContact: string;
  rightType: DataPrincipalRightType;
  description: string;
  targetFields?: string[];
  requestedChanges?: Record<string, string>;
  nomineeDetails?: {
    fullName: string;
    relationship: string;
    contactPhone: string;
    email: string;
  };
  status: DSRStatus;
  submittedAt: string;
  slaDeadline: string;
  completedAt?: string;
  assignedOfficer: string;
  resolutionNotes?: string;
  isStatutoryRetentionExempt?: boolean;
}

export type GrievanceCategory =
  | 'Consent Withdrawal Refusal'
  | 'Unauthorised Personal Data Processing'
  | 'Data Inaccuracy & Correction Delay'
  | 'Erasure Request Default'
  | 'Minor Data Safeguards'
  | 'Biometric / Telemetry Tracking Concern'
  | 'Security / Breach Concern';

export type GrievanceStatus = 'Open' | 'Under Investigation' | 'Remediation in Progress' | 'Resolved' | 'Escalated to Board';

export interface PrivacyGrievanceTicket {
  id: string;
  ticketNumber: string;
  complainantName: string;
  complainantRole: 'Parent' | 'Student' | 'Faculty' | 'Public';
  complainantEmail: string;
  complainantPhone: string;
  category: GrievanceCategory;
  subject: string;
  description: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  lodgedDate: string;
  statutorySlaDeadline: string; // Statutory limit max 90 days
  internalSlaTarget: string; // Institutional target <= 7 days
  assignedGrievanceOfficer: string;
  status: GrievanceStatus;
  resolutionSummary?: string;
  resolvedAt?: string;
  dpbiEscalationEligible: boolean;
}

export interface DataBreachIncident {
  id: string;
  incidentRef: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  categoriesAffected: string[];
  estimatedAffectedPrincipals: number;
  detectedAt: string;
  containedAt?: string;
  status: 'Detected' | 'Triaged' | 'Contained' | 'DPBI Notified' | 'Principals Notified' | 'Remediated';
  boardNotificationRequired: boolean;
  boardNotificationStatus: 'Not Required' | 'Pending Notice' | 'Notified';
  boardNotifiedAt?: string;
  principalNotificationStatus: 'Not Required' | 'Drafting' | 'Dispatched';
  containmentMeasures: string;
  remediationPlan: string;
}

export interface RetentionPolicyItem {
  id: string;
  dataCategory: string;
  applicableDataFields: string[];
  processingPurpose: string;
  statutoryBasis: string;
  retentionPeriod: string;
  deletionMethod: 'Cryptographic Shredding' | 'Hard Deletion' | 'Anonymisation' | 'Archival Vault';
  cbseStatutoryPreservation: boolean;
}

export interface ThirdPartyProcessorItem {
  id: string;
  serviceName: string;
  vendorName: string;
  role: 'Cloud Infrastructure' | 'SMS Gateway' | 'WhatsApp Gateway' | 'Payment Aggregator' | 'Biometric Hardware';
  personalDataTransferred: string[];
  purpose: string;
  dataHostingLocation: string; // Must be Indian sovereign data center where applicable
  isCrossBorderTransfer: boolean;
  dpaSigned: boolean;
  encryptionStandard: string;
}

export interface PrivacyMetricsOverview {
  totalPrincipalsProtected: number;
  activeConsentRecords: number;
  minorVpcComplianceRate: number; // e.g. 98.4%
  openDSRRequests: number;
  openGrievances: number;
  statutoryRetentionCompliance: number; // e.g. 100%
  sovereignDataResidency: '100% In-Region (India / Mumbai)' | string;
  dpoDesignated: boolean;
}
