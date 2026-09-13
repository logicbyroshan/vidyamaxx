import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFDataTable,
  VFButton,
  VFBadge,
  VFDrawer,
  VFSelect,
  VFInput,
  VFDialog,
  cn,
} from '@vidyamaxx/ui';
import {
  CreditCard,
  Download,
  Receipt,
  Check,
  Printer,
  ChevronLeft,
  ChevronRight,
  QrCode,
  Building,
  FileCheck,
  History,
  Phone,
  User,
  Wallet,
  Copy,
  Send,
  Award,
  Bell,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/fees')({
  component: FeesPage,
});

export interface PaymentReceipt {
  receiptNo: string;
  date: string;
  amount: number;
  mode: 'Cash at Counter' | 'Cheque / DD' | 'UPI / QR Code (Manual Verify)' | 'Bank Transfer (NEFT/RTGS)' | 'POS Card Swipe';
  referenceNo: string;
  payerName: string;
  payerRelation: string;
  cashier: string;
  notes?: string;
  settledPeriod?: string;
}

export interface MonthlyInstallmentItem {
  monthName: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paidDate?: string;
  receiptNo?: string;
}

export interface FeeRecord {
  id: string;
  studentName: string;
  studentAdmNo: string;
  photoUrl: string;
  class: string;
  quarter: string;
  paymentPlan: 'Annual Full' | 'Monthly Installment' | 'Quarterly';
  monthlyAmount: number;
  annualTuition: number;
  installmentDueDay: number; // e.g., 5th or 10th of every month
  nextDueDate: string;
  tuitionFee: number;
  labFee: number;
  transportFee: number;
  activityFee: number;
  totalFee: number;
  paidAmount: number;
  dueAmount: number;
  status: 'Paid' | 'Partial' | 'Overdue';
  lastPaymentDate: string;
  phone: string;
  email: string;
  fatherName: string;
  motherName: string;
  emergencyPhone: string;
  address: string;
  history: PaymentReceipt[];
  installments: MonthlyInstallmentItem[];
}

