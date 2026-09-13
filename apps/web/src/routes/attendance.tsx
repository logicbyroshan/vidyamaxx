import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFButton,
  VFSelect,
  VFInput,
  VFBadge,
  VFStatCard,
  VFDataTable,
  VFDrawer,
  cn,
} from '@vidyamaxx/ui';
import {
  CheckSquare,
  Send,
  MessageSquare,
  UserCheck,
  UserX,
  Clock,
  FileCheck,
  Check,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Printer,
  Plus,
  FileText,
  Paperclip,
  CheckCircle2,
  CalendarDays,
  ExternalLink,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/attendance')({
  component: AttendancePage,
});

export interface LeaveRecord {
  id: string;
  type: 'Medical' | 'Casual' | 'Family' | 'Duty';
  reason: string;
  dates: string;
  appliedOn: string;
  isApproved: boolean;
  documentName?: string;
  documentPhotoUrl?: string;
  approvedBy?: string;
}

export type DayStatus = 'Present' | 'Absent' | 'Late' | 'Leave' | 'Holiday' | 'Future';

export interface DayActivityBox {
  dayNumber: number;
  dateStr: string;
  dayName: string;
  dayOfWeek: number; // 0=Mon, 6=Sun
  status: DayStatus;
  punchIn?: string;
  punchOut?: string;
  note?: string;
}

export interface MonthActivity {
  monthIndex: number; // 0=Apr, 1=May, 2=Jun, 3=Jul, 4=Aug, 5=Sep
  monthName: string;
  year: number;
  startOffset: number; // Mon=0, Sun=6 offset for 1st day of month
  totalSchoolDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  leaveDays: number;
  rate: number;
  days: DayActivityBox[];
}

export interface StudentAttendanceRecord {
  id: string;
  rollNo: string;
  admNo: string;
  name: string;
  photoUrl?: string;
  class: string;
  phone: string;
  guardianName: string;
  status: 'Present' | 'Absent' | 'Late' | 'Leave';
  punchTime?: string;
  stats: {
    presentDays: number;
    absentDays: number;
    lateDays: number;
    leaveDays: number;
    attendanceRate: number;
  };
  leaves: LeaveRecord[];
  monthlyHeatmap: MonthActivity[];
}

