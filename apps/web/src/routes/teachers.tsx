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
  VFInput,
  VFSelect,
  VFStatCard,
  cn,
} from '@vidyamaxx/ui';
import {
  Users,
  Sparkles,
  UserCheck,
  Plus,
  Download,
  Eye,
  BookOpen,
  MessageSquare,
  Copy,
  Check,
  Edit3,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Archive,
  Printer,
  QrCode,
  CreditCard,
  Camera,
  Calendar,
  Clock,
  Award,
  FileText,
  Receipt,
  School,
  ShieldCheck,
  CheckCircle2,
  Quote,
  CheckCheck,
  TrendingUp,
  FileCheck,
  CalendarCheck2,
  Fingerprint,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/teachers')({
  component: StaffPage,
});

export interface StaffDossierFieldConfig {
  key: string;
  label: string;
  category: 'personal' | 'academic' | 'payroll';
  placeholder?: string;
  isCustom?: boolean;
  isVisible: boolean;
  type?: 'text' | 'tel' | 'email' | 'date';
}

const defaultStaffDossierFields: StaffDossierFieldConfig[] = [
  // Personal & Contact
  { key: 'name', label: 'Full Legal Name', category: 'personal', isVisible: true, isCustom: false },
  { key: 'code', label: 'Staff Employee ID', category: 'personal', isVisible: true, isCustom: false },
  { key: 'designation', label: 'Designation / Title', category: 'personal', isVisible: true, isCustom: false },
  { key: 'department', label: 'Department / Faculty', category: 'personal', isVisible: true, isCustom: false },
  { key: 'dob', label: 'Date of Birth', category: 'personal', isVisible: true, isCustom: false },
  { key: 'bloodGroup', label: 'Blood Group', category: 'personal', isVisible: true, isCustom: false },
  { key: 'aadhaarNo', label: 'National ID / Aadhaar No', category: 'personal', isVisible: true, isCustom: true },
];

interface StaffRecord {
  id: string;
  code: string;
  name: string;
  avatarUrl: string;
  designation: string;
  department: string;
  subject: string;
  secondarySubject?: string;
  assignedClasses: {
    grade: string;
    section: string;
    subject: string;
    periodsPerWeek: number;
    room: string;
  }[];
  classTeacherOf?: {
    grade: string;
    section: string;
    room: string;
    studentCount: number;
  };
  phone: string;
  email: string;
  address: string;
  dob: string;
  bloodGroup: string;
  qualification: string;
  experience: string;
  salaryGrade: string;
  basicPay: string;
  grossPay: string;
  hra: string;
  da: string;
  specialAllowance: string;
  pfDeduction: string;
  taxDeduction: string;
  netPay: string;
  bankName: string;
  bankAccountNo: string;
  bankIfsc: string;
  pfAccountNo?: string;
  aadhaarNo?: string;
  tetCertification?: string;
  emergencyContact?: string;
  attendance: string;
  weeklyPeriods: number;
  maxWeeklyPeriods: number;
  studentSatisfaction: string;
  passPercentage: string;
  status: 'Active' | 'On Leave' | 'Probation';
  joinDate: string;
  leaveBalance: {
    casual: number;
    medical: number;
    earned: number;
  };
  schedule: {
    day: string;
    period: string;
    classSection: string;
    subject: string;
    room: string;
  }[];
  payoutHistory: {
    month: string;
    gross: string;
    deductions: string;
    net: string;
    status: string;
  }[];
  attendanceLog: {
    date: string;
    day: string;
    inTime: string;
    outTime: string;
    totalHours: string;
    status: 'Present' | 'Late' | 'Leave' | 'Holiday';
  }[];
}

