import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFButton,
  VFBadge,
  VFSelect,
  VFInput,
  VFDialog,
  VFDrawer,
  VFTable,
  VFTableHead,
  VFTableHeaderCell,
  VFTableBody,
  VFTableRow,
  VFTableCell,
  VFCard,
  cn,
} from '@vidyamaxx/ui';
import {
  Plus,
  Download,
  Check,
  Calendar,
  Settings2,
  Building2,
  Printer,
  Edit3,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Search,
  FileSpreadsheet,
  X,
  Lock,
  Unlock,
  ChevronDown,
  Layers,
  FileText,
  ShieldCheck,
  GraduationCap,
  MapPin,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/examinations')({
  component: ExaminationsPage,
});

export interface ExamPaper {
  id: string;
  date: string;
  displayDate: string;
  dayNumber?: string;
  monthText?: string;
  dayOfWeek?: string;
  relativeTiming?: string;
  subject: string;
  paperCode: string;
  subjectCategory?: 'Core Theory' | 'Practical / Lab' | 'Skill Subject' | 'Language';
  grade: string;
  timeSlot: string;
  duration: string;
  shift?: 'Morning' | 'Afternoon';
  reportingTime?: string;
  readingTime?: string;
  hall: string;
  hallBlock?: string;
  capacity?: string;
  maxMarks: number;
  passMarks?: number;
  internalMarks?: number;
  invigilator: string;
  assistantInvigilator?: string;
  status: 'Completed' | 'Active Today' | 'Upcoming';
}

export interface ExamRecord {
  id: string;
  code: string;
  title: string;
  session: string;
  grade: string;
  dates: string;
  totalCandidates: number;
  marksEnteredPct: number;
  status: 'Scheduled' | 'Active Live' | 'Evaluation' | 'Completed' | 'Published';
  papersCount: number;
  chiefSuperintendent?: string;
  controlRoom?: string;
  timetable: ExamPaper[];
}

export interface SubjectMarksScheme {
  id: string;
  subject: string;
  code: string;
  theoryMax: number;
  practicalMax: number;
  internalMax: number;
  totalMax: number;
  passCriteriaPct: number;
  separateTheoryPass: boolean;
}

export interface ClassMarksScheme {
  classId: string;
  className: string;
  board: string;
  description: string;
  subjects: SubjectMarksScheme[];
}

const DEFAULT_TIMETABLE_T1: ExamPaper[] = [
  {
    id: 'P1',
    date: '2026-09-18',
    displayDate: '18 Sep 2026 (Mon)',
    dayNumber: '18',
    monthText: 'SEP',
    dayOfWeek: 'MON',
    relativeTiming: 'COMPLETED',
    subject: 'Mathematics',
    paperCode: 'Code: 041',
    subjectCategory: 'Core Theory',
    grade: 'Class 10 (A, B, C)',
    timeSlot: '09:00 AM – 12:00 PM',
    duration: '3 Hours',
    shift: 'Morning',
    reportingTime: '08:30 AM',
    readingTime: '08:45 AM (15m)',
    hall: 'Hall A1–A4 (Block 1)',
    hallBlock: 'Main Academic Block, Floor 1',
    capacity: '120 Desks · CCTV Monitored',
    maxMarks: 80,
    passMarks: 27,
    internalMarks: 20,
    invigilator: 'Dr. Rajesh Sharma',
    assistantInvigilator: 'Mr. K. Narayanan',
    status: 'Completed',
  },
  {
    id: 'P2',
    date: '2026-09-21',
    displayDate: '21 Sep 2026 (Thu)',
    dayNumber: '21',
    monthText: 'SEP',
    dayOfWeek: 'THU',
    relativeTiming: 'COMPLETED',
    subject: 'Science (Physics, Chem & Bio)',
    paperCode: 'Code: 086',
    subjectCategory: 'Core Theory',
    grade: 'Class 10 (A, B, C)',
    timeSlot: '09:00 AM – 12:00 PM',
    duration: '3 Hours',
    shift: 'Morning',
    reportingTime: '08:30 AM',
    readingTime: '08:45 AM (15m)',
    hall: 'Hall A1–A4 (Block 1)',
    hallBlock: 'Main Academic Block, Floor 1',
    capacity: '120 Desks · CCTV Monitored',
    maxMarks: 80,
    passMarks: 27,
    internalMarks: 20,
    invigilator: 'Mrs. Sunita Verma',
    assistantInvigilator: 'Ms. Priyanka Sen',
    status: 'Completed',
  },
  {
    id: 'P3',
    date: '2026-09-23',
    displayDate: '23 Sep 2026 (Sat)',
    dayNumber: '23',
    monthText: 'SEP',
    dayOfWeek: 'SAT',
    relativeTiming: 'LIVE TODAY',
    subject: 'English Language & Literature',
    paperCode: 'Code: 184',
    subjectCategory: 'Language',
    grade: 'Class 10 (A, B, C)',
    timeSlot: '09:00 AM – 12:00 PM',
    duration: '3 Hours',
    shift: 'Morning',
    reportingTime: '08:30 AM',
    readingTime: '08:45 AM (15m)',
    hall: 'Hall B1–B3 (Block 2)',
    hallBlock: 'Senior Wing Block, Floor 2',
    capacity: '90 Desks · CCTV Monitored',
    maxMarks: 80,
    passMarks: 27,
    internalMarks: 20,
    invigilator: 'Mr. Arvind Saxena',
    assistantInvigilator: 'Mrs. Deepa Bhatt',
    status: 'Active Today',
  },
  {
    id: 'P4',
    date: '2026-09-25',
    displayDate: '25 Sep 2026 (Mon)',
    dayNumber: '25',
    monthText: 'SEP',
    dayOfWeek: 'MON',
    relativeTiming: 'IN 2 DAYS',
    subject: 'Social Science (History, Geo, Civics)',
    paperCode: 'Code: 087',
    subjectCategory: 'Core Theory',
    grade: 'Class 10 (A, B, C)',
    timeSlot: '09:00 AM – 12:00 PM',
    duration: '3 Hours',
    shift: 'Morning',
    reportingTime: '08:30 AM',
    readingTime: '08:45 AM (15m)',
    hall: 'Hall A1–A4 (Block 1)',
    hallBlock: 'Main Academic Block, Floor 1',
    capacity: '120 Desks · CCTV Monitored',
    maxMarks: 80,
    passMarks: 27,
    internalMarks: 20,
    invigilator: 'Ms. Meenakshi Iyer',
    assistantInvigilator: 'Mr. Tariq Khan',
    status: 'Upcoming',
  },
  {
    id: 'P5',
    date: '2026-09-28',
    displayDate: '28 Sep 2026 (Thu)',
    dayNumber: '28',
    monthText: 'SEP',
    dayOfWeek: 'THU',
    relativeTiming: 'IN 5 DAYS',
    subject: 'Hindi Course-A / Course-B',
    paperCode: 'Code: 002',
    subjectCategory: 'Language',
    grade: 'Class 10 (A, B, C)',
    timeSlot: '09:00 AM – 12:00 PM',
    duration: '3 Hours',
    shift: 'Morning',
    reportingTime: '08:30 AM',
    readingTime: '08:45 AM (15m)',
    hall: 'Hall B1–B4 (Block 2)',
    hallBlock: 'Senior Wing Block, Floor 2',
    capacity: '110 Desks · CCTV Monitored',
    maxMarks: 80,
    passMarks: 27,
    internalMarks: 20,
    invigilator: 'Pt. Rameshwar Dayal',
    assistantInvigilator: 'Ms. Kavita Tiwari',
    status: 'Upcoming',
  },
  {
    id: 'P6',
    date: '2026-09-30',
    displayDate: '30 Sep 2026 (Sat)',
    dayNumber: '30',
    monthText: 'SEP',
    dayOfWeek: 'SAT',
    relativeTiming: 'NEXT WEEK',
    subject: 'Information Technology (Skill 402)',
    paperCode: 'Code: 402',
    subjectCategory: 'Skill Subject',
    grade: 'Class 10 (A, B, C)',
    timeSlot: '09:00 AM – 11:00 AM',
    duration: '2 Hours',
    shift: 'Morning',
    reportingTime: '08:30 AM',
    readingTime: '08:45 AM (15m)',
    hall: 'Computer Labs 1 & 2',
    hallBlock: 'IT & Robotics Center, Floor 3',
    capacity: '80 Terminals · Biometric Access',
    maxMarks: 50,
    passMarks: 17,
    internalMarks: 50,
    invigilator: 'Mr. Pradeep Rawat',
    assistantInvigilator: 'Ms. Neha Sinha',
    status: 'Upcoming',
  },
];