// Generate calendar days with 7-column Mon-Sun grid offset
function generateMonthCalendar(monthIndex: number, year: number, studentSeed: number): MonthActivity {
  const monthNames = ['April', 'May', 'June', 'July', 'August', 'September'];
  const monthDaysCount = [30, 31, 30, 31, 31, 30];
  const actualMonth = monthIndex + 3; // 0=April (month 3 in 0-indexed Date), etc.
  const daysInMonth = monthDaysCount[monthIndex] || 30;
  const monthName = monthNames[monthIndex] || 'August';

  // Calculate day of week for 1st of month (0=Sun, 1=Mon ... 6=Sat)
  const firstDay = new Date(year, actualMonth, 1).getDay();
  // Mon-first offset (Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6)
  const startOffset = (firstDay + 6) % 7;

  const days: DayActivityBox[] = [];
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let leaveCount = 0;
  let schoolDays = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const dayDate = new Date(year, actualMonth, d);
    const rawDow = dayDate.getDay();
    const dayOfWeek = (rawDow + 6) % 7; // Mon=0 .. Sun=6
    const isSunday = rawDow === 0;
    const isSaturday = rawDow === 6;
    const isWeekend = isSunday || (isSaturday && d >= 8 && d <= 14); // 2nd Sat off
    const dateStr = `${year}-${String(actualMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayOfWeek];

    if (isWeekend) {
      days.push({
        dayNumber: d,
        dateStr,
        dayName,
        dayOfWeek,
        status: 'Holiday',
        note: isSunday ? 'Sunday Holiday' : '2nd Saturday Break',
      });
      continue;
    }

    // Summer vacation break in May
    if (monthIndex === 1 && d >= 15) {
      days.push({
        dayNumber: d,
        dateStr,
        dayName,
        dayOfWeek,
        status: 'Holiday',
        note: 'Summer Vacation',
      });
      continue;
    }

    // Future dates past Aug 20
    if (monthIndex === 4 && d > 20) {
      days.push({
        dayNumber: d,
        dateStr,
        dayName,
        dayOfWeek,
        status: 'Future',
        note: 'Upcoming School Day',
      });
      continue;
    }

    if (monthIndex === 5) {
      days.push({
        dayNumber: d,
        dateStr,
        dayName,
        dayOfWeek,
        status: 'Future',
        note: 'Term 2 Scheduled Day',
      });
      continue;
    }

    schoolDays++;

    const rand = (d * 19 + studentSeed * 29 + monthIndex * 37) % 100;
    let status: DayStatus = 'Present';
    let punchIn: string | undefined = '08:02 AM';
    let punchOut: string | undefined = '02:30 PM';
    let note = 'Gate Punch Verified';

    if (rand < 4) {
      status = 'Absent';
      punchIn = undefined;
      punchOut = undefined;
      note = 'Uninformed Absence';
      absentCount++;
    } else if (rand < 8) {
      status = 'Late';
      punchIn = '08:22 AM';
      note = 'Late Gate Arrival';
      lateCount++;
    } else if (rand < 12) {
      status = 'Leave';
      punchIn = undefined;
      punchOut = undefined;
      note = 'Sanctioned Leave';
      leaveCount++;
    } else {
      presentCount++;
    }

    days.push({
      dayNumber: d,
      dateStr,
      dayName,
      dayOfWeek,
      status,
      punchIn,
      punchOut,
      note,
    });
  }

  const rate = schoolDays > 0 ? Number(((presentCount / schoolDays) * 100).toFixed(1)) : 100;

  return {
    monthIndex,
    monthName,
    year,
    startOffset,
    totalSchoolDays: schoolDays,
    presentDays: presentCount,
    absentDays: absentCount,
    lateDays: lateCount,
    leaveDays: leaveCount,
    rate,
    days,
  };
}

// 20 Full Realistic Class 8-A Student Records
const INITIAL_ROSTER: StudentAttendanceRecord[] = [
  {
    id: '1',
    rollNo: '801',
    admNo: 'ADM-2026-0801',
    name: 'Rahul Sharma',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 98765 43210',
    guardianName: 'Rajesh Sharma',
    status: 'Present',
    punchTime: '08:02 AM',
    stats: { presentDays: 92, absentDays: 2, lateDays: 1, leaveDays: 2, attendanceRate: 96.8 },
    leaves: [
      {
        id: 'L-1',
        type: 'Medical',
        reason: 'Viral Fever & Doctor Advised Rest',
        dates: 'Jul 12 – Jul 14, 2026',
        appliedOn: 'Jul 11, 2026',
        isApproved: true,
        documentName: 'Medical_Prescription_DrMehta.pdf',
        documentPhotoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80',
        approvedBy: 'Dr. Rajesh Sharma (Head of Science)',
      },
    ],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 1)),
  },
  {
    id: '2',
    rollNo: '802',
    admNo: 'ADM-2026-0802',
    name: 'Amit Patel',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 98123 45678',
    guardianName: 'Dinesh Patel',
    status: 'Absent',
    stats: { presentDays: 78, absentDays: 12, lateDays: 4, leaveDays: 3, attendanceRate: 80.4 },
    leaves: [],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 2)),
  },
  {
    id: '3',
    rollNo: '803',
    admNo: 'ADM-2026-0803',
    name: 'Neha Jain',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 97654 32109',
    guardianName: 'Sunita Jain',
    status: 'Present',
    punchTime: '08:05 AM',
    stats: { presentDays: 94, absentDays: 1, lateDays: 0, leaveDays: 2, attendanceRate: 98.2 },
    leaves: [
      {
        id: 'L-2',
        type: 'Casual',
        reason: 'National Olympiad Representation in Bangalore',
        dates: 'Jun 10 – Jun 12, 2026',
        appliedOn: 'Jun 05, 2026',
        isApproved: true,
        documentName: 'Olympiad_Invitation_Letter.pdf',
        documentPhotoUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=400&auto=format&fit=crop&q=80',
        approvedBy: 'Principal Office',
      },
    ],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 3)),
  },
  {
    id: '4',
    rollNo: '804',
    admNo: 'ADM-2026-0804',
    name: 'Riya Singh',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 99887 76655',
    guardianName: 'Vikram Singh',
    status: 'Late',
    punchTime: '08:24 AM',
    stats: { presentDays: 86, absentDays: 4, lateDays: 5, leaveDays: 2, attendanceRate: 88.6 },
    leaves: [],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 4)),
  },
  {
    id: '5',
    rollNo: '805',
    admNo: 'ADM-2026-0805',
    name: 'Vikas Kumar',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 98234 56789',
    guardianName: 'Sanjay Kumar',
    status: 'Present',
    punchTime: '07:58 AM',
    stats: { presentDays: 95, absentDays: 0, lateDays: 1, leaveDays: 1, attendanceRate: 99.0 },
    leaves: [],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 5)),
  },
  {
    id: '6',
    rollNo: '806',
    admNo: 'ADM-2026-0806',
    name: 'Kavya Nair',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 98451 23456',
    guardianName: 'Suresh Nair',
    status: 'Leave',
    stats: { presentDays: 89, absentDays: 2, lateDays: 1, leaveDays: 5, attendanceRate: 92.5 },
    leaves: [
      {
        id: 'L-3',
        type: 'Medical',
        reason: 'Specialist Medical Checkup & Blood Diagnostics',
        dates: 'Aug 20 – Aug 21, 2026',
        appliedOn: 'Aug 19, 2026',
        isApproved: false,
        documentName: 'Clinic_Appointment_Slip_Nair.pdf',
        documentPhotoUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80',
      },
    ],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 6)),
  },
  {
    id: '7',
    rollNo: '807',
    admNo: 'ADM-2026-0807',
    name: 'Aditya Verma',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 97112 34567',
    guardianName: 'Arun Verma',
    status: 'Leave',
    stats: { presentDays: 91, absentDays: 1, lateDays: 0, leaveDays: 4, attendanceRate: 95.0 },
    leaves: [
      {
        id: 'L-4',
        type: 'Family',
        reason: 'Elder Sibling Wedding in Jaipur (Outstation Travel)',
        dates: 'Aug 20 – Aug 23, 2026',
        appliedOn: 'Aug 15, 2026',
        isApproved: true,
        documentName: 'Wedding_Invitation_Parent_Letter.pdf',
        documentPhotoUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&auto=format&fit=crop&q=80',
        approvedBy: 'Class Teacher & Principal',
      },
    ],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 7)),
  },
  {
    id: '8',
    rollNo: '808',
    admNo: 'ADM-2026-0808',
    name: 'Diya Sengupta',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 98301 23456',
    guardianName: 'Amit Sengupta',
    status: 'Present',
    punchTime: '08:01 AM',
    stats: { presentDays: 93, absentDays: 1, lateDays: 1, leaveDays: 2, attendanceRate: 97.4 },
    leaves: [],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 8)),
  },
  {
    id: '9',
    rollNo: '809',
    admNo: 'ADM-2026-0809',
    name: 'Kabir Singhania',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 98105 67890',
    guardianName: 'Pooja Singhania',
    status: 'Present',
    punchTime: '08:00 AM',
    stats: { presentDays: 90, absentDays: 3, lateDays: 2, leaveDays: 1, attendanceRate: 94.2 },
    leaves: [],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 9)),
  },
  {
    id: '10',
    rollNo: '810',
    admNo: 'ADM-2026-0810',
    name: 'Meera Iyer',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 98450 11223',
    guardianName: 'Narayanan Iyer',
    status: 'Present',
    punchTime: '07:55 AM',
    stats: { presentDays: 96, absentDays: 0, lateDays: 0, leaveDays: 1, attendanceRate: 99.2 },
    leaves: [],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 10)),
  },
  {
    id: '11',
    rollNo: '811',
    admNo: 'ADM-2026-0811',
    name: 'Tanmay Deshmukh',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 99304 55667',
    guardianName: 'Sanjay Deshmukh',
    status: 'Present',
    punchTime: '08:04 AM',
    stats: { presentDays: 91, absentDays: 2, lateDays: 3, leaveDays: 1, attendanceRate: 95.0 },
    leaves: [],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 11)),
  },
  {
    id: '12',
    rollNo: '812',
    admNo: 'ADM-2026-0812',
    name: 'Ananya Rao',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 98801 22334',
    guardianName: 'Srinivas Rao',
    status: 'Present',
    punchTime: '08:03 AM',
    stats: { presentDays: 93, absentDays: 1, lateDays: 1, leaveDays: 2, attendanceRate: 97.0 },
    leaves: [],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 12)),
  },
  {
    id: '13',
    rollNo: '813',
    admNo: 'ADM-2026-0813',
    name: 'Rohan Mehra',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 98111 44556',
    guardianName: 'Ashok Mehra',
    status: 'Late',
    punchTime: '08:18 AM',
    stats: { presentDays: 88, absentDays: 3, lateDays: 6, leaveDays: 1, attendanceRate: 91.2 },
    leaves: [],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 13)),
  },
  {
    id: '14',
    rollNo: '814',
    admNo: 'ADM-2026-0814',
    name: 'Ishita Ganguly',
    photoUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 98310 99887',
    guardianName: 'Debabrata Ganguly',
    status: 'Present',
    punchTime: '08:00 AM',
    stats: { presentDays: 94, absentDays: 1, lateDays: 0, leaveDays: 2, attendanceRate: 98.0 },
    leaves: [],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 14)),
  },
  {
    id: '15',
    rollNo: '815',
    admNo: 'ADM-2026-0815',
    name: 'Varun Chopra',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 98712 33445',
    guardianName: 'Kishore Chopra',
    status: 'Present',
    punchTime: '08:02 AM',
    stats: { presentDays: 92, absentDays: 2, lateDays: 2, leaveDays: 1, attendanceRate: 95.8 },
    leaves: [],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 15)),
  },
  {
    id: '16',
    rollNo: '816',
    admNo: 'ADM-2026-0816',
    name: 'Pooja Bhatt',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 98200 66778',
    guardianName: 'Mahesh Bhatt',
    status: 'Present',
    punchTime: '07:56 AM',
    stats: { presentDays: 95, absentDays: 0, lateDays: 1, leaveDays: 1, attendanceRate: 99.0 },
    leaves: [],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 16)),
  },
  {
    id: '17',
    rollNo: '817',
    admNo: 'ADM-2026-0817',
    name: 'Siddharth Menon',
    photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 98480 33445',
    guardianName: 'Gopal Menon',
    status: 'Absent',
    stats: { presentDays: 82, absentDays: 8, lateDays: 3, leaveDays: 3, attendanceRate: 85.4 },
    leaves: [],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 17)),
  },
  {
    id: '18',
    rollNo: '818',
    admNo: 'ADM-2026-0818',
    name: 'Tanya Kapoor',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 98199 11223',
    guardianName: 'Rajeev Kapoor',
    status: 'Present',
    punchTime: '08:01 AM',
    stats: { presentDays: 93, absentDays: 1, lateDays: 1, leaveDays: 2, attendanceRate: 97.2 },
    leaves: [],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 18)),
  },
  {
    id: '19',
    rollNo: '819',
    admNo: 'ADM-2026-0819',
    name: 'Karan Malhotra',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 98100 55667',
    guardianName: 'Prem Malhotra',
    status: 'Present',
    punchTime: '08:06 AM',
    stats: { presentDays: 91, absentDays: 2, lateDays: 3, leaveDays: 1, attendanceRate: 94.8 },
    leaves: [],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 19)),
  },
  {
    id: '20',
    rollNo: '820',
    admNo: 'ADM-2026-0820',
    name: 'Sneha Kulkarni',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    class: 'Class 8-A',
    phone: '+91 98220 88990',
    guardianName: 'Anand Kulkarni',
    status: 'Present',
    punchTime: '08:00 AM',
    stats: { presentDays: 94, absentDays: 1, lateDays: 0, leaveDays: 2, attendanceRate: 98.4 },
    leaves: [],
    monthlyHeatmap: [0, 1, 2, 3, 4, 5].map((m) => generateMonthCalendar(m, 2026, 20)),
  },
];

function AttendancePage() {
  const { addNotification } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  React.useEffect(() => { document.title = t('page.attendance') + ' \u2013 VidyaMaxx'; }, [t]);
  const [selectedClass, setSelectedClass] = React.useState<string>('Class 8-A');
  const [selectedDate] = React.useState<string>('2026-08-20');
  const [studentRoster, setStudentRoster] = React.useState<StudentAttendanceRecord[]>(INITIAL_ROSTER);

  // Drawer States
  const [selectedStudentIndex, setSelectedStudentIndex] = React.useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
  const [drawerActiveTab, setDrawerActiveTab] = React.useState<'heatmap' | 'leaves'>('heatmap');
  const [isApplyingNewLeave, setIsApplyingNewLeave] = React.useState<boolean>(false);
  const [newLeaveType, setNewLeaveType] = React.useState<'Medical' | 'Casual' | 'Family' | 'Duty'>('Medical');
  const [newLeaveDates, setNewLeaveDates] = React.useState<string>('Aug 21 – Aug 22, 2026');
  const [newLeaveReason, setNewLeaveReason] = React.useState<string>('');

  // Selected Heatmap Day for inspection detail
  const [inspectedDay, setInspectedDay] = React.useState<DayActivityBox | null>(null);

  // Lightbox Modal for Leave Document Proof
  const [previewingProof, setPreviewingProof] = React.useState<{
    url: string;
    title: string;
    studentName: string;
    dates: string;
    reason: string;
    type: string;
  } | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewingProof) {
        setPreviewingProof(null);
      }
    };
    if (previewingProof) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [previewingProof]);

  const activeStudent =
    selectedStudentIndex !== null && selectedStudentIndex >= 0 && selectedStudentIndex < studentRoster.length
      ? studentRoster[selectedStudentIndex]
      : null;

  const openStudentDrawer = (student: StudentAttendanceRecord) => {
    const idx = studentRoster.findIndex((s) => s.id === student.id);
    setSelectedStudentIndex(idx >= 0 ? idx : 0);
    setIsApplyingNewLeave(false);
    setInspectedDay(null);
    setIsDrawerOpen(true);
  };

  const handlePrevStudent = () => {
    if (selectedStudentIndex !== null && selectedStudentIndex > 0) {
      setSelectedStudentIndex(selectedStudentIndex - 1);
      setIsApplyingNewLeave(false);
      setInspectedDay(null);
    }
  };

  const handleNextStudent = () => {
    if (selectedStudentIndex !== null && selectedStudentIndex < studentRoster.length - 1) {
      setSelectedStudentIndex(selectedStudentIndex + 1);
      setIsApplyingNewLeave(false);
      setInspectedDay(null);
    }
  };

  const handleMarkAllPresent = () => {
    setStudentRoster((prev) =>
      prev.map((s) =>
        s.status === 'Leave' && s.leaves.some((l) => l.isApproved)
          ? s
          : { ...s, status: 'Present', punchTime: '08:00 AM' }
      )
    );
    addNotification({
      title: 'Roll Call Updated',
      description: `All active students in ${selectedClass} marked Present for ${selectedDate}.`,
      type: 'success',
    });
  };

  const handleStatusToggle = (id: string, newStatus: 'Present' | 'Absent' | 'Late' | 'Leave') => {
    setStudentRoster((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return {
          ...s,
          status: newStatus,
          punchTime: newStatus === 'Present' ? s.punchTime || '08:00 AM' : newStatus === 'Late' ? '08:20 AM' : undefined,
        };
      })
    );
  };

  const handleApproveLeaveInDrawer = (leaveId: string) => {
    if (!activeStudent) return;
    const updatedLeaves = activeStudent.leaves.map((l) =>
      l.id === leaveId ? { ...l, isApproved: true, approvedBy: 'Authorized Administrator' } : l
    );
    setStudentRoster((prev) =>
      prev.map((s) => (s.id === activeStudent.id ? { ...s, status: 'Leave', leaves: updatedLeaves } : s))
    );
    addNotification({
      title: 'Leave Sanctioned',
      description: `Official leave granted for ${activeStudent.name}. Roster updated.`,
      type: 'success',
    });
  };

  const handleRejectLeaveInDrawer = (leaveId: string) => {
    if (!activeStudent) return;
    const updatedLeaves = activeStudent.leaves.filter((l) => l.id !== leaveId);
    setStudentRoster((prev) =>
      prev.map((s) => (s.id === activeStudent.id ? { ...s, status: 'Absent', leaves: updatedLeaves } : s))
    );
    addNotification({
      title: 'Leave Request Rejected',
      description: `Application declined. ${activeStudent.name} is marked as Absent.`,
      type: 'info',
    });
  };

  const handleGrantNewLeave = () => {
    if (!activeStudent || !newLeaveReason.trim()) {
      alert('Please enter a valid reason for the leave slip.');
      return;
    }

    const newLeave: LeaveRecord = {
      id: `L-${Date.now()}`,
      type: newLeaveType,
      reason: newLeaveReason.trim(),
      dates: newLeaveDates,
      appliedOn: 'Today',
      isApproved: true,
      documentName: `${newLeaveType}_Leave_Grant_Slip.pdf`,
      documentPhotoUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80',
      approvedBy: 'Direct Administrator Grant',
    };

    setStudentRoster((prev) =>
      prev.map((s) =>
        s.id === activeStudent.id
          ? {
              ...s,
              status: 'Leave',
              leaves: [newLeave, ...s.leaves],
            }
          : s
      )
    );

    setIsApplyingNewLeave(false);
    setNewLeaveReason('');
    addNotification({
      title: 'Leave Granted',
      description: `New ${newLeaveType} leave sanctioned for ${activeStudent.name}.`,
      type: 'success',
    });
  };

  const presentCount = studentRoster.filter((s) => s.status === 'Present').length;
  const absentCount = studentRoster.filter((s) => s.status === 'Absent').length;
  const lateCount = studentRoster.filter((s) => s.status === 'Late').length;
  const leaveCount = studentRoster.filter((s) => s.status === 'Leave').length;
  const pendingLeaves = studentRoster.reduce(
    (acc, s) => acc + s.leaves.filter((l) => !l.isApproved).length,
    0
  );
  const attendanceRate = ((presentCount / studentRoster.length) * 100).toFixed(1);

  // Clean, perfectly proportioned table columns with standardized h-8 heights & rounded-md tokens
  const attendanceColumns = [
    {
      header: isHindi ? 'फोटो' : 'Photo',
      accessorKey: 'photo',
      headerClassName: 'w-16 text-center',
      className: 'w-16 text-center px-3',
      sortable: false,
      cell: (r: StudentAttendanceRecord) => (
        <div className="flex items-center justify-center">
          <div
            className="h-9 w-7.5 rounded overflow-hidden bg-muted border border-border shrink-0 shadow-2xs group cursor-pointer"
            onClick={() => openStudentDrawer(r)}
            title={isHindi ? "स्टूडेंट अटेंडेंस प्रोफाइल देखें" : "View Student Attendance Dossier"}
          >
            {r.photoUrl ? (
              <img
                src={r.photoUrl}
                alt={r.name}
                style={{ aspectRatio: '19.5 / 25' }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div
                style={{ aspectRatio: '19.5 / 25' }}
                className="w-full h-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center border border-primary/20"
              >
                {r.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: t('col.roll'),
      accessorKey: 'rollNo',
      headerClassName: 'w-24 text-center',
      className: 'w-24 text-center px-3',
      cell: (r: StudentAttendanceRecord) => (
        <div className="flex items-center justify-center">
          <span className="h-8 min-w-10 px-2.5 rounded-md border border-border bg-muted/60 text-foreground font-mono font-bold text-xs flex items-center justify-center">
            {r.rollNo}
          </span>
        </div>
      ),
    },
    {
      header: isHindi ? 'स्टूडेंट का नाम & एडमिशन नं.' : 'Student Name & Admission ID',
      accessorKey: 'name',
      headerClassName: 'w-[45%] min-w-[320px]',
      className: 'w-[45%] min-w-[320px]',
      cell: (r: StudentAttendanceRecord) => (
        <div className="flex items-center gap-3">
          <div
            onClick={() => openStudentDrawer(r)}
            className="overflow-hidden rounded-md border border-border/80 shadow-xs w-10 h-[50px] bg-muted shrink-0 cursor-pointer hover:border-foreground/40 transition-colors flex items-center justify-center"
            title={isHindi ? "अटेंडेंस & लीव्स देखें" : "Click to view Attendance & Leaves"}
          >
            <img src={r.photoUrl} alt={r.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <button
              onClick={() => openStudentDrawer(r)}
              className="text-left font-extrabold text-foreground hover:text-primary transition-colors cursor-pointer text-sm leading-tight block truncate tracking-tight"
            >
              {r.name}
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mt-1">
              <span className="font-mono text-[11px] font-semibold text-foreground/80">{r.admNo}</span>
              <span>•</span>
              <span className="font-semibold text-foreground/70">{r.class}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: t('attendance.todayStatus'),
      accessorKey: 'status',
      headerClassName: 'w-[40%] min-w-[380px]',
      className: 'w-[40%] min-w-[380px]',
      cell: (r: StudentAttendanceRecord) => (
        <div className="inline-flex items-center h-8 p-0.5 rounded-md bg-muted/50 border border-border gap-1 select-none w-full max-w-[380px]">
          {/* 1. Present */}
          <button
            type="button"
            onClick={() => handleStatusToggle(r.id, 'Present')}
            className={cn(
              'flex-1 h-7 rounded px-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
              r.status === 'Present'
                ? 'bg-emerald-500 text-white shadow-xs font-extrabold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
            )}
            title="Mark Present"
          >
            <Check className={cn('h-3.5 w-3.5', r.status === 'Present' ? 'text-white stroke-[3]' : 'text-emerald-500/70')} />
            <span>{t('attendance.present')}</span>
          </button>

          {/* 2. Absent */}
          <button
            type="button"
            onClick={() => handleStatusToggle(r.id, 'Absent')}
            className={cn(
              'flex-1 h-7 rounded px-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
              r.status === 'Absent'
                ? 'bg-rose-500 text-white shadow-xs font-extrabold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
            )}
            title="Mark Absent"
          >
            <X className={cn('h-3.5 w-3.5', r.status === 'Absent' ? 'text-white stroke-[3]' : 'text-rose-500/70')} />
            <span>{t('attendance.absent')}</span>
          </button>

          {/* 3. Late */}
          <button
            type="button"
            onClick={() => handleStatusToggle(r.id, 'Late')}
            className={cn(
              'flex-1 h-7 rounded px-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
              r.status === 'Late'
                ? 'bg-amber-500 text-black shadow-xs font-extrabold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
            )}
            title="Mark Late Arrival"
          >
            <Clock className={cn('h-3.5 w-3.5', r.status === 'Late' ? 'text-black stroke-[2.5]' : 'text-amber-500/70')} />
            <span>{t('attendance.late')}</span>
          </button>

          {/* 4. Leave */}
          <button
            type="button"
            onClick={() => handleStatusToggle(r.id, 'Leave')}
            className={cn(
              'flex-1 h-7 rounded px-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
              r.status === 'Leave'
                ? 'bg-indigo-600 text-white shadow-xs font-extrabold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
            )}
            title="Mark On Leave"
          >
            <FileText className={cn('h-3.5 w-3.5', r.status === 'Leave' ? 'text-white stroke-[2.5]' : 'text-indigo-400/70')} />
            <span>{t('status.exempted')}</span>
          </button>
        </div>
      ),
    },
    {
      header: t('col.action'),
      accessorKey: 'action',
      headerClassName: 'w-16 text-center',
      className: 'w-16 text-center px-2',
      align: 'center',
      sortable: false,
      cell: (r: StudentAttendanceRecord) => (
        <VFButton
          size="icon"
          variant="outline"
          className="h-7 w-7 border-border hover:border-zinc-500 rounded-[4px]"
          title={isHindi ? 'अटेंडेंस देखें' : t('attendance.title')}
          aria-label={isHindi ? 'अटेंडेंस देखें' : t('attendance.title')}
          onClick={() => openStudentDrawer(r)}
        >
          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
        </VFButton>
      ),
    },
  ];

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* 4 Actionable Attendance KPI Stat Cards (Fixed Top) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 lg:gap-4 shrink-0">
        <VFStatCard
          title={isHindi ? 'अटेंडेंस रेट' : 'Attendance Rate'}
          value={`${attendanceRate}%`}
          icon={<UserCheck className="h-5 w-5" />}
          trend="up"
          trendLabel={`${presentCount} / ${studentRoster.length} Present`}
          accentColor="emerald"
        />
        <VFStatCard
          title={isHindi ? 'एब्सेंट स्टूडेंट्स' : 'Absentees'}
          value={`${absentCount} Absent`}
          icon={<UserX className="h-5 w-5" />}
          trend={absentCount > 2 ? 'down' : 'up'}
          trendLabel={absentCount > 0 ? `${absentCount} Alert Pending` : 'Zero Absentees'}
          accentColor="rose"
        />
        <VFStatCard
          title={isHindi ? 'देर से आने वाले' : 'Late Arrivals'}
          value={`${lateCount} Late`}
          icon={<Clock className="h-5 w-5" />}
          trend="neutral"
          trendLabel="Bus Route 4 Delayed"
          accentColor="amber"
        />
        <VFStatCard
          title={isHindi ? 'स्वीकृत छुट्टियां' : 'Approved Leaves'}
          value={`${leaveCount} On Leave`}
          icon={<FileCheck className="h-5 w-5" />}
          trend={pendingLeaves > 0 ? 'down' : 'up'}
          trendLabel={pendingLeaves > 0 ? `${pendingLeaves} Pending Review` : 'All Reviewed'}
          accentColor="blue"
        />
      </div>

      {/* Main Attendance Table (Fixed Header/Stats, Content Scrolls Inside) */}
      <VFDataTable
        columns={attendanceColumns}
        data={studentRoster}
        showColumnToggle={false}
        filterPlaceholder="Search by student name, roll no, or admission ID..."
        rightActions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <VFSelect
              size="sm"
              value={selectedClass}
              onChange={(e) => setSelectedClass(String(e.target.value))}
              options={[
                { label: 'Class 8 - Section A', value: 'Class 8-A' },
                { label: 'Class 9 - Section B', value: 'Class 9-B' },
                { label: 'Class 10 - Section A', value: 'Class 10-A' },
                { label: 'Class 11 - Science', value: 'Class 11-Sci' },
                { label: 'Class 12 - Commerce', value: 'Class 12-Com' },
              ]}
              className="w-48 text-xs bg-[#181818] border-border rounded-[4px]"
            />
            <VFButton
              size="sm"
              variant="outline"
              className="rounded-[4px]"
              onClick={handleMarkAllPresent}
              leftIcon={<CheckSquare className="h-3.5 w-3.5 text-emerald-400" />}
            >
              {t('attendance.markAll')}
            </VFButton>
            <VFButton
              size="sm"
              className="rounded-[4px]"
              leftIcon={<Send className="h-3.5 w-3.5" />}
              onClick={() =>
                addNotification({
                  title: 'Absence Broadcast Sent',
                  description: `Automated WhatsApp/SMS alerts dispatched to ${absentCount} absentee parents.`,
                  type: 'info',
                })
              }
            >
              {t('action.sendReminder')}
            </VFButton>
          </div>
        }
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          STUDENT ATTENDANCE & LEAVES MANAGEMENT 360° DRAWER
          ═══════════════════════════════════════════════════════════════════════ */}
      <VFDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsApplyingNewLeave(false);
          setInspectedDay(null);
          setIsDrawerOpen(false);
        }}
        hideHeader={true}
        title={activeStudent ? activeStudent.name : 'Attendance Record'}
        className="w-[1040px] max-w-[98vw] sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
        bodyClassName="p-5 sm:p-6 space-y-4"
        footerActions={
          <div className="flex items-center justify-between w-full gap-3 flex-wrap">
            {/* Stepper Navigation */}
            <div className="flex items-center gap-1.5 bg-muted/60 p-1.5 rounded-md border border-border">
              <button
                onClick={handlePrevStudent}
                disabled={selectedStudentIndex === 0}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted cursor-pointer transition-colors"
                title="Previous Student"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-mono font-bold px-3 text-foreground select-none">
                {selectedStudentIndex !== null ? selectedStudentIndex + 1 : 1} of {studentRoster.length}
              </span>
              <button
                onClick={handleNextStudent}
                disabled={selectedStudentIndex === studentRoster.length - 1}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted cursor-pointer transition-colors"
                title="Next Student"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Right Footer Actions */}
            <div className="flex items-center gap-2.5">
              <VFButton
                variant="outline"
                size="sm"
                onClick={() => setIsDrawerOpen(false)}
              >
                {t('action.cancel')}
              </VFButton>
              <VFButton
                variant="outline"
                size="sm"
                leftIcon={<Printer className="h-4 w-4" />}
                onClick={() => window.print()}
              >
                {t('action.print')}
              </VFButton>
            </div>
          </div>
        }
      >
        {activeStudent && (
          <div className="space-y-4">
            {/* 1. Profile Header with Photo, Today's Status & Direct WhatsApp Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-card border border-border shadow-xs">
              <div className="flex items-center gap-4">
                <div className="h-20 w-16 rounded-md border border-border/90 shadow-xs overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                  {activeStudent.photoUrl ? (
                    <img
                      src={activeStudent.photoUrl}
                      alt={activeStudent.name}
                      style={{ aspectRatio: '19.5 / 25' }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      style={{ aspectRatio: '19.5 / 25' }}
                      className="w-full h-full bg-primary/10 text-primary font-black text-lg flex items-center justify-center border border-primary/20"
                    >
                      {activeStudent.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-black text-foreground tracking-tight">{activeStudent.name}</h2>
                    <VFBadge
                      variant={
                        activeStudent.status === 'Present'
                          ? 'success'
                          : activeStudent.status === 'Absent'
                          ? 'danger'
                          : activeStudent.status === 'Late'
                          ? 'warning'
                          : 'outline'
                      }
                      className="text-xs px-2.5 py-0.5"
                    >
                      Today: {activeStudent.status}
                    </VFBadge>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-muted-foreground mt-1 flex-wrap">
                    <span>Roll {activeStudent.rollNo}</span>
                    <span>•</span>
                    <span>{activeStudent.admNo}</span>
                    <span>•</span>
                    <span className="text-foreground">{activeStudent.class}</span>
                    <span>•</span>
                    <span className="text-muted-foreground font-sans font-medium">
                      Guardian: {activeStudent.guardianName} ({activeStudent.phone})
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Drawer Header */}
              <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                {activeStudent.status === 'Absent' && (
                  <button
                    onClick={() =>
                      window.open(
                        `https://wa.me/${activeStudent.phone.replace(/[^0-9]/g, '')}?text=Dear%20Parent,%20regarding%20${encodeURIComponent(
                          activeStudent.name
                        )}'s%20absence%20today%20at%20VidyaMaxx%20Academy.%20Please%20submit%20a%20leave%20slip.`,
                        '_blank'
                      )
                    }
                    className="h-9 px-3 rounded-[4px] bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    title="Send WhatsApp Absence Alert to Parent"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>WhatsApp Parent</span>
                  </button>
                )}

                {activeStudent.status === 'Leave' && (
                  <VFButton
                    size="sm"
                    variant="outline"
                    leftIcon={<FileCheck className="h-3.5 w-3.5" />}
                    onClick={() => {
                      setDrawerActiveTab('leaves');
                      setIsApplyingNewLeave(false);
                    }}
                  >
                    View Leave Slips
                  </VFButton>
                )}
              </div>
            </div>

            {/* 2. 4 Top Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-lg bg-muted/40 border border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Attendance Rate
                </span>
                <span className="text-xl font-black text-emerald-400 mt-1 block">
                  {activeStudent.stats.attendanceRate}%
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block font-medium">
                  {activeStudent.stats.presentDays} of 96 Days Present
                </span>
              </div>
              <div className="p-3.5 rounded-lg bg-muted/40 border border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Total Absences
                </span>
                <span
                  className={cn(
                    'text-xl font-black mt-1 block',
                    activeStudent.stats.absentDays > 3 ? 'text-rose-400' : 'text-foreground'
                  )}
                >
                  {activeStudent.stats.absentDays} Days
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block font-medium">This Session</span>
              </div>
              <div className="p-3.5 rounded-lg bg-muted/40 border border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Late Arrivals
                </span>
                <span className="text-xl font-black text-amber-400 mt-1 block">
                  {activeStudent.stats.lateDays} Times
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block font-medium">After 08:15 AM</span>
              </div>
              <div className="p-3.5 rounded-lg bg-muted/40 border border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Approved Leaves
                </span>
                <span className="text-xl font-black text-foreground mt-1 block">
                  {activeStudent.stats.leaveDays} Days
                </span>
                <span className="text-[10px] text-emerald-400 mt-0.5 block font-semibold">Medical & Casual</span>
              </div>
            </div>

            {/* 3. Tab Navigation: Segmented Control with Crisp Corners */}
            <div className="flex items-center p-1 rounded-md bg-muted/50 border border-border gap-1 my-1 w-fit">
              <button
                onClick={() => setDrawerActiveTab('heatmap')}
                className={cn(
                  'h-8 px-3.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-2',
                  drawerActiveTab === 'heatmap'
                    ? 'bg-card text-foreground border border-border shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{t('attendance.monthly')}</span>
              </button>
              <button
                onClick={() => setDrawerActiveTab('leaves')}
                className={cn(
                  'h-8 px-3.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-2',
                  drawerActiveTab === 'leaves'
                    ? 'bg-card text-foreground border border-border shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                <FileCheck className="h-3.5 w-3.5" />
                <span>Leave Requests & Notes ({activeStudent.leaves.length})</span>
              </button>
            </div>

            {/* 4. TAB CONTENT 1: 7-DAY CALENDAR GRID PER MONTH (SIDE-BY-SIDE MULTI-COLUMN) */}
            {drawerActiveTab === 'heatmap' && (
              <div className="space-y-4">
                {/* Visual Legend Bar with Crisp Micro-Badges */}
                <div className="flex items-center justify-between p-2.5 rounded-md bg-card border border-border shadow-xs flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mr-1">
                      Legend:
                    </span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-bold text-[11px]">
                      <span className="h-2 w-2 rounded-xs bg-emerald-500" />
                      <span>Present</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/25 text-rose-400 font-bold text-[11px]">
                      <span className="h-2 w-2 rounded-xs bg-rose-500" />
                      <span>Absent</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-amber-400 font-bold text-[11px]">
                      <span className="h-2 w-2 rounded-xs bg-amber-500" />
                      <span>Late</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 font-bold text-[11px]">
                      <span className="h-2 w-2 rounded-xs bg-indigo-500" />
                      <span>Leave</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-muted/50 border border-border text-muted-foreground font-bold text-[11px]">
                      <span className="h-2 w-2 rounded-xs bg-muted border border-border" />
                      <span>Sun / Off</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-muted-foreground">
                    Click any day box for punch details
                  </span>
                </div>

                {/* Day Inspection Callout Banner (if day is clicked) */}
                {inspectedDay && (
                  <div className="p-3 rounded-md bg-card border border-border shadow-xs flex items-center justify-between gap-3 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'h-3.5 w-3.5 rounded-xs shrink-0',
                          inspectedDay.status === 'Present' && 'bg-emerald-500',
                          inspectedDay.status === 'Absent' && 'bg-rose-500',
                          inspectedDay.status === 'Late' && 'bg-amber-500',
                          inspectedDay.status === 'Leave' && 'bg-indigo-500',
                          (inspectedDay.status === 'Holiday' || inspectedDay.status === 'Future') && 'bg-muted border border-border'
                        )}
                      />
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {inspectedDay.dateStr} ({inspectedDay.dayName}) —{' '}
                          <span
                            className={cn(
                              inspectedDay.status === 'Present'
                                ? 'text-emerald-400 font-extrabold'
                                : inspectedDay.status === 'Absent'
                                ? 'text-rose-400 font-extrabold'
                                : inspectedDay.status === 'Late'
                                ? 'text-amber-400 font-extrabold'
                                : inspectedDay.status === 'Leave'
                                ? 'text-indigo-300 font-extrabold'
                                : 'text-muted-foreground'
                            )}
                          >
                            {inspectedDay.status}
                          </span>
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                          {inspectedDay.punchIn
                            ? `Entry Punch: ${inspectedDay.punchIn} • Exit: ${inspectedDay.punchOut || '02:30 PM'}`
                            : inspectedDay.note}
                          {inspectedDay.note && inspectedDay.punchIn ? ` • ${inspectedDay.note}` : ''}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setInspectedDay(null)}
                      className="h-6 w-6 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer transition-colors"
                      title="Dismiss"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Side-by-Side Monthly Mini-Calendars (7 Days per row: Mon-Sun) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeStudent.monthlyHeatmap.map((month) => (
                    <div
                      key={month.monthName}
                      className="rounded-lg bg-card border border-border shadow-xs flex flex-col justify-between overflow-hidden"
                    >
                      {/* Full-Width Month Header */}
                      <div className="px-4 py-3 bg-muted/20 border-b border-border flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-extrabold text-foreground tracking-tight">
                            {month.monthName} {month.year}
                          </h4>
                          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                            {month.presentDays} of {month.totalSchoolDays} Days Present
                          </p>
                        </div>
                        <span
                          className={cn(
                            'text-xs font-mono font-bold px-2 py-0.5 rounded-md border select-none',
                            month.rate >= 90
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : month.rate >= 75
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          )}
                        >
                          {month.rate}%
                        </span>
                      </div>

                      {/* Month Calendar Grid Body */}
                      <div className="p-4 space-y-2">
                        {/* 7-Column Day Header (Mon, Tue, Wed, Thu, Fri, Sat, Sun) */}
                        <div className="grid grid-cols-7 gap-1.5 text-center select-none mb-1">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayHeader, idx) => (
                            <span
                              key={idx}
                              className={cn(
                                'text-[10px] font-bold uppercase py-0.5',
                                idx === 6 ? 'text-rose-400/80' : idx === 5 ? 'text-amber-400/80' : 'text-muted-foreground'
                              )}
                            >
                              {dayHeader}
                            </span>
                          ))}
                        </div>

                        {/* 7-Column Day Grid with Mon-Sun Start Offset & Uniform Equal Gaps */}
                        <div className="grid grid-cols-7 gap-1.5">
                          {/* Empty offset padding slots before 1st day */}
                          {Array.from({ length: month.startOffset }).map((_, emptyIdx) => (
                            <div key={`empty-${emptyIdx}`} className="aspect-square w-full opacity-0 pointer-events-none" />
                          ))}

                          {/* Days of the month */}
                          {month.days.map((day) => {
                            const isSelected = inspectedDay?.dateStr === day.dateStr;
                            return (
                              <button
                                key={day.dayNumber}
                                onClick={() => setInspectedDay(day)}
                                title={`${day.dateStr} (${day.dayName}): ${day.status}${day.punchIn ? ` (${day.punchIn})` : ''} - ${day.note}`}
                                className={cn(
                                  'aspect-square w-full rounded-sm flex items-center justify-center font-mono text-[10.5px] font-bold transition-all cursor-pointer relative group',
                                  day.status === 'Present' &&
                                    'bg-emerald-500 text-white hover:bg-emerald-400 hover:scale-105 shadow-2xs',
                                  day.status === 'Absent' &&
                                    'bg-rose-500 text-white hover:bg-rose-400 hover:scale-105 shadow-2xs',
                                  day.status === 'Late' &&
                                    'bg-amber-500 text-black hover:bg-amber-400 hover:scale-105 shadow-2xs',
                                  day.status === 'Leave' &&
                                    'bg-indigo-500 text-white hover:bg-indigo-400 hover:scale-105 shadow-2xs',
                                  day.status === 'Holiday' &&
                                    'bg-muted/40 text-muted-foreground/50 border border-border/40 hover:bg-muted/70',
                                  day.status === 'Future' &&
                                    'bg-muted/20 text-muted-foreground/30 border border-dashed border-border/40',
                                  isSelected && 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-105 z-10 shadow-sm'
                                )}
                              >
                                {day.dayNumber}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Full-Width Month Footer with Clean Stats Bar */}
                      <div className="px-4 py-2.5 bg-muted/20 border-t border-border flex items-center justify-between text-[11px] font-mono">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <span className="h-1.5 w-1.5 rounded-xs bg-emerald-500" />
                          <span>{month.presentDays}P</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                          <span className="h-1.5 w-1.5 rounded-xs bg-rose-500" />
                          <span>{month.absentDays}A</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                          <span className="h-1.5 w-1.5 rounded-xs bg-amber-500" />
                          <span>{month.lateDays}L</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                          <span className="h-1.5 w-1.5 rounded-xs bg-indigo-500" />
                          <span>{month.leaveDays}Lv</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. TAB CONTENT 2: LEAVE APPLICATIONS & ATTACHED PROOFS */}
            {drawerActiveTab === 'leaves' && (
              <div className="space-y-4">
                {/* Header Action Bar in Leaves Tab */}
                <div className="flex items-center justify-between p-3 rounded-md bg-card border border-border shadow-xs">
                  <div>
                    <h4 className="text-xs font-black text-foreground uppercase tracking-wider">
                      Leave Records & Documentation ({activeStudent.leaves.length})
                    </h4>
                    <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                      Sanction official leaves, view submitted proofs, and track medical history
                    </p>
                  </div>
                  <VFButton
                    size="sm"
                    variant={isApplyingNewLeave ? 'outline' : 'primary'}
                    leftIcon={<Plus className="h-3.5 w-3.5" />}
                    onClick={() => setIsApplyingNewLeave(!isApplyingNewLeave)}
                  >
                    {isApplyingNewLeave ? 'Close Form' : 'Grant New Leave Slip'}
                  </VFButton>
                </div>

                {/* Form to Grant / Apply New Leave Slip (Expandable inside Leaves tab) */}
                {isApplyingNewLeave && (
                  <div className="p-4 rounded-md bg-card border border-border shadow-md space-y-3.5 animate-scale-in">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-foreground" />
                        <h4 className="text-sm font-bold text-foreground">
                          Grant Official Leave Slip · {activeStudent.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => setIsApplyingNewLeave(false)}
                        className="text-xs text-muted-foreground hover:text-foreground cursor-pointer px-1 py-0.5 rounded hover:bg-muted"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <VFSelect
                          label="Leave Category"
                          value={newLeaveType}
                          onChange={(e) => setNewLeaveType(e.target.value as any)}
                          options={[
                            { label: 'Medical Leave (Doctor Advised)', value: 'Medical' },
                            { label: 'Casual Student Leave', value: 'Casual' },
                            { label: 'Family Function / Travel', value: 'Family' },
                            { label: 'Institutional Duty / Sports', value: 'Duty' },
                          ]}
                        />
                      </div>
                      <div>
                        <VFInput
                          label="Date Range"
                          value={newLeaveDates}
                          onChange={(e) => setNewLeaveDates(e.target.value)}
                          placeholder="e.g. Aug 21 – Aug 22, 2026"
                        />
                      </div>
                      <div>
                        <VFInput
                          label="Specific Reason / Notes"
                          value={newLeaveReason}
                          onChange={(e) => setNewLeaveReason(e.target.value)}
                          placeholder="e.g. High Fever & Doctor Advice"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <VFButton size="sm" variant="outline" onClick={() => setIsApplyingNewLeave(false)}>
                        {t('action.cancel')}
                      </VFButton>
                      <VFButton size="sm" leftIcon={<Check className="h-3.5 w-3.5" />} onClick={handleGrantNewLeave}>
                        {t('action.confirm')}
                      </VFButton>
                    </div>
                  </div>
                )}

                {activeStudent.leaves.length === 0 ? (
                  <div className="p-8 rounded-lg bg-card border border-border text-center space-y-2">
                    <FileCheck className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                    <p className="text-sm font-bold text-foreground">No Leave Slips on Record</p>
                    <p className="text-xs text-muted-foreground">
                      This student has not submitted any formal medical or casual leave applications this term.
                    </p>
                    <div className="pt-2">
                      <VFButton
                        size="sm"
                        variant="outline"
                        leftIcon={<Plus className="h-3.5 w-3.5" />}
                        onClick={() => setIsApplyingNewLeave(true)}
                      >
                        Grant New Leave Slip
                      </VFButton>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeStudent.leaves.map((leave) => (
                      <div
                        key={leave.id}
                        className="p-4 rounded-lg bg-card border border-border shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          {leave.documentPhotoUrl ? (
                            <div
                              onClick={() =>
                                setPreviewingProof({
                                  url: leave.documentPhotoUrl!,
                                  title: leave.documentName || `${leave.type} Leave Document Proof`,
                                  studentName: activeStudent.name,
                                  dates: leave.dates,
                                  reason: leave.reason,
                                  type: leave.type,
                                })
                              }
                              className="relative group shrink-0 cursor-pointer"
                              title="Click to view document proof in lightbox modal"
                            >
                              <img
                                src={leave.documentPhotoUrl}
                                alt="Leave Document Proof"
                                className="h-20 w-16 rounded-md object-cover border border-border shadow-xs group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/60 rounded-md opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                                View Proof
                              </div>
                            </div>
                          ) : (
                            <div className="h-20 w-16 rounded-md bg-muted border border-border flex items-center justify-center shrink-0">
                              <Paperclip className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}

                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <VFBadge
                                variant={leave.isApproved ? 'success' : 'warning'}
                                className="text-[10px] px-2 py-0.5"
                              >
                                {leave.isApproved ? 'Approved Leave' : 'Pending Administrative Approval'}
                              </VFBadge>
                              <span className="text-xs font-mono font-bold text-foreground">{leave.type} Leave</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs font-mono text-muted-foreground">{leave.dates}</span>
                            </div>

                            <p className="text-sm font-black text-foreground">{leave.reason}</p>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 flex-wrap">
                              <span>Applied: {leave.appliedOn}</span>
                              {leave.documentName && (
                                <>
                                  <span>•</span>
                                  <button
                                    onClick={() =>
                                      setPreviewingProof({
                                        url: leave.documentPhotoUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
                                        title: leave.documentName || `${leave.type} Leave Document Proof`,
                                        studentName: activeStudent.name,
                                        dates: leave.dates,
                                        reason: leave.reason,
                                        type: leave.type,
                                      })
                                    }
                                    className="font-mono text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <Paperclip className="h-3 w-3" />
                                    {leave.documentName}
                                  </button>
                                </>
                              )}
                              {leave.approvedBy && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    {leave.approvedBy}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons for Leave Application */}
                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          {!leave.isApproved ? (
                            <>
                              <button
                                onClick={() => handleApproveLeaveInDrawer(leave.id)}
                                className="h-8 px-3.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Approve Application</span>
                              </button>
                              <button
                                onClick={() => handleRejectLeaveInDrawer(leave.id)}
                                className="h-8 px-3 rounded-md bg-muted hover:bg-rose-500/20 text-muted-foreground hover:text-rose-400 border border-border hover:border-rose-500/40 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span>{t('action.reject')}</span>
                              </button>
                            </>
                          ) : (
                            <VFBadge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30 px-3 py-1">
                              Officially Sanctioned
                            </VFBadge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </VFDrawer>

      {/* ═══════════════════════════════════════════════════════════════════════
          DOCUMENT PROOF LIGHTBOX MODAL (CENTERED WITH BLURRED BACKDROP)
          ═══════════════════════════════════════════════════════════════════════ */}
      {previewingProof && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setPreviewingProof(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-card border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-muted/30 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-foreground" />
                <div>
                  <h3 className="text-sm font-bold text-foreground leading-tight">
                    {previewingProof.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    {previewingProof.studentName} · {previewingProof.type} Leave ({previewingProof.dates})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewingProof.url}
                  target="_blank"
                  rel="noreferrer"
                  className="h-7 px-2.5 rounded-md border border-border bg-muted/50 hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                  title="Open in new window"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Open Full</span>
                </a>
              </div>
            </div>

            {/* Document Photo Display in Center */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/40 min-h-[340px] max-h-[62vh]">
              <img
                src={previewingProof.url}
                alt={previewingProof.title}
                className="max-h-[58vh] max-w-full object-contain rounded-md shadow-lg border border-border/60 select-none"
              />
            </div>

            {/* Modal Footer with Notes */}
            <div className="px-5 py-3 bg-muted/30 border-t border-border flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-bold text-foreground">Reason:</span>
                <span>{previewingProof.reason}</span>
              </div>
              <VFButton
                size="sm"
                variant="outline"
                onClick={() => setPreviewingProof(null)}
              >
                Close Preview
              </VFButton>
            </div>
          </div>
        </div>
      )}
    </VFPageContainer>
  );
}