const INITIAL_STAFF: StaffRecord[] = [
  {
    id: '1',
    code: 'EMP-T101',
    name: 'Mrs. Sunita Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    designation: 'Senior PGT Educator',
    department: 'Science & Math',
    subject: 'Mathematics',
    secondarySubject: 'Statistics & Probability',
    assignedClasses: [
      { grade: 'Class 9', section: 'A', subject: 'Mathematics', periodsPerWeek: 6, room: 'Room 101' },
      { grade: 'Class 10', section: 'A', subject: 'Mathematics', periodsPerWeek: 6, room: 'Room 102' },
      { grade: 'Class 11', section: 'Sci', subject: 'Applied Mathematics', periodsPerWeek: 6, room: 'Room 204' },
      { grade: 'Class 12', section: 'Sci', subject: 'Higher Mathematics', periodsPerWeek: 6, room: 'Room 205' },
    ],
    classTeacherOf: {
      grade: 'Class 9',
      section: 'A',
      room: 'Room 101',
      studentCount: 40,
    },
    phone: '+91 98765 11223',
    email: 's.verma@vidyamaxx.edu.in',
    address: 'B-402, Green Valley Apartments, Sector 12, New Delhi',
    dob: '12 Aug 1984',
    bloodGroup: 'O+',
    qualification: 'M.Sc. Mathematics (Delhi University), B.Ed.',
    experience: '14 Years',
    salaryGrade: 'Grade PGT-8 (Senior Scale)',
    basicPay: '₹ 52,000',
    hra: '₹ 14,500',
    da: '₹ 9,900',
    specialAllowance: '₹ 6,000',
    grossPay: '₹ 82,400',
    pfDeduction: '₹ 6,240',
    taxDeduction: '₹ 3,560',
    netPay: '₹ 72,600',
    bankName: 'HDFC Bank (Connaught Place)',
    bankAccountNo: '50100482910482',
    bankIfsc: 'HDFC0000240',
    pfAccountNo: 'DL/CPM/1004829/001',
    aadhaarNo: '4829-1092-8841',
    tetCertification: 'CTET Paper II (94% Score)',
    emergencyContact: 'Mr. Rajesh Verma (Spouse) - +91 98765 43210',
    attendance: '98.5%',
    weeklyPeriods: 24,
    maxWeeklyPeriods: 28,
    studentSatisfaction: '96.8%',
    passPercentage: '99.2%',
    status: 'Active',
    joinDate: '15 Jul 2012',
    leaveBalance: { casual: 8, medical: 10, earned: 14 },
    schedule: [
      { day: 'Monday', period: 'Period 1 (08:00 AM)', classSection: 'Class 9-A', subject: 'Mathematics', room: 'Room 101' },
      { day: 'Monday', period: 'Period 3 (09:30 AM)', classSection: 'Class 10-A', subject: 'Mathematics', room: 'Room 102' },
      { day: 'Tuesday', period: 'Period 2 (08:45 AM)', classSection: 'Class 9-A', subject: 'Mathematics', room: 'Room 101' },
      { day: 'Wednesday', period: 'Period 3 (09:30 AM)', classSection: 'Class 9-A', subject: 'Mathematics', room: 'Room 101' },
      { day: 'Thursday', period: 'Period 1 (08:00 AM)', classSection: 'Class 9-A', subject: 'Mathematics', room: 'Room 101' },
      { day: 'Friday', period: 'Period 2 (08:45 AM)', classSection: 'Class 9-A', subject: 'Mathematics', room: 'Room 101' },
    ],
    payoutHistory: [
      { month: 'August 2026', gross: '₹ 82,400', deductions: '₹ 9,800', net: '₹ 72,600', status: 'Credited' },
      { month: 'July 2026', gross: '₹ 82,400', deductions: '₹ 9,800', net: '₹ 72,600', status: 'Credited' },
      { month: 'June 2026', gross: '₹ 82,400', deductions: '₹ 9,800', net: '₹ 72,600', status: 'Credited' },
      { month: 'May 2026', gross: '₹ 82,400', deductions: '₹ 9,800', net: '₹ 72,600', status: 'Credited' },
    ],
    attendanceLog: [
      { date: '31 Aug 2026', day: 'Monday', inTime: '07:48 AM', outTime: '03:15 PM', totalHours: '7h 27m', status: 'Present' },
      { date: '28 Aug 2026', day: 'Friday', inTime: '07:50 AM', outTime: '03:10 PM', totalHours: '7h 20m', status: 'Present' },
      { date: '27 Aug 2026', day: 'Thursday', inTime: '07:45 AM', outTime: '03:15 PM', totalHours: '7h 30m', status: 'Present' },
      { date: '26 Aug 2026', day: 'Wednesday', inTime: '07:55 AM', outTime: '03:20 PM', totalHours: '7h 25m', status: 'Present' },
      { date: '25 Aug 2026', day: 'Tuesday', inTime: '07:42 AM', outTime: '03:15 PM', totalHours: '7h 33m', status: 'Present' },
      { date: '24 Aug 2026', day: 'Monday', inTime: '08:05 AM', outTime: '03:15 PM', totalHours: '7h 10m', status: 'Late' },
    ],
  },
  {
    id: '2',
    code: 'EMP-T102',
    name: 'Dr. Rajesh Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
    designation: 'Head of Department (HOD)',
    department: 'Science & Math',
    subject: 'Physics',
    secondarySubject: 'Applied Electronics & Robotics',
    assignedClasses: [
      { grade: 'Class 10', section: 'A', subject: 'Physics', periodsPerWeek: 6, room: 'Lab 204' },
      { grade: 'Class 11', section: 'Sci', subject: 'Advanced Physics', periodsPerWeek: 8, room: 'Lab 204' },
      { grade: 'Class 12', section: 'Sci', subject: 'Theoretical Physics', periodsPerWeek: 8, room: 'Lab 204' },
    ],
    classTeacherOf: {
      grade: 'Class 11',
      section: 'Sci',
      room: 'Lab 204',
      studentCount: 38,
    },
    phone: '+91 98123 22334',
    email: 'r.sharma@vidyamaxx.edu.in',
    address: '14-A, Faculty Enclave, Vasant Kunj, New Delhi',
    dob: '28 Nov 1978',
    bloodGroup: 'B+',
    qualification: 'Ph.D. Physics (IIT Delhi), M.Sc., B.Ed.',
    experience: '18 Years',
    salaryGrade: 'Grade HOD-1 (Executive Scale)',
    basicPay: '₹ 62,000',
    hra: '₹ 17,200',
    da: '₹ 10,800',
    specialAllowance: '₹ 6,800',
    grossPay: '₹ 96,800',
    pfDeduction: '₹ 7,440',
    taxDeduction: '₹ 4,360',
    netPay: '₹ 85,000',
    bankName: 'State Bank of India (IIT Delhi)',
    bankAccountNo: '30492810948',
    bankIfsc: 'SBIN0001077',
    pfAccountNo: 'DL/CPM/1004829/002',
    aadhaarNo: '5820-3391-7742',
    tetCertification: 'CSIR-NET JRF Qualified',
    emergencyContact: 'Mrs. Neha Sharma (Spouse) - +91 98123 99887',
    attendance: '96.0%',
    weeklyPeriods: 22,
    maxWeeklyPeriods: 28,
    studentSatisfaction: '98.4%',
    passPercentage: '100%',
    status: 'Active',
    joinDate: '10 Jun 2008',
    leaveBalance: { casual: 6, medical: 8, earned: 18 },
    schedule: [
      { day: 'Monday', period: 'Period 2 (08:45 AM)', classSection: 'Class 9-A', subject: 'Physics Lab', room: 'Lab 204' },
      { day: 'Tuesday', period: 'Period 1 (08:00 AM)', classSection: 'Class 9-A', subject: 'Physics Lab', room: 'Lab 204' },
      { day: 'Wednesday', period: 'Period 4 (10:30 AM)', classSection: 'Class 9-A', subject: 'Physics Lab', room: 'Lab 204' },
      { day: 'Thursday', period: 'Period 3 (09:30 AM)', classSection: 'Class 9-A', subject: 'Physics Lab', room: 'Lab 204' },
      { day: 'Friday', period: 'Period 4 (10:30 AM)', classSection: 'Class 9-A', subject: 'Physics Lab', room: 'Lab 204' },
    ],
    payoutHistory: [
      { month: 'August 2026', gross: '₹ 96,800', deductions: '₹ 11,800', net: '₹ 85,000', status: 'Credited' },
      { month: 'July 2026', gross: '₹ 96,800', deductions: '₹ 11,800', net: '₹ 85,000', status: 'Credited' },
    ],
    attendanceLog: [
      { date: '31 Aug 2026', day: 'Monday', inTime: '07:40 AM', outTime: '03:30 PM', totalHours: '7h 50m', status: 'Present' },
      { date: '28 Aug 2026', day: 'Friday', inTime: '07:45 AM', outTime: '03:15 PM', totalHours: '7h 30m', status: 'Present' },
    ],
  },
  {
    id: '3',
    code: 'EMP-T103',
    name: 'Mr. Arvind Gupta',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    designation: 'TGT Educator',
    department: 'Humanities & Languages',
    subject: 'Social Science',
    secondarySubject: 'History, Civics & Geography',
    assignedClasses: [
      { grade: 'Class 8', section: 'A', subject: 'Social Studies', periodsPerWeek: 8, room: 'Room 106' },
      { grade: 'Class 9', section: 'A', subject: 'Social Science', periodsPerWeek: 9, room: 'Room 101' },
      { grade: 'Class 9', section: 'B', subject: 'Social Science', periodsPerWeek: 9, room: 'Room 103' },
    ],
    classTeacherOf: {
      grade: 'Class 10',
      section: 'A',
      room: 'Room 108',
      studentCount: 42,
    },
    phone: '+91 97654 33445',
    email: 'a.gupta@vidyamaxx.edu.in',
    address: '77, Anand Lok Colony, New Delhi',
    dob: '05 Jan 1988',
    bloodGroup: 'A+',
    qualification: 'M.A. History (JNU), B.Ed.',
    experience: '9 Years',
    salaryGrade: 'Grade TGT-5 (Standard Scale)',
    basicPay: '₹ 44,000',
    hra: '₹ 11,800',
    da: '₹ 7,700',
    specialAllowance: '₹ 5,000',
    grossPay: '₹ 68,500',
    pfDeduction: '₹ 5,280',
    taxDeduction: '₹ 2,220',
    netPay: '₹ 61,000',
    bankName: 'ICICI Bank (Green Park)',
    bankAccountNo: '002901584920',
    bankIfsc: 'ICIC0000029',
    pfAccountNo: 'DL/CPM/1004829/003',
    aadhaarNo: '9921-4820-1193',
    tetCertification: 'CTET Paper II (91% Score)',
    emergencyContact: 'Mrs. Deepa Gupta (Spouse) - +91 97654 11229',
    attendance: '94.2%',
    weeklyPeriods: 26,
    maxWeeklyPeriods: 28,
    studentSatisfaction: '94.0%',
    passPercentage: '97.5%',
    status: 'Active',
    joinDate: '01 Aug 2017',
    leaveBalance: { casual: 9, medical: 12, earned: 10 },
    schedule: [
      { day: 'Tuesday', period: 'Period 3 (09:30 AM)', classSection: 'Class 9-A', subject: 'Social Science', room: 'Room 101' },
      { day: 'Thursday', period: 'Period 5 (11:15 AM)', classSection: 'Class 9-A', subject: 'Social Science', room: 'Room 101' },
      { day: 'Friday', period: 'Period 3 (09:30 AM)', classSection: 'Class 9-A', subject: 'Social Science', room: 'Room 101' },
    ],
    payoutHistory: [
      { month: 'August 2026', gross: '₹ 68,500', deductions: '₹ 7,500', net: '₹ 61,000', status: 'Credited' },
    ],
    attendanceLog: [
      { date: '31 Aug 2026', day: 'Monday', inTime: '07:45 AM', outTime: '03:15 PM', totalHours: '7h 30m', status: 'Present' },
    ],
  },
  {
    id: '4',
    code: 'EMP-T104',
    name: 'Ms. Pooja Rao',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    designation: 'PGT Educator',
    department: 'Humanities & Languages',
    subject: 'English Literature',
    secondarySubject: 'Creative Writing & Rhetoric',
    assignedClasses: [
      { grade: 'Class 9', section: 'A', subject: 'English Literature', periodsPerWeek: 8, room: 'Room 101' },
      { grade: 'Class 10', section: 'B', subject: 'English Language', periodsPerWeek: 8, room: 'Room 104' },
      { grade: 'Class 11', section: 'Com', subject: 'Core English', periodsPerWeek: 9, room: 'Room 202' },
    ],
    classTeacherOf: {
      grade: 'Class 9',
      section: 'B',
      room: 'Room 103',
      studentCount: 39,
    },
    phone: '+91 99887 44556',
    email: 'p.rao@vidyamaxx.edu.in',
    address: 'C-12, Defence Colony, New Delhi',
    dob: '19 Oct 1990',
    bloodGroup: 'B-',
    qualification: 'M.A. English (St. Stephen\'s College), B.Ed.',
    experience: '7 Years',
    salaryGrade: 'Grade PGT-4',
    basicPay: '₹ 46,000',
    hra: '₹ 12,600',
    da: '₹ 8,100',
    specialAllowance: '₹ 5,300',
    grossPay: '₹ 72,000',
    pfDeduction: '₹ 5,520',
    taxDeduction: '₹ 2,480',
    netPay: '₹ 64,000',
    bankName: 'Axis Bank (South Ex)',
    bankAccountNo: '918020048291048',
    bankIfsc: 'UTIB0000148',
    pfAccountNo: 'DL/CPM/1004829/004',
    aadhaarNo: '3391-4482-9910',
    tetCertification: 'UGC-NET Qualified (English)',
    emergencyContact: 'Mr. Vivek Rao (Brother) - +91 99887 11990',
    attendance: '92.0%',
    weeklyPeriods: 25,
    maxWeeklyPeriods: 28,
    studentSatisfaction: '95.5%',
    passPercentage: '98.8%',
    status: 'On Leave',
    joinDate: '15 Jul 2019',
    leaveBalance: { casual: 3, medical: 5, earned: 8 },
    schedule: [
      { day: 'Monday', period: 'Period 3 (09:30 AM)', classSection: 'Class 9-A', subject: 'English Literature', room: 'Room 101' },
      { day: 'Tuesday', period: 'Period 4 (10:30 AM)', classSection: 'Class 9-A', subject: 'English Literature', room: 'Room 101' },
      { day: 'Wednesday', period: 'Period 2 (08:45 AM)', classSection: 'Class 9-A', subject: 'English Literature', room: 'Room 101' },
      { day: 'Thursday', period: 'Period 6 (12:45 PM)', classSection: 'Class 9-A', subject: 'English Literature', room: 'Room 101' },
      { day: 'Friday', period: 'Period 1 (08:00 AM)', classSection: 'Class 9-A', subject: 'English Literature', room: 'Room 101' },
    ],
    payoutHistory: [
      { month: 'August 2026', gross: '₹ 72,000', deductions: '₹ 8,000', net: '₹ 64,000', status: 'Credited' },
    ],
    attendanceLog: [
      { date: '31 Aug 2026', day: 'Monday', inTime: '-', outTime: '-', totalHours: '0h 00m', status: 'Leave' },
    ],
  },
  {
    id: '5',
    code: 'EMP-T105',
    name: 'Dr. Ramesh Nair',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    designation: 'Senior Faculty',
    department: 'Science & Math',
    subject: 'Chemistry',
    secondarySubject: 'Organic Chemistry & Bio-Informatics',
    assignedClasses: [
      { grade: 'Class 9', section: 'A', subject: 'Chemistry Lab', periodsPerWeek: 5, room: 'Lab 102' },
      { grade: 'Class 11', section: 'Sci', subject: 'Physical Chemistry', periodsPerWeek: 7, room: 'Lab 102' },
      { grade: 'Class 12', section: 'Sci', subject: 'Organic Chemistry', periodsPerWeek: 8, room: 'Lab 102' },
    ],
    classTeacherOf: {
      grade: 'Class 12',
      section: 'Sci',
      room: 'Lab 102',
      studentCount: 36,
    },
    phone: '+91 98234 55667',
    email: 'r.nair@vidyamaxx.edu.in',
    address: '502, Palm Heights, Gurgaon',
    dob: '03 Mar 1976',
    bloodGroup: 'AB+',
    qualification: 'Ph.D. Organic Chemistry (IISc Bangalore), B.Ed.',
    experience: '20 Years',
    salaryGrade: 'Grade PGT-9 (Senior Scale)',
    basicPay: '₹ 60,000',
    hra: '₹ 16,800',
    da: '₹ 10,600',
    specialAllowance: '₹ 6,800',
    grossPay: '₹ 94,200',
    pfDeduction: '₹ 7,200',
    taxDeduction: '₹ 4,100',
    netPay: '₹ 82,900',
    bankName: 'Kotak Mahindra Bank',
    bankAccountNo: '482910482019',
    bankIfsc: 'KKBK0000184',
    pfAccountNo: 'DL/CPM/1004829/005',
    aadhaarNo: '7729-1002-3344',
    tetCertification: 'CSIR-NET JRF Qualified',
    emergencyContact: 'Mrs. Latha Nair (Spouse) - +91 98234 11445',
    attendance: '99.0%',
    weeklyPeriods: 20,
    maxWeeklyPeriods: 28,
    studentSatisfaction: '97.2%',
    passPercentage: '100%',
    status: 'Active',
    joinDate: '10 Jan 2006',
    leaveBalance: { casual: 10, medical: 14, earned: 22 },
    schedule: [
      { day: 'Monday', period: 'Period 4 (10:30 AM)', classSection: 'Class 9-A', subject: 'Chemistry Lab', room: 'Lab 102' },
      { day: 'Tuesday', period: 'Period 5 (11:15 AM)', classSection: 'Class 9-A', subject: 'Chemistry Lab', room: 'Lab 102' },
      { day: 'Wednesday', period: 'Period 1 (08:00 AM)', classSection: 'Class 9-A', subject: 'Chemistry Lab', room: 'Lab 102' },
      { day: 'Thursday', period: 'Period 7 (01:30 PM)', classSection: 'Class 9-A', subject: 'Chemistry Lab', room: 'Lab 102' },
      { day: 'Friday', period: 'Period 6 (12:45 PM)', classSection: 'Class 9-A', subject: 'Chemistry Lab', room: 'Lab 102' },
    ],
    payoutHistory: [
      { month: 'August 2026', gross: '₹ 94,200', deductions: '₹ 11,300', net: '₹ 82,900', status: 'Credited' },
    ],
    attendanceLog: [
      { date: '31 Aug 2026', day: 'Monday', inTime: '07:40 AM', outTime: '03:20 PM', totalHours: '7h 40m', status: 'Present' },
    ],
  },
  {
    id: '6',
    code: 'EMP-T106',
    name: 'Mr. Subhash Das',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    designation: 'PGT Computer Science',
    department: 'Computer & AI Labs',
    subject: 'Computer Science',
    secondarySubject: 'Python, AI & Data Analytics',
    assignedClasses: [
      { grade: 'Class 9', section: 'A', subject: 'CS & AI Basics', periodsPerWeek: 4, room: 'Lab 3' },
      { grade: 'Class 10', section: 'A', subject: 'Computer Applications', periodsPerWeek: 6, room: 'Lab 3' },
      { grade: 'Class 11', section: 'Sci', subject: 'Python Programming', periodsPerWeek: 5, room: 'Lab 3' },
      { grade: 'Class 12', section: 'Sci', subject: 'Data Science & SQL', periodsPerWeek: 5, room: 'Lab 3' },
    ],
    classTeacherOf: {
      grade: 'Class 11',
      section: 'Com',
      room: 'Turing Lab 3',
      studentCount: 35,
    },
    phone: '+91 97722 33445',
    email: 's.das@vidyamaxx.edu.in',
    address: '22, IT Enclave, Noida Sector 62',
    dob: '14 Feb 1989',
    bloodGroup: 'B+',
    qualification: 'M.Tech Computer Science (DTU), B.Ed.',
    experience: '8 Years',
    salaryGrade: 'Grade PGT-5',
    basicPay: '₹ 48,000',
    hra: '₹ 13,200',
    da: '₹ 8,800',
    specialAllowance: '₹ 6,000',
    grossPay: '₹ 76,000',
    pfDeduction: '₹ 5,760',
    taxDeduction: '₹ 2,740',
    netPay: '₹ 67,500',
    bankName: 'Punjab National Bank',
    bankAccountNo: '0482001500482910',
    bankIfsc: 'PUNB0048200',
    pfAccountNo: 'DL/CPM/1004829/006',
    aadhaarNo: '1129-3384-9902',
    tetCertification: 'UGC-NET Qualified (CS)',
    emergencyContact: 'Mrs. Rina Das (Spouse) - +91 97722 11002',
    attendance: '97.0%',
    weeklyPeriods: 20,
    maxWeeklyPeriods: 28,
    studentSatisfaction: '98.9%',
    passPercentage: '100%',
    status: 'Active',
    joinDate: '12 Jul 2018',
    leaveBalance: { casual: 7, medical: 9, earned: 12 },
    schedule: [
      { day: 'Monday', period: 'Period 7 (01:30 PM)', classSection: 'Class 9-A', subject: 'Computer Science Lab', room: 'Lab 3' },
      { day: 'Thursday', period: 'Period 4 (10:30 AM)', classSection: 'Class 9-A', subject: 'Computer Science Lab', room: 'Lab 3' },
    ],
    payoutHistory: [
      { month: 'August 2026', gross: '₹ 76,000', deductions: '₹ 8,500', net: '₹ 67,500', status: 'Credited' },
    ],
    attendanceLog: [
      { date: '31 Aug 2026', day: 'Monday', inTime: '07:50 AM', outTime: '03:15 PM', totalHours: '7h 25m', status: 'Present' },
    ],
  },
];