const INITIAL_EXAMS: ExamRecord[] = [
  {
    id: '1',
    code: 'EXAM-2026-T1',
    title: 'Term 1 Mid-Year Summative Exam',
    session: '2026–2027',
    grade: 'Class 6–12',
    dates: '18 Sep – 30 Sep 2026',
    totalCandidates: 1248,
    marksEnteredPct: 84,
    status: 'Active Live',
    papersCount: 6,
    chiefSuperintendent: 'Dr. K. S. Verma (Exam Cell)',
    controlRoom: 'Academic Block 1, Room 102',
    timetable: DEFAULT_TIMETABLE_T1,
  },
  {
    id: '2',
    code: 'EXAM-2026-UT2',
    title: 'Periodic Unit Test 2',
    session: '2026–2027',
    grade: 'Class 9–12',
    dates: '22 Aug – 25 Aug 2026',
    totalCandidates: 620,
    marksEnteredPct: 100,
    status: 'Evaluation',
    papersCount: 4,
    chiefSuperintendent: 'Mrs. Geeta Mathur (Exam Cell)',
    controlRoom: 'Secondary Wing, Room 14',
    timetable: [
      { id: 'UT2-1', date: '2026-08-22', displayDate: '22 Aug 2026 (Mon)', dayNumber: '22', monthText: 'AUG', dayOfWeek: 'MON', relativeTiming: 'COMPLETED', subject: 'Mathematics', paperCode: 'Code: 041', subjectCategory: 'Core Theory', grade: 'Class 9 & 10', timeSlot: '08:30 AM – 10:00 AM', duration: '1.5 Hours', shift: 'Morning', reportingTime: '08:15 AM', readingTime: '08:20 AM', hall: 'Classrooms 9A–10C', hallBlock: 'Secondary Wing, Floor 1', capacity: '60 Desks / Room', maxMarks: 40, passMarks: 14, internalMarks: 10, invigilator: 'Class Teachers', assistantInvigilator: 'Floor Incharge', status: 'Completed' },
      { id: 'UT2-2', date: '2026-08-23', displayDate: '23 Aug 2026 (Tue)', dayNumber: '23', monthText: 'AUG', dayOfWeek: 'TUE', relativeTiming: 'COMPLETED', subject: 'Science', paperCode: 'Code: 086', subjectCategory: 'Core Theory', grade: 'Class 9 & 10', timeSlot: '08:30 AM – 10:00 AM', duration: '1.5 Hours', shift: 'Morning', reportingTime: '08:15 AM', readingTime: '08:20 AM', hall: 'Classrooms 9A–10C', hallBlock: 'Secondary Wing, Floor 1', capacity: '60 Desks / Room', maxMarks: 40, passMarks: 14, internalMarks: 10, invigilator: 'Class Teachers', assistantInvigilator: 'Floor Incharge', status: 'Completed' },
      { id: 'UT2-3', date: '2026-08-24', displayDate: '24 Aug 2026 (Wed)', dayNumber: '24', monthText: 'AUG', dayOfWeek: 'WED', relativeTiming: 'COMPLETED', subject: 'Social Science', paperCode: 'Code: 087', subjectCategory: 'Core Theory', grade: 'Class 9 & 10', timeSlot: '08:30 AM – 10:00 AM', duration: '1.5 Hours', shift: 'Morning', reportingTime: '08:15 AM', readingTime: '08:20 AM', hall: 'Classrooms 9A–10C', hallBlock: 'Secondary Wing, Floor 1', capacity: '60 Desks / Room', maxMarks: 40, passMarks: 14, internalMarks: 10, invigilator: 'Class Teachers', assistantInvigilator: 'Floor Incharge', status: 'Completed' },
      { id: 'UT2-4', date: '2026-08-25', displayDate: '25 Aug 2026 (Thu)', dayNumber: '25', monthText: 'AUG', dayOfWeek: 'THU', relativeTiming: 'COMPLETED', subject: 'English', paperCode: 'Code: 184', subjectCategory: 'Language', grade: 'Class 9 & 10', timeSlot: '08:30 AM – 10:00 AM', duration: '1.5 Hours', shift: 'Morning', reportingTime: '08:15 AM', readingTime: '08:20 AM', hall: 'Classrooms 9A–10C', hallBlock: 'Secondary Wing, Floor 1', capacity: '60 Desks / Room', maxMarks: 40, passMarks: 14, internalMarks: 10, invigilator: 'Class Teachers', assistantInvigilator: 'Floor Incharge', status: 'Completed' },
    ],
  },
  {
    id: '3',
    code: 'EXAM-2026-PRE',
    title: 'Pre-Board Mock Exam 1',
    session: '2026–2027',
    grade: 'Class 10 & 12',
    dates: '02 Dec – 14 Dec 2026',
    totalCandidates: 380,
    marksEnteredPct: 0,
    status: 'Scheduled',
    papersCount: 5,
    chiefSuperintendent: 'Prof. H. N. Chaturvedi (Observer)',
    controlRoom: 'Main Auditorium Wing',
    timetable: [
      { id: 'PB-1', date: '2026-12-02', displayDate: '02 Dec 2026 (Wed)', dayNumber: '02', monthText: 'DEC', dayOfWeek: 'WED', relativeTiming: 'UPCOMING', subject: 'Physics / Accountancy', paperCode: 'Code: 042 / 055', subjectCategory: 'Core Theory', grade: 'Class 12', timeSlot: '09:00 AM – 12:00 PM', duration: '3 Hours', shift: 'Morning', reportingTime: '08:30 AM', readingTime: '08:45 AM (15m)', hall: 'Auditorium Hall 1', hallBlock: 'Central Auditorium', capacity: '180 Desks · CCTV', maxMarks: 70, passMarks: 23, internalMarks: 30, invigilator: 'External Observers', assistantInvigilator: 'Squad Lead', status: 'Upcoming' },
      { id: 'PB-2', date: '2026-12-05', displayDate: '05 Dec 2026 (Sat)', dayNumber: '05', monthText: 'DEC', dayOfWeek: 'SAT', relativeTiming: 'UPCOMING', subject: 'Chemistry / Business Studies', paperCode: 'Code: 043 / 054', subjectCategory: 'Core Theory', grade: 'Class 12', timeSlot: '09:00 AM – 12:00 PM', duration: '3 Hours', shift: 'Morning', reportingTime: '08:30 AM', readingTime: '08:45 AM (15m)', hall: 'Auditorium Hall 1', hallBlock: 'Central Auditorium', capacity: '180 Desks · CCTV', maxMarks: 70, passMarks: 23, internalMarks: 30, invigilator: 'External Observers', assistantInvigilator: 'Squad Lead', status: 'Upcoming' },
      { id: 'PB-3', date: '2026-12-08', displayDate: '08 Dec 2026 (Tue)', dayNumber: '08', monthText: 'DEC', dayOfWeek: 'TUE', relativeTiming: 'UPCOMING', subject: 'Mathematics / Applied Math', paperCode: 'Code: 041 / 241', subjectCategory: 'Core Theory', grade: 'Class 12', timeSlot: '09:00 AM – 12:00 PM', duration: '3 Hours', shift: 'Morning', reportingTime: '08:30 AM', readingTime: '08:45 AM (15m)', hall: 'Auditorium Hall 1', hallBlock: 'Central Auditorium', capacity: '180 Desks · CCTV', maxMarks: 80, passMarks: 27, internalMarks: 20, invigilator: 'External Observers', assistantInvigilator: 'Squad Lead', status: 'Upcoming' },
      { id: 'PB-4', date: '2026-12-11', displayDate: '11 Dec 2026 (Fri)', dayNumber: '11', monthText: 'DEC', dayOfWeek: 'FRI', relativeTiming: 'UPCOMING', subject: 'English Core', paperCode: 'Code: 301', subjectCategory: 'Language', grade: 'Class 12', timeSlot: '09:00 AM – 12:00 PM', duration: '3 Hours', shift: 'Morning', reportingTime: '08:30 AM', readingTime: '08:45 AM (15m)', hall: 'Auditorium Hall 1', hallBlock: 'Central Auditorium', capacity: '180 Desks · CCTV', maxMarks: 80, passMarks: 27, internalMarks: 20, invigilator: 'External Observers', assistantInvigilator: 'Squad Lead', status: 'Upcoming' },
      { id: 'PB-5', date: '2026-12-14', displayDate: '14 Dec 2026 (Mon)', dayNumber: '14', monthText: 'DEC', dayOfWeek: 'MON', relativeTiming: 'UPCOMING', subject: 'Biology / Economics', paperCode: 'Code: 044 / 030', subjectCategory: 'Core Theory', grade: 'Class 12', timeSlot: '09:00 AM – 12:00 PM', duration: '3 Hours', shift: 'Morning', reportingTime: '08:30 AM', readingTime: '08:45 AM (15m)', hall: 'Auditorium Hall 1', hallBlock: 'Central Auditorium', capacity: '180 Desks · CCTV', maxMarks: 70, passMarks: 23, internalMarks: 30, invigilator: 'External Observers', assistantInvigilator: 'Squad Lead', status: 'Upcoming' },
    ],
  },
  {
    id: '4',
    code: 'EXAM-2026-UT1',
    title: 'Periodic Unit Test 1',
    session: '2026–2027',
    grade: 'Class 6–12',
    dates: '15 Jul – 18 Jul 2026',
    totalCandidates: 1190,
    marksEnteredPct: 100,
    status: 'Completed',
    papersCount: 4,
    chiefSuperintendent: 'Dr. K. S. Verma (Exam Cell)',
    controlRoom: 'Academic Block 1, Room 102',
    timetable: [
      { id: 'UT1-1', date: '2026-07-15', displayDate: '15 Jul 2026 (Wed)', dayNumber: '15', monthText: 'JUL', dayOfWeek: 'WED', relativeTiming: 'COMPLETED', subject: 'Mathematics', paperCode: 'Code: 041', subjectCategory: 'Core Theory', grade: 'Class 10', timeSlot: '08:30 AM – 10:00 AM', duration: '1.5 Hours', shift: 'Morning', reportingTime: '08:15 AM', readingTime: '08:20 AM', hall: 'Classrooms 10A–10C', hallBlock: 'Main Block, Floor 1', capacity: '40 Desks / Room', maxMarks: 40, passMarks: 14, internalMarks: 10, invigilator: 'Class Teachers', assistantInvigilator: 'Floor Incharge', status: 'Completed' },
      { id: 'UT1-2', date: '2026-07-16', displayDate: '16 Jul 2026 (Thu)', dayNumber: '16', monthText: 'JUL', dayOfWeek: 'THU', relativeTiming: 'COMPLETED', subject: 'Science', paperCode: 'Code: 086', subjectCategory: 'Core Theory', grade: 'Class 10', timeSlot: '08:30 AM – 10:00 AM', duration: '1.5 Hours', shift: 'Morning', reportingTime: '08:15 AM', readingTime: '08:20 AM', hall: 'Classrooms 10A–10C', hallBlock: 'Main Block, Floor 1', capacity: '40 Desks / Room', maxMarks: 40, passMarks: 14, internalMarks: 10, invigilator: 'Class Teachers', assistantInvigilator: 'Floor Incharge', status: 'Completed' },
      { id: 'UT1-3', date: '2026-07-17', displayDate: '17 Jul 2026 (Fri)', dayNumber: '17', monthText: 'JUL', dayOfWeek: 'FRI', relativeTiming: 'COMPLETED', subject: 'Social Science', paperCode: 'Code: 087', subjectCategory: 'Core Theory', grade: 'Class 10', timeSlot: '08:30 AM – 10:00 AM', duration: '1.5 Hours', shift: 'Morning', reportingTime: '08:15 AM', readingTime: '08:20 AM', hall: 'Classrooms 10A–10C', hallBlock: 'Main Block, Floor 1', capacity: '40 Desks / Room', maxMarks: 40, passMarks: 14, internalMarks: 10, invigilator: 'Class Teachers', assistantInvigilator: 'Floor Incharge', status: 'Completed' },
      { id: 'UT1-4', date: '2026-07-18', displayDate: '18 Jul 2026 (Sat)', dayNumber: '18', monthText: 'JUL', dayOfWeek: 'SAT', relativeTiming: 'COMPLETED', subject: 'English', paperCode: 'Code: 184', subjectCategory: 'Language', grade: 'Class 10', timeSlot: '08:30 AM – 10:00 AM', duration: '1.5 Hours', shift: 'Morning', reportingTime: '08:15 AM', readingTime: '08:20 AM', hall: 'Classrooms 10A–10C', hallBlock: 'Main Block, Floor 1', capacity: '40 Desks / Room', maxMarks: 40, passMarks: 14, internalMarks: 10, invigilator: 'Class Teachers', assistantInvigilator: 'Floor Incharge', status: 'Completed' },
    ],
  },
  {
    id: '5',
    code: 'EXAM-2026-PRAC',
    title: 'Senior Science & Lab Practicals',
    session: '2026–2027',
    grade: 'Class 11 & 12',
    dates: '10 Jan – 18 Jan 2027',
    totalCandidates: 340,
    marksEnteredPct: 0,
    status: 'Scheduled',
    papersCount: 4,
    chiefSuperintendent: 'Dr. Alka Raman (Lab Director)',
    controlRoom: 'Science Laboratories Wing',
    timetable: [
      { id: 'PRAC-1', date: '2027-01-10', displayDate: '10 Jan 2027 (Sun)', dayNumber: '10', monthText: 'JAN', dayOfWeek: 'SUN', relativeTiming: 'UPCOMING', subject: 'Physics Practical (Batch A & B)', paperCode: 'Code: 042-P', subjectCategory: 'Practical / Lab', grade: 'Class 12', timeSlot: '09:00 AM – 12:00 PM', duration: '3 Hours', shift: 'Morning', reportingTime: '08:45 AM', readingTime: '08:50 AM', hall: 'Physics Lab 1 & 2', hallBlock: 'Science Wing, Floor 2', capacity: '40 Workstations', maxMarks: 30, passMarks: 10, internalMarks: 0, invigilator: 'External Board Examiner', assistantInvigilator: 'Lab Assistant', status: 'Upcoming' },
      { id: 'PRAC-2', date: '2027-01-12', displayDate: '12 Jan 2027 (Tue)', dayNumber: '12', monthText: 'JAN', dayOfWeek: 'TUE', relativeTiming: 'UPCOMING', subject: 'Chemistry Practical (Batch A & B)', paperCode: 'Code: 043-P', subjectCategory: 'Practical / Lab', grade: 'Class 12', timeSlot: '09:00 AM – 12:00 PM', duration: '3 Hours', shift: 'Morning', reportingTime: '08:45 AM', readingTime: '08:50 AM', hall: 'Chemistry Lab 1 & 2', hallBlock: 'Science Wing, Floor 2', capacity: '40 Workstations', maxMarks: 30, passMarks: 10, internalMarks: 0, invigilator: 'External Board Examiner', assistantInvigilator: 'Lab Assistant', status: 'Upcoming' },
      { id: 'PRAC-3', date: '2027-01-15', displayDate: '15 Jan 2027 (Fri)', dayNumber: '15', monthText: 'JAN', dayOfWeek: 'FRI', relativeTiming: 'UPCOMING', subject: 'Biology Practical (Batch A)', paperCode: 'Code: 044-P', subjectCategory: 'Practical / Lab', grade: 'Class 12', timeSlot: '09:00 AM – 12:00 PM', duration: '3 Hours', shift: 'Morning', reportingTime: '08:45 AM', readingTime: '08:50 AM', hall: 'Biology Lab', hallBlock: 'Science Wing, Floor 1', capacity: '30 Microscopes', maxMarks: 30, passMarks: 10, internalMarks: 0, invigilator: 'External Board Examiner', assistantInvigilator: 'Lab Assistant', status: 'Upcoming' },
      { id: 'PRAC-4', date: '2027-01-18', displayDate: '18 Jan 2027 (Mon)', dayNumber: '18', monthText: 'JAN', dayOfWeek: 'MON', relativeTiming: 'UPCOMING', subject: 'Computer Science Practical', paperCode: 'Code: 083-P', subjectCategory: 'Practical / Lab', grade: 'Class 12', timeSlot: '09:00 AM – 12:00 PM', duration: '3 Hours', shift: 'Morning', reportingTime: '08:45 AM', readingTime: '08:50 AM', hall: 'Advanced Computer Lab', hallBlock: 'IT Complex, Floor 2', capacity: '45 Terminals', maxMarks: 30, passMarks: 10, internalMarks: 0, invigilator: 'External Board Examiner', assistantInvigilator: 'Lab Admin', status: 'Upcoming' },
    ],
  },
  {
    id: '6',
    code: 'EXAM-2027-ANN',
    title: 'Annual Final Summative Evaluation',
    session: '2026–2027',
    grade: 'Class 6–11',
    dates: '20 Feb – 08 Mar 2027',
    totalCandidates: 1420,
    marksEnteredPct: 0,
    status: 'Scheduled',
    papersCount: 6,
    chiefSuperintendent: 'Principal & Vice-Principal Board',
    controlRoom: 'Central Examination Wing',
    timetable: [
      { id: 'ANN-1', date: '2027-02-20', displayDate: '20 Feb 2027 (Sat)', dayNumber: '20', monthText: 'FEB', dayOfWeek: 'SAT', relativeTiming: 'UPCOMING', subject: 'Mathematics (Standard / Basic)', paperCode: 'Code: 041', subjectCategory: 'Core Theory', grade: 'Class 6–11', timeSlot: '09:00 AM – 12:00 PM', duration: '3 Hours', shift: 'Morning', reportingTime: '08:30 AM', readingTime: '08:45 AM (15m)', hall: 'All Examination Halls (Block 1 & 2)', hallBlock: 'Entire Campus', capacity: '450 Desks', maxMarks: 80, passMarks: 27, internalMarks: 20, invigilator: 'All Senior Faculty', assistantInvigilator: 'Duty Roster', status: 'Upcoming' },
      { id: 'ANN-2', date: '2027-02-23', displayDate: '23 Feb 2027 (Tue)', dayNumber: '23', monthText: 'FEB', dayOfWeek: 'TUE', relativeTiming: 'UPCOMING', subject: 'Science & Technology', paperCode: 'Code: 086', subjectCategory: 'Core Theory', grade: 'Class 6–11', timeSlot: '09:00 AM – 12:00 PM', duration: '3 Hours', shift: 'Morning', reportingTime: '08:30 AM', readingTime: '08:45 AM (15m)', hall: 'All Examination Halls (Block 1 & 2)', hallBlock: 'Entire Campus', capacity: '450 Desks', maxMarks: 80, passMarks: 27, internalMarks: 20, invigilator: 'All Senior Faculty', assistantInvigilator: 'Duty Roster', status: 'Upcoming' },
      { id: 'ANN-3', date: '2027-02-26', displayDate: '26 Feb 2027 (Fri)', dayNumber: '26', monthText: 'FEB', dayOfWeek: 'FRI', relativeTiming: 'UPCOMING', subject: 'Social Science & Humanities', paperCode: 'Code: 087', subjectCategory: 'Core Theory', grade: 'Class 6–11', timeSlot: '09:00 AM – 12:00 PM', duration: '3 Hours', shift: 'Morning', reportingTime: '08:30 AM', readingTime: '08:45 AM (15m)', hall: 'All Examination Halls (Block 1 & 2)', hallBlock: 'Entire Campus', capacity: '450 Desks', maxMarks: 80, passMarks: 27, internalMarks: 20, invigilator: 'All Senior Faculty', assistantInvigilator: 'Duty Roster', status: 'Upcoming' },
      { id: 'ANN-4', date: '2027-03-01', displayDate: '01 Mar 2027 (Mon)', dayNumber: '01', monthText: 'MAR', dayOfWeek: 'MON', relativeTiming: 'UPCOMING', subject: 'English Language & Literature', paperCode: 'Code: 184', subjectCategory: 'Language', grade: 'Class 6–11', timeSlot: '09:00 AM – 12:00 PM', duration: '3 Hours', shift: 'Morning', reportingTime: '08:30 AM', readingTime: '08:45 AM (15m)', hall: 'All Examination Halls (Block 1 & 2)', hallBlock: 'Entire Campus', capacity: '450 Desks', maxMarks: 80, passMarks: 27, internalMarks: 20, invigilator: 'All Senior Faculty', assistantInvigilator: 'Duty Roster', status: 'Upcoming' },
      { id: 'ANN-5', date: '2027-03-04', displayDate: '04 Mar 2027 (Thu)', dayNumber: '04', monthText: 'MAR', dayOfWeek: 'THU', relativeTiming: 'UPCOMING', subject: 'Second Language (Hindi / Sanskrit)', paperCode: 'Code: 002 / 122', subjectCategory: 'Language', grade: 'Class 6–11', timeSlot: '09:00 AM – 12:00 PM', duration: '3 Hours', shift: 'Morning', reportingTime: '08:30 AM', readingTime: '08:45 AM (15m)', hall: 'All Examination Halls (Block 1 & 2)', hallBlock: 'Entire Campus', capacity: '450 Desks', maxMarks: 80, passMarks: 27, internalMarks: 20, invigilator: 'All Senior Faculty', assistantInvigilator: 'Duty Roster', status: 'Upcoming' },
      { id: 'ANN-6', date: '2027-03-08', displayDate: '08 Mar 2027 (Mon)', dayNumber: '08', monthText: 'MAR', dayOfWeek: 'MON', relativeTiming: 'UPCOMING', subject: 'Information Technology / Artificial Intelligence', paperCode: 'Code: 402 / 417', subjectCategory: 'Skill Subject', grade: 'Class 6–11', timeSlot: '09:00 AM – 11:00 AM', duration: '2 Hours', shift: 'Morning', reportingTime: '08:30 AM', readingTime: '08:45 AM (15m)', hall: 'Computer Labs 1, 2 & 3', hallBlock: 'IT Wing, Floor 3', capacity: '120 Terminals', maxMarks: 50, passMarks: 17, internalMarks: 50, invigilator: 'IT Faculty', assistantInvigilator: 'Lab Coordinators', status: 'Upcoming' },
    ],
  },
];


