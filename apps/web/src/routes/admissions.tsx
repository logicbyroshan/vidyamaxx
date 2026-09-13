import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import JSZip from 'jszip';
import {
  VFPageContainer,
  VFDataTable,
  VFButton,
  VFBadge,
  VFDrawer,
  VFDialog,
  cn,
} from '@vidyamaxx/ui';
import {
  CheckCircle2,
  Eye,
  Plus,
  Download,
  MessageSquare,
  Copy,
  Check,
  Edit3,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  BarChart3,
  FileCheck,
  Printer,
  FileBadge2,
  Camera,
  Users,
  RotateCcw,
  School,
  FileSpreadsheet,
  Archive,
  Loader2,
  Settings,
  GraduationCap,
  Image as ImageIcon,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/admissions')({
  component: AdmissionsPage,
});

interface SubjectScore {
  subject: string;
  score: string;
  grade: string;
}

interface InterviewRecord {
  interviewer: string;
  score: string;
  date: string;
  remarks: string;
  recommendation: string;
}

interface Applicant {
  id: string;
  applicantId: string;
  name: string;
  avatarUrl: string;
  appliedGrade: string;
  streamPreference: string;
  previousSchool: string;
  previousMarks: string;
  guardianName: string;
  guardianRelation: string;
  motherName: string;
  phone: string;
  email: string;
  address: string;
  dob: string;
  bloodGroup: string;
  quotaCategory: string;
  transportPreference: string;
  fitScore: number;
  ocrDocStatus: 'Verified' | 'Pending' | 'Flagged';
  recommendation: 'Instant Admit' | 'Schedule Interview' | 'Needs Review' | 'Rejected';
  stage: 'Submitted' | 'Screened' | 'Interview' | 'Approved';
  appliedDate: string;
  tcAvailable: boolean;
  birthCertVerified: boolean;
  marksheetVerified: boolean;
  aadhaarVerified: boolean;
  medicalClearance: boolean;
  entranceScore: string;
  entranceRank: string;
  annualFee: string;
  notes?: string;
  subjectScores: SubjectScore[];
  interviewRecord: InterviewRecord;
}

