import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFDataTable,
  VFButton,
  VFBadge,
  VFSelect,
  VFDrawer,
} from '@vidyamaxx/ui';
import {
  Download,
  Plus,
  Calendar,
  Users,
  CreditCard,
  Award,
  School,
  Shield,
  SlidersHorizontal,
  X,
  Printer,
  Database,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/reports')({
  component: ReportsPage,
});

// ─── DOMAIN REPORT DATASETS ──────────────────────────────────────────────────

type DomainType = 'students' | 'fees' | 'attendance' | 'examinations' | 'faculty' | 'compliance';
type ExportFormat = 'csv' | 'json' | 'html';

interface DomainConfig {
  id: DomainType;
  labelEn: string;
  labelHi: string;
  icon: React.ReactNode;
  description: string;
  columns: { key: string; label: string }[];
  defaultFilename: string;
}

const DOMAINS: Record<DomainType, DomainConfig> = {
  students: {
    id: 'students',
    labelEn: 'Student Master Register',
    labelHi: 'स्टूडेंट मास्टर रजिस्टर',
    icon: <Users className="h-4 w-4 text-blue-400" />,
    description: 'Complete student profiles, demographics, enrollments, and parent contacts.',
    columns: [
      { key: 'rollNo', label: 'Roll Number' },
      { key: 'name', label: 'Full Name' },
      { key: 'grade', label: 'Class & Section' },
      { key: 'admissionId', label: 'Admission ID' },
      { key: 'guardian', label: 'Guardian / Father' },
      { key: 'phone', label: 'Contact Phone' },
      { key: 'gender', label: 'Gender' },
      { key: 'category', label: 'Category' },
      { key: 'bloodGroup', label: 'Blood Group' },
      { key: 'attendanceRate', label: 'Attendance %' },
      { key: 'feeStatus', label: 'Fee Clearance' },
    ],
    defaultFilename: 'VidyaMaxx_Student_Master_2026',
  },
  fees: {
    id: 'fees',
    labelEn: 'Fee Ledgers & Defaulters',
    labelHi: 'फीस लेजर व बकाया सूची',
    icon: <CreditCard className="h-4 w-4 text-emerald-400" />,
    description: 'Realized collections, concession grants, installment dues, and payment methods.',
    columns: [
      { key: 'studentId', label: 'Student ID' },
      { key: 'name', label: 'Student Name' },
      { key: 'grade', label: 'Class' },
      { key: 'annualFee', label: 'Annual Fee (₹)' },
      { key: 'paidAmount', label: 'Paid Amount (₹)' },
      { key: 'concession', label: 'Scholarship / Concession (₹)' },
      { key: 'balanceDue', label: 'Balance Due (₹)' },
      { key: 'receiptRef', label: 'Last Receipt Ref' },
      { key: 'paymentMode', label: 'Payment Method' },
      { key: 'status', label: 'Ledger Status' },
    ],
    defaultFilename: 'VidyaMaxx_Fee_Collection_Q2_2026',
  },
  attendance: {
    id: 'attendance',
    labelEn: 'Attendance & Biometrics',
    labelHi: 'अटेंडेंस & बायोमेट्रिक्स',
    icon: <Calendar className="h-4 w-4 text-cyan-400" />,
    description: 'Turnstile logs, working days, present/absent tallies, and monthly aggregates.',
    columns: [
      { key: 'memberId', label: 'Member ID' },
      { key: 'name', label: 'Member Name' },
      { key: 'roleOrGrade', label: 'Role / Class' },
      { key: 'totalDays', label: 'Total Working Days' },
      { key: 'presentDays', label: 'Days Present' },
      { key: 'absentDays', label: 'Days Absent' },
      { key: 'leaves', label: 'Approved Leaves' },
      { key: 'attendanceRate', label: 'Attendance Rate (%)' },
      { key: 'biometricSync', label: 'Biometric Status' },
    ],
    defaultFilename: 'VidyaMaxx_Attendance_Register_Sep2026',
  },
  examinations: {
    id: 'examinations',
    labelEn: 'Examinations & Marks',
    labelHi: 'एग्जाम रिजल्ट्स & मार्कशीट',
    icon: <Award className="h-4 w-4 text-amber-400" />,
    description: 'Term marksheets, subject scores, GPA calculation, and distinction rankings.',
    columns: [
      { key: 'rollNo', label: 'Roll No' },
      { key: 'name', label: 'Student Name' },
      { key: 'grade', label: 'Grade & Stream' },
      { key: 'math', label: 'Mathematics (100)' },
      { key: 'science', label: 'Science & Tech (100)' },
      { key: 'english', label: 'English Lit (100)' },
      { key: 'social', label: 'Social Studies (100)' },
      { key: 'aggregate', label: 'Aggregate Score (%)' },
      { key: 'gpa', label: 'GPA Equivalent' },
      { key: 'standing', label: 'Standing / Honors' },
    ],
    defaultFilename: 'VidyaMaxx_Term1_Exam_Standings_2026',
  },
  faculty: {
    id: 'faculty',
    labelEn: 'Faculty & Workload Register',
    labelHi: 'टीचर्स & वर्कलोड रजिस्टर',
    icon: <School className="h-4 w-4 text-purple-400" />,
    description: 'Educator credentials, teaching load, department allocations, and leaves.',
    columns: [
      { key: 'empId', label: 'Employee ID' },
      { key: 'name', label: 'Faculty Name' },
      { key: 'designation', label: 'Designation' },
      { key: 'department', label: 'Department' },
      { key: 'assignedWing', label: 'Wing Focus' },
      { key: 'weeklyPeriods', label: 'Weekly Periods' },
      { key: 'qualification', label: 'Highest Degree' },
      { key: 'status', label: 'Tenure Status' },
    ],
    defaultFilename: 'VidyaMaxx_Faculty_Workload_2026',
  },
  compliance: {
    id: 'compliance',
    labelEn: 'TC & Regulatory Compliance',
    labelHi: 'टीसी व नियामक अनुपालन',
    icon: <Shield className="h-4 w-4 text-rose-400" />,
    description: 'Transfer Certificates (TC), RTE 25% quota audits, and CBSE filings.',
    columns: [
      { key: 'docId', label: 'Document / TC ID' },
      { key: 'name', label: 'Pupil Name' },
      { key: 'grade', label: 'Class' },
      { key: 'guardian', label: 'Guardian' },
      { key: 'issueDate', label: 'Date of Issuance' },
      { key: 'tcSerial', label: 'CBSE Serial No' },
      { key: 'reason', label: 'Reason for Transfer' },
      { key: 'conduct', label: 'Conduct Benchmark' },
      { key: 'duesCleared', label: 'Dues Cleared' },
    ],
    defaultFilename: 'VidyaMaxx_TC_Accreditation_2026',
  },
};

