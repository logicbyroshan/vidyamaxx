import * as React from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import JSZip from 'jszip';
import {
  VFPageContainer,
  VFBadge,
  VFButton,
  VFDataTable,
  VFDrawer,
  VFDialog,
  VFSelect,
  cn,
} from '@vidyamaxx/ui';
import {
  UserCheck,
  Eye,
  Plus,
  Download,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Printer,
  MessageSquare,
  Edit3,
  FileSpreadsheet,
  Archive,
  CheckCircle2,
  Loader2,
  Settings,
  Send,
  Award,
  FileCheck,
  Check,
  Copy,
  Receipt,
  GraduationCap,
  Users,
  Image as ImageIcon,
  CreditCard,
  Trash2,
  Camera,
  QrCode,
  CheckCheck,
  TrendingUp,
  BookOpen,
  Quote,
  ShieldCheck,
  Clock,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export interface DossierFieldConfig {
  key: string;
  label: string;
  category: 'personal' | 'family' | 'operations';
  placeholder?: string;
  isCustom?: boolean;
  isVisible: boolean;
  type?: 'text' | 'tel' | 'email' | 'date';
}

const defaultDossierFields: DossierFieldConfig[] = [
  // Personal & Bio Identity
  { key: 'name', label: 'Student Full Legal Name', category: 'personal', isVisible: true, isCustom: false },
  { key: 'admNo', label: 'Admission Number', category: 'personal', isVisible: true, isCustom: false },
  { key: 'roll', label: 'Roll Number', category: 'personal', isVisible: true, isCustom: false },
  { key: 'classSection', label: 'Class & Section', category: 'personal', isVisible: true, isCustom: false },
  { key: 'house', label: 'House Squad', category: 'personal', isVisible: true, isCustom: false },
  { key: 'bloodGroup', label: 'Blood Group', category: 'personal', isVisible: true, isCustom: false },
  { key: 'dob', label: 'Date of Birth', category: 'personal', isVisible: true, isCustom: false },
  { key: 'aadhaarNo', label: 'Aadhaar / National ID No', category: 'personal', isVisible: true, isCustom: true },
  { key: 'category', label: 'Category / Quota', category: 'personal', isVisible: true, isCustom: true },

  // Family & Emergency Contacts
  { key: 'guardian', label: 'Father / Primary Guardian Name', category: 'family', isVisible: true, isCustom: false },
  { key: 'motherName', label: "Mother's Full Legal Name", category: 'family', isVisible: true, isCustom: false },
  { key: 'phone', label: 'Primary Emergency Contact Number', category: 'family', isVisible: true, isCustom: false },
  { key: 'email', label: 'Institutional Email Address', category: 'family', isVisible: true, isCustom: false },
  { key: 'address', label: 'Residential Home Address', category: 'family', isVisible: true, isCustom: false },
  { key: 'guardianOccupation', label: 'Guardian Occupation / Work', category: 'family', isVisible: true, isCustom: true },

  // Operations, Transport & Health
  { key: 'classTeacher', label: 'Assigned Class Teacher', category: 'operations', isVisible: true, isCustom: false },
  { key: 'transport', label: 'Commute / Transport Route', category: 'operations', isVisible: true, isCustom: false },
  { key: 'feeStatus', label: 'Fee Clearance Status', category: 'operations', isVisible: true, isCustom: false },
  { key: 'medical', label: 'Medical Remarks & Health Notes', category: 'operations', isVisible: true, isCustom: false },
  { key: 'busStop', label: 'Designated Bus Stop & Time', category: 'operations', isVisible: true, isCustom: true },
];

// Active scholarship grants lookup by admission number
export const ACTIVE_STUDENT_SCHOLARSHIPS: Record<string, {
  schemeName: string;
  category: string;
  waiverPercentage: number;
  waiverAmount: number;
  fundingAgency: string;
  disbursalMode: string;
  sanctionRef: string;
  sanctionDate: string;
  status: string;
  notes: string;
}> = {
  'ADM-2026-001': {
    schemeName: 'National Means-cum-Merit Scholarship (NSP Scheme)',
    category: 'Govt RTE / NSP',
    waiverPercentage: 50,
    waiverAmount: 21000,
    fundingAgency: 'Ministry of Education (Govt. of India)',
    disbursalMode: 'Direct Govt DBT Credit',
    sanctionRef: 'NSP-2026-HR-991823',
    sanctionDate: '15 Apr 2026',
    status: 'Active Disbursed',
    notes: 'Govt central portal DBT scholarship reimbursed directly to institution nodal account.',
  },
  'ADM-2026-002': {
    schemeName: 'Institutional Academic Board Merit Excellence (100% Free-ship)',
    category: 'Academic Merit',
    waiverPercentage: 100,
    waiverAmount: 42000,
    fundingAgency: 'VidyaMaxx Education Foundation Endowment',
    disbursalMode: 'School Trust Endowment',
    sanctionRef: 'VFEF-MERIT-2026-01',
    sanctionDate: '01 Apr 2026',
    status: 'Active Disbursed',
    notes: 'Awarded for scoring 99.4% in CBSE Class 8 State Examinations. 100% tuition waived.',
  },
};

export const AVAILABLE_SCHOLARSHIP_SCHEMES = [
  {
    id: 'merit-100',
    name: 'Academic Board Merit Excellence Grant',
    category: 'Academic Merit',
    benefit: '100% Tuition Waiver (₹42,000 / AY)',
    fundingAgency: 'VidyaMaxx Foundation Trust',
    eligibilityCriteria: 'CBSE / State aggregate >= 95% or GPA >= 3.90',
    checkEligibility: (student: any) => {
      const gpa = parseFloat(student?.gpa || '0');
      if (gpa >= 3.90) {
        return { isEligible: true, statusText: 'Eligible to Apply', reason: `Qualified with GPA ${student?.gpa || '3.90'} (>= 3.90 threshold)` };
      }
      return { isEligible: false, statusText: 'Not Eligible', reason: `Requires >= 95% aggregate or 3.90+ GPA (Student GPA: ${student?.gpa || 'N/A'})` };
    },
  },
  {
    id: 'nsp-govt',
    name: 'National Means-cum-Merit Scholarship (Govt. NSP)',
    category: 'Govt RTE / NSP',
    benefit: '50% Tuition Waiver (₹21,000 / AY)',
    fundingAgency: 'Ministry of Education (Govt. of India)',
    eligibilityCriteria: 'Family annual income < ₹2.5 LPA + State Domicile',
    checkEligibility: (_student: any) => {
      return { isEligible: true, statusText: 'Eligible to Apply', reason: 'Open for all income-eligible students with domicile proof' };
    },
  },
  {
    id: 'sports-talent',
    name: 'National & State Sports Talent Concession',
    category: 'Sports Talent',
    benefit: '75% Tuition Waiver (₹36,000 / AY)',
    fundingAgency: 'Sports Authority of India (SAI) & CSR Grant',
    eligibilityCriteria: 'State / National sports tournament medal certificate',
    checkEligibility: (student: any) => {
      if (student?.house === 'Red House' && (student?.name?.includes('Kavya') || student?.name?.includes('Ishaan'))) {
        return { isEligible: true, statusText: 'Eligible to Apply', reason: 'State athletics championship certificate on file' };
      }
      return { isEligible: false, statusText: 'Not Eligible', reason: 'No state-level sports participation certificate on student record' };
    },
  },
  {
    id: 'sibling-relief',
    name: 'Sibling & Staff Ward Fee Concession',
    category: 'Sibling / Staff',
    benefit: '25% Tuition Waiver (₹10,500 / AY)',
    fundingAgency: 'Institutional Welfare Quota',
    eligibilityCriteria: 'Real brother/sister actively enrolled in current session',
    checkEligibility: (_student: any) => {
      return { isEligible: true, isPendingCheck: true, statusText: 'Verification Pending', reason: 'Submit sibling admission number for enrollment matching' };
    },
  },
  {
    id: 'ews-aid',
    name: 'EWS & Disadvantaged Group Financial Aid',
    category: 'EWS Aid',
    benefit: '50% Tuition Waiver (₹21,000 / AY)',
    fundingAgency: 'State Directorate of Education',
    eligibilityCriteria: 'Govt issued BPL / EWS Certificate with income proof',
    checkEligibility: (_student: any) => {
      return { isEligible: true, statusText: 'Eligible to Apply', reason: 'Open with valid Tehsildar EWS / BPL certificate' };
    },
  },
];

export const STUDENT_COMPLIANCE_DOCUMENTS = [
  { id: 'doc-income', name: 'Parent Income Certificate (Revenue Dept)', docType: 'Mandatory for Govt Grants', defaultStatus: 'Verified', date: '10 Apr 2026' },
  { id: 'doc-marksheet', name: 'Previous Year Official CBSE Marksheet', docType: 'Academic Verification', defaultStatus: 'Verified', date: '12 May 2026' },
  { id: 'doc-aadhaar', name: 'Student & Guardian Aadhaar Identity Proof', docType: 'Identity KYC', defaultStatus: 'Verified', date: '14 May 2026' },
  { id: 'doc-domicile', name: 'State Domicile / Residence Certificate', docType: 'Regional Verification', defaultStatus: 'Pending Verification', date: 'Submitted' },
  { id: 'doc-ews', name: 'EWS / BPL Category Certificate', docType: 'Category Proof', defaultStatus: 'Not Submitted', date: '—' },
  { id: 'doc-sports', name: 'State / National Sports Tournament Certificate', docType: 'Special Quota', defaultStatus: 'Not Submitted', date: '—' },
];

export interface StudentFeeLedgerItem {
  paymentPlan: 'Annual Full Upfront' | 'Monthly Installments';
  installmentDueDay: number;
  nextDueDate: string;
  baseTuition: number;
  labTechFee: number;
  transportFee: number;
  libraryFee: number;
  grossFee: number;
  scholarshipRelief: number;
  netAssessedFee: number;
  paidAmount: number;
  dueAmount: number;
  status: 'Cleared' | 'Pending' | 'Overdue';
  monthlyFee: number;
  monthsPaidCount: number;
  totalMonthsCount: number;
  installments: Array<{
    month: string;
    amount: number;
    dueDate: string;
    isPaid: boolean;
    receiptNo?: string;
    paidDate?: string;
  }>;
  recentReceipts: Array<{
    receiptNo: string;
    period: string;
    date: string;
    mode: string;
    amount: number;
    cashier: string;
  }>;
}

export const STUDENT_FEES_MAP: Record<string, StudentFeeLedgerItem> = {
  'ADM-2026-001': {
    paymentPlan: 'Annual Full Upfront',
    installmentDueDay: 10,
    nextDueDate: 'Annual Cleared (AY 2026–2027)',
    baseTuition: 42000,
    labTechFee: 5000,
    transportFee: 4500,
    libraryFee: 2500,
    grossFee: 54000,
    scholarshipRelief: 21000,
    netAssessedFee: 33000,
    paidAmount: 33000,
    dueAmount: 0,
    status: 'Cleared',
    monthlyFee: 2750,
    monthsPaidCount: 12,
    totalMonthsCount: 12,
    installments: [
      { month: 'Apr 2026', amount: 2750, dueDate: '10 Apr 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { month: 'May 2026', amount: 2750, dueDate: '10 May 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { month: 'Jun 2026', amount: 2750, dueDate: '10 Jun 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { month: 'Jul 2026', amount: 2750, dueDate: '10 Jul 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { month: 'Aug 2026', amount: 2750, dueDate: '10 Aug 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { month: 'Sep 2026', amount: 2750, dueDate: '10 Sep 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { month: 'Oct 2026', amount: 2750, dueDate: '10 Oct 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { month: 'Nov 2026', amount: 2750, dueDate: '10 Nov 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { month: 'Dec 2026', amount: 2750, dueDate: '10 Dec 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { month: 'Jan 2027', amount: 2750, dueDate: '10 Jan 2027', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { month: 'Feb 2027', amount: 2750, dueDate: '10 Feb 2027', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { month: 'Mar 2027', amount: 2750, dueDate: '10 Mar 2027', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
    ],
    recentReceipts: [
      { receiptNo: 'REC-2026-8801', period: 'Full AY 2026–2027 (Annual Full)', date: '10 Jul 2026, 11:30 AM', mode: 'UPI / QR Code (Verified)', amount: 33000, cashier: 'Mr. Arvind Gupta' },
    ],
  },
  'ADM-2026-002': {
    paymentPlan: 'Monthly Installments',
    installmentDueDay: 10,
    nextDueDate: '10 Oct 2026',
    baseTuition: 42000,
    labTechFee: 5000,
    transportFee: 4500,
    libraryFee: 2500,
    grossFee: 54000,
    scholarshipRelief: 42000,
    netAssessedFee: 12000,
    paidAmount: 6000,
    dueAmount: 6000,
    status: 'Pending',
    monthlyFee: 1000,
    monthsPaidCount: 6,
    totalMonthsCount: 12,
    installments: [
      { month: 'Apr 2026', amount: 1000, dueDate: '10 Apr 2026', isPaid: true, paidDate: '10 Apr 2026', receiptNo: 'REC-2026-0842' },
      { month: 'May 2026', amount: 1000, dueDate: '10 May 2026', isPaid: true, paidDate: '10 May 2026', receiptNo: 'REC-2026-1402' },
      { month: 'Jun 2026', amount: 1000, dueDate: '10 Jun 2026', isPaid: true, paidDate: '10 Jun 2026', receiptNo: 'REC-2026-2104' },
      { month: 'Jul 2026', amount: 1000, dueDate: '10 Jul 2026', isPaid: true, paidDate: '09 Jul 2026', receiptNo: 'REC-2026-3101' },
      { month: 'Aug 2026', amount: 1000, dueDate: '10 Aug 2026', isPaid: true, paidDate: '08 Aug 2026', receiptNo: 'REC-2026-4402' },
      { month: 'Sep 2026', amount: 1000, dueDate: '10 Sep 2026', isPaid: true, paidDate: '10 Sep 2026', receiptNo: 'REC-2026-5501' },
      { month: 'Oct 2026', amount: 1000, dueDate: '10 Oct 2026', isPaid: false },
      { month: 'Nov 2026', amount: 1000, dueDate: '10 Nov 2026', isPaid: false },
      { month: 'Dec 2026', amount: 1000, dueDate: '10 Dec 2026', isPaid: false },
      { month: 'Jan 2027', amount: 1000, dueDate: '10 Jan 2027', isPaid: false },
      { month: 'Feb 2027', amount: 1000, dueDate: '10 Feb 2027', isPaid: false },
      { month: 'Mar 2027', amount: 1000, dueDate: '10 Mar 2027', isPaid: false },
    ],
    recentReceipts: [
      { receiptNo: 'REC-2026-5501', period: 'September 2026 Installment', date: '10 Sep 2026, 09:45 AM', mode: 'NetBanking (NEFT)', amount: 1000, cashier: 'Mr. Arvind Gupta' },
      { receiptNo: 'REC-2026-4402', period: 'August 2026 Installment', date: '08 Aug 2026, 11:20 AM', mode: 'UPI Gateway', amount: 1000, cashier: 'Mr. Arvind Gupta' },
    ],
  },
  'ADM-2026-003': {
    paymentPlan: 'Monthly Installments',
    installmentDueDay: 5,
    nextDueDate: '05 Jul 2026 (Overdue)',
    baseTuition: 42000,
    labTechFee: 5000,
    transportFee: 4500,
    libraryFee: 2500,
    grossFee: 54000,
    scholarshipRelief: 0,
    netAssessedFee: 54000,
    paidAmount: 13500,
    dueAmount: 40500,
    status: 'Overdue',
    monthlyFee: 4500,
    monthsPaidCount: 3,
    totalMonthsCount: 12,
    installments: [
      { month: 'Apr 2026', amount: 4500, dueDate: '05 Apr 2026', isPaid: true, paidDate: '05 Apr 2026', receiptNo: 'REC-2026-1102' },
      { month: 'May 2026', amount: 4500, dueDate: '05 May 2026', isPaid: true, paidDate: '05 May 2026', receiptNo: 'REC-2026-1891' },
      { month: 'Jun 2026', amount: 4500, dueDate: '05 Jun 2026', isPaid: true, paidDate: '04 Jun 2026', receiptNo: 'REC-2026-2901' },
      { month: 'Jul 2026', amount: 4500, dueDate: '05 Jul 2026', isPaid: false },
      { month: 'Aug 2026', amount: 4500, dueDate: '05 Aug 2026', isPaid: false },
      { month: 'Sep 2026', amount: 4500, dueDate: '05 Sep 2026', isPaid: false },
      { month: 'Oct 2026', amount: 4500, dueDate: '05 Oct 2026', isPaid: false },
      { month: 'Nov 2026', amount: 4500, dueDate: '05 Nov 2026', isPaid: false },
      { month: 'Dec 2026', amount: 4500, dueDate: '05 Dec 2026', isPaid: false },
      { month: 'Jan 2027', amount: 4500, dueDate: '05 Jan 2027', isPaid: false },
      { month: 'Feb 2027', amount: 4500, dueDate: '05 Feb 2027', isPaid: false },
      { month: 'Mar 2027', amount: 4500, dueDate: '05 Mar 2027', isPaid: false },
    ],
    recentReceipts: [
      { receiptNo: 'REC-2026-2901', period: 'June 2026 Installment', date: '04 Jun 2026, 02:15 PM', mode: 'Cash at Counter', amount: 4500, cashier: 'Mr. Arvind Gupta' },
    ],
  },
  'ADM-2026-004': {
    paymentPlan: 'Monthly Installments',
    installmentDueDay: 12,
    nextDueDate: '12 Jan 2027',
    baseTuition: 48000,
    labTechFee: 6000,
    transportFee: 0,
    libraryFee: 2500,
    grossFee: 56500,
    scholarshipRelief: 0,
    netAssessedFee: 56500,
    paidAmount: 42375,
    dueAmount: 14125,
    status: 'Pending',
    monthlyFee: 4708,
    monthsPaidCount: 9,
    totalMonthsCount: 12,
    installments: [
      { month: 'Apr 2026', amount: 4708, dueDate: '12 Apr 2026', isPaid: true, paidDate: '12 Apr 2026', receiptNo: 'REC-2026-019' },
      { month: 'May 2026', amount: 4708, dueDate: '12 May 2026', isPaid: true, paidDate: '12 May 2026', receiptNo: 'REC-2026-088' },
      { month: 'Jun 2026', amount: 4708, dueDate: '12 Jun 2026', isPaid: true, paidDate: '12 Jun 2026', receiptNo: 'REC-2026-155' },
      { month: 'Jul 2026', amount: 4708, dueDate: '12 Jul 2026', isPaid: true, paidDate: '11 Jul 2026', receiptNo: 'REC-2026-241' },
      { month: 'Aug 2026', amount: 4708, dueDate: '12 Aug 2026', isPaid: true, paidDate: '12 Aug 2026', receiptNo: 'REC-2026-319' },
      { month: 'Sep 2026', amount: 4708, dueDate: '12 Sep 2026', isPaid: true, paidDate: '10 Sep 2026', receiptNo: 'REC-2026-402' },
      { month: 'Oct 2026', amount: 4708, dueDate: '12 Oct 2026', isPaid: true, paidDate: '12 Oct 2026', receiptNo: 'REC-2026-512' },
      { month: 'Nov 2026', amount: 4708, dueDate: '12 Nov 2026', isPaid: true, paidDate: '11 Nov 2026', receiptNo: 'REC-2026-618' },
      { month: 'Dec 2026', amount: 4708, dueDate: '12 Dec 2026', isPaid: true, paidDate: '12 Dec 2026', receiptNo: 'REC-2026-729' },
      { month: 'Jan 2027', amount: 4708, dueDate: '12 Jan 2027', isPaid: false },
      { month: 'Feb 2027', amount: 4708, dueDate: '12 Feb 2027', isPaid: false },
      { month: 'Mar 2027', amount: 4708, dueDate: '12 Mar 2027', isPaid: false },
    ],
    recentReceipts: [
      { receiptNo: 'REC-2026-729', period: 'December 2026 Installment', date: '12 Dec 2026, 10:30 AM', mode: 'Card POS Swipe', amount: 4708, cashier: 'Mr. Arvind Gupta' },
    ],
  },
  'ADM-2026-005': {
    paymentPlan: 'Monthly Installments',
    installmentDueDay: 8,
    nextDueDate: '08 May 2026',
    baseTuition: 52000,
    labTechFee: 0,
    transportFee: 0,
    libraryFee: 0,
    grossFee: 52000,
    scholarshipRelief: 0,
    netAssessedFee: 52000,
    paidAmount: 4333,
    dueAmount: 47667,
    status: 'Pending',
    monthlyFee: 4333,
    monthsPaidCount: 1,
    totalMonthsCount: 12,
    installments: [
      { month: 'Apr 2026', amount: 4333, dueDate: '08 Apr 2026', isPaid: true, paidDate: '08 Apr 2026', receiptNo: 'REC-2026-091' },
      { month: 'May 2026', amount: 4333, dueDate: '08 May 2026', isPaid: false },
      { month: 'Jun 2026', amount: 4333, dueDate: '08 Jun 2026', isPaid: false },
      { month: 'Jul 2026', amount: 4333, dueDate: '08 Jul 2026', isPaid: false },
      { month: 'Aug 2026', amount: 4333, dueDate: '08 Aug 2026', isPaid: false },
      { month: 'Sep 2026', amount: 4333, dueDate: '08 Sep 2026', isPaid: false },
      { month: 'Oct 2026', amount: 4333, dueDate: '08 Oct 2026', isPaid: false },
      { month: 'Nov 2026', amount: 4333, dueDate: '08 Nov 2026', isPaid: false },
      { month: 'Dec 2026', amount: 4333, dueDate: '08 Dec 2026', isPaid: false },
      { month: 'Jan 2027', amount: 4333, dueDate: '08 Jan 2027', isPaid: false },
      { month: 'Feb 2027', amount: 4333, dueDate: '08 Feb 2027', isPaid: false },
      { month: 'Mar 2027', amount: 4333, dueDate: '08 Mar 2027', isPaid: false },
    ],
    recentReceipts: [
      { receiptNo: 'REC-2026-091', period: 'April 2026 Installment', date: '08 Apr 2026, 09:15 AM', mode: 'Online NetBanking', amount: 4333, cashier: 'Mr. Arvind Gupta' },
    ],
  },
  'ADM-2026-006': {
    paymentPlan: 'Monthly Installments',
    installmentDueDay: 10,
    nextDueDate: '10 Oct 2026',
    baseTuition: 45600,
    labTechFee: 0,
    transportFee: 0,
    libraryFee: 0,
    grossFee: 45600,
    scholarshipRelief: 0,
    netAssessedFee: 45600,
    paidAmount: 22800,
    dueAmount: 22800,
    status: 'Pending',
    monthlyFee: 3800,
    monthsPaidCount: 6,
    totalMonthsCount: 12,
    installments: [
      { month: 'Apr 2026', amount: 3800, dueDate: '10 Apr 2026', isPaid: true, paidDate: '10 Apr 2026', receiptNo: 'REC-2026-118' },
      { month: 'May 2026', amount: 3800, dueDate: '10 May 2026', isPaid: true, paidDate: '10 May 2026', receiptNo: 'REC-2026-192' },
      { month: 'Jun 2026', amount: 3800, dueDate: '10 Jun 2026', isPaid: true, paidDate: '10 Jun 2026', receiptNo: 'REC-2026-281' },
      { month: 'Jul 2026', amount: 3800, dueDate: '10 Jul 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-377' },
      { month: 'Aug 2026', amount: 3800, dueDate: '10 Aug 2026', isPaid: true, paidDate: '09 Aug 2026', receiptNo: 'REC-2026-465' },
      { month: 'Sep 2026', amount: 3800, dueDate: '10 Sep 2026', isPaid: true, paidDate: '10 Sep 2026', receiptNo: 'REC-2026-559' },
      { month: 'Oct 2026', amount: 3800, dueDate: '10 Oct 2026', isPaid: false },
      { month: 'Nov 2026', amount: 3800, dueDate: '10 Nov 2026', isPaid: false },
      { month: 'Dec 2026', amount: 3800, dueDate: '10 Dec 2026', isPaid: false },
      { month: 'Jan 2027', amount: 3800, dueDate: '10 Jan 2027', isPaid: false },
      { month: 'Feb 2027', amount: 3800, dueDate: '10 Feb 2027', isPaid: false },
      { month: 'Mar 2027', amount: 3800, dueDate: '10 Mar 2027', isPaid: false },
    ],
    recentReceipts: [
      { receiptNo: 'REC-2026-559', period: 'September 2026 Installment', date: '10 Sep 2026, 04:30 PM', mode: 'UPI Gateway', amount: 3800, cashier: 'Mr. Arvind Gupta' },
    ],
  },
  'ADM-2026-007': {
    paymentPlan: 'Annual Full Upfront',
    installmentDueDay: 10,
    nextDueDate: 'Annual Cleared (AY 2026–2027)',
    baseTuition: 52000,
    labTechFee: 0,
    transportFee: 0,
    libraryFee: 0,
    grossFee: 52000,
    scholarshipRelief: 0,
    netAssessedFee: 52000,
    paidAmount: 52000,
    dueAmount: 0,
    status: 'Cleared',
    monthlyFee: 4333,
    monthsPaidCount: 12,
    totalMonthsCount: 12,
    installments: [
      { month: 'Apr 2026', amount: 4333, dueDate: '10 Apr 2026', isPaid: true, paidDate: '10 Apr 2026', receiptNo: 'REC-2026-007A' },
      { month: 'May 2026', amount: 4333, dueDate: '10 May 2026', isPaid: true, paidDate: '10 Apr 2026', receiptNo: 'REC-2026-007A' },
      { month: 'Jun 2026', amount: 4333, dueDate: '10 Jun 2026', isPaid: true, paidDate: '10 Apr 2026', receiptNo: 'REC-2026-007A' },
      { month: 'Jul 2026', amount: 4333, dueDate: '10 Jul 2026', isPaid: true, paidDate: '10 Apr 2026', receiptNo: 'REC-2026-007A' },
      { month: 'Aug 2026', amount: 4333, dueDate: '10 Aug 2026', isPaid: true, paidDate: '10 Apr 2026', receiptNo: 'REC-2026-007A' },
      { month: 'Sep 2026', amount: 4333, dueDate: '10 Sep 2026', isPaid: true, paidDate: '10 Apr 2026', receiptNo: 'REC-2026-007A' },
      { month: 'Oct 2026', amount: 4333, dueDate: '10 Oct 2026', isPaid: true, paidDate: '10 Apr 2026', receiptNo: 'REC-2026-007A' },
      { month: 'Nov 2026', amount: 4333, dueDate: '10 Nov 2026', isPaid: true, paidDate: '10 Apr 2026', receiptNo: 'REC-2026-007A' },
      { month: 'Dec 2026', amount: 4333, dueDate: '10 Dec 2026', isPaid: true, paidDate: '10 Apr 2026', receiptNo: 'REC-2026-007A' },
      { month: 'Jan 2027', amount: 4333, dueDate: '10 Jan 2027', isPaid: true, paidDate: '10 Apr 2026', receiptNo: 'REC-2026-007A' },
      { month: 'Feb 2027', amount: 4333, dueDate: '10 Feb 2027', isPaid: true, paidDate: '10 Apr 2026', receiptNo: 'REC-2026-007A' },
      { month: 'Mar 2027', amount: 4333, dueDate: '10 Mar 2027', isPaid: true, paidDate: '10 Apr 2026', receiptNo: 'REC-2026-007A' },
    ],
    recentReceipts: [
      { receiptNo: 'REC-2026-007A', period: 'Full Annual Fee', date: '10 Apr 2026, 11:00 AM', mode: 'Bank Transfer (NEFT)', amount: 52000, cashier: 'Mr. Arvind Gupta' },
    ],
  },
  'ADM-2026-008': {
    paymentPlan: 'Annual Full Upfront',
    installmentDueDay: 15,
    nextDueDate: 'Annual Cleared (AY 2026–2027)',
    baseTuition: 42000,
    labTechFee: 0,
    transportFee: 0,
    libraryFee: 0,
    grossFee: 42000,
    scholarshipRelief: 0,
    netAssessedFee: 42000,
    paidAmount: 42000,
    dueAmount: 0,
    status: 'Cleared',
    monthlyFee: 3500,
    monthsPaidCount: 12,
    totalMonthsCount: 12,
    installments: [
      { month: 'Apr 2026', amount: 3500, dueDate: '15 Apr 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { month: 'May 2026', amount: 3500, dueDate: '15 May 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { month: 'Jun 2026', amount: 3500, dueDate: '15 Jun 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { month: 'Jul 2026', amount: 3500, dueDate: '15 Jul 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { month: 'Aug 2026', amount: 3500, dueDate: '15 Aug 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { month: 'Sep 2026', amount: 3500, dueDate: '15 Sep 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { month: 'Oct 2026', amount: 3500, dueDate: '15 Oct 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { month: 'Nov 2026', amount: 3500, dueDate: '15 Nov 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { month: 'Dec 2026', amount: 3500, dueDate: '15 Dec 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { month: 'Jan 2027', amount: 3500, dueDate: '15 Jan 2027', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { month: 'Feb 2027', amount: 3500, dueDate: '15 Feb 2027', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { month: 'Mar 2027', amount: 3500, dueDate: '15 Mar 2027', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
    ],
    recentReceipts: [
      { receiptNo: 'REC-2026-2109', period: 'Full Annual Fee', date: '15 Apr 2026, 10:00 AM', mode: 'Bank Transfer (NEFT)', amount: 42000, cashier: 'Mr. Arvind Gupta' },
    ],
  },
};

export const getStudentFeeDetails = (student: any): StudentFeeLedgerItem => {
  if (student?.admNo && STUDENT_FEES_MAP[student.admNo]) {
    return STUDENT_FEES_MAP[student.admNo];
  }
  return {
    paymentPlan: 'Monthly Installments',
    installmentDueDay: 10,
    nextDueDate: '10 Oct 2026',
    baseTuition: 42000,
    labTechFee: 5000,
    transportFee: 4500,
    libraryFee: 2500,
    grossFee: 54000,
    scholarshipRelief: 0,
    netAssessedFee: 54000,
    paidAmount: 27000,
    dueAmount: 27000,
    status: 'Pending',
    monthlyFee: 4500,
    monthsPaidCount: 6,
    totalMonthsCount: 12,
    installments: [
      { month: 'Apr 2026', amount: 4500, dueDate: '10 Apr 2026', isPaid: true, paidDate: '10 Apr 2026', receiptNo: 'REC-2026-101' },
      { month: 'May 2026', amount: 4500, dueDate: '10 May 2026', isPaid: true, paidDate: '10 May 2026', receiptNo: 'REC-2026-202' },
      { month: 'Jun 2026', amount: 4500, dueDate: '10 Jun 2026', isPaid: true, paidDate: '10 Jun 2026', receiptNo: 'REC-2026-303' },
      { month: 'Jul 2026', amount: 4500, dueDate: '10 Jul 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-404' },
      { month: 'Aug 2026', amount: 4500, dueDate: '10 Aug 2026', isPaid: true, paidDate: '10 Aug 2026', receiptNo: 'REC-2026-505' },
      { month: 'Sep 2026', amount: 4500, dueDate: '10 Sep 2026', isPaid: true, paidDate: '10 Sep 2026', receiptNo: 'REC-2026-606' },
      { month: 'Oct 2026', amount: 4500, dueDate: '10 Oct 2026', isPaid: false },
      { month: 'Nov 2026', amount: 4500, dueDate: '10 Nov 2026', isPaid: false },
      { month: 'Dec 2026', amount: 4500, dueDate: '10 Dec 2026', isPaid: false },
      { month: 'Jan 2027', amount: 4500, dueDate: '10 Jan 2027', isPaid: false },
      { month: 'Feb 2027', amount: 4500, dueDate: '10 Feb 2027', isPaid: false },
      { month: 'Mar 2027', amount: 4500, dueDate: '10 Mar 2027', isPaid: false },
    ],
    recentReceipts: [
      { receiptNo: 'REC-2026-606', period: 'September 2026 Installment', date: '10 Sep 2026, 11:00 AM', mode: 'UPI Gateway', amount: 4500, cashier: 'Mr. Arvind Gupta' },
    ],
  };
};

export const Route = createFileRoute('/students')({
  component: StudentsPage,
});

function StudentsPage() {
  const navigate = useNavigate();
  const { activeSession, addNotification } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  React.useEffect(() => { document.title = t('page.students') + ' \u2013 VidyaMaxx'; }, [t]);
  const [selectedStudentIndex, setSelectedStudentIndex] = React.useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
  const [drawerTab, setDrawerTab] = React.useState<'overview' | 'academics' | 'credentials' | 'fees' | 'scholarship'>('overview');
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  // Dynamic Dossier Fields Configuration State
  const [dossierFields, setDossierFields] = React.useState<DossierFieldConfig[]>(defaultDossierFields);
  const [isFieldConfigOpen, setIsFieldConfigOpen] = React.useState<boolean>(false);
  const [newFieldLabel, setNewFieldLabel] = React.useState<string>('');
  const [newFieldCategory, setNewFieldCategory] = React.useState<'personal' | 'family' | 'operations'>('personal');

  const handleToggleField = (key: string) => {
    setDossierFields((prev) =>
      prev.map((f) => (f.key === key ? { ...f, isVisible: !f.isVisible } : f))
    );
  };

  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) return;
    const cleanKey = 'custom_' + newFieldLabel.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (dossierFields.some((f) => f.key === cleanKey)) {
      alert('A field with this name already exists.');
      return;
    }
    const newField: DossierFieldConfig = {
      key: cleanKey,
      label: newFieldLabel.trim(),
      category: newFieldCategory,
      isVisible: true,
      isCustom: true,
    };
    setDossierFields((prev) => [...prev, newField]);
    setNewFieldLabel('');
  };

  const handleDeleteCustomField = (key: string) => {
    setDossierFields((prev) => prev.filter((f) => f.key !== key));
  };

  const getFieldValue = (student: any, fieldKey: string) => {
    if (!student) return '';
    if (fieldKey === 'classSection') return `${student.class || ''} (Sec ${student.section || 'A'})`;
    if (student[fieldKey] !== undefined && student[fieldKey] !== '') return student[fieldKey];
    if (fieldKey === 'aadhaarNo') return student.aadhaarNo || '4928-1092-8841';
    if (fieldKey === 'category') return student.category || 'General / Merit';
    if (fieldKey === 'guardianOccupation') return student.guardianOccupation || 'Senior Software Engineer / Architect';
    if (fieldKey === 'busStop') return student.busStop || 'Sector 14 Main Gate (07:15 AM)';
    if (fieldKey === 'feeStatus') return 'Paid (No Dues Pending)';
    return '-';
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // ID Card Preview Modal State
  const [isIdCardModalOpen, setIsIdCardModalOpen] = React.useState<boolean>(false);
  const [idCardStudent, setIdCardStudent] = React.useState<any>(null);

  const openIdCardModal = (student: any) => {
    setIdCardStudent(student);
    setIsIdCardModalOpen(true);
  };

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = React.useState<boolean>(false);
  const [exportFormat, setExportFormat] = React.useState<'xlsx' | 'zip' | 'bundle'>('bundle');
  const [namingPattern, setNamingPattern] = React.useState<'id-name' | 'roll-name' | 'name-id' | 'id-only' | 'custom'>('id-name');
  const [customColumnKey, setCustomColumnKey] = React.useState<string>('admNo');
  const [isExporting, setIsExporting] = React.useState<boolean>(false);
  const [exportProgressText, setExportProgressText] = React.useState<string>('');

  // Enrolled active students dataset (Session-aware with rich dossier details)
  const allStudentsBySession: Record<string, any[]> = {
    '2026–2027': [
      {
        admNo: 'ADM-2026-001',
        name: 'Aditya Verma',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
        class: 'Class 9',
        section: 'A',
        roll: '101',
        house: 'Red House',
        guardian: 'Rajesh Verma',
        motherName: 'Sunita Verma',
        phone: '+91 98765 43210',
        email: 'aditya.v@student.vidyamaxx.edu',
        address: '402, Royal Greens, Sector 14, New Delhi',
        dob: '14 May 2011',
        bloodGroup: 'B+',
        status: 'Active',
        attendance: '98.2%',
        gpa: '3.92',
        rank: '#2 in Class',
        feeStatus: 'Paid',
        transport: 'Bus Route 4 (Stop #12)',
        medical: 'No known allergies',
        classTeacher: 'Dr. Rajesh Sharma',
        session: '2026–2027',
        idCardStatus: 'Issued & Active',
        idCardIssueDate: '12 Aug 2026',
        idCardBatch: 'IDC-2026-B1',
        examFormStatus: 'Forwarded to Board',
        examRollNo: 'CBSE-2026-994812',
        centerCode: 'DEL-CENTRAL-401',
        recentTestScores: [
          { subject: 'Mathematics', score: '98/100', grade: 'A1' },
          { subject: 'Science', score: '95/100', grade: 'A1' },
          { subject: 'English Core', score: '92/100', grade: 'A1' },
          { subject: 'Computer Applications', score: '99/100', grade: 'A1' },
          { subject: 'Social Science', score: '94/100', grade: 'A1' },
        ],
      },
      {
        admNo: 'ADM-2026-002',
        name: 'Priya Sharma',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        class: 'Class 9',
        section: 'A',
        roll: '102',
        house: 'Blue House',
        guardian: 'Sunita Sharma',
        motherName: 'Sunita Sharma',
        phone: '+91 98123 45678',
        email: 'priya.s@student.vidyamaxx.edu',
        address: '11-B, Pocket C, Vasant Kunj, New Delhi',
        dob: '22 Aug 2011',
        bloodGroup: 'O+',
        status: 'Active',
        attendance: '95.4%',
        gpa: '3.88',
        rank: '#4 in Class',
        feeStatus: 'Paid',
        transport: 'Self (Parent Drop)',
        medical: 'Asthma (Inhaler with Infirmary)',
        classTeacher: 'Dr. Rajesh Sharma',
        session: '2026–2027',
        idCardStatus: 'Issued & Active',
        idCardIssueDate: '12 Aug 2026',
        idCardBatch: 'IDC-2026-B1',
        examFormStatus: 'LOC Verified (CBSE)',
        examRollNo: 'CBSE-2026-994813',
        centerCode: 'DEL-CENTRAL-401',
        recentTestScores: [
          { subject: 'Mathematics', score: '94/100', grade: 'A1' },
          { subject: 'Science', score: '96/100', grade: 'A1' },
          { subject: 'English Core', score: '95/100', grade: 'A1' },
          { subject: 'Computer Applications', score: '97/100', grade: 'A1' },
          { subject: 'Social Science', score: '91/100', grade: 'A1' },
        ],
      },
      {
        admNo: 'ADM-2026-003',
        name: 'Rahul Gupta',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        class: 'Class 9',
        section: 'B',
        roll: '103',
        house: 'Green House',
        guardian: 'Vikram Gupta',
        motherName: 'Meenakshi Gupta',
        phone: '+91 97654 32109',
        email: 'rahul.g@student.vidyamaxx.edu',
        address: '88, Anand Lok, New Delhi',
        dob: '05 Jan 2011',
        bloodGroup: 'A+',
        status: 'Active',
        attendance: '91.0%',
        gpa: '3.45',
        rank: '#14 in Class',
        feeStatus: 'Paid',
        transport: 'Bus Route 2 (Stop #5)',
        medical: 'Nut allergy',
        classTeacher: 'Ms. Pooja Rao',
        session: '2026–2027',
        idCardStatus: 'Pending Print',
        idCardIssueDate: 'Queue #04',
        idCardBatch: 'IDC-2026-B2',
        examFormStatus: 'Pending Submission',
        examRollNo: 'DRAFT-LOC-103',
        centerCode: 'Unassigned',
        recentTestScores: [
          { subject: 'Mathematics', score: '82/100', grade: 'B1' },
          { subject: 'Science', score: '85/100', grade: 'A2' },
          { subject: 'English Core', score: '88/100', grade: 'A2' },
          { subject: 'Computer Applications', score: '90/100', grade: 'A2' },
          { subject: 'Social Science', score: '79/100', grade: 'B2' },
        ],
      },
      {
        admNo: 'ADM-2026-004',
        name: 'Kavya Nair',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        class: 'Class 11-Com',
        section: 'A',
        roll: '201',
        house: 'Yellow House',
        guardian: 'Suresh Nair',
        motherName: 'Latha Nair',
        phone: '+91 99887 76655',
        email: 'kavya.n@student.vidyamaxx.edu',
        address: '304, Palm Grove, Dwarka Sector 6, New Delhi',
        dob: '19 Nov 2009',
        bloodGroup: 'AB+',
        status: 'Active',
        attendance: '97.5%',
        gpa: '3.95',
        rank: '#1 in Commerce',
        feeStatus: 'Paid',
        transport: 'Bus Route 7 (Stop #3)',
        medical: 'None',
        classTeacher: 'Mr. Deepak Mishra',
        session: '2026–2027',
        idCardStatus: 'Application Received (New)',
        idCardIssueDate: 'Verification Stage',
        idCardBatch: 'IDC-2026-B2',
        examFormStatus: 'Admit Card Released',
        examRollNo: 'CBSE-2026-884021',
        centerCode: 'DEL-SOUTH-209',
        recentTestScores: [
          { subject: 'Accountancy', score: '99/100', grade: 'A1' },
          { subject: 'Business Studies', score: '98/100', grade: 'A1' },
          { subject: 'Economics', score: '97/100', grade: 'A1' },
          { subject: 'English Core', score: '95/100', grade: 'A1' },
          { subject: 'Applied Mathematics', score: '96/100', grade: 'A1' },
        ],
      },
      {
        admNo: 'ADM-2026-005',
        name: 'Ishaan Malhotra',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        class: 'Class 11-Sci',
        section: 'B',
        roll: '202',
        house: 'Red House',
        guardian: 'Anil Malhotra',
        motherName: 'Kiran Malhotra',
        phone: '+91 98234 56789',
        email: 'ishaan.m@student.vidyamaxx.edu',
        address: '52, Shivalik Enclave, New Delhi',
        dob: '02 Feb 2009',
        bloodGroup: 'O-',
        status: 'Active',
        attendance: '94.0%',
        gpa: '3.70',
        rank: '#8 in Science',
        feeStatus: 'Paid',
        transport: 'Bus Route 9 (Stop #1)',
        medical: 'Spectacles (-2.5D)',
        classTeacher: 'Dr. Rajesh Sharma',
        session: '2026–2027',
        idCardStatus: 'Issued & Active',
        idCardIssueDate: '15 Aug 2026',
        idCardBatch: 'IDC-2026-B1',
        examFormStatus: 'Forwarded to Board',
        examRollNo: 'CBSE-2026-884022',
        centerCode: 'DEL-SOUTH-209',
        recentTestScores: [
          { subject: 'Physics', score: '91/100', grade: 'A1' },
          { subject: 'Chemistry', score: '88/100', grade: 'A2' },
          { subject: 'Mathematics', score: '93/100', grade: 'A1' },
          { subject: 'Computer Science', score: '95/100', grade: 'A1' },
          { subject: 'English Core', score: '90/100', grade: 'A2' },
        ],
      },
      {
        admNo: 'ADM-2026-006',
        name: 'Sneha Rao',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        class: 'Class 10',
        section: 'A',
        roll: '108',
        house: 'Blue House',
        guardian: 'Mahesh Rao',
        motherName: 'Deepa Rao',
        phone: '+91 97711 22334',
        email: 'sneha.r@student.vidyamaxx.edu',
        address: 'B-14, Mayur Vihar Phase 1, New Delhi',
        dob: '12 Jul 2010',
        bloodGroup: 'B-',
        status: 'Active',
        attendance: '96.2%',
        gpa: '3.81',
        rank: '#5 in Class',
        feeStatus: 'Paid',
        transport: 'Metro Pass / Self',
        medical: 'None',
        classTeacher: 'Mr. Arvind Gupta',
        session: '2026–2027',
        idCardStatus: 'Re-issue Requested',
        idCardIssueDate: 'Replacement Pending',
        idCardBatch: 'IDC-2026-RE',
        examFormStatus: 'LOC Verified (CBSE)',
        examRollNo: 'CBSE-2026-773908',
        centerCode: 'DEL-EAST-114',
        recentTestScores: [
          { subject: 'Mathematics', score: '95/100', grade: 'A1' },
          { subject: 'Science', score: '93/100', grade: 'A1' },
          { subject: 'English Core', score: '96/100', grade: 'A1' },
          { subject: 'Information Tech', score: '98/100', grade: 'A1' },
          { subject: 'Social Science', score: '92/100', grade: 'A1' },
        ],
      },
      {
        admNo: 'ADM-2026-007',
        name: 'Vikram Mehta',
        avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
        class: 'Class 12-Com',
        section: 'A',
        roll: '304',
        house: 'Green House',
        guardian: 'Deepak Mehta',
        motherName: 'Anju Mehta',
        phone: '+91 98345 67890',
        email: 'vikram.m@student.vidyamaxx.edu',
        address: '77, Greater Kailash 2, New Delhi',
        dob: '30 Sep 2008',
        bloodGroup: 'A-',
        status: 'Active',
        attendance: '92.8%',
        gpa: '3.62',
        rank: '#11 in Commerce',
        feeStatus: 'Paid',
        transport: 'Self (Two-Wheeler)',
        medical: 'None',
        classTeacher: 'Mrs. S. Joshi',
        session: '2026–2027',
        idCardStatus: 'Issued & Active',
        idCardIssueDate: '10 Aug 2026',
        idCardBatch: 'IDC-2026-B1',
        examFormStatus: 'Admit Card Released',
        examRollNo: 'CBSE-2026-662904',
        centerCode: 'DEL-CENTRAL-401',
        recentTestScores: [
          { subject: 'Accountancy', score: '88/100', grade: 'A2' },
          { subject: 'Business Studies', score: '91/100', grade: 'A1' },
          { subject: 'Economics', score: '87/100', grade: 'A2' },
          { subject: 'English Core', score: '90/100', grade: 'A2' },
          { subject: 'Informatics Practices', score: '94/100', grade: 'A1' },
        ],
      },
      {
        admNo: 'ADM-2026-008',
        name: 'Ananya Deshmukh',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        class: 'Class 12-Sci',
        section: 'A',
        roll: '305',
        house: 'Yellow House',
        guardian: 'Sanjay Deshmukh',
        motherName: 'Rekha Deshmukh',
        phone: '+91 98456 78901',
        email: 'ananya.d@student.vidyamaxx.edu',
        address: 'C-9, Hauz Khas Enclave, New Delhi',
        dob: '18 Dec 2008',
        bloodGroup: 'AB-',
        status: 'Active',
        attendance: '99.1%',
        gpa: '3.98',
        rank: '#1 in School',
        feeStatus: 'Paid',
        transport: 'Bus Route 1 (Stop #4)',
        medical: 'None',
        classTeacher: 'Coach Vikram Singh',
        session: '2026–2027',
        idCardStatus: 'Issued & Active',
        idCardIssueDate: '10 Aug 2026',
        idCardBatch: 'IDC-2026-B1',
        examFormStatus: 'Admit Card Released',
        examRollNo: 'CBSE-2026-662905',
        centerCode: 'DEL-CENTRAL-401',
        recentTestScores: [
          { subject: 'Physics', score: '99/100', grade: 'A1' },
          { subject: 'Chemistry', score: '98/100', grade: 'A1' },
          { subject: 'Mathematics', score: '100/100', grade: 'A1' },
          { subject: 'Computer Science', score: '100/100', grade: 'A1' },
          { subject: 'English Core', score: '98/100', grade: 'A1' },
        ],
      },
    ],
    '2025–2026': [
      {
        admNo: 'ADM-2025-012',
        name: 'Rohan Sen',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
        class: 'Class 10',
        section: 'A',
        roll: '112',
        house: 'Red House',
        guardian: 'Arun Sen',
        motherName: 'Shalini Sen',
        phone: '+91 98111 22233',
        email: 'rohan.s@student.vidyamaxx.edu',
        address: '104, Golf Links, New Delhi',
        dob: '10 Mar 2010',
        bloodGroup: 'B+',
        status: 'Archived',
        attendance: '94.5%',
        gpa: '3.75',
        rank: '#7 in Class',
        feeStatus: 'Paid',
        transport: 'Bus Route 3',
        medical: 'None',
        classTeacher: 'Dr. Rajesh Sharma',
        session: '2025–2026',
      },
      {
        admNo: 'ADM-2025-045',
        name: 'Tanvi Joshi',
        avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
        class: 'Class 11-Com',
        section: 'B',
        roll: '215',
        house: 'Blue House',
        guardian: 'Vikas Joshi',
        motherName: 'Geeta Joshi',
        phone: '+91 98222 33344',
        email: 'tanvi.j@student.vidyamaxx.edu',
        address: '45, Defence Colony, New Delhi',
        dob: '25 Jun 2009',
        bloodGroup: 'O+',
        status: 'Archived',
        attendance: '96.0%',
        gpa: '3.89',
        rank: '#3 in Commerce',
        feeStatus: 'Paid',
        transport: 'Self Drop',
        medical: 'None',
        classTeacher: 'Mrs. S. Joshi',
        session: '2025–2026',
      },
      {
        admNo: 'ADM-2025-078',
        name: 'Karan Singhal',
        avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
        class: 'Class 12-Sci',
        section: 'A',
        roll: '310',
        house: 'Green House',
        guardian: 'Rajesh Singhal',
        motherName: 'Poonam Singhal',
        phone: '+91 98333 44455',
        email: 'karan.s@student.vidyamaxx.edu',
        address: '12, Sundar Nagar, New Delhi',
        dob: '14 Jan 2008',
        bloodGroup: 'A+',
        status: 'Archived',
        attendance: '93.2%',
        gpa: '3.65',
        rank: '#9 in Science',
        feeStatus: 'Paid',
        transport: 'Bus Route 6',
        medical: 'None',
        classTeacher: 'Dr. Rajesh Sharma',
        session: '2025–2026',
      },
    ],
    '2024–2025': [
      {
        admNo: 'ADM-2024-009',
        name: 'Meera Iyer',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        class: 'Class 12-Hum',
        section: 'A',
        roll: '301',
        house: 'Yellow House',
        guardian: 'K. Iyer',
        motherName: 'Radha Iyer',
        phone: '+91 98444 55566',
        email: 'meera.i@student.vidyamaxx.edu',
        address: '9, Chanakyapuri, New Delhi',
        dob: '08 Aug 2007',
        bloodGroup: 'B+',
        status: 'Archived',
        attendance: '95.8%',
        gpa: '3.91',
        rank: '#1 in Humanities',
        feeStatus: 'Paid',
        transport: 'Self',
        medical: 'None',
        classTeacher: 'Ms. Pooja Rao',
        session: '2024–2025',
      },
      {
        admNo: 'ADM-2024-034',
        name: 'Devendra Chouhan',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
        class: 'Class 12-Sci',
        section: 'B',
        roll: '318',
        house: 'Red House',
        guardian: 'N. Chouhan',
        motherName: 'Suman Chouhan',
        phone: '+91 98555 66677',
        email: 'devendra.c@student.vidyamaxx.edu',
        address: '61, Civil Lines, New Delhi',
        dob: '11 Nov 2007',
        bloodGroup: 'O+',
        status: 'Archived',
        attendance: '91.4%',
        gpa: '3.50',
        rank: '#15 in Science',
        feeStatus: 'Paid',
        transport: 'Bus Route 8',
        medical: 'None',
        classTeacher: 'Mr. Arvind Gupta',
        session: '2024–2025',
      },
    ],
  };

  // Enrolled students state by Academic Session
  const [enrolledStudentsMap, setEnrolledStudentsMap] = React.useState<Record<string, any[]>>(allStudentsBySession);
  const currentEnrolledList = enrolledStudentsMap[activeSession] || enrolledStudentsMap['2026–2027'] || [];

  // URL Deep-linking Handler (e.g. /students?student=ADM-2026-001&tab=scholarship)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const studentQuery = urlParams.get('student') || urlParams.get('search') || urlParams.get('name');
    const requestedTab = urlParams.get('tab');

    if (studentQuery && currentEnrolledList.length > 0) {
      const q = studentQuery.toLowerCase().trim();
      const matchedIdx = currentEnrolledList.findIndex(
        (s) =>
          s.admNo?.toLowerCase() === q ||
          s.admNo?.replace('-00', '-084').toLowerCase() === q ||
          s.admNo?.replace('-084', '-00').toLowerCase() === q ||
          s.name?.toLowerCase().includes(q)
      );

      if (matchedIdx >= 0) {
        setSelectedStudentIndex(matchedIdx);
        if (requestedTab) {
          const tabLower = requestedTab.toLowerCase();
          if (tabLower.startsWith('scholarship')) setDrawerTab('scholarship');
          else if (tabLower.startsWith('fee')) setDrawerTab('fees');
          else if (tabLower.startsWith('academic')) setDrawerTab('academics');
          else if (tabLower.startsWith('cred') || tabLower.startsWith('cert') || tabLower.startsWith('id')) setDrawerTab('credentials');
          else if (tabLower.startsWith('over')) setDrawerTab('overview');
        }
        setIsDrawerOpen(true);
      }
    }
  }, [currentEnrolledList]);

  // Certificate Modal State (TC, Character, Bonafide)
  const [isCertificateModalOpen, setIsCertificateModalOpen] = React.useState<boolean>(false);
  const [certificateType, setCertificateType] = React.useState<'tc' | 'character' | 'bonafide'>('tc');
  const [certificateStudent, setCertificateStudent] = React.useState<any>(null);
  const [tcReason, setTcReason] = React.useState<string>('Parent Relocation');
  const [destinationSchool, setDestinationSchool] = React.useState<string>('');

  const openCertificateModal = (type: 'tc' | 'character' | 'bonafide', student: any) => {
    setCertificateType(type);
    setCertificateStudent(student);
    setIsCertificateModalOpen(true);
  };

  const [isEditingStudent, setIsEditingStudent] = React.useState<boolean>(false);
  const [studentFormData, setStudentFormData] = React.useState<any>(null);
  const avatarFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setStudentFormData((prev: any) => ({
            ...(prev || activeStudent || {}),
            avatarUrl: resultStr,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const activeStudent =
    selectedStudentIndex !== null && selectedStudentIndex >= 0 && selectedStudentIndex < currentEnrolledList.length
      ? currentEnrolledList[selectedStudentIndex]
      : null;

  const handleStartEdit = () => {
    if (activeStudent) {
      setStudentFormData({ ...activeStudent });
      setIsEditingStudent(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingStudent(false);
    setStudentFormData(null);
  };

  const handleSaveStudent = () => {
    if (!studentFormData || selectedStudentIndex === null) return;
    const updatedList = [...currentEnrolledList];
    updatedList[selectedStudentIndex] = { ...studentFormData };
    setEnrolledStudentsMap((prev) => ({
      ...prev,
      [activeSession]: updatedList,
    }));
    setIsEditingStudent(false);
    setStudentFormData(null);
  };

  const handlePrevStudent = () => {
    if (selectedStudentIndex !== null && selectedStudentIndex > 0) {
      setIsEditingStudent(false);
      setStudentFormData(null);
      setSelectedStudentIndex(selectedStudentIndex - 1);
    }
  };

  const handleNextStudent = () => {
    if (selectedStudentIndex !== null && selectedStudentIndex < currentEnrolledList.length - 1) {
      setIsEditingStudent(false);
      setStudentFormData(null);
      setSelectedStudentIndex(selectedStudentIndex + 1);
    }
  };

  const openStudentDrawer = (student: any) => {
    const idx = currentEnrolledList.findIndex((s) => s.admNo === student.admNo);
    setSelectedStudentIndex(idx >= 0 ? idx : 0);
    setIsEditingStudent(false);
    setStudentFormData(null);
    setIsDrawerOpen(true);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isDrawerOpen) return;
      if (e.key === 'ArrowLeft') handlePrevStudent();
      if (e.key === 'ArrowRight') handleNextStudent();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, selectedStudentIndex, currentEnrolledList.length]);

  // Photo Naming Template Generator
  const getFormattedPhotoName = (student: any) => {
    const sanitize = (str: string) => String(str || '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanName = sanitize(student.name);
    const cleanAdmNo = sanitize(student.admNo);
    const cleanRoll = sanitize(student.roll || '0');

    switch (namingPattern) {
      case 'id-name':
        return `${cleanAdmNo}-${cleanName}.jpg`;
      case 'roll-name':
        return `${cleanRoll}_${cleanName}.jpg`;
      case 'name-id':
        return `${cleanName}_${cleanAdmNo}.jpg`;
      case 'id-only':
        return `${cleanAdmNo}.jpg`;
      case 'custom': {
        const val = sanitize(student[customColumnKey] || 'record');
        return `${val}-${cleanName}.jpg`;
      }
      default:
        return `${cleanAdmNo}-${cleanName}.jpg`;
    }
  };

  // Helper to generate Canvas-based 19.5:25 Photo Blob
  const createPhotoBlob = async (student: any): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 390;
        canvas.height = 500; // 19.5 : 25 ratio
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => resolve(blob || new Blob([])), 'image/jpeg', 0.92);
        } else {
          resolve(new Blob([]));
        }
      };
      img.onerror = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 390;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.arc(195, 200, 90, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 64px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const initials = student.name.split(' ').map((n: string) => n[0]).join('');
          ctx.fillText(initials, 195, 200);

          ctx.font = 'bold 24px sans-serif';
          ctx.fillText(student.name, 195, 340);
          ctx.fillStyle = '#94a3b8';
          ctx.font = '20px monospace';
          ctx.fillText(student.admNo, 195, 380);
          canvas.toBlob((blob) => resolve(blob || new Blob([])), 'image/jpeg', 0.92);
        } else {
          resolve(new Blob([]));
        }
      };
      img.src = student.avatarUrl;
    });
  };

  // Generate Excel Spreadsheet (.xlsx compatible XML)
  const generateXlsxSpreadsheet = (students: any[]) => {
    let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="11"/>
   <Interior ss:Color="#EA580C" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Data">
   <Font ss:Size="10"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Mono">
   <Font ss:FontName="Courier New" ss:Bold="1" ss:Color="#0369A1" ss:Size="10"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Students Roster ${activeSession}">
  <Table ss:DefaultRowHeight="24">
   <Column ss:Width="160"/>
   <Column ss:Width="120"/>
   <Column ss:Width="150"/>
   <Column ss:Width="90"/>
   <Column ss:Width="70"/>
   <Column ss:Width="80"/>
   <Column ss:Width="100"/>
   <Column ss:Width="130"/>
   <Column ss:Width="140"/>
   <Column ss:Width="180"/>
   <Column ss:Width="90"/>
   <Column ss:Width="70"/>
   <Column ss:Width="80"/>
   <Column ss:Width="220"/>
   <Row ss:Height="28">
    <Cell ss:StyleID="Header"><Data ss:Type="String">Photo Filename (19.5x25)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">{t('col.admNo')}</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">{t('col.studentName')}</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Class</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Section</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Roll No</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">House</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Guardian Name</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Guardian Phone</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Student Email</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">{t('tabs.attendance')}</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">GPA</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Blood Group</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Residential Address</Data></Cell>
   </Row>`;

    students.forEach((s) => {
      const photoName = getFormattedPhotoName(s);
      xml += `
   <Row>
    <Cell ss:StyleID="Mono"><Data ss:Type="String">${photoName}</Data></Cell>
    <Cell ss:StyleID="Mono"><Data ss:Type="String">${s.admNo}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${s.name}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${s.class}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${s.section || 'A'}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${s.roll || '-'}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${s.house || 'Unassigned'}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${s.guardian || ''}</Data></Cell>
    <Cell ss:StyleID="Mono"><Data ss:Type="String">${s.phone || ''}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${s.email || ''}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${s.attendance || 'N/A'}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${s.gpa || 'N/A'}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${s.bloodGroup || 'O+'}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${s.address || ''}</Data></Cell>
   </Row>`;
    });

    xml += `
  </Table>
 </Worksheet>
</Workbook>`;
    return new Blob([xml], { type: 'application/vnd.ms-excel' });
  };

  // Main Export Handler
  const handleExecuteExport = async () => {
    setIsExporting(true);
    setExportProgressText('Preparing student dossier & assets...');

    try {
      const targetList = currentEnrolledList;

      if (exportFormat === 'xlsx') {
        setExportProgressText('Generating formatted Excel spreadsheet...');
        const blob = generateXlsxSpreadsheet(targetList);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VidyaMaxx_Students_${activeSession.replace(/[^a-zA-Z0-9]/g, '_')}_Roster.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'zip') {
        setExportProgressText(`Packaging ${targetList.length} student photos in 19.5:25 ratio...`);
        const zip = new JSZip();
        const photosFolder = zip.folder(`student_photos_${activeSession.replace(/[^a-zA-Z0-9]/g, '_')}`);

        for (let i = 0; i < targetList.length; i++) {
          const student = targetList[i];
          setExportProgressText(`Packing photo ${i + 1} of ${targetList.length} (${student.name})...`);
          const filename = getFormattedPhotoName(student);
          const photoBlob = await createPhotoBlob(student);
          photosFolder?.file(filename, photoBlob);
        }

        setExportProgressText('Compressing ZIP archive...');
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VidyaMaxx_Student_Photos_${activeSession.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'bundle') {
        setExportProgressText(`Building complete package (Excel Roster + ${targetList.length} Photos in 19.5:25 ratio)...`);
        const zip = new JSZip();

        const xlsxBlob = generateXlsxSpreadsheet(targetList);
        zip.file(`Students_Master_Roster_${activeSession.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`, xlsxBlob);

        const photosFolder = zip.folder('student_photos_19.5x25');
        for (let i = 0; i < targetList.length; i++) {
          const student = targetList[i];
          setExportProgressText(`Processing photo ${i + 1} of ${targetList.length} (${student.name})...`);
          const filename = getFormattedPhotoName(student);
          const photoBlob = await createPhotoBlob(student);
          photosFolder?.file(filename, photoBlob);
        }

        setExportProgressText('Finalizing bundled archive...');
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VidyaMaxx_Complete_Student_Bundle_${activeSession.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setExportProgressText('Export completed successfully!');
      setTimeout(() => {
        setIsExporting(false);
        setIsExportModalOpen(false);
        setExportProgressText('');
      }, 800);
    } catch (err) {
      console.error('Export failed', err);
      alert('Export failed. Please check permissions and retry.');
      setIsExporting(false);
      setExportProgressText('');
    }
  };


  // Main Students Master Table Columns
  const enrolledStudentColumns = [
    {
      header: isHindi ? 'फोटो' : 'Photo',
      accessorKey: 'photo',
      cell: (r: any) => (
        <div className="flex items-center justify-start">
          <div
            onClick={() => openStudentDrawer(r)}
            className="relative overflow-hidden rounded-md border border-border/80 shadow-xs w-10 h-[50px] shrink-0 bg-muted flex items-center justify-center cursor-pointer group hover:border-foreground/40 hover:shadow-sm transition-all"
            title={isHindi ? "360° स्टूडेंट प्रोफाइल देखें" : "Click to view 360° student profile"}
          >
            <img
              src={r.avatarUrl}
              alt={r.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onError={(e: any) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div
              className="w-full h-full bg-muted text-muted-foreground font-black text-xs hidden items-center justify-center border border-border"
            >
              {r.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: t('col.admNo'),
      accessorKey: 'admNo',
      cell: (r: any) => (
        <span className="font-mono font-semibold text-foreground/90 text-sm">
          {r.admNo}
        </span>
      ),
    },
    {
      header: t('col.studentName'),
      accessorKey: 'name',
      cell: (r: any) => (
        <button
          onClick={() => openStudentDrawer(r)}
          className="text-left font-bold text-foreground hover:underline cursor-pointer tracking-tight text-xs sm:text-sm max-w-[180px] sm:max-w-[220px] truncate block"
          title={r.name}
        >
          {r.name}
        </button>
      ),
    },
    {
      header: t('col.class'),
      accessorKey: 'class',
      cell: (r: any) => (
        <span className="font-medium text-foreground text-sm">
          {r.class} · Sec {r.section}
        </span>
      ),
    },
    {
      header: t('col.roll'),
      accessorKey: 'roll',
      align: 'center',
      cell: (r: any) => <span className="font-mono text-muted-foreground text-sm">{r.roll}</span>,
    },
    {
      header: t('col.house'),
      accessorKey: 'house',
      align: 'center',
      cell: (r: any) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-semibold bg-muted/60 text-muted-foreground border border-border">
          {r.house}
        </span>
      ),
    },
    {
      header: isHindi ? 'गार्जियन फोन' : 'Guardian Phone',
      accessorKey: 'phone',
      cell: (r: any) => <span className="text-muted-foreground font-mono text-sm">{r.phone}</span>,
    },
    {
      header: t('col.status'),
      accessorKey: 'status',
      align: 'center',
      cell: (r: any) => (
        <VFBadge variant={r.status === 'Active' ? 'success' : 'outline'}>
          {r.status === 'Active' ? (isHindi ? 'एक्टिव' : r.status) : r.status}
        </VFBadge>
      ),
    },
    {
      header: t('col.action'),
      accessorKey: 'action',
      align: 'center',
      cell: (r: any) => (
        <VFButton
          size="icon"
          variant="outline"
          className="h-7 w-7 border-border hover:border-zinc-500 rounded-[4px]"
          title={t('action.view') + ' ' + t('col.profile')}
          aria-label={t('action.view') + ' ' + t('col.profile')}
          onClick={() => openStudentDrawer(r)}
        >
          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
        </VFButton>
      ),
    },
  ];

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* Main Clean Enrolled Students Master Table */}
      <VFDataTable
        columns={enrolledStudentColumns}
        data={currentEnrolledList}
        filterPlaceholder={t('form.searchStudents')}
        rightActions={
          <VFButton
            variant="outline"
            size="sm"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => setIsExportModalOpen(true)}
          >
            {t('action.export')}
          </VFButton>
        }
      />

      {/* 360° STUDENT PROFILE SIDE DRAWER */}
      <VFDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsEditingStudent(false);
          setStudentFormData(null);
          setIsDrawerOpen(false);
        }}
        hideHeader={true}
        title={activeStudent ? activeStudent.name : 'Student Profile'}
        className="w-[850px] min-w-[320px] sm:min-w-[850px] max-w-[95vw]"
        bodyClassName="p-0 flex flex-col overflow-hidden"
        footerActions={
          <div className="flex items-center justify-between w-full gap-3 flex-wrap">
            {isEditingStudent ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-foreground bg-muted px-2.5 h-8 flex items-center rounded-md border border-border">
                    {studentFormData?.admNo || activeStudent?.admNo}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Editing Student Records
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <VFButton
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    {t('action.cancel')}
                  </VFButton>
                  <VFButton
                    size="sm"
                    leftIcon={<Check className="h-4 w-4" />}
                    onClick={handleSaveStudent}
                  >
                    {t('action.saveChanges')}
                  </VFButton>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1 bg-muted/60 h-8 px-1.5 rounded-md border border-border">
                  <button
                    onClick={handlePrevStudent}
                    disabled={selectedStudentIndex === 0}
                    className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted cursor-pointer transition-colors"
                    title="Previous Student (Keyboard: ←)"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold px-2 text-foreground select-none leading-none">
                    {selectedStudentIndex !== null ? selectedStudentIndex + 1 : 1} of {currentEnrolledList.length}
                  </span>
                  <button
                    onClick={handleNextStudent}
                    disabled={selectedStudentIndex === currentEnrolledList.length - 1}
                    className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted cursor-pointer transition-colors"
                    title="Next Student (Keyboard: →)"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <VFButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingStudent(false);
                      setStudentFormData(null);
                      setIsDrawerOpen(false);
                    }}
                  >
                    Cancel
                  </VFButton>
                  <VFButton
                    size="sm"
                    leftIcon={<Edit3 className="h-4 w-4" />}
                    onClick={handleStartEdit}
                  >
                    Edit Profile
                  </VFButton>
                </div>
              </>
            )}
          </div>
        }
      >
        {activeStudent && (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden animate-fade-in">
            <div className="w-full bg-card/95 backdrop-blur-md border-b border-border shrink-0">
              <div className="grid grid-cols-5 w-full">
                {[
                  { id: 'overview', label: 'Profile', icon: <UserCheck className="h-4 w-4" /> },
                  { id: 'academics', label: 'Academics', icon: <BarChart3 className="h-4 w-4" /> },
                  { id: 'credentials', label: 'ID & Certs', icon: <FileText className="h-4 w-4" /> },
                  { id: 'fees', label: 'Fees', icon: <CreditCard className="h-4 w-4" /> },
                  { id: 'scholarship', label: 'Scholarships', icon: <Award className="h-4 w-4" /> },
                ].map((tab) => {
                  const isActive = drawerTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setDrawerTab(tab.id as any)}
                      className={cn(
                        "flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-all cursor-pointer outline-none select-none border-b-2",
                        isActive
                          ? "bg-primary/10 text-primary border-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border-transparent"
                      )}
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              {drawerTab === 'overview' && (
                <div className="animate-fade-in divide-y divide-border/40">
                  <div>
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 px-4 py-3">
                      <div className="relative shrink-0 mx-auto sm:mx-0">
                        <input
                          type="file"
                          ref={avatarFileInputRef}
                          onChange={handleAvatarFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <div
                          onClick={() => {
                            if (isEditingStudent && avatarFileInputRef.current) {
                              avatarFileInputRef.current.click();
                            }
                          }}
                          className={cn(
                            "relative overflow-hidden rounded-md border border-border/90 shadow-sm w-24 sm:w-28 bg-muted flex items-center justify-center transition-all group",
                            isEditingStudent ? "cursor-pointer hover:ring-2 hover:ring-primary/60" : ""
                          )}
                          style={{ aspectRatio: '19.5 / 25' }}
                        >
                          <img
                            src={isEditingStudent && studentFormData?.avatarUrl ? studentFormData.avatarUrl : activeStudent.avatarUrl}
                            alt={isEditingStudent && studentFormData?.name ? studentFormData.name : activeStudent.name}
                            style={{ aspectRatio: '19.5 / 25' }}
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div
                            style={{ aspectRatio: '19.5 / 25' }}
                            className="w-full h-full bg-muted text-muted-foreground font-black text-2xl hidden items-center justify-center"
                          >
                            {(isEditingStudent && studentFormData?.name ? studentFormData.name : activeStudent.name).split(' ').map((n: string) => n[0]).join('')}
                          </div>

                          {isEditingStudent && (
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-white">
                              <Camera className="h-5 w-5 text-white" />
                              <span className="text-[10px] font-bold tracking-tight">Upload</span>
                            </div>
                          )}
                        </div>
                        {isEditingStudent ? (
                          <button
                            type="button"
                            onClick={() => avatarFileInputRef.current?.click()}
                            className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer border-2 border-card"
                            title="Change Student Photo"
                          >
                            <Camera className="h-3 w-3" />
                          </button>
                        ) : (
                          <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-card ring-2 ring-emerald-500/20" title="Active Enrollment" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
                        {dossierFields
                          .filter((f) => f.category === 'personal' && f.isVisible)
                          .map((f) => {
                            const val = isEditingStudent && studentFormData
                              ? (studentFormData[f.key] ?? '')
                              : getFieldValue(activeStudent, f.key);
                            return (
                              <div key={f.key} className={f.key === 'name' ? 'col-span-2 sm:col-span-2' : ''}>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                                  {f.label}
                                </label>
                                <input
                                  type="text"
                                  readOnly={!isEditingStudent}
                                  value={val}
                                  onChange={(e) => {
                                    if (isEditingStudent && studentFormData) {
                                      setStudentFormData({ ...studentFormData, [f.key]: e.target.value });
                                    }
                                  }}
                                  className={cn(
                                    "w-full h-9 px-3 text-xs rounded-md outline-none transition-all",
                                    isEditingStudent
                                      ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground font-semibold shadow-2xs"
                                      : "bg-muted/30 border border-border/70 text-foreground",
                                    f.key === 'name' ? "font-bold text-foreground" : "font-semibold text-foreground",
                                    f.key === 'admNo' || f.key === 'roll' || f.key === 'bloodGroup' || f.key === 'aadhaarNo' ? "font-mono" : ""
                                  )}
                                />
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-4 py-3">
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">Father / Primary Guardian Name</label>
                        <input
                          type="text"
                          readOnly={!isEditingStudent}
                          value={isEditingStudent && studentFormData ? (studentFormData.guardian ?? '') : (activeStudent.guardian ?? '')}
                          onChange={(e) => isEditingStudent && studentFormData && setStudentFormData({ ...studentFormData, guardian: e.target.value })}
                          className={cn(
                            "w-full h-9 px-3 text-xs font-semibold rounded-md outline-none transition-all",
                            isEditingStudent
                              ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground font-semibold shadow-2xs"
                              : "bg-muted/30 border border-border/70 text-foreground"
                          )}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">Mother's Full Legal Name</label>
                        <input
                          type="text"
                          readOnly={!isEditingStudent}
                          value={isEditingStudent && studentFormData ? (studentFormData.motherName ?? '') : (activeStudent.motherName ?? '')}
                          onChange={(e) => isEditingStudent && studentFormData && setStudentFormData({ ...studentFormData, motherName: e.target.value })}
                          className={cn(
                            "w-full h-9 px-3 text-xs font-semibold rounded-md outline-none transition-all",
                            isEditingStudent
                              ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground font-semibold shadow-2xs"
                              : "bg-muted/30 border border-border/70 text-foreground"
                          )}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">Primary Emergency Contact Number</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly={!isEditingStudent}
                            value={isEditingStudent && studentFormData ? (studentFormData.phone ?? '') : (activeStudent.phone ?? '')}
                            onChange={(e) => isEditingStudent && studentFormData && setStudentFormData({ ...studentFormData, phone: e.target.value })}
                            className={cn(
                              "flex-1 h-9 px-3 text-xs font-mono font-bold rounded-md outline-none transition-all",
                              isEditingStudent
                                ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                                : "bg-muted/30 border border-border/70 text-foreground"
                            )}
                          />
                          {!isEditingStudent && (
                            <>
                              <button
                                onClick={() => window.open(`https://wa.me/${activeStudent.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                                className="h-9 px-3 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span>WhatsApp</span>
                              </button>
                              <button
                                onClick={() => handleCopy(activeStudent.phone, 'phone')}
                                className="h-9 px-2.5 rounded-md bg-muted hover:bg-muted/80 border border-border text-foreground text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                              >
                                {copiedText === 'phone' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                                <span>{copiedText === 'phone' ? 'Copied' : 'Copy'}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">Institutional Email Address</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly={!isEditingStudent}
                            value={isEditingStudent && studentFormData ? (studentFormData.email ?? '') : (activeStudent.email ?? '')}
                            onChange={(e) => isEditingStudent && studentFormData && setStudentFormData({ ...studentFormData, email: e.target.value })}
                            className={cn(
                              "flex-1 h-9 px-3 text-xs font-mono font-semibold rounded-md outline-none truncate transition-all",
                              isEditingStudent
                                ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                                : "bg-muted/30 border border-border/70 text-foreground"
                            )}
                          />
                          {!isEditingStudent && (
                            <button
                              onClick={() => handleCopy(activeStudent.email, 'email')}
                              className="h-9 px-2 rounded-md bg-muted hover:bg-muted/80 border border-border text-foreground text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                            >
                              {copiedText === 'email' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">Residential Home Address</label>
                        <input
                          type="text"
                          readOnly={!isEditingStudent}
                          value={isEditingStudent && studentFormData ? (studentFormData.address ?? '') : (activeStudent.address ?? '')}
                          onChange={(e) => isEditingStudent && studentFormData && setStudentFormData({ ...studentFormData, address: e.target.value })}
                          className={cn(
                            "w-full h-9 px-3 text-xs font-semibold rounded-md outline-none truncate transition-all",
                            isEditingStudent
                              ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground font-semibold shadow-2xs"
                              : "bg-muted/30 border border-border/70 text-foreground"
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 py-3">
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">Assigned Class Teacher</label>
                        <input
                          type="text"
                          readOnly={!isEditingStudent}
                          value={isEditingStudent && studentFormData ? (studentFormData.classTeacher ?? '') : (activeStudent.classTeacher ?? '')}
                          onChange={(e) => isEditingStudent && studentFormData && setStudentFormData({ ...studentFormData, classTeacher: e.target.value })}
                          className={cn(
                            "w-full h-9 px-3 text-xs font-semibold rounded-md outline-none transition-all",
                            isEditingStudent
                              ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground font-semibold shadow-2xs"
                              : "bg-muted/30 border border-border/70 text-foreground"
                          )}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">Commute / Transport Route</label>
                        <input
                          type="text"
                          readOnly={!isEditingStudent}
                          value={isEditingStudent && studentFormData ? (studentFormData.transport ?? '') : (activeStudent.transport ?? '')}
                          onChange={(e) => isEditingStudent && studentFormData && setStudentFormData({ ...studentFormData, transport: e.target.value })}
                          className={cn(
                            "w-full h-9 px-3 text-xs font-semibold rounded-md outline-none transition-all",
                            isEditingStudent
                              ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground font-semibold shadow-2xs"
                              : "bg-muted/30 border border-border/70 text-foreground"
                          )}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">Fee Clearance Status</label>
                        <input
                          type="text"
                          readOnly={!isEditingStudent}
                          value={isEditingStudent && studentFormData ? (studentFormData.feeStatus ?? 'Paid') : (activeStudent.feeStatus || 'Paid (No Dues Pending)')}
                          onChange={(e) => isEditingStudent && studentFormData && setStudentFormData({ ...studentFormData, feeStatus: e.target.value })}
                          className={cn(
                            "w-full h-9 px-3 text-xs font-bold rounded-md outline-none transition-all",
                            isEditingStudent
                              ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                              : "bg-muted/30 border border-border/70 text-emerald-400"
                          )}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">Medical Remarks</label>
                        <input
                          type="text"
                          readOnly={!isEditingStudent}
                          value={isEditingStudent && studentFormData ? (studentFormData.medical ?? '') : (activeStudent.medical ?? '')}
                          onChange={(e) => isEditingStudent && studentFormData && setStudentFormData({ ...studentFormData, medical: e.target.value })}
                          className={cn(
                            "w-full h-9 px-3 text-xs font-semibold rounded-md outline-none transition-all",
                            isEditingStudent
                              ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground font-semibold shadow-2xs"
                              : "bg-muted/30 border border-border/70 text-foreground"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

                {/* TAB 2: ACADEMICS & EXAMS */}
                {drawerTab === 'academics' && (
                  <div className="animate-fade-in divide-y divide-border/40">
                    {/* KPI Score Overview Strip */}
                    <div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 py-3">
                        <div className="p-3 rounded-md bg-muted/30 border border-border/70 flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">Aggregate Score</span>
                          <span className="text-xl font-black text-foreground mt-0.5 block font-mono">477 / 500</span>
                          <span className="text-[10px] text-emerald-400 mt-0.5 font-bold flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> 95.4% (Grade A1)
                          </span>
                        </div>
                        <div className="p-3 rounded-md bg-muted/30 border border-border/70 flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">Class Rank</span>
                          <span className="text-xl font-black text-emerald-400 mt-0.5 block font-mono">#2 of 40</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5 block">Top 5% Cohort</span>
                        </div>
                        <div className="p-3 rounded-md bg-muted/30 border border-border/70 flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">GPA / CGPA</span>
                          <span className="text-xl font-black text-foreground mt-0.5 block font-mono">{activeStudent.gpa || '3.92'}</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5 block">Scale 4.0</span>
                        </div>
                        <div className="p-3 rounded-md bg-muted/30 border border-border/70 flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">Exam Attendance</span>
                          <span className="text-xl font-black text-emerald-400 mt-0.5 block font-mono">100%</span>
                          <span className="text-[10px] text-emerald-400 mt-0.5 block font-medium">5 / 5 Subjects</span>
                        </div>
                      </div>
                    </div>

                    {/* Assessment Scorecard Table */}
                    <div>
                      <div className="px-4 py-3 space-y-2.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span>Term 1 Summative Assessment Scorecard</span>
                            </h4>
                            <span className="text-[11px] text-muted-foreground">CBSE Standard Curriculum · Session {activeSession}</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Published & Verified
                          </span>
                        </div>

                        <div className="border border-border/70 rounded-md overflow-hidden bg-card text-xs shadow-2xs">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-muted/40 text-muted-foreground font-bold text-[10px] uppercase tracking-wider border-b border-border/60">
                                <th className="py-2.5 px-3 text-left">Subject & Code</th>
                                <th className="py-2.5 px-3 text-center">Max</th>
                                <th className="py-2.5 px-3 text-center">Obtained</th>
                                <th className="py-2.5 px-3 text-center">Percent</th>
                                <th className="py-2.5 px-3 text-center">Grade</th>
                                <th className="py-2.5 px-3 text-right">Result</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40 font-mono">
                              {[
                                { subject: 'Mathematics Core', code: '041', max: 100, score: 98, grade: 'A1', pct: '98%' },
                                { subject: 'Computer Applications', code: '165', max: 100, score: 99, grade: 'A1', pct: '99%' },
                                { subject: 'Science & Tech', code: '086', max: 100, score: 95, grade: 'A1', pct: '95%' },
                                { subject: 'Social Science', code: '087', max: 100, score: 94, grade: 'A1', pct: '94%' },
                                { subject: 'English Core', code: '301', max: 100, score: 92, grade: 'A1', pct: '92%' },
                              ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-muted/20 transition-colors">
                                  <td className="py-2.5 px-3 font-sans">
                                    <span className="font-semibold text-foreground block">{row.subject}</span>
                                    <span className="text-[10px] text-muted-foreground font-mono">CODE: {row.code}</span>
                                  </td>
                                  <td className="py-2.5 px-3 text-center text-muted-foreground">{row.max}</td>
                                  <td className="py-2.5 px-3 text-center font-bold text-foreground text-sm">{row.score}</td>
                                  <td className="py-2.5 px-3 text-center text-muted-foreground text-xs">{row.pct}</td>
                                  <td className="py-2.5 px-3 text-center">
                                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                      {row.grade}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-right font-sans font-bold text-emerald-400 text-xs">
                                    Passed
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Faculty Remark Card */}
                    <div>
                      <div className="px-4 py-3">
                        <div className="p-3.5 rounded-lg bg-card border border-border/80 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide flex items-center gap-1.5">
                              <Quote className="h-3 w-3 text-primary" />
                              <span>Principal & Class Mentor Evaluation</span>
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium">Verified by Academic Council</span>
                          </div>
                          <p className="text-foreground text-xs italic leading-relaxed">
                            "Aditya consistently exhibits exceptional analytical thinking in STEM disciplines and commendable institutional leadership across all inter-school competitions."
                          </p>
                          <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 flex-wrap gap-2">
                            <span>Evaluator: <strong>Dr. Rajesh Sharma (Head of Faculty)</strong></span>
                            <span>Assessment: <strong>Exemplary (Grade A1)</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tab Action Footer */}
                    <div>
                      <div className="px-4 py-3 flex items-center gap-2.5">
                        <VFButton
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          leftIcon={<Download className="h-3.5 w-3.5" />}
                          onClick={() => alert(`Downloading Term 1 Report Card PDF for ${activeStudent.name}`)}
                        >
                          Download Report Card (PDF)
                        </VFButton>
                        <VFButton
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          leftIcon={<Printer className="h-3.5 w-3.5" />}
                          onClick={() => alert(`Printing official academic transcript for ${activeStudent.name}`)}
                        >
                          Print Official Transcript
                        </VFButton>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: CERTIFICATES & ID CARD (BALANCED & PROPORTIONED) */}
                {drawerTab === 'credentials' && (
                  <div className="animate-fade-in divide-y divide-border/40">
                    {/* Top Row: Balanced ID Card (Left) & Board Registry (Right) */}
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4 py-3">
                        {/* 1. Student ID Badge Preview Card */}
                        <div className="p-3.5 rounded-lg bg-card border border-border/80 shadow-2xs flex flex-col justify-between space-y-3">
                          <div className="flex items-center justify-between border-b border-border/60 pb-2">
                            <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                              <QrCode className="h-4 w-4 text-muted-foreground" />
                              <span>Student ID Badge</span>
                            </h4>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              CR-80 (85×54mm)
                            </span>
                          </div>

                          {/* Compact ID Card Preview */}
                          <div className="w-full bg-gradient-to-br from-card via-card to-muted rounded-md border border-border/90 shadow-sm p-3 flex flex-col justify-between select-none relative overflow-hidden" style={{ aspectRatio: '85 / 54' }}>
                            <div className="flex items-center justify-between border-b border-border/50 pb-1">
                              <div className="flex items-center gap-1.5">
                                <div className="h-3.5 w-3.5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[8px] font-black">
                                  V
                                </div>
                                <span className="font-extrabold text-[10px] text-foreground tracking-tight">VidyaMaxx Academy</span>
                              </div>
                              <span className="text-[8px] font-mono font-bold px-1 rounded bg-muted border border-border text-muted-foreground">
                                2026–27
                              </span>
                            </div>

                            <div className="flex items-center gap-2.5 my-auto">
                              <div className="w-11 h-[56px] rounded border border-border/80 bg-muted overflow-hidden shrink-0 shadow-2xs" style={{ aspectRatio: '19.5 / 25' }}>
                                <img
                                  src={activeStudent.avatarUrl}
                                  alt={activeStudent.name}
                                  style={{ aspectRatio: '19.5 / 25' }}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0 space-y-0.5 text-left">
                                <h5 className="font-extrabold text-[11px] text-foreground truncate">{activeStudent.name}</h5>
                                <p className="font-mono text-[9px] text-muted-foreground font-semibold">{activeStudent.admNo}</p>
                                <p className="text-muted-foreground text-[9px]">
                                  {activeStudent.class} ({activeStudent.section}) · Roll #{activeStudent.roll}
                                </p>
                                <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground font-mono">
                                  <span>Blood: <strong className="text-foreground">{activeStudent.bloodGroup || 'B+'}</strong></span>
                                  <span>•</span>
                                  <span>{activeStudent.house}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-border/50 pt-0.5">
                              <div className="flex items-center gap-0.5 h-2 opacity-60">
                                <div className="h-full w-0.5 bg-foreground" />
                                <div className="h-full w-1 bg-foreground" />
                                <div className="h-full w-0.5 bg-foreground" />
                                <div className="h-full w-1 bg-foreground" />
                              </div>
                              <span className="text-[8px] font-mono text-emerald-400 font-bold">
                                {activeStudent.idCardStatus || 'ACTIVE'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <VFButton
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                              leftIcon={<Printer className="h-3.5 w-3.5" />}
                              onClick={() => openIdCardModal(activeStudent)}
                            >
                              Print ID Badge
                            </VFButton>
                            <VFButton
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                              leftIcon={<FileText className="h-3.5 w-3.5 text-muted-foreground" />}
                              onClick={() => alert(`Generated print-ready 85×54mm PDF for ${activeStudent.name}`)}
                            >
                              PDF Preview
                            </VFButton>
                          </div>
                        </div>

                        {/* 2. Official CBSE Board & LOC Registry */}
                        <div className="p-3.5 rounded-lg bg-card border border-border/80 shadow-2xs flex flex-col justify-between space-y-3">
                          <div className="flex items-center justify-between border-b border-border/60 pb-2">
                            <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                              <Send className="h-4 w-4 text-muted-foreground" />
                              <span>CBSE Board Examination Registry</span>
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              LOC Forwarded
                            </span>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="p-2.5 rounded-md bg-muted/30 border border-border/70 flex items-center justify-between">
                              <div>
                                <span className="text-[9px] text-muted-foreground uppercase font-bold block">Board Roll No</span>
                                <span className="font-mono text-xs font-bold text-foreground">{activeStudent.examRollNo || 'CBSE-2026-994812'}</span>
                              </div>
                              <button
                                onClick={() => handleCopy(activeStudent.examRollNo || 'CBSE-2026-994812', 'rollNo')}
                                className="h-7 px-2 rounded bg-muted hover:bg-muted/80 border border-border text-[11px] font-medium text-foreground flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                {copiedText === 'rollNo' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                                <span>{copiedText === 'rollNo' ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-2.5 rounded-md bg-muted/30 border border-border/70">
                                <span className="text-[9px] text-muted-foreground uppercase font-bold block">Center Code</span>
                                <span className="font-mono text-xs font-bold text-foreground">{activeStudent.centerCode || 'DEL-CENTRAL-401'}</span>
                              </div>
                              <div className="p-2.5 rounded-md bg-muted/30 border border-border/70">
                                <span className="text-[9px] text-muted-foreground uppercase font-bold block">CBSE Affiliation</span>
                                <span className="font-mono text-xs font-bold text-foreground">2130889</span>
                              </div>
                            </div>

                            <div className="p-2.5 rounded-md bg-muted/30 border border-border/70">
                              <span className="text-[9px] text-muted-foreground uppercase font-bold block">Exam Center Venue</span>
                              <span className="text-[11px] font-semibold text-foreground truncate block mt-0.5">Govt Model Sr Sec School, Sector 4, New Delhi</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <VFButton
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                              leftIcon={<FileCheck className="h-3.5 w-3.5" />}
                              onClick={() => alert(`Opening official CBSE LOC Verification Dossier for ${activeStudent.name}`)}
                            >
                              View LOC Form
                            </VFButton>
                            <VFButton
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                              leftIcon={<Award className="h-3.5 w-3.5" />}
                              onClick={() => alert(`Downloading Board Admit Card for ${activeStudent.name}`)}
                            >
                              Download Admit Card
                            </VFButton>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: 3 Equal Institutional Certificates */}
                    <div>
                      <div className="px-4 py-3 space-y-2.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            <span>Institutional Certificates Hub</span>
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                            Digital Seal & Verified
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {/* 1. Transfer Certificate */}
                          <div className="p-3 rounded-lg bg-card border border-border/80 shadow-2xs flex flex-col justify-between space-y-2.5 hover:border-foreground/30 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-foreground font-bold text-xs">
                                  <FileSpreadsheet className="h-4 w-4 text-primary" />
                                  <span>Transfer Certificate</span>
                                </div>
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  Clearance OK
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Official school leaving & migration certificate with verified accounts clearance.
                              </p>
                            </div>
                            <VFButton
                              size="sm"
                              variant="outline"
                              className="w-full text-xs"
                              leftIcon={<FileText className="h-3.5 w-3.5" />}
                              onClick={() => openCertificateModal('tc', activeStudent)}
                            >
                              Issue / Print TC
                            </VFButton>
                          </div>

                          {/* 2. Character Certificate */}
                          <div className="p-3 rounded-lg bg-card border border-border/80 shadow-2xs flex flex-col justify-between space-y-2.5 hover:border-foreground/30 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-foreground font-bold text-xs">
                                  <Award className="h-4 w-4 text-emerald-400" />
                                  <span>Character Certificate</span>
                                </div>
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  Exemplary
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Certifies exemplary moral conduct, behavioral discipline, and academic standing.
                              </p>
                            </div>
                            <VFButton
                              size="sm"
                              variant="outline"
                              className="w-full text-xs"
                              leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                              onClick={() => openCertificateModal('character', activeStudent)}
                            >
                              Character Certificate
                            </VFButton>
                          </div>

                          {/* 3. Bonafide Certificate */}
                          <div className="p-3 rounded-lg bg-card border border-border/80 shadow-2xs flex flex-col justify-between space-y-2.5 hover:border-foreground/30 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-foreground font-bold text-xs">
                                  <FileCheck className="h-4 w-4 text-blue-400" />
                                  <span>Bonafide Certificate</span>
                                </div>
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                  Instant
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Formal proof of active enrollment for passport, visa, bus pass, and bank records.
                              </p>
                            </div>
                            <VFButton
                              size="sm"
                              variant="outline"
                              className="w-full text-xs"
                              leftIcon={<Download className="h-3.5 w-3.5" />}
                              onClick={() => openCertificateModal('bonafide', activeStudent)}
                            >
                              Bonafide Certificate
                            </VFButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: FEE & CHARGES (ENHANCED PREVIEW & DIRECT REDIRECT) */}
                {drawerTab === 'fees' && (() => {
                  const feeData = getStudentFeeDetails(activeStudent);
                  const isFullyPaid = feeData.dueAmount === 0;

                  return (
                    <div className="animate-fade-in divide-y divide-border/40 text-xs">
                      {/* 1. Header with Direct Deep-Link Action Button */}
                      <div className="px-4 py-3 bg-muted/20 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                            <CreditCard className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-foreground text-sm">Fee Ledger & Payment Profile</h4>
                            <p className="text-[11px] text-muted-foreground">Session {activeSession} · {activeStudent.name} ({activeStudent.admNo})</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <VFButton
                            size="sm"
                            className="h-8 px-3 text-xs font-bold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs flex items-center gap-1.5"
                            onClick={() => {
                              navigate({ to: '/fees' });
                              window.location.href = `/fees?student=${encodeURIComponent(activeStudent.admNo)}`;
                            }}
                          >
                            <span>Open in Fees Module</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </VFButton>
                        </div>
                      </div>

                      {/* 2. Key Financial KPI Metrics Strip */}
                      <div className="p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <div className="p-3 rounded-md bg-[#161616] border border-border/80 flex flex-col justify-between shadow-2xs">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">Gross Assessed Fee</span>
                            <span className="text-xl font-black text-foreground mt-0.5 block font-mono">
                              ₹{feeData.grossFee.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-0.5 block">Standard Fee AY {activeSession}</span>
                          </div>

                          <div className="p-3 rounded-md bg-[#161616] border border-border/80 flex flex-col justify-between shadow-2xs">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">Scholarship Relief</span>
                            <span className="text-xl font-black text-emerald-400 mt-0.5 block font-mono">
                              {feeData.scholarshipRelief > 0 ? `- ₹${feeData.scholarshipRelief.toLocaleString('en-IN')}` : '₹ 0.00'}
                            </span>
                            <span className="text-[10px] text-emerald-400 mt-0.5 font-semibold block">
                              {feeData.scholarshipRelief > 0 ? 'Sanctioned Grant Waiver' : 'No Concession Applied'}
                            </span>
                          </div>

                          <div className="p-3 rounded-md bg-[#161616] border border-border/80 flex flex-col justify-between shadow-2xs">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">Realized / Paid</span>
                            <span className="text-xl font-black text-emerald-400 mt-0.5 block font-mono">
                              ₹{feeData.paidAmount.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-emerald-400 mt-0.5 font-bold flex items-center gap-1">
                              <CheckCheck className="h-3 w-3" />
                              {Math.round((feeData.paidAmount / feeData.netAssessedFee) * 100)}% Realized
                            </span>
                          </div>

                          <div className="p-3 rounded-md bg-[#161616] border border-border/80 flex flex-col justify-between shadow-2xs">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">Outstanding Due</span>
                            <span className={cn(
                              "text-xl font-black mt-0.5 block font-mono",
                              isFullyPaid ? "text-foreground" : "text-amber-400"
                            )}>
                              ₹{feeData.dueAmount.toLocaleString('en-IN')}
                            </span>
                            <span className={cn(
                              "text-[10px] mt-0.5 font-bold",
                              isFullyPaid ? "text-emerald-400" : "text-amber-400"
                            )}>
                              {isFullyPaid ? 'Zero Dues Pending' : `${feeData.status} Balance`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 3. Payment Plan & Due Cycle Summary Card */}
                      <div className="px-4 py-3">
                        <div className="p-3.5 rounded-md bg-[#141414] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-foreground text-xs uppercase tracking-wider">Payment Schedule:</span>
                              <VFBadge variant="primary" className="text-[10px] font-bold rounded-md">
                                {feeData.paymentPlan}
                              </VFBadge>
                              {feeData.paymentPlan === 'Monthly Installments' && (
                                <span className="text-[11px] font-mono text-zinc-400">
                                  (Due on {feeData.installmentDueDay}th of each month · ₹{feeData.monthlyFee.toLocaleString('en-IN')}/mo)
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                              <span>Next Billing Due Date: <strong className="text-foreground">{feeData.nextDueDate}</strong></span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {!isFullyPaid && (
                              <VFButton
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs font-bold rounded-md"
                                leftIcon={<Send className="h-3 w-3 text-amber-400" />}
                                onClick={() => addNotification({
                                  title: 'Payment Reminder Dispatched',
                                  description: `SMS & WhatsApp fee reminder sent to guardian of ${activeStudent.name}.`,
                                  type: 'success',
                                })}
                              >
                                Send Due Reminder
                              </VFButton>
                            )}
                            <VFButton
                              size="sm"
                              className="h-7 px-3 text-xs font-bold rounded-md"
                              onClick={() => {
                                window.location.href = `/fees?student=${encodeURIComponent(activeStudent.admNo)}`;
                              }}
                            >
                              {isFullyPaid ? 'View In Fees' : 'Collect Fee ↗'}
                            </VFButton>
                          </div>
                        </div>
                      </div>

                      {/* 4. 12-Month Installment Cycle Visual Progress Tracker */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between pb-1 border-b border-border/60">
                          <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>12-Month Installment Cycle Track (AY {activeSession})</span>
                          </h4>
                          <span className="text-[10px] font-mono font-bold text-emerald-400">
                            {feeData.monthsPaidCount} of {feeData.totalMonthsCount} Months Paid
                          </span>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {feeData.installments.map((inst, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "p-2 rounded-md border text-center transition-all flex flex-col justify-between",
                                inst.isPaid
                                  ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                                  : idx === feeData.monthsPaidCount
                                  ? "bg-amber-950/25 border-amber-500/50 text-amber-300"
                                  : "bg-[#141414] border-border/60 text-zinc-500 opacity-70"
                              )}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-[11px] truncate">{inst.month.split(' ')[0]}</span>
                                {inst.isPaid ? (
                                  <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                                ) : idx === feeData.monthsPaidCount ? (
                                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                                ) : null}
                              </div>
                              <span className="font-mono text-[10px] font-semibold mt-1 block">
                                ₹{inst.amount.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[9px] font-bold uppercase mt-0.5 block truncate">
                                {inst.isPaid ? 'Paid' : idx === feeData.monthsPaidCount ? 'Current Due' : 'Upcoming'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 5. Fee Component Breakdown Table */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between pb-1 border-b border-border/60">
                          <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <CreditCard className="h-4 w-4 text-primary" />
                            <span>Institutional Fee Breakdown & Structure</span>
                          </h4>
                          <span className="text-[10px] font-mono text-muted-foreground">CBSE Enrolled</span>
                        </div>

                        <div className="border border-border/70 rounded-md overflow-hidden bg-card text-xs shadow-2xs">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-muted/40 text-muted-foreground font-bold text-[10px] uppercase tracking-wider border-b border-border/60">
                                <th className="py-2.5 px-3 text-left">Fee Head / Component</th>
                                <th className="py-2.5 px-3 text-left">Billing Frequency</th>
                                <th className="py-2.5 px-3 text-right">Assessed Amount</th>
                                <th className="py-2.5 px-3 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40 font-mono">
                              <tr className="hover:bg-muted/20 transition-colors">
                                <td className="py-2.5 px-3 font-sans font-semibold text-foreground">Base Academic Tuition Fee</td>
                                <td className="py-2.5 px-3 font-sans text-muted-foreground text-[11px]">{feeData.paymentPlan}</td>
                                <td className="py-2.5 px-3 text-right font-bold text-foreground">₹{feeData.baseTuition.toLocaleString('en-IN')}</td>
                                <td className="py-2.5 px-3 text-right font-sans font-bold text-emerald-400">Assessed</td>
                              </tr>
                              {feeData.labTechFee > 0 && (
                                <tr className="hover:bg-muted/20 transition-colors">
                                  <td className="py-2.5 px-3 font-sans font-semibold text-foreground">Science & Computing Labs</td>
                                  <td className="py-2.5 px-3 font-sans text-muted-foreground text-[11px]">Annual</td>
                                  <td className="py-2.5 px-3 text-right font-bold text-foreground">₹{feeData.labTechFee.toLocaleString('en-IN')}</td>
                                  <td className="py-2.5 px-3 text-right font-sans font-bold text-emerald-400">Assessed</td>
                                </tr>
                              )}
                              {feeData.transportFee > 0 && (
                                <tr className="hover:bg-muted/20 transition-colors">
                                  <td className="py-2.5 px-3 font-sans font-semibold text-foreground">Transport Commute (Bus Route)</td>
                                  <td className="py-2.5 px-3 font-sans text-muted-foreground text-[11px]">Quarterly Cycle</td>
                                  <td className="py-2.5 px-3 text-right font-bold text-foreground">₹{feeData.transportFee.toLocaleString('en-IN')}</td>
                                  <td className="py-2.5 px-3 text-right font-sans font-bold text-emerald-400">Assessed</td>
                                </tr>
                              )}
                              {feeData.libraryFee > 0 && (
                                <tr className="hover:bg-muted/20 transition-colors">
                                  <td className="py-2.5 px-3 font-sans font-semibold text-foreground">Digital Library & Portals</td>
                                  <td className="py-2.5 px-3 font-sans text-muted-foreground text-[11px]">Annual</td>
                                  <td className="py-2.5 px-3 text-right font-bold text-foreground">₹{feeData.libraryFee.toLocaleString('en-IN')}</td>
                                  <td className="py-2.5 px-3 text-right font-sans font-bold text-emerald-400">Assessed</td>
                                </tr>
                              )}
                              {feeData.scholarshipRelief > 0 && (
                                <tr className="bg-emerald-950/20 text-emerald-300 font-semibold">
                                  <td className="py-2.5 px-3 font-sans">Less: Active Scholarship / Fee Concession</td>
                                  <td className="py-2.5 px-3 font-sans text-[11px]">Annual Deduction</td>
                                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400">- ₹{feeData.scholarshipRelief.toLocaleString('en-IN')}</td>
                                  <td className="py-2.5 px-3 text-right font-sans font-bold text-emerald-400">Waiver Applied</td>
                                </tr>
                              )}
                              <tr className="bg-muted/30 font-bold border-t border-border/80">
                                <td className="py-2.5 px-3 font-sans text-foreground">Net Assessed Annual Payable</td>
                                <td className="py-2.5 px-3 font-sans text-muted-foreground text-[11px]">AY {activeSession}</td>
                                <td className="py-2.5 px-3 text-right text-foreground font-black text-sm">₹{feeData.netAssessedFee.toLocaleString('en-IN')}</td>
                                <td className="py-2.5 px-3 text-right font-sans">
                                  <VFBadge variant={isFullyPaid ? 'success' : 'warning'} className="text-[10px] rounded-md">
                                    {feeData.status}
                                  </VFBadge>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* 6. Recent Payment Receipts Ledger */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between pb-1 border-b border-border/60">
                          <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <Receipt className="h-4 w-4 text-primary" />
                            <span>Recent Payment Receipts & Transactions</span>
                          </h4>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {feeData.recentReceipts.length} Recorded
                          </span>
                        </div>

                        <div className="space-y-2">
                          {feeData.recentReceipts.map((tx, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-card border border-border/80 shadow-2xs flex items-center justify-between gap-3 flex-wrap text-xs hover:border-zinc-600 transition-colors"
                            >
                              <div className="min-w-0">
                                <span className="font-bold text-foreground block">{tx.period}</span>
                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono mt-0.5">
                                  <span className="text-primary font-semibold">{tx.receiptNo}</span>
                                  <span>•</span>
                                  <span>{tx.date}</span>
                                  <span>•</span>
                                  <span>{tx.mode}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-black text-emerald-400 text-sm">
                                  ₹{tx.amount.toLocaleString('en-IN')}
                                </span>
                                <VFButton
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2.5 text-[11px] font-bold rounded-md"
                                  leftIcon={<Receipt className="h-3 w-3" />}
                                  onClick={() => addNotification({
                                    title: 'Receipt Downloaded',
                                    description: `Downloaded receipt #${tx.receiptNo} for ${activeStudent.name}.`,
                                    type: 'info',
                                  })}
                                >
                                  Receipt (PDF)
                                </VFButton>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 7. Consolidated Bottom Actions */}
                      <div className="px-4 py-3 bg-muted/10 flex items-center gap-2.5 flex-wrap">
                        <VFButton
                          size="sm"
                          className="flex-1 text-xs font-bold rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                          leftIcon={<ExternalLink className="h-3.5 w-3.5" />}
                          onClick={() => {
                            window.location.href = `/fees?student=${encodeURIComponent(activeStudent.admNo)}`;
                          }}
                        >
                          Manage in Fees Module
                        </VFButton>
                        <VFButton
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs font-bold rounded-md"
                          leftIcon={<Download className="h-3.5 w-3.5" />}
                          onClick={() => addNotification({
                            title: 'Certificate Generated',
                            description: `Annual Fee Clearance Certificate generated for ${activeStudent.name}.`,
                            type: 'success',
                          })}
                        >
                          Fee Clearance Certificate
                        </VFButton>
                        <VFButton
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs font-bold rounded-md"
                          leftIcon={<Printer className="h-3.5 w-3.5" />}
                          onClick={() => addNotification({
                            title: 'Account Statement Printed',
                            description: `Consolidated statement printed for ${activeStudent.name}.`,
                            type: 'info',
                          })}
                        >
                          Print Statement
                        </VFButton>
                      </div>
                    </div>
                  );
                })()}

                {/* TAB 5: SCHOLARSHIPS & AID */}
                {drawerTab === 'scholarship' && (() => {
                  const activeScholarship = ACTIVE_STUDENT_SCHOLARSHIPS[activeStudent.admNo];

                  return (
                    <div className="animate-fade-in divide-y divide-border/40 text-xs">
                      {/* 1. Grant Summary Header */}
                      <div className="px-4 py-3 bg-muted/20 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-8 w-8 rounded-md flex items-center justify-center border shrink-0",
                            activeScholarship ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "bg-muted/40 text-muted-foreground border-border"
                          )}>
                            <Award className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground text-sm">Scholarship & Fee Relief Records</h4>
                            <p className="text-[11px] text-muted-foreground">Session {activeSession} · {activeStudent.name} ({activeStudent.admNo})</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {activeScholarship ? (
                            <VFBadge variant="success" className="text-xs font-bold rounded-md">
                              Active Fee Concession
                            </VFBadge>
                          ) : (
                            <VFBadge variant="outline" className="text-xs font-bold rounded-md text-zinc-400 border-zinc-700 bg-[#161616]">
                              No Active Scholarship
                            </VFBadge>
                          )}
                          <VFButton
                            size="sm"
                            className="h-8 px-3 text-xs font-bold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs flex items-center gap-1.5"
                            onClick={() => {
                              navigate({ to: '/scholarships' });
                              window.location.href = `/scholarships?student=${encodeURIComponent(activeStudent.admNo)}&name=${encodeURIComponent(activeStudent.name)}${activeScholarship ? '' : '&apply=true'}`;
                            }}
                          >
                            <span>{activeScholarship ? 'Open in Scholarships' : 'Apply in Scholarships'}</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </VFButton>
                        </div>
                      </div>

                      {/* 2. If Active Grant: Sanction Order Details ONLY (No other schemes shown) */}
                      {activeScholarship ? (
                        <div className="p-4 space-y-3">
                          <div className="p-4 rounded-md bg-card border border-border/80 space-y-2.5 shadow-2xs">
                            <div className="flex items-center justify-between pb-2 border-b border-border/50">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Sanctioned Scheme</span>
                                <h4 className="text-sm font-extrabold text-foreground mt-0.5">
                                  {activeScholarship.schemeName}
                                </h4>
                              </div>
                              <div className="text-right">
                                <span className="text-base font-black text-emerald-400 font-mono block">{activeScholarship.waiverPercentage}% Tuition Waiver</span>
                                <span className="text-[10px] text-muted-foreground font-semibold">₹{activeScholarship.waiverAmount.toLocaleString('en-IN')} / AY Saved</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-[11px]">
                              <div>
                                <span className="text-muted-foreground block text-[10px]">Funding Agency:</span>
                                <span className="font-semibold text-foreground">{activeScholarship.fundingAgency}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[10px]">Disbursal Mode:</span>
                                <span className="font-mono text-foreground font-medium">{activeScholarship.disbursalMode}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[10px]">Sanction Ref ID:</span>
                                <span className="font-mono font-bold text-primary">{activeScholarship.sanctionRef}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[10px]">Sanction Date:</span>
                                <span className="font-medium text-foreground">{activeScholarship.sanctionDate}</span>
                              </div>
                            </div>

                            <div className="p-2.5 rounded bg-muted/40 border border-border/60 text-[11px] text-muted-foreground">
                              <span className="font-bold text-foreground">Verification Note: </span>
                              {activeScholarship.notes}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3 rounded-md bg-muted/30 border border-border/70">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Total Assessed Fee</span>
                              <span className="text-lg font-black text-foreground font-mono mt-0.5 block">₹ 42,000</span>
                            </div>
                            <div className="p-3 rounded-md bg-muted/30 border border-border/70">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Scholarship Relief</span>
                              <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">- ₹{activeScholarship.waiverAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="p-3 rounded-md bg-muted/30 border border-border/70">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Net Due by Guardian</span>
                              <span className="text-lg font-black text-foreground font-mono mt-0.5 block">₹{(42000 - activeScholarship.waiverAmount).toLocaleString('en-IN')}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1 flex-wrap">
                            <VFButton
                              size="sm"
                              className="flex-1 text-xs font-bold rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                              leftIcon={<ExternalLink className="h-3.5 w-3.5" />}
                              onClick={() => {
                                navigate({ to: '/scholarships' });
                                window.location.href = `/scholarships?student=${encodeURIComponent(activeStudent.admNo)}`;
                              }}
                            >
                              Manage in Scholarships Module
                            </VFButton>
                            <VFButton
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs font-bold rounded-md"
                              leftIcon={<Download className="h-3.5 w-3.5" />}
                              onClick={() => addNotification({ title: 'Sanction Order Downloaded', description: `Sanction certificate downloaded for ${activeStudent.name}.`, type: 'info' })}
                            >
                              Sanction Order (PDF)
                            </VFButton>
                            <VFButton
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs font-bold rounded-md"
                              leftIcon={<FileCheck className="h-3.5 w-3.5" />}
                              onClick={() => addNotification({ title: 'Renewal Verified', description: `Scholarship renewal verified on NSP portal.`, type: 'success' })}
                            >
                              Verify Status
                            </VFButton>
                          </div>
                        </div>
                      ) : (
                        /* 3. If No Active Grant: Available Schemes & Eligibility with Direct Apply into Scholarships Module */
                        <div className="p-4 space-y-2.5">
                          <div className="flex items-center justify-between pb-1 border-b border-border/60">
                            <h4 className="font-extrabold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <ShieldCheck className="h-4 w-4 text-primary" />
                              <span>Scholarship Schemes & Eligibility</span>
                            </h4>
                            <span className="text-[10px] text-muted-foreground font-mono">Limit: 1 per student</span>
                          </div>

                          <div className="space-y-1.5">
                            {AVAILABLE_SCHOLARSHIP_SCHEMES.map((scheme) => {
                              const eligibility = scheme.checkEligibility(activeStudent);

                              return (
                                <div
                                  key={scheme.id}
                                  className="p-2.5 rounded-md bg-[#161616] border border-border/70 flex items-center justify-between gap-3 transition-colors hover:border-zinc-700"
                                >
                                  <div className="min-w-0 flex items-center gap-2">
                                    <span className="font-bold text-foreground truncate text-xs">{scheme.name}</span>
                                    <span className="text-[11px] font-mono font-semibold text-emerald-400 shrink-0">
                                      {scheme.benefit.split('(')[1] ? `(${scheme.benefit.split('(')[1]}` : `(${scheme.benefit})`}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    {eligibility.isEligible ? (
                                      <>
                                        <VFBadge variant="primary" className="text-[10px] font-bold rounded-md">
                                          Eligible
                                        </VFBadge>
                                        <VFButton
                                          size="sm"
                                          className="h-6 px-2.5 text-[10px] font-bold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1"
                                          onClick={() => {
                                            navigate({ to: '/scholarships' });
                                            window.location.href = `/scholarships?student=${encodeURIComponent(activeStudent.admNo)}&scheme=${encodeURIComponent(scheme.id)}&apply=true`;
                                          }}
                                        >
                                          <span>Apply</span>
                                          <ExternalLink className="h-3 w-3" />
                                        </VFButton>
                                      </>
                                    ) : (
                                      <VFBadge variant="danger" className="text-[10px] font-bold rounded-md">
                                        Not Eligible
                                      </VFBadge>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
            </div>
          </div>
        )}
      </VFDrawer>

      <VFDialog
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        title={
          certificateType === 'tc'
            ? 'Official Transfer Certificate (TC)'
            : certificateType === 'character'
            ? 'Character & Conduct Certificate'
            : 'Bonafide Student Certificate'
        }
        description={`Institutional certificate generation and issuance for ${certificateStudent?.name || 'student'}`}
        className="max-w-xl"
        footerActions={
          <>
            <VFButton
              variant="outline"
              size="sm"
              onClick={() => setIsCertificateModalOpen(false)}
            >
              Cancel
            </VFButton>
            <VFButton
              size="sm"
              leftIcon={<Printer className="h-4 w-4" />}
              onClick={() => {
                alert(`Printing official ${certificateType.toUpperCase()} for ${certificateStudent?.name}`);
                setIsCertificateModalOpen(false);
              }}
            >
              Print Certificate
            </VFButton>
          </>
        }
      >
        {certificateStudent && (
          <div className="p-2 space-y-4 text-xs">
            <div className="p-4 rounded-md border border-border/80 bg-card space-y-3 font-sans">
              <div className="text-center border-b border-border/60 pb-3">
                <h3 className="font-black text-sm uppercase tracking-wider text-foreground">
                  VidyaMaxx Senior Secondary Academy
                </h3>
                <p className="text-[10px] text-muted-foreground">CBSE Affiliation No: 2130889 · Sector 14, New Delhi</p>
                <div className="inline-block mt-2 px-3 py-1 rounded bg-muted border border-border">
                  <span className="font-bold text-xs uppercase text-foreground">
                    {certificateType === 'tc'
                      ? 'TRANSFER CERTIFICATE (TC)'
                      : certificateType === 'character'
                      ? 'CHARACTER & CONDUCT CERTIFICATE'
                      : 'BONAFIDE STUDENT CERTIFICATE'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-1">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">{t('col.studentName')}</span>
                  <span className="font-bold text-foreground text-xs">{certificateStudent.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">Admission / Scholar No</span>
                  <span className="font-mono font-bold text-foreground text-xs">{certificateStudent.admNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">{t('col.class')}</span>
                  <span className="font-semibold text-foreground text-xs">{certificateStudent.class} (Sec {certificateStudent.section})</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">Academic Session</span>
                  <span className="font-mono font-semibold text-foreground text-xs">{activeSession}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">Father / Guardian</span>
                  <span className="font-medium text-foreground text-xs">{certificateStudent.guardian}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">Issue Serial No</span>
                  <span className="font-mono font-bold text-emerald-400 text-xs">
                    {certificateType.toUpperCase()}-{activeSession.substring(0, 4)}-00492
                  </span>
                </div>
              </div>

              {certificateType === 'tc' && (
                <div className="pt-2 border-t border-border/60 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase block font-bold mb-0.5">TC Reason</label>
                      <VFSelect
                        value={tcReason}
                        onChange={(e) => setTcReason(String(e.target.value))}
                        options={[
                          { value: 'Parent Relocation', label: 'Parent Relocation' },
                          { value: 'Higher Studies', label: 'Higher Studies' },
                          { value: 'Board Stream Change', label: 'Board Stream Change' },
                          { value: 'Personal Reasons', label: 'Personal Reasons' },
                        ]}
                        size="sm"
                        className="w-full bg-muted/60 border-border rounded-md text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase block font-bold">Destination School</label>
                      <input
                        type="text"
                        value={destinationSchool}
                        onChange={(e) => setDestinationSchool(e.target.value)}
                        placeholder="e.g. Modern School, Barakhamba"
                        className="w-full bg-muted border border-border rounded-md px-2 py-1 text-xs text-foreground mt-0.5 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Verified by Institutional Registrar</span>
                <span className="font-serif italic font-bold text-foreground">Principal Seal & Signature</span>
              </div>
            </div>
          </div>
        )}
      </VFDialog>

      <VFDialog
        isOpen={isIdCardModalOpen}
        onClose={() => setIsIdCardModalOpen(false)}
        title="Student Identity Card (CR-80 Standard)"
        description="Standard 85.6mm × 54mm physical card badge with 19.5:25 biometric portrait"
        className="max-w-lg"
        footerActions={
          <>
            <VFButton
              variant="outline"
              size="sm"
              onClick={() => setIsIdCardModalOpen(false)}
            >
              Close
            </VFButton>
            <VFButton
              size="sm"
              leftIcon={<Printer className="h-4 w-4" />}
              onClick={() => {
                alert(`Sending ID Badge print job to institutional badge printer for ${idCardStudent?.name}`);
                setIsIdCardModalOpen(false);
              }}
            >
              Print Card (85×54mm)
            </VFButton>
          </>
        }
      >
        {idCardStudent && (
          <div className="p-2 flex flex-col items-center justify-center space-y-3">
            <div
              className="w-full max-w-[425px] rounded-md border border-border/80 bg-gradient-to-br from-card via-card to-muted/40 shadow-xl p-4 flex flex-col justify-between relative overflow-hidden"
              style={{ aspectRatio: '85 / 54' }}
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                    VIDYAMAXX INTERNATIONAL ACADEMY
                  </h4>
                  <p className="text-[9px] text-muted-foreground">CBSE Affiliated · AY {activeSession}</p>
                </div>
                <span className="text-[9px] font-mono font-bold text-muted-foreground border border-border px-1 rounded">
                  85 × 54 mm
                </span>
              </div>

              <div className="flex items-center gap-3.5 py-1.5">
                <div
                  className="relative overflow-hidden rounded-md border border-border shadow-2xs w-[72px] h-[92px] bg-muted shrink-0 flex items-center justify-center"
                  style={{ aspectRatio: '19.5 / 25' }}
                >
                  <img
                    src={idCardStudent.avatarUrl}
                    alt={idCardStudent.name}
                    style={{ aspectRatio: '19.5 / 25' }}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-0.5 text-xs">
                  <h4 className="font-bold text-foreground text-sm truncate">{idCardStudent.name}</h4>
                  <p className="font-mono text-[11px] text-muted-foreground font-semibold">{idCardStudent.admNo}</p>
                  <p className="text-muted-foreground text-[11px]">
                    {idCardStudent.class} (Sec {idCardStudent.section}) · Roll #{idCardStudent.roll}
                  </p>
                  <div className="flex items-center gap-2 pt-0.5 text-[10px] text-muted-foreground">
                    <span>Blood: <strong>{idCardStudent.bloodGroup || 'B+'}</strong></span>
                    <span>•</span>
                    <span>{idCardStudent.house}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono truncate">
                    Emergency: {idCardStudent.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/60 pt-1 text-[9px] font-mono text-muted-foreground">
                <div className="flex items-center gap-0.5 h-3.5 opacity-70">
                  <div className="h-full w-0.5 bg-foreground" />
                  <div className="h-full w-1 bg-foreground" />
                  <div className="h-full w-0.5 bg-foreground" />
                  <div className="h-full w-1.5 bg-foreground" />
                  <div className="h-full w-0.5 bg-foreground" />
                  <div className="h-full w-2 bg-foreground" />
                  <div className="h-full w-0.5 bg-foreground" />
                  <div className="h-full w-1 bg-foreground" />
                </div>
                <span>*{idCardStudent.admNo}*</span>
                <span className="text-emerald-400 font-bold">{idCardStudent.idCardStatus || 'Active'}</span>
              </div>
            </div>
          </div>
        )}
      </VFDialog>

      <VFDialog
        isOpen={isExportModalOpen}
        onClose={() => { if (!isExporting) setIsExportModalOpen(false); }}
        title="Export Student Directory & Media Package"
        description={`Download structured student records, institutional spreadsheets, and high-resolution 19.5 : 25 photo archives for Academic Session ${activeSession}.`}
        className="max-w-4xl w-full"
        footerActions={
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
              <span>{currentEnrolledList.length} Students Selected for Export</span>
            </div>
            <div className="flex items-center gap-2.5">
              <VFButton
                variant="outline"
                size="md"
                onClick={() => setIsExportModalOpen(false)}
                disabled={isExporting}
              >
                Cancel
              </VFButton>
              <VFButton
                size="md"
                leftIcon={isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                onClick={handleExecuteExport}
                disabled={isExporting}
                className="font-bold min-w-[160px]"
              >
                {isExporting
                  ? 'Generating...'
                  : exportFormat === 'bundle'
                  ? 'Export Bundle (.zip)'
                  : exportFormat === 'xlsx'
                  ? 'Export Excel (.xlsx)'
                  : 'Export Photos (.zip)'}
              </VFButton>
            </div>
          </div>
        }
      >
        <div className="space-y-5 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-muted/40 border border-border/80 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-md bg-blue-500/15 text-blue-400 flex items-center justify-center font-black shrink-0 border border-blue-500/30">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wider">Session Context</p>
                <p className="font-bold text-foreground truncate">{activeSession}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-md bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-black shrink-0 border border-emerald-500/30">
                <Users className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wider">Total Population</p>
                <p className="font-bold text-foreground truncate">{currentEnrolledList.length} Active Records</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-md bg-purple-500/15 text-purple-400 flex items-center justify-center font-black shrink-0 border border-purple-500/30">
                <ImageIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wider">Media Format</p>
                <p className="font-bold text-foreground truncate">19.5 : 25 Portrait Aspect</p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black">1</span>
                Choose Export Package
              </label>
              <span className="text-[11px] text-muted-foreground font-medium">Select desired data and media bundle format</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div
                onClick={() => setExportFormat('bundle')}
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden group shadow-xs",
                  exportFormat === 'bundle'
                    ? "bg-blue-500/10 border-blue-500/80 shadow-md ring-1 ring-blue-500/40"
                    : "bg-[#1a1a24] border-border/80 hover:border-border hover:bg-[#20202d]"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn(
                      "h-10 w-10 rounded-md flex items-center justify-center border transition-all",
                      exportFormat === 'bundle'
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                        : "bg-muted text-muted-foreground border-border"
                    )}>
                      <Archive className="h-5 w-5" />
                    </div>
                    {exportFormat === 'bundle' ? (
                      <CheckCircle2 className="h-5 w-5 text-blue-400 animate-in zoom-in-50" />
                    ) : (
                      <VFBadge variant="outline" className="text-[10px]">Popular</VFBadge>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-foreground mb-1">Complete Bundle (.zip)</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Excel master spreadsheet + HD student portraits in standardized 19.5:25 ratio.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="text-blue-400 font-bold">✓</span> Full demographic columns
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="text-blue-400 font-bold">✓</span> {currentEnrolledList.length} Photos packaged in ZIP
                  </div>
                </div>
              </div>

              <div
                onClick={() => setExportFormat('xlsx')}
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden group shadow-xs",
                  exportFormat === 'xlsx'
                    ? "bg-emerald-500/10 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/40"
                    : "bg-[#1a1a24] border-border/80 hover:border-border hover:bg-[#20202d]"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn(
                      "h-10 w-10 rounded-md flex items-center justify-center border transition-all",
                      exportFormat === 'xlsx'
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-muted text-muted-foreground border-border"
                    )}>
                      <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    {exportFormat === 'xlsx' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 animate-in zoom-in-50" />
                    ) : (
                      <VFBadge variant="outline" className="text-[10px]">Fast</VFBadge>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-foreground mb-1">Excel Sheet (.xlsx)</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Formatted tables with admission IDs, contacts, academic records, and photo filenames.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="text-emerald-400 font-bold">✓</span> Clean Excel workbook
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="text-emerald-400 font-bold">✓</span> Photo URLs & filenames linked
                  </div>
                </div>
              </div>

              <div
                onClick={() => setExportFormat('zip')}
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden group shadow-xs",
                  exportFormat === 'zip'
                    ? "bg-purple-500/10 border-purple-500/80 shadow-md ring-1 ring-purple-500/40"
                    : "bg-[#1a1a24] border-border/80 hover:border-border hover:bg-[#20202d]"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn(
                      "h-10 w-10 rounded-md flex items-center justify-center border transition-all",
                      exportFormat === 'zip'
                        ? "bg-purple-500/20 text-purple-400 border-purple-500/40"
                        : "bg-muted text-muted-foreground border-border"
                    )}>
                      <Download className="h-5 w-5" />
                    </div>
                    {exportFormat === 'zip' ? (
                      <CheckCircle2 className="h-5 w-5 text-purple-400 animate-in zoom-in-50" />
                    ) : (
                      <VFBadge variant="outline" className="text-[10px]">Media Only</VFBadge>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-foreground mb-1">Photos ZIP (.zip)</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Student portraits rendered in exact 19.5:25 ratio with standardized filenames.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="text-purple-400 font-bold">✓</span> Standardized 19.5:25 aspect
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="text-purple-400 font-bold">✓</span> {currentEnrolledList.length} Images in archive
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(exportFormat === 'zip' || exportFormat === 'bundle') && (
            <div className="p-4 rounded-lg bg-[#1a1a24] border border-border/90 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black">2</span>
                  Photo File Naming Template
                </label>
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Settings className="h-3.5 w-3.5" />
                  Aspect Ratio: 19.5 : 25
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label
                  onClick={() => setNamingPattern('id-name')}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md border text-xs font-bold cursor-pointer transition-all",
                    namingPattern === 'id-name'
                      ? "bg-primary/10 border-primary text-foreground shadow-xs"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  <input
                    type="radio"
                    name="naming"
                    checked={namingPattern === 'id-name'}
                    onChange={() => setNamingPattern('id-name')}
                    className="text-primary accent-primary h-4 w-4"
                  />
                  <div>
                    <span className="block font-mono text-xs">{`{Admission ID}-{Student Name}.jpg`}</span>
                    <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">E.g., ADM-2026-001-Aditya_Verma.jpg</span>
                  </div>
                </label>

                <label
                  onClick={() => setNamingPattern('roll-name')}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md border text-xs font-bold cursor-pointer transition-all",
                    namingPattern === 'roll-name'
                      ? "bg-primary/10 border-primary text-foreground shadow-xs"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  <input
                    type="radio"
                    name="naming"
                    checked={namingPattern === 'roll-name'}
                    onChange={() => setNamingPattern('roll-name')}
                    className="text-primary accent-primary h-4 w-4"
                  />
                  <div>
                    <span className="block font-mono text-xs">{`{Roll No}_{Student Name}.jpg`}</span>
                    <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">E.g., 101_Aditya_Verma.jpg</span>
                  </div>
                </label>

                <label
                  onClick={() => setNamingPattern('name-id')}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md border text-xs font-bold cursor-pointer transition-all",
                    namingPattern === 'name-id'
                      ? "bg-primary/10 border-primary text-foreground shadow-xs"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  <input
                    type="radio"
                    name="naming"
                    checked={namingPattern === 'name-id'}
                    onChange={() => setNamingPattern('name-id')}
                    className="text-primary accent-primary h-4 w-4"
                  />
                  <div>
                    <span className="block font-mono text-xs">{`{Student Name}_{Admission ID}.jpg`}</span>
                    <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">E.g., Aditya_Verma_ADM-2026-001.jpg</span>
                  </div>
                </label>

                <label
                  onClick={() => setNamingPattern('custom')}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md border text-xs font-bold cursor-pointer transition-all",
                    namingPattern === 'custom'
                      ? "bg-primary/10 border-primary text-foreground shadow-xs"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  <input
                    type="radio"
                    name="naming"
                    checked={namingPattern === 'custom'}
                    onChange={() => setNamingPattern('custom')}
                    className="text-primary accent-primary h-4 w-4"
                  />
                  <div>
                    <span className="block font-mono text-xs">Custom Column Prefix</span>
                    <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">Select custom unique identifier</span>
                  </div>
                </label>
              </div>

              {namingPattern === 'custom' && (
                <div className="flex items-center gap-3 p-2.5 rounded-md bg-[#131317] border border-border">
                  <span className="text-xs font-bold text-foreground">Unique Column Identifier:</span>
                  <VFSelect
                    value={customColumnKey}
                    onChange={(e) => setCustomColumnKey(String(e.target.value))}
                    options={[
                      { value: 'fatherPhone', label: "Father's Phone Number" },
                      { value: 'category', label: 'Student Caste Category' },
                      { value: 'address', label: 'Permanent City / Address' },
                      { value: 'scholarStatus', label: 'Scholarship / RTE Status' },
                    ]}
                    size="sm"
                    className="w-56 bg-[#1a1a24] border-border text-xs font-bold text-foreground rounded-md"
                  />
                </div>
              )}

              <div className="p-3 rounded-md bg-[#131317] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-muted-foreground">Generated Output Sample:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/30">
                    {currentEnrolledList[0] ? getFormattedPhotoName(currentEnrolledList[0]) : 'ADM-2026-001-Aditya_Verma.jpg'}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-bold font-mono">390×500px</span>
                </div>
              </div>
            </div>
          )}

          {isExporting && (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 flex items-center gap-3.5 animate-pulse">
              <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
              <div>
                <p className="text-sm font-black text-primary">{exportProgressText}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Please keep this window open while the archive is generated.</p>
              </div>
            </div>
          )}
        </div>
      </VFDialog>

      {/* ⚙️ CONFIGURE PROFILE FIELDS MODAL */}
      <VFDialog
        isOpen={isFieldConfigOpen}
        onClose={() => setIsFieldConfigOpen(false)}
        title="Configure Student Profile Fields"
        description="Customize, enable, disable, and add custom fields for student profiles."
        className="max-w-2xl"
        footerActions={
          <VFButton size="sm" onClick={() => setIsFieldConfigOpen(false)}>
            Done & Apply
          </VFButton>
        }
      >
        <div className="space-y-5 py-1">
          {/* Add New Custom Field Box */}
          <div className="p-4 rounded-lg bg-muted/40 border border-border/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Plus className="h-4 w-4 text-primary" />
              <span>Add New Custom Field</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                  Field Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Passport Number, Mother Tongue, Bus Stop"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCustomField();
                  }}
                  className="w-full h-9 px-3 text-xs text-foreground bg-card border border-border rounded-[4px] outline-none focus:border-zinc-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                  Section Category
                </label>
                <VFSelect
                  value={newFieldCategory}
                  onChange={(e) => setNewFieldCategory(String(e.target.value) as any)}
                  options={[
                    { value: 'personal', label: 'Personal Identity' },
                    { value: 'family', label: 'Family & Contacts' },
                    { value: 'operations', label: 'Operations & Transport' },
                  ]}
                  size="sm"
                  className="w-full bg-card border border-border rounded-md text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <VFButton
                size="sm"
                variant="outline"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
                onClick={handleAddCustomField}
                disabled={!newFieldLabel.trim()}
              >
                Add Field
              </VFButton>
            </div>
          </div>

          {/* List of Fields grouped by category */}
          {(['personal', 'family', 'operations'] as const).map((cat) => {
            const catFields = dossierFields.filter((f) => f.category === cat);
            const catTitle =
              cat === 'personal'
                ? 'Personal & Academic Identity'
                : cat === 'family'
                ? 'Family & Emergency Contacts'
                : 'Operations, Transport & Medical';
            return (
              <div key={cat} className="space-y-2">
                <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {catTitle} ({catFields.filter((f) => f.isVisible).length} / {catFields.length} Active)
                </h5>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {catFields.map((field) => (
                    <div
                      key={field.key}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-md border text-xs transition-colors",
                        field.isVisible
                          ? "bg-card border-border/80 text-foreground"
                          : "bg-muted/20 border-border/40 text-muted-foreground"
                      )}
                    >
                      <label className="flex items-center gap-2.5 cursor-pointer flex-1 select-none">
                        <input
                          type="checkbox"
                          checked={field.isVisible}
                          onChange={() => handleToggleField(field.key)}
                          className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        />
                        <span className={cn("font-medium", field.isVisible ? "text-foreground font-semibold" : "line-through text-muted-foreground")}>
                          {field.label}
                        </span>
                        {field.isCustom && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                            Custom
                          </span>
                        )}
                      </label>
                      {field.isCustom && (
                        <button
                          onClick={() => handleDeleteCustomField(field.key)}
                          className="text-muted-foreground hover:text-red-400 p-1 rounded hover:bg-muted/60 transition-colors cursor-pointer"
                          title="Delete Custom Field"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </VFDialog>
    </VFPageContainer>
  );
}