const INITIAL_APPLICANTS: Applicant[] = [
  {
    id: '1',
    applicantId: 'ADM-2026-001',
    name: 'Aarav Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    appliedGrade: 'Class 9',
    streamPreference: 'General Secondary (CBSE)',
    previousSchool: 'Delhi Public School',
    previousMarks: '94.6% (Grade A1)',
    guardianName: 'Rajesh Sharma',
    guardianRelation: 'Father',
    motherName: 'Meenakshi Sharma',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@gmail.com',
    address: 'Flat 401, Apex Towers, Sector 62, Noida',
    dob: '14 May 2011',
    bloodGroup: 'B+',
    quotaCategory: 'General Merit',
    transportPreference: 'Bus Route 4 (Stop #12 - Sector 62)',
    fitScore: 96,
    ocrDocStatus: 'Verified',
    recommendation: 'Instant Admit',
    stage: 'Screened',
    appliedDate: '2026-08-08',
    tcAvailable: true,
    birthCertVerified: true,
    marksheetVerified: true,
    aadhaarVerified: true,
    medicalClearance: true,
    entranceScore: '98 / 100',
    entranceRank: 'Rank #2 of 340 Candidates',
    annualFee: '₹ 84,000',
    notes: 'Exceptional academic track record with state-level science olympiad gold medal.',
    subjectScores: [
      { subject: 'Mathematics', score: '98/100', grade: 'A1' },
      { subject: 'Science & Tech', score: '96/100', grade: 'A1' },
      { subject: 'English Core', score: '94/100', grade: 'A1' },
      { subject: 'Social Sciences', score: '92/100', grade: 'A1' },
      { subject: 'Computer Applications', score: '99/100', grade: 'A1' },
    ],
    interviewRecord: {
      interviewer: 'Dr. V. Malhotra (Vice Principal)',
      score: '9.6 / 10',
      date: '12 Aug 2026',
      remarks: 'Articulate, high logical reasoning quotient. Recommended for advanced cohort.',
      recommendation: 'Direct Merit Admission',
    },
  },
  {
    id: '2',
    applicantId: 'ADM-2026-002',
    name: 'Ananya Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    appliedGrade: 'Class 11-Sci',
    streamPreference: 'Physics, Chemistry, Maths & CS (PCM)',
    previousSchool: 'St. Xavier High School',
    previousMarks: '91.2% (Grade A1)',
    guardianName: 'Sunita Verma',
    guardianRelation: 'Mother',
    motherName: 'Sunita Verma',
    phone: '+91 98123 45678',
    email: 'sunita.v@outlook.com',
    address: 'B-14, Green Park Extension, New Delhi',
    dob: '22 Jan 2009',
    bloodGroup: 'O+',
    quotaCategory: 'General Merit',
    transportPreference: 'Self Commute (Parent Drop)',
    fitScore: 89,
    ocrDocStatus: 'Verified',
    recommendation: 'Schedule Interview',
    stage: 'Interview',
    appliedDate: '2026-08-09',
    tcAvailable: true,
    birthCertVerified: true,
    marksheetVerified: true,
    aadhaarVerified: true,
    medicalClearance: true,
    entranceScore: '92 / 100',
    entranceRank: 'Rank #14 of 340 Candidates',
    annualFee: '₹ 92,000',
    notes: 'Applying for Physics-Maths-Computer Science stream. Strong programming fundamentals.',
    subjectScores: [
      { subject: 'Mathematics', score: '92/100', grade: 'A1' },
      { subject: 'Science', score: '94/100', grade: 'A1' },
      { subject: 'English', score: '89/100', grade: 'A2' },
      { subject: 'Computer Science', score: '96/100', grade: 'A1' },
    ],
    interviewRecord: {
      interviewer: 'Prof. S. Ranganathan (Head of Science)',
      score: '8.8 / 10',
      date: '15 Aug 2026',
      remarks: 'Strong interest in Computer Science and competitive robotics. Approved for PCM Stream.',
      recommendation: 'Provisional Admission Cleared',
    },
  },
  {
    id: '3',
    applicantId: 'ADM-2026-003',
    name: 'Rohan Gupta',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    appliedGrade: 'Class 6',
    streamPreference: 'Middle Wing Curriculum (CBSE)',
    previousSchool: 'Modern School',
    previousMarks: '74.0% (Grade B1)',
    guardianName: 'Vikram Gupta',
    guardianRelation: 'Father',
    motherName: 'Ritu Gupta',
    phone: '+91 97654 32109',
    email: 'vikram.gupta@corp.in',
    address: '88, Anand Vihar, New Delhi',
    dob: '18 Sep 2014',
    bloodGroup: 'A+',
    quotaCategory: 'Sibling Enrolled (Class 10)',
    transportPreference: 'Bus Route 2 (Stop #8 - Anand Vihar)',
    fitScore: 64,
    ocrDocStatus: 'Flagged',
    recommendation: 'Needs Review',
    stage: 'Submitted',
    appliedDate: '2026-08-09',
    tcAvailable: false,
    birthCertVerified: true,
    marksheetVerified: false,
    aadhaarVerified: true,
    medicalClearance: false,
    entranceScore: '68 / 100',
    entranceRank: 'Rank #98 of 340 Candidates',
    annualFee: '₹ 76,000',
    notes: 'Transfer certificate missing counter-signature from prior school district education officer.',
    subjectScores: [
      { subject: 'Mathematics', score: '72/100', grade: 'B1' },
      { subject: 'Science', score: '75/100', grade: 'B1' },
      { subject: 'English', score: '78/100', grade: 'B1' },
      { subject: 'Social Studies', score: '71/100', grade: 'B1' },
    ],
    interviewRecord: {
      interviewer: 'Mrs. K. Sharma (Middle Wing Head)',
      score: '6.5 / 10',
      date: 'Pending',
      remarks: 'Awaiting submission of counter-signed TC and medical clearance before admission.',
      recommendation: 'Pending Compliance',
    },
  },
  {
    id: '4',
    applicantId: 'ADM-2026-004',
    name: 'Kavya Nair',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    appliedGrade: 'Class 11-Com',
    streamPreference: 'Commerce with Applied Mathematics',
    previousSchool: 'Kendriya Vidyalaya',
    previousMarks: '93.8% (Grade A1)',
    guardianName: 'Suresh Nair',
    guardianRelation: 'Father',
    motherName: 'Geetha Nair',
    phone: '+91 99887 76655',
    email: 'suresh.nair@kerala.org',
    address: '102, Palm Grove, Gurgaon',
    dob: '05 Mar 2009',
    bloodGroup: 'AB+',
    quotaCategory: 'General Merit',
    transportPreference: 'Bus Route 6 (Stop #3 - Palm Grove)',
    fitScore: 92,
    ocrDocStatus: 'Verified',
    recommendation: 'Instant Admit',
    stage: 'Approved',
    appliedDate: '2026-08-07',
    tcAvailable: true,
    birthCertVerified: true,
    marksheetVerified: true,
    aadhaarVerified: true,
    medicalClearance: true,
    entranceScore: '94 / 100',
    entranceRank: 'Rank #8 of 340 Candidates',
    annualFee: '₹ 88,000',
    notes: 'Admitted on merit. Provisional offer dispatched; fee portal link sent to registered email.',
    subjectScores: [
      { subject: 'Mathematics', score: '96/100', grade: 'A1' },
      { subject: 'Economics', score: '95/100', grade: 'A1' },
      { subject: 'Accountancy Basics', score: '92/100', grade: 'A1' },
      { subject: 'English Core', score: '93/100', grade: 'A1' },
    ],
    interviewRecord: {
      interviewer: 'Dr. A. Sengupta (Commerce Dean)',
      score: '9.2 / 10',
      date: '10 Aug 2026',
      remarks: 'Outstanding analytical skills and clarity of career direction in finance & business.',
      recommendation: 'Admission Confirmed',
    },
  },
  {
    id: '5',
    applicantId: 'ADM-2026-005',
    name: 'Ishaan Malhotra',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    appliedGrade: 'Class 9',
    streamPreference: 'General Secondary (CBSE)',
    previousSchool: 'Ryan International',
    previousMarks: '68.5% (Grade B2)',
    guardianName: 'Anil Malhotra',
    guardianRelation: 'Father',
    motherName: 'Poonam Malhotra',
    phone: '+91 98234 56789',
    email: 'anil.malhotra@yahoo.com',
    address: 'House 56, Sector 15, Faridabad',
    dob: '30 Nov 2010',
    bloodGroup: 'B-',
    quotaCategory: 'General',
    transportPreference: 'Bus Route 7 (Faridabad Sector 15)',
    fitScore: 48,
    ocrDocStatus: 'Pending',
    recommendation: 'Needs Review',
    stage: 'Submitted',
    appliedDate: '2026-08-10',
    tcAvailable: false,
    birthCertVerified: false,
    marksheetVerified: true,
    aadhaarVerified: true,
    medicalClearance: true,
    entranceScore: '58 / 100',
    entranceRank: 'Rank #210 of 340 Candidates',
    annualFee: '₹ 84,000',
    notes: 'Awaiting municipal birth certificate copy and Class 8 final passing certificates.',
    subjectScores: [
      { subject: 'Mathematics', score: '62/100', grade: 'C1' },
      { subject: 'Science', score: '68/100', grade: 'B2' },
      { subject: 'English', score: '74/100', grade: 'B1' },
      { subject: 'Social Sciences', score: '70/100', grade: 'B1' },
    ],
    interviewRecord: {
      interviewer: 'Mrs. N. Joshi (Admissions Officer)',
      score: '5.5 / 10',
      date: 'Pending',
      remarks: 'Requires diagnostic assessment and counseling session with guardian.',
      recommendation: 'Pending Counseling',
    },
  },
  {
    id: '6',
    applicantId: 'ADM-2026-006',
    name: 'Diya Sengupta',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    appliedGrade: 'Class 7',
    streamPreference: 'Middle Wing Curriculum (CBSE)',
    previousSchool: 'The Heritage School',
    previousMarks: '96.2% (Grade A1)',
    guardianName: 'Amit Sengupta',
    guardianRelation: 'Father',
    motherName: 'Swati Sengupta',
    phone: '+91 98301 23456',
    email: 'amit.sengupta@tcs.com',
    address: 'Tower 3, Nirvana Country, Gurgaon',
    dob: '12 Jul 2013',
    bloodGroup: 'O+',
    quotaCategory: 'Sports Merit Quota (Chess)',
    transportPreference: 'Bus Route 5 (Nirvana Country)',
    fitScore: 98,
    ocrDocStatus: 'Verified',
    recommendation: 'Instant Admit',
    stage: 'Approved',
    appliedDate: '2026-08-11',
    tcAvailable: true,
    birthCertVerified: true,
    marksheetVerified: true,
    aadhaarVerified: true,
    medicalClearance: true,
    entranceScore: '99 / 100',
    entranceRank: 'Rank #1 of 340 Candidates',
    annualFee: '₹ 80,000',
    notes: 'State level junior chess champion, top scorer in school entrance aptitude assessment.',
    subjectScores: [
      { subject: 'Mathematics', score: '100/100', grade: 'A1' },
      { subject: 'Science', score: '98/100', grade: 'A1' },
      { subject: 'English', score: '95/100', grade: 'A1' },
      { subject: 'Social Studies', score: '96/100', grade: 'A1' },
    ],
    interviewRecord: {
      interviewer: 'Dr. V. Malhotra (Vice Principal)',
      score: '9.8 / 10',
      date: '14 Aug 2026',
      remarks: 'Exemplary cognitive sharpness. Approved for sports merit scholarship grant.',
      recommendation: 'Direct Merit Admission Approved',
    },
  },
  {
    id: '7',
    applicantId: 'ADM-2026-007',
    name: 'Kabir Singhania',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    appliedGrade: 'Class 11-Hum',
    streamPreference: 'Humanities (History, Pol Sci, Economics & Legal Studies)',
    previousSchool: 'Springdales School',
    previousMarks: '88.4% (Grade A2)',
    guardianName: 'Pooja Singhania',
    guardianRelation: 'Mother',
    motherName: 'Pooja Singhania',
    phone: '+91 98105 67890',
    email: 'pooja.singhania@legal.in',
    address: 'C-45, Vasant Vihar, New Delhi',
    dob: '19 Oct 2008',
    bloodGroup: 'B+',
    quotaCategory: 'General Merit',
    transportPreference: 'Self Commute',
    fitScore: 84,
    ocrDocStatus: 'Verified',
    recommendation: 'Schedule Interview',
    stage: 'Interview',
    appliedDate: '2026-08-11',
    tcAvailable: true,
    birthCertVerified: true,
    marksheetVerified: true,
    aadhaarVerified: true,
    medicalClearance: true,
    entranceScore: '86 / 100',
    entranceRank: 'Rank #28 of 340 Candidates',
    annualFee: '₹ 90,000',
    notes: 'Interested in Political Science and Model United Nations (MUN) society.',
    subjectScores: [
      { subject: 'Social Sciences', score: '94/100', grade: 'A1' },
      { subject: 'English Core', score: '92/100', grade: 'A1' },
      { subject: 'Mathematics', score: '82/100', grade: 'A2' },
      { subject: 'Science', score: '85/100', grade: 'A2' },
    ],
    interviewRecord: {
      interviewer: 'Mrs. R. Sen (Humanities Coordinator)',
      score: '8.5 / 10',
      date: '16 Aug 2026',
      remarks: 'Strong debating credentials and articulate worldview. Approved for Humanities.',
      recommendation: 'Interview Cleared',
    },
  },
  {
    id: '8',
    applicantId: 'ADM-2026-008',
    name: 'Meera Iyer',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    appliedGrade: 'Class 4',
    streamPreference: 'Primary Wing Foundation (CBSE)',
    previousSchool: 'Bhavans Vidyashram',
    previousMarks: '92.0% (Grade A1)',
    guardianName: 'Narayanan Iyer',
    guardianRelation: 'Father',
    motherName: 'Radha Iyer',
    phone: '+91 98450 11223',
    email: 'n.iyer@isro.gov.in',
    address: 'A-201, ISRO Officers Enclave, Dwarka',
    dob: '03 Feb 2016',
    bloodGroup: 'O+',
    quotaCategory: 'Govt / Defense Service Quota',
    transportPreference: 'Bus Route 3 (Dwarka Sector 9)',
    fitScore: 91,
    ocrDocStatus: 'Verified',
    recommendation: 'Instant Admit',
    stage: 'Screened',
    appliedDate: '2026-08-12',
    tcAvailable: true,
    birthCertVerified: true,
    marksheetVerified: true,
    aadhaarVerified: true,
    medicalClearance: true,
    entranceScore: '93 / 100',
    entranceRank: 'Rank #11 of 340 Candidates',
    annualFee: '₹ 72,000',
    notes: 'Classical vocal exponent, excellent foundational mathematics skills.',
    subjectScores: [
      { subject: 'Mathematics', score: '95/100', grade: 'A1' },
      { subject: 'Environmental Studies', score: '94/100', grade: 'A1' },
      { subject: 'English', score: '91/100', grade: 'A1' },
      { subject: 'Hindi', score: '90/100', grade: 'A1' },
    ],
    interviewRecord: {
      interviewer: 'Mrs. S. Bhatnagar (Primary Wing Incharge)',
      score: '9.0 / 10',
      date: '14 Aug 2026',
      remarks: 'Polite, active, and curious student with great learning pace.',
      recommendation: 'Direct Admit',
    },
  },
  {
    id: '9',
    applicantId: 'ADM-2026-009',
    name: 'Tanmay Deshmukh',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    appliedGrade: 'Class 8',
    streamPreference: 'Middle Wing Curriculum (CBSE)',
    previousSchool: 'Symbiosis International',
    previousMarks: '79.5% (Grade B1)',
    guardianName: 'Sanjay Deshmukh',
    guardianRelation: 'Father',
    motherName: 'Rekha Deshmukh',
    phone: '+91 98220 99887',
    email: 'sanjay.d@mumbai.org',
    address: 'B-12, Panchsheel Park, New Delhi',
    dob: '28 Aug 2012',
    bloodGroup: 'AB-',
    quotaCategory: 'Interstate Transfer',
    transportPreference: 'Bus Route 1 (Panchsheel)',
    fitScore: 76,
    ocrDocStatus: 'Pending',
    recommendation: 'Needs Review',
    stage: 'Submitted',
    appliedDate: '2026-08-12',
    tcAvailable: false,
    birthCertVerified: true,
    marksheetVerified: true,
    aadhaarVerified: true,
    medicalClearance: true,
    entranceScore: '81 / 100',
    entranceRank: 'Rank #52 of 340 Candidates',
    annualFee: '₹ 82,000',
    notes: 'Interstate migration from Pune. Pending counter-signed TC from Maharashtra board.',
    subjectScores: [
      { subject: 'Mathematics', score: '78/100', grade: 'B1' },
      { subject: 'Science', score: '82/100', grade: 'A2' },
      { subject: 'English', score: '85/100', grade: 'A2' },
      { subject: 'Social Studies', score: '76/100', grade: 'B1' },
    ],
    interviewRecord: {
      interviewer: 'Mrs. K. Sharma (Middle Wing Head)',
      score: '7.8 / 10',
      date: '16 Aug 2026',
      remarks: 'Academic aptitude is good. Pending TC clearance for formal seat allotment.',
      recommendation: 'Conditional Approval',
    },
  },
  {
    id: '10',
    applicantId: 'ADM-2026-010',
    name: 'Sanya Mirza',
    avatarUrl: 'https://images.unsplash.com/photo-1534751516642-a171edd26cb7?w=200&auto=format&fit=crop&q=80',
    appliedGrade: 'Class 10',
    streamPreference: 'Secondary Board (CBSE Class 10)',
    previousSchool: 'Hyderabad Public School',
    previousMarks: '95.0% (Grade A1)',
    guardianName: 'Farhan Mirza',
    guardianRelation: 'Father',
    motherName: 'Zainab Mirza',
    phone: '+91 98490 55443',
    email: 'farhan.m@mirzagroup.com',
    address: 'Villa 14, DLF Phase 1, Gurgaon',
    dob: '15 Sep 2010',
    bloodGroup: 'B+',
    quotaCategory: 'Sports Merit (Badminton)',
    transportPreference: 'Bus Route 6 (DLF Phase 1)',
    fitScore: 94,
    ocrDocStatus: 'Verified',
    recommendation: 'Instant Admit',
    stage: 'Approved',
    appliedDate: '2026-08-13',
    tcAvailable: true,
    birthCertVerified: true,
    marksheetVerified: true,
    aadhaarVerified: true,
    medicalClearance: true,
    entranceScore: '96 / 100',
    entranceRank: 'Rank #5 of 340 Candidates',
    annualFee: '₹ 86,000',
    notes: 'National junior badminton tournament qualifier. Merit admission approved.',
    subjectScores: [
      { subject: 'Mathematics', score: '94/100', grade: 'A1' },
      { subject: 'Science', score: '96/100', grade: 'A1' },
      { subject: 'English Core', score: '97/100', grade: 'A1' },
      { subject: 'Social Science', score: '93/100', grade: 'A1' },
    ],
    interviewRecord: {
      interviewer: 'Dr. V. Malhotra (Vice Principal)',
      score: '9.5 / 10',
      date: '15 Aug 2026',
      remarks: 'Balanced excellence in athletics and academics. Seat approved.',
      recommendation: 'Admission Confirmed',
    },
  },
  {
    id: '11',
    applicantId: 'ADM-2026-011',
    name: 'Aditya Roy',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    appliedGrade: 'Class 11-Sci',
    streamPreference: 'PCM + IIT JEE Integrated Batch',
    previousSchool: 'Don Bosco School',
    previousMarks: '89.5% (Grade A2)',
    guardianName: 'Sourav Roy',
    guardianRelation: 'Father',
    motherName: 'Ananya Roy',
    phone: '+91 98310 77665',
    email: 'sourav.roy@itc.in',
    address: 'Flat 702, Jaypee Greens, Noida',
    dob: '11 Nov 2008',
    bloodGroup: 'O+',
    quotaCategory: 'General Merit',
    transportPreference: 'Bus Route 8 (Jaypee Greens)',
    fitScore: 86,
    ocrDocStatus: 'Verified',
    recommendation: 'Schedule Interview',
    stage: 'Interview',
    appliedDate: '2026-08-13',
    tcAvailable: true,
    birthCertVerified: true,
    marksheetVerified: true,
    aadhaarVerified: true,
    medicalClearance: true,
    entranceScore: '89 / 100',
    entranceRank: 'Rank #22 of 340 Candidates',
    annualFee: '₹ 94,000',
    notes: 'Targeting IIT-JEE coaching integrated batch with advanced physics labs.',
    subjectScores: [
      { subject: 'Mathematics', score: '93/100', grade: 'A1' },
      { subject: 'Science', score: '91/100', grade: 'A1' },
      { subject: 'English', score: '86/100', grade: 'A2' },
      { subject: 'Computer Applications', score: '92/100', grade: 'A1' },
    ],
    interviewRecord: {
      interviewer: 'Prof. S. Ranganathan (Head of Science)',
      score: '8.7 / 10',
      date: '17 Aug 2026',
      remarks: 'Solid problem solving abilities in algebra and physics. Cleared for PCM.',
      recommendation: 'Interview Cleared',
    },
  },
  {
    id: '12',
    applicantId: 'ADM-2026-012',
    name: 'Rhea Kapoor',
    avatarUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&auto=format&fit=crop&q=80',
    appliedGrade: 'Class 5',
    streamPreference: 'Primary Wing (CBSE)',
    previousSchool: 'Step by Step School',
    previousMarks: '91.0% (Grade A1)',
    guardianName: 'Kunal Kapoor',
    guardianRelation: 'Father',
    motherName: 'Natasha Kapoor',
    phone: '+91 98111 22334',
    email: 'kunal.kapoor@studio.com',
    address: 'E-7, Greater Kailash 2, New Delhi',
    dob: '04 Apr 2015',
    bloodGroup: 'A+',
    quotaCategory: 'General Merit',
    transportPreference: 'Self Commute (Parent Drop)',
    fitScore: 90,
    ocrDocStatus: 'Verified',
    recommendation: 'Instant Admit',
    stage: 'Screened',
    appliedDate: '2026-08-14',
    tcAvailable: true,
    birthCertVerified: true,
    marksheetVerified: true,
    aadhaarVerified: true,
    medicalClearance: true,
    entranceScore: '91 / 100',
    entranceRank: 'Rank #18 of 340 Candidates',
    annualFee: '₹ 75,000',
    notes: 'Strong portfolio in performing arts, music, and public speaking.',
    subjectScores: [
      { subject: 'Mathematics', score: '90/100', grade: 'A1' },
      { subject: 'Science & EVS', score: '92/100', grade: 'A1' },
      { subject: 'English', score: '95/100', grade: 'A1' },
      { subject: 'Hindi', score: '88/100', grade: 'A2' },
    ],
    interviewRecord: {
      interviewer: 'Mrs. S. Bhatnagar (Primary Incharge)',
      score: '9.1 / 10',
      date: '16 Aug 2026',
      remarks: 'Articulate and energetic. Passed all foundation checks.',
      recommendation: 'Merit Admit Cleared',
    },
  },
];