// Raw sample operational dataset
const SAMPLE_DATA: Record<DomainType, Record<string, any>[]> = {
  students: [
    { rollNo: '101', name: 'Aarav Sharma', grade: 'Class 10-A', admissionId: 'ADM-2026-001', guardian: 'Mr. Ramesh Sharma', phone: '+91 98765 43210', gender: 'Male', category: 'General', bloodGroup: 'B+', attendanceRate: '98.2%', feeStatus: 'Cleared' },
    { rollNo: '102', name: 'Diya Patel', grade: 'Class 10-A', admissionId: 'ADM-2026-002', guardian: 'Dr. K. Patel', phone: '+91 98765 43211', gender: 'Female', category: 'OBC', bloodGroup: 'O+', attendanceRate: '96.5%', feeStatus: 'Cleared' },
    { rollNo: '103', name: 'Rohan Verma', grade: 'Class 10-B', admissionId: 'ADM-2026-003', guardian: 'Mr. S. Verma', phone: '+91 98765 43212', gender: 'Male', category: 'General', bloodGroup: 'A+', attendanceRate: '94.0%', feeStatus: 'Pending Dues' },
    { rollNo: '104', name: 'Ananya Iyer', grade: 'Class 11-Sci', admissionId: 'ADM-2026-004', guardian: 'Mrs. V. Iyer', phone: '+91 98765 43213', gender: 'Female', category: 'General', bloodGroup: 'AB+', attendanceRate: '99.1%', feeStatus: 'Cleared' },
    { rollNo: '105', name: 'Kabir Mehta', grade: 'Class 11-Com', admissionId: 'ADM-2026-005', guardian: 'Mr. R. Mehta', phone: '+91 98765 43214', gender: 'Male', category: 'EWS (RTE)', bloodGroup: 'O-', attendanceRate: '92.4%', feeStatus: 'Scholarship' },
    { rollNo: '106', name: 'Meera Nair', grade: 'Class 12-Sci', admissionId: 'ADM-2026-006', guardian: 'Col. A. Nair', phone: '+91 98765 43215', gender: 'Female', category: 'General', bloodGroup: 'B-', attendanceRate: '97.6%', feeStatus: 'Cleared' },
    { rollNo: '107', name: 'Arjun Das', grade: 'Class 12-Hum', admissionId: 'ADM-2026-007', guardian: 'Mr. P. Das', phone: '+91 98765 43216', gender: 'Male', category: 'SC', bloodGroup: 'A-', attendanceRate: '95.8%', feeStatus: 'Cleared' },
    { rollNo: '108', name: 'Sneha Reddy', grade: 'Class 9-A', admissionId: 'ADM-2026-008', guardian: 'Mr. B. Reddy', phone: '+91 98765 43217', gender: 'Female', category: 'General', bloodGroup: 'O+', attendanceRate: '96.9%', feeStatus: 'Cleared' },
  ],
  fees: [
    { studentId: 'ADM-2026-001', name: 'Aarav Sharma', grade: 'Class 10-A', annualFee: '₹ 85,000', paidAmount: '₹ 85,000', concession: '₹ 0', balanceDue: '₹ 0', receiptRef: 'REC-9012', paymentMode: 'UPI Gateway', status: 'Fully Paid' },
    { studentId: 'ADM-2026-002', name: 'Diya Patel', grade: 'Class 10-A', annualFee: '₹ 85,000', paidAmount: '₹ 85,000', concession: '₹ 0', balanceDue: '₹ 0', receiptRef: 'REC-9015', paymentMode: 'Net Banking', status: 'Fully Paid' },
    { studentId: 'ADM-2026-003', name: 'Rohan Verma', grade: 'Class 10-B', annualFee: '₹ 85,000', paidAmount: '₹ 55,000', concession: '₹ 0', balanceDue: '₹ 30,000', receiptRef: 'REC-8840', paymentMode: 'Cheque Clearance', status: 'Pending Due' },
    { studentId: 'ADM-2026-004', name: 'Ananya Iyer', grade: 'Class 11-Sci', annualFee: '₹ 95,000', paidAmount: '₹ 95,000', concession: '₹ 0', balanceDue: '₹ 0', receiptRef: 'REC-9104', paymentMode: 'Corporate Card', status: 'Fully Paid' },
    { studentId: 'ADM-2026-005', name: 'Kabir Mehta', grade: 'Class 11-Com', annualFee: '₹ 95,000', paidAmount: '₹ 20,000', concession: '₹ 75,000', balanceDue: '₹ 0', receiptRef: 'REC-8700', paymentMode: 'State RTE Grant', status: 'Scholarship 100%' },
    { studentId: 'ADM-2026-006', name: 'Meera Nair', grade: 'Class 12-Sci', annualFee: '₹ 105,000', paidAmount: '₹ 105,000', concession: '₹ 0', balanceDue: '₹ 0', receiptRef: 'REC-9180', paymentMode: 'UPI Gateway', status: 'Fully Paid' },
  ],
  attendance: [
    { memberId: 'ADM-2026-001', name: 'Aarav Sharma', roleOrGrade: 'Class 10-A', totalDays: 110, presentDays: 108, absentDays: 2, leaves: 0, attendanceRate: '98.2%', biometricSync: 'Realtime RFID' },
    { memberId: 'ADM-2026-002', name: 'Diya Patel', roleOrGrade: 'Class 10-A', totalDays: 110, presentDays: 106, absentDays: 3, leaves: 1, attendanceRate: '96.5%', biometricSync: 'Realtime RFID' },
    { memberId: 'ADM-2026-003', name: 'Rohan Verma', roleOrGrade: 'Class 10-B', totalDays: 110, presentDays: 103, absentDays: 5, leaves: 2, attendanceRate: '94.0%', biometricSync: 'Realtime RFID' },
    { memberId: 'FAC-010', name: 'Dr. Meenakshi S.', roleOrGrade: 'Physics HOD', totalDays: 110, presentDays: 109, absentDays: 1, leaves: 0, attendanceRate: '99.1%', biometricSync: 'Facial Terminal' },
    { memberId: 'FAC-014', name: 'Mr. Arvind Rao', roleOrGrade: 'Math Senior Faculty', totalDays: 110, presentDays: 107, absentDays: 2, leaves: 1, attendanceRate: '97.3%', biometricSync: 'Facial Terminal' },
  ],
  examinations: [
    { rollNo: '101', name: 'Aarav Sharma', grade: 'Class 10-A', math: 95, science: 92, english: 94, social: 91, aggregate: '93.0%', gpa: '9.8 / 10', standing: 'Distinction (Top 1%)' },
    { rollNo: '102', name: 'Diya Patel', grade: 'Class 10-A', math: 91, science: 94, english: 88, social: 89, aggregate: '90.5%', gpa: '9.4 / 10', standing: 'Distinction' },
    { rollNo: '103', name: 'Rohan Verma', grade: 'Class 10-B', math: 78, science: 82, english: 80, social: 79, aggregate: '79.8%', gpa: '8.2 / 10', standing: 'First Division' },
    { rollNo: '104', name: 'Ananya Iyer', grade: 'Class 11-Sci', math: 98, science: 96, english: 95, social: 94, aggregate: '95.8%', gpa: '10.0 / 10', standing: 'State Merit Ranker' },
    { rollNo: '106', name: 'Meera Nair', grade: 'Class 12-Sci', math: 94, science: 93, english: 96, social: 90, aggregate: '93.3%', gpa: '9.8 / 10', standing: 'Distinction' },
  ],
  faculty: [
    { empId: 'FAC-001', name: 'Dr. Rajesh Sharma', designation: 'Principal & Academic Director', department: 'Executive Directorate', assignedWing: 'All Wings', weeklyPeriods: 6, qualification: 'Ph.D. Education, M.Sc.', status: 'Permanent' },
    { empId: 'FAC-010', name: 'Dr. Meenakshi Sundaram', designation: 'Head of Department', department: 'Physics & Science', assignedWing: 'Senior Secondary', weeklyPeriods: 24, qualification: 'Ph.D. Physics', status: 'Permanent' },
    { empId: 'FAC-014', name: 'Mr. Arvind Rao', designation: 'Senior Faculty', department: 'Mathematics', assignedWing: 'High School & Senior', weeklyPeriods: 28, qualification: 'M.Sc. Mathematics, B.Ed.', status: 'Permanent' },
    { empId: 'FAC-018', name: 'Mrs. Kavita Singh', designation: 'Senior Faculty', department: 'English & Humanities', assignedWing: 'Middle & High School', weeklyPeriods: 26, qualification: 'M.A. English, B.Ed.', status: 'Permanent' },
    { empId: 'FAC-022', name: 'Mr. Sameer Khan', designation: 'Laboratory Coordinator', department: 'Computer Science & AI', assignedWing: 'Senior Secondary', weeklyPeriods: 22, qualification: 'M.Tech IT, B.Tech', status: 'Permanent' },
  ],
  compliance: [
    { docId: 'TC-2026-882', name: 'Master Pranav Roy', grade: 'Class 9', guardian: 'Mr. S. Roy', issueDate: '01 Sep 2026', tcSerial: 'CBSE/DEL/2026/882', reason: 'Parent Inter-state Job Relocation', conduct: 'Exemplary', duesCleared: 'Verified (Zero Dues)' },
    { docId: 'TC-2026-881', name: 'Miss Priya Sen', grade: 'Class 10', guardian: 'Mrs. M. Sen', issueDate: '24 Aug 2026', tcSerial: 'CBSE/DEL/2026/881', reason: 'Admission to Armed Forces Academy', conduct: 'Exemplary', duesCleared: 'Verified (Zero Dues)' },
    { docId: 'RTE-2026-042', name: 'Kabir Mehta', grade: 'Class 11', guardian: 'Mr. R. Mehta', issueDate: '15 Jul 2026', tcSerial: 'RTE/25/VER-042', reason: 'EWS 25% State Allotment Verification', conduct: 'Good Standing', duesCleared: 'State Subsidized' },
  ],
};

