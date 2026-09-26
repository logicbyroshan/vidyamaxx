/**
 * @vidyafloww/validation - DPDP Act, 2023 & DPDP Rules, 2025 Zod Schemas
 */

import { z } from 'zod';

export const ConsentSubmissionSchema = z.object({
  principalId: z.string().min(1, 'Principal identifier is required'),
  principalName: z.string().min(2, 'Full name is required'),
  principalRole: z.enum(['Student', 'Parent', 'Teacher', 'Staff']),
  purposeId: z.enum([
    'core_academics',
    'emergency_medical',
    'transport_telemetry',
    'biometric_access',
    'communication_broadcasts',
    'scholarships_aid',
  ]),
  status: z.enum(['granted', 'withdrawn', 'pending', 'expired']),
  noticeVersion: z.string().min(1, 'Notice version reference required'),
  isParentalConsent: z.boolean().default(false),
  guardianPrincipalId: z.string().optional(),
});

export const VerifiableParentalConsentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  studentName: z.string().min(2, 'Student legal name is required'),
  studentDob: z.string().min(8, 'Date of birth is required'),
  guardianName: z.string().min(2, 'Guardian full legal name is required'),
  guardianRelationship: z.enum(['Father', 'Mother', 'Legal Guardian']),
  guardianPhone: z.string().min(10, 'Valid 10-digit phone number is required'),
  guardianEmail: z.string().email('Valid guardian email address is required'),
  verificationMethod: z.enum(['Aadhaar_OTP', 'Digital_Sign', 'Physical_Dossier', 'Portal_Auth']),
  prohibitTrackingAffirmed: z.literal(true, {
    errorMap: () => ({ message: 'You must affirm prohibition of behavioral tracking for minors under Section 9.' }),
  }),
  prohibitTargetedAdsAffirmed: z.literal(true, {
    errorMap: () => ({ message: 'You must affirm prohibition of targeted advertising for minors under Section 9.' }),
  }),
});

export const DataSubjectRequestSchema = z.object({
  principalId: z.string().min(1, 'Principal identifier required'),
  principalName: z.string().min(2, 'Requester name required'),
  principalRole: z.enum(['Student', 'Parent', 'Teacher', 'Staff']),
  requesterContact: z.string().min(5, 'Valid email or phone number required'),
  rightType: z.enum([
    'access_summary',
    'correction',
    'completion',
    'updating',
    'erasure',
    'nomination',
  ]),
  description: z.string().min(10, 'Please provide a clear description of your data request (min 10 characters)'),
  targetFields: z.array(z.string()).optional(),
  requestedChanges: z.record(z.string()).optional(),
  nomineeDetails: z
    .object({
      fullName: z.string().min(2, 'Nominee full name is required'),
      relationship: z.string().min(2, 'Relationship is required'),
      contactPhone: z.string().min(10, 'Nominee phone is required'),
      email: z.string().email('Valid nominee email is required'),
    })
    .optional(),
});

export const PrivacyGrievanceSubmissionSchema = z.object({
  complainantName: z.string().min(2, 'Complainant full name is required'),
  complainantRole: z.enum(['Parent', 'Student', 'Faculty', 'Public']),
  complainantEmail: z.string().email('Valid contact email is required'),
  complainantPhone: z.string().min(10, 'Valid contact phone number is required'),
  category: z.enum([
    'Consent Withdrawal Refusal',
    'Unauthorised Personal Data Processing',
    'Data Inaccuracy & Correction Delay',
    'Erasure Request Default',
    'Minor Data Safeguards',
    'Biometric / Telemetry Tracking Concern',
    'Security / Breach Concern',
  ]),
  subject: z.string().min(5, 'Subject is required (min 5 characters)'),
  description: z.string().min(20, 'Detailed description of the grievance is required (min 20 characters)'),
  priority: z.enum(['Urgent', 'High', 'Medium', 'Low']).default('Medium'),
});