function StaffPage() {
  const { activeSession, addNotification } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  React.useEffect(() => { document.title = t('page.teachers') + ' \u2013 VidyaMaxx'; }, [t]);
  const [staffList, setStaffList] = React.useState<StaffRecord[]>(INITIAL_STAFF);
  const [selectedStaffIndex, setSelectedStaffIndex] = React.useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
  const [drawerTab, setDrawerTab] = React.useState<'overview' | 'academics' | 'attendance' | 'credentials' | 'payroll'>('overview');
  const [isEditingStaff, setIsEditingStaff] = React.useState<boolean>(false);
  const [staffFormData, setStaffFormData] = React.useState<StaffRecord | null>(null);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const avatarFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Dynamic Dossier Fields Configuration State
  const [dossierFields] = React.useState<StaffDossierFieldConfig[]>(defaultStaffDossierFields);

  // Photo Fullscreen / Center Preview Modal State
  const [isPhotoModalOpen, setIsPhotoModalOpen] = React.useState<boolean>(false);
  const [previewPhotoData, setPreviewPhotoData] = React.useState<{ name: string; avatarUrl: string; designation: string; code: string } | null>(null);

  // Add Staff Member Side Drawer State
  const [isAddStaffDrawerOpen, setIsAddStaffDrawerOpen] = React.useState<boolean>(false);
  const [addStaffStep, setAddStaffStep] = React.useState<'personal' | 'academic' | 'payroll'>('personal');
  const [newStaffForm, setNewStaffForm] = React.useState({
    name: '',
    code: `EMP-T${100 + INITIAL_STAFF.length + 1}`,
    designation: 'PGT Educator',
    department: 'Science & Math',
    subject: 'Mathematics',
    secondarySubject: 'General Studies',
    assignedClassGrades: 'Class 9-A, Class 10-A',
    classTeacherOfGrade: 'Class 9',
    classTeacherOfSection: 'A',
    classTeacherRoom: 'Room 101',
    phone: '+91 ',
    email: '',
    address: '',
    dob: '1990-01-01',
    bloodGroup: 'B+',
    qualification: 'M.Sc., B.Ed.',
    experience: '5 Years',
    salaryGrade: 'Grade PGT-4',
    basicPay: '₹ 46,000',
    grossPay: '₹ 72,000',
    weeklyPeriods: 22,
    bankName: 'HDFC Bank',
    bankAccountNo: '50100482910482',
    bankIfsc: 'HDFC0000240',
    pfAccountNo: `DL/CPM/1004829/${100 + INITIAL_STAFF.length + 1}`,
    aadhaarNo: '4820-9910-3341',
    tetCertification: 'CTET Paper II Certified',
    status: 'Active' as const,
  });

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = React.useState<boolean>(false);
  const [exportFormat, setExportFormat] = React.useState<'csv' | 'pdf' | 'bundle'>('bundle');
  const [isExporting, setIsExporting] = React.useState<boolean>(false);
  const [exportProgressText, setExportProgressText] = React.useState<string>('');

  const activeStaff =
    selectedStaffIndex !== null && selectedStaffIndex >= 0 && selectedStaffIndex < staffList.length
      ? staffList[selectedStaffIndex]
      : null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const openStaffDrawer = (staff: StaffRecord) => {
    const idx = staffList.findIndex((s) => s.id === staff.id);
    setSelectedStaffIndex(idx >= 0 ? idx : 0);
    setIsEditingStaff(false);
    setStaffFormData(null);
    setDrawerTab('overview');
    setIsDrawerOpen(true);
  };

  const openPhotoPreview = (staff: StaffRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPreviewPhotoData({
      name: staff.name,
      avatarUrl: staff.avatarUrl,
      designation: staff.designation,
      code: staff.code,
    });
    setIsPhotoModalOpen(true);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setStaffFormData((prev) => ({
            ...(prev || activeStaff || ({} as StaffRecord)),
            avatarUrl: resultStr,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEdit = () => {
    if (activeStaff) {
      setStaffFormData({ ...activeStaff });
      setIsEditingStaff(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingStaff(false);
    setStaffFormData(null);
  };

  const handleSaveStaff = () => {
    if (!staffFormData || selectedStaffIndex === null) return;
    const updated = [...staffList];
    updated[selectedStaffIndex] = { ...staffFormData };
    setStaffList(updated);
    setIsEditingStaff(false);
    setStaffFormData(null);
    addNotification({
      title: 'Faculty Record Updated',
      description: `Changes to ${staffFormData.name}'s profile saved successfully.`,
      type: 'success',
    });
  };

  const handleCreateStaff = () => {
    if (!newStaffForm.name.trim()) {
      alert('Please provide a full legal name for the faculty member.');
      return;
    }

    const createdStaff: StaffRecord = {
      id: String(Date.now()),
      code: newStaffForm.code,
      name: newStaffForm.name,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      designation: newStaffForm.designation,
      department: newStaffForm.department,
      subject: newStaffForm.subject,
      secondarySubject: newStaffForm.secondarySubject,
      assignedClasses: [
        { grade: 'Class 9', section: 'A', subject: newStaffForm.subject, periodsPerWeek: 6, room: 'Room 101' },
        { grade: 'Class 10', section: 'A', subject: newStaffForm.subject, periodsPerWeek: 6, room: 'Room 102' },
      ],
      classTeacherOf: newStaffForm.classTeacherOfGrade
        ? {
            grade: newStaffForm.classTeacherOfGrade,
            section: newStaffForm.classTeacherOfSection || 'A',
            room: newStaffForm.classTeacherRoom || 'Room 101',
            studentCount: 40,
          }
        : undefined,
      phone: newStaffForm.phone,
      email: newStaffForm.email || `${newStaffForm.name.toLowerCase().replace(/\s+/g, '.')}@vidyamaxx.edu.in`,
      address: newStaffForm.address || 'Institutional Staff Quarters, New Delhi',
      dob: newStaffForm.dob,
      bloodGroup: newStaffForm.bloodGroup,
      qualification: newStaffForm.qualification,
      experience: newStaffForm.experience,
      salaryGrade: newStaffForm.salaryGrade,
      basicPay: newStaffForm.basicPay,
      hra: '₹ 12,000',
      da: '₹ 8,000',
      specialAllowance: '₹ 6,000',
      grossPay: newStaffForm.grossPay,
      pfDeduction: '₹ 5,500',
      taxDeduction: '₹ 2,500',
      netPay: '₹ 64,000',
      bankName: newStaffForm.bankName,
      bankAccountNo: newStaffForm.bankAccountNo,
      bankIfsc: newStaffForm.bankIfsc,
      pfAccountNo: newStaffForm.pfAccountNo,
      aadhaarNo: newStaffForm.aadhaarNo,
      tetCertification: newStaffForm.tetCertification,
      emergencyContact: 'Family Emergency Contact On Record',
      attendance: '100%',
      weeklyPeriods: Number(newStaffForm.weeklyPeriods) || 22,
      maxWeeklyPeriods: 28,
      studentSatisfaction: '100%',
      passPercentage: '100%',
      status: newStaffForm.status,
      joinDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      leaveBalance: { casual: 10, medical: 10, earned: 15 },
      schedule: [
        { day: 'Monday', period: 'Period 1 (08:00 AM)', classSection: 'Class 9-A', subject: newStaffForm.subject, room: 'Room 101' },
      ],
      payoutHistory: [
        { month: 'August 2026', gross: newStaffForm.grossPay, deductions: '₹ 8,000', net: '₹ 64,000', status: 'Credited' },
      ],
      attendanceLog: [
        { date: '31 Aug 2026', day: 'Monday', inTime: '07:45 AM', outTime: '03:15 PM', totalHours: '7h 30m', status: 'Present' },
      ],
    };

    setStaffList([createdStaff, ...staffList]);
    setIsAddStaffDrawerOpen(false);
    addNotification({
      title: 'Faculty Member Onboarded',
      description: `${createdStaff.name} registered under ID ${createdStaff.code}.`,
      type: 'success',
    });
  };

  const handlePrevStaff = () => {
    if (selectedStaffIndex !== null && selectedStaffIndex > 0) {
      setIsEditingStaff(false);
      setStaffFormData(null);
      setSelectedStaffIndex(selectedStaffIndex - 1);
    }
  };

  const handleNextStaff = () => {
    if (selectedStaffIndex !== null && selectedStaffIndex < staffList.length - 1) {
      setIsEditingStaff(false);
      setStaffFormData(null);
      setSelectedStaffIndex(selectedStaffIndex + 1);
    }
  };

  const getStaffFieldValue = (staff: StaffRecord | null, fieldKey: string) => {
    if (!staff) return '';
    if ((staff as any)[fieldKey] !== undefined && (staff as any)[fieldKey] !== '') {
      return (staff as any)[fieldKey];
    }
    return '-';
  };

  // Perform Multi-Format Export Action
  const handleExecuteExport = async () => {
    setIsExporting(true);
    setExportProgressText('Preparing faculty data...');

    try {
      if (exportFormat === 'csv' || exportFormat === 'bundle') {
        setExportProgressText('Generating CSV Spreadsheet...');
        const headers = ['Staff ID', 'Name', 'Designation', 'Department', 'Primary Subject', 'Weekly Load', 'Attendance', 'Status', 'Phone', 'Email', 'Joining Date', 'Salary Grade', 'Monthly Gross'];
        const csvRows = [
          headers.join(','),
          ...staffList.map((s) =>
            [
              `"${s.code}"`,
              `"${s.name}"`,
              `"${s.designation}"`,
              `"${s.department}"`,
              `"${s.subject}"`,
              `"${s.weeklyPeriods} Periods/Wk"`,
              `"${s.attendance}"`,
              `"${s.status}"`,
              `"${s.phone}"`,
              `"${s.email}"`,
              `"${s.joinDate}"`,
              `"${s.salaryGrade}"`,
              `"${s.grossPay}"`,
            ].join(',')
          ),
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VidyaMaxx_Faculty_Roster_${activeSession.replace(/\s+/g, '_')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      if (exportFormat === 'bundle') {
        setExportProgressText('Building Faculty ZIP Archive Package...');
        const zip = new JSZip();
        const info = `VidyaMaxx Institutional Management System\nFaculty & Staff Master Roster - Session ${activeSession}\nTotal Faculty Count: ${staffList.length}\nGenerated: ${new Date().toLocaleString()}\n`;
        zip.file('README_FACULTY_ROSTER.txt', info);
        zip.file('faculty_roster_data.json', JSON.stringify(staffList, null, 2));

        const content = await zip.generateAsync({ type: 'blob' });
        const zipUrl = URL.createObjectURL(content);
        const zipLink = document.createElement('a');
        zipLink.href = zipUrl;
        zipLink.download = `VidyaMaxx_Faculty_Archive_${activeSession.replace(/\s+/g, '_')}.zip`;
        document.body.appendChild(zipLink);
        zipLink.click();
        document.body.removeChild(zipLink);
      }

      if (exportFormat === 'pdf') {
        window.print();
      }

      addNotification({
        title: 'Faculty Roster Exported',
        description: `Successfully exported ${staffList.length} staff records for ${activeSession}.`,
        type: 'success',
      });
      setIsExportModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('An error occurred while compiling the faculty export bundle.');
    } finally {
      setIsExporting(false);
      setExportProgressText('');
    }
  };

  const staffColumns = [
    {
      header: isHindi ? 'स्टाफ आईडी' : 'Staff ID',
      accessorKey: 'code',
      cell: (r: StaffRecord) => (
        <span
          onClick={() => handleCopy(r.code, `table-${r.code}`)}
          className="font-mono text-xs font-bold text-zinc-300 bg-[#161619] px-2.5 py-1 rounded-md border border-[#27272e] hover:border-zinc-500 cursor-pointer transition-colors inline-flex items-center gap-1"
          title="Click to copy Staff ID"
        >
          {r.code}
          {copiedKey === `table-${r.code}` ? (
            <Check className="h-3 w-3 text-emerald-400" />
          ) : (
            <Copy className="h-3 w-3 text-zinc-500 opacity-50" />
          )}
        </span>
      ),
    },
    {
      header: isHindi ? 'टीचर / फैकल्टी' : 'Faculty Member',
      accessorKey: 'name',
      cell: (r: StaffRecord) => (
        <div className="flex items-center gap-2.5">
          <div
            onClick={(e) => openPhotoPreview(r, e)}
            className="overflow-hidden rounded-[3px] border border-border/80 shadow-xs w-8 h-[40px] bg-[#161616] shrink-0 cursor-pointer group relative hover:border-foreground/40 transition-colors"
            title="Click to view full photo"
          >
            <img src={r.avatarUrl} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Eye className="h-3 w-3 text-white" />
            </div>
          </div>
          <div className="min-w-0 max-w-[160px] sm:max-w-[200px]">
            <p className="font-bold text-white text-xs sm:text-sm leading-tight hover:text-zinc-200 cursor-pointer truncate" onClick={() => openStaffDrawer(r)} title={r.name}>
              {r.name}
            </p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5 truncate" title={r.designation}>{r.designation}</p>
          </div>
        </div>
      ),
    },
    {
      header: t('col.department'),
      accessorKey: 'department',
      cell: (r: StaffRecord) => <span className="text-zinc-300 font-bold text-xs">{r.department}</span>,
    },
    {
      header: isHindi ? 'प्राइमरी सब्जेक्ट' : 'Primary Subject',
      accessorKey: 'subject',
      cell: (r: StaffRecord) => (
        <div>
          <span className="font-bold text-white text-xs block">{r.subject}</span>
          {r.secondarySubject && (
            <span className="text-[11px] text-zinc-500 font-medium block truncate max-w-[150px]">
              {r.secondarySubject}
            </span>
          )}
        </div>
      ),
    },
    {
      header: isHindi ? 'क्लास मेंटर / रूम' : 'Class Mentor / Room',
      accessorKey: 'classTeacherOf',
      align: 'center',
      cell: (r: StaffRecord) => (
        r.classTeacherOf ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-semibold bg-[#161619] text-zinc-200 border border-[#27272e]">
            {r.classTeacherOf.grade}–{r.classTeacherOf.section} ({r.classTeacherOf.room})
          </span>
        ) : (
          <span className="text-zinc-500 text-xs font-mono">{isHindi ? 'अनअसाइंड' : 'Unassigned'}</span>
        )
      ),
    },
    {
      header: isHindi ? 'वीकली वर्कलोड' : 'Weekly Load',
      accessorKey: 'weeklyPeriods',
      align: 'center',
      className: 'w-32 text-center',
      cell: (r: StaffRecord) => (
        <span className="font-mono font-bold text-foreground text-xs">
          {r.weeklyPeriods} / {r.maxWeeklyPeriods} P/Wk
        </span>
      ),
    },
    {
      header: t('col.attendance'),
      accessorKey: 'attendance',
      align: 'center',
      cell: (r: StaffRecord) => (
        <span className="font-mono font-bold text-emerald-400 text-xs bg-emerald-950/30 border border-emerald-800/40 px-2 py-0.5 rounded">
          {r.attendance}
        </span>
      ),
    },
    {
      header: t('col.status'),
      accessorKey: 'status',
      align: 'center',
      cell: (r: StaffRecord) => (
        <VFBadge variant={r.status === 'Active' ? 'success' : r.status === 'On Leave' ? 'warning' : 'default'}>
          {r.status === 'Active' ? (isHindi ? 'एक्टिव' : r.status) : r.status === 'On Leave' ? (isHindi ? 'लीव पर' : r.status) : r.status}
        </VFBadge>
      ),
    },
    {
      header: t('col.action'),
      accessorKey: 'action',
      align: 'center',
      cell: (r: StaffRecord) => (
        <VFButton
          size="icon"
          variant="outline"
          className="h-7 w-7 border-border hover:border-zinc-500 rounded-[4px]"
          title={isHindi ? 'प्रोफाइल देखें' : 'View Profile'}
          aria-label={isHindi ? 'प्रोफाइल देखें' : 'View Profile'}
          onClick={() => openStaffDrawer(r)}
        >
          <Eye className="h-3.5 w-3.5 text-zinc-400" />
        </VFButton>
      ),
    },
  ];

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* 1. TOP METRIC KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 lg:gap-4 shrink-0">
        <VFStatCard
          title={isHindi ? 'टोटल फैकल्टी' : 'Faculty Strength'}
          value={`${staffList.length} Teachers`}
          icon={<Users className="h-5 w-5" />}
          trend="up"
          trendLabel="94 Teaching · 30 Ops"
          accentColor="blue"
        />
        <VFStatCard
          title={isHindi ? 'आज प्रेजेंट' : "Today's Present"}
          value={`${staffList.filter((s) => s.status === 'Active').length} Present`}
          icon={<UserCheck className="h-5 w-5" />}
          trend="up"
          trendLabel="96.8% Attendance"
          accentColor="emerald"
        />
        <VFStatCard
          title={isHindi ? 'एवरेज वर्कलोड' : 'Average Load'}
          value="22.8 / Wk"
          icon={<Clock className="h-5 w-5" />}
          trend="neutral"
          trendLabel="Optimal Load"
          accentColor="cyan"
        />
        <VFStatCard
          title={isHindi ? 'फैकल्टी रिटेंशन' : 'Faculty Retention'}
          value="98.2%"
          icon={<Sparkles className="h-5 w-5" />}
          trend="up"
          trendLabel="+2.4% vs last term"
          accentColor="purple"
        />
      </div>

      {/* 2. MAIN STAFF DATA TABLE */}
      <VFDataTable
        columns={staffColumns}
        data={staffList}
        filterPlaceholder={t('form.searchTeachers')}
        rightActions={
          <>
            <VFButton
              variant="outline"
              size="sm"
              leftIcon={<Download className="h-3.5 w-3.5 text-zinc-400" />}
              onClick={() => setIsExportModalOpen(true)}
            >
              {t('action.export')}
            </VFButton>
            <VFButton
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => setIsAddStaffDrawerOpen(true)}
            >
              {t('action.add') + ' ' + t('nav.teachers')}
            </VFButton>
          </>
        }
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          3. 360° FACULTY PROFILE & DOSSIER SIDE DRAWER (5 COMPREHENSIVE TABS)
          ═══════════════════════════════════════════════════════════════════════ */}
      <VFDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsEditingStaff(false);
          setStaffFormData(null);
          setIsDrawerOpen(false);
        }}
        hideHeader={true}
        title={activeStaff ? activeStaff.name : 'Staff Profile'}
        className="w-[850px] min-w-[320px] sm:min-w-[850px] max-w-[95vw]"
        bodyClassName="p-0 flex flex-col overflow-hidden"
        footerActions={
          <div className="flex items-center justify-between w-full gap-3 flex-wrap">
            {isEditingStaff ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white bg-[#161619] px-2.5 h-8 flex items-center rounded-md border border-[#27272e]">
                    {staffFormData?.code || activeStaff?.code}
                  </span>
                  <span className="text-xs font-medium text-zinc-400">
                    Editing Faculty Profile
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
                    onClick={handleSaveStaff}
                  >
                    Save Changes
                  </VFButton>
                </div>
              </>
            ) : (
              <>
                {/* Stepper Navigation */}
                <div className="flex items-center gap-1 bg-[#141417] h-8 px-1.5 rounded-md border border-[#27272e]">
                  <button
                    onClick={handlePrevStaff}
                    disabled={selectedStaffIndex === 0}
                    className="h-6 w-6 flex items-center justify-center rounded text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 cursor-pointer transition-colors"
                    title="Previous Faculty (Keyboard: ←)"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold px-2 text-zinc-300 select-none leading-none">
                    {selectedStaffIndex !== null ? selectedStaffIndex + 1 : 1} of {staffList.length}
                  </span>
                  <button
                    onClick={handleNextStaff}
                    disabled={selectedStaffIndex === staffList.length - 1}
                    className="h-6 w-6 flex items-center justify-center rounded text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 cursor-pointer transition-colors"
                    title="Next Faculty (Keyboard: →)"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <VFButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingStaff(false);
                      setStaffFormData(null);
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
        {activeStaff && (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden animate-fade-in">
            {/* Top 5 Full-Width Tabs */}
            <div className="w-full bg-[#111113] border-b border-[#242428] shrink-0">
              <div className="grid grid-cols-5 w-full">
                {[
                  { id: 'overview', label: 'Profile', icon: <UserCheck className="h-4 w-4" /> },
                  { id: 'academics', label: 'Academics & Workload', icon: <Calendar className="h-4 w-4" /> },
                  { id: 'attendance', label: 'Attendance & Leaves', icon: <CalendarCheck2 className="h-4 w-4" /> },
                  { id: 'credentials', label: 'Certificates & ID Card', icon: <CreditCard className="h-4 w-4" /> },
                  { id: 'payroll', label: 'Salary & Payroll', icon: <Receipt className="h-4 w-4" /> },
                ].map((tab) => {
                  const isActive = drawerTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setDrawerTab(tab.id as any)}
                      className={cn(
                        'flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-all cursor-pointer outline-none select-none border-b-2',
                        isActive
                          ? 'bg-[#18181c] text-white border-zinc-300'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5 border-transparent'
                      )}
                    >
                      {tab.icon}
                      <span className="hidden md:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Drawer Scroll Area */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {/* TAB 1: PROFILE & BIO */}
              {drawerTab === 'overview' && (
                <div className="animate-fade-in divide-y divide-[#1e1e24]">
                  {/* Photo + Personal Fields Strip */}
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
                            if (isEditingStaff && avatarFileInputRef.current) {
                              avatarFileInputRef.current.click();
                            } else {
                              openPhotoPreview(activeStaff);
                            }
                          }}
                          className={cn(
                            'relative overflow-hidden rounded-md border border-[#27272e] shadow-sm w-24 sm:w-28 bg-[#161619] flex items-center justify-center transition-all group cursor-pointer',
                            isEditingStaff ? 'hover:ring-2 hover:ring-zinc-400' : ''
                          )}
                          style={{ aspectRatio: '19.5 / 25' }}
                        >
                          <img
                            src={isEditingStaff && staffFormData?.avatarUrl ? staffFormData.avatarUrl : activeStaff.avatarUrl}
                            alt={isEditingStaff && staffFormData?.name ? staffFormData.name : activeStaff.name}
                            style={{ aspectRatio: '19.5 / 25' }}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-white">
                            {isEditingStaff ? (
                              <>
                                <Camera className="h-5 w-5 text-white" />
                                <span className="text-[10px] font-bold tracking-tight">Upload</span>
                              </>
                            ) : (
                              <>
                                <Eye className="h-5 w-5 text-white" />
                                <span className="text-[10px] font-bold tracking-tight">View</span>
                              </>
                            )}
                          </div>
                        </div>
                        {isEditingStaff ? (
                          <button
                            type="button"
                            onClick={() => avatarFileInputRef.current?.click()}
                            className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-zinc-200 text-black flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer border-2 border-[#111113]"
                            title="Change Faculty Photo"
                          >
                            <Camera className="h-3 w-3" />
                          </button>
                        ) : (
                          <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#111113] ring-2 ring-emerald-500/20" title="Active Faculty" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
                        {dossierFields
                          .filter((f) => f.category === 'personal' && f.isVisible)
                          .map((f) => {
                            const val = isEditingStaff && staffFormData
                              ? (staffFormData as any)[f.key] ?? ''
                              : getStaffFieldValue(activeStaff, f.key);
                            return (
                              <div key={f.key} className={f.key === 'name' ? 'col-span-2 sm:col-span-2' : ''}>
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block mb-1">
                                  {f.label}
                                </label>
                                <input
                                  type="text"
                                  readOnly={!isEditingStaff}
                                  value={val}
                                  onChange={(e) => {
                                    if (isEditingStaff && staffFormData) {
                                      setStaffFormData({ ...staffFormData, [f.key]: e.target.value });
                                    }
                                  }}
                                  className={cn(
                                    'w-full h-9 px-3 text-xs rounded-md outline-none transition-all',
                                    isEditingStaff
                                      ? 'bg-[#141417] border border-zinc-500 text-white font-semibold shadow-xs'
                                      : 'bg-[#141417] border border-[#24242a] text-zinc-300 font-semibold',
                                    f.key === 'name' ? 'font-bold text-white' : '',
                                    f.key === 'code' || f.key === 'dob' || f.key === 'bloodGroup' || f.key === 'aadhaarNo' ? 'font-mono' : ''
                                  )}
                                />
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  {/* Contact & Residential Strip */}
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-4 py-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block mb-1">Official Contact Phone Number</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly={!isEditingStaff}
                            value={isEditingStaff && staffFormData ? staffFormData.phone : activeStaff.phone}
                            onChange={(e) => isEditingStaff && staffFormData && setStaffFormData({ ...staffFormData, phone: e.target.value })}
                            className={cn(
                              'flex-1 h-9 px-3 text-xs font-mono font-bold rounded-md outline-none transition-all',
                              isEditingStaff
                                ? 'bg-[#141417] border border-zinc-500 text-white shadow-xs'
                                : 'bg-[#141417] border border-[#24242a] text-zinc-300'
                            )}
                          />
                          {!isEditingStaff && (
                            <>
                              <button
                                onClick={() => window.open(`https://wa.me/${activeStaff.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                                className="h-9 px-3 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span>WhatsApp</span>
                              </button>
                              <button
                                onClick={() => handleCopy(activeStaff.phone, 'phone')}
                                className="h-9 px-2.5 rounded-md bg-[#161619] hover:bg-[#1a1a1f] border border-[#27272e] text-zinc-300 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                              >
                                {copiedKey === 'phone' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
                                <span>{copiedKey === 'phone' ? 'Copied' : 'Copy'}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block mb-1">Institutional Email Address</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly={!isEditingStaff}
                            value={isEditingStaff && staffFormData ? staffFormData.email : activeStaff.email}
                            onChange={(e) => isEditingStaff && staffFormData && setStaffFormData({ ...staffFormData, email: e.target.value })}
                            className={cn(
                              'flex-1 h-9 px-3 text-xs font-mono font-semibold rounded-md outline-none truncate transition-all',
                              isEditingStaff
                                ? 'bg-[#141417] border border-zinc-500 text-white shadow-xs'
                                : 'bg-[#141417] border border-[#24242a] text-zinc-300'
                            )}
                          />
                          {!isEditingStaff && (
                            <button
                              onClick={() => handleCopy(activeStaff.email, 'email')}
                              className="h-9 px-2.5 rounded-md bg-[#161619] hover:bg-[#1a1a1f] border border-[#27272e] text-zinc-300 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                            >
                              {copiedKey === 'email' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block mb-1">Residential Home Address</label>
                        <input
                          type="text"
                          readOnly={!isEditingStaff}
                          value={isEditingStaff && staffFormData ? staffFormData.address : activeStaff.address}
                          onChange={(e) => isEditingStaff && staffFormData && setStaffFormData({ ...staffFormData, address: e.target.value })}
                          className={cn(
                            'w-full h-9 px-3 text-xs font-semibold rounded-md outline-none truncate transition-all',
                            isEditingStaff
                              ? 'bg-[#141417] border border-zinc-500 text-white font-semibold shadow-xs'
                              : 'bg-[#141417] border border-[#24242a] text-zinc-300'
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Teaching Assignments & Class Teacher Mentorship Strip */}
                  <div>
                    <div className="px-4 py-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-zinc-400" />
                          <span>Teaching Assignments & Class Mentorship</span>
                        </h4>
                        <span className="text-[10px] font-mono text-zinc-300 font-bold bg-[#161619] px-2 py-0.5 rounded border border-[#27272e]">
                          {activeStaff.assignedClasses.length} Active Classes
                        </span>
                      </div>

                      {/* Class Teacher Home Room Banner */}
                      {activeStaff.classTeacherOf ? (
                        <div className="p-3 rounded-md bg-[#141417] border border-emerald-900/40 flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                              <School className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Official Class Mentor</span>
                              <p className="text-xs font-bold text-white">
                                {activeStaff.classTeacherOf.grade} – Section {activeStaff.classTeacherOf.section} ({activeStaff.classTeacherOf.room})
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                            <span className="bg-[#111113] px-2 py-0.5 rounded border border-[#242428]">
                              {activeStaff.classTeacherOf.studentCount} Students Enrolled
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] text-xs text-zinc-400 flex items-center justify-between">
                          <span>No homeroom class mentorship assigned currently.</span>
                          <span className="text-[10px] font-mono text-zinc-500">Subject Specialist Only</span>
                        </div>
                      )}

                      {/* Assigned Class Sections Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeStaff.assignedClasses.map((cls, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-md bg-[#141417] border border-[#24242a] flex items-center justify-between gap-2"
                          >
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-white">{cls.grade} – Sec {cls.section}</span>
                              <p className="text-[11px] text-zinc-400 font-medium">{cls.subject}</p>
                            </div>
                            <div className="text-right space-y-0.5">
                              <span className="text-[10px] font-mono font-bold text-zinc-300 bg-[#161619] px-1.5 py-0.5 rounded border border-[#27272e] block">
                                {cls.periodsPerWeek} P/Wk
                              </span>
                              <span className="text-[10px] font-mono text-zinc-500 block">{cls.room}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ACADEMICS & TIMETABLE */}
              {drawerTab === 'academics' && (
                <div className="animate-fade-in divide-y divide-[#1e1e24]">
                  {/* KPI Overview Strip */}
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 py-3">
                      <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">Weekly Load</span>
                        <span className="text-xl font-black text-white mt-0.5 block font-mono">{activeStaff.weeklyPeriods} / {activeStaff.maxWeeklyPeriods}</span>
                        <span className="text-[10px] text-emerald-400 mt-0.5 font-bold flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> Optimal Quota
                        </span>
                      </div>
                      <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">Satisfaction Rating</span>
                        <span className="text-xl font-black text-emerald-400 mt-0.5 block font-mono">{activeStaff.studentSatisfaction}</span>
                        <span className="text-[10px] text-zinc-400 mt-0.5 block">Top 5% Faculty Standing</span>
                      </div>
                      <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">Pass Rate</span>
                        <span className="text-xl font-black text-white mt-0.5 block font-mono">{activeStaff.passPercentage}</span>
                        <span className="text-[10px] text-zinc-400 mt-0.5 block">Board Class Batches</span>
                      </div>
                      <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">Faculty Attendance</span>
                        <span className="text-xl font-black text-emerald-400 mt-0.5 block font-mono">{activeStaff.attendance}</span>
                        <span className="text-[10px] text-emerald-400 mt-0.5 block font-medium">Full Session Presence</span>
                      </div>
                    </div>
                  </div>

                  {/* Teaching Timetable Schedule */}
                  <div>
                    <div className="px-4 py-3 space-y-2.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-zinc-400" />
                            <span>Weekly Teaching Timetable & Room Occupancy</span>
                          </h4>
                          <span className="text-[11px] text-zinc-400">Institutional Lecture Allocation · Session {activeSession}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Live Active Schedule
                        </span>
                      </div>

                      <div className="border border-[#24242a] rounded-md overflow-hidden bg-[#111113] text-xs shadow-2xs">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-[#141417] text-zinc-400 font-bold text-[10px] uppercase tracking-wider border-b border-[#242428]">
                              <th className="py-2.5 px-3 text-left">Day</th>
                              <th className="py-2.5 px-3 text-left">Period Slot</th>
                              <th className="py-2.5 px-3 text-left">{t('col.class')}</th>
                              <th className="py-2.5 px-3 text-left">Subject</th>
                              <th className="py-2.5 px-3 text-right">Room / Lab</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1e1e24] font-mono">
                            {activeStaff.schedule.map((row, idx) => (
                              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-2.5 px-3 font-sans font-bold text-white text-xs">{row.day}</td>
                                <td className="py-2.5 px-3 text-zinc-300 text-xs">{row.period}</td>
                                <td className="py-2.5 px-3 font-sans font-bold text-white">{row.classSection}</td>
                                <td className="py-2.5 px-3 font-sans text-zinc-300">{row.subject}</td>
                                <td className="py-2.5 px-3 text-right">
                                  <span className="px-2 py-0.5 rounded bg-[#161619] text-zinc-300 border border-[#27272e] text-[10px] font-bold">
                                    {row.room}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Principal & Academic Council Review */}
                  <div>
                    <div className="px-4 py-3">
                      <div className="p-3.5 rounded-lg bg-[#141417] border border-[#24242a] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wide flex items-center gap-1.5">
                            <Quote className="h-3 w-3 text-zinc-300" />
                            <span>Principal & Departmental Peer Evaluation</span>
                          </span>
                          <span className="text-[10px] text-zinc-400 font-medium">Verified for Session {activeSession}</span>
                        </div>
                        <p className="text-zinc-200 text-xs italic leading-relaxed">
                          "{activeStaff.name} continues to exhibit exceptional academic mentorship, pedagogical clarity, and prompt curricular delivery with zero student grievances."
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-400 border-t border-[#24242a] flex-wrap gap-2">
                          <span>Evaluator: <strong>Academic Directorate & Head of School</strong></span>
                          <span>Rating: <strong>Exemplary (Grade A1)</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ATTENDANCE & LEAVES (DEDICATED ATTENDANCE HUB) */}
              {drawerTab === 'attendance' && (
                <div className="animate-fade-in divide-y divide-[#1e1e24]">
                  {/* Attendance KPI Strip */}
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 py-3">
                      <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">Monthly Presence</span>
                        <span className="text-xl font-black text-emerald-400 mt-0.5 block font-mono">{activeStaff.attendance}</span>
                        <span className="text-[10px] text-emerald-400 mt-0.5 font-medium">22 of 23 Days Present</span>
                      </div>
                      <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">On-Time Punch Rate</span>
                        <span className="text-xl font-black text-white mt-0.5 block font-mono">96.5%</span>
                        <span className="text-[10px] text-zinc-400 mt-0.5 block">Biometric Gateway</span>
                      </div>
                      <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">Leaves Availed</span>
                        <span className="text-xl font-black text-white mt-0.5 block font-mono">2 Days</span>
                        <span className="text-[10px] text-zinc-400 mt-0.5 block">1 Casual · 1 Medical</span>
                      </div>
                      <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">Leave Balance</span>
                        <span className="text-xl font-black text-emerald-400 mt-0.5 block font-mono">
                          {activeStaff.leaveBalance.casual + activeStaff.leaveBalance.medical + activeStaff.leaveBalance.earned} Days
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-0.5 block">Available Quota</span>
                      </div>
                    </div>
                  </div>

                  {/* Biometric Log Table */}
                  <div>
                    <div className="px-4 py-3 space-y-2.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                          <Fingerprint className="h-4 w-4 text-zinc-400" />
                          <span>Recent Biometric Gateway Check-In Log</span>
                        </h4>
                        <span className="text-[10px] font-mono text-zinc-300 font-bold bg-[#161619] px-2 py-0.5 rounded border border-[#27272e]">
                          Bio-Scanner Gate #1
                        </span>
                      </div>

                      <div className="border border-[#24242a] rounded-md overflow-hidden bg-[#111113] text-xs">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-[#141417] text-zinc-400 font-bold text-[10px] uppercase tracking-wider border-b border-[#242428]">
                              <th className="py-2.5 px-3 text-left">Date</th>
                              <th className="py-2.5 px-3 text-left">Day</th>
                              <th className="py-2.5 px-3 text-center">In Time</th>
                              <th className="py-2.5 px-3 text-center">Out Time</th>
                              <th className="py-2.5 px-3 text-center">Work Duration</th>
                              <th className="py-2.5 px-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1e1e24] font-mono">
                            {activeStaff.attendanceLog.map((row, idx) => (
                              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-2.5 px-3 font-sans font-bold text-white text-xs">{row.date}</td>
                                <td className="py-2.5 px-3 font-sans text-zinc-400 text-xs">{row.day}</td>
                                <td className="py-2.5 px-3 text-center text-zinc-300">{row.inTime}</td>
                                <td className="py-2.5 px-3 text-center text-zinc-300">{row.outTime}</td>
                                <td className="py-2.5 px-3 text-center font-bold text-white">{row.totalHours}</td>
                                <td className="py-2.5 px-3 text-right">
                                  <span
                                    className={cn(
                                      'px-2 py-0.5 rounded text-[10px] font-bold',
                                      row.status === 'Present' && 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
                                      row.status === 'Late' && 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
                                      row.status === 'Leave' && 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                    )}
                                  >
                                    {row.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Annual Leave Balances Card */}
                  <div>
                    <div className="px-4 py-3 space-y-2.5">
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <CalendarCheck2 className="h-4 w-4 text-zinc-400" />
                        <span>Annual Leave Ledger Breakdown</span>
                      </h4>

                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] text-center space-y-1">
                          <span className="text-[11px] font-bold text-zinc-400 block uppercase">Casual Leave (CL)</span>
                          <span className="text-lg font-mono font-black text-white block">{activeStaff.leaveBalance.casual} Days</span>
                          <span className="text-[10px] text-zinc-500 block">Available of 12</span>
                        </div>
                        <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] text-center space-y-1">
                          <span className="text-[11px] font-bold text-zinc-400 block uppercase">Medical Leave (ML)</span>
                          <span className="text-lg font-mono font-black text-white block">{activeStaff.leaveBalance.medical} Days</span>
                          <span className="text-[10px] text-zinc-500 block">Available of 12</span>
                        </div>
                        <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] text-center space-y-1">
                          <span className="text-[11px] font-bold text-zinc-400 block uppercase">Earned Leave (EL)</span>
                          <span className="text-lg font-mono font-black text-white block">{activeStaff.leaveBalance.earned} Days</span>
                          <span className="text-[10px] text-zinc-500 block">Accumulated of 18</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CERTIFICATES & INTEGRATED ID CARD (BUILT-IN PREVIEW) */}
              {drawerTab === 'credentials' && (
                <div className="animate-fade-in divide-y divide-[#1e1e24]">
                  {/* Top Row: Integrated ID Badge (Left) & Verification Registry (Right) */}
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4 py-3">
                      {/* 1. Integrated Digital ID Card Preview */}
                      <div className="p-3.5 rounded-lg bg-[#141417] border border-[#24242a] shadow-xs flex flex-col justify-between space-y-3">
                        <div className="flex items-center justify-between border-b border-[#242428] pb-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                            <QrCode className="h-4 w-4 text-zinc-400" />
                            <span>Faculty Smart ID Badge</span>
                          </h4>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            CR-80 (85×54mm)
                          </span>
                        </div>

                        {/* Compact ID Card Preview */}
                        <div className="w-full bg-[#111114] rounded-md border-2 border-[#2a2a32] p-3 flex flex-col justify-between select-none relative overflow-hidden shadow-md" style={{ aspectRatio: '85 / 54' }}>
                          <div className="flex items-center justify-between border-b border-[#242428] pb-1">
                            <div className="flex items-center gap-1.5">
                              <div className="h-4 w-4 rounded-full bg-[#161619] text-white flex items-center justify-center text-[9px] font-black border border-[#2a2a32]">
                                V
                              </div>
                              <span className="font-bold text-[10px] text-white tracking-tight">VidyaMaxx Academy</span>
                            </div>
                            <span className="text-[8px] font-mono font-bold px-1 rounded bg-[#161619] border border-[#242428] text-zinc-300">
                              FACULTY PASS
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 my-auto">
                            <div className="w-11 h-[56px] rounded border border-[#2a2a32] bg-[#161619] overflow-hidden shrink-0 shadow-xs" style={{ aspectRatio: '19.5 / 25' }}>
                              <img
                                src={activeStaff.avatarUrl}
                                alt={activeStaff.name}
                                style={{ aspectRatio: '19.5 / 25' }}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0 space-y-0.5 text-left">
                              <h5 className="font-bold text-[11px] text-white truncate">{activeStaff.name}</h5>
                              <p className="font-mono text-[9px] text-zinc-400 font-semibold">{activeStaff.code}</p>
                              <p className="text-zinc-300 text-[9px] truncate">
                                {activeStaff.designation} · {activeStaff.department}
                              </p>
                              <div className="flex items-center gap-1.5 text-[8px] text-zinc-400 font-mono">
                                <span>Blood: <strong className="text-white">{activeStaff.bloodGroup || 'O+'}</strong></span>
                                <span>•</span>
                                <span>Exp: {activeStaff.experience}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-[#242428] pt-0.5">
                            <div className="flex items-center gap-0.5 h-2 opacity-60">
                              <div className="h-full w-0.5 bg-white" />
                              <div className="h-full w-1 bg-white" />
                              <div className="h-full w-0.5 bg-white" />
                              <div className="h-full w-1 bg-white" />
                            </div>
                            <span className="text-[8px] font-mono text-emerald-400 font-bold">
                              ACTIVE ENROLLMENT
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <VFButton
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            leftIcon={<Printer className="h-3.5 w-3.5" />}
                            onClick={() => window.print()}
                          >
                            Print ID Badge
                          </VFButton>
                          <VFButton
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            leftIcon={<Download className="h-3.5 w-3.5 text-zinc-400" />}
                            onClick={() => {
                              addNotification({
                                title: 'Downloading Smart ID Badge',
                                description: `85×54mm print-ready badge for ${activeStaff.name} compiled.`,
                                type: 'success',
                              });
                            }}
                          >
                            Download PNG
                          </VFButton>
                        </div>
                      </div>

                      {/* 2. Official Teacher Registry & Certifications */}
                      <div className="p-3.5 rounded-lg bg-[#141417] border border-[#24242a] shadow-xs flex flex-col justify-between space-y-3">
                        <div className="flex items-center justify-between border-b border-[#242428] pb-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                            <ShieldCheck className="h-4 w-4 text-zinc-400" />
                            <span>Institutional Verification & Credentials</span>
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Verified OK
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="p-2.5 rounded-md bg-[#111113] border border-[#242428] flex items-center justify-between">
                            <div>
                              <span className="text-[9px] text-zinc-400 uppercase font-bold block">TET / CTET Eligibility</span>
                              <span className="font-mono text-xs font-bold text-white">{activeStaff.tetCertification || 'CTET Paper II Certified'}</span>
                            </div>
                            <span className="h-6 px-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                              <Check className="h-3 w-3" /> Qualified
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2.5 rounded-md bg-[#111113] border border-[#242428]">
                              <span className="text-[9px] text-zinc-400 uppercase font-bold block">PF / UAN No</span>
                              <span className="font-mono text-xs font-bold text-white">{activeStaff.pfAccountNo}</span>
                            </div>
                            <div className="p-2.5 rounded-md bg-[#111113] border border-[#242428]">
                              <span className="text-[9px] text-zinc-400 uppercase font-bold block">Aadhaar Verified</span>
                              <span className="font-mono text-xs font-bold text-white">{activeStaff.aadhaarNo}</span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-md bg-[#111113] border border-[#242428]">
                            <span className="text-[9px] text-zinc-400 uppercase font-bold block">Highest Qualification</span>
                            <span className="text-[11px] font-semibold text-white truncate block mt-0.5">{activeStaff.qualification}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <VFButton
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            leftIcon={<FileCheck className="h-3.5 w-3.5" />}
                            onClick={() => alert(`Verification Dossier for ${activeStaff.name} verified.`)}
                          >
                            Verify Credentials
                          </VFButton>
                          <VFButton
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            leftIcon={<Award className="h-3.5 w-3.5" />}
                            onClick={() => alert(`Downloading Appointment Letter for ${activeStaff.name}`)}
                          >
                            Appointment Letter
                          </VFButton>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: 3 Institutional Certificates Hub */}
                  <div>
                    <div className="px-4 py-3 space-y-2.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                          <Award className="h-4 w-4 text-zinc-400" />
                          <span>Institutional Faculty Certificates</span>
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                          Digital Seal Ready
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {/* 1. Experience Certificate */}
                        <div className="p-3 rounded-lg bg-[#141417] border border-[#24242a] shadow-xs flex flex-col justify-between space-y-2.5">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                                <FileSpreadsheet className="h-4 w-4 text-zinc-300" />
                                <span>Experience Certificate</span>
                              </div>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                Official
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-relaxed">
                              Certified statement of continuous service, tenure duration, and departmental responsibilities.
                            </p>
                          </div>
                          <VFButton
                            size="sm"
                            variant="outline"
                            className="w-full text-xs"
                            leftIcon={<FileText className="h-3.5 w-3.5" />}
                            onClick={() => alert(`Generated Experience Certificate for ${activeStaff.name}`)}
                          >
                            Issue Certificate
                          </VFButton>
                        </div>

                        {/* 2. Service Conduct Certificate */}
                        <div className="p-3 rounded-lg bg-[#141417] border border-[#24242a] shadow-xs flex flex-col justify-between space-y-2.5">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                                <Award className="h-4 w-4 text-emerald-400" />
                                <span>Conduct Certificate</span>
                              </div>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                Exemplary
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-relaxed">
                              Certifies professional excellence, institutional integrity, and exemplary code of ethics.
                            </p>
                          </div>
                          <VFButton
                            size="sm"
                            variant="outline"
                            className="w-full text-xs"
                            leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                            onClick={() => alert(`Generated Conduct Certificate for ${activeStaff.name}`)}
                          >
                            Conduct Certificate
                          </VFButton>
                        </div>

                        {/* 3. Bonafide Employment Letter */}
                        <div className="p-3 rounded-lg bg-[#141417] border border-[#24242a] shadow-xs flex flex-col justify-between space-y-2.5">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                                <FileCheck className="h-4 w-4 text-blue-400" />
                                <span>Bonafide Employment</span>
                              </div>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                Instant
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-relaxed">
                              Official proof of active employment for banking, loan clearance, visa, and passport verification.
                            </p>
                          </div>
                          <VFButton
                            size="sm"
                            variant="outline"
                            className="w-full text-xs"
                            leftIcon={<Download className="h-3.5 w-3.5" />}
                            onClick={() => alert(`Generated Bonafide Employment Letter for ${activeStaff.name}`)}
                          >
                            Bonafide Letter
                          </VFButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SALARY & PAYROLL (COMPREHENSIVE LEDGER & PAYSLIPS) */}
              {drawerTab === 'payroll' && (
                <div className="animate-fade-in divide-y divide-[#1e1e24]">
                  {/* KPI Financial Metrics Strip */}
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 py-3">
                      <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">Monthly Gross Pay</span>
                        <span className="text-xl font-black text-white mt-0.5 block font-mono">{activeStaff.grossPay}</span>
                        <span className="text-[10px] text-zinc-400 mt-0.5 block">{activeStaff.salaryGrade}</span>
                      </div>
                      <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">Net In-Hand Salary</span>
                        <span className="text-xl font-black text-emerald-400 mt-0.5 block font-mono">{activeStaff.netPay}</span>
                        <span className="text-[10px] text-emerald-400 mt-0.5 font-bold flex items-center gap-1">
                          <CheckCheck className="h-3 w-3" /> Direct Deposit Active
                        </span>
                      </div>
                      <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">Total Deductions</span>
                        <span className="text-xl font-black text-white mt-0.5 block font-mono">
                          ₹ {Number(activeStaff.pfDeduction.replace(/[^0-9]/g, '')) + Number(activeStaff.taxDeduction.replace(/[^0-9]/g, ''))}
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-0.5 block">PF & TDS Income Tax</span>
                      </div>
                      <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">Leave Balance</span>
                        <span className="text-xl font-black text-white mt-0.5 block font-mono">
                          {activeStaff.leaveBalance.casual + activeStaff.leaveBalance.medical + activeStaff.leaveBalance.earned} Days
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-0.5 block">Total Available</span>
                      </div>
                    </div>
                  </div>

                  {/* Compensation Breakdown Card */}
                  <div>
                    <div className="px-4 py-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                          <Receipt className="h-4 w-4 text-zinc-400" />
                          <span>Detailed Monthly Salary Component Breakdown</span>
                        </h4>
                        <span className="text-[10px] font-mono text-zinc-300 font-bold bg-[#161619] px-2 py-0.5 rounded border border-[#27272e]">
                          {activeStaff.salaryGrade}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Earnings Column */}
                        <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] space-y-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block border-b border-[#242428] pb-1">
                            Earnings / Allowances (+)
                          </span>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">Basic Pay</span>
                              <span className="font-mono font-bold text-white">{activeStaff.basicPay}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">House Rent Allowance (HRA)</span>
                              <span className="font-mono font-bold text-white">{activeStaff.hra}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">Dearness Allowance (DA)</span>
                              <span className="font-mono font-bold text-white">{activeStaff.da}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">Special Academic Allowance</span>
                              <span className="font-mono font-bold text-white">{activeStaff.specialAllowance}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1.5 border-t border-[#242428] font-bold">
                              <span className="text-white">Gross Total Earnings</span>
                              <span className="font-mono text-white">{activeStaff.grossPay}</span>
                            </div>
                          </div>
                        </div>

                        {/* Deductions Column */}
                        <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] space-y-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block border-b border-[#242428] pb-1">
                            Statutory Deductions (-)
                          </span>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">Provident Fund (PF / EPF)</span>
                              <span className="font-mono font-bold text-zinc-300">{activeStaff.pfDeduction}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">TDS / Income Tax</span>
                              <span className="font-mono font-bold text-zinc-300">{activeStaff.taxDeduction}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">Institutional Group Medical Cover</span>
                              <span className="font-mono font-bold text-emerald-400">Covered (Free)</span>
                            </div>
                            <div className="flex items-center justify-between pt-1.5 border-t border-[#242428] font-bold">
                              <span className="text-emerald-400">Net Take-Home Pay</span>
                              <span className="font-mono text-emerald-400 text-sm">{activeStaff.netPay}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bank Details Strip */}
                      <div className="p-3 rounded-md bg-[#141417] border border-[#24242a] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase block">Bank Name</span>
                          <span className="font-semibold text-white truncate block">{activeStaff.bankName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase block">A/C Number</span>
                          <span className="font-mono font-bold text-white">{activeStaff.bankAccountNo}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase block">IFSC Code</span>
                          <span className="font-mono text-white">{activeStaff.bankIfsc}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase block">PF / UAN No</span>
                          <span className="font-mono text-white">{activeStaff.pfAccountNo}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payout History Table */}
                  <div>
                    <div className="px-4 py-3 space-y-2.5">
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-zinc-400" />
                        <span>Recent Monthly Salary Disbursals</span>
                      </h4>

                      <div className="border border-[#24242a] rounded-md overflow-hidden bg-[#111113] text-xs">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-[#141417] text-zinc-400 font-bold text-[10px] uppercase tracking-wider border-b border-[#242428]">
                              <th className="py-2.5 px-3 text-left">Salary Cycle</th>
                              <th className="py-2.5 px-3 text-center">Gross Pay</th>
                              <th className="py-2.5 px-3 text-center">Deductions</th>
                              <th className="py-2.5 px-3 text-center">Net Transferred</th>
                              <th className="py-2.5 px-3 text-center">Status</th>
                              <th className="py-2.5 px-3 text-right">Slip</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1e1e24] font-mono">
                            {activeStaff.payoutHistory.map((row, idx) => (
                              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-2.5 px-3 font-sans font-bold text-white text-xs">{row.month}</td>
                                <td className="py-2.5 px-3 text-center text-zinc-300">{row.gross}</td>
                                <td className="py-2.5 px-3 text-center text-zinc-400">{row.deductions}</td>
                                <td className="py-2.5 px-3 text-center font-bold text-emerald-400">{row.net}</td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                    {row.status}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <button
                                    onClick={() => alert(`Downloading Payslip PDF for ${row.month}`)}
                                    className="text-zinc-400 hover:text-white font-sans text-xs underline cursor-pointer"
                                  >
                                    PDF Slip
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
                        onClick={() => alert(`Downloading Official Salary Certificate & Payslip for ${activeStaff.name}`)}
                      >
                        Download Latest Payslip (PDF)
                      </VFButton>
                      <VFButton
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        leftIcon={<Printer className="h-3.5 w-3.5" />}
                        onClick={() => alert(`Printing Form-16 Tax Summary for ${activeStaff.name}`)}
                      >
                        Print Tax Form-16
                      </VFButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </VFDrawer>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. ONBOARD NEW FACULTY MEMBER SIDE DRAWER (VFDrawer)
          ═══════════════════════════════════════════════════════════════════════ */}
      <VFDrawer
        isOpen={isAddStaffDrawerOpen}
        onClose={() => setIsAddStaffDrawerOpen(false)}
        hideHeader={true}
        title="Onboard New Faculty Member"
        className="w-[850px] min-w-[320px] sm:min-w-[850px] max-w-[95vw]"
        bodyClassName="p-0 flex flex-col overflow-hidden"
        footerActions={
          <div className="flex items-center justify-between w-full gap-3">
            <span className="text-xs text-zinc-400 font-mono">
              Auto ID: <strong className="text-white">{newStaffForm.code}</strong>
            </span>
            <div className="flex items-center gap-2">
              <VFButton
                variant="outline"
                size="sm"
                onClick={() => setIsAddStaffDrawerOpen(false)}
              >
                Cancel
              </VFButton>
              <VFButton
                size="sm"
                leftIcon={<Check className="h-3.5 w-3.5" />}
                onClick={handleCreateStaff}
              >
                Confirm & Onboard Faculty
              </VFButton>
            </div>
          </div>
        }
      >
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden animate-fade-in">
          {/* Header Bar */}
          <div className="w-full bg-[#111113] border-b border-[#242428] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-md bg-[#161619] border border-[#27272e] flex items-center justify-center text-white">
                <Plus className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Onboard New Faculty Member</h3>
                <p className="text-xs text-zinc-400">Institutional Onboarding Dossier & Class Allocations</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-[#141417] p-1 rounded-md border border-[#24242a]">
              <button
                type="button"
                onClick={() => setAddStaffStep('personal')}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer',
                  addStaffStep === 'personal' ? 'bg-[#18181c] text-white border border-[#2e2e36]' : 'text-zinc-400 hover:text-white'
                )}
              >
                1. Personal & Contact
              </button>
              <button
                type="button"
                onClick={() => setAddStaffStep('academic')}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer',
                  addStaffStep === 'academic' ? 'bg-[#18181c] text-white border border-[#2e2e36]' : 'text-zinc-400 hover:text-white'
                )}
              >
                2. Academic & Classes
              </button>
              <button
                type="button"
                onClick={() => setAddStaffStep('payroll')}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer',
                  addStaffStep === 'payroll' ? 'bg-[#18181c] text-white border border-[#2e2e36]' : 'text-zinc-400 hover:text-white'
                )}
              >
                3. Salary & Bank
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
            {addStaffStep === 'personal' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-lg bg-[#111113] border border-[#242428] space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Demographic & Personal Identity
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <VFInput
                      label="Full Legal Name *"
                      value={newStaffForm.name}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                      placeholder="e.g. Dr. Alok Nath"
                    />
                    <VFInput
                      label="Staff Employee ID"
                      value={newStaffForm.code}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, code: e.target.value })}
                    />
                    <VFSelect
                      label="Designation / Institutional Title"
                      value={newStaffForm.designation}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, designation: String(e.target.value) })}
                      options={[
                        { label: 'PGT Educator (Senior Scale)', value: 'PGT Educator' },
                        { label: 'TGT Educator', value: 'TGT Educator' },
                        { label: 'Head of Department (HOD)', value: 'Head of Department (HOD)' },
                        { label: 'Primary Teacher (PRT)', value: 'PRT Educator' },
                        { label: 'Lab Assistant / Instructor', value: 'Lab Instructor' },
                        { label: 'Administrative Officer', value: 'Administrative Officer' },
                      ]}
                    />
                    <VFSelect
                      label="Department / Faculty"
                      value={newStaffForm.department}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, department: String(e.target.value) })}
                      options={[
                        { label: 'Science & Math', value: 'Science & Math' },
                        { label: 'Humanities & Languages', value: 'Humanities & Languages' },
                        { label: 'Computer & AI Labs', value: 'Computer & AI Labs' },
                        { label: 'Commerce & Economics', value: 'Commerce & Economics' },
                        { label: 'Arts & Performing Studio', value: 'Arts & Performing Studio' },
                      ]}
                    />
                    <VFInput
                      label="Date of Birth"
                      type="date"
                      value={newStaffForm.dob}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, dob: e.target.value })}
                    />
                    <VFSelect
                      label="Blood Group"
                      value={newStaffForm.bloodGroup}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, bloodGroup: String(e.target.value) })}
                      options={[
                        { label: 'O+ (Positive)', value: 'O+' },
                        { label: 'O- (Negative)', value: 'O-' },
                        { label: 'A+ (Positive)', value: 'A+' },
                        { label: 'A- (Negative)', value: 'A-' },
                        { label: 'B+ (Positive)', value: 'B+' },
                        { label: 'B- (Negative)', value: 'B-' },
                        { label: 'AB+ (Positive)', value: 'AB+' },
                        { label: 'AB- (Negative)', value: 'AB-' },
                      ]}
                    />
                    <div className="sm:col-span-2">
                      <VFInput
                        label="National ID / Aadhaar Number"
                        value={newStaffForm.aadhaarNo}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, aadhaarNo: e.target.value })}
                        placeholder="e.g. 4820-9910-3341"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#111113] border border-[#242428] space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <VFInput
                      label="Contact Phone"
                      value={newStaffForm.phone}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                    />
                    <VFInput
                      label="Institutional Email"
                      value={newStaffForm.email}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                      placeholder="e.g. a.nath@vidyamaxx.edu.in"
                    />
                    <div className="sm:col-span-2">
                      <VFInput
                        label="Residential Address"
                        value={newStaffForm.address}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, address: e.target.value })}
                        placeholder="e.g. B-12, Institutional Staff Quarters, New Delhi"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {addStaffStep === 'academic' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-lg bg-[#111113] border border-[#242428] space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Teaching Subject & Qualifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <VFInput
                      label="Primary Subject Specialization *"
                      value={newStaffForm.subject}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, subject: e.target.value })}
                      placeholder="e.g. Mathematics"
                    />
                    <VFInput
                      label="Secondary Subject Focus"
                      value={newStaffForm.secondarySubject}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, secondarySubject: e.target.value })}
                      placeholder="e.g. Statistics & Probability"
                    />
                    <VFInput
                      label="Highest Academic Degree"
                      value={newStaffForm.qualification}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, qualification: e.target.value })}
                      placeholder="e.g. M.Sc. Mathematics, B.Ed."
                    />
                    <VFInput
                      label="Total Experience"
                      value={newStaffForm.experience}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, experience: e.target.value })}
                      placeholder="e.g. 5 Years"
                    />
                    <VFInput
                      label="TET / CTET Qualification"
                      value={newStaffForm.tetCertification}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, tetCertification: e.target.value })}
                    />
                    <VFInput
                      label="Weekly Teaching Period Quota"
                      type="number"
                      value={String(newStaffForm.weeklyPeriods)}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, weeklyPeriods: Number(e.target.value) || 22 })}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#111113] border border-[#242428] space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Homeroom Mentorship & Assigned Classes
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <VFSelect
                      label="Class Teacher Of (Grade)"
                      value={newStaffForm.classTeacherOfGrade}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, classTeacherOfGrade: String(e.target.value) })}
                      options={[
                        { label: 'Unassigned (Subject Only)', value: '' },
                        { label: 'Class 9', value: 'Class 9' },
                        { label: 'Class 10', value: 'Class 10' },
                        { label: 'Class 11', value: 'Class 11' },
                        { label: 'Class 12', value: 'Class 12' },
                      ]}
                    />
                    <VFInput
                      label="Section"
                      value={newStaffForm.classTeacherOfSection}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, classTeacherOfSection: e.target.value })}
                      placeholder="e.g. A"
                    />
                    <VFInput
                      label="Homeroom Number"
                      value={newStaffForm.classTeacherRoom}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, classTeacherRoom: e.target.value })}
                      placeholder="e.g. Room 101"
                    />
                  </div>
                </div>
              </div>
            )}

            {addStaffStep === 'payroll' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-lg bg-[#111113] border border-[#242428] space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Compensation & Institutional Grade
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <VFInput
                      label="Salary Pay Grade"
                      value={newStaffForm.salaryGrade}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, salaryGrade: e.target.value })}
                    />
                    <VFInput
                      label="Monthly Basic Pay"
                      value={newStaffForm.basicPay}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, basicPay: e.target.value })}
                    />
                    <VFInput
                      label="Monthly Gross Pay"
                      value={newStaffForm.grossPay}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, grossPay: e.target.value })}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#111113] border border-[#242428] space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Direct Bank Deposit & Provident Fund
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <VFInput
                      label="Bank Name"
                      value={newStaffForm.bankName}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, bankName: e.target.value })}
                    />
                    <VFInput
                      label="Bank Account Number"
                      value={newStaffForm.bankAccountNo}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, bankAccountNo: e.target.value })}
                    />
                    <VFInput
                      label="Bank IFSC Code"
                      value={newStaffForm.bankIfsc}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, bankIfsc: e.target.value })}
                    />
                    <VFInput
                      label="PF / UAN Account Number"
                      value={newStaffForm.pfAccountNo}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, pfAccountNo: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </VFDrawer>

      {/* ═══════════════════════════════════════════════════════════════════════
          5. PHOTO CENTERED PREVIEW MODAL (WITH DARK BACKDROP BLUR)
          ═══════════════════════════════════════════════════════════════════════ */}
      {isPhotoModalOpen && previewPhotoData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <div
            className="relative max-w-sm w-full bg-[#111113] border border-[#27272e] rounded-lg shadow-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-[#161619] border-b border-[#242428] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{previewPhotoData.name}</h3>
                <p className="text-xs text-zinc-400">{previewPhotoData.designation} · {previewPhotoData.code}</p>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="h-7 w-7 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-5 flex flex-col items-center justify-center bg-[#0e0e11]">
              <div className="w-48 h-60 rounded-md overflow-hidden border border-[#2a2a32] shadow-md">
                <img
                  src={previewPhotoData.avatarUrl}
                  alt={previewPhotoData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="p-3.5 bg-[#141417] border-t border-[#242428] flex items-center justify-end gap-2">
              <VFButton
                size="sm"
                variant="outline"
                onClick={() => setIsPhotoModalOpen(false)}
              >
                Close
              </VFButton>
              <VFButton
                size="sm"
                leftIcon={<Download className="h-3.5 w-3.5" />}
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = previewPhotoData.avatarUrl;
                  a.download = `${previewPhotoData.name.replace(/\s+/g, '_')}_Photo.jpg`;
                  a.target = '_blank';
                  a.click();
                }}
              >
                Download Photo
              </VFButton>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          6. MULTI-FORMAT EXPORT ROSTER MODAL
          ═══════════════════════════════════════════════════════════════════════ */}
      <VFDialog
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Faculty & Staff Roster"
        description="Generate formatted spreadsheet reports, printable PDF lists, or digital identity packages"
        className="max-w-lg"
        footerActions={
          <div className="flex items-center justify-end gap-2 w-full">
            <VFButton
              variant="outline"
              size="sm"
              onClick={() => setIsExportModalOpen(false)}
              disabled={isExporting}
            >
              Cancel
            </VFButton>
            <VFButton
              size="sm"
              leftIcon={<Download className="h-3.5 w-3.5" />}
              onClick={handleExecuteExport}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Generate & Download'}
            </VFButton>
          </div>
        }
      >
        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setExportFormat('bundle')}
              className={cn(
                'p-3 rounded-md border text-center transition-all cursor-pointer space-y-1',
                exportFormat === 'bundle'
                  ? 'bg-[#18181c] border-zinc-400 text-white shadow-xs'
                  : 'bg-[#121214] border-[#27272e] text-zinc-400 hover:bg-[#161619]'
              )}
            >
              <Archive className="h-5 w-5 mx-auto text-zinc-300" />
              <span className="text-xs font-bold block">Complete ZIP</span>
              <span className="text-[10px] text-zinc-500 block">CSV + JSON</span>
            </button>

            <button
              type="button"
              onClick={() => setExportFormat('csv')}
              className={cn(
                'p-3 rounded-md border text-center transition-all cursor-pointer space-y-1',
                exportFormat === 'csv'
                  ? 'bg-[#18181c] border-zinc-400 text-white shadow-xs'
                  : 'bg-[#121214] border-[#27272e] text-zinc-400 hover:bg-[#161619]'
              )}
            >
              <FileSpreadsheet className="h-5 w-5 mx-auto text-zinc-300" />
              <span className="text-xs font-bold block">Excel / CSV</span>
              <span className="text-[10px] text-zinc-500 block">Spreadsheet</span>
            </button>

            <button
              type="button"
              onClick={() => setExportFormat('pdf')}
              className={cn(
                'p-3 rounded-md border text-center transition-all cursor-pointer space-y-1',
                exportFormat === 'pdf'
                  ? 'bg-[#18181c] border-zinc-400 text-white shadow-xs'
                  : 'bg-[#121214] border-[#27272e] text-zinc-400 hover:bg-[#161619]'
              )}
            >
              <Printer className="h-5 w-5 mx-auto text-zinc-300" />
              <span className="text-xs font-bold block">Printable PDF</span>
              <span className="text-[10px] text-zinc-500 block">Document</span>
            </button>
          </div>

          {isExporting && (
            <div className="p-3 rounded-md bg-[#161619] border border-[#27272e] text-xs font-mono text-zinc-300 flex items-center gap-2">
              <span className="animate-spin text-white">⟳</span>
              <span>{exportProgressText || 'Processing...'}</span>
            </div>
          )}
        </div>
      </VFDialog>
    </VFPageContainer>
  );
}