function AdmissionsPage() {
  const { activeSession, addNotification } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  React.useEffect(() => { document.title = t('page.admissions') + ' \u2013 VidyaMaxx'; }, [t]);
  const [applicantList, setApplicantList] = React.useState<Applicant[]>(INITIAL_APPLICANTS);
  const [selectedApplicantIndex, setSelectedApplicantIndex] = React.useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
  const [drawerTab, setDrawerTab] = React.useState<'overview' | 'academics' | 'documents' | 'decisions'>('overview');
  const [isEditingApplicant, setIsEditingApplicant] = React.useState<boolean>(false);
  const [applicantFormData, setApplicantFormData] = React.useState<Applicant | null>(null);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Export Roster Modal State
  const [isExportModalOpen, setIsExportModalOpen] = React.useState<boolean>(false);
  const [exportFormat, setExportFormat] = React.useState<'xlsx' | 'zip' | 'bundle'>('bundle');
  const [namingPattern, setNamingPattern] = React.useState<'id-name' | 'roll-name' | 'name-id' | 'custom'>('id-name');
  const [customColumnKey, setCustomColumnKey] = React.useState<string>('phone');
  const [isExporting, setIsExporting] = React.useState<boolean>(false);
  const [exportProgressText, setExportProgressText] = React.useState<string>('');

  // New Admission Drawer State
  const [isNewAdmissionDrawerOpen, setIsNewAdmissionDrawerOpen] = React.useState<boolean>(false);
  const [newAdmissionTab, setNewAdmissionTab] = React.useState<'bio' | 'guardian' | 'academic' | 'documents'>('bio');
  const newAvatarFileInputRef = React.useRef<HTMLInputElement>(null);

  const initialNewApplicantForm = {
    name: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    appliedGrade: 'Class 9',
    streamPreference: 'General Secondary (CBSE)',
    dob: '2011-05-14',
    bloodGroup: 'B+',
    gender: 'Male',
    quotaCategory: 'General Merit',
    aadhaarNo: '4928-1092-8841',

    guardianName: '',
    guardianRelation: 'Father',
    motherName: '',
    phone: '',
    altPhone: '',
    email: '',
    address: '',
    city: 'New Delhi',
    guardianOccupation: 'Senior Executive / Professional',

    previousSchool: '',
    previousMarks: '92.4% (Grade A1)',
    entranceScore: '96 / 100',
    entranceRank: 'Rank #5 of 340 Candidates',
    mathsScore: '96',
    scienceScore: '94',
    englishScore: '92',
    socialScore: '90',
    computerScore: '98',

    tcAvailable: true,
    birthCertVerified: true,
    marksheetVerified: true,
    aadhaarVerified: true,
    medicalClearance: true,
    transportPreference: 'Bus Route 4 (Stop #12 - Sector 62)',
    annualFee: '₹ 84,000',
    stage: 'Screened' as 'Submitted' | 'Screened' | 'Interview' | 'Approved',
    recommendation: 'Instant Admit' as 'Instant Admit' | 'Schedule Interview' | 'Needs Review' | 'Rejected',
    notes: 'Exemplary academic record and high aptitude test scores.',
  };

  const [newApplicantForm, setNewApplicantForm] = React.useState(initialNewApplicantForm);

  const handleOpenNewAdmissionDrawer = () => {
    setNewApplicantForm(initialNewApplicantForm);
    setNewAdmissionTab('bio');
    setIsNewAdmissionDrawerOpen(true);
  };

  const handleCloseNewAdmissionDrawer = () => {
    setIsNewAdmissionDrawerOpen(false);
  };

  const handleResetNewAdmissionForm = () => {
    setNewApplicantForm(initialNewApplicantForm);
    setNewAdmissionTab('bio');
  };

  const handleNewAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewApplicantForm((prev) => ({
          ...prev,
          avatarUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitNewAdmission = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newApplicantForm.name.trim()) {
      alert('Please enter candidate full legal name.');
      setNewAdmissionTab('bio');
      return;
    }
    if (!newApplicantForm.phone.trim()) {
      alert('Please enter primary guardian contact number.');
      setNewAdmissionTab('guardian');
      return;
    }

    const nextIdNum = applicantList.length + 1;
    const generatedAppId = `ADM-2026-${String(nextIdNum).padStart(3, '0')}`;
    const fitCalc = Math.min(99, Math.max(75, Math.round(Number(newApplicantForm.entranceScore.split('/')[0] || 95))));

    const newApplicantRecord: Applicant = {
      id: String(Date.now()),
      applicantId: generatedAppId,
      name: newApplicantForm.name.trim(),
      avatarUrl: newApplicantForm.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      appliedGrade: newApplicantForm.appliedGrade,
      streamPreference: newApplicantForm.streamPreference,
      previousSchool: newApplicantForm.previousSchool.trim() || 'Modern Academy Public School',
      previousMarks: newApplicantForm.previousMarks || '90.0% (Grade A1)',
      guardianName: newApplicantForm.guardianName.trim() || 'Guardian / Parent',
      guardianRelation: newApplicantForm.guardianRelation,
      motherName: newApplicantForm.motherName.trim() || 'Mother',
      phone: newApplicantForm.phone.trim(),
      email: newApplicantForm.email.trim() || 'guardian@gmail.com',
      address: newApplicantForm.address.trim() || 'Sector 14, New Delhi',
      dob: newApplicantForm.dob || '14 May 2011',
      bloodGroup: newApplicantForm.bloodGroup,
      quotaCategory: newApplicantForm.quotaCategory,
      transportPreference: newApplicantForm.transportPreference,
      fitScore: fitCalc,
      ocrDocStatus: newApplicantForm.birthCertVerified && newApplicantForm.marksheetVerified ? 'Verified' : 'Pending',
      recommendation: newApplicantForm.recommendation,
      stage: newApplicantForm.stage,
      appliedDate: new Date().toISOString().split('T')[0],
      tcAvailable: newApplicantForm.tcAvailable,
      birthCertVerified: newApplicantForm.birthCertVerified,
      marksheetVerified: newApplicantForm.marksheetVerified,
      aadhaarVerified: newApplicantForm.aadhaarVerified,
      medicalClearance: newApplicantForm.medicalClearance,
      entranceScore: newApplicantForm.entranceScore,
      entranceRank: newApplicantForm.entranceRank,
      annualFee: newApplicantForm.annualFee,
      notes: newApplicantForm.notes,
      subjectScores: [
        { subject: 'Mathematics', score: `${newApplicantForm.mathsScore}/100`, grade: Number(newApplicantForm.mathsScore) >= 90 ? 'A1' : 'A2' },
        { subject: 'Science & Tech', score: `${newApplicantForm.scienceScore}/100`, grade: Number(newApplicantForm.scienceScore) >= 90 ? 'A1' : 'A2' },
        { subject: 'English Core', score: `${newApplicantForm.englishScore}/100`, grade: Number(newApplicantForm.englishScore) >= 90 ? 'A1' : 'A2' },
        { subject: 'Social Sciences', score: `${newApplicantForm.socialScore}/100`, grade: Number(newApplicantForm.socialScore) >= 90 ? 'A1' : 'A2' },
        { subject: 'Computer Apps', score: `${newApplicantForm.computerScore}/100`, grade: Number(newApplicantForm.computerScore) >= 90 ? 'A1' : 'A2' },
      ],
      interviewRecord: {
        interviewer: 'Admissions Evaluation Committee',
        score: `${(fitCalc / 10).toFixed(1)} / 10`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        remarks: newApplicantForm.notes || 'Strong foundational credentials. Recommended for enrolled cohort.',
        recommendation: newApplicantForm.stage === 'Approved' ? 'Direct Merit Admission' : 'Provisional Candidate',
      },
    };

    setApplicantList([newApplicantRecord, ...applicantList]);
    setIsNewAdmissionDrawerOpen(false);
    setSelectedApplicantIndex(0);
    addNotification({ title: 'Candidate Registered', description: `${newApplicantRecord.name} successfully registered with Applicant ID ${newApplicantRecord.applicantId}.`, type: 'success' });

    if (newApplicantRecord.stage === 'Approved') {
      setOfferApplicant(newApplicantRecord);
      setIsOfferModalOpen(true);
    }
  };

  // Photo Naming Template Generator
  const getFormattedPhotoName = (applicant: any) => {
    const sanitize = (str: string) => String(str || '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanName = sanitize(applicant.name);
    const cleanId = sanitize(applicant.applicantId);
    switch (namingPattern) {
      case 'id-name': return `${cleanId}-${cleanName}.jpg`;
      case 'roll-name': return `${cleanName}.jpg`;
      case 'name-id': return `${cleanName}_${cleanId}.jpg`;
      case 'custom': {
        const val = sanitize(applicant[customColumnKey] || 'record');
        return `${val}-${cleanName}.jpg`;
      }
      default: return `${cleanId}-${cleanName}.jpg`;
    }
  };

  // Canvas-based 19.5:25 Photo Blob
  const createPhotoBlob = async (applicant: any): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 390;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => resolve(blob || new Blob([])), 'image/jpeg', 0.92);
        } else { resolve(new Blob([])); }
      };
      img.onerror = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 390;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#7c3aed';
          ctx.beginPath();
          ctx.arc(195, 200, 90, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 64px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const initials = applicant.name.split(' ').map((n: string) => n[0]).join('');
          ctx.fillText(initials, 195, 200);
          ctx.font = 'bold 24px sans-serif';
          ctx.fillText(applicant.name, 195, 340);
          ctx.fillStyle = '#94a3b8';
          ctx.font = '20px monospace';
          ctx.fillText(applicant.applicantId, 195, 380);
          canvas.toBlob((blob) => resolve(blob || new Blob([])), 'image/jpeg', 0.92);
        } else { resolve(new Blob([])); }
      };
      img.src = applicant.avatarUrl;
    });
  };

  // Generate Excel Spreadsheet for Applicants
  const generateXlsxSpreadsheet = (applicants: any[]) => {
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
   <Interior ss:Color="#7C3AED" ss:Pattern="Solid"/>
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
 <Worksheet ss:Name="Admissions Roster ${activeSession}">
  <Table ss:DefaultRowHeight="24">
   <Column ss:Width="160"/>
   <Column ss:Width="130"/>
   <Column ss:Width="150"/>
   <Column ss:Width="150"/>
   <Column ss:Width="140"/>
   <Column ss:Width="140"/>
   <Column ss:Width="170"/>
   <Column ss:Width="70"/>
   <Column ss:Width="80"/>
   <Column ss:Width="90"/>
   <Column ss:Width="120"/>
   <Column ss:Width="100"/>
   <Row ss:Height="28">
    <Cell ss:StyleID="Header"><Data ss:Type="String">Photo Filename (19.5x25)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Applicant ID</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Candidate Name</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Applied Grade</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Guardian Name</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Phone</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Email</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Merit Score</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Doc Status</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Stage</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Annual Fee</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Applied Date</Data></Cell>
   </Row>`;

    applicants.forEach((a) => {
      const photoName = getFormattedPhotoName(a);
      xml += `
   <Row>
    <Cell ss:StyleID="Mono"><Data ss:Type="String">${photoName}</Data></Cell>
    <Cell ss:StyleID="Mono"><Data ss:Type="String">${a.applicantId}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${a.name}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${a.appliedGrade}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${a.guardianName || ''}</Data></Cell>
    <Cell ss:StyleID="Mono"><Data ss:Type="String">${a.phone || ''}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${a.email || ''}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${a.fitScore || 'N/A'}%</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${a.ocrDocStatus || 'Pending'}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${a.stage}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${a.annualFee || ''}</Data></Cell>
    <Cell ss:StyleID="Data"><Data ss:Type="String">${a.appliedDate}</Data></Cell>
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
    setExportProgressText('Preparing applicant dossier & assets...');
    try {
      const targetList = applicantList;
      if (exportFormat === 'xlsx') {
        setExportProgressText('Generating formatted Excel spreadsheet...');
        const blob = generateXlsxSpreadsheet(targetList);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VidyaMaxx_Admissions_${activeSession.replace(/[^a-zA-Z0-9]/g, '_')}_Roster.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'zip') {
        setExportProgressText(`Packaging ${targetList.length} applicant photos in 19.5:25 ratio...`);
        const zip = new JSZip();
        const photosFolder = zip.folder(`applicant_photos_${activeSession.replace(/[^a-zA-Z0-9]/g, '_')}`);
        for (let i = 0; i < targetList.length; i++) {
          const applicant = targetList[i];
          setExportProgressText(`Packing photo ${i + 1} of ${targetList.length} (${applicant.name})...`);
          const filename = getFormattedPhotoName(applicant);
          const photoBlob = await createPhotoBlob(applicant);
          photosFolder?.file(filename, photoBlob);
        }
        setExportProgressText('Compressing ZIP archive...');
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VidyaMaxx_Applicant_Photos_${activeSession.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'bundle') {
        setExportProgressText(`Building complete package (Excel + ${targetList.length} Photos in 19.5:25 ratio)...`);
        const zip = new JSZip();
        const xlsxBlob = generateXlsxSpreadsheet(targetList);
        zip.file(`Admissions_Master_Roster_${activeSession.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`, xlsxBlob);
        const photosFolder = zip.folder('applicant_photos_19.5x25');
        for (let i = 0; i < targetList.length; i++) {
          const applicant = targetList[i];
          setExportProgressText(`Processing photo ${i + 1} of ${targetList.length} (${applicant.name})...`);
          const filename = getFormattedPhotoName(applicant);
          const photoBlob = await createPhotoBlob(applicant);
          photosFolder?.file(filename, photoBlob);
        }
        setExportProgressText('Finalizing bundled archive...');
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VidyaMaxx_Complete_Admissions_Bundle_${activeSession.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;
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
        addNotification({ title: 'Roster Exported', description: `Admissions candidate roster exported successfully as ${exportFormat === 'xlsx' ? 'Excel' : exportFormat === 'zip' ? 'Photos ZIP' : 'Complete Bundle'}.`, type: 'success' });
      }, 800);
    } catch (err) {
      console.error('Export failed', err);
      addNotification({ title: 'Export Failed', description: 'An error occurred while generating the export. Please try again.', type: 'error' });
      setIsExporting(false);
      setExportProgressText('');
    }
  };

  // Offer Letter Print Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = React.useState<boolean>(false);
  const [offerApplicant, setOfferApplicant] = React.useState<Applicant | null>(null);

  const activeApplicant =
    selectedApplicantIndex !== null && selectedApplicantIndex >= 0 && selectedApplicantIndex < applicantList.length
      ? applicantList[selectedApplicantIndex]
      : null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const openApplicantDrawer = (app: Applicant) => {
    const idx = applicantList.findIndex((a) => a.id === app.id);
    setSelectedApplicantIndex(idx >= 0 ? idx : 0);
    setIsEditingApplicant(false);
    setApplicantFormData(null);
    setDrawerTab('overview');
    setIsDrawerOpen(true);
  };

  const handleStartEdit = () => {
    if (activeApplicant) {
      setApplicantFormData({ ...activeApplicant });
      setIsEditingApplicant(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingApplicant(false);
    setApplicantFormData(null);
  };

  const handleSaveApplicant = () => {
    if (!applicantFormData || selectedApplicantIndex === null) return;
    const updated = [...applicantList];
    updated[selectedApplicantIndex] = { ...applicantFormData };
    setApplicantList(updated);
    setIsEditingApplicant(false);
    setApplicantFormData(null);
    addNotification({ title: 'Dossier Updated', description: `Candidate admissions dossier for ${applicantFormData.name} has been saved.`, type: 'success' });
  };

  const handleApproveAdmit = (app: Applicant) => {
    const idx = applicantList.findIndex((a) => a.id === app.id);
    if (idx === -1) return;
    const updated = [...applicantList];
    updated[idx] = {
      ...updated[idx],
      stage: 'Approved',
      recommendation: 'Instant Admit',
    };
    setApplicantList(updated);
    addNotification({ title: 'Admission Approved', description: `Provisional Admission Offer generated & approved for ${updated[idx].name}!`, type: 'success' });
    setOfferApplicant(updated[idx]);
    setIsOfferModalOpen(true);
  };

  const handlePrevApplicant = () => {
    if (selectedApplicantIndex !== null && selectedApplicantIndex > 0) {
      setIsEditingApplicant(false);
      setApplicantFormData(null);
      setSelectedApplicantIndex(selectedApplicantIndex - 1);
    }
  };

  const handleNextApplicant = () => {
    if (selectedApplicantIndex !== null && selectedApplicantIndex < applicantList.length - 1) {
      setIsEditingApplicant(false);
      setApplicantFormData(null);
      setSelectedApplicantIndex(selectedApplicantIndex + 1);
    }
  };

  const avatarFileInputRef = React.useRef<HTMLInputElement>(null);
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && applicantFormData) {
      const reader = new FileReader();
      reader.onload = () => {
        setApplicantFormData({
          ...applicantFormData,
          avatarUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isDrawerOpen) return;
      if (e.key === 'ArrowLeft') handlePrevApplicant();
      if (e.key === 'ArrowRight') handleNextApplicant();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, selectedApplicantIndex, applicantList.length]);

  const applicantColumns = [
    {
      header: isHindi ? 'फोटो' : 'Photo',
      accessorKey: 'photo',
      cell: (r: Applicant) => (
        <div className="flex items-center justify-start">
          <div
            onClick={() => openApplicantDrawer(r)}
            className="overflow-hidden rounded-md border border-border/80 shadow-xs w-10 h-[50px] bg-muted shrink-0 cursor-pointer hover:border-foreground/40 transition-colors flex items-center justify-center"
            title={isHindi ? "कैंडिडेट प्रोफाइल देखें" : "Click to view 360° Candidate Dossier"}
          >
            <img src={r.avatarUrl} alt={r.name} className="w-full h-full object-cover" />
          </div>
        </div>
      ),
    },
    {
      header: isHindi ? 'एप्लिकेशन आईडी' : 'Applicant ID',
      accessorKey: 'applicantId',
      cell: (r: Applicant) => (
        <span className="font-mono font-bold text-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border">
          {r.applicantId}
        </span>
      ),
    },
    {
      header: isHindi ? 'कैंडिडेट का नाम' : 'Candidate Name',
      accessorKey: 'name',
      cell: (r: Applicant) => (
        <div>
          <button
            onClick={() => openApplicantDrawer(r)}
            className="font-extrabold text-foreground text-sm leading-tight text-left hover:underline cursor-pointer tracking-tight block"
          >
            {r.name}
          </button>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">{r.previousSchool}</p>
        </div>
      ),
    },
    {
      header: isHindi ? 'क्लास' : 'Applied Grade',
      accessorKey: 'appliedGrade',
      cell: (r: Applicant) => (
        <div>
          <span className="font-bold text-foreground text-sm block">{r.appliedGrade}</span>
          <span className="text-[11px] text-muted-foreground font-medium block truncate max-w-[140px]">
            {r.streamPreference}
          </span>
        </div>
      ),
    },
    {
      header: isHindi ? 'गार्जियन / कॉन्टैक्ट' : 'Guardian / Contact',
      accessorKey: 'phone',
      cell: (r: Applicant) => (
        <div>
          <span className="text-sm font-bold text-foreground block">{r.guardianName}</span>
          <span className="text-xs text-muted-foreground font-mono">{r.phone}</span>
        </div>
      ),
    },
    {
      header: isHindi ? 'मेरिट स्कोर' : 'Merit Score',
      accessorKey: 'fitScore',
      cell: (r: Applicant) => (
        <div className="flex items-center gap-2">
          <span className="font-black text-sm text-foreground">{r.fitScore}%</span>
          <div className="h-2 w-14 bg-muted rounded-full overflow-hidden border border-border/50">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                r.fitScore >= 80 ? 'bg-emerald-400' : r.fitScore >= 60 ? 'bg-amber-400' : 'bg-rose-400'
              )}
              style={{ width: `${r.fitScore}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: isHindi ? 'डॉक्यूमेंट वेरिफिकेशन' : 'Doc Verification',
      accessorKey: 'ocrDocStatus',
      cell: (r: Applicant) => (
        <VFBadge variant={r.ocrDocStatus === 'Verified' ? 'success' : r.ocrDocStatus === 'Flagged' ? 'danger' : 'warning'}>
          {r.ocrDocStatus === 'Verified' ? (isHindi ? 'वेरिफाइड' : 'Verified') : r.ocrDocStatus === 'Flagged' ? (isHindi ? 'फ्लैग्ड' : 'Flagged') : (isHindi ? 'पेंडिंग' : 'Pending')}
        </VFBadge>
      ),
    },
    {
      header: isHindi ? 'स्टेज' : 'Stage',
      accessorKey: 'stage',
      cell: (r: Applicant) => (
        <VFBadge variant={r.stage === 'Approved' ? 'success' : r.stage === 'Interview' ? 'warning' : 'outline'}>
          {r.stage === 'Approved' ? (isHindi ? 'एप्रूव्ड' : 'Approved') : r.stage === 'Interview' ? (isHindi ? 'इंटरव्यू' : 'Interview') : (isHindi ? 'जमा हुआ' : r.stage)}
        </VFBadge>
      ),
    },
    {
      header: t('col.action'),
      accessorKey: 'action',
      cell: (r: Applicant) => (
        <VFButton
          size="icon"
          variant="outline"
          className="h-7 w-7 border-border hover:border-zinc-500 rounded-[4px]"
          title={isHindi ? 'एप्लिकेशन रिव्यू करें' : 'Review Application'}
          aria-label={isHindi ? 'एप्लिकेशन रिव्यू करें' : 'Review Application'}
          onClick={() => openApplicantDrawer(r)}
        >
          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
        </VFButton>
      ),
    },
  ];

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">


      {/* Main Candidate Table (Full Height Prominence) */}
      <VFDataTable
        columns={applicantColumns}
        data={applicantList}
        filterPlaceholder={t('form.searchStudents')}
        rightActions={
          <>
            <VFButton
              variant="outline"
              size="sm"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={() => setIsExportModalOpen(true)}
            >
              {t('action.export')}
            </VFButton>
            <VFButton
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={handleOpenNewAdmissionDrawer}
            >
              {t('action.add') + ' ' + t('page.admissions')}
            </VFButton>
          </>
        }
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          NEW CANDIDATE ADMISSION INTAKE DRAWER (IDENTICAL 360° PROFILE STYLE)
          ═══════════════════════════════════════════════════════════════════════ */}
      <VFDrawer
        isOpen={isNewAdmissionDrawerOpen}
        onClose={handleCloseNewAdmissionDrawer}
        hideHeader={true}
        title="New Candidate Admission Intake"
        className="w-[960px] max-w-[96vw] sm:max-w-4xl lg:max-w-5xl"
        bodyClassName="p-0 flex flex-col flex-1 min-h-0 overflow-hidden"
        footerActions={
          <div className="flex items-center justify-between w-full gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold text-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
                INTAKE-2026
              </span>
              <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
                New Student Admission Protocol · AY {activeSession}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <VFButton
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw className="h-4 w-4 text-muted-foreground" />}
                onClick={handleResetNewAdmissionForm}
              >
                Reset
              </VFButton>
              <VFButton
                variant="outline"
                size="sm"
                onClick={handleCloseNewAdmissionDrawer}
              >
                Cancel
              </VFButton>
              <VFButton
                size="sm"
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                onClick={handleSubmitNewAdmission}
              >
                Submit & Enroll Candidate
              </VFButton>
            </div>
          </div>
        }
      >
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden animate-fade-in">
          {/* Tabs Header Bar */}
          <div className="w-full bg-card/95 backdrop-blur-md border-b border-border shrink-0">
            <div className="grid grid-cols-4 w-full">
              {[
                { id: 'bio', label: 'Candidate Bio & Identity', icon: <UserCheck className="h-4 w-4" /> },
                { id: 'guardian', label: 'Guardian & Contacts', icon: <Users className="h-4 w-4" /> },
                { id: 'academic', label: 'Academic & Entrance', icon: <BarChart3 className="h-4 w-4" /> },
                { id: 'documents', label: 'Verification & Transport', icon: <FileCheck className="h-4 w-4" /> },
              ].map((tab) => {
                const isActive = newAdmissionTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setNewAdmissionTab(tab.id as any)}
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

          {/* Scrollable Form Body */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {/* TAB 1: CANDIDATE BIO & IDENTITY */}
            {newAdmissionTab === 'bio' && (
              <div className="animate-fade-in divide-y divide-border/40">
                <div className="px-4 py-4">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Photo Upload Box (19.5:25 Ratio) */}
                    <div className="relative shrink-0 mx-auto sm:mx-0">
                      <input
                        type="file"
                        ref={newAvatarFileInputRef}
                        onChange={handleNewAvatarFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <div
                        onClick={() => newAvatarFileInputRef.current?.click()}
                        className="relative overflow-hidden rounded-md border border-border/90 shadow-sm w-28 sm:w-32 bg-muted flex items-center justify-center transition-all cursor-pointer hover:ring-2 hover:ring-primary/60 group"
                        style={{ aspectRatio: '19.5 / 25' }}
                        title="Click to upload candidate photograph"
                      >
                        {newApplicantForm.avatarUrl ? (
                          <img
                            src={newApplicantForm.avatarUrl}
                            alt="Candidate Photograph Preview"
                            style={{ aspectRatio: '19.5 / 25' }}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted text-muted-foreground font-black text-2xl flex items-center justify-center">
                            {newApplicantForm.name ? newApplicantForm.name.slice(0, 2).toUpperCase() : 'VF'}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-white">
                          <Camera className="h-5 w-5 text-white" />
                          <span className="text-[10px] font-bold tracking-tight">Upload Photo</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => newAvatarFileInputRef.current?.click()}
                        className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer border-2 border-card"
                        title="Upload Photo"
                      >
                        <Camera className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Bio Fields Grid */}
                    <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                          Candidate Full Legal Name <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Aryan Malhotra"
                          value={newApplicantForm.name}
                          onChange={(e) => setNewApplicantForm({ ...newApplicantForm, name: e.target.value })}
                          className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={newApplicantForm.dob}
                          onChange={(e) => setNewApplicantForm({ ...newApplicantForm, dob: e.target.value })}
                          className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                          Gender
                        </label>
                        <select
                          value={newApplicantForm.gender}
                          onChange={(e) => setNewApplicantForm({ ...newApplicantForm, gender: e.target.value })}
                          className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-Binary">Non-Binary</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                          Blood Group
                        </label>
                        <select
                          value={newApplicantForm.bloodGroup}
                          onChange={(e) => setNewApplicantForm({ ...newApplicantForm, bloodGroup: e.target.value })}
                          className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                          Aadhaar / National ID
                        </label>
                        <input
                          type="text"
                          placeholder="4928-1092-8841"
                          value={newApplicantForm.aadhaarNo}
                          onChange={(e) => setNewApplicantForm({ ...newApplicantForm, aadhaarNo: e.target.value })}
                          className="w-full h-9 px-3 text-xs font-bold font-mono rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                          Quota / Category
                        </label>
                        <select
                          value={newApplicantForm.quotaCategory}
                          onChange={(e) => setNewApplicantForm({ ...newApplicantForm, quotaCategory: e.target.value })}
                          className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                        >
                          <option value="General Merit">General Merit</option>
                          <option value="RTE 25% Quota">RTE 25% Quota</option>
                          <option value="Management Quota">Management Quota</option>
                          <option value="Sports Merit">Sports Merit</option>
                          <option value="Sibling Quota">Sibling Quota</option>
                          <option value="Staff Ward">Staff Ward</option>
                          <option value="Armed Forces / Defence">Armed Forces / Defence</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                          Applied Grade / Class <span className="text-rose-400">*</span>
                        </label>
                        <select
                          value={newApplicantForm.appliedGrade}
                          onChange={(e) => setNewApplicantForm({ ...newApplicantForm, appliedGrade: e.target.value })}
                          className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                        >
                          <option value="Nursery">Nursery</option>
                          <option value="Kindergarten (KG)">Kindergarten (KG)</option>
                          <option value="Class 1">Class 1</option>
                          <option value="Class 2">Class 2</option>
                          <option value="Class 3">Class 3</option>
                          <option value="Class 4">Class 4</option>
                          <option value="Class 5">Class 5</option>
                          <option value="Class 6">Class 6</option>
                          <option value="Class 7">Class 7</option>
                          <option value="Class 8">Class 8</option>
                          <option value="Class 9">Class 9</option>
                          <option value="Class 10">Class 10</option>
                          <option value="Class 11-Sci">Class 11-Sci</option>
                          <option value="Class 11-Comm">Class 11-Comm</option>
                          <option value="Class 11-Hum">Class 11-Hum</option>
                          <option value="Class 12-Sci">Class 12-Sci</option>
                          <option value="Class 12-Comm">Class 12-Comm</option>
                          <option value="Class 12-Hum">Class 12-Hum</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                          Stream / Wing Curriculum
                        </label>
                        <select
                          value={newApplicantForm.streamPreference}
                          onChange={(e) => setNewApplicantForm({ ...newApplicantForm, streamPreference: e.target.value })}
                          className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                        >
                          <option value="General Secondary (CBSE)">General Secondary (CBSE)</option>
                          <option value="Physics, Chemistry, Maths & CS (PCM)">Physics, Chemistry, Maths & CS (PCM)</option>
                          <option value="Physics, Chemistry, Biology & Biotech (PCB)">Physics, Chemistry, Biology & Biotech (PCB)</option>
                          <option value="Commerce, Accounts & Applied Maths">Commerce, Accounts & Applied Maths</option>
                          <option value="Humanities, Economics & Psychology">Humanities, Economics & Psychology</option>
                          <option value="Middle Wing Foundation">Middle Wing Foundation</option>
                          <option value="Primary Wing Foundation">Primary Wing Foundation</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/20 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Step 1 of 4: Candidate Bio Details</span>
                  <VFButton
                    size="sm"
                    variant="outline"
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                    onClick={() => setNewAdmissionTab('guardian')}
                  >
                    Proceed to Guardian Contacts
                  </VFButton>
                </div>
              </div>
            )}

            {/* TAB 2: GUARDIAN & EMERGENCY CONTACTS */}
            {newAdmissionTab === 'guardian' && (
              <div className="animate-fade-in divide-y divide-border/40">
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Father / Primary Guardian Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikram Malhotra"
                        value={newApplicantForm.guardianName}
                        onChange={(e) => setNewApplicantForm({ ...newApplicantForm, guardianName: e.target.value })}
                        className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Guardian Relationship
                      </label>
                      <select
                        value={newApplicantForm.guardianRelation}
                        onChange={(e) => setNewApplicantForm({ ...newApplicantForm, guardianRelation: e.target.value })}
                        className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Legal Guardian">Legal Guardian</option>
                        <option value="Grandparent">Grandparent</option>
                        <option value="Sibling / Relative">Sibling / Relative</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Mother's Full Legal Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Suman Malhotra"
                        value={newApplicantForm.motherName}
                        onChange={(e) => setNewApplicantForm({ ...newApplicantForm, motherName: e.target.value })}
                        className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Primary Emergency Contact Phone <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={newApplicantForm.phone}
                        onChange={(e) => setNewApplicantForm({ ...newApplicantForm, phone: e.target.value })}
                        className="w-full h-9 px-3 text-xs font-bold font-mono rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Alternate Emergency Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98123 45678"
                        value={newApplicantForm.altPhone}
                        onChange={(e) => setNewApplicantForm({ ...newApplicantForm, altPhone: e.target.value })}
                        className="w-full h-9 px-3 text-xs font-bold font-mono rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Guardian Institutional / Personal Email
                      </label>
                      <input
                        type="email"
                        placeholder="vikram.malhotra@corp.in"
                        value={newApplicantForm.email}
                        onChange={(e) => setNewApplicantForm({ ...newApplicantForm, email: e.target.value })}
                        className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Guardian Occupation / Profession
                      </label>
                      <input
                        type="text"
                        placeholder="Senior Enterprise Architect"
                        value={newApplicantForm.guardianOccupation}
                        onChange={(e) => setNewApplicantForm({ ...newApplicantForm, guardianOccupation: e.target.value })}
                        className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Residential Home Street Address
                      </label>
                      <input
                        type="text"
                        placeholder="Flat 402, Royal Palms, Sector 14"
                        value={newApplicantForm.address}
                        onChange={(e) => setNewApplicantForm({ ...newApplicantForm, address: e.target.value })}
                        className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        City / State / Pincode
                      </label>
                      <input
                        type="text"
                        placeholder="New Delhi - 110075"
                        value={newApplicantForm.city}
                        onChange={(e) => setNewApplicantForm({ ...newApplicantForm, city: e.target.value })}
                        className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/20 flex items-center justify-between">
                  <VFButton
                    size="sm"
                    variant="outline"
                    leftIcon={<ChevronLeft className="h-4 w-4" />}
                    onClick={() => setNewAdmissionTab('bio')}
                  >
                    Back to Bio
                  </VFButton>
                  <VFButton
                    size="sm"
                    variant="outline"
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                    onClick={() => setNewAdmissionTab('academic')}
                  >
                    Proceed to Academic History
                  </VFButton>
                </div>
              </div>
            )}

            {/* TAB 3: ACADEMIC HISTORY & ENTRANCE ASSESSMENT */}
            {newAdmissionTab === 'academic' && (
              <div className="animate-fade-in divide-y divide-border/40">
                <div className="p-4 sm:p-5 space-y-5">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                      <School className="h-4 w-4 text-primary" />
                      Previous Academic Background
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                          Previous School / Institution Attended
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Delhi Public School, R.K. Puram"
                          value={newApplicantForm.previousSchool}
                          onChange={(e) => setNewApplicantForm({ ...newApplicantForm, previousSchool: e.target.value })}
                          className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                          Previous Aggregate % & Grade
                        </label>
                        <input
                          type="text"
                          placeholder="92.4% (Grade A1)"
                          value={newApplicantForm.previousMarks}
                          onChange={(e) => setNewApplicantForm({ ...newApplicantForm, previousMarks: e.target.value })}
                          className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      Entrance Assessment & Olympiad Performance
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                          Entrance Assessment Score
                        </label>
                        <input
                          type="text"
                          placeholder="96 / 100"
                          value={newApplicantForm.entranceScore}
                          onChange={(e) => setNewApplicantForm({ ...newApplicantForm, entranceScore: e.target.value })}
                          className="w-full h-9 px-3 text-xs font-black font-mono rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-emerald-400 shadow-2xs outline-none transition-all"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                          Entrance Merit Standing / Cohort Rank
                        </label>
                        <input
                          type="text"
                          placeholder="Rank #5 of 340 Candidates"
                          value={newApplicantForm.entranceRank}
                          onChange={(e) => setNewApplicantForm({ ...newApplicantForm, entranceRank: e.target.value })}
                          className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg border border-border/80 bg-muted/30 space-y-3">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide block">
                        Subject-Wise Entrance Marks Breakdown (0 to 100)
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">Mathematics</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newApplicantForm.mathsScore}
                            onChange={(e) => setNewApplicantForm({ ...newApplicantForm, mathsScore: e.target.value })}
                            className="w-full h-8 px-2.5 text-xs font-bold font-mono text-center rounded bg-background border border-border text-foreground"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">Science & Tech</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newApplicantForm.scienceScore}
                            onChange={(e) => setNewApplicantForm({ ...newApplicantForm, scienceScore: e.target.value })}
                            className="w-full h-8 px-2.5 text-xs font-bold font-mono text-center rounded bg-background border border-border text-foreground"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">English Core</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newApplicantForm.englishScore}
                            onChange={(e) => setNewApplicantForm({ ...newApplicantForm, englishScore: e.target.value })}
                            className="w-full h-8 px-2.5 text-xs font-bold font-mono text-center rounded bg-background border border-border text-foreground"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">Social Sciences</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newApplicantForm.socialScore}
                            onChange={(e) => setNewApplicantForm({ ...newApplicantForm, socialScore: e.target.value })}
                            className="w-full h-8 px-2.5 text-xs font-bold font-mono text-center rounded bg-background border border-border text-foreground"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className="text-[10px] font-bold text-muted-foreground block mb-1">Computer Apps</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newApplicantForm.computerScore}
                            onChange={(e) => setNewApplicantForm({ ...newApplicantForm, computerScore: e.target.value })}
                            className="w-full h-8 px-2.5 text-xs font-bold font-mono text-center rounded bg-background border border-border text-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/20 flex items-center justify-between">
                  <VFButton
                    size="sm"
                    variant="outline"
                    leftIcon={<ChevronLeft className="h-4 w-4" />}
                    onClick={() => setNewAdmissionTab('guardian')}
                  >
                    Back to Guardian
                  </VFButton>
                  <VFButton
                    size="sm"
                    variant="outline"
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                    onClick={() => setNewAdmissionTab('documents')}
                  >
                    Proceed to Verification & Transport
                  </VFButton>
                </div>
              </div>
            )}

            {/* TAB 4: VERIFICATION, TRANSPORT & FINAL ENROLLMENT */}
            {newAdmissionTab === 'documents' && (
              <div className="animate-fade-in divide-y divide-border/40">
                <div className="p-4 sm:p-5 space-y-5">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-primary" />
                      Mandatory Document Verification Checklist
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { key: 'tcAvailable', label: 'Transfer Certificate (TC)', desc: 'Official stamped transfer certificate from previous recognized school' },
                        { key: 'birthCertVerified', label: 'Municipal Birth Certificate', desc: 'Verified birth identity certificate issued by Municipal Corporation' },
                        { key: 'marksheetVerified', label: 'Previous Academic Marksheet', desc: 'Grade progress report card and attested examination marksheet' },
                        { key: 'aadhaarVerified', label: 'Aadhaar / National Identity', desc: 'National ID biometric card copy of candidate and primary guardian' },
                        { key: 'medicalClearance', label: 'Medical Fitness Certificate', desc: 'Doctor fitness clearance, vaccination history & health declaration' },
                      ].map((item) => {
                        const checked = (newApplicantForm as any)[item.key];
                        return (
                          <div
                            key={item.key}
                            onClick={() => setNewApplicantForm({ ...newApplicantForm, [item.key]: !checked })}
                            className={cn(
                              "p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 select-none",
                              checked
                                ? "bg-emerald-500/10 border-emerald-500/30 text-foreground"
                                : "bg-card border-border/80 text-muted-foreground hover:bg-muted/40"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
                              className="mt-0.5 rounded text-primary focus:ring-0 cursor-pointer"
                            />
                            <div className="flex-1">
                              <span className="text-xs font-bold block">{item.label}</span>
                              <span className="text-[10px] text-muted-foreground block mt-0.5 leading-tight">{item.desc}</span>
                            </div>
                            <VFBadge variant={checked ? 'success' : 'outline'} className="text-[10px] font-mono shrink-0">
                              {checked ? 'Verified' : 'Pending'}
                            </VFBadge>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Commute / Transport Preference
                      </label>
                      <select
                        value={newApplicantForm.transportPreference}
                        onChange={(e) => setNewApplicantForm({ ...newApplicantForm, transportPreference: e.target.value })}
                        className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                      >
                        <option value="Bus Route 4 (Stop #12 - Sector 62)">Bus Route 4 (Sector 62)</option>
                        <option value="Bus Route 1 (Sector 14 Main Gate)">Bus Route 1 (Sector 14)</option>
                        <option value="Bus Route 2 (Dwarka Expressway)">Bus Route 2 (Dwarka)</option>
                        <option value="Bus Route 7 (Vasant Kunj Hub)">Bus Route 7 (Vasant Kunj)</option>
                        <option value="Self Commute (Parent Drop / Walk)">Self Commute (Parent Drop)</option>
                        <option value="Private Van Operator">Private Van Operator</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Annual Tuition Fee Allotment
                      </label>
                      <input
                        type="text"
                        placeholder="₹ 84,000"
                        value={newApplicantForm.annualFee}
                        onChange={(e) => setNewApplicantForm({ ...newApplicantForm, annualFee: e.target.value })}
                        className="w-full h-9 px-3 text-xs font-bold font-mono rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Initial Admissions Pipeline Stage
                      </label>
                      <select
                        value={newApplicantForm.stage}
                        onChange={(e) => setNewApplicantForm({ ...newApplicantForm, stage: e.target.value as any })}
                        className="w-full h-9 px-3 text-xs font-bold rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all"
                      >
                        <option value="Submitted">Submitted (Under Review)</option>
                        <option value="Screened">Screened (Documents Verified)</option>
                        <option value="Interview">Interview Scheduled</option>
                        <option value="Approved">Approved (Direct Enrollment)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                      Admissions Committee & Interviewer Remarks
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Enter verification notes, olympiad achievements, special accommodations, or cohort notes..."
                      value={newApplicantForm.notes}
                      onChange={(e) => setNewApplicantForm({ ...newApplicantForm, notes: e.target.value })}
                      className="w-full p-2.5 text-xs font-medium rounded-md bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted/20 flex items-center justify-between">
                  <VFButton
                    size="sm"
                    variant="outline"
                    leftIcon={<ChevronLeft className="h-4 w-4" />}
                    onClick={() => setNewAdmissionTab('academic')}
                  >
                    Back to Academics
                  </VFButton>
                  <VFButton
                    size="sm"
                    leftIcon={<CheckCircle2 className="h-4 w-4" />}
                    onClick={handleSubmitNewAdmission}
                  >
                    Submit & Enroll Candidate
                  </VFButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </VFDrawer>

      {/* ═══════════════════════════════════════════════════════════════════════
          360° ADMISSIONS APPLICANT DOSSIER & APPLICATION REVIEW DRAWER
          ═══════════════════════════════════════════════════════════════════════ */}
      <VFDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsEditingApplicant(false);
          setApplicantFormData(null);
          setIsDrawerOpen(false);
        }}
        hideHeader={true}
        title={activeApplicant ? activeApplicant.name : 'Applicant Profile'}
        className="w-[960px] max-w-[96vw] sm:max-w-4xl lg:max-w-5xl"
        bodyClassName="p-0 flex flex-col flex-1 min-h-0 overflow-hidden"
        footerActions={
          <div className="flex items-center justify-between w-full gap-3">
            {isEditingApplicant ? (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
                    {applicantFormData?.applicantId || activeApplicant?.applicantId}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Modifying Candidate Records
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <VFButton
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </VFButton>
                  <VFButton
                    size="sm"
                    leftIcon={<Check className="h-4 w-4" />}
                    onClick={handleSaveApplicant}
                  >
                    Save Changes
                  </VFButton>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1 bg-muted/60 h-8 px-1.5 rounded-md border border-border">
                  <button
                    onClick={handlePrevApplicant}
                    disabled={selectedApplicantIndex === 0}
                    className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted cursor-pointer transition-colors"
                    title="Previous Candidate (Keyboard: ←)"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold px-2 text-foreground select-none leading-none">
                    {selectedApplicantIndex !== null ? selectedApplicantIndex + 1 : 1} of {applicantList.length}
                  </span>
                  <button
                    onClick={handleNextApplicant}
                    disabled={selectedApplicantIndex === applicantList.length - 1}
                    className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted cursor-pointer transition-colors"
                    title="Next Candidate (Keyboard: →)"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <VFButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingApplicant(false);
                      setApplicantFormData(null);
                      setIsDrawerOpen(false);
                    }}
                  >
                    Cancel
                  </VFButton>
                  <VFButton
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit3 className="h-4 w-4" />}
                    onClick={handleStartEdit}
                  >
                    Edit Application
                  </VFButton>
                  <VFButton
                    size="sm"
                    leftIcon={<CheckCircle2 className="h-4 w-4" />}
                    onClick={() => activeApplicant && handleApproveAdmit(activeApplicant)}
                  >
                    {activeApplicant?.stage === 'Approved' ? 'View Offer Letter' : 'Approve & Issue Offer'}
                  </VFButton>
                </div>
              </>
            )}
          </div>
        }
      >
        {activeApplicant && (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden animate-fade-in">
            {/* Tabs Header Bar */}
            <div className="w-full bg-card/95 backdrop-blur-md border-b border-border shrink-0">
              <div className="grid grid-cols-4 w-full">
                {[
                  { id: 'overview', label: 'Profile', icon: <UserCheck className="h-4 w-4" /> },
                  { id: 'academics', label: 'Academics & Exams', icon: <BarChart3 className="h-4 w-4" /> },
                  { id: 'documents', label: 'Verification & Compliance', icon: <FileCheck className="h-4 w-4" /> },
                  { id: 'decisions', label: 'Offer & Decision', icon: <FileBadge2 className="h-4 w-4" /> },
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

            {/* Scrollable Tab Content View */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {drawerTab === 'overview' && (
                <div className="animate-fade-in divide-y divide-border/40">
                  {/* Photo & Core Identity */}
                  <div className="px-4 py-3">
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      {/* 19.5:25 Photo Frame */}
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
                            if (isEditingApplicant && avatarFileInputRef.current) {
                              avatarFileInputRef.current.click();
                            }
                          }}
                          className={cn(
                            "relative overflow-hidden rounded-md border border-border/90 shadow-sm w-24 sm:w-28 bg-muted flex items-center justify-center transition-all group",
                            isEditingApplicant ? "cursor-pointer hover:ring-2 hover:ring-primary/60" : ""
                          )}
                          style={{ aspectRatio: '19.5 / 25' }}
                        >
                          <img
                            src={isEditingApplicant && applicantFormData?.avatarUrl ? applicantFormData.avatarUrl : activeApplicant.avatarUrl}
                            alt={isEditingApplicant && applicantFormData?.name ? applicantFormData.name : activeApplicant.name}
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
                            {(isEditingApplicant && applicantFormData?.name ? applicantFormData.name : activeApplicant.name).split(' ').map((n: string) => n[0]).join('')}
                          </div>

                          {isEditingApplicant && (
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-white">
                              <Camera className="h-5 w-5 text-white" />
                              <span className="text-[10px] font-bold tracking-tight">Upload</span>
                            </div>
                          )}
                        </div>
                        {isEditingApplicant ? (
                          <button
                            type="button"
                            onClick={() => avatarFileInputRef.current?.click()}
                            className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer border-2 border-card"
                            title="Change Candidate Photo"
                          >
                            <Camera className="h-3 w-3" />
                          </button>
                        ) : (
                          <span
                            className={cn(
                              "absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-card ring-2",
                              activeApplicant.stage === 'Approved'
                                ? "bg-emerald-500 ring-emerald-500/20"
                                : activeApplicant.stage === 'Interview'
                                ? "bg-amber-500 ring-amber-500/20"
                                : "bg-blue-500 ring-blue-500/20"
                            )}
                            title={`Status: ${activeApplicant.stage}`}
                          />
                        )}
                      </div>

                      {/* Fields Grid */}
                      <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
                        <div className="col-span-2 sm:col-span-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                            Candidate Full Name
                          </label>
                          <input
                            type="text"
                            readOnly={!isEditingApplicant}
                            value={isEditingApplicant && applicantFormData ? applicantFormData.name : activeApplicant.name}
                            onChange={(e) => isEditingApplicant && applicantFormData && setApplicantFormData({ ...applicantFormData, name: e.target.value })}
                            className={cn(
                              "w-full h-9 px-3 text-xs font-bold rounded-md outline-none transition-all",
                              isEditingApplicant
                                ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                                : "bg-muted/30 border border-border/70 text-foreground"
                            )}
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                            Applicant ID
                          </label>
                          <input
                            type="text"
                            readOnly={true}
                            value={activeApplicant.applicantId}
                            className="w-full h-9 px-3 text-xs font-mono font-bold rounded-md outline-none bg-muted/30 border border-border/70 text-foreground"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                            Applied Grade
                          </label>
                          <input
                            type="text"
                            readOnly={!isEditingApplicant}
                            value={isEditingApplicant && applicantFormData ? applicantFormData.appliedGrade : activeApplicant.appliedGrade}
                            onChange={(e) => isEditingApplicant && applicantFormData && setApplicantFormData({ ...applicantFormData, appliedGrade: e.target.value })}
                            className={cn(
                              "w-full h-9 px-3 text-xs font-semibold rounded-md outline-none transition-all",
                              isEditingApplicant
                                ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                                : "bg-muted/30 border border-border/70 text-foreground"
                            )}
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                            Stream Preference
                          </label>
                          <input
                            type="text"
                            readOnly={!isEditingApplicant}
                            value={isEditingApplicant && applicantFormData ? applicantFormData.streamPreference : activeApplicant.streamPreference}
                            onChange={(e) => isEditingApplicant && applicantFormData && setApplicantFormData({ ...applicantFormData, streamPreference: e.target.value })}
                            className={cn(
                              "w-full h-9 px-3 text-xs font-semibold rounded-md outline-none transition-all",
                              isEditingApplicant
                                ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                                : "bg-muted/30 border border-border/70 text-foreground"
                            )}
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                            Date of Birth
                          </label>
                          <input
                            type="text"
                            readOnly={!isEditingApplicant}
                            value={isEditingApplicant && applicantFormData ? applicantFormData.dob : activeApplicant.dob}
                            onChange={(e) => isEditingApplicant && applicantFormData && setApplicantFormData({ ...applicantFormData, dob: e.target.value })}
                            className={cn(
                              "w-full h-9 px-3 text-xs font-mono font-semibold rounded-md outline-none transition-all",
                              isEditingApplicant
                                ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                                : "bg-muted/30 border border-border/70 text-foreground"
                            )}
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                            Blood Group
                          </label>
                          <input
                            type="text"
                            readOnly={!isEditingApplicant}
                            value={isEditingApplicant && applicantFormData ? applicantFormData.bloodGroup : (activeApplicant.bloodGroup || 'B+')}
                            onChange={(e) => isEditingApplicant && applicantFormData && setApplicantFormData({ ...applicantFormData, bloodGroup: e.target.value })}
                            className={cn(
                              "w-full h-9 px-3 text-xs font-mono font-semibold rounded-md outline-none transition-all",
                              isEditingApplicant
                                ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                                : "bg-muted/30 border border-border/70 text-foreground"
                            )}
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                            Quota Category
                          </label>
                          <input
                            type="text"
                            readOnly={!isEditingApplicant}
                            value={isEditingApplicant && applicantFormData ? applicantFormData.quotaCategory : activeApplicant.quotaCategory}
                            onChange={(e) => isEditingApplicant && applicantFormData && setApplicantFormData({ ...applicantFormData, quotaCategory: e.target.value })}
                            className={cn(
                              "w-full h-9 px-3 text-xs font-semibold rounded-md outline-none transition-all",
                              isEditingApplicant
                                ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                                : "bg-muted/30 border border-border/70 text-foreground"
                            )}
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                            Intake Stage
                          </label>
                          {isEditingApplicant && applicantFormData ? (
                            <select
                              value={applicantFormData.stage}
                              onChange={(e) => setApplicantFormData({ ...applicantFormData, stage: e.target.value as any })}
                              className="w-full h-9 px-2 text-xs font-semibold rounded-md outline-none bg-background border border-border/90 text-foreground"
                            >
                              {['Submitted', 'Screened', 'Interview', 'Approved'].map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              readOnly={true}
                              value={activeApplicant.stage}
                              className="w-full h-9 px-3 text-xs font-semibold rounded-md outline-none bg-muted/30 border border-border/70 text-foreground"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Family & Guardian Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-4 py-3">
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Father / Primary Guardian Name
                      </label>
                      <input
                        type="text"
                        readOnly={!isEditingApplicant}
                        value={isEditingApplicant && applicantFormData ? applicantFormData.guardianName : activeApplicant.guardianName}
                        onChange={(e) => isEditingApplicant && applicantFormData && setApplicantFormData({ ...applicantFormData, guardianName: e.target.value })}
                        className={cn(
                          "w-full h-9 px-3 text-xs font-semibold rounded-md outline-none transition-all",
                          isEditingApplicant
                            ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                            : "bg-muted/30 border border-border/70 text-foreground"
                        )}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Mother's Full Legal Name
                      </label>
                      <input
                        type="text"
                        readOnly={!isEditingApplicant}
                        value={isEditingApplicant && applicantFormData ? applicantFormData.motherName : activeApplicant.motherName}
                        onChange={(e) => isEditingApplicant && applicantFormData && setApplicantFormData({ ...applicantFormData, motherName: e.target.value })}
                        className={cn(
                          "w-full h-9 px-3 text-xs font-semibold rounded-md outline-none transition-all",
                          isEditingApplicant
                            ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                            : "bg-muted/30 border border-border/70 text-foreground"
                        )}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Primary Contact Phone
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          readOnly={!isEditingApplicant}
                          value={isEditingApplicant && applicantFormData ? applicantFormData.phone : activeApplicant.phone}
                          onChange={(e) => isEditingApplicant && applicantFormData && setApplicantFormData({ ...applicantFormData, phone: e.target.value })}
                          className={cn(
                            "flex-1 h-9 px-3 text-xs font-mono font-bold rounded-md outline-none transition-all",
                            isEditingApplicant
                              ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                              : "bg-muted/30 border border-border/70 text-foreground"
                          )}
                        />
                        {!isEditingApplicant && (
                          <>
                            <button
                              type="button"
                              onClick={() => window.open(`https://wa.me/${activeApplicant.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                              className="h-9 px-2.5 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="WhatsApp Guardian"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">WhatsApp</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopy(activeApplicant.phone, 'phone')}
                              className="h-9 px-2 rounded-md bg-muted hover:bg-muted/80 border border-border text-foreground text-xs flex items-center gap-1 cursor-pointer transition-colors"
                              title="Copy Phone"
                            >
                              {copiedKey === 'phone' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Guardian Email Address
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          readOnly={!isEditingApplicant}
                          value={isEditingApplicant && applicantFormData ? applicantFormData.email : activeApplicant.email}
                          onChange={(e) => isEditingApplicant && applicantFormData && setApplicantFormData({ ...applicantFormData, email: e.target.value })}
                          className={cn(
                            "flex-1 h-9 px-3 text-xs font-mono font-medium rounded-md outline-none transition-all",
                            isEditingApplicant
                              ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                              : "bg-muted/30 border border-border/70 text-foreground"
                          )}
                        />
                        {!isEditingApplicant && (
                          <button
                            type="button"
                            onClick={() => handleCopy(activeApplicant.email, 'email')}
                            className="h-9 px-2 rounded-md bg-muted hover:bg-muted/80 border border-border text-foreground text-xs flex items-center gap-1 cursor-pointer transition-colors"
                            title="Copy Email"
                          >
                            {copiedKey === 'email' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prior Education & Commute */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-4 py-3">
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Previous School / Institution
                      </label>
                      <input
                        type="text"
                        readOnly={!isEditingApplicant}
                        value={isEditingApplicant && applicantFormData ? applicantFormData.previousSchool : activeApplicant.previousSchool}
                        onChange={(e) => isEditingApplicant && applicantFormData && setApplicantFormData({ ...applicantFormData, previousSchool: e.target.value })}
                        className={cn(
                          "w-full h-9 px-3 text-xs font-semibold rounded-md outline-none transition-all",
                          isEditingApplicant
                            ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                            : "bg-muted/30 border border-border/70 text-foreground"
                        )}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Previous Academic Marks / Grade
                      </label>
                      <input
                        type="text"
                        readOnly={!isEditingApplicant}
                        value={isEditingApplicant && applicantFormData ? applicantFormData.previousMarks : activeApplicant.previousMarks}
                        onChange={(e) => isEditingApplicant && applicantFormData && setApplicantFormData({ ...applicantFormData, previousMarks: e.target.value })}
                        className={cn(
                          "w-full h-9 px-3 text-xs font-semibold rounded-md outline-none transition-all",
                          isEditingApplicant
                            ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                            : "bg-muted/30 border border-border/70 text-foreground"
                        )}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                        Full Residential Address
                      </label>
                      <input
                        type="text"
                        readOnly={!isEditingApplicant}
                        value={isEditingApplicant && applicantFormData ? applicantFormData.address : activeApplicant.address}
                        onChange={(e) => isEditingApplicant && applicantFormData && setApplicantFormData({ ...applicantFormData, address: e.target.value })}
                        className={cn(
                          "w-full h-9 px-3 text-xs font-medium rounded-md outline-none transition-all",
                          isEditingApplicant
                            ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                            : "bg-muted/30 border border-border/70 text-foreground"
                        )}
                      />
                    </div>
                  </div>

                  {/* Notes / Remarks */}
                  <div className="px-4 py-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">
                      Admissions Notes & Verification Remarks
                    </label>
                    <input
                      type="text"
                      readOnly={!isEditingApplicant}
                      value={isEditingApplicant && applicantFormData ? (applicantFormData.notes || '') : (activeApplicant.notes || 'Standard CBSE admissions intake dossier.')}
                      onChange={(e) => isEditingApplicant && applicantFormData && setApplicantFormData({ ...applicantFormData, notes: e.target.value })}
                      className={cn(
                        "w-full h-9 px-3 text-xs font-medium rounded-md outline-none transition-all",
                        isEditingApplicant
                          ? "bg-background border border-border/90 hover:border-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground shadow-2xs"
                          : "bg-muted/30 border border-border/70 text-foreground"
                      )}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: ACADEMICS & ENTRANCE */}
              {drawerTab === 'academics' && (
                <div className="animate-fade-in divide-y divide-border/40">
                  {/* Entrance Exam Summary */}
                  <div className="px-4 py-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-2">
                      Entrance & Aptitude Assessment Metrics
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="p-3 rounded-md bg-muted/30 border border-border/70">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Entrance Score</span>
                        <span className="text-xl font-black text-foreground block mt-0.5">{activeApplicant.entranceScore}</span>
                        <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">Top Tier Percentile</span>
                      </div>
                      <div className="p-3 rounded-md bg-muted/30 border border-border/70">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Merit Rank</span>
                        <span className="text-xl font-black text-foreground block mt-0.5">{activeApplicant.entranceRank}</span>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">Admissions Pool</span>
                      </div>
                      <div className="p-3 rounded-md bg-muted/30 border border-border/70">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Prior Performance</span>
                        <span className="text-xl font-black text-emerald-400 block mt-0.5">{activeApplicant.previousMarks}</span>
                        <span className="text-[10px] text-muted-foreground block mt-0.5 truncate">{activeApplicant.previousSchool}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subject Scores Breakdown */}
                  <div className="px-4 py-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-2">
                      Subject Scorecard & Transfer Breakdown
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {activeApplicant.subjectScores && activeApplicant.subjectScores.length > 0 ? (
                        activeApplicant.subjectScores.map((sub, i) => (
                          <div key={i} className="p-2.5 rounded-md bg-muted/30 border border-border/70 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-foreground text-xs block">{sub.subject}</span>
                              <span className="text-[11px] font-mono text-muted-foreground block">{sub.score}</span>
                            </div>
                            <VFBadge variant="success" className="font-mono text-[10px] font-bold">
                              {sub.grade}
                            </VFBadge>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-4 text-xs text-muted-foreground">
                          Scorecard verified from prior transfer records.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Faculty Interview Evaluation */}
                  {activeApplicant.interviewRecord && (
                    <div className="px-4 py-3">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-2">
                        Faculty Interview & Evaluation Dossier
                      </span>
                      <div className="p-3.5 rounded-md bg-muted/30 border border-border/70 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="text-xs font-bold text-foreground block">{activeApplicant.interviewRecord.interviewer}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">Date: {activeApplicant.interviewRecord.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded border border-border">
                              Score: {activeApplicant.interviewRecord.score}
                            </span>
                            <VFBadge variant="success" className="text-[10px]">
                              {activeApplicant.interviewRecord.recommendation}
                            </VFBadge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/50">
                          {activeApplicant.interviewRecord.remarks}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: VERIFICATION & COMPLIANCE */}
              {drawerTab === 'documents' && (
                <div className="animate-fade-in divide-y divide-border/40">
                  {/* Merit Score Tiles */}
                  <div className="px-4 py-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-2">
                      Institutional Merit & Aptitude Assessment
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-3 rounded-md bg-muted/30 border border-border/70">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Merit Score</span>
                        <span className="text-xl font-black text-emerald-400 block mt-0.5">{activeApplicant.fitScore}%</span>
                      </div>
                      <div className="p-3 rounded-md bg-muted/30 border border-border/70">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Doc Clearance</span>
                        <span className="text-sm font-bold text-foreground block mt-1">{activeApplicant.ocrDocStatus}</span>
                      </div>
                      <div className="p-3 rounded-md bg-muted/30 border border-border/70">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Recommendation</span>
                        <span className="text-xs font-bold text-foreground block mt-1 truncate">{activeApplicant.recommendation}</span>
                      </div>
                      <div className="p-3 rounded-md bg-muted/30 border border-border/70">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Quota Allotment</span>
                        <span className="text-xs font-bold text-primary block mt-1 truncate">{activeApplicant.quotaCategory}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mandatory Document Matrix */}
                  <div className="px-4 py-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-2">
                      Mandatory Document Clearance Matrix
                    </span>
                    <div className="space-y-1.5">
                      {[
                        {
                          title: 'Transfer Certificate (TC) from Prior School',
                          desc: 'Official counter-signed TC with DEO seal',
                          status: activeApplicant.tcAvailable,
                          statusText: activeApplicant.tcAvailable ? 'Verified & Scanned' : 'Pending Submission',
                        },
                        {
                          title: 'Municipal Birth Certificate',
                          desc: 'DOB cross-verified against applicant record',
                          status: activeApplicant.birthCertVerified,
                          statusText: activeApplicant.birthCertVerified ? 'Verified (Registry Match 99.4%)' : 'Under Verification',
                        },
                        {
                          title: 'Prior Year Report Cards & Marks Statement',
                          desc: 'Official mark sheets for previous 2 academic terms',
                          status: activeApplicant.marksheetVerified,
                          statusText: activeApplicant.marksheetVerified ? 'Verified & Authenticated' : 'Missing Seal',
                        },
                        {
                          title: 'Candidate & Guardian Aadhaar Card / ID Proof',
                          desc: 'UIDAI biometric validation and address proof match',
                          status: activeApplicant.aadhaarVerified,
                          statusText: activeApplicant.aadhaarVerified ? 'Verified & Linked' : 'Pending Scan',
                        },
                        {
                          title: 'Medical Fitness & Blood Group Certificate',
                          desc: 'Doctor clearance for physical education and sports',
                          status: activeApplicant.medicalClearance,
                          statusText: activeApplicant.medicalClearance ? 'Cleared' : 'Pending Slip',
                        },
                      ].map((doc, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-md bg-muted/30 border border-border/70 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                "h-6 w-6 rounded flex items-center justify-center shrink-0 text-xs font-black",
                                doc.status ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              )}
                            >
                              {doc.status ? '✓' : '!'}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-foreground truncate">{doc.title}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{doc.desc}</p>
                            </div>
                          </div>
                          <VFBadge variant={doc.status ? 'success' : 'warning'} className="text-[10px] shrink-0">
                            {doc.statusText}
                          </VFBadge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DECISION & OFFER */}
              {drawerTab === 'decisions' && (
                <div className="animate-fade-in divide-y divide-border/40">
                  {/* Status & Fee Structure */}
                  <div className="px-4 py-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block mb-2">
                      Admissions Committee Determination
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-3 rounded-md bg-muted/30 border border-border/70">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Admission Status</span>
                        <p className="text-base font-black text-foreground mt-0.5">
                          {activeApplicant.stage === 'Approved' ? 'Provisional Offer Issued' : 'Under Review & Screening'}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Target Session: <strong className="text-foreground">{activeSession}</strong>
                        </p>
                      </div>
                      <div className="p-3 rounded-md bg-muted/30 border border-border/70">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Annual Composite Tuition</span>
                        <p className="text-base font-black text-foreground mt-0.5">{activeApplicant.annualFee}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Includes Tuition, Labs & Activities
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Letterhead Preview */}
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                        Provisional Admission Letterhead
                      </span>
                      <VFButton
                        size="sm"
                        variant="outline"
                        leftIcon={<Printer className="h-3.5 w-3.5" />}
                        onClick={() => {
                          setOfferApplicant(activeApplicant);
                          setIsOfferModalOpen(true);
                        }}
                      >
                        Print Offer Letter
                      </VFButton>
                    </div>
                    <div className="p-4 rounded-md bg-muted/20 border border-border/70 font-serif text-xs space-y-2 leading-relaxed text-foreground">
                      <div className="flex items-center justify-between border-b border-border/50 pb-1.5 text-[11px] font-mono text-muted-foreground">
                        <span>Ref: VM/ADM/{activeSession.split('–')[0]}/{activeApplicant.applicantId}</span>
                        <span>Date: {activeApplicant.appliedDate}</span>
                      </div>
                      <p>Dear <strong className="text-foreground">{activeApplicant.guardianName}</strong>,</p>
                      <p>
                        Following evaluation by the Admissions Committee, <strong className="text-foreground">{activeApplicant.name}</strong> has been granted <span className="font-bold text-emerald-400">Provisional Admission</span> into <strong className="text-foreground">{activeApplicant.appliedGrade}</strong> ({activeApplicant.streamPreference}) for Academic Session {activeSession}.
                      </p>
                      <p className="text-[11px] text-muted-foreground font-sans pt-1">
                        To confirm enrollment, finalize document verification and complete initial term fee submission within 7 business days.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </VFDrawer>

      {/* ═══════════════════════════════════════════════════════════════════════
          OFFICIAL PROVISIONAL ADMISSION OFFER LETTER MODAL
          ═══════════════════════════════════════════════════════════════════════ */}
      <VFDialog
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        title="Provisional Admission Offer Letter"
        className="max-w-2xl"
        footerActions={
          <div className="flex items-center justify-between w-full">
            <VFButton variant="outline" size="sm" onClick={() => setIsOfferModalOpen(false)}>
              Close
            </VFButton>
            <div className="flex items-center gap-2">
              <VFButton
                size="sm"
                leftIcon={<Printer className="h-4 w-4" />}
                onClick={() => {
                  window.print();
                }}
              >
                Print Offer Letter
              </VFButton>
            </div>
          </div>
        }
      >
        {offerApplicant && (
          <div className="space-y-5 p-4 rounded-md bg-card border border-border text-foreground font-serif text-sm">
            <div className="text-center pb-4 border-b border-border space-y-1">
              <h2 className="text-xl font-black tracking-tight text-foreground font-sans uppercase">
                VidyaMaxx International Academy
              </h2>
              <p className="text-xs text-muted-foreground font-sans">
                Affiliated to Central Board of Secondary Education (CBSE), New Delhi
              </p>
              <p className="text-xs font-mono text-muted-foreground font-sans">
                Ref No: VF/ADM/{offerApplicant.applicantId} · Session {activeSession}
              </p>
            </div>

            <div className="flex justify-between items-start text-xs font-sans">
              <div>
                <p className="font-bold text-foreground">To:</p>
                <p className="font-semibold">{offerApplicant.guardianName}</p>
                <p className="text-muted-foreground">{offerApplicant.address}</p>
                <p className="text-muted-foreground font-mono">{offerApplicant.phone}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">Date: {offerApplicant.appliedDate}</p>
                <p className="text-emerald-400 font-bold">Status: Provisional Offer Granted</p>
              </div>
            </div>

            <div className="space-y-3 leading-relaxed">
              <p className="font-bold text-base">
                Subject: Provisional Offer of Admission for {offerApplicant.name} ({offerApplicant.appliedGrade})
              </p>
              <p>
                We have reviewed the entrance assessments and academic records of your ward,{' '}
                <span className="font-bold">{offerApplicant.name}</span>. We are pleased to formally extend a provisional offer of admission into{' '}
                <span className="font-bold">{offerApplicant.appliedGrade}</span> ({offerApplicant.streamPreference}) for Academic Session {activeSession}.
              </p>

              <div className="p-4 rounded-lg bg-muted/40 font-sans text-xs space-y-1.5 border border-border/60">
                <p className="font-bold text-foreground">Admission Details Summary:</p>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground pt-1">
                  <span>Candidate Name: <strong className="text-foreground">{offerApplicant.name}</strong></span>
                  <span>Applicant ID: <strong className="text-foreground">{offerApplicant.applicantId}</strong></span>
                  <span>Applied Grade: <strong className="text-foreground">{offerApplicant.appliedGrade}</strong></span>
                  <span>Annual Fee: <strong className="text-foreground">{offerApplicant.annualFee}</strong></span>
                  <span>Merit Score: <strong className="text-emerald-400">{offerApplicant.fitScore}%</strong></span>
                  <span>Entrance Rank: <strong className="text-foreground">{offerApplicant.entranceRank}</strong></span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Please confirm enrollment within 7 working days with the admissions office.
              </p>
            </div>

            <div className="pt-6 border-t border-border flex items-center justify-between text-xs font-sans text-muted-foreground">
              <div>
                <p className="font-bold text-foreground">Dr. V. Malhotra</p>
                <p>Dean of Admissions & Registrar</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded border border-emerald-500/40 text-emerald-400 font-bold">
                  ✓ VERIFIED ADMISSION
                </span>
              </div>
            </div>
          </div>
        )}
      </VFDialog>

      {/* 📦 EXPORT ADMISSIONS ROSTER MODAL */}
      <VFDialog
        isOpen={isExportModalOpen}
        onClose={() => { if (!isExporting) setIsExportModalOpen(false); }}
        title="Export Admissions Roster & Candidate Media"
        description={`Download structured candidate records, institutional spreadsheets, and high-resolution 19.5 : 25 photo archives for Academic Session ${activeSession}.`}
        className="max-w-4xl w-full"
        footerActions={
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-400 inline-block" />
              <span>{applicantList.length} Candidates Selected for Export</span>
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
              <div className="h-8 w-8 rounded-md bg-violet-500/15 text-violet-400 flex items-center justify-center font-black shrink-0 border border-violet-500/30">
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
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wider">Total Candidates</p>
                <p className="font-bold text-foreground truncate">{applicantList.length} Records</p>
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
                      exportFormat === 'bundle' ? "bg-blue-500/20 text-blue-400 border-blue-500/40" : "bg-muted text-muted-foreground border-border"
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
                    Excel master spreadsheet + HD candidate portraits in standardized 19.5:25 ratio.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="text-blue-400 font-bold">✓</span> Full candidate columns
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="text-blue-400 font-bold">✓</span> {applicantList.length} Photos packaged in ZIP
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
                      exportFormat === 'xlsx' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-muted text-muted-foreground border-border"
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
                    Formatted tables with applicant IDs, contacts, merit scores, and photo filenames.
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
                      exportFormat === 'zip' ? "bg-purple-500/20 text-purple-400 border-purple-500/40" : "bg-muted text-muted-foreground border-border"
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
                    Candidate portraits rendered in exact 19.5:25 ratio with standardized filenames.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="text-purple-400 font-bold">✓</span> Standardized 19.5:25 aspect
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="text-purple-400 font-bold">✓</span> {applicantList.length} Images in archive
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
                  <input type="radio" name="adm-naming" checked={namingPattern === 'id-name'} onChange={() => setNamingPattern('id-name')} className="text-primary accent-primary h-4 w-4" />
                  <div>
                    <span className="block font-mono text-xs">{`{Applicant ID}-{Candidate Name}.jpg`}</span>
                    <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">E.g., APP-2026-001-Priya_Sharma.jpg</span>
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
                  <input type="radio" name="adm-naming" checked={namingPattern === 'roll-name'} onChange={() => setNamingPattern('roll-name')} className="text-primary accent-primary h-4 w-4" />
                  <div>
                    <span className="block font-mono text-xs">{`{Candidate Name}.jpg`}</span>
                    <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">E.g., Priya_Sharma.jpg</span>
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
                  <input type="radio" name="adm-naming" checked={namingPattern === 'name-id'} onChange={() => setNamingPattern('name-id')} className="text-primary accent-primary h-4 w-4" />
                  <div>
                    <span className="block font-mono text-xs">{`{Candidate Name}_{Applicant ID}.jpg`}</span>
                    <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">E.g., Priya_Sharma_APP-2026-001.jpg</span>
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
                  <input type="radio" name="adm-naming" checked={namingPattern === 'custom'} onChange={() => setNamingPattern('custom')} className="text-primary accent-primary h-4 w-4" />
                  <div>
                    <span className="block font-mono text-xs">Custom Column Prefix</span>
                    <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">Select custom unique identifier</span>
                  </div>
                </label>
              </div>

              {namingPattern === 'custom' && (
                <div className="flex items-center gap-3 p-2.5 rounded-md bg-[#131317] border border-border">
                  <span className="text-xs font-bold text-foreground">Unique Column Identifier:</span>
                  <select
                    value={customColumnKey}
                    onChange={(e) => setCustomColumnKey(e.target.value)}
                    className="bg-[#1a1a24] border border-border text-xs font-bold text-foreground rounded px-3 py-1.5 outline-none cursor-pointer focus:border-primary"
                  >
                    <option value="phone">Phone Number</option>
                    <option value="appliedGrade">Applied Grade</option>
                    <option value="streamPreference">Stream Preference</option>
                    <option value="stage">Application Stage</option>
                  </select>
                </div>
              )}

              <div className="p-3 rounded-md bg-[#131317] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-muted-foreground">Generated Output Sample:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/30">
                    {applicantList[0] ? getFormattedPhotoName(applicantList[0]) : 'APP-2026-001-Priya_Sharma.jpg'}
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
    </VFPageContainer>
  );
}