const INITIAL_FEES: FeeRecord[] = [
  {
    id: '1',
    studentName: 'Aditya Verma',
    studentAdmNo: 'ADM-2026-0841',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    class: 'Class 9-A',
    quarter: 'Q2 (Jul – Sep 2026)',
    paymentPlan: 'Annual Full',
    monthlyAmount: 3500,
    annualTuition: 42000,
    installmentDueDay: 10,
    nextDueDate: '10 Apr 2027 (Annual Cleared)',
    tuitionFee: 30000,
    labFee: 5000,
    transportFee: 4500,
    activityFee: 2500,
    totalFee: 42000,
    paidAmount: 42000,
    dueAmount: 0,
    status: 'Paid',
    lastPaymentDate: '10 Jul 2026',
    phone: '+91 98765 43210',
    email: 'aditya.v@vidyamaxx.edu.in',
    fatherName: 'Mr. Ramesh Verma',
    motherName: 'Mrs. Sunita Verma',
    emergencyPhone: '+91 98765 43211',
    address: 'B-142, Sector 14, Rohini, New Delhi - 110085',
    history: [
      {
        receiptNo: 'REC-2026-8801',
        date: '10 Jul 2026, 11:30 AM',
        amount: 42000,
        mode: 'UPI / QR Code (Manual Verify)',
        referenceNo: 'UTR: 991823901244 (Verified)',
        payerName: 'Mr. Ramesh Verma',
        payerRelation: 'Father',
        cashier: 'Mr. Arvind Gupta (Bursar)',
        notes: 'Full Annual Tuition fee paid with 10% lumsum concession.',
        settledPeriod: 'Full Academic Year 2026–2027',
      },
    ],
    installments: [
      { monthName: 'April 2026', amount: 3500, dueDate: '10 Apr 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { monthName: 'May 2026', amount: 3500, dueDate: '10 May 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { monthName: 'June 2026', amount: 3500, dueDate: '10 Jun 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { monthName: 'July 2026', amount: 3500, dueDate: '10 Jul 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { monthName: 'August 2026', amount: 3500, dueDate: '10 Aug 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { monthName: 'September 2026', amount: 3500, dueDate: '10 Sep 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { monthName: 'October 2026', amount: 3500, dueDate: '10 Oct 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { monthName: 'November 2026', amount: 3500, dueDate: '10 Nov 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { monthName: 'December 2026', amount: 3500, dueDate: '10 Dec 2026', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { monthName: 'January 2027', amount: 3500, dueDate: '10 Jan 2027', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { monthName: 'February 2027', amount: 3500, dueDate: '10 Feb 2027', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
      { monthName: 'March 2027', amount: 3500, dueDate: '10 Mar 2027', isPaid: true, paidDate: '10 Jul 2026', receiptNo: 'REC-2026-8801' },
    ],
  },
  {
    id: '2',
    studentName: 'Priya Sharma',
    studentAdmNo: 'ADM-2026-0842',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    class: 'Class 9-A',
    quarter: 'Q2 (Jul – Sep 2026)',
    paymentPlan: 'Monthly Installment',
    monthlyAmount: 3500,
    annualTuition: 42000,
    installmentDueDay: 5,
    nextDueDate: '05 Sep 2026',
    tuitionFee: 30000,
    labFee: 5000,
    transportFee: 4500,
    activityFee: 2500,
    totalFee: 42000,
    paidAmount: 17500,
    dueAmount: 24500,
    status: 'Partial',
    lastPaymentDate: '05 Aug 2026',
    phone: '+91 98123 45678',
    email: 'priya.s@vidyamaxx.edu.in',
    fatherName: 'Dr. Suresh Sharma',
    motherName: 'Dr. Anita Sharma',
    emergencyPhone: '+91 98123 45679',
    address: 'Flat 502, Prestige Towers, Vasant Kunj, New Delhi - 110070',
    history: [
      {
        receiptNo: 'REC-2026-8802',
        date: '05 Aug 2026, 02:45 PM',
        amount: 3500,
        mode: 'Bank Transfer (NEFT/RTGS)',
        referenceNo: 'HDFC_N009182394',
        payerName: 'Dr. Suresh Sharma',
        payerRelation: 'Father',
        cashier: 'Mr. Arvind Gupta (Bursar)',
        notes: 'Monthly Installment for August cleared via Net Banking.',
        settledPeriod: 'August 2026 Installment',
      },
      {
        receiptNo: 'REC-2026-7201',
        date: '05 Jul 2026, 11:20 AM',
        amount: 3500,
        mode: 'UPI / QR Code (Manual Verify)',
        referenceNo: 'UPI-UTR: 88192019441',
        payerName: 'Dr. Suresh Sharma',
        payerRelation: 'Father',
        cashier: 'Mr. Arvind Gupta (Bursar)',
        notes: 'July Monthly fee paid via GooglePay QR.',
        settledPeriod: 'July 2026 Installment',
      },
    ],
    installments: [
      { monthName: 'April 2026', amount: 3500, dueDate: '05 Apr 2026', isPaid: true, paidDate: '05 Apr 2026', receiptNo: 'REC-2026-4101' },
      { monthName: 'May 2026', amount: 3500, dueDate: '05 May 2026', isPaid: true, paidDate: '05 May 2026', receiptNo: 'REC-2026-5101' },
      { monthName: 'June 2026', amount: 3500, dueDate: '05 Jun 2026', isPaid: true, paidDate: '05 Jun 2026', receiptNo: 'REC-2026-6101' },
      { monthName: 'July 2026', amount: 3500, dueDate: '05 Jul 2026', isPaid: true, paidDate: '05 Jul 2026', receiptNo: 'REC-2026-7201' },
      { monthName: 'August 2026', amount: 3500, dueDate: '05 Aug 2026', isPaid: true, paidDate: '05 Aug 2026', receiptNo: 'REC-2026-8802' },
      { monthName: 'September 2026', amount: 3500, dueDate: '05 Sep 2026', isPaid: false },
      { monthName: 'October 2026', amount: 3500, dueDate: '05 Oct 2026', isPaid: false },
      { monthName: 'November 2026', amount: 3500, dueDate: '05 Nov 2026', isPaid: false },
      { monthName: 'December 2026', amount: 3500, dueDate: '05 Dec 2026', isPaid: false },
      { monthName: 'January 2027', amount: 3500, dueDate: '05 Jan 2027', isPaid: false },
      { monthName: 'February 2027', amount: 3500, dueDate: '05 Feb 2027', isPaid: false },
      { monthName: 'March 2027', amount: 3500, dueDate: '05 Mar 2027', isPaid: false },
    ],
  },
  {
    id: '3',
    studentName: 'Rahul Gupta',
    studentAdmNo: 'ADM-2026-0843',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    class: 'Class 9-B',
    quarter: 'Q2 (Jul – Sep 2026)',
    paymentPlan: 'Monthly Installment',
    monthlyAmount: 3500,
    annualTuition: 42000,
    installmentDueDay: 10,
    nextDueDate: '10 Aug 2026 (Overdue)',
    tuitionFee: 30000,
    labFee: 5000,
    transportFee: 4500,
    activityFee: 2500,
    totalFee: 42000,
    paidAmount: 10500,
    dueAmount: 31500,
    status: 'Overdue',
    lastPaymentDate: '10 Jun 2026',
    phone: '+91 97654 32109',
    email: 'rahul.g@vidyamaxx.edu.in',
    fatherName: 'Mr. Sunil Gupta',
    motherName: 'Mrs. Ritu Gupta',
    emergencyPhone: '+91 97654 32110',
    address: 'House 48, Block C, Sector 62, Noida - 201301',
    history: [
      {
        receiptNo: 'REC-2026-8803',
        date: '10 Jun 2026, 09:40 AM',
        amount: 3500,
        mode: 'Cheque / DD',
        referenceNo: 'CHQ #645210 (SBI New Delhi)',
        payerName: 'Mr. Sunil Gupta',
        payerRelation: 'Father',
        cashier: 'Mr. Arvind Gupta (Bursar)',
        notes: 'Monthly Installment 3 for June cleared.',
        settledPeriod: 'June 2026 Installment',
      },
    ],
    installments: [
      { monthName: 'April 2026', amount: 3500, dueDate: '10 Apr 2026', isPaid: true, paidDate: '10 Apr 2026', receiptNo: 'REC-2026-4103' },
      { monthName: 'May 2026', amount: 3500, dueDate: '10 May 2026', isPaid: true, paidDate: '10 May 2026', receiptNo: 'REC-2026-5103' },
      { monthName: 'June 2026', amount: 3500, dueDate: '10 Jun 2026', isPaid: true, paidDate: '10 Jun 2026', receiptNo: 'REC-2026-8803' },
      { monthName: 'July 2026', amount: 3500, dueDate: '10 Jul 2026', isPaid: false },
      { monthName: 'August 2026', amount: 3500, dueDate: '10 Aug 2026', isPaid: false },
      { monthName: 'September 2026', amount: 3500, dueDate: '10 Sep 2026', isPaid: false },
      { monthName: 'October 2026', amount: 3500, dueDate: '10 Oct 2026', isPaid: false },
      { monthName: 'November 2026', amount: 3500, dueDate: '10 Nov 2026', isPaid: false },
      { monthName: 'December 2026', amount: 3500, dueDate: '10 Dec 2026', isPaid: false },
      { monthName: 'January 2027', amount: 3500, dueDate: '10 Jan 2027', isPaid: false },
      { monthName: 'February 2027', amount: 3500, dueDate: '10 Feb 2027', isPaid: false },
      { monthName: 'March 2027', amount: 3500, dueDate: '10 Mar 2027', isPaid: false },
    ],
  },
  {
    id: '4',
    studentName: 'Kavya Nair',
    studentAdmNo: 'ADM-2026-0844',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    class: 'Class 11-Com',
    quarter: 'Q2 (Jul – Sep 2026)',
    paymentPlan: 'Quarterly',
    monthlyAmount: 4000,
    annualTuition: 48000,
    installmentDueDay: 10,
    nextDueDate: '10 Oct 2026 (Q3 Upcoming)',
    tuitionFee: 34000,
    labFee: 6000,
    transportFee: 5000,
    activityFee: 3000,
    totalFee: 48000,
    paidAmount: 24000,
    dueAmount: 24000,
    status: 'Partial',
    lastPaymentDate: '08 Jul 2026',
    phone: '+91 99887 76655',
    email: 'kavya.n@vidyamaxx.edu.in',
    fatherName: 'Mr. K. R. Nair',
    motherName: 'Mrs. Deepa Nair',
    emergencyPhone: '+91 99887 76656',
    address: 'Villa 12, Palm Meadows, DLF Phase 5, Gurugram - 122002',
    history: [
      {
        receiptNo: 'REC-2026-8804',
        date: '08 Jul 2026, 03:10 PM',
        amount: 12000,
        mode: 'POS Card Swipe',
        referenceNo: 'POS-AUTH #882910 (HDFC POS)',
        payerName: 'Mrs. Deepa Nair',
        payerRelation: 'Mother',
        cashier: 'Mrs. S. Joshi (Cashier)',
        notes: 'Quarter 2 Fee swiped on POS.',
        settledPeriod: 'Q2 (Jul – Sep 2026)',
      },
    ],
    installments: [
      { monthName: 'April 2026', amount: 4000, dueDate: '10 Apr 2026', isPaid: true, paidDate: '10 Apr 2026' },
      { monthName: 'May 2026', amount: 4000, dueDate: '10 May 2026', isPaid: true, paidDate: '10 Apr 2026' },
      { monthName: 'June 2026', amount: 4000, dueDate: '10 Jun 2026', isPaid: true, paidDate: '10 Apr 2026' },
      { monthName: 'July 2026', amount: 4000, dueDate: '10 Jul 2026', isPaid: true, paidDate: '08 Jul 2026', receiptNo: 'REC-2026-8804' },
      { monthName: 'August 2026', amount: 4000, dueDate: '10 Aug 2026', isPaid: true, paidDate: '08 Jul 2026', receiptNo: 'REC-2026-8804' },
      { monthName: 'September 2026', amount: 4000, dueDate: '10 Sep 2026', isPaid: true, paidDate: '08 Jul 2026', receiptNo: 'REC-2026-8804' },
      { monthName: 'October 2026', amount: 4000, dueDate: '10 Oct 2026', isPaid: false },
      { monthName: 'November 2026', amount: 4000, dueDate: '10 Nov 2026', isPaid: false },
      { monthName: 'December 2026', amount: 4000, dueDate: '10 Dec 2026', isPaid: false },
      { monthName: 'January 2027', amount: 4000, dueDate: '10 Jan 2027', isPaid: false },
      { monthName: 'February 2027', amount: 4000, dueDate: '10 Feb 2027', isPaid: false },
      { monthName: 'March 2027', amount: 4000, dueDate: '10 Mar 2027', isPaid: false },
    ],
  },
  {
    id: '5',
    studentName: 'Ishaan Malhotra',
    studentAdmNo: 'ADM-2026-0845',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    class: 'Class 11-Sci',
    quarter: 'Q2 (Jul – Sep 2026)',
    paymentPlan: 'Monthly Installment',
    monthlyAmount: 4333,
    annualTuition: 52000,
    installmentDueDay: 1,
    nextDueDate: '01 May 2026 (Overdue 4 Months)',
    tuitionFee: 36000,
    labFee: 8000,
    transportFee: 5000,
    activityFee: 3000,
    totalFee: 52000,
    paidAmount: 4333,
    dueAmount: 47667,
    status: 'Overdue',
    lastPaymentDate: '01 Apr 2026',
    phone: '+91 98234 56789',
    email: 'ishaan.m@vidyamaxx.edu.in',
    fatherName: 'Mr. Vivek Malhotra',
    motherName: 'Mrs. Preeti Malhotra',
    emergencyPhone: '+91 98234 56790',
    address: 'D-804, Express Greens, Sector 1, Greater Noida West - 201306',
    history: [
      {
        receiptNo: 'REC-2026-3918',
        date: '01 Apr 2026, 12:00 PM',
        amount: 4333,
        mode: 'Cash at Counter',
        referenceNo: 'CASH-SLIP #0981',
        payerName: 'Mr. Vivek Malhotra',
        payerRelation: 'Father',
        cashier: 'Mr. Arvind Gupta (Bursar)',
        notes: 'April 2026 Installment settled.',
        settledPeriod: 'April 2026 Installment',
      },
    ],
    installments: [
      { monthName: 'April 2026', amount: 4333, dueDate: '01 Apr 2026', isPaid: true, paidDate: '01 Apr 2026', receiptNo: 'REC-2026-3918' },
      { monthName: 'May 2026', amount: 4333, dueDate: '01 May 2026', isPaid: false },
      { monthName: 'June 2026', amount: 4333, dueDate: '01 Jun 2026', isPaid: false },
      { monthName: 'July 2026', amount: 4333, dueDate: '01 Jul 2026', isPaid: false },
      { monthName: 'August 2026', amount: 4333, dueDate: '01 Aug 2026', isPaid: false },
      { monthName: 'September 2026', amount: 4333, dueDate: '01 Sep 2026', isPaid: false },
      { monthName: 'October 2026', amount: 4333, dueDate: '01 Oct 2026', isPaid: false },
      { monthName: 'November 2026', amount: 4333, dueDate: '01 Nov 2026', isPaid: false },
      { monthName: 'December 2026', amount: 4333, dueDate: '01 Dec 2026', isPaid: false },
      { monthName: 'January 2027', amount: 4333, dueDate: '01 Jan 2027', isPaid: false },
      { monthName: 'February 2027', amount: 4333, dueDate: '01 Feb 2027', isPaid: false },
      { monthName: 'March 2027', amount: 4333, dueDate: '01 Mar 2027', isPaid: false },
    ],
  },
  {
    id: '6',
    studentName: 'Ananya Sen',
    studentAdmNo: 'ADM-2026-0846',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    class: 'Class 9-B',
    quarter: 'Q2 (Jul – Sep 2026)',
    paymentPlan: 'Annual Full',
    monthlyAmount: 3500,
    annualTuition: 42000,
    installmentDueDay: 15,
    nextDueDate: '15 Apr 2027 (Annual Cleared)',
    tuitionFee: 30000,
    labFee: 5000,
    transportFee: 4500,
    activityFee: 2500,
    totalFee: 42000,
    paidAmount: 42000,
    dueAmount: 0,
    status: 'Paid',
    lastPaymentDate: '15 Apr 2026',
    phone: '+91 97111 22334',
    email: 'ananya.sen@vidyamaxx.edu.in',
    fatherName: 'Mr. Anirban Sen',
    motherName: 'Mrs. Sharmila Sen',
    emergencyPhone: '+91 97111 22335',
    address: 'Flat 12B, Alaknanda Apartments, Kalkaji, New Delhi - 110019',
    history: [
      {
        receiptNo: 'REC-2026-2109',
        date: '15 Apr 2026, 10:00 AM',
        amount: 42000,
        mode: 'Bank Transfer (NEFT/RTGS)',
        referenceNo: 'NEFT-SBI-88192019',
        payerName: 'Mr. Anirban Sen',
        payerRelation: 'Father',
        cashier: 'Mr. Arvind Gupta (Bursar)',
        notes: 'Full Annual Tuition Settled upfront.',
        settledPeriod: 'Full Academic Year 2026–2027',
      },
    ],
    installments: [
      { monthName: 'April 2026', amount: 3500, dueDate: '15 Apr 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { monthName: 'May 2026', amount: 3500, dueDate: '15 May 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { monthName: 'June 2026', amount: 3500, dueDate: '15 Jun 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { monthName: 'July 2026', amount: 3500, dueDate: '15 Jul 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { monthName: 'August 2026', amount: 3500, dueDate: '15 Aug 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { monthName: 'September 2026', amount: 3500, dueDate: '15 Sep 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { monthName: 'October 2026', amount: 3500, dueDate: '15 Oct 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { monthName: 'November 2026', amount: 3500, dueDate: '15 Nov 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { monthName: 'December 2026', amount: 3500, dueDate: '15 Dec 2026', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { monthName: 'January 2027', amount: 3500, dueDate: '15 Jan 2027', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { monthName: 'February 2027', amount: 3500, dueDate: '15 Feb 2027', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
      { monthName: 'March 2027', amount: 3500, dueDate: '15 Mar 2027', isPaid: true, paidDate: '15 Apr 2026', receiptNo: 'REC-2026-2109' },
    ],
  },
];

type PaymentModeType =
  | 'Cash at Counter'
  | 'Cheque / DD'
  | 'UPI / QR Code (Manual Verify)'
  | 'Bank Transfer (NEFT/RTGS)'
  | 'POS Card Swipe';

type PaymentFilterType = 'all' | 'due' | 'cleared' | 'overdue';

function FeesPage() {
  const { addNotification } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  React.useEffect(() => { document.title = t('page.fees') + ' \u2013 VidyaMaxx'; }, [t]);
  const [feeList, setFeeList] = React.useState<FeeRecord[]>(INITIAL_FEES);
  const [selectedFeeIndex, setSelectedFeeIndex] = React.useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
  const [drawerActiveTab, setDrawerActiveTab] = React.useState<'pay' | 'structure' | 'history' | 'scholarship'>('pay');

  // Filters State (Single quick filter)
  const [statusFilter, setStatusFilter] = React.useState<PaymentFilterType>('all');

  // Bulk Reminders Modal State
  const [isReminderModalOpen, setIsReminderModalOpen] = React.useState<boolean>(false);
  const [reminderAudience, setReminderAudience] = React.useState<'all_due' | 'overdue_only' | 'monthly_only'>('all_due');
  const [reminderChannel, setReminderChannel] = React.useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [customReminderMsg, setCustomReminderMsg] = React.useState<string>(
    'Dear Parent, gentle reminder from VidyaMaxx Academy that your ward {StudentName}\'s {PaymentPlan} fee of ₹{DueAmount} is due on {DueDate}. Please scan school QR or pay at fee counter. Pay link: https://vidyamaxx.edu/pay/{AdmNo}'
  );

  // Active Payment Form State
  const [settlementOption, setSettlementOption] = React.useState<'annual_full' | 'selected_months' | 'custom'>('annual_full');
  const [selectedMonthsToPay, setSelectedMonthsToPay] = React.useState<string[]>([]);
  const [paymentAmount, setPaymentAmount] = React.useState<string>('');
  const [selectedMode, setSelectedMode] = React.useState<PaymentModeType>('Cash at Counter');

  // Payer identity state (Who came to pay)
  const [payerType, setPayerType] = React.useState<'Father' | 'Mother' | 'Student' | 'Other'>('Father');
  const [customPayerName, setCustomPayerName] = React.useState('');
  const [customPayerPhone, setCustomPayerPhone] = React.useState('');
  const [customPayerRelation, setCustomPayerRelation] = React.useState('Guardian Representative');

  // Mode-specific fields
  const [chequeNumber, setChequeNumber] = React.useState('');
  const [bankName, setBankName] = React.useState('');
  const [utrNumber, setUtrNumber] = React.useState('');
  const [isManualVerified, setIsManualVerified] = React.useState(true);
  const [cashierName, setCashierName] = React.useState('Mr. Arvind Gupta (Bursar)');
  const [paymentRemarks, setPaymentRemarks] = React.useState('');
  const [sendReceiptSMS, setSendReceiptSMS] = React.useState(true);
  const [copiedText, setCopiedText] = React.useState(false);

  // Filtered List (Single Quick Filter)
  const filteredFeeList = React.useMemo(() => {
    return feeList.filter((f) => {
      if (statusFilter === 'due' && f.dueAmount === 0) return false;
      if (statusFilter === 'cleared' && f.dueAmount > 0) return false;
      if (statusFilter === 'overdue' && f.status !== 'Overdue') return false;
      return true;
    });
  }, [feeList, statusFilter]);

  const activeStudent =
    selectedFeeIndex !== null && selectedFeeIndex >= 0 && selectedFeeIndex < feeList.length
      ? feeList[selectedFeeIndex]
      : null;

  const openStudentFeeDrawer = (fee: FeeRecord, defaultTab: 'pay' | 'structure' | 'history' = 'pay') => {
    const idx = feeList.findIndex((f) => f.id === fee.id);
    setSelectedFeeIndex(idx >= 0 ? idx : 0);
    setDrawerActiveTab(fee.dueAmount > 0 ? defaultTab : 'history');
    
    // Auto-select initial months or full due
    if (fee.paymentPlan === 'Annual Full') {
      setSettlementOption('annual_full');
      setPaymentAmount(String(fee.dueAmount));
      setSelectedMonthsToPay([]);
    } else {
      setSettlementOption('selected_months');
      const unpaid = fee.installments.filter((i) => !i.isPaid).map((i) => i.monthName);
      // Select first unpaid month by default
      const initialMonth = unpaid.slice(0, 1);
      setSelectedMonthsToPay(initialMonth);
      setPaymentAmount(String(initialMonth.length * fee.monthlyAmount));
    }

    setPayerType('Father');
    setCustomPayerName('');
    setCustomPayerPhone('');
    setChequeNumber('');
    setUtrNumber('');
    setPaymentRemarks('');
    setIsDrawerOpen(true);
  };

  // Deep-link Support: Auto-open student fee drawer if ?student= or ?search= is passed in URL
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const searchTarget = params.get('student') || params.get('adm') || params.get('search') || params.get('name');
      if (searchTarget) {
        const query = searchTarget.toLowerCase().trim();
        const matchIdx = feeList.findIndex(
          (f) =>
            f.studentAdmNo.toLowerCase().includes(query) ||
            f.studentName.toLowerCase().includes(query) ||
            query.includes(f.studentName.toLowerCase())
        );
        if (matchIdx !== -1) {
          openStudentFeeDrawer(feeList[matchIdx], feeList[matchIdx].dueAmount > 0 ? 'pay' : 'history');
        }
      }
    } catch {
      // Safe fallback
    }
  }, []);

  const handleMonthToggle = (monthName: string) => {
    if (!activeStudent) return;
    let nextSelected: string[];
    if (selectedMonthsToPay.includes(monthName)) {
      nextSelected = selectedMonthsToPay.filter((m) => m !== monthName);
    } else {
      nextSelected = [...selectedMonthsToPay, monthName];
    }
    setSelectedMonthsToPay(nextSelected);
    setPaymentAmount(String(nextSelected.length * activeStudent.monthlyAmount));
  };

  const handleSelectSettlementOption = (opt: 'annual_full' | 'selected_months' | 'custom') => {
    if (!activeStudent) return;
    setSettlementOption(opt);
    if (opt === 'annual_full') {
      setPaymentAmount(String(activeStudent.dueAmount));
      setSelectedMonthsToPay([]);
    } else if (opt === 'selected_months') {
      const unpaid = activeStudent.installments.filter((i) => !i.isPaid).map((i) => i.monthName);
      const firstOne = unpaid.slice(0, 1);
      setSelectedMonthsToPay(firstOne);
      setPaymentAmount(String(firstOne.length * activeStudent.monthlyAmount));
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('vidyamaxx.fees@icici');
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleConfirmPayment = () => {
    if (selectedFeeIndex === null || !activeStudent) return;
    const amount = Number(paymentAmount) || 0;
    if (amount <= 0) {
      alert('Please enter a valid payment amount greater than zero.');
      return;
    }

    // Determine payer identity
    let finalPayerName = activeStudent.fatherName;
    let finalPayerRelation = 'Father';
    if (payerType === 'Mother') {
      finalPayerName = activeStudent.motherName;
      finalPayerRelation = 'Mother';
    } else if (payerType === 'Student') {
      finalPayerName = activeStudent.studentName;
      finalPayerRelation = 'Student Self';
    } else if (payerType === 'Other') {
      finalPayerName = customPayerName || 'Guardian Representative';
      finalPayerRelation = customPayerRelation || 'Other Relative';
    }

    let referenceNo = '';
    if (selectedMode === 'Cash at Counter') {
      referenceNo = `CASH-REC #${Math.floor(1000 + Math.random() * 9000)}`;
    } else if (selectedMode === 'Cheque / DD') {
      referenceNo = `CHQ #${chequeNumber || '482910'} (${bankName})`;
    } else if (selectedMode === 'UPI / QR Code (Manual Verify)') {
      referenceNo = `UPI-UTR: ${utrNumber || '9918' + Math.floor(10000000 + Math.random() * 90000000)} ${isManualVerified ? '(Verified)' : '(Pending)'}`;
    } else if (selectedMode === 'Bank Transfer (NEFT/RTGS)') {
      referenceNo = `NEFT-UTR: ${utrNumber || 'NEFT' + Math.floor(10000000 + Math.random() * 90000000)}`;
    } else {
      referenceNo = `POS-AUTH #${Math.floor(100000 + Math.random() * 900000)}`;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

    let settledPeriodLabel = '';
    if (settlementOption === 'annual_full') {
      settledPeriodLabel = 'Full Annual Tuition Settled';
    } else if (selectedMonthsToPay.length > 0) {
      settledPeriodLabel = selectedMonthsToPay.join(', ');
    } else {
      settledPeriodLabel = `Partial Assessment Settlement (₹${amount.toLocaleString('en-IN')})`;
    }

    const newReceipt: PaymentReceipt = {
      receiptNo: `REC-2026-${Math.floor(8810 + Math.random() * 1000)}`,
      date: `${dateStr}, ${timeStr}`,
      amount: amount,
      mode: selectedMode,
      referenceNo: referenceNo,
      payerName: finalPayerName,
      payerRelation: finalPayerRelation,
      cashier: cashierName,
      notes: paymentRemarks || `Deposit by ${finalPayerName} (${finalPayerRelation}) for ${settledPeriodLabel}.`,
      settledPeriod: settledPeriodLabel,
    };

    // Update installments if monthly
    const updatedInstallments = activeStudent.installments.map((inst) => {
      if (settlementOption === 'annual_full' || selectedMonthsToPay.includes(inst.monthName)) {
        return {
          ...inst,
          isPaid: true,
          paidDate: dateStr,
          receiptNo: newReceipt.receiptNo,
        };
      }
      return inst;
    });

    const newPaid = activeStudent.paidAmount + amount;
    const newDue = Math.max(0, activeStudent.totalFee - newPaid);

    const updated = [...feeList];
    updated[selectedFeeIndex] = {
      ...activeStudent,
      paidAmount: newPaid,
      dueAmount: newDue,
      status: newDue === 0 ? 'Paid' : 'Partial',
      lastPaymentDate: `${dateStr}`,
      history: [newReceipt, ...activeStudent.history],
      installments: updatedInstallments,
      nextDueDate: newDue === 0 ? 'Cleared for Academic Year 2026–2027' : activeStudent.nextDueDate,
    };

    setFeeList(updated);
    setDrawerActiveTab('history');
    addNotification({
      title: 'Payment Recorded & Receipt Issued',
      description: `Collected ₹${amount.toLocaleString('en-IN')} (${settledPeriodLabel}) from ${finalPayerName} for ${activeStudent.studentName}. Receipt #${newReceipt.receiptNo} created.${sendReceiptSMS ? ' WhatsApp & SMS receipt sent.' : ''}`,
      type: 'success',
    });
  };

  const handleSendIndividualReminder = (student: FeeRecord) => {
    addNotification({
      title: 'Payment Reminder Dispatched',
      description: `WhatsApp & SMS reminder sent to ${student.fatherName} (${student.phone}) for outstanding due of ₹${student.dueAmount.toLocaleString('en-IN')}.`,
      type: 'success',
    });
  };

  const handleDispatchBulkReminders = () => {
    let targetStudents = feeList.filter((f) => f.dueAmount > 0);
    if (reminderAudience === 'overdue_only') {
      targetStudents = feeList.filter((f) => f.status === 'Overdue');
    } else if (reminderAudience === 'monthly_only') {
      targetStudents = feeList.filter((f) => f.paymentPlan === 'Monthly Installment' && f.dueAmount > 0);
    }

    setIsReminderModalOpen(false);
    addNotification({
      title: 'Bulk Fee Reminders Dispatched',
      description: `Successfully sent ${targetStudents.length} automated payment reminders via ${reminderChannel.toUpperCase()} with dynamic UPI payment links.`,
      type: 'success',
    });
  };

  const handlePrevStudent = () => {
    if (selectedFeeIndex !== null && selectedFeeIndex > 0) {
      const prev = feeList[selectedFeeIndex - 1];
      openStudentFeeDrawer(prev, prev.dueAmount > 0 ? 'pay' : 'history');
    }
  };

  const handleNextStudent = () => {
    if (selectedFeeIndex !== null && selectedFeeIndex < feeList.length - 1) {
      const next = feeList[selectedFeeIndex + 1];
      openStudentFeeDrawer(next, next.dueAmount > 0 ? 'pay' : 'history');
    }
  };

  const feeColumns = [
    {
      header: isHindi ? 'स्टूडेंट डिटेल्स' : 'Student & Admission No',
      accessorKey: 'studentName',
      cell: (r: FeeRecord) => (
        <div className="flex items-center gap-3">
          <div className="relative overflow-hidden rounded-[4px] border border-border/80 shadow-xs w-10 h-[50px] shrink-0 bg-muted flex items-center justify-center">
            <img
              src={r.photoUrl}
              alt={r.studentName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-extrabold text-foreground text-sm leading-tight">{r.studentName}</p>
            <p className="text-xs text-muted-foreground font-semibold mt-0.5">
              {r.class} · <span className="font-mono text-zinc-400 font-semibold">{r.studentAdmNo}</span>
            </p>
          </div>
        </div>
      ),
    },
    {
      header: isHindi ? 'पेमेंट प्लान & ड्यू डेट' : 'Payment Plan & Due Day',
      accessorKey: 'paymentPlan',
      cell: (r: FeeRecord) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <VFBadge
              variant={r.paymentPlan === 'Annual Full' ? 'success' : r.paymentPlan === 'Monthly Installment' ? 'primary' : 'outline'}
              className="text-[10px] font-bold rounded-[4px]"
            >
              {r.paymentPlan === 'Annual Full' ? (isHindi ? 'एनुअल लम्पसम' : r.paymentPlan) : r.paymentPlan === 'Monthly Installment' ? (isHindi ? 'मंथली इंस्टॉलमेंट' : r.paymentPlan) : r.paymentPlan}
            </VFBadge>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">
            {r.paymentPlan === 'Annual Full'
              ? `₹${r.annualTuition.toLocaleString('en-IN')}/${isHindi ? 'साल' : 'yr'}`
              : `₹${r.monthlyAmount.toLocaleString('en-IN')}/${isHindi ? 'मंथ' : 'mo'} (${isHindi ? 'ड्यू' : 'Due'} ${r.installmentDueDay}th)`}
          </p>
        </div>
      ),
    },
    {
      header: isHindi ? 'नेक्स्ट इंस्टॉलमेंट डेट' : 'Next Installment Due',
      accessorKey: 'nextDueDate',
      cell: (r: FeeRecord) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs font-semibold">
            {r.status === 'Paid' ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> {isHindi ? 'एनुअल क्लीयर' : 'Annual Cleared'}
              </span>
            ) : r.status === 'Overdue' ? (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {r.nextDueDate}
              </span>
            ) : (
              <span className="text-zinc-300 font-medium flex items-center gap-1">
                <Clock className="h-3 w-3 text-amber-400" /> {r.nextDueDate}
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground">
            {r.status === 'Paid' ? (isHindi ? 'कोई पेंडिंग इंस्टॉलमेंट नहीं' : 'No pending installments') : (isHindi ? 'ग्रेस पीरियड लागू' : 'Subject to grace period')}
          </p>
        </div>
      ),
    },
    {
      header: t('fees.total'),
      accessorKey: 'totalFee',
      cell: (r: FeeRecord) => (
        <span className="font-mono font-bold text-foreground text-xs">
          ₹{r.totalFee.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: t('fees.paid'),
      accessorKey: 'paidAmount',
      cell: (r: FeeRecord) => (
        <span className="font-mono font-semibold text-emerald-400 text-xs">
          ₹{r.paidAmount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: isHindi ? 'पेंडिंग ड्यू' : 'Pending Due',
      accessorKey: 'dueAmount',
      cell: (r: FeeRecord) => (
        <span
          className={cn(
            'font-mono font-bold text-xs',
            r.dueAmount === 0 ? 'text-emerald-400 font-black' : 'text-rose-400'
          )}
        >
          {r.dueAmount === 0 ? (isHindi ? '₹0 (क्लीयर)' : '₹0 (Cleared)') : `₹${r.dueAmount.toLocaleString('en-IN')}`}
        </span>
      ),
    },
    {
      header: t('col.status'),
      accessorKey: 'status',
      align: 'center',
      cell: (r: FeeRecord) => (
        <VFBadge
          variant={r.status === 'Paid' ? 'success' : r.status === 'Partial' ? 'warning' : 'danger'}
          className="rounded-[4px]"
        >
          {r.status === 'Paid' ? (isHindi ? 'पेड' : 'Paid') : r.status === 'Partial' ? (isHindi ? 'पार्शियल' : 'Partial') : (isHindi ? 'ओवरड्यू' : 'Overdue')}
        </VFBadge>
      ),
    },
    {
      header: t('col.action'),
      accessorKey: 'action',
      align: 'center',
      cell: (r: FeeRecord) => (
        <div className="flex items-center gap-1.5 justify-center mx-auto">
          {r.dueAmount > 0 ? (
            <VFButton
              size="icon"
              className="h-7 w-7 bg-emerald-600 hover:bg-emerald-500 text-white border-0 shadow-xs rounded-[4px] shrink-0"
              title={t('action.payNow')}
              aria-label={t('action.payNow')}
              onClick={() => openStudentFeeDrawer(r, 'pay')}
            >
              <CreditCard className="h-3.5 w-3.5" />
            </VFButton>
          ) : (
            <VFButton
              size="icon"
              variant="outline"
              className="h-7 w-7 bg-[#1a1a1a] hover:bg-[#222222] border-border text-foreground rounded-[4px] shrink-0"
              title={t('col.receipt')}
              aria-label={t('col.receipt')}
              onClick={() => openStudentFeeDrawer(r, 'history')}
            >
              <Receipt className="h-3.5 w-3.5" />
            </VFButton>
          )}

          {r.dueAmount > 0 && (
            <button
              type="button"
              title={isHindi ? "व्हाट्सएप पेमेंट रिमाइंडर भेजें" : "Send WhatsApp Payment Reminder"}
              aria-label={isHindi ? "व्हाट्सएप पेमेंट रिमाइंडर भेजें" : "Send WhatsApp Payment Reminder"}
              onClick={() => handleSendIndividualReminder(r)}
              className="h-7 w-7 rounded-[4px] bg-[#1a1a1a] hover:bg-[#242424] border border-border flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-colors shrink-0 cursor-pointer"
            >
              <Bell className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const dueCount = feeList.filter((f) => f.dueAmount > 0).length;
  const clearedCount = feeList.filter((f) => f.dueAmount === 0).length;
  const overdueCount = feeList.filter((f) => f.status === 'Overdue').length;

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* Master Fees Ledger Table with Integrated Single-Line Filters & Actions */}
      <VFDataTable
        columns={feeColumns}
        data={filteredFeeList}
        filterPlaceholder="Search by student name, admission number, or contact phone..."
        rightActions={
          <div className="flex items-center gap-2">
            <VFSelect
              size="sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(String(e.target.value) as any)}
              options={[
                { value: 'all', label: `${t('action.all')} (${feeList.length})` },
                { value: 'due', label: `${t('status.due')} (${dueCount})` },
                { value: 'cleared', label: `${t('status.paid')} (${clearedCount})` },
                { value: 'overdue', label: `${t('status.overdue')} (${overdueCount})` },
              ]}
              className="w-44 text-xs bg-[#181818] border-border rounded-[4px]"
            />
            <VFButton
              variant="outline"
              size="sm"
              className="bg-[#181818] hover:bg-[#222222] border-border text-foreground rounded-[4px] text-xs font-bold"
              leftIcon={<Bell className="h-4 w-4 text-emerald-400" />}
              onClick={() => setIsReminderModalOpen(true)}
            >
              {t('action.sendReminder')} ({dueCount})
            </VFButton>
            <VFButton
              variant="outline"
              size="sm"
              className="rounded-[4px]"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={() => addNotification({ title: 'Exporting Fees', description: 'Student fee ledger exported as CSV.', type: 'success' })}
            >
              {t('action.export')}
            </VFButton>
          </div>
        }
      />

      {/* 4. BULK FEE REMINDERS MODAL */}
      <VFDialog
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        title="Broadcast Automated Fee Payment Reminders"
        description="Dispatch automated WhatsApp / SMS reminders with instant UPI payment links to parents with outstanding dues."
        className="max-w-xl"
      >
        <div className="space-y-4 pt-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Target Recipient Cohort</label>
              <VFSelect
                value={reminderAudience}
                onChange={(e) => setReminderAudience(String(e.target.value) as any)}
                options={[
                  { label: `All Students with Dues (${dueCount} Students)`, value: 'all_due' },
                  { label: `Critical Overdue Only (${overdueCount} Students)`, value: 'overdue_only' },
                  { label: 'Monthly Installment Payers with Dues', value: 'monthly_only' },
                ]}
                className="bg-[#1a1a1a] border-border h-9 text-xs rounded-[4px]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-foreground">Delivery Channel</label>
              <VFSelect
                value={reminderChannel}
                onChange={(e) => setReminderChannel(String(e.target.value) as any)}
                options={[
                  { label: 'WhatsApp Official Business API (High Open Rate)', value: 'whatsapp' },
                  { label: 'Fast2SMS Gateway (Direct SMS)', value: 'sms' },
                  { label: 'Official Institutional Email', value: 'email' },
                ]}
                className="bg-[#1a1a1a] border-border h-9 text-xs rounded-[4px]"
              />
            </div>
          </div>

          {/* Template Message Box */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground flex items-center justify-between">
              <span>Personalized Message Template</span>
              <span className="text-[10px] text-muted-foreground font-mono">Dynamic Tags Supported</span>
            </label>
            <textarea
              value={customReminderMsg}
              onChange={(e) => setCustomReminderMsg(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-[4px] bg-[#141414] border border-border text-foreground font-mono text-xs focus:outline-none focus:border-zinc-500"
            />
            <div className="flex items-center gap-1 flex-wrap text-[10px] text-zinc-400">
              <span className="bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-border/80">{'{ParentName}'}</span>
              <span className="bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-border/80">{'{StudentName}'}</span>
              <span className="bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-border/80">{'{DueAmount}'}</span>
              <span className="bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-border/80">{'{DueDate}'}</span>
              <span className="bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-border/80">{'{PaymentPlan}'}</span>
            </div>
          </div>

          {/* Live Preview WhatsApp Bubble */}
          <div className="p-3.5 rounded-[4px] bg-[#0d1418] border border-emerald-900/40 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Sample Live WhatsApp Preview (Rahul Gupta)
              </span>
              <span className="text-[10px] text-zinc-400">Recipient: +91 97654 32109</span>
            </div>
            <div className="p-2.5 rounded-[4px] bg-[#005c4b]/30 border border-[#005c4b]/50 text-foreground text-xs leading-relaxed space-y-1">
              <p>
                Dear <span className="font-bold text-white">Mr. Sunil Gupta</span>, gentle reminder from <span className="font-bold text-emerald-400">VidyaMaxx Academy</span> that your ward <span className="font-bold text-white">Rahul Gupta</span> (ADM-2026-0843)'s Monthly Installment fee of <span className="font-mono font-bold text-emerald-300">₹31,500</span> is due on <span className="font-bold text-amber-300">10 Aug 2026</span>.
              </p>
              <p className="text-[11px] text-zinc-300 pt-0.5">
                Please scan the school UPI QR at <span className="underline text-emerald-300 font-mono">https://vidyamaxx.edu/pay/ADM-2026-0843</span> or clear dues at the front fee counter.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              Will dispatch to <span className="font-bold text-foreground">{dueCount} student families</span>.
            </span>
            <div className="flex items-center gap-2">
              <VFButton variant="outline" size="sm" onClick={() => setIsReminderModalOpen(false)} className="rounded-[4px]">
                Cancel
              </VFButton>
              <VFButton
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-[4px] font-bold"
                leftIcon={<Send className="h-4 w-4" />}
                onClick={handleDispatchBulkReminders}
              >
                Dispatch Reminders Now
              </VFButton>
            </div>
          </div>
        </div>
      </VFDialog>

      {/* 5. 360° STUDENT FEE & PAYMENT DRAWER */}
      <VFDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        hideHeader={true}
        title={activeStudent ? `${activeStudent.studentName} Fee Portal` : 'Student Fee Portal'}
        className="w-[980px] max-w-[96vw] sm:max-w-4xl lg:max-w-5xl rounded-none sm:rounded-l-md"
        bodyClassName="p-0 flex flex-col h-full bg-[#111111]"
        footerActions={
          <div className="flex items-center justify-between w-full gap-3 flex-wrap">
            {/* Stepper Navigation */}
            <div className="flex items-center gap-1.5 bg-[#1a1a1a] p-1 rounded-[4px] border border-border">
              <button
                type="button"
                onClick={handlePrevStudent}
                disabled={selectedFeeIndex === 0}
                className="p-1.5 rounded-[4px] text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#222222] transition-colors"
                title="Previous Student"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-mono font-bold px-3 text-foreground select-none">
                {selectedFeeIndex !== null ? selectedFeeIndex + 1 : 1} of {feeList.length}
              </span>
              <button
                type="button"
                onClick={handleNextStudent}
                disabled={selectedFeeIndex === feeList.length - 1}
                className="p-1.5 rounded-[4px] text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#222222] transition-colors"
                title="Next Student"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Close */}
            <div className="flex items-center gap-2">
              <VFButton
                variant="outline"
                size="sm"
                className="rounded-[4px]"
                onClick={() => setIsDrawerOpen(false)}
              >
                Close
              </VFButton>
            </div>
          </div>
        }
      >
        {activeStudent && (
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar">
            {/* 1. Header Identity Banner with Optimized Layout & Structured Info Grid */}
            <div className="p-4 bg-[#141414] border-b border-border/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shrink-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
                <div
                  className="relative overflow-hidden rounded-[4px] border border-border/90 shadow-sm w-24 sm:w-28 bg-muted flex items-center justify-center shrink-0"
                  style={{ aspectRatio: '19.5 / 25' }}
                >
                  <img
                    src={activeStudent.photoUrl}
                    alt={activeStudent.studentName}
                    style={{ aspectRatio: '19.5 / 25' }}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#141414] ring-2 ring-emerald-500/20" title="Active Student" />
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-extrabold text-foreground tracking-tight">{activeStudent.studentName}</h3>
                    <VFBadge variant="outline" className="font-mono text-zinc-300 font-bold text-[11px] bg-[#1a1a1a] border-border rounded-[4px]">
                      {activeStudent.studentAdmNo}
                    </VFBadge>
                    <VFBadge variant="primary" className="text-[10px] font-bold rounded-[4px]">
                      {activeStudent.paymentPlan}
                    </VFBadge>
                    <VFBadge variant={activeStudent.status === 'Paid' ? 'success' : activeStudent.status === 'Partial' ? 'warning' : 'danger'} className="rounded-[4px]">
                      {activeStudent.status}
                    </VFBadge>
                  </div>

                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 truncate">
                    <GraduationCap className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <span className="text-foreground font-semibold">{activeStudent.class}</span>
                    <span className="text-zinc-600">·</span>
                    <span>{activeStudent.quarter}</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <User className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">Father: <strong className="text-foreground font-semibold">{activeStudent.fatherName}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <User className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">Mother: <strong className="text-foreground font-semibold">{activeStudent.motherName}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span>Contact: <strong className="font-mono text-foreground">{activeStudent.phone}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span>Next Due: <strong className="text-foreground font-semibold">{activeStudent.nextDueDate}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Outstanding Due Display */}
              <div className="p-3.5 rounded-[4px] bg-[#181818] border border-border/80 flex flex-col justify-center text-right shrink-0 min-w-[200px] shadow-xs">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Outstanding Due</span>
                <span className={cn('text-2xl font-black font-mono mt-0.5 block', activeStudent.dueAmount === 0 ? 'text-emerald-400' : 'text-rose-400')}>
                  {activeStudent.dueAmount === 0 ? '₹0 (Cleared)' : `₹${activeStudent.dueAmount.toLocaleString('en-IN')}`}
                </span>
                <span className="text-[11px] text-muted-foreground font-semibold mt-0.5">Total Fee: ₹{activeStudent.totalFee.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* 2. Drawer Tab Switchers */}
            <div className="px-4 pt-2.5 pb-2 bg-[#141414] border-b border-border/70 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-[4px] border border-border/70 flex-wrap">
                <button
                  type="button"
                  onClick={() => setDrawerActiveTab('pay')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-[4px] transition-colors flex items-center gap-1.5 ${
                    drawerActiveTab === 'pay'
                      ? 'bg-[#222222] text-foreground shadow-xs border border-border/80'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                  {activeStudent.dueAmount > 0 ? 'Pay Fee' : 'Advance Deposit'}
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerActiveTab('history')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-[4px] transition-colors flex items-center gap-1.5 ${
                    drawerActiveTab === 'history'
                      ? 'bg-[#222222] text-foreground shadow-xs border border-border/80'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <History className="h-3.5 w-3.5 text-zinc-400" />
                  Past Receipts ({activeStudent.history.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerActiveTab('structure')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-[4px] transition-colors flex items-center gap-1.5 ${
                    drawerActiveTab === 'structure'
                      ? 'bg-[#222222] text-foreground shadow-xs border border-border/80'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FileCheck className="h-3.5 w-3.5 text-zinc-400" />
                  12-Month Plan
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerActiveTab('scholarship')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-[4px] transition-colors flex items-center gap-1.5 ${
                    drawerActiveTab === 'scholarship'
                      ? 'bg-[#222222] text-foreground shadow-xs border border-border/80'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Award className="h-3.5 w-3.5 text-amber-400" />
                  Scholarship / Waiver
                </button>
              </div>
            </div>

            {/* 3. Tab Contents */}
            <div className="p-4 space-y-3.5 flex-1">
              {/* ─── TAB 1: COLLECT FEE / PAY NOW ─── */}
              {drawerActiveTab === 'pay' && (
                <div className="space-y-3.5 animate-fade-in">
                  {/* Option: Settle Full Annual Tuition OR Monthly Installments */}
                  <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                        1. Select What to Pay
                      </h4>
                      <span className="text-[11px] text-muted-foreground">Plan: <span className="font-bold text-foreground">{activeStudent.paymentPlan}</span></span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectSettlementOption('annual_full')}
                        className={`p-2.5 rounded-[4px] border text-left transition-all space-y-1 cursor-pointer ${
                          settlementOption === 'annual_full'
                            ? 'bg-[#222222] border-zinc-500 text-foreground shadow-xs'
                            : 'bg-[#1a1a1a] border-border/70 text-muted-foreground hover:border-border hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-emerald-400">Full Year Fee</span>
                          {settlementOption === 'annual_full' && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                        </div>
                        <p className="text-xs font-bold text-foreground">Pay Full Due</p>
                        <p className="text-[10px] text-muted-foreground font-mono font-bold">₹{activeStudent.dueAmount.toLocaleString('en-IN')}</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectSettlementOption('selected_months')}
                        className={`p-2.5 rounded-[4px] border text-left transition-all space-y-1 cursor-pointer ${
                          settlementOption === 'selected_months'
                            ? 'bg-[#222222] border-zinc-500 text-foreground shadow-xs'
                            : 'bg-[#1a1a1a] border-border/70 text-muted-foreground hover:border-border hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-primary">Monthly Fees</span>
                          {settlementOption === 'selected_months' && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                        </div>
                        <p className="text-xs font-bold text-foreground">Choose Months</p>
                        <p className="text-[10px] text-muted-foreground font-mono font-bold">₹{activeStudent.monthlyAmount.toLocaleString('en-IN')}/mo</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectSettlementOption('custom')}
                        className={`p-2.5 rounded-[4px] border text-left transition-all space-y-1 cursor-pointer ${
                          settlementOption === 'custom'
                            ? 'bg-[#222222] border-zinc-500 text-foreground shadow-xs'
                            : 'bg-[#1a1a1a] border-border/70 text-muted-foreground hover:border-border hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-amber-400">Custom Amount</span>
                          {settlementOption === 'custom' && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                        </div>
                        <p className="text-xs font-bold text-foreground">Enter Custom</p>
                        <p className="text-[10px] text-muted-foreground">Any part payment</p>
                      </button>
                    </div>

                    {/* If Monthly Installment option is chosen: Interactive Month Selectors */}
                    {settlementOption === 'selected_months' && (
                      <div className="pt-2 border-t border-border/60 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-foreground">Select Months to Settle in this Receipt:</span>
                          <span className="text-[11px] text-muted-foreground">
                            {selectedMonthsToPay.length} month(s) selected · <span className="font-mono font-bold text-emerald-400">₹{(selectedMonthsToPay.length * activeStudent.monthlyAmount).toLocaleString('en-IN')}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                          {activeStudent.installments.map((inst) => {
                            const isSelected = selectedMonthsToPay.includes(inst.monthName);
                            return (
                              <button
                                key={inst.monthName}
                                type="button"
                                disabled={inst.isPaid}
                                onClick={() => handleMonthToggle(inst.monthName)}
                                className={`p-2 rounded-[4px] border text-left transition-all flex flex-col justify-between cursor-pointer text-xs ${
                                  inst.isPaid
                                    ? 'bg-[#181818]/60 border-border/40 opacity-50 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-emerald-950/40 border-emerald-500/70 text-foreground shadow-xs'
                                    : 'bg-[#1a1a1a] border-border/70 text-muted-foreground hover:border-border hover:text-foreground'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase truncate">{inst.monthName.split(' ')[0]}</span>
                                  {inst.isPaid ? (
                                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1 py-0.2 rounded">PAID</span>
                                  ) : isSelected ? (
                                    <Check className="h-3 w-3 text-emerald-400" />
                                  ) : (
                                    <span className="text-[9px] text-zinc-400 font-mono">₹{inst.amount}</span>
                                  )}
                                </div>
                                <span className="text-[10px] text-muted-foreground pt-1">Due: {inst.dueDate.slice(0, 6)}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Depositor / Payer Identity Selection */}
                  <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-2.5">
                    <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                      2. Who is Paying?
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { type: 'Father' as const, label: activeStudent.fatherName, role: 'Father' },
                        { type: 'Mother' as const, label: activeStudent.motherName, role: 'Mother' },
                        { type: 'Student' as const, label: activeStudent.studentName, role: 'Student' },
                        { type: 'Other' as const, label: 'Other Relative / Rep', role: 'Other' },
                      ].map((p) => {
                        const isSelected = payerType === p.type;
                        return (
                          <button
                            key={p.type}
                            type="button"
                            onClick={() => setPayerType(p.type)}
                            className={`p-2 rounded-[4px] border text-left transition-all space-y-0.5 cursor-pointer ${
                              isSelected
                                ? 'bg-[#222222] border-zinc-500 text-foreground shadow-xs'
                                : 'bg-[#1a1a1a] border-border/70 text-muted-foreground hover:border-border hover:text-foreground'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{p.role}</span>
                              {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                            </div>
                            <p className="text-xs font-bold text-foreground truncate">{p.label}</p>
                          </button>
                        );
                      })}
                    </div>

                    {payerType === 'Other' && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-[4px] bg-[#1a1a1a] border border-border/60 pt-2 text-xs">
                        <div>
                          <label className="text-[11px] font-bold text-muted-foreground block mb-1">Representative Name *</label>
                          <VFInput
                            placeholder="e.g. Mr. Rajesh Verma (Uncle)"
                            value={customPayerName}
                            onChange={(e) => setCustomPayerName(e.target.value)}
                            className="bg-[#141414] border-border h-8 text-xs rounded-[4px]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-muted-foreground block mb-1">Relationship to Student</label>
                          <VFInput
                            placeholder="e.g. Uncle / Grandfather / Driver"
                            value={customPayerRelation}
                            onChange={(e) => setCustomPayerRelation(e.target.value)}
                            className="bg-[#141414] border-border h-8 text-xs rounded-[4px]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-muted-foreground block mb-1">Representative Contact</label>
                          <VFInput
                            placeholder="e.g. +91 98111 22233"
                            value={customPayerPhone}
                            onChange={(e) => setCustomPayerPhone(e.target.value)}
                            className="bg-[#141414] border-border h-8 text-xs rounded-[4px]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Amount Selector */}
                  <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                        3. Amount
                      </h4>
                      {activeStudent.dueAmount > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              setSettlementOption('annual_full');
                              setPaymentAmount(String(activeStudent.dueAmount));
                            }}
                            className="px-2.5 py-1 rounded-[4px] bg-[#1a1a1a] hover:bg-[#222222] border border-border text-[11px] font-bold text-zinc-200 hover:text-white transition-colors"
                          >
                            Full Due (₹{activeStudent.dueAmount.toLocaleString('en-IN')})
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSettlementOption('selected_months');
                              setPaymentAmount(String(activeStudent.monthlyAmount));
                              setSelectedMonthsToPay(activeStudent.installments.filter((i) => !i.isPaid).slice(0, 1).map((i) => i.monthName));
                            }}
                            className="px-2.5 py-1 rounded-[4px] bg-[#1a1a1a] hover:bg-[#222222] border border-border text-[11px] font-bold text-zinc-200 hover:text-white transition-colors"
                          >
                            1 Month (₹{activeStudent.monthlyAmount.toLocaleString('en-IN')})
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-muted-foreground">₹</span>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Enter amount in ₹..."
                        className="w-full pl-7 pr-3 py-2 text-sm font-mono font-black text-foreground bg-[#1a1a1a] border border-border rounded-[4px] focus:outline-none focus:ring-1 focus:ring-zinc-500"
                      />
                    </div>
                  </div>

                  {/* Payment Mode Selector */}
                  <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-2.5">
                    <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                      4. Payment Method
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                      {[
                        { mode: 'Cash at Counter' as const, label: 'Cash', sub: 'Instant receipt', icon: Wallet, color: 'text-emerald-400' },
                        { mode: 'Cheque / DD' as const, label: 'Cheque', sub: 'Bank deposit', icon: Receipt, color: 'text-amber-400' },
                        { mode: 'UPI / QR Code (Manual Verify)' as const, label: 'UPI / QR Code', sub: 'Scan school QR', icon: QrCode, color: 'text-purple-400' },
                        { mode: 'Bank Transfer (NEFT/RTGS)' as const, label: 'Bank Transfer', sub: 'Direct NEFT/RTGS', icon: Building, color: 'text-blue-400' },
                        { mode: 'POS Card Swipe' as const, label: 'Card Swipe', sub: 'Debit/Credit card', icon: CreditCard, color: 'text-zinc-300' },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = selectedMode === item.mode;
                        return (
                          <button
                            key={item.mode}
                            type="button"
                            onClick={() => setSelectedMode(item.mode)}
                            className={`p-2.5 rounded-[4px] border text-left transition-all flex flex-col justify-between space-y-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-[#222222] border-zinc-500 text-foreground shadow-xs'
                                : 'bg-[#1a1a1a] border-border/70 text-muted-foreground hover:border-border hover:text-foreground'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <Icon className={`h-4 w-4 ${isSelected ? 'text-zinc-100' : item.color}`} />
                              {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground leading-tight">{item.label}</p>
                              <p className="text-[10px] text-muted-foreground font-medium">{item.sub}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Mode Specific Inputs */}
                    <div className="pt-1.5">
                      {selectedMode === 'Cash at Counter' && (
                        <div className="p-3 rounded-[4px] bg-[#1a1a1a] border border-border/60 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground">Cash Collection Desk</span>
                            <VFBadge variant="success">Physical Cash Received</VFBadge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                            <div>
                              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Cashier Staff In-Charge</label>
                              <VFInput
                                value={cashierName}
                                onChange={(e) => setCashierName(e.target.value)}
                                className="bg-[#141414] border-border h-8 text-xs rounded-[4px]"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Notes / Cash Denominations</label>
                              <VFInput
                                placeholder="e.g. Received ₹3,500 for September installment"
                                value={paymentRemarks}
                                onChange={(e) => setPaymentRemarks(e.target.value)}
                                className="bg-[#141414] border-border h-8 text-xs rounded-[4px]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedMode === 'Cheque / DD' && (
                        <div className="p-3 rounded-[4px] bg-[#1a1a1a] border border-border/60 space-y-2.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground">Cheque / Demand Draft Deposit</span>
                            <VFBadge variant="warning">Subject to Bank Realization</VFBadge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div>
                              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Cheque / DD Number *</label>
                              <VFInput
                                placeholder="e.g. 645210"
                                value={chequeNumber}
                                onChange={(e) => setChequeNumber(e.target.value)}
                                className="bg-[#141414] border-border font-mono h-8 text-xs rounded-[4px]"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Drawee Bank Name *</label>
                              <VFInput
                                placeholder="e.g. State Bank of India (SBI)"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className="bg-[#141414] border-border h-8 text-xs rounded-[4px]"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Cheque Date</label>
                              <VFInput
                                defaultValue="Today"
                                className="bg-[#141414] border-border h-8 text-xs rounded-[4px]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedMode === 'UPI / QR Code (Manual Verify)' && (
                        <div className="p-3.5 rounded-[4px] bg-[#1a1a1a] border border-border/60 space-y-2.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground">Dynamic UPI QR Code Scan</span>
                            <VFBadge variant="outline" className="text-purple-400 border-purple-500/30">
                              Manual Ref Verification
                            </VFBadge>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#141414] p-2.5 rounded-[4px] border border-border/50">
                            <div className="h-20 w-20 bg-white p-1 rounded-[4px] flex items-center justify-center shrink-0">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=vidyamaxx.fees@icici&pn=VidyaMaxxInternational&am=${paymentAmount || '3500'}&cu=INR`}
                                alt="UPI QR Code"
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div className="space-y-1 flex-1 min-w-0">
                              <p className="text-xs font-bold text-foreground">School UPI VPA: <span className="font-mono text-zinc-200 font-bold">vidyamaxx.fees@icici</span></p>
                              <p className="text-[11px] text-muted-foreground">
                                Parent can scan with Google Pay, PhonePe, Paytm, or BHIM. Enter the 12-digit UTR reference below:
                              </p>
                              <button
                                type="button"
                                onClick={handleCopyUPI}
                                className="text-[10px] px-2 py-0.5 rounded-[4px] bg-[#1a1a1a] border border-border text-foreground hover:bg-[#222222] transition-colors flex items-center gap-1"
                              >
                                <Copy className="h-2.5 w-2.5" />
                                {copiedText ? 'Copied VPA!' : 'Copy UPI VPA'}
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                            <div>
                              <label className="text-[11px] font-bold text-muted-foreground block mb-1">12-Digit UPI Transaction ID / UTR *</label>
                              <VFInput
                                placeholder="e.g. 991823901244"
                                value={utrNumber}
                                onChange={(e) => setUtrNumber(e.target.value)}
                                className="bg-[#141414] border-border font-mono h-8 text-xs rounded-[4px]"
                              />
                            </div>
                            <div className="flex items-end pb-1">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={isManualVerified}
                                  onChange={(e) => setIsManualVerified(e.target.checked)}
                                  className="h-4 w-4 rounded bg-[#141414] border-border text-emerald-500 focus:ring-0 cursor-pointer"
                                />
                                <span className="text-xs font-bold text-foreground">Verified credit in school bank statement</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedMode === 'Bank Transfer (NEFT/RTGS)' && (
                        <div className="p-3 rounded-[4px] bg-[#1a1a1a] border border-border/60 space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-foreground">School Bank Account Details</span>
                            <VFBadge variant="outline">Bank RTGS / NEFT</VFBadge>
                          </div>
                          <div className="p-2 rounded-[4px] bg-[#141414] border border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                            <div><span className="text-muted-foreground block text-[10px]">Bank:</span> ICICI Bank Ltd</div>
                            <div><span className="text-muted-foreground block text-[10px]">Account No:</span> 981200491823901</div>
                            <div><span className="text-muted-foreground block text-[10px]">IFSC Code:</span> ICIC0000102</div>
                            <div><span className="text-muted-foreground block text-[10px]">Branch:</span> New Delhi Main</div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                            <div>
                              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Bank Reference / UTR Number *</label>
                              <VFInput
                                placeholder="e.g. N0918239012"
                                value={utrNumber}
                                onChange={(e) => setUtrNumber(e.target.value)}
                                className="bg-[#141414] border-border font-mono h-8 text-xs rounded-[4px]"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Remarks / Note</label>
                              <VFInput
                                placeholder="e.g. Net Banking IMPS Verified"
                                value={paymentRemarks}
                                onChange={(e) => setPaymentRemarks(e.target.value)}
                                className="bg-[#141414] border-border h-8 text-xs rounded-[4px]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedMode === 'POS Card Swipe' && (
                        <div className="p-3 rounded-[4px] bg-[#1a1a1a] border border-border/60 space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-foreground">POS Terminal Swipe</span>
                            <VFBadge variant="success">Debit / Credit Card</VFBadge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[11px] font-bold text-muted-foreground block mb-1">POS Terminal Approval Code *</label>
                              <VFInput
                                placeholder="e.g. AUTH-882910"
                                value={utrNumber}
                                onChange={(e) => setUtrNumber(e.target.value)}
                                className="bg-[#141414] border-border font-mono h-8 text-xs rounded-[4px]"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Card Last 4 Digits</label>
                              <VFInput
                                placeholder="e.g. 4012"
                                maxLength={4}
                                className="bg-[#141414] border-border font-mono h-8 text-xs rounded-[4px]"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SMS / WhatsApp Toggle */}
                  <div className="p-2.5 rounded-[4px] bg-[#141414] border border-border/80 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sendReceiptSMS}
                        onChange={(e) => setSendReceiptSMS(e.target.checked)}
                        className="h-4 w-4 rounded bg-[#1a1a1a] border-border text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-foreground">
                        Send instant receipt copy via WhatsApp & SMS to <span className="font-mono text-zinc-300">{activeStudent.phone}</span>
                      </span>
                    </label>
                    <Send className="h-4 w-4 text-emerald-400 shrink-0" />
                  </div>

                  {/* Submit Action */}
                  <div className="flex items-center justify-between p-3.5 rounded-[4px] bg-[#141414] border border-border/80">
                    <div>
                      <span className="text-xs font-bold text-muted-foreground block">Amount Ready to Settle</span>
                      <span className="text-xl font-black text-emerald-400 font-mono">₹{Number(paymentAmount || 0).toLocaleString('en-IN')}</span>
                    </div>

                    <VFButton
                      size="sm"
                      className="h-9 px-4 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white border-0 shadow-md transition-colors rounded-[4px]"
                      leftIcon={<Check className="h-4 w-4" />}
                      onClick={handleConfirmPayment}
                    >
                      Collect ₹{Number(paymentAmount || 0).toLocaleString('en-IN')} & Issue Receipt
                    </VFButton>
                  </div>
                </div>
              )}

              {/* ─── TAB 2: PAYMENT HISTORY & RECEIPTS ARCHIVE ─── */}
              {drawerActiveTab === 'history' && (
                <div className="space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                      Issued Payment Receipts & Audit History ({activeStudent.history.length})
                    </h4>
                    <span className="text-[11px] text-muted-foreground font-mono">Session 2026–2027</span>
                  </div>

                  {activeStudent.history.length > 0 ? (
                    activeStudent.history.map((rec) => (
                      <div key={rec.receiptNo} className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 hover:border-zinc-700 transition-all space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1.5 border-b border-border/50">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-zinc-300 bg-[#1a1a1a] px-2 py-0.5 rounded-[4px] border border-border text-xs">
                              {rec.receiptNo}
                            </span>
                            <span className="text-xs text-muted-foreground font-semibold">{rec.date}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-base font-black text-emerald-400 font-mono">
                              ₹{rec.amount.toLocaleString('en-IN')}
                            </span>
                            <VFBadge variant="outline" className="text-[10px] font-bold rounded-[4px]">
                              {rec.mode}
                            </VFBadge>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="space-y-0.5">
                            <p className="text-foreground font-medium font-mono">{rec.referenceNo}</p>
                            <p className="text-muted-foreground text-[11px]">
                              Deposited By: <span className="font-bold text-foreground">{rec.payerName}</span> ({rec.payerRelation}) · Staff: <span className="font-semibold text-zinc-300">{rec.cashier}</span>
                            </p>
                            {rec.settledPeriod && (
                              <p className="text-[11px] text-emerald-400 font-semibold">
                                Settled: {rec.settledPeriod}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            <VFButton
                              size="sm"
                              variant="outline"
                              className="h-7 px-2.5 text-[11px] bg-[#1a1a1a] hover:bg-[#222222] border-border text-foreground rounded-[4px] font-semibold"
                              leftIcon={<Printer className="h-3 w-3" />}
                              onClick={() => addNotification({ title: 'Receipt Downloaded', description: `Downloaded official PDF for ${rec.receiptNo}.`, type: 'success' })}
                            >
                              Print Receipt (PDF)
                            </VFButton>
                            <VFButton
                              size="sm"
                              variant="outline"
                              className="h-7 px-2.5 text-[11px] bg-[#1a1a1a] hover:bg-[#222222] border-border text-foreground rounded-[4px] font-semibold"
                              leftIcon={<Send className="h-3 w-3 text-emerald-400" />}
                              onClick={() => addNotification({ title: 'Receipt Sent via WhatsApp', description: `Dispatched official receipt copy (${rec.receiptNo}) to ${activeStudent.fatherName} (${activeStudent.phone}).`, type: 'success' })}
                            >
                              WhatsApp
                            </VFButton>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center rounded-[4px] bg-[#141414] border border-border text-muted-foreground text-xs">
                      No payment receipts found for this student.
                    </div>
                  )}
                </div>
              )}

              {/* ─── TAB 3: FEE STRUCTURE & 12-MONTH SCHEDULE ─── */}
              {drawerActiveTab === 'structure' && (
                <div className="space-y-3.5 animate-fade-in">
                  <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-2.5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                      <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                        12-Month Academic Fee Installment Schedule
                      </h4>
                      <VFBadge variant="outline" className="font-mono text-zinc-300">
                        Plan: {activeStudent.paymentPlan}
                      </VFBadge>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-border/60 text-muted-foreground uppercase text-[10px]">
                            <th className="py-2 px-2.5">Academic Month</th>
                            <th className="py-2 px-2.5">Due Date</th>
                            <th className="py-2 px-2.5">Installment Amount</th>
                            <th className="py-2 px-2.5">Status</th>
                            <th className="py-2 px-2.5">Receipt Reference</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {activeStudent.installments.map((inst) => (
                            <tr key={inst.monthName} className="hover:bg-[#1a1a1a]/50 transition-colors">
                              <td className="py-2 px-2.5 font-bold text-foreground">{inst.monthName}</td>
                              <td className="py-2 px-2.5 text-zinc-400 font-mono">{inst.dueDate}</td>
                              <td className="py-2 px-2.5 font-mono font-bold text-foreground">₹{inst.amount.toLocaleString('en-IN')}</td>
                              <td className="py-2 px-2.5">
                                {inst.isPaid ? (
                                  <VFBadge variant="success" className="text-[10px] rounded-[4px]">Paid</VFBadge>
                                ) : (
                                  <VFBadge variant="warning" className="text-[10px] rounded-[4px]">Pending</VFBadge>
                                )}
                              </td>
                              <td className="py-2 px-2.5 font-mono text-[11px] text-zinc-400">
                                {inst.receiptNo ? `${inst.receiptNo} (${inst.paidDate})` : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-2.5">
                    <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider pb-1.5 border-b border-border/60">
                      Annual Fee Component Assessment
                    </h4>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-border/40">
                        <span className="text-muted-foreground font-semibold">Tuition & Classroom Instruction Fee</span>
                        <span className="font-mono font-bold text-foreground">₹{activeStudent.tuitionFee.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/40">
                        <span className="text-muted-foreground font-semibold">Science, Robotics & Computer Lab Fee</span>
                        <span className="font-mono font-bold text-foreground">₹{activeStudent.labFee.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/40">
                        <span className="text-muted-foreground font-semibold">Air-Conditioned GPS Bus Transport</span>
                        <span className="font-mono font-bold text-foreground">₹{activeStudent.transportFee.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/40">
                        <span className="text-muted-foreground font-semibold">Co-Curricular Sports & Annual Activity Fee</span>
                        <span className="font-mono font-bold text-foreground">₹{activeStudent.activityFee.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between pt-1.5 text-sm font-extrabold">
                        <span className="text-foreground">Total Academic Year Assessment</span>
                        <span className="font-mono text-foreground font-black">₹{activeStudent.totalFee.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB 4: SCHOLARSHIP & RELIEF ─── */}
              {drawerActiveTab === 'scholarship' && (() => {
                const hasScholarship = activeStudent.studentAdmNo === 'ADM-2026-0841' || activeStudent.studentAdmNo === 'ADM-2026-0842';

                return (
                  <div className="space-y-3.5 animate-fade-in text-xs">
                    {/* Header */}
                    <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-2.5">
                      <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-400" />
                          <h4 className="font-extrabold text-foreground uppercase tracking-wider text-xs">
                            Government & Institutional Fee Relief
                          </h4>
                        </div>
                        {hasScholarship ? (
                          <VFBadge variant="success" className="text-[10px] font-bold rounded-[4px]">
                            Active Relief Applied
                          </VFBadge>
                        ) : (
                          <VFBadge variant="outline" className="text-[10px] font-bold rounded-[4px] text-zinc-400 border-zinc-700 bg-[#181818]">
                            No Active Concession (Eligible to Apply)
                          </VFBadge>
                        )}
                      </div>

                      {hasScholarship ? (
                        <div className="p-3 rounded-[4px] bg-[#1a1a1a] border border-border/60 space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-foreground text-sm">
                              {activeStudent.studentAdmNo === 'ADM-2026-0841'
                                ? 'National Means-cum-Merit Scholarship (NSP Scheme)'
                                : 'Board Merit Excellence 100% Free-ship'}
                            </h5>
                            <span className="font-mono font-black text-emerald-400 text-sm">
                              {activeStudent.studentAdmNo === 'ADM-2026-0842' ? '100% Free-ship' : '50% Tuition Waiver'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                            <div>
                              <span className="text-muted-foreground block text-[10px]">Funding Source:</span>
                              <span className="font-medium text-foreground">
                                {activeStudent.studentAdmNo === 'ADM-2026-0841' ? 'Ministry of Education (Govt. of India)' : 'VidyaMaxx Foundation Endowment'}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block text-[10px]">Disbursal Mode:</span>
                              <span className="font-mono text-zinc-300">Direct Govt DBT Credit</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block text-[10px]">Sanction Ref ID:</span>
                              <span className="font-mono text-primary font-bold">
                                {activeStudent.studentAdmNo === 'ADM-2026-0841' ? 'NSP-2026-HR-991823' : 'VFEF-MERIT-2026-01'}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block text-[10px]">Disbursal Status:</span>
                              <span className="text-emerald-400 font-bold">Credited via PFMS</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-[4px] bg-[#1a1a1a] border border-border/60 text-muted-foreground space-y-1">
                          <p className="font-semibold text-foreground">Standard Academic Fee Assessment Active</p>
                          <p className="text-[11px]">
                            This student does not have an active waiver applied. Check eligibility across available grant schemes below.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Available Schemes Matrix (Clean & Minimal) */}
                    <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-2.5">
                      <div className="flex items-center justify-between pb-1 border-b border-border/60">
                        <h4 className="font-extrabold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          <span>Scholarship Schemes & Eligibility</span>
                        </h4>
                        <span className="text-[10px] text-muted-foreground font-mono">Limit: 1 per student</span>
                      </div>

                      <div className="space-y-1.5">
                        {[
                          {
                            name: 'Academic Board Merit Excellence Grant',
                            benefit: '100% Tuition Waiver',
                            isEligible: activeStudent.studentAdmNo === 'ADM-2026-0846',
                          },
                          {
                            name: 'National Means-cum-Merit Scheme (Govt NSP)',
                            benefit: '50% Tuition Waiver',
                            isEligible: true,
                          },
                          {
                            name: 'National Athletics & Sports Talent Quota',
                            benefit: '75% Tuition Waiver',
                            isEligible: false,
                          },
                          {
                            name: 'Sibling / Staff Ward Concession Quota',
                            benefit: '25% Tuition Waiver',
                            isEligible: true,
                          },
                        ].map((sch, i) => {
                          const isCurrentActive = hasScholarship && (
                            (activeStudent.studentAdmNo === 'ADM-2026-0841' && sch.name.includes('Means-cum-Merit')) ||
                            (activeStudent.studentAdmNo === 'ADM-2026-0842' && sch.name.includes('Merit Excellence'))
                          );
                          const isBlockedByGrant = hasScholarship && !isCurrentActive;

                          return (
                            <div key={i} className={cn(
                              "p-2.5 rounded-[4px] border flex items-center justify-between gap-3 transition-colors",
                              isCurrentActive ? "bg-emerald-950/20 border-emerald-500/50" : "bg-[#181818] border-border/70"
                            )}>
                              <div className="min-w-0 flex items-center gap-2">
                                <span className="font-bold text-foreground truncate text-xs">{sch.name}</span>
                                <span className="text-[11px] font-mono font-semibold text-emerald-400 shrink-0">
                                  ({sch.benefit})
                                </span>
                              </div>

                              <div className="shrink-0 flex items-center gap-2">
                                {isCurrentActive ? (
                                  <VFBadge variant="success" className="text-[10px] font-bold rounded-[4px]">
                                    Active Grant
                                  </VFBadge>
                                ) : isBlockedByGrant ? (
                                  <VFBadge variant="danger" className="text-[10px] font-bold rounded-[4px]">
                                    Not Eligible
                                  </VFBadge>
                                ) : sch.isEligible ? (
                                  <>
                                    <VFBadge variant="primary" className="text-[10px] font-bold rounded-[4px]">
                                      Eligible
                                    </VFBadge>
                                    <VFButton
                                      size="sm"
                                      className="h-6 px-2.5 text-[10px] font-bold rounded-[4px]"
                                      onClick={() => addNotification({
                                        title: 'Scholarship Application Initiated',
                                        description: `Application for ${sch.name} submitted for ${activeStudent.studentName}.`,
                                        type: 'success',
                                      })}
                                    >
                                      Apply
                                    </VFButton>
                                  </>
                                ) : (
                                  <VFBadge variant="danger" className="text-[10px] rounded-[4px]">
                                    Not Eligible
                                  </VFBadge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Document Status */}
                    <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-border/60">
                        <h4 className="font-extrabold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <FileCheck className="h-4 w-4 text-emerald-400" />
                          <span>Submitted Verification Documents</span>
                        </h4>
                        <span className="text-[10px] text-muted-foreground">Accounts Compliance</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          { name: 'Income Certificate (Revenue Dept)', status: 'Verified' },
                          { name: 'Previous Academic Marksheet', status: 'Verified' },
                          { name: 'State Domicile / Residence Proof', status: 'Verified' },
                          { name: 'Sports / Category Certificate', status: 'Missing' },
                        ].map((d, i) => (
                          <div key={i} className="p-2 rounded bg-[#181818] border border-border/60 flex items-center justify-between text-[11px]">
                            <span className="text-zinc-300 font-medium truncate">{d.name}</span>
                            {d.status === 'Verified' ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0 text-[10px]">
                                <CheckCircle2 className="h-3 w-3" /> Verified
                              </span>
                            ) : (
                              <span className="text-rose-400 font-bold flex items-center gap-1 shrink-0 text-[10px]">
                                <AlertCircle className="h-3 w-3" /> Missing
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </VFDrawer>
    </VFPageContainer>
  );
}