const INITIAL_MARKS_SCHEMES: Record<string, ClassMarksScheme> = {
  'class-10': {
    classId: 'class-10',
    className: 'Class 10 (Secondary)',
    board: 'CBSE (80 Theory + 20 Internal)',
    description: 'Passing criterion requires 33% overall aggregate across theory and internal components.',
    subjects: [
      { id: 's1', subject: 'Mathematics (Standard / Basic)', code: '041 / 241', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
      { id: 's2', subject: 'Science (Physics, Chem, Bio)', code: '086', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
      { id: 's3', subject: 'Social Science (Hist, Geo, Civics)', code: '087', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
      { id: 's4', subject: 'English Language & Literature', code: '184', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
      { id: 's5', subject: 'Hindi Course-A / Course-B', code: '002 / 085', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
      { id: 's6', subject: 'Information Technology (Skill)', code: '402', theoryMax: 50, practicalMax: 50, internalMax: 0, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: true },
    ],
  },
  'class-12-sci': {
    classId: 'class-12-sci',
    className: 'Class 12 - Science (PCM / PCB)',
    board: 'CBSE (70 Theory + 30 Practical)',
    description: 'Mandatory 33% in Theory (23/70) and 33% in Practical (10/30) separately.',
    subjects: [
      { id: 's12-1', subject: 'Physics', code: '042', theoryMax: 70, practicalMax: 30, internalMax: 0, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: true },
      { id: 's12-2', subject: 'Chemistry', code: '043', theoryMax: 70, practicalMax: 30, internalMax: 0, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: true },
      { id: 's12-3', subject: 'Biology', code: '044', theoryMax: 70, practicalMax: 30, internalMax: 0, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: true },
      { id: 's12-4', subject: 'Mathematics', code: '041', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
      { id: 's12-5', subject: 'English Core', code: '301', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
      { id: 's12-6', subject: 'Computer Science', code: '083', theoryMax: 70, practicalMax: 30, internalMax: 0, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: true },
    ],
  },
  'class-12-com': {
    classId: 'class-12-com',
    className: 'Class 12 - Commerce & Arts',
    board: 'CBSE (80 Theory + 20 Project)',
    description: 'Candidates must pass separately in Theory (26/80) and Project work (7/20).',
    subjects: [
      { id: 's12c-1', subject: 'Accountancy', code: '055', theoryMax: 80, practicalMax: 20, internalMax: 0, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: true },
      { id: 's12c-2', subject: 'Business Studies', code: '054', theoryMax: 80, practicalMax: 20, internalMax: 0, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: true },
      { id: 's12c-3', subject: 'Economics', code: '030', theoryMax: 80, practicalMax: 20, internalMax: 0, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: true },
      { id: 's12c-4', subject: 'Applied Mathematics', code: '241', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
      { id: 's12c-5', subject: 'English Core', code: '301', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
    ],
  },
  'class-9': {
    classId: 'class-9',
    className: 'Class 9 (Foundation)',
    board: 'CCE (80 Exam + 20 Internal)',
    description: 'Standard evaluation mirrored to board guidelines for smooth Class 10 readiness.',
    subjects: [
      { id: 's9-1', subject: 'Mathematics', code: '041', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
      { id: 's9-2', subject: 'Science', code: '086', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
      { id: 's9-3', subject: 'Social Science', code: '087', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
      { id: 's9-4', subject: 'English Language', code: '184', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
      { id: 's9-5', subject: 'Hindi Course-A', code: '002', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
    ],
  },
  'class-6-8': {
    classId: 'class-6-8',
    className: 'Class 6–8 (Middle School)',
    board: 'Uniform Assessment (80 Term + 20 Internal)',
    description: 'Term-end exam (80) + Periodic Test (10) + Notebook (5) + Subject Activity (5).',
    subjects: [
      { id: 's6-1', subject: 'Mathematics', code: 'M-MID', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
      { id: 's6-2', subject: 'Science & Nature', code: 'S-MID', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
      { id: 's6-3', subject: 'Social Science', code: 'SS-MID', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
      { id: 's6-4', subject: 'English Grammar & Literature', code: 'ENG-MID', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
      { id: 's6-5', subject: 'Hindi Reader & Vyakaran', code: 'HIN-MID', theoryMax: 80, practicalMax: 0, internalMax: 20, totalMax: 100, passCriteriaPct: 33, separateTheoryPass: false },
    ],
  },
};

export interface GradingTier {
  grade: string;
  min: number;
  max: number;
  desc: string;
  color: string;
}

const INITIAL_GRADING_SCALE: GradingTier[] = [
  { grade: 'A1', min: 91, max: 100, desc: 'Outstanding', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' },
  { grade: 'A2', min: 81, max: 90, desc: 'Excellent', color: 'text-emerald-300 border-emerald-500/20 bg-emerald-500/5' },
  { grade: 'B1', min: 71, max: 80, desc: 'Very Good', color: 'text-sky-400 border-sky-500/30 bg-sky-500/5' },
  { grade: 'B2', min: 61, max: 70, desc: 'Good', color: 'text-sky-300 border-sky-500/20 bg-sky-500/5' },
  { grade: 'C1', min: 51, max: 60, desc: 'Fair', color: 'text-amber-400 border-amber-500/30 bg-amber-500/5' },
  { grade: 'C2', min: 41, max: 50, desc: 'Average', color: 'text-amber-300 border-amber-500/20 bg-amber-500/5' },
  { grade: 'D', min: 33, max: 40, desc: 'Pass Threshold', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5' },
  { grade: 'E', min: 0, max: 32, desc: 'Remedial', color: 'text-rose-400 border-rose-500/30 bg-rose-500/5' },
];

function getGradeFromScale(pct: number, scale: GradingTier[]): string {
  const matched = scale.find((item) => pct >= item.min && pct <= item.max);
  if (matched) return matched.grade;
  if (pct >= 33) return 'D';
  return 'E';
}

interface StudentMarkRow {
  rollNo: string;
  name: string;
  maths: number;
  science: number;
  english: number;
  social: number;
  hindi: number;
  total: number;
  pct: number;
  grade: string;
}

const INITIAL_STUDENT_MARKS: StudentMarkRow[] = [
  { rollNo: '101', name: 'Aditya Verma', maths: 98, science: 96, english: 94, social: 97, hindi: 92, total: 477, pct: 95.4, grade: 'A1' },
  { rollNo: '102', name: 'Priya Sharma', maths: 92, science: 94, english: 96, social: 90, hindi: 95, total: 467, pct: 93.4, grade: 'A1' },
  { rollNo: '103', name: 'Rahul Gupta', maths: 78, science: 82, english: 80, social: 75, hindi: 84, total: 399, pct: 79.8, grade: 'B1' },
  { rollNo: '104', name: 'Sneha Rao', maths: 94, science: 90, english: 98, social: 92, hindi: 94, total: 468, pct: 93.6, grade: 'A1' },
  { rollNo: '105', name: 'Ishaan Malhotra', maths: 65, science: 70, english: 72, social: 68, hindi: 74, total: 349, pct: 69.8, grade: 'B2' },
  { rollNo: '106', name: 'Ananya Iyer', maths: 88, science: 91, english: 89, social: 86, hindi: 90, total: 444, pct: 88.8, grade: 'A2' },
  { rollNo: '107', name: 'Rohan Joshi', maths: 74, science: 76, english: 81, social: 72, hindi: 79, total: 382, pct: 76.4, grade: 'B1' },
  { rollNo: '108', name: 'Meera Nair', maths: 95, science: 92, english: 93, social: 94, hindi: 96, total: 470, pct: 94.0, grade: 'A1' },
  { rollNo: '109', name: 'Kabir Patel', maths: 82, science: 85, english: 84, social: 80, hindi: 83, total: 414, pct: 82.8, grade: 'A2' },
  { rollNo: '110', name: 'Tanvi Deshmukh', maths: 91, science: 88, english: 92, social: 89, hindi: 91, total: 451, pct: 90.2, grade: 'A2' },
];

function ExaminationsPage() {
  const { addNotification } = useGlobalStore();
  const { lang } = useTranslation();
  const isHindi = lang === 'hi';

  React.useEffect(() => {
    document.title = (isHindi ? 'एग्जाम्स' : 'Examinations') + ' – VidyaMaxx';
  }, [isHindi]);

  // Main Active Tab View: timetable | scheme | marks
  const [activeView, setActiveView] = React.useState<'timetable' | 'scheme' | 'marks'>('timetable');

  // Exam list & Selected Exam for Timetable
  const [exams, setExams] = React.useState<ExamRecord[]>(INITIAL_EXAMS);
  const [selectedExamId, setSelectedExamId] = React.useState<string>(INITIAL_EXAMS[0].id);

  // Timetable Filters
  const [paperSearch, setPaperSearch] = React.useState('');
  const [paperStatusFilter, setPaperStatusFilter] = React.useState<string>('All');
  const [paperCategoryFilter, setPaperCategoryFilter] = React.useState<string>('All');
  const [paperShiftFilter, setPaperShiftFilter] = React.useState<string>('All');
  const [showOverviewCards, setShowOverviewCards] = React.useState(false);

  // Modals for Enhanced Timetable
  const [seatingModalPaper, setSeatingModalPaper] = React.useState<ExamPaper | null>(null);
  const [isDatesheetModalOpen, setIsDatesheetModalOpen] = React.useState(false);


  // Marks Schemes by Class
  const [marksSchemes, setMarksSchemes] = React.useState<Record<string, ClassMarksScheme>>(INITIAL_MARKS_SCHEMES);
  const [selectedSchemeClass, setSelectedSchemeClass] = React.useState<string>('class-10');
  const [isEditingScheme, setIsEditingScheme] = React.useState(false);
  const [editingSubjects, setEditingSubjects] = React.useState<SubjectMarksScheme[]>(INITIAL_MARKS_SCHEMES['class-10'].subjects);

  // Scheme Lock State per class (default locked for Board classes)
  const [lockedSchemes, setLockedSchemes] = React.useState<Record<string, boolean>>({
    'class-10': true,
    'class-12-sci': true,
    'class-12-com': true,
    'class-9': false,
    'class-6-8': false,
  });
  const isCurrentSchemeLocked = Boolean(lockedSchemes[selectedSchemeClass]);

  // Grading Scale State (Editable)
  const [gradingScale, setGradingScale] = React.useState<GradingTier[]>(INITIAL_GRADING_SCALE);
  const [isEditingGrading, setIsEditingGrading] = React.useState(false);
  const [tempGradingScale, setTempGradingScale] = React.useState<GradingTier[]>(INITIAL_GRADING_SCALE);

  // Marks entry state
  const [marksData, setMarksData] = React.useState<StudentMarkRow[]>(INITIAL_STUDENT_MARKS);
  const [selectedClass, setSelectedClass] = React.useState<string>('Class 10-A');
  const [studentSearch, setStudentSearch] = React.useState<string>('');

  // Register Lock State per class
  const [lockedRegisters, setLockedRegisters] = React.useState<Record<string, boolean>>({
    'Class 10-A': false,
    'Class 10-B': true,
    'Class 9-A': false,
    'Class 11-Sci': false,
    'Class 12-Com': true,
  });
  const isRegisterLocked = Boolean(lockedRegisters[selectedClass]);

  // Drawers & Modals
  const [isScheduleDrawerOpen, setIsScheduleDrawerOpen] = React.useState(false);
  const [isAddPaperModalOpen, setIsAddPaperModalOpen] = React.useState(false);

  // Add new exam form state
  const [newExamTitle, setNewExamTitle] = React.useState('');
  const [newExamCode, setNewExamCode] = React.useState(`EXAM-2026-0${exams.length + 1}`);
  const [newExamSession] = React.useState('2026–2027');
  const [newExamGrade, setNewExamGrade] = React.useState('Class 6–12');
  const [newExamDates, setNewExamDates] = React.useState('15 Nov – 28 Nov 2026');
  const [newExamCandidates, setNewExamCandidates] = React.useState(600);

  // Add paper form state
  const [paperSubject, setPaperSubject] = React.useState('');
  const [paperCode, setPaperCode] = React.useState('');
  const [paperDate] = React.useState('2026-09-29');
  const [paperDisplayDate, setPaperDisplayDate] = React.useState('29 Sep 2026 (Tue)');
  const [paperTimeSlot, setPaperTimeSlot] = React.useState('09:00 AM – 12:00 PM');
  const [paperDuration] = React.useState('3h');
  const [paperHall, setPaperHall] = React.useState('Hall A1–A4 (Block 1)');
  const [paperMaxMarks, setPaperMaxMarks] = React.useState(80);
  const [paperInvigilator, setPaperInvigilator] = React.useState('Senior Faculty');

  // Active exam object
  const activeExam = exams.find((e) => e.id === selectedExamId) || exams[0];
  const currentScheme = marksSchemes[selectedSchemeClass] || marksSchemes['class-10'];

  // When class changes in Scheme view, load that class's subjects
  React.useEffect(() => {
    if (marksSchemes[selectedSchemeClass]) {
      setEditingSubjects([...marksSchemes[selectedSchemeClass].subjects]);
      setIsEditingScheme(false);
    }
  }, [selectedSchemeClass, marksSchemes]);

  // Toggle Scheme Lock
  const handleToggleSchemeLock = () => {
    const next = !isCurrentSchemeLocked;
    setLockedSchemes((prev) => ({
      ...prev,
      [selectedSchemeClass]: next,
    }));
    if (next) setIsEditingScheme(false);
    addNotification({
      title: next
        ? (isHindi ? 'योजना लॉक की गई' : 'Scheme Locked')
        : (isHindi ? 'योजना अनलॉक की गई' : 'Scheme Unlocked'),
      description: next
        ? `${currentScheme.className} scheme is now locked against edits.`
        : `${currentScheme.className} scheme unlocked for editing.`,
      type: next ? 'warning' : 'success',
    });
  };

  // Toggle Register Lock
  const handleToggleRegisterLock = () => {
    const next = !isRegisterLocked;
    setLockedRegisters((prev) => ({
      ...prev,
      [selectedClass]: next,
    }));
    addNotification({
      title: next
        ? (isHindi ? 'रजिस्टर लॉक किया गया' : 'Register Locked')
        : (isHindi ? 'रजिस्टर अनलॉक किया गया' : 'Register Unlocked'),
      description: next
        ? `${selectedClass} marks ledger locked. Cell inputs are now read-only.`
        : `${selectedClass} marks ledger unlocked for mark entry.`,
      type: next ? 'warning' : 'success',
    });
  };

  // Save Grading Scale
  const handleSaveGradingScale = () => {
    for (const g of tempGradingScale) {
      if (g.min > g.max || g.min < 0 || g.max > 100) {
        addNotification({
          title: isHindi ? 'अमान्य पैमाना' : 'Invalid Range',
          description: `Grade ${g.grade} range (${g.min}–${g.max}%) is invalid.`,
          type: 'warning',
        });
        return;
      }
    }
    setGradingScale(tempGradingScale);
    setIsEditingGrading(false);

    // Recalculate marksData with the updated grading scale
    setMarksData((prev) =>
      prev.map((row) => ({
        ...row,
        grade: getGradeFromScale(row.pct, tempGradingScale),
      }))
    );

    addNotification({
      title: isHindi ? 'ग्रेडिंग पैमाना सहेजा गया' : 'Grading Scale Saved',
      description: 'Updated criteria applied across marks ledger.',
      type: 'success',
    });
  };

  // Reset Grading Scale
  const handleResetGradingScale = () => {
    setTempGradingScale([...INITIAL_GRADING_SCALE]);
    setGradingScale([...INITIAL_GRADING_SCALE]);
    setIsEditingGrading(false);
    setMarksData((prev) =>
      prev.map((row) => ({
        ...row,
        grade: getGradeFromScale(row.pct, INITIAL_GRADING_SCALE),
      }))
    );
    addNotification({
      title: isHindi ? 'रीसेट पूर्ण' : 'Scale Reset',
      description: 'Reverted to CBSE standard 9-point scale.',
      type: 'info',
    });
  };

  // Student mark update handler
  const handleStudentMarkChange = (
    rollNo: string,
    subject: 'maths' | 'science' | 'english' | 'social' | 'hindi',
    val: number
  ) => {
    setMarksData((prev) =>
      prev.map((row) => {
        if (row.rollNo !== rollNo) return row;
        const updated = { ...row, [subject]: val };
        updated.total = updated.maths + updated.science + updated.english + updated.social + updated.hindi;
        updated.pct = Number((updated.total / 5).toFixed(1));
        updated.grade = getGradeFromScale(updated.pct, gradingScale);
        return updated;
      })
    );
  };

  // Handle Save Edited Scheme for selected class
  const handleSaveClassScheme = () => {
    const invalid = editingSubjects.find((s) => s.theoryMax + s.practicalMax + s.internalMax !== s.totalMax);
    if (invalid) {
      addNotification({
        title: isHindi ? 'सत्यापन विफल' : 'Invalid Marks',
        description: `Subject "${invalid.subject}" marks do not equal total ${invalid.totalMax}.`,
        type: 'warning',
      });
      return;
    }

    setMarksSchemes((prev) => ({
      ...prev,
      [selectedSchemeClass]: {
        ...prev[selectedSchemeClass],
        subjects: editingSubjects,
      },
    }));
    setIsEditingScheme(false);

    addNotification({
      title: isHindi ? 'अंक योजना सहेजी गई' : 'Marks Scheme Saved',
      description: `${marksSchemes[selectedSchemeClass]?.className} updated.`,
      type: 'success',
    });
  };

  // Reset to default board scheme
  const handleResetToBoardScheme = () => {
    const defaultScheme = INITIAL_MARKS_SCHEMES[selectedSchemeClass];
    if (defaultScheme) {
      setEditingSubjects([...defaultScheme.subjects]);
      setMarksSchemes((prev) => ({
        ...prev,
        [selectedSchemeClass]: { ...defaultScheme },
      }));
      setIsEditingScheme(false);
      addNotification({
        title: isHindi ? 'योजना रीसेट' : 'Reset to Board',
        description: `Reverted to official criteria.`,
        type: 'info',
      });
    }
  };

  // Handle Schedule Exam Submit
  const handleCreateExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim()) return;

    const created: ExamRecord = {
      id: String(Date.now()),
      code: newExamCode.trim(),
      title: newExamTitle.trim(),
      session: newExamSession,
      grade: newExamGrade,
      dates: newExamDates,
      totalCandidates: Number(newExamCandidates) || 500,
      marksEnteredPct: 0,
      status: 'Scheduled',
      papersCount: 5,
      timetable: [
        { id: `NEW-1`, date: '2026-11-16', displayDate: '16 Nov 2026 (Mon)', subject: 'Core Subject 1', paperCode: 'Code: 001', grade: newExamGrade, timeSlot: '09:00 AM – 12:00 PM', duration: '3h', hall: 'Main Exam Halls', maxMarks: 80, invigilator: 'Faculty', status: 'Upcoming' },
        { id: `NEW-2`, date: '2026-11-19', displayDate: '19 Nov 2026 (Thu)', subject: 'Core Subject 2', paperCode: 'Code: 002', grade: newExamGrade, timeSlot: '09:00 AM – 12:00 PM', duration: '3h', hall: 'Main Exam Halls', maxMarks: 80, invigilator: 'Faculty', status: 'Upcoming' },
        { id: `NEW-3`, date: '2026-11-23', displayDate: '23 Nov 2026 (Mon)', subject: 'Core Subject 3', paperCode: 'Code: 003', grade: newExamGrade, timeSlot: '09:00 AM – 12:00 PM', duration: '3h', hall: 'Main Exam Halls', maxMarks: 80, invigilator: 'Faculty', status: 'Upcoming' },
        { id: `NEW-4`, date: '2026-11-26', displayDate: '26 Nov 2026 (Thu)', subject: 'Language', paperCode: 'Code: 004', grade: newExamGrade, timeSlot: '09:00 AM – 12:00 PM', duration: '3h', hall: 'Main Exam Halls', maxMarks: 80, invigilator: 'Faculty', status: 'Upcoming' },
        { id: `NEW-5`, date: '2026-11-28', displayDate: '28 Nov 2026 (Sat)', subject: 'Skill / Lab', paperCode: 'Code: 005', grade: newExamGrade, timeSlot: '09:00 AM – 11:00 AM', duration: '2h', hall: 'Lab Centers', maxMarks: 50, invigilator: 'Instructors', status: 'Upcoming' },
      ],
    };

    setExams([created, ...exams]);
    setSelectedExamId(created.id);
    setIsScheduleDrawerOpen(false);
    setNewExamTitle('');
    setNewExamCode(`EXAM-2026-0${exams.length + 2}`);

    addNotification({
      title: isHindi ? 'एग्जाम शेड्यूल हुआ' : 'Exam Scheduled',
      description: `"${created.title}" scheduled.`,
      type: 'success',
    });
  };

  // Add single paper to active exam timetable
  const handleAddPaperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paperSubject.trim()) return;

    const newPaper: ExamPaper = {
      id: `P-${Date.now()}`,
      date: paperDate,
      displayDate: paperDisplayDate,
      dayNumber: paperDisplayDate.slice(0, 2).trim() || '15',
      monthText: paperDisplayDate.slice(3, 6).toUpperCase() || 'OCT',
      dayOfWeek: 'MON',
      relativeTiming: 'UPCOMING',
      subject: paperSubject.trim(),
      paperCode: paperCode.trim() || 'Code: 101',
      subjectCategory: 'Core Theory',
      grade: activeExam.grade,
      timeSlot: paperTimeSlot,
      duration: paperDuration,
      shift: 'Morning',
      reportingTime: '08:30 AM',
      readingTime: '08:45 AM (15m)',
      hall: paperHall,
      hallBlock: 'Academic Examination Wing',
      capacity: '120 Desks',
      maxMarks: Number(paperMaxMarks) || 80,
      passMarks: Math.round((Number(paperMaxMarks) || 80) * 0.33),
      internalMarks: 20,
      invigilator: paperInvigilator,
      assistantInvigilator: 'Department Duty Staff',
      status: 'Upcoming',
    };

    setExams((prev) =>
      prev.map((ex) =>
        ex.id === activeExam.id
          ? {
              ...ex,
              papersCount: ex.timetable.length + 1,
              timetable: [...ex.timetable, newPaper],
            }
          : ex
      )
    );

    setIsAddPaperModalOpen(false);
    setPaperSubject('');
    setPaperCode('');

    addNotification({
      title: isHindi ? 'प्रश्नपत्र जोड़ा गया' : 'Paper Added',
      description: `${newPaper.subject} added.`,
      type: 'success',
    });
  };

  // Tab 1 Filtered Papers & Timetable Telemetry
  const filteredPapers = activeExam.timetable.filter((p) => {
    const q = paperSearch.toLowerCase().trim();
    const matchSearch =
      !q ||
      p.subject.toLowerCase().includes(q) ||
      p.paperCode.toLowerCase().includes(q) ||
      p.hall.toLowerCase().includes(q) ||
      (p.invigilator && p.invigilator.toLowerCase().includes(q)) ||
      (p.subjectCategory && p.subjectCategory.toLowerCase().includes(q));

    const matchStatus =
      paperStatusFilter === 'All' ||
      p.status === paperStatusFilter ||
      (paperStatusFilter === 'Active Live' && p.status === 'Active Today');

    const matchCategory =
      paperCategoryFilter === 'All' || p.subjectCategory === paperCategoryFilter;

    const matchShift =
      paperShiftFilter === 'All' || p.shift === paperShiftFilter;

    return matchSearch && matchStatus && matchCategory && matchShift;
  });

  const totalPapersCount = activeExam.timetable.length;
  const completedPapersCount = activeExam.timetable.filter((p) => p.status === 'Completed').length;
  const activeLiveCount = activeExam.timetable.filter((p) => p.status === 'Active Today').length;
  const upcomingCount = activeExam.timetable.filter((p) => p.status === 'Upcoming').length;

  // Tab 3 Filtered Students & Stats
  const filteredStudents = marksData.filter((s) => {
    const q = studentSearch.toLowerCase().trim();
    return !q || s.name.toLowerCase().includes(q) || s.rollNo.includes(q);
  });

  const classAvg = marksData.length > 0
    ? (marksData.reduce((acc, s) => acc + s.pct, 0) / marksData.length).toFixed(1)
    : '0';

  const topScorer = marksData.length > 0
    ? marksData.reduce((max, s) => (s.pct > max.pct ? s : max), marksData[0])
    : null;

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* 1. Header Action Toolbar */}
      <div className="p-2.5 rounded-[4px] bg-[#141414] border border-border/80 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 shrink-0 shadow-xs">
        {/* Left: 3 Main View Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 3 Unified View Tabs */}
          <div className="flex items-center gap-1 bg-[#1a1a1a] p-0.5 rounded-[4px] border border-border/70 text-xs">
            <button
              type="button"
              onClick={() => setActiveView('timetable')}
              className={cn(
                'px-3 py-1 font-bold rounded-[3px] transition-colors cursor-pointer flex items-center gap-1.5',
                activeView === 'timetable'
                  ? 'bg-[#242424] text-foreground shadow-xs border border-border/70'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
              <span>{isHindi ? 'टाइमटेबल' : 'Timetable'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('scheme')}
              className={cn(
                'px-3 py-1 font-bold rounded-[3px] transition-colors cursor-pointer flex items-center gap-1.5',
                activeView === 'scheme'
                  ? 'bg-[#242424] text-foreground shadow-xs border border-border/70'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Settings2 className="h-3.5 w-3.5 text-zinc-400" />
              <span>{isHindi ? 'अंक योजना' : 'Marks Scheme'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('marks')}
              className={cn(
                'px-3 py-1 font-bold rounded-[3px] transition-colors cursor-pointer flex items-center gap-1.5',
                activeView === 'marks'
                  ? 'bg-[#242424] text-foreground shadow-xs border border-border/70'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-zinc-400" />
              <span>{isHindi ? 'अंक रजिस्टर' : 'Marks Register'}</span>
            </button>
          </div>
        </div>

        {/* Right Actions: Export & Schedule New Exam */}
        <div className="flex items-center gap-2 shrink-0">
          <VFButton
            size="sm"
            variant="outline"
            onClick={() => {
              addNotification({
                title: isHindi ? 'एक्सपोर्ट पूर्ण' : 'Schedule Exported',
                description: `Exported ${activeExam.title}.`,
                type: 'success',
              });
            }}
            className="h-8 px-2.5 text-xs font-bold rounded-[4px]"
            leftIcon={<Download className="h-3.5 w-3.5" />}
          >
            {isHindi ? 'एक्सपोर्ट' : 'Export'}
          </VFButton>

          <VFButton
            size="sm"
            onClick={() => setIsScheduleDrawerOpen(true)}
            className="h-8 px-3 text-xs font-bold rounded-[4px] shadow-xs"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            {isHindi ? 'एग्जाम शेड्यूल करें' : 'Schedule Exam'}
          </VFButton>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 1: EXAM TIMETABLE & DATE SHEET
          ══════════════════════════════════════════════════════════════════════ */}
      {activeView === 'timetable' && (
        <div className="flex-1 min-h-0 flex flex-col space-y-3">
          {/* 1. Exam Switcher & Active Context Ribbon */}
          <div className="p-3 rounded-[4px] bg-[#141414] border border-border/80 flex flex-col xl:flex-row xl:items-center justify-between gap-3 shrink-0 shadow-xs">
            {/* Left: Dropdown Selector + Context Info */}
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 font-medium">
                <GraduationCap className="h-4 w-4 text-amber-500" />
                <span className="font-bold text-foreground">{isHindi ? 'एक्टिव एग्जाम:' : 'Selected Exam:'}</span>
              </div>

              {/* Primary Exam Dropdown */}
              <div className="relative min-w-[280px] sm:min-w-[340px] max-w-full">
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full h-8.5 pl-3 pr-8 text-xs font-bold bg-[#1a1a1a] border border-border/90 rounded-[4px] text-foreground focus:outline-none focus:border-zinc-400 cursor-pointer appearance-none shadow-inner tracking-tight font-mono"
                >
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id} className="bg-[#181818] text-foreground py-1">
                      [{ex.status.toUpperCase()}] {ex.code} · {ex.title} ({ex.timetable.length} Papers)
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>

              {/* Active Exam Status Badge */}
              <VFBadge
                variant={
                  activeExam.status === 'Active Live'
                    ? 'danger'
                    : activeExam.status === 'Evaluation'
                    ? 'warning'
                    : activeExam.status === 'Published'
                    ? 'success'
                    : 'outline'
                }
                className="text-[11px] font-bold px-2 py-0.5"
              >
                {activeExam.status === 'Active Live' ? (
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-[2px] bg-rose-500 animate-pulse" />
                    {isHindi ? 'एक्टिव एग्जाम' : 'Active Live'}
                  </span>
                ) : (
                  activeExam.status
                )}
              </VFBadge>

              {/* Session & Target Class Chip */}
              <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-[3px] bg-[#1a1a1a] border border-border/70 text-[11px] font-mono text-muted-foreground">
                <span>{activeExam.grade}</span>
                <span>•</span>
                <span>{activeExam.dates}</span>
              </div>

              {/* Chief Superintendent & Control Room */}
              {activeExam.controlRoom && (
                <div className="hidden 2xl:flex items-center gap-1 px-2 py-1 rounded-[3px] bg-[#181818] border border-border/60 text-[10px] text-zinc-400 font-mono">
                  <span>{activeExam.controlRoom}</span>
                </div>
              )}
            </div>

            {/* Right: Metrics & Overview Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Telemetry Counter Badges */}
              <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-[4px] border border-border/70 text-[11px] font-mono">
                <div className="px-2 py-0.5 rounded-[2px] bg-zinc-800/80 text-foreground font-bold">
                  {totalPapersCount} {isHindi ? 'पेपर' : 'Papers'}
                </div>
                {activeLiveCount > 0 && (
                  <div className="px-2 py-0.5 rounded-[2px] bg-rose-950/60 text-rose-300 font-bold border border-rose-800/50 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-[2px] bg-rose-400 animate-pulse" />
                    {activeLiveCount} Live
                  </div>
                )}
                <div className="px-2 py-0.5 rounded-[2px] bg-emerald-950/50 text-emerald-300 border border-emerald-800/40">
                  {completedPapersCount} Done
                </div>
                <div className="px-2 py-0.5 rounded-[2px] text-muted-foreground">
                  {upcomingCount} Up
                </div>
              </div>

              {/* Toggle Overview Cards button */}
              <button
                type="button"
                onClick={() => setShowOverviewCards(!showOverviewCards)}
                className={cn(
                  'h-8 px-2.5 text-xs font-bold rounded-[4px] border transition-colors cursor-pointer flex items-center gap-1.5',
                  showOverviewCards
                    ? 'bg-zinc-800 text-foreground border-zinc-500'
                    : 'bg-[#1a1a1a] text-muted-foreground hover:text-foreground border-border/80'
                )}
                title="Toggle all examination cards"
              >
                <Layers className="h-3.5 w-3.5 text-zinc-400" />
                <span>{showOverviewCards ? (isHindi ? 'कार्ड छिपाएं' : 'Hide Cards') : (isHindi ? 'सभी एग्जाम कार्ड्स' : 'All Exam Cards')}</span>
              </button>
            </div>
          </div>

          {/* Optional Collapsible Exam Cards Grid */}
          {showOverviewCards && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5 shrink-0 animate-in fade-in duration-200">
              {exams.map((ex) => {
                const isSelected = ex.id === activeExam.id;
                return (
                  <div
                    key={ex.id}
                    onClick={() => setSelectedExamId(ex.id)}
                    className={cn(
                      'p-2.5 rounded-[4px] border transition-all duration-150 cursor-pointer flex flex-col justify-between select-none shadow-xs text-left',
                      isSelected
                        ? 'bg-[#1c1c1c] border-amber-500/80 ring-1 ring-amber-500/20 text-foreground'
                        : 'bg-[#141414] border-border/80 hover:bg-[#181818] hover:border-zinc-600 text-muted-foreground'
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                          {ex.code}
                        </span>
                        <VFBadge
                          variant={
                            ex.status === 'Active Live'
                              ? 'danger'
                              : ex.status === 'Evaluation'
                              ? 'warning'
                              : ex.status === 'Published'
                              ? 'success'
                              : 'outline'
                          }
                          className="text-[9px] font-bold px-1.5 py-0 shrink-0"
                        >
                          {ex.status}
                        </VFBadge>
                      </div>
                      <h4 className="font-bold text-foreground text-xs leading-snug truncate" title={ex.title}>
                        {ex.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground font-medium mt-1 truncate">
                        {ex.dates}
                      </p>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-border/60 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-muted-foreground truncate">{ex.grade}</span>
                      <span className="font-bold text-foreground shrink-0">
                        {ex.timetable.length} {isHindi ? 'पेपर' : 'Papers'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. Date Sheet Filters & Master Toolbar */}
          <div className="p-2.5 rounded-[4px] bg-[#141414] border border-border/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
            {/* Search & Quick Filter Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search input */}
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={isHindi ? 'विषय, कोड, हॉल या निरीक्षक खोजें...' : 'Search subject, code, hall, invigilator...'}
                  value={paperSearch}
                  onChange={(e) => setPaperSearch(e.target.value)}
                  className="h-8 pl-8 pr-3 text-xs bg-[#1a1a1a] border border-border rounded-[4px] text-foreground placeholder:text-muted-foreground w-44 sm:w-60 focus:outline-none focus:border-zinc-500 font-sans"
                />
                {paperSearch && (
                  <button
                    type="button"
                    onClick={() => setPaperSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <VFSelect
                value={paperStatusFilter}
                onChange={(e) => setPaperStatusFilter(String(e.target.value))}
                options={[
                  { label: isHindi ? 'सभी स्थिति' : 'Status: All', value: 'All' },
                  { label: isHindi ? 'सक्रिय आज' : 'Active Live', value: 'Active Live' },
                  { label: isHindi ? 'संपन्न' : 'Completed', value: 'Completed' },
                  { label: isHindi ? 'आगामी' : 'Upcoming', value: 'Upcoming' },
                ]}
                className="w-32 bg-[#1a1a1a] border-border h-8 text-xs rounded-[4px]"
              />

              {/* Category Filter */}
              <VFSelect
                value={paperCategoryFilter}
                onChange={(e) => setPaperCategoryFilter(String(e.target.value))}
                options={[
                  { label: isHindi ? 'सभी श्रेणियां' : 'Category: All', value: 'All' },
                  { label: 'Core Theory', value: 'Core Theory' },
                  { label: 'Language', value: 'Language' },
                  { label: 'Skill Subject', value: 'Skill Subject' },
                  { label: 'Practical / Lab', value: 'Practical / Lab' },
                ]}
                className="w-36 bg-[#1a1a1a] border-border h-8 text-xs rounded-[4px]"
              />

              {/* Shift Filter */}
              <VFSelect
                value={paperShiftFilter}
                onChange={(e) => setPaperShiftFilter(String(e.target.value))}
                options={[
                  { label: isHindi ? 'सभी पालियां' : 'Shift: All', value: 'All' },
                  { label: isHindi ? 'प्रातः (Morning)' : 'Morning Shift', value: 'Morning' },
                  { label: isHindi ? 'दोपहर (Afternoon)' : 'Afternoon Shift', value: 'Afternoon' },
                ]}
                className="w-32 bg-[#1a1a1a] border-border h-8 text-xs rounded-[4px]"
              />

              {(paperSearch || paperStatusFilter !== 'All' || paperCategoryFilter !== 'All' || paperShiftFilter !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setPaperSearch('');
                    setPaperStatusFilter('All');
                    setPaperCategoryFilter('All');
                    setPaperShiftFilter('All');
                  }}
                  className="text-[11px] text-zinc-400 hover:text-foreground font-mono underline ml-1 cursor-pointer"
                >
                  {isHindi ? 'रीसेट' : 'Clear'}
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Add Paper */}
              <VFButton
                size="sm"
                variant="outline"
                onClick={() => setIsAddPaperModalOpen(true)}
                className="h-8 px-2.5 text-xs font-bold rounded-[4px]"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
              >
                {isHindi ? 'प्रश्नपत्र' : 'Paper'}
              </VFButton>

              {/* Official Datesheet Notice Modal */}
              <VFButton
                size="sm"
                variant="outline"
                onClick={() => setIsDatesheetModalOpen(true)}
                className="h-8 px-2.5 text-xs font-bold rounded-[4px] border-zinc-700 hover:border-zinc-500"
                leftIcon={<FileText className="h-3.5 w-3.5 text-amber-400" />}
              >
                {isHindi ? 'आधिकारिक डेटशीट' : 'Datesheet Notice'}
              </VFButton>

              {/* Print */}
              <VFButton
                size="sm"
                variant="outline"
                onClick={() => window.print()}
                className="h-8 px-2.5 text-xs font-bold rounded-[4px]"
                leftIcon={<Printer className="h-3.5 w-3.5" />}
              >
                {isHindi ? 'प्रिंट' : 'Print'}
              </VFButton>
            </div>
          </div>

          {/* 3. Timetable Views Content */}
          {filteredPapers.length === 0 ? (
            <VFCard className="bg-[#141414] border-border/80 flex-1 min-h-[260px] flex items-center justify-center p-8 text-center">
              <div className="max-w-md space-y-2">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
                <h3 className="font-bold text-foreground text-sm">
                  {isHindi ? 'कोई प्रश्नपत्र नहीं मिला' : 'No Papers Found'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isHindi
                    ? 'सर्च या फिल्टर के लिए कोई एग्जाम नहीं मिला।'
                    : 'No exam papers matched your search query or filter settings.'}
                </p>
                <VFButton
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPaperSearch('');
                    setPaperStatusFilter('All');
                    setPaperCategoryFilter('All');
                    setPaperShiftFilter('All');
                  }}
                  className="rounded-[4px] text-xs font-bold mt-2"
                >
                  {isHindi ? 'फ़िल्टर साफ़ करें' : 'Clear All Filters'}
                </VFButton>
              </div>
            </VFCard>
          ) : (
            /* Timeline View */
            <div className="flex-1 min-h-0 overflow-y-auto pb-6 pr-2">
              <div className="flex flex-col gap-3 sm:gap-3.5 my-1">
                {filteredPapers.map((paper, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === filteredPapers.length - 1;

                  return (
                    <div key={paper.id} className="relative flex items-center gap-3 sm:gap-3.5 group">
                      {/* Timeline Track & Node Column (Vertically Centered with the Card) */}
                      <div className="relative flex items-center justify-center shrink-0 w-8 self-stretch">
                        {/* Top Connector Line (from top of row down to circle center) */}
                        {!isFirst && (
                          <div className="absolute top-0 bottom-1/2 left-1/2 -translate-x-1/2 w-0.5 bg-zinc-700/80 group-hover:bg-zinc-500 transition-colors" />
                        )}

                        {/* Bottom Connector Line (from circle center down across the gap) */}
                        {!isLast && (
                          <div className="absolute top-1/2 -bottom-3 sm:-bottom-3.5 left-1/2 -translate-x-1/2 w-0.5 bg-zinc-700/80 group-hover:bg-zinc-500 transition-colors" />
                        )}

                        {/* Progression Node on Track (Centered Vertically to the Card) */}
                        <div
                          className={cn(
                            'relative z-10 w-7 h-7 rounded-[4px] border-2 flex items-center justify-center font-mono text-[11px] font-black shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-sm',
                            paper.status === 'Completed'
                              ? 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                              : paper.status === 'Active Today'
                              ? 'bg-rose-950 border-rose-500 text-rose-300 ring-4 ring-rose-500/20 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                              : 'bg-[#181818] border-zinc-600 text-zinc-400'
                          )}
                        >
                          {paper.status === 'Completed' ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3]" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                      </div>

                      {/* Milestone Card */}
                      <div className="flex-1 min-w-0 p-3 sm:p-3.5 rounded-[4px] bg-[#141414] border border-border/80 hover:border-zinc-600 transition-colors shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-border/60">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-foreground text-xs">{paper.subject}</span>
                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-[2px] bg-zinc-800 text-zinc-300 border border-border/80">
                              {paper.paperCode}
                            </span>
                            <span className="text-[10px] text-muted-foreground">·</span>
                            <span className="text-xs font-semibold text-zinc-300">{paper.displayDate}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <VFBadge
                              variant={paper.status === 'Completed' ? 'success' : paper.status === 'Active Today' ? 'danger' : 'outline'}
                              className="text-[10px] font-bold"
                            >
                              {paper.status === 'Active Today' ? 'Live Today' : paper.status}
                            </VFBadge>
                            <button
                              type="button"
                              onClick={() => setSeatingModalPaper(paper)}
                              title={isHindi ? 'सिटिंग व्यवस्था' : 'Seating Plan'}
                              aria-label={isHindi ? 'सिटिंग व्यवस्था' : 'Seating Plan'}
                              className="h-6 w-6 rounded-[3px] bg-[#1a1a1a] hover:bg-[#252525] border border-border/70 text-amber-400 hover:text-amber-300 flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <MapPin className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-muted-foreground">
                          <div className="text-foreground">
                            <span>{paper.timeSlot} ({paper.duration})</span>
                          </div>
                          <div className="truncate">
                            <span>{paper.hall}</span>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-2">
                            <span className="text-zinc-400">Invigilator: {paper.invigilator}</span>
                            <span className="font-bold text-emerald-400">{paper.maxMarks} M</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 2: CLASS-WISE MARKS SCHEME & WEIGHTAGES CONFIGURATOR
          ══════════════════════════════════════════════════════════════════════ */}
      {activeView === 'scheme' && (
        <div className="space-y-3 flex-1 min-h-0 flex flex-col">
          {/* Class Switcher Strip */}
          <div className="p-2.5 rounded-[4px] bg-[#141414] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                {isHindi ? 'अंक योजना' : 'Marks Scheme'}
              </span>
              <span className="text-muted-foreground text-xs">·</span>
              <span className="text-[11px] text-muted-foreground">
                {isHindi ? 'सैद्धांतिक, प्रायोगिक व आंतरिक अंक' : 'Theory, practical & internal criteria'}
              </span>
            </div>

            {/* Class Dropdown Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                {isHindi ? 'कक्षा:' : 'Grade:'}
              </span>
              <VFSelect
                value={selectedSchemeClass}
                onChange={(e) => setSelectedSchemeClass(String(e.target.value))}
                options={[
                  { label: 'Class 10 (Secondary - CBSE)', value: 'class-10' },
                  { label: 'Class 12 - Science (PCM/PCB)', value: 'class-12-sci' },
                  { label: 'Class 12 - Commerce & Arts', value: 'class-12-com' },
                  { label: 'Class 9 (Foundation)', value: 'class-9' },
                  { label: 'Class 6–8 (Middle School)', value: 'class-6-8' },
                ]}
                className="w-56 bg-[#1a1a1a] border-border h-8 text-xs font-bold rounded-[4px]"
              />
            </div>
          </div>

          {/* Active Class Scheme Detail Banner */}
          <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="font-bold text-foreground text-sm">{currentScheme.className}</h4>
                <span className="text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-[3px]">
                  {currentScheme.board}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentScheme.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isCurrentSchemeLocked ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 font-mono px-2 py-1 rounded-[3px] bg-amber-500/10 border border-amber-500/30">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                  <VFButton
                    size="sm"
                    variant="outline"
                    onClick={handleToggleSchemeLock}
                    className="h-8 px-2.5 text-xs font-bold rounded-[4px] text-zinc-300 border-zinc-700 hover:bg-zinc-800"
                    leftIcon={<Unlock className="h-3.5 w-3.5 text-zinc-400" />}
                  >
                    {isHindi ? 'अनलॉक' : 'Unlock Scheme'}
                  </VFButton>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <VFButton
                    size="sm"
                    variant="outline"
                    onClick={handleToggleSchemeLock}
                    className="h-8 px-2.5 text-xs font-bold rounded-[4px] text-zinc-400 hover:text-foreground"
                    leftIcon={<Lock className="h-3.5 w-3.5" />}
                  >
                    {isHindi ? 'लॉक करें' : 'Lock Scheme'}
                  </VFButton>
                  {!isEditingScheme ? (
                    <VFButton
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingScheme(true)}
                      className="h-8 px-3 text-xs font-bold rounded-[4px]"
                      leftIcon={<Edit3 className="h-3.5 w-3.5" />}
                    >
                      {isHindi ? 'एडिट स्कीम' : 'Edit Scheme'}
                    </VFButton>
                  ) : (
                    <div className="flex items-center gap-2">
                      <VFButton
                        size="sm"
                        variant="outline"
                        onClick={handleResetToBoardScheme}
                        className="h-8 px-2.5 text-xs font-bold rounded-[4px]"
                        leftIcon={<RotateCcw className="h-3 w-3" />}
                      >
                        {isHindi ? 'रीसेट' : 'Reset'}
                      </VFButton>
                      <VFButton
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingSubjects([...currentScheme.subjects]);
                          setIsEditingScheme(false);
                        }}
                        className="h-8 px-2.5 text-xs font-bold rounded-[4px]"
                      >
                        {isHindi ? 'कैंसिल' : 'Cancel'}
                      </VFButton>
                      <VFButton
                        size="sm"
                        onClick={handleSaveClassScheme}
                        className="h-8 px-3 text-xs font-bold rounded-[4px] shadow-xs"
                        leftIcon={<Save className="h-3.5 w-3.5" />}
                      >
                        {isHindi ? 'सुरक्षित करें' : 'Save'}
                      </VFButton>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Subject-Wise Marks Allocation Table */}
          <VFCard className="bg-[#141414] border-border/80 flex-1 min-h-0 flex flex-col" bodyClassName="p-0 flex-1 overflow-auto">
            <VFTable className="rounded-none border-0 text-xs w-full">
              <VFTableHead className="bg-[#1a1a1a] sticky top-0 z-10">
                <VFTableRow>
                  <VFTableHeaderCell className="py-2.5 px-4 text-xs font-bold text-muted-foreground">{isHindi ? 'विषय' : 'Subject'}</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground">{isHindi ? 'कोड' : 'Code'}</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground text-center">{isHindi ? 'सैद्धांतिक' : 'Theory'}</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground text-center">{isHindi ? 'प्रायोगिक' : 'Practical'}</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground text-center">{isHindi ? 'आंतरिक' : 'Internal'}</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground text-center">{isHindi ? 'पूर्णांक' : 'Total'}</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground text-center">{isHindi ? 'उत्तीर्णांक' : 'Passing Rule'}</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-4 text-xs font-bold text-muted-foreground text-right">{isHindi ? 'स्थिति' : 'Status'}</VFTableHeaderCell>
                </VFTableRow>
              </VFTableHead>
              <VFTableBody>
                {editingSubjects.map((sub, idx) => {
                  const currentTotal = sub.theoryMax + sub.practicalMax + sub.internalMax;
                  const isValidTotal = currentTotal === sub.totalMax;

                  return (
                    <VFTableRow key={sub.id} className="hover:bg-[#1a1a1a]/60">
                      <VFTableCell className="py-2.5 px-4 font-bold text-foreground text-xs">
                        {sub.subject}
                      </VFTableCell>
                      <VFTableCell className="py-2.5 px-3 font-mono text-muted-foreground text-xs">
                        {sub.code}
                      </VFTableCell>

                      {/* Theory Max Input / Display */}
                      <VFTableCell className="py-2 px-3 text-center">
                        {isEditingScheme ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={sub.theoryMax}
                            onChange={(e) => {
                              const updated = [...editingSubjects];
                              updated[idx].theoryMax = Number(e.target.value) || 0;
                              setEditingSubjects(updated);
                            }}
                            className="w-16 h-7 text-center bg-[#1a1a1a] border border-border rounded-[3px] font-mono font-bold text-xs text-foreground focus:outline-none focus:border-zinc-500 mx-auto"
                          />
                        ) : (
                          <span className="font-mono font-bold text-foreground text-xs">{sub.theoryMax}</span>
                        )}
                      </VFTableCell>

                      {/* Practical Max Input / Display */}
                      <VFTableCell className="py-2 px-3 text-center">
                        {isEditingScheme ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={sub.practicalMax}
                            onChange={(e) => {
                              const updated = [...editingSubjects];
                              updated[idx].practicalMax = Number(e.target.value) || 0;
                              setEditingSubjects(updated);
                            }}
                            className="w-16 h-7 text-center bg-[#1a1a1a] border border-border rounded-[3px] font-mono font-bold text-xs text-foreground focus:outline-none focus:border-zinc-500 mx-auto"
                          />
                        ) : (
                          <span className="font-mono font-bold text-foreground text-xs">{sub.practicalMax}</span>
                        )}
                      </VFTableCell>

                      {/* Internal Max Input / Display */}
                      <VFTableCell className="py-2 px-3 text-center">
                        {isEditingScheme ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={sub.internalMax}
                            onChange={(e) => {
                              const updated = [...editingSubjects];
                              updated[idx].internalMax = Number(e.target.value) || 0;
                              setEditingSubjects(updated);
                            }}
                            className="w-16 h-7 text-center bg-[#1a1a1a] border border-border rounded-[3px] font-mono font-bold text-xs text-foreground focus:outline-none focus:border-zinc-500 mx-auto"
                          />
                        ) : (
                          <span className="font-mono font-bold text-foreground text-xs">{sub.internalMax}</span>
                        )}
                      </VFTableCell>

                      {/* Total Marks */}
                      <VFTableCell className="py-2.5 px-3 text-center font-mono font-bold text-xs text-foreground">
                        {currentTotal} / {sub.totalMax}
                      </VFTableCell>

                      {/* Passing Criteria */}
                      <VFTableCell className="py-2.5 px-3 text-center">
                        <span className="font-mono text-xs text-muted-foreground">
                          {sub.passCriteriaPct}% {sub.separateTheoryPass ? '(Separate)' : '(Aggregate)'}
                        </span>
                      </VFTableCell>

                      {/* Validation Status Badge */}
                      <VFTableCell className="py-2.5 px-4 text-right">
                        {isValidTotal ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 font-mono">
                            <CheckCircle2 className="h-3 w-3" /> Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 font-mono">
                            <AlertCircle className="h-3 w-3" /> ≠ 100
                          </span>
                        )}
                      </VFTableCell>
                    </VFTableRow>
                  );
                })}
              </VFTableBody>
            </VFTable>
          </VFCard>

          {/* Standard Grading Scale Matrix Reference & Configurator */}
          <div className="p-3 rounded-[4px] bg-[#141414] border border-border/80 space-y-2.5 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground text-xs">
                  {isHindi ? 'सीबीएसई 9-पॉइंट ग्रेडिंग पैमाना' : 'CBSE 9-Point Grading Scale'}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {isEditingGrading ? (isHindi ? 'संपादन मोड' : 'Editable Mode') : (isHindi ? 'मानदंड' : 'Evaluation Criteria')}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {!isEditingGrading ? (
                  <VFButton
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTempGradingScale([...gradingScale]);
                      setIsEditingGrading(true);
                    }}
                    className="h-7 px-2.5 text-[11px] font-bold rounded-[4px]"
                    leftIcon={<Edit3 className="h-3 w-3" />}
                  >
                    {isHindi ? 'स्केल एडिट करें' : 'Edit Scale'}
                  </VFButton>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <VFButton
                      size="sm"
                      variant="outline"
                      onClick={handleResetGradingScale}
                      className="h-7 px-2 text-[11px] font-bold rounded-[4px]"
                      leftIcon={<RotateCcw className="h-3 w-3" />}
                    >
                      {isHindi ? 'रीसेट' : 'Reset'}
                    </VFButton>
                    <VFButton
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setTempGradingScale([...gradingScale]);
                        setIsEditingGrading(false);
                      }}
                      className="h-7 px-2 text-[11px] font-bold rounded-[4px]"
                    >
                      {isHindi ? 'कैंसिल' : 'Cancel'}
                    </VFButton>
                    <VFButton
                      size="sm"
                      onClick={handleSaveGradingScale}
                      className="h-7 px-2.5 text-[11px] font-bold rounded-[4px] shadow-xs"
                      leftIcon={<Save className="h-3 w-3" />}
                    >
                      {isHindi ? 'सुरक्षित करें' : 'Save Scale'}
                    </VFButton>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {(isEditingGrading ? tempGradingScale : gradingScale).map((g, gIdx) => (
                <div key={g.grade} className={cn('p-2 rounded-[3px] border text-center font-mono text-xs flex flex-col justify-between gap-1', g.color)}>
                  <p className="font-black text-sm">{g.grade}</p>

                  {isEditingGrading ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={g.min}
                          onChange={(e) => {
                            const updated = [...tempGradingScale];
                            updated[gIdx].min = Number(e.target.value) || 0;
                            setTempGradingScale(updated);
                          }}
                          className="w-9 h-6 text-center bg-[#1a1a1a] border border-border rounded-[2px] font-mono text-[10px] text-foreground focus:outline-none focus:border-zinc-400"
                        />
                        <span className="text-[10px] opacity-60">–</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={g.max}
                          onChange={(e) => {
                            const updated = [...tempGradingScale];
                            updated[gIdx].max = Number(e.target.value) || 0;
                            setTempGradingScale(updated);
                          }}
                          className="w-9 h-6 text-center bg-[#1a1a1a] border border-border rounded-[2px] font-mono text-[10px] text-foreground focus:outline-none focus:border-zinc-400"
                        />
                      </div>
                      <input
                        type="text"
                        value={g.desc}
                        onChange={(e) => {
                          const updated = [...tempGradingScale];
                          updated[gIdx].desc = e.target.value;
                          setTempGradingScale(updated);
                        }}
                        className="w-full h-5 text-center bg-[#1a1a1a] border border-border/70 rounded-[2px] text-[9px] text-muted-foreground focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="text-[10px] font-bold mt-0.5">{g.min}–{g.max}%</p>
                      <p className="text-[9px] opacity-70 mt-0.5 leading-none">{g.desc}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 3: MARKS ENTRY REGISTER VIEW
          ══════════════════════════════════════════════════════════════════════ */}
      {activeView === 'marks' && (
        <div className="space-y-3 flex-1 min-h-0 flex flex-col">
          {/* Controls Bar */}
          <div className="p-2.5 rounded-[4px] bg-[#141414] border border-border/80 flex flex-wrap items-center justify-between gap-2.5 shrink-0 shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                {isHindi ? 'कक्षा:' : 'Class:'}
              </span>
              <VFSelect
                value={selectedClass}
                onChange={(e) => setSelectedClass(String(e.target.value))}
                options={[
                  { label: 'Class 10 - Section A', value: 'Class 10-A' },
                  { label: 'Class 10 - Section B', value: 'Class 10-B' },
                  { label: 'Class 9 - Section A', value: 'Class 9-A' },
                  { label: 'Class 11 - Science', value: 'Class 11-Sci' },
                  { label: 'Class 12 - Commerce', value: 'Class 12-Com' },
                ]}
                className="w-48 bg-[#1a1a1a] border-border h-8 text-xs font-bold rounded-[4px]"
              />

              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={isHindi ? 'स्टूडेंट सर्च करें...' : 'Search student...'}
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="h-8 pl-8 pr-3 text-xs bg-[#1a1a1a] border border-border rounded-[4px] text-foreground placeholder:text-muted-foreground w-40 sm:w-48 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            {/* Quick Metrics & Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden md:flex items-center gap-2 font-mono text-[11px]">
                <span className="px-2 py-1 rounded-[3px] bg-[#1a1a1a] border border-border/70 text-muted-foreground">
                  Avg: <strong className="text-foreground">{classAvg}%</strong>
                </span>
                {topScorer && (
                  <span className="px-2 py-1 rounded-[3px] bg-[#1a1a1a] border border-border/70 text-muted-foreground">
                    Top: <strong className="text-emerald-400">{topScorer.pct}%</strong>
                  </span>
                )}
              </div>

              {/* Lock / Unlock Register Button */}
              <VFButton
                size="sm"
                variant="outline"
                onClick={handleToggleRegisterLock}
                className={cn(
                  'h-8 px-2.5 text-xs font-bold rounded-[4px]',
                  isRegisterLocked
                    ? 'text-amber-400 border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20'
                    : 'text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                )}
                leftIcon={
                  isRegisterLocked ? (
                    <Lock className="h-3.5 w-3.5 text-amber-400" />
                  ) : (
                    <Unlock className="h-3.5 w-3.5 text-zinc-400" />
                  )
                }
              >
                {isRegisterLocked
                  ? (isHindi ? 'अनलॉक रजिस्टर' : 'Unlock Register')
                  : (isHindi ? 'लॉक रजिस्टर' : 'Lock Register')}
              </VFButton>

              <VFButton
                size="sm"
                variant="outline"
                onClick={() => {
                  addNotification({
                    title: isHindi ? 'एक्सपोर्ट पूर्ण' : 'Exported',
                    description: `Exported ${selectedClass} marksheet.`,
                    type: 'success',
                  });
                }}
                className="h-8 px-2.5 text-xs font-bold rounded-[4px]"
                leftIcon={<Download className="h-3.5 w-3.5" />}
              >
                {isHindi ? 'एक्सल' : 'Excel'}
              </VFButton>

              <VFButton
                size="sm"
                disabled={isRegisterLocked}
                onClick={() => {
                  if (isRegisterLocked) return;
                  addNotification({
                    title: isHindi ? 'अंक सुरक्षित किए गए' : 'Marks Saved',
                    description: `${selectedClass} marks ledger saved successfully.`,
                    type: 'success',
                  });
                }}
                className={cn(
                  'h-8 px-3 text-xs font-bold rounded-[4px] shadow-xs',
                  isRegisterLocked && 'opacity-50 cursor-not-allowed'
                )}
                leftIcon={<Save className="h-3.5 w-3.5" />}
              >
                {isHindi ? 'सुरक्षित करें' : 'Save Marks'}
              </VFButton>
            </div>
          </div>

          {/* Locked Register Notification Banner */}
          {isRegisterLocked && (
            <div className="px-3 py-2 rounded-[4px] bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 text-xs shrink-0">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="font-bold text-amber-300">
                  {isHindi ? 'रजिस्टर लॉक है' : 'Marks Register Locked'}
                </span>
                <span className="text-muted-foreground text-[11px] hidden sm:inline">
                  — {isHindi ? 'एग्जाम सेल द्वारा फाइनलाइज किया गया। एडिटिंग डिसेबल्ड है।' : 'Finalized by Examination Cell. Marks entry is locked to prevent accidental or unauthorized edits.'}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[2px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                READ-ONLY
              </span>
            </div>
          )}

          {/* Marks Spreadsheet Table */}
          <VFCard className="bg-[#141414] border-border/80 flex-1 min-h-0 flex flex-col" bodyClassName="p-0 flex-1 overflow-auto">
            <VFTable className="rounded-none border-0 text-xs w-full">
              <VFTableHead className="bg-[#1a1a1a] sticky top-0 z-10">
                <VFTableRow>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground w-16">{isHindi ? 'रोल नं.' : 'Roll #'}</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground">{isHindi ? 'स्टूडेंट का नाम' : 'Student Name'}</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground text-center w-20">{isHindi ? 'गणित (100)' : 'Maths'}</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground text-center w-20">{isHindi ? 'विज्ञान (100)' : 'Science'}</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground text-center w-20">{isHindi ? 'इंग्लिश (100)' : 'English'}</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground text-center w-20">{isHindi ? 'सोशल साइंस (100)' : 'Social'}</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground text-center w-20">{isHindi ? 'हिंदी (100)' : 'Hindi'}</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground text-center font-mono">{isHindi ? 'टोटल (500)' : 'Total (500)'}</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground text-center font-mono">{isHindi ? 'परसेंटेज' : 'Percentage'}</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-4 text-xs font-bold text-muted-foreground text-right">{isHindi ? 'ग्रेड' : 'Grade'}</VFTableHeaderCell>
                </VFTableRow>
              </VFTableHead>
              <VFTableBody>
                {filteredStudents.length === 0 ? (
                  <VFTableRow>
                    <VFTableCell colSpan={10} className="py-8 text-center text-muted-foreground">
                      {isHindi ? 'कोई स्टूडेंट्स नहीं मिले।' : 'No students found.'}
                    </VFTableCell>
                  </VFTableRow>
                ) : (
                  filteredStudents.map((row) => (
                    <VFTableRow key={row.rollNo} className="hover:bg-[#1a1a1a]/60">
                      <VFTableCell className="py-2 px-3 font-mono font-bold text-muted-foreground text-xs">
                        {row.rollNo}
                      </VFTableCell>
                      <VFTableCell className="py-2 px-3 font-bold text-foreground text-xs">
                        {row.name}
                      </VFTableCell>

                      {/* Maths input or read-only */}
                      {isRegisterLocked ? (
                        <VFTableCell className="py-2 px-2 text-center font-mono font-bold text-xs text-zinc-200">
                          {row.maths}
                        </VFTableCell>
                      ) : (
                        <VFTableCell className="py-1.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={row.maths}
                            onChange={(e) => handleStudentMarkChange(row.rollNo, 'maths', Number(e.target.value) || 0)}
                            className="w-16 h-7 text-center bg-[#181818] hover:bg-[#202020] border border-border/70 rounded-[3px] font-mono font-bold text-xs text-foreground focus:outline-none focus:border-zinc-400 mx-auto"
                          />
                        </VFTableCell>
                      )}

                      {/* Science input or read-only */}
                      {isRegisterLocked ? (
                        <VFTableCell className="py-2 px-2 text-center font-mono font-bold text-xs text-zinc-200">
                          {row.science}
                        </VFTableCell>
                      ) : (
                        <VFTableCell className="py-1.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={row.science}
                            onChange={(e) => handleStudentMarkChange(row.rollNo, 'science', Number(e.target.value) || 0)}
                            className="w-16 h-7 text-center bg-[#181818] hover:bg-[#202020] border border-border/70 rounded-[3px] font-mono font-bold text-xs text-foreground focus:outline-none focus:border-zinc-400 mx-auto"
                          />
                        </VFTableCell>
                      )}

                      {/* English input or read-only */}
                      {isRegisterLocked ? (
                        <VFTableCell className="py-2 px-2 text-center font-mono font-bold text-xs text-zinc-200">
                          {row.english}
                        </VFTableCell>
                      ) : (
                        <VFTableCell className="py-1.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={row.english}
                            onChange={(e) => handleStudentMarkChange(row.rollNo, 'english', Number(e.target.value) || 0)}
                            className="w-16 h-7 text-center bg-[#181818] hover:bg-[#202020] border border-border/70 rounded-[3px] font-mono font-bold text-xs text-foreground focus:outline-none focus:border-zinc-400 mx-auto"
                          />
                        </VFTableCell>
                      )}

                      {/* Social input or read-only */}
                      {isRegisterLocked ? (
                        <VFTableCell className="py-2 px-2 text-center font-mono font-bold text-xs text-zinc-200">
                          {row.social}
                        </VFTableCell>
                      ) : (
                        <VFTableCell className="py-1.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={row.social}
                            onChange={(e) => handleStudentMarkChange(row.rollNo, 'social', Number(e.target.value) || 0)}
                            className="w-16 h-7 text-center bg-[#181818] hover:bg-[#202020] border border-border/70 rounded-[3px] font-mono font-bold text-xs text-foreground focus:outline-none focus:border-zinc-400 mx-auto"
                          />
                        </VFTableCell>
                      )}

                      {/* Hindi input or read-only */}
                      {isRegisterLocked ? (
                        <VFTableCell className="py-2 px-2 text-center font-mono font-bold text-xs text-zinc-200">
                          {row.hindi}
                        </VFTableCell>
                      ) : (
                        <VFTableCell className="py-1.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={row.hindi}
                            onChange={(e) => handleStudentMarkChange(row.rollNo, 'hindi', Number(e.target.value) || 0)}
                            className="w-16 h-7 text-center bg-[#181818] hover:bg-[#202020] border border-border/70 rounded-[3px] font-mono font-bold text-xs text-foreground focus:outline-none focus:border-zinc-400 mx-auto"
                          />
                        </VFTableCell>
                      )}

                      <VFTableCell className="py-2 px-3 font-mono font-bold text-foreground text-center text-xs">
                        {row.total}
                      </VFTableCell>
                      <VFTableCell className="py-2 px-3 font-mono font-bold text-emerald-400 text-center text-xs">
                        {row.pct}%
                      </VFTableCell>
                      <VFTableCell className="py-2 px-4 text-right">
                        <VFBadge
                          variant={row.pct >= 90 ? 'success' : row.pct >= 70 ? 'primary' : 'warning'}
                          className="text-[10px] font-bold"
                        >
                          {row.grade}
                        </VFBadge>
                      </VFTableCell>
                    </VFTableRow>
                  ))
                )}
              </VFTableBody>
            </VFTable>
          </VFCard>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          DRAWER: SCHEDULE NEW EXAMINATION
          ══════════════════════════════════════════════════════════════════════ */}
      <VFDrawer
        isOpen={isScheduleDrawerOpen}
        onClose={() => setIsScheduleDrawerOpen(false)}
        title={isHindi ? 'एग्जाम शेड्यूल करें' : 'Schedule Exam'}
        description={isHindi ? 'एग्जाम टाइटल, डेट्स और टारगेट क्लासेज।' : 'Set examination metadata and target classes.'}
        className="max-w-xl bg-[#0d0d0d] border-l border-border/90"
        bodyClassName="p-5 space-y-4 text-xs no-scrollbar"
        headerActions={
          <button
            onClick={() => setIsScheduleDrawerOpen(false)}
            className="p-1.5 rounded-[4px] text-muted-foreground hover:text-foreground hover:bg-[#1f1f1f] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        }
        footerActions={
          <div className="flex items-center justify-between w-full gap-3">
            <span className="text-[11px] text-muted-foreground font-mono">
              Session: <strong className="text-foreground">{newExamSession}</strong>
            </span>
            <div className="flex items-center gap-2">
              <VFButton
                variant="outline"
                size="sm"
                onClick={() => setIsScheduleDrawerOpen(false)}
                className="rounded-[4px] h-8 text-xs font-bold"
              >
                {isHindi ? 'कैंसिल' : 'Cancel'}
              </VFButton>
              <VFButton
                size="sm"
                onClick={handleCreateExamSubmit}
                className="rounded-[4px] h-8 text-xs font-bold shadow-xs"
                leftIcon={<Check className="h-3.5 w-3.5" />}
              >
                {isHindi ? 'शेड्यूल करें' : 'Schedule Exam'}
              </VFButton>
            </div>
          </div>
        }
      >
        <form onSubmit={handleCreateExamSubmit} className="space-y-3.5">
          <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-3">
            <h4 className="text-[11px] font-bold text-foreground uppercase tracking-wider">
              {isHindi ? 'एग्जाम डिटेल्स' : 'Exam Details'}
            </h4>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">{isHindi ? 'टाइटल *' : 'Title *'}</label>
              <VFInput
                required
                placeholder="e.g. Term 2 Summative Evaluation"
                value={newExamTitle}
                onChange={(e) => setNewExamTitle(e.target.value)}
                className="bg-[#181818] border-border h-9 text-xs rounded-[4px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">{isHindi ? 'कोड *' : 'Code *'}</label>
                <VFInput
                  value={newExamCode}
                  onChange={(e) => setNewExamCode(e.target.value)}
                  className="bg-[#181818] border-border font-mono h-9 text-xs rounded-[4px]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">{isHindi ? 'कैंडिडेट्स' : 'Candidates'}</label>
                <VFInput
                  type="number"
                  value={String(newExamCandidates)}
                  onChange={(e) => setNewExamCandidates(Number(e.target.value))}
                  className="bg-[#181818] border-border font-mono h-9 text-xs rounded-[4px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">{isHindi ? 'डेट्स *' : 'Dates *'}</label>
                <VFInput
                  placeholder="e.g. 15 Nov – 28 Nov 2026"
                  value={newExamDates}
                  onChange={(e) => setNewExamDates(e.target.value)}
                  className="bg-[#181818] border-border h-9 text-xs rounded-[4px]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">{isHindi ? 'क्लास' : 'Grade'}</label>
                <VFSelect
                  value={newExamGrade}
                  onChange={(e) => setNewExamGrade(String(e.target.value))}
                  options={[
                    { label: 'All Classes (6–12)', value: 'All Classes (6–12)' },
                    { label: 'Class 9 & 10', value: 'Class 9 & 10' },
                    { label: 'Class 11 & 12', value: 'Class 11 & 12' },
                    { label: 'Class 10 Only', value: 'Class 10' },
                  ]}
                  className="bg-[#181818] border-border h-9 text-xs rounded-[4px] w-full"
                />
              </div>
            </div>
          </div>
        </form>
      </VFDrawer>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: ADD SINGLE PAPER TO DATE SHEET
          ══════════════════════════════════════════════════════════════════════ */}
      <VFDialog
        isOpen={isAddPaperModalOpen}
        onClose={() => setIsAddPaperModalOpen(false)}
        title={isHindi ? 'क्वेश्चन पेपर ऐड करें' : 'Add Paper'}
        description={`${activeExam.title}`}
      >
        <form onSubmit={handleAddPaperSubmit} className="space-y-3 pt-1 text-xs">
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">{isHindi ? 'सब्जेक्ट का नाम *' : 'Subject *'}</label>
            <VFInput
              required
              placeholder="e.g. Sanskrit Course-B / Biology"
              value={paperSubject}
              onChange={(e) => setPaperSubject(e.target.value)}
              className="bg-[#181818] border-border h-9 text-xs rounded-[4px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">{isHindi ? 'कोड' : 'Code'}</label>
              <VFInput
                placeholder="e.g. Code: 122"
                value={paperCode}
                onChange={(e) => setPaperCode(e.target.value)}
                className="bg-[#181818] border-border font-mono h-9 text-xs rounded-[4px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">{isHindi ? 'मैक्स मार्क्स' : 'Max Marks'}</label>
              <VFInput
                type="number"
                value={String(paperMaxMarks)}
                onChange={(e) => setPaperMaxMarks(Number(e.target.value))}
                className="bg-[#181818] border-border font-mono h-9 text-xs rounded-[4px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">{isHindi ? 'डेट' : 'Date'}</label>
              <VFInput
                placeholder="e.g. 29 Sep 2026 (Tue)"
                value={paperDisplayDate}
                onChange={(e) => setPaperDisplayDate(e.target.value)}
                className="bg-[#181818] border-border h-9 text-xs rounded-[4px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">{isHindi ? 'टाइम' : 'Time'}</label>
              <VFInput
                value={paperTimeSlot}
                onChange={(e) => setPaperTimeSlot(e.target.value)}
                className="bg-[#181818] border-border font-mono h-9 text-xs rounded-[4px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">{isHindi ? 'एग्जाम हॉल' : 'Exam Hall'}</label>
              <VFInput
                value={paperHall}
                onChange={(e) => setPaperHall(e.target.value)}
                className="bg-[#181818] border-border h-9 text-xs rounded-[4px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">{isHindi ? 'इनविजिलेटर' : 'Invigilator'}</label>
              <VFInput
                value={paperInvigilator}
                onChange={(e) => setPaperInvigilator(e.target.value)}
                className="bg-[#181818] border-border h-9 text-xs rounded-[4px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border/50">
            <VFButton type="button" variant="outline" size="sm" onClick={() => setIsAddPaperModalOpen(false)}>
              {isHindi ? 'कैंसिल' : 'Cancel'}
            </VFButton>
            <VFButton type="submit" size="sm" className="rounded-[4px] shadow-xs" leftIcon={<Check className="h-3.5 w-3.5" />}>
              {isHindi ? 'ऐड करें' : 'Save Paper'}
            </VFButton>
          </div>
        </form>
      </VFDialog>

      {/* 5. Interactive Seating Plan Modal */}
      {seatingModalPaper && (
        <VFDialog
          isOpen={Boolean(seatingModalPaper)}
          onClose={() => setSeatingModalPaper(null)}
          title={isHindi ? `रूम सीटिंग अरेंजमेंट: ${seatingModalPaper.subject}` : `Seating Plan: ${seatingModalPaper.subject}`}
          description={`${seatingModalPaper.hall} (${seatingModalPaper.hallBlock || 'Academic Wing'}) · ${seatingModalPaper.displayDate} · ${seatingModalPaper.timeSlot}`}
          className="max-w-3xl rounded-[4px] bg-[#121212] border-border"
        >
          <div className="space-y-4 py-1">
            {/* Top Telemetry Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 rounded-[3px] bg-[#181818] border border-border/70">
                <span className="text-[10px] text-muted-foreground block">ALLOCATED HALL</span>
                <span className="font-bold text-foreground truncate block">{seatingModalPaper.hall}</span>
              </div>
              <div className="p-2 rounded-[3px] bg-[#181818] border border-border/70">
                <span className="text-[10px] text-muted-foreground block">TOTAL CAPACITY</span>
                <span className="font-bold text-foreground block">{seatingModalPaper.capacity || '120 Desks'}</span>
              </div>
              <div className="p-2 rounded-[3px] bg-[#181818] border border-border/70">
                <span className="text-[10px] text-muted-foreground block">CHIEF PROCTOR</span>
                <span className="font-bold text-foreground truncate block">{seatingModalPaper.invigilator}</span>
              </div>
              <div className="p-2 rounded-[3px] bg-[#181818] border border-border/70">
                <span className="text-[10px] text-muted-foreground block">ASSISTANT</span>
                <span className="font-bold text-foreground truncate block">{seatingModalPaper.assistantInvigilator || 'Staff Roster'}</span>
              </div>
            </div>

            {/* Visual Exam Hall Grid */}
            <div className="p-3 rounded-[4px] bg-[#161616] border border-border/80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold text-foreground">
                    {isHindi ? 'एग्जाम रूम लेआउट (मॉक सीटिंग)' : 'Floor Desk Configuration (Sample Room Block A)'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-[2px]">
                  Roll No. 10101 – 10124
                </span>
              </div>

              {/* Podium */}
              <div className="w-48 mx-auto py-1 text-center bg-zinc-800/80 border border-border rounded-[3px] text-[10px] font-mono font-bold text-zinc-300">
                ★ INVIGILATOR PODIUM & QUESTION VAULT ★
              </div>

              {/* Desks Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                {Array.from({ length: 18 }).map((_, i) => {
                  const rollNo = 10101 + i;
                  const isEven = i % 2 === 0;
                  return (
                    <div
                      key={rollNo}
                      className={cn(
                        'p-2 rounded-[3px] border text-center font-mono text-[10px] flex flex-col justify-between h-14 select-none',
                        isEven
                          ? 'bg-[#1e1e1e] border-zinc-700/80 text-foreground'
                          : 'bg-[#1a1a1a] border-border/70 text-zinc-300'
                      )}
                    >
                      <span className="text-[8px] text-muted-foreground">Desk {String(i + 1).padStart(2, '0')}</span>
                      <span className="font-bold text-xs text-amber-400/90">{rollNo}</span>
                      <span className="text-[8px] text-zinc-500">Seat Verified</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                <span>Door A: Main Entrance (Admit Card Check)</span>
                <span>Door B: Emergency Fire Exit</span>
              </div>
            </div>

            {/* Strict Exam Instructions */}
            <div className="p-2.5 rounded-[4px] bg-amber-950/20 border border-amber-800/40 text-xs space-y-1 text-amber-200/90">
              <span className="font-bold flex items-center gap-1 text-amber-400">
                <ShieldCheck className="h-3.5 w-3.5" /> Examination Hall Protocol
              </span>
              <p className="text-[11px] leading-relaxed">
                Candidates must occupy their assigned desks 15 minutes before the bell. Bags and mobile phones must remain in designated corridor lockers. Only transparent pouches and board-approved stationery are permitted.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
              <VFButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="text-xs font-bold rounded-[4px]"
                leftIcon={<Printer className="h-3.5 w-3.5" />}
              >
                {isHindi ? 'रोल लिस्ट प्रिंट करें' : 'Print Room Chart'}
              </VFButton>
              <VFButton
                type="button"
                size="sm"
                onClick={() => setSeatingModalPaper(null)}
                className="text-xs font-bold rounded-[4px]"
              >
                {isHindi ? 'क्लोज़ करें' : 'Close'}
              </VFButton>
            </div>
          </div>
        </VFDialog>
      )}

      {/* 6. Official Printable Datesheet Circular Modal */}
      {isDatesheetModalOpen && (
        <VFDialog
          isOpen={isDatesheetModalOpen}
          onClose={() => setIsDatesheetModalOpen(false)}
          title={isHindi ? 'ऑफिशियल एग्जाम डेटशीट नोटिस' : 'Official Examination Date Sheet Notice'}
          description={`Ref: VIA/EXAM/2026-27/CIR-094 · CBSE Affiliation No. 2130089 · ${activeExam.title}`}
          className="max-w-4xl rounded-[4px] bg-[#121212] border-border"
        >
          <div className="space-y-4 py-1">
            {/* Formal Letterhead */}
            <div className="p-4 rounded-[4px] bg-[#161616] border border-border/80 text-center space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                VIDYAMAXX INTERNATIONAL ACADEMY · SENIOR SECONDARY CAMPUS
              </span>
              <h2 className="font-bold text-foreground text-sm uppercase tracking-wide">
                Office of the Controller of Examinations — Annual Circular
              </h2>
              <p className="text-[11px] text-muted-foreground font-mono">
                Affiliated to CBSE, New Delhi (Affiliation No: 2130089 · School Code: 70142)
              </p>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Date of Issue: 10 Sep 2026</span>
                <span className="font-bold text-foreground">{activeExam.title} ({activeExam.grade})</span>
                <span>Session: 2026–2027</span>
              </div>
            </div>

            {/* Consolidated Schedule Table */}
            <div className="rounded-[4px] border border-border/80 overflow-hidden">
              <VFTable className="text-xs w-full">
                <VFTableHead className="bg-[#1a1a1a]">
                  <VFTableRow>
                    <VFTableHeaderCell className="py-2 px-3 text-xs font-bold text-muted-foreground w-12 text-center">#</VFTableHeaderCell>
                    <VFTableHeaderCell className="py-2 px-3 text-xs font-bold text-muted-foreground">{isHindi ? 'डेट & डे' : 'Date & Day'}</VFTableHeaderCell>
                    <VFTableHeaderCell className="py-2 px-3 text-xs font-bold text-muted-foreground">{isHindi ? 'कोड' : 'Code'}</VFTableHeaderCell>
                    <VFTableHeaderCell className="py-2 px-3 text-xs font-bold text-muted-foreground">{isHindi ? 'सब्जेक्ट' : 'Subject'}</VFTableHeaderCell>
                    <VFTableHeaderCell className="py-2 px-3 text-xs font-bold text-muted-foreground">{isHindi ? 'टाइमिंग्स' : 'Timings'}</VFTableHeaderCell>
                    <VFTableHeaderCell className="py-2 px-3 text-xs font-bold text-muted-foreground text-center">{isHindi ? 'मैक्स' : 'Max'}</VFTableHeaderCell>
                    <VFTableHeaderCell className="py-2 px-3 text-xs font-bold text-muted-foreground">{isHindi ? 'एग्जाम हॉल' : 'Exam Hall'}</VFTableHeaderCell>
                  </VFTableRow>
                </VFTableHead>
                <VFTableBody>
                  {activeExam.timetable.map((p, idx) => (
                    <VFTableRow key={p.id} className="hover:bg-[#181818]/60">
                      <VFTableCell className="py-2 px-3 font-mono font-bold text-center text-muted-foreground text-xs">{idx + 1}</VFTableCell>
                      <VFTableCell className="py-2 px-3 font-semibold text-foreground text-xs">{p.displayDate}</VFTableCell>
                      <VFTableCell className="py-2 px-3 font-mono text-[10px] text-muted-foreground">{p.paperCode}</VFTableCell>
                      <VFTableCell className="py-2 px-3 font-bold text-foreground text-xs">{p.subject}</VFTableCell>
                      <VFTableCell className="py-2 px-3 font-mono text-xs text-muted-foreground">{p.timeSlot}</VFTableCell>
                      <VFTableCell className="py-2 px-3 font-mono font-bold text-center text-emerald-400 text-xs">{p.maxMarks}</VFTableCell>
                      <VFTableCell className="py-2 px-3 text-xs text-muted-foreground">{p.hall}</VFTableCell>
                    </VFTableRow>
                  ))}
                </VFTableBody>
              </VFTable>
            </div>

            {/* General Candidate Instructions */}
            <div className="p-3 rounded-[4px] bg-[#161616] border border-border/80 space-y-1.5 text-xs">
              <span className="font-bold text-foreground block">Key Regulations for Candidates & Parents:</span>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-[11px] leading-relaxed">
                <li>Candidates must report in full school uniform with official Admit Card by 08:30 AM sharp.</li>
                <li>Question paper reading time is from 08:45 AM to 09:00 AM (15 Minutes strict). Writing starts at 09:00 AM.</li>
                <li>No electronic watches, cellular phones, or digital gadgets will be permitted inside the examination hall.</li>
                <li>In case of sudden illness, medical proctor verification is required on the date of examination.</li>
              </ul>
            </div>

            {/* Institutional Signatures */}
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-mono text-center">
              <div className="p-2 border-t border-border/80">
                <span className="font-bold text-foreground block">Dr. H.S. Rathore</span>
                <span className="text-[10px] text-muted-foreground">Controller of Examinations</span>
              </div>
              <div className="p-2 border-t border-border/80">
                <span className="font-bold text-foreground block">Dr. Sunita Deshmukh</span>
                <span className="text-[10px] text-muted-foreground">Director & Officiating Principal</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
              <VFButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="text-xs font-bold rounded-[4px]"
                leftIcon={<Printer className="h-3.5 w-3.5" />}
              >
                {isHindi ? 'डेटशीट प्रिंट करें' : 'Print Official Datesheet'}
              </VFButton>
              <VFButton
                type="button"
                size="sm"
                onClick={() => setIsDatesheetModalOpen(false)}
                className="text-xs font-bold rounded-[4px]"
              >
                {isHindi ? 'क्लोज़ करें' : 'Close'}
              </VFButton>
            </div>
          </div>
        </VFDialog>
      )}
    </VFPageContainer>
  );
}