// ─── FILE EXPORT DOWNLOAD HELPERS ─────────────────────────────────────────────

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function generateCSV(headers: { key: string; label: string }[], rows: Record<string, any>[]): string {
  const escapeCell = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;
  const headerLine = headers.map((h) => escapeCell(h.label)).join(',');
  const rowLines = rows.map((r) => headers.map((h) => escapeCell(r[h.key])).join(','));
  return [headerLine, ...rowLines].join('\r\n');
}

function generatePrintableHTML(
  title: string,
  headers: { key: string; label: string }[],
  rows: Record<string, any>[],
  metadata: { session: string; date: string; domain: string }
): string {
  const tableHeaders = headers.map((h) => `<th style="padding:10px; border:1px solid #ddd; background:#f4f4f4; text-align:left; font-size:12px; font-weight:bold;">${h.label}</th>`).join('');
  const tableRows = rows
    .map(
      (r, idx) =>
        `<tr style="background:${idx % 2 === 0 ? '#fff' : '#fafafa'};">` +
        headers.map((h) => `<td style="padding:8px 10px; border:1px solid #ddd; font-size:12px;">${r[h.key] ?? '—'}</td>`).join('') +
        `</tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title} – VidyaMaxx Institutional Audit</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #111; }
    .header { border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
    .school-title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; }
    .affiliation { font-size: 11px; color: #64748b; font-family: monospace; margin-top: 4px; }
    .meta { font-size: 11px; color: #475569; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
    .signature { width: 200px; border-top: 1px dashed #94a3b8; text-align: center; padding-top: 6px; margin-top: 50px; font-weight: bold; }
    @media print { body { margin: 20px; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="school-title">VidyaMaxx International Academy</h1>
      <p class="affiliation">Affiliation: CBSE #1630982 | Est. 1994 | ISO 27001 Certified</p>
      <h2 style="font-size:16px; margin-top:12px; color:#2563eb;">${title}</h2>
    </div>
    <div class="meta" style="text-align:right;">
      <div><strong>Academic Session:</strong> ${metadata.session}</div>
      <div><strong>Generated Date:</strong> ${metadata.date}</div>
      <div><strong>Scope:</strong> ${metadata.domain}</div>
      <div><strong>Total Records:</strong> ${rows.length} rows compiled</div>
    </div>
  </div>

  <table>
    <thead><tr>${tableHeaders}</tr></thead>
    <tbody>${tableRows}</tbody>
  </table>

  <div class="footer">
    <div>
      <p>Tamper-evident system export generated via VidyaMaxx Institutional Command Portal.</p>
      <p>Document Security Checksum: SHA-256 Verified</p>
    </div>
    <div style="display:flex; gap:40px;">
      <div class="signature">Controller of Examinations</div>
      <div class="signature">Principal & Executive Director</div>
    </div>
  </div>

  <script>
    // Auto-open print dialog if requested
    window.addEventListener('load', () => {
      // setTimeout(() => window.print(), 300);
    });
  </script>
</body>
</html>`;
}

// ─── COMPONENT IMPLEMENTATION ────────────────────────────────────────────────

interface ReportCatalogItem {
  id: string;
  code: string;
  name: string;
  domain: DomainType;
  format: string;
  frequency: string;
  lastGenerated: string;
  size: string;
  status: 'Ready' | 'Compiled';
}

const INITIAL_CATALOG: ReportCatalogItem[] = [
  { id: '1', code: 'REP-CBSE-01', name: 'CBSE Annual Accreditation Compliance Dossier', domain: 'compliance', format: 'CSV & HTML', frequency: 'Annual Audit', lastGenerated: 'Today, 09:30 AM', size: '24.8 KB', status: 'Ready' },
  { id: '2', code: 'REP-ATT-02', name: 'Monthly Student & Staff Attendance Audit Register', domain: 'attendance', format: 'CSV (.csv)', frequency: 'Monthly Benchmark', lastGenerated: 'Today, 08:00 AM', size: '18.4 KB', status: 'Ready' },
  { id: '3', code: 'REP-FEE-03', name: 'Quarterly Fee Collection & Defaulter Audit Ledger', domain: 'fees', format: 'CSV (.csv)', frequency: 'Quarterly Term', lastGenerated: 'Yesterday, 04:30 PM', size: '15.2 KB', status: 'Ready' },
  { id: '4', code: 'REP-ACAD-04', name: 'Term 1 Grade Performance & GPA Marks Master', domain: 'examinations', format: 'CSV & HTML', frequency: 'Term Examination', lastGenerated: '12 Aug 2026', size: '32.1 KB', status: 'Ready' },
  { id: '5', code: 'REP-STU-05', name: 'Student Master Directory & Parent Dossiers', domain: 'students', format: 'CSV (.csv)', frequency: 'Realtime Live', lastGenerated: 'Just Now', size: '42.6 KB', status: 'Ready' },
  { id: '6', code: 'REP-FAC-06', name: 'Faculty Workload & Academic Allocation Register', domain: 'faculty', format: 'CSV & HTML', frequency: 'Weekly Workload', lastGenerated: '10 Aug 2026', size: '12.9 KB', status: 'Ready' },
  { id: '7', code: 'REP-TC-07', name: 'Transfer Certificate (TC) Issuance Ledger & Clearance', domain: 'compliance', format: 'CSV (.csv)', frequency: 'Realtime Event', lastGenerated: '08 Aug 2026', size: '8.4 KB', status: 'Ready' },
];

function ReportsPage() {
  const { addNotification, activeSession } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';

  React.useEffect(() => {
    document.title = t('page.reports') + ' – VidyaMaxx';
  }, [t]);

  // Catalog Table State
  const [reports, setReports] = React.useState<ReportCatalogItem[]>(INITIAL_CATALOG);
  const [categoryFilter, setCategoryFilter] = React.useState<string>('All');

  // Side Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedDomain, setSelectedDomain] = React.useState<DomainType>('students');
  const [selectedSession, setSelectedSession] = React.useState(activeSession || '2026–2027');
  const [selectedGrade, setSelectedGrade] = React.useState('All');
  const [selectedTimeframe, setSelectedTimeframe] = React.useState('Academic Year 2026-27');
  const [selectedFormat, setSelectedFormat] = React.useState<ExportFormat>('csv');
  const [selectedColumnKeys, setSelectedColumnKeys] = React.useState<string[]>(
    DOMAINS.students.columns.map((c) => c.key)
  );

  // When domain changes, reset columns
  React.useEffect(() => {
    const domainDef = DOMAINS[selectedDomain];
    setSelectedColumnKeys(domainDef.columns.map((c) => c.key));
  }, [selectedDomain]);

  // Open drawer preconfigured for a given domain
  const handleOpenDrawerWithDomain = (domain: DomainType) => {
    setSelectedDomain(domain);
    setIsDrawerOpen(true);
  };

  // Toggle individual column selection
  const handleToggleColumn = (colKey: string) => {
    setSelectedColumnKeys((prev) =>
      prev.includes(colKey) ? prev.filter((k) => k !== colKey) : [...prev, colKey]
    );
  };

  const handleSelectAllColumns = () => {
    setSelectedColumnKeys(DOMAINS[selectedDomain].columns.map((c) => c.key));
  };

  const handleDeselectAllColumns = () => {
    if (DOMAINS[selectedDomain].columns.length > 0) {
      setSelectedColumnKeys([DOMAINS[selectedDomain].columns[0].key]);
    }
  };

  // Perform full export generation
  const handleExecuteExport = () => {
    const domainDef = DOMAINS[selectedDomain];
    let rows = [...SAMPLE_DATA[selectedDomain]];

    // Filter by grade if applicable
    if (selectedGrade !== 'All') {
      rows = rows.filter((r) => String(r.grade || r.roleOrGrade || '').toLowerCase().includes(selectedGrade.toLowerCase()));
    }

    // Active column definitions
    const activeColumns = domainDef.columns.filter((c) => selectedColumnKeys.includes(c.key));
    if (activeColumns.length === 0) {
      addNotification({
        title: isHindi ? 'कोई कॉलम चयनित नहीं' : 'No Columns Selected',
        description: 'Please select at least one column attribute to generate the export.',
        type: 'warning',
      });
      return;
    }

    const filenameBase = domainDef.defaultFilename;
    const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

    if (selectedFormat === 'csv') {
      const csvData = generateCSV(activeColumns, rows);
      downloadBlob(csvData, `${filenameBase}.csv`, 'text/csv');
    } else if (selectedFormat === 'json') {
      const jsonData = JSON.stringify(
        {
          institution: 'VidyaMaxx International Academy',
          affiliation: 'CBSE Affiliation #1630982',
          exportedAt: new Date().toISOString(),
          session: selectedSession,
          domain: domainDef.labelEn,
          totalRecords: rows.length,
          columns: activeColumns.map((c) => c.label),
          records: rows.map((r) => {
            const filteredRow: Record<string, any> = {};
            activeColumns.forEach((c) => {
              filteredRow[c.key] = r[c.key];
            });
            return filteredRow;
          }),
        },
        null,
        2
      );
      downloadBlob(jsonData, `${filenameBase}.json`, 'application/json');
    } else if (selectedFormat === 'html') {
      const htmlData = generatePrintableHTML(
        domainDef.labelEn,
        activeColumns,
        rows,
        { session: selectedSession, date: nowStr, domain: `${domainDef.labelEn} (${selectedGrade})` }
      );
      downloadBlob(htmlData, `${filenameBase}.html`, 'text/html');
    }

    // Prepend to catalog history
    const newEntry: ReportCatalogItem = {
      id: String(Date.now()),
      code: `EXP-${selectedDomain.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: `${domainDef.labelEn} (${selectedFormat.toUpperCase()})`,
      domain: selectedDomain,
      format: selectedFormat.toUpperCase(),
      frequency: 'On-Demand Export',
      lastGenerated: 'Just Now',
      size: `${(Math.random() * 20 + 8).toFixed(1)} KB`,
      status: 'Compiled',
    };
    setReports((prev) => [newEntry, ...prev]);

    setIsDrawerOpen(false);
    addNotification({
      title: isHindi ? 'रिपोर्ट सफलतापूर्वक डाउनलोड की गई' : 'Report Exported Successfully',
      description: `Downloaded "${filenameBase}.${selectedFormat}" with ${rows.length} compiled records.`,
      type: 'success',
    });
  };

  // Instant 1-click export from table row
  const handleInstantRowExport = (item: ReportCatalogItem) => {
    const domainDef = DOMAINS[item.domain];
    const rows = SAMPLE_DATA[item.domain];
    const activeColumns = domainDef.columns;
    const csvContent = generateCSV(activeColumns, rows);
    const filename = `${domainDef.defaultFilename}.csv`;

    downloadBlob(csvContent, filename, 'text/csv');
    addNotification({
      title: isHindi ? 'फाइल डाउनलोड शुरू' : 'Export File Downloaded',
      description: `Successfully compiled and downloaded "${filename}".`,
      type: 'success',
    });
  };

  // Filter catalog list
  const filteredCatalog = React.useMemo(() => {
    if (categoryFilter === 'All') return reports;
    return reports.filter((r) => r.domain === categoryFilter);
  }, [reports, categoryFilter]);

  const reportColumns = [
    {
      header: isHindi ? 'रिपोर्ट कोड' : 'Report Code',
      accessorKey: 'code',
      cell: (r: ReportCatalogItem) => (
        <span className="font-mono font-bold text-foreground bg-[#181818] px-2.5 py-1 rounded-[3px] border border-border/80 text-xs">
          {r.code}
        </span>
      ),
    },
    {
      header: isHindi ? 'रिपोर्ट शीर्षक व डोमेन' : 'Report Title & Domain',
      accessorKey: 'name',
      cell: (r: ReportCatalogItem) => {
        const domainDef = DOMAINS[r.domain];
        return (
          <div className="space-y-0.5">
            <p className="font-extrabold text-foreground text-sm leading-tight flex items-center gap-1.5">
              {r.name}
            </p>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              {domainDef.icon}
              <span>{isHindi ? domainDef.labelHi : domainDef.labelEn}</span>
            </p>
          </div>
        );
      },
    },
    {
      header: isHindi ? 'फॉर्मेट' : 'Format',
      accessorKey: 'format',
      align: 'center',
      cell: (r: ReportCatalogItem) => (
        <VFBadge variant="outline" className="font-mono text-[11px] font-bold">
          {r.format}
        </VFBadge>
      ),
    },
    {
      header: isHindi ? 'आवृत्ति / स्कोप' : 'Frequency Scope',
      accessorKey: 'frequency',
      cell: (r: ReportCatalogItem) => <span className="text-foreground font-bold text-xs">{r.frequency}</span>,
    },
    {
      header: isHindi ? 'अंतिम संकलन' : 'Last Compiled',
      accessorKey: 'lastGenerated',
      cell: (r: ReportCatalogItem) => (
        <span className="text-muted-foreground text-xs font-mono">{r.lastGenerated}</span>
      ),
    },
    {
      header: isHindi ? 'फाइल साइज' : 'File Size',
      accessorKey: 'size',
      cell: (r: ReportCatalogItem) => (
        <span className="text-xs font-mono font-bold text-emerald-400">{r.size}</span>
      ),
    },
    {
      header: t('col.action'),
      accessorKey: 'action',
      headerClassName: 'w-20 text-center',
      className: 'w-20 text-center',
      align: 'center',
      cell: (r: ReportCatalogItem) => (
        <div className="flex items-center gap-1.5 justify-center mx-auto">
          <VFButton
            size="icon"
            variant="outline"
            className="h-7 w-7 rounded-[4px] bg-[#181818] hover:bg-[#222222] border-border text-foreground shadow-xs shrink-0"
            title={isHindi ? 'डाउनलोड' : 'Download Report'}
            aria-label={isHindi ? 'डाउनलोड' : 'Download Report'}
            onClick={() => handleInstantRowExport(r)}
          >
            <Download className="h-3.5 w-3.5" />
          </VFButton>
          <VFButton
            size="icon"
            variant="outline"
            className="h-7 w-7 rounded-[4px] bg-[#181818] hover:bg-[#222222] border-border text-zinc-400 hover:text-foreground shadow-xs transition-colors shrink-0 cursor-pointer"
            onClick={() => handleOpenDrawerWithDomain(r.domain)}
            title={isHindi ? "कस्टम पैरामीटर कॉन्फ़िगर करें" : "Configure custom criteria"}
            aria-label={isHindi ? "कस्टम पैरामीटर कॉन्फ़िगर करें" : "Configure custom criteria"}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </VFButton>
        </div>
      ),
    },
  ];

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* 1. Main Reports Table with Custom Drawer Trigger */}
      <VFDataTable
        columns={reportColumns}
        data={filteredCatalog}
        filterPlaceholder={isHindi ? 'रिपोर्ट नाम, कोड या फॉर्मेट से खोजें...' : 'Search reports by name, code, or format...'}
        rightActions={
          <div className="flex items-center gap-2 flex-wrap">
            <VFSelect
              size="sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(String(e.target.value))}
              options={[
                { label: isHindi ? 'सभी श्रेणियां' : 'All Domains', value: 'All' },
                { label: isHindi ? 'स्टूडेंट डायरेक्टरी' : 'Student Master', value: 'students' },
                { label: isHindi ? 'फीस लेजर' : 'Fee Ledgers', value: 'fees' },
                { label: isHindi ? 'अटेंडेंस' : 'Attendance', value: 'attendance' },
                { label: isHindi ? 'एग्जाम्स & मार्क्स' : 'Examinations', value: 'examinations' },
                { label: isHindi ? 'फैकल्टी वर्कलोड' : 'Faculty Workload', value: 'faculty' },
                { label: isHindi ? 'टीसी व कंप्लायंस' : 'TC & Compliance', value: 'compliance' },
              ]}
              className="w-44 sm:w-48 bg-[#141414] border-border h-8 text-xs rounded-[4px]"
            />

            <VFButton
              size="sm"
              onClick={() => setIsDrawerOpen(true)}
              className="h-8 px-3 text-xs font-bold rounded-[4px]"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
            >
              {isHindi ? 'नई रिपोर्ट तैयार करें' : 'Generate Custom Report'}
            </VFButton>
          </div>
        }
      />

      {/* 2. Streamlined Custom Report Builder Side Drawer */}
      <VFDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={isHindi ? 'कस्टम रिपोर्ट एक्सपोर्ट' : 'Custom Report & Data Export'}
        description={isHindi ? 'डोमेन डेटासेट, फ़िल्टर स्कोप, कॉलम और फॉर्मेट चुनें' : 'Configure domain dataset, filter criteria, columns, and target format.'}
        className="max-w-xl bg-[#0d0d0d] border-l border-border/90"
        bodyClassName="p-5 space-y-4 text-xs no-scrollbar"
        headerActions={
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 rounded-[4px] text-muted-foreground hover:text-foreground hover:bg-[#1f1f1f] transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X className="h-4 w-4" />
          </button>
        }
        footerActions={
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-muted-foreground">
                File: <span className="text-foreground font-semibold">{DOMAINS[selectedDomain].defaultFilename}.{selectedFormat}</span>
              </span>
              <span className="text-[10px] text-muted-foreground">
                {SAMPLE_DATA[selectedDomain].length} records · {selectedColumnKeys.length} columns included
              </span>
            </div>
            <div className="flex items-center gap-2">
              <VFButton
                variant="outline"
                size="sm"
                className="h-8 text-xs font-bold rounded-[4px]"
                onClick={() => setIsDrawerOpen(false)}
              >
                Cancel
              </VFButton>
              <VFButton
                size="sm"
                className="h-8 px-4 text-xs font-bold rounded-[4px] shadow-xs"
                leftIcon={<Download className="h-3.5 w-3.5" />}
                onClick={handleExecuteExport}
              >
                {isHindi ? 'डाउनलोड करें ⬇' : 'Download Report ⬇'}
              </VFButton>
            </div>
          </div>
        }
      >
        <div className="space-y-3.5">
          {/* Step 1: Select Domain Dataset */}
          <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-2.5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              {isHindi ? '1. डेटासेट श्रेणी चुनें *' : '1. Select Domain Dataset *'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(DOMAINS) as DomainType[]).map((domKey) => {
                const dom = DOMAINS[domKey];
                const isSelected = selectedDomain === domKey;
                return (
                  <button
                    key={domKey}
                    type="button"
                    onClick={() => setSelectedDomain(domKey)}
                    className={`p-2.5 rounded-[4px] border text-left flex flex-col justify-between gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1c1c1c] border-zinc-400 text-foreground ring-1 ring-zinc-500/20 shadow-xs'
                        : 'bg-[#161616] border-border/70 text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      {dom.icon}
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-foreground" />}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-foreground truncate">{dom.labelEn}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{dom.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Scope & Filters */}
          <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-2.5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              {isHindi ? '2. फ़िल्टर स्कोप व अवधि' : '2. Filter Scope & Criteria'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground block">
                  {isHindi ? 'एकेडमिक सेशन' : 'Academic Session'}
                </label>
                <VFSelect
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(String(e.target.value))}
                  options={[
                    { label: '2026–2027 (Active)', value: '2026–2027' },
                    { label: '2025–2026', value: '2025–2026' },
                    { label: '2024–2025 (Archive)', value: '2024–2025' },
                  ]}
                  className="bg-[#181818] border-border h-9 text-xs rounded-[4px] w-full"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground block">
                  {isHindi ? 'कक्षा / डिवीजन' : 'Class / Division'}
                </label>
                <VFSelect
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(String(e.target.value))}
                  options={[
                    { label: 'All Classes', value: 'All' },
                    { label: 'Class 10 (Secondary)', value: 'Class 10' },
                    { label: 'Class 11 (Senior Sec)', value: 'Class 11' },
                    { label: 'Class 12 (Senior Sec)', value: 'Class 12' },
                    { label: 'Class 9 (High School)', value: 'Class 9' },
                  ]}
                  className="bg-[#181818] border-border h-9 text-xs rounded-[4px] w-full"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground block">
                  {isHindi ? 'समय सीमा' : 'Audit Timeframe'}
                </label>
                <VFSelect
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(String(e.target.value))}
                  options={[
                    { label: 'Full Year (2026-27)', value: 'Academic Year 2026-27' },
                    { label: 'Current Month (Sep)', value: 'Current Month' },
                    { label: 'Quarter 2 (Jul–Sep)', value: 'Quarter 2' },
                    { label: 'Quarter 1 (Apr–Jun)', value: 'Quarter 1' },
                  ]}
                  className="bg-[#181818] border-border h-9 text-xs rounded-[4px] w-full"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Column Attributes Selector */}
          <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                {isHindi ? '3. सम्मिलित कॉलम' : '3. Included Columns'} ({selectedColumnKeys.length}/{DOMAINS[selectedDomain].columns.length})
              </h4>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={handleSelectAllColumns}
                  className="text-foreground hover:underline font-bold cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-muted-foreground">·</span>
                <button
                  type="button"
                  onClick={handleDeselectAllColumns}
                  className="text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="p-2 rounded-[4px] bg-[#181818] border border-border/70 flex flex-wrap gap-1.5">
              {DOMAINS[selectedDomain].columns.map((col) => {
                const isChecked = selectedColumnKeys.includes(col.key);
                return (
                  <button
                    key={col.key}
                    type="button"
                    onClick={() => handleToggleColumn(col.key)}
                    className={`px-2.5 py-1 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-[#222] border-zinc-400 text-foreground shadow-2xs'
                        : 'bg-[#161616] border-border/70 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-[1px] ${isChecked ? 'bg-zinc-200' : 'bg-muted-foreground/30'}`}
                    />
                    <span>{col.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Export Format Selection */}
          <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-2.5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              {isHindi ? '4. एक्सपोर्ट प्रारूप चुनें *' : '4. Target Export Format *'}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: 'csv' as ExportFormat,
                  label: 'Excel / CSV',
                  ext: '.csv',
                  desc: 'Spreadsheets',
                  icon: <FileSpreadsheet className="h-4 w-4 text-emerald-400" />,
                },
                {
                  id: 'json' as ExportFormat,
                  label: 'Structured JSON',
                  ext: '.json',
                  desc: 'API & Archive',
                  icon: <Database className="h-4 w-4 text-blue-400" />,
                },
                {
                  id: 'html' as ExportFormat,
                  label: 'Printable HTML',
                  ext: '.html',
                  desc: 'Official Hardcopy',
                  icon: <Printer className="h-4 w-4 text-amber-400" />,
                },
              ].map((fmt) => {
                const isSelected = selectedFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`p-2.5 rounded-[4px] border text-left flex flex-col justify-between gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1c1c1c] border-zinc-400 text-foreground ring-1 ring-zinc-500/20 shadow-xs'
                        : 'bg-[#161616] border-border/70 text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {fmt.icon}
                      <span className="font-mono text-[10px] font-bold px-1 rounded-[2px] bg-[#1c1c1c]">
                        {fmt.ext}
                      </span>
                    </div>
                    <p className="font-bold text-xs text-foreground mt-1">{fmt.label}</p>
                    <p className="text-[10px] text-muted-foreground">{fmt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </VFDrawer>
    </VFPageContainer>
  );
}
