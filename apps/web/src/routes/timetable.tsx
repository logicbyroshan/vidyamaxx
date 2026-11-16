import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import JSZip from 'jszip';
import {
  VFPageContainer,
  VFButton,
  VFSelect,
  VFInput,
  VFDrawer,
  VFDialog,
  cn,
} from '@vidyafloww/ui';
import {
  Clock,
  Download,
  Users,
  BookOpen,
  UserCheck,
  CheckCircle2,
  Plus,
  SlidersHorizontal,
  School,
  Check,
  MapPin,
  UserX,
  FileSpreadsheet,
  Pencil,
  RotateCcw,
  Archive,
  Printer,
  Trash2,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/timetable')({
  component: TimetablePage,
});

interface PeriodSlot {
  subject: string;
  teacher: string;
  room: string;
  isLab?: boolean;
}

interface PeriodTiming {
  id: string;
  order: number;
  name: string;
  start: string;
  end: string;
  type: 'Class' | 'Break';
  duration: string;
}

interface ProxySubstitution {
  id: string;
  absentTeacher: string;
  proxyTeacher: string;
  period: string;
  subject: string;
  room: string;
  reason: string;
  status: 'Assigned' | 'Confirmed' | 'Completed';
}

interface FacultyLoad {
  id: string;
  name: string;
  department: string;
  assignedPeriods: number;
  maxPeriods: number;
  freePeriodsToday: string;
  status: 'Optimal' | 'Available' | 'Near Capacity';
}

interface RoomLoad {
  id: string;
  name: string;
  type: string;
  capacity: number;
  utilizationRate: number;
  currentClass: string;
}

const DEFAULT_PERIOD_CONFIG: PeriodTiming[] = [
  { id: '1', order: 1, name: 'Period 1', start: '08:00 AM', end: '08:45 AM', type: 'Class', duration: '45m' },
  { id: '2', order: 2, name: 'Period 2', start: '08:45 AM', end: '09:30 AM', type: 'Class', duration: '45m' },
  { id: '3', order: 3, name: 'Period 3', start: '09:30 AM', end: '10:15 AM', type: 'Class', duration: '45m' },
  { id: '4', order: 4, name: 'Morning Break', start: '10:15 AM', end: '10:30 AM', type: 'Break', duration: '15m' },
  { id: '5', order: 5, name: 'Period 4', start: '10:30 AM', end: '11:15 AM', type: 'Class', duration: '45m' },
  { id: '6', order: 6, name: 'Period 5', start: '11:15 AM', end: '12:00 PM', type: 'Class', duration: '45m' },
  { id: '7', order: 7, name: 'Lunch Break', start: '12:00 PM', end: '12:45 PM', type: 'Break', duration: '45m' },
  { id: '8', order: 8, name: 'Period 6', start: '12:45 PM', end: '01:30 PM', type: 'Class', duration: '45m' },
  { id: '9', order: 9, name: 'Period 7', start: '01:30 PM', end: '02:15 PM', type: 'Class', duration: '45m' },
];

const DAY_THEMES: Record<string, { label: string; text: string; bg: string; border: string; bar: string; badgeBg: string }> = {
  Monday: {
    label: 'Monday',
    text: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    bar: 'bg-sky-400',
    badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  },
  Tuesday: {
    label: 'Tuesday',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    bar: 'bg-emerald-400',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
  Wednesday: {
    label: 'Wednesday',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    bar: 'bg-amber-400',
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  Thursday: {
    label: 'Thursday',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    bar: 'bg-purple-400',
    badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  },
  Friday: {
    label: 'Friday',
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    bar: 'bg-rose-400',
    badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  },
  Saturday: {
    label: 'Saturday',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    bar: 'bg-cyan-400',
    badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  },
  Sunday: {
    label: 'Sunday',
    text: 'text-lime-400',
    bg: 'bg-lime-500/10',
    border: 'border-lime-500/30',
    bar: 'bg-lime-400',
    badgeBg: 'bg-lime-500/15 text-lime-300 border-lime-500/30',
  },
};

const INITIAL_SCHEDULE_DATA: Record<string, PeriodSlot[]> = {
  'Monday': [
    { subject: 'Mathematics', teacher: 'Mrs. Sunita Verma', room: 'Room 101' },
    { subject: 'Physics', teacher: 'Dr. Rajesh Sharma', room: 'Lab 204', isLab: true },
    { subject: 'English Literature', teacher: 'Ms. Ananya Gupta', room: 'Room 101' },
    { subject: 'Chemistry', teacher: 'Dr. Manoj Nair', room: 'Lab 102', isLab: true },
    { subject: 'Biology', teacher: 'Mr. Rahul Kumar', room: 'Room 101' },
    { subject: 'Physical Education', teacher: 'Coach Singh', room: 'Sports Ground' },
    { subject: 'Computer Science', teacher: 'Mr. Subhash Das', room: 'Lab 3', isLab: true },
  ],
  'Tuesday': [
    { subject: 'Physics', teacher: 'Dr. Rajesh Sharma', room: 'Lab 204', isLab: true },
    { subject: 'Mathematics', teacher: 'Mrs. Sunita Verma', room: 'Room 101' },
    { subject: 'Social Science', teacher: 'Mr. Vivek Patel', room: 'Room 101' },
    { subject: 'English Literature', teacher: 'Ms. Ananya Gupta', room: 'Room 101' },
    { subject: 'Chemistry', teacher: 'Dr. Manoj Nair', room: 'Lab 102', isLab: true },
    { subject: 'Library & Reading', teacher: 'Mrs. Joshi', room: 'Central Library' },
    { subject: 'Mathematics', teacher: 'Mrs. Sunita Verma', room: 'Room 101' },
  ],
  'Wednesday': [
    { subject: 'Chemistry', teacher: 'Dr. Manoj Nair', room: 'Lab 102', isLab: true },
    { subject: 'English Literature', teacher: 'Ms. Ananya Gupta', room: 'Room 101' },
    { subject: 'Mathematics', teacher: 'Mrs. Sunita Verma', room: 'Room 101' },
    { subject: 'Physics', teacher: 'Dr. Rajesh Sharma', room: 'Lab 204', isLab: true },
    { subject: 'Hindi Literature', teacher: 'Mr. Mishra', room: 'Room 101' },
    { subject: 'Fine Arts', teacher: 'Ms. Roy', room: 'Studio 1' },
    { subject: 'Biology', teacher: 'Mr. Rahul Kumar', room: 'Room 101' },
  ],
  'Thursday': [
    { subject: 'Mathematics', teacher: 'Mrs. Sunita Verma', room: 'Room 101' },
    { subject: 'Biology', teacher: 'Mr. Rahul Kumar', room: 'Room 101' },
    { subject: 'Physics', teacher: 'Dr. Rajesh Sharma', room: 'Lab 204', isLab: true },
    { subject: 'Computer Science', teacher: 'Mr. Subhash Das', room: 'Lab 3', isLab: true },
    { subject: 'Social Science', teacher: 'Mr. Vivek Patel', room: 'Room 101' },
    { subject: 'English Literature', teacher: 'Ms. Ananya Gupta', room: 'Room 101' },
    { subject: 'Chemistry', teacher: 'Dr. Manoj Nair', room: 'Lab 102', isLab: true },
  ],
  'Friday': [
    { subject: 'English Literature', teacher: 'Ms. Ananya Gupta', room: 'Room 101' },
    { subject: 'Mathematics', teacher: 'Mrs. Sunita Verma', room: 'Room 101' },
    { subject: 'Social Science', teacher: 'Mr. Vivek Patel', room: 'Room 101' },
    { subject: 'Physics', teacher: 'Dr. Rajesh Sharma', room: 'Lab 204', isLab: true },
    { subject: 'Music & Drama', teacher: 'Mr. Ali', room: 'Auditorium' },
    { subject: 'Chemistry', teacher: 'Dr. Manoj Nair', room: 'Lab 102', isLab: true },
    { subject: 'Club Activity', teacher: 'Faculty Squad', room: 'Main Campus' },
  ],
  'Saturday': [
    { subject: 'Computer Science', teacher: 'Mr. Subhash Das', room: 'Lab 3', isLab: true },
    { subject: 'Fine Arts', teacher: 'Ms. Roy', room: 'Studio 1' },
    { subject: 'Library & Reading', teacher: 'Mrs. Joshi', room: 'Central Library' },
    { subject: 'Physical Education', teacher: 'Coach Singh', room: 'Sports Ground' },
    { subject: 'Music & Drama', teacher: 'Mr. Ali', room: 'Auditorium' },
    { subject: 'Science Club', teacher: 'Dr. Rajesh Sharma', room: 'Lab 204', isLab: true },
    { subject: 'Mentorship & House Meeting', teacher: 'Mrs. Sunita Verma', room: 'Room 101' },
  ],
};

const INITIAL_SUBSTITUTIONS: ProxySubstitution[] = [
  {
    id: 'SUB-1',
    absentTeacher: 'Dr. Rajesh Sharma',
    proxyTeacher: 'Mrs. Sunita Verma',
    period: 'Period 3 (09:30 – 10:15 AM)',
    subject: 'Physics & Lab Practice',
    room: 'Lab 204',
    reason: 'Medical Leave (High Fever)',
    status: 'Assigned',
  },
  {
    id: 'SUB-2',
    absentTeacher: 'Ms. Pooja Rao',
    proxyTeacher: 'Mrs. Joshi',
    period: 'Period 5 (11:15 – 12:00 PM)',
    subject: 'English Literature',
    room: 'Room 101',
    reason: 'Inter-School Debate Escort Duty',
    status: 'Confirmed',
  },
  {
    id: 'SUB-3',
    absentTeacher: 'Mr. Arvind Gupta',
    proxyTeacher: 'Mr. Vivek Patel',
    period: 'Period 6 (12:45 – 01:30 PM)',
    subject: 'Social Science',
    room: 'Room 101',
    reason: 'Personal Casual Leave',
    status: 'Assigned',
  },
];

const INITIAL_FACULTY_LOAD: FacultyLoad[] = [
  { id: 'F1', name: 'Mrs. Sunita Verma', department: 'Mathematics', assignedPeriods: 24, maxPeriods: 28, freePeriodsToday: 'Periods 2, 6', status: 'Optimal' },
  { id: 'F2', name: 'Dr. Rajesh Sharma', department: 'Physics', assignedPeriods: 22, maxPeriods: 28, freePeriodsToday: 'Periods 1, 4', status: 'Available' },
  { id: 'F3', name: 'Ms. Ananya Gupta', department: 'English', assignedPeriods: 26, maxPeriods: 28, freePeriodsToday: 'Period 5', status: 'Near Capacity' },
  { id: 'F4', name: 'Dr. Manoj Nair', department: 'Chemistry', assignedPeriods: 23, maxPeriods: 28, freePeriodsToday: 'Periods 3, 7', status: 'Optimal' },
  { id: 'F5', name: 'Mr. Vivek Patel', department: 'Social Sciences', assignedPeriods: 21, maxPeriods: 28, freePeriodsToday: 'Periods 1, 3, 5', status: 'Available' },
  { id: 'F6', name: 'Mr. Rahul Kumar', department: 'Biology', assignedPeriods: 25, maxPeriods: 28, freePeriodsToday: 'Period 2', status: 'Optimal' },
  { id: 'F7', name: 'Mr. Subhash Das', department: 'Computer Science', assignedPeriods: 20, maxPeriods: 28, freePeriodsToday: 'Periods 4, 6', status: 'Available' },
];

const INITIAL_ROOM_LOAD: RoomLoad[] = [
  { id: 'R1', name: 'Physics Laboratory 204', type: 'Laboratory', capacity: 40, utilizationRate: 85, currentClass: 'Class 11-Sci (Dr. Sharma)' },
  { id: 'R2', name: 'Chemistry Laboratory 102', type: 'Laboratory', capacity: 40, utilizationRate: 90, currentClass: 'Class 12-Sci (Dr. Nair)' },
  { id: 'R3', name: 'Computer Lab 3 (Turing Lab)', type: 'Computer Lab', capacity: 45, utilizationRate: 75, currentClass: 'Class 9-A (Mr. Das)' },
  { id: 'R4', name: 'Biology Laboratory 105', type: 'Laboratory', capacity: 35, utilizationRate: 70, currentClass: 'Class 10-B (Mr. Kumar)' },
  { id: 'R5', name: 'Fine Arts Studio 1', type: 'Special Activity', capacity: 30, utilizationRate: 60, currentClass: 'Class 8-C (Ms. Roy)' },
  { id: 'R6', name: 'Central School Auditorium', type: 'Assembly & Events', capacity: 600, utilizationRate: 40, currentClass: 'Dramatics Club' },
];

function TimetablePage() {
  const { addNotification } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  React.useEffect(() => { document.title = t('page.timetable') + ' \u2013 VidyaFloww'; }, [t]);
  const [selectedClass, setSelectedClass] = React.useState<string>('Class 9-A');
  const [classTeacher, setClassTeacher] = React.useState<string>('Mrs. Sunita Verma');
  
  // Working Days Configuration (5-Day vs 6-Day school week)
  const [workingDaysMode, setWorkingDaysMode] = React.useState<'5days' | '6days'>('5days');
  const [periodConfig, setPeriodConfig] = React.useState<PeriodTiming[]>(DEFAULT_PERIOD_CONFIG);
  const [scheduleData, setScheduleData] = React.useState<Record<string, PeriodSlot[]>>(INITIAL_SCHEDULE_DATA);

  // Configuration Drawers State
  const [isConfigurePeriodsOpen, setIsConfigurePeriodsOpen] = React.useState<boolean>(false);
  const [isConfigureTimetableOpen, setIsConfigureTimetableOpen] = React.useState<boolean>(false);

  // Faculty Workload & Substitutions Drawer State
  const [isWorkloadDrawerOpen, setIsWorkloadDrawerOpen] = React.useState<boolean>(false);
  const [workloadDrawerTab, setWorkloadDrawerTab] = React.useState<'substitutions' | 'faculty' | 'rooms'>('substitutions');
  const [substitutionsList, setSubstitutionsList] = React.useState<ProxySubstitution[]>(INITIAL_SUBSTITUTIONS);
  const [facultyList] = React.useState<FacultyLoad[]>(INITIAL_FACULTY_LOAD);
  const [roomList] = React.useState<RoomLoad[]>(INITIAL_ROOM_LOAD);

  // Export Suite State
  const [isExportModalOpen, setIsExportModalOpen] = React.useState<boolean>(false);
  const [exportFormat, setExportFormat] = React.useState<'bundle' | 'csv' | 'pdf'>('bundle');
  const [isExporting, setIsExporting] = React.useState<boolean>(false);
  const [exportProgressText, setExportProgressText] = React.useState<string>('');

  // New Proxy Form state
  const [isAssigningProxy, setIsAssigningProxy] = React.useState<boolean>(false);
  const [newAbsentTeacher, setNewAbsentTeacher] = React.useState<string>('Dr. Rajesh Sharma');
  const [newProxyTeacher, setNewProxyTeacher] = React.useState<string>('Mrs. Sunita Verma');
  const [newProxyPeriod, setNewProxyPeriod] = React.useState<string>('Period 4 (10:30 – 11:15 AM)');
  const [newProxySubject, setNewProxySubject] = React.useState<string>('Mathematics');
  const [newProxyRoom, setNewProxyRoom] = React.useState<string>('Room 101');
  const [newProxyReason, setNewProxyReason] = React.useState<string>('Medical Leave Cover');

  // Interactive Slot Editing Modal State
  const [editingSlot, setEditingSlot] = React.useState<{
    day: string;
    slotIndex: number;
    subject: string;
    teacher: string;
    room: string;
    isLab: boolean;
  } | null>(null);

  // Active Days Array based on working days mode
  const activeDays = workingDaysMode === '6days'
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const classPeriods = periodConfig.filter((p) => p.type === 'Class');

  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
    if (newClass === 'Class 9-A') setClassTeacher('Mrs. Sunita Verma');
    else if (newClass === 'Class 10-B') setClassTeacher('Dr. Rajesh Sharma');
    else if (newClass === 'Class 11-Sci') setClassTeacher('Dr. Manoj Nair');
    else if (newClass === 'Class 12-Com') setClassTeacher('Ms. Ananya Gupta');
    addNotification({
      title: 'Class Timetable Loaded',
      description: `Viewing weekly academic schedule for ${newClass}.`,
      type: 'info',
    });
  };

  const handleOpenSlotEdit = (day: string, slotIndex: number, slot: PeriodSlot) => {
    setEditingSlot({
      day,
      slotIndex,
      subject: slot.subject,
      teacher: slot.teacher,
      room: slot.room,
      isLab: Boolean(slot.isLab),
    });
  };

  const handleSaveSlotEdit = () => {
    if (!editingSlot) return;

    setScheduleData((prev) => {
      const daySlots = [...(prev[editingSlot.day] || [])];
      daySlots[editingSlot.slotIndex] = {
        subject: editingSlot.subject,
        teacher: editingSlot.teacher,
        room: editingSlot.room,
        isLab: editingSlot.isLab,
      };
      return { ...prev, [editingSlot.day]: daySlots };
    });

    addNotification({
      title: 'Timetable Slot Updated',
      description: `${editingSlot.day} Period ${editingSlot.slotIndex + 1} updated to ${editingSlot.subject} (${editingSlot.teacher}).`,
      type: 'success',
    });

    setEditingSlot(null);
  };

  const handleCreateProxy = () => {
    if (!newAbsentTeacher || !newProxyTeacher) return;

    const newProxy: ProxySubstitution = {
      id: `SUB-${Date.now()}`,
      absentTeacher: newAbsentTeacher,
      proxyTeacher: newProxyTeacher,
      period: newProxyPeriod,
      subject: newProxySubject,
      room: newProxyRoom,
      reason: newProxyReason,
      status: 'Assigned',
    };

    setSubstitutionsList([newProxy, ...substitutionsList]);
    setIsAssigningProxy(false);
    addNotification({
      title: 'Substitute Teacher Assigned',
      description: `${newProxyTeacher} appointed as proxy for ${newAbsentTeacher} on ${newProxyPeriod}.`,
      type: 'success',
    });
  };

  const handleExecuteExport = async () => {
    setIsExporting(true);
    setExportProgressText('Preparing timetable dataset...');

    try {
      if (exportFormat === 'csv') {
        setExportProgressText('Generating CSV matrix...');
        const headers = ['Day', 'Period Slot', 'Timing', 'Subject', 'Teacher', 'Room', 'Type'];
        const rows: string[][] = [];

        activeDays.forEach((day) => {
          (scheduleData[day] || []).slice(0, classPeriods.length).forEach((slot, idx) => {
            const periodInfo = classPeriods[idx] || { name: `Period ${idx + 1}`, start: '', end: '' };
            rows.push([
              day,
              periodInfo.name,
              `${periodInfo.start} - ${periodInfo.end}`,
              slot.subject,
              slot.teacher,
              slot.room,
              slot.isLab ? 'Lab / Practical' : 'Theory',
            ]);
          });
        });

        const csvContent =
          `"Academic Timetable Matrix - ${selectedClass}"\n` +
          `"Class Teacher: ${classTeacher}","Academic Year: 2026-2027","Institution: VidyaFloww International Academy"\n\n` +
          [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Timetable_${selectedClass.replace(/\s+/g, '_')}_Matrix.csv`;
        a.click();
        URL.revokeObjectURL(url);

        addNotification({
          title: 'Timetable CSV Exported',
          description: `Spreadsheet schedule for ${selectedClass} successfully saved.`,
          type: 'success',
        });
      } else if (exportFormat === 'pdf') {
        setExportProgressText('Compiling printable schedule view...');
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Timetable - ${selectedClass}</title>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #111; }
                  .header { border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 18px; }
                  .school-name { font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
                  .sub { font-size: 12px; color: #555; margin-top: 4px; }
                  .meta-row { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 13px; font-weight: 600; }
                  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                  th, td { border: 1px solid #ccc; padding: 8px 10px; text-align: left; font-size: 11px; }
                  th { background: #f4f4f5; font-weight: 800; text-transform: uppercase; font-size: 10px; }
                  .subject { font-weight: bold; color: #000; font-size: 12px; }
                  .teacher { color: #555; font-size: 10px; margin-top: 2px; }
                  .room { color: #777; font-size: 9px; font-family: monospace; }
                  .footer { margin-top: 30px; display: flex; justify-content: space-between; font-size: 11px; color: #555; }
                  @media print { body { padding: 0; } }
                </style>
              </head>
              <body>
                <div class="header">
                  <div class="school-name">VidyaFloww International Academy</div>
                  <div class="sub">Official Academic Weekly Class Timetable · Session 2026–2027</div>
                </div>
                <div class="meta-row">
                  <div><strong>Class Section:</strong> ${selectedClass}</div>
                  <div><strong>Class Mentor:</strong> ${classTeacher} (Room 101)</div>
                  <div><strong>Generated On:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th style="width: 100px;">Day</th>
                      ${classPeriods.map((p) => `<th>${p.name}<br/><span style="font-weight: normal; font-size: 9px;">${p.start} - ${p.end}</span></th>`).join('')}
                    </tr>
                  </thead>
                  <tbody>
                    ${activeDays.map((day) => `
                      <tr>
                        <td style="font-weight: 800; background: #fafafa;">${day.toUpperCase()}</td>
                        ${(scheduleData[day] || []).slice(0, classPeriods.length).map((slot) => `
                          <td>
                            <div class="subject">${slot.subject}</div>
                            <div class="teacher">${slot.teacher}</div>
                            <div class="room">${slot.room} ${slot.isLab ? '(Lab)' : ''}</div>
                          </td>
                        `).join('')}
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                <div class="footer">
                  <div>Academic Dean Signature: __________________</div>
                  <div>Principal Signature: __________________</div>
                  <div>School Seal</div>
                </div>
                <script>
                  window.onload = function() {
                    window.print();
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
        addNotification({
          title: 'Timetable Print View Ready',
          description: `Formatted printable sheet compiled for ${selectedClass}.`,
          type: 'success',
        });
      } else if (exportFormat === 'bundle') {
        setExportProgressText('Building ZIP archive package with JSZip...');
        const zip = new JSZip();

        // 1. CSV
        const headers = ['Day', 'Period Slot', 'Timing', 'Subject', 'Teacher', 'Room', 'Type'];
        const rows: string[][] = [];
        activeDays.forEach((day) => {
          (scheduleData[day] || []).slice(0, classPeriods.length).forEach((slot, idx) => {
            const periodInfo = classPeriods[idx] || { name: `Period ${idx + 1}`, start: '', end: '' };
            rows.push([
              day,
              periodInfo.name,
              `${periodInfo.start} - ${periodInfo.end}`,
              slot.subject,
              slot.teacher,
              slot.room,
              slot.isLab ? 'Lab / Practical' : 'Theory',
            ]);
          });
        });
        const csvContent =
          `"Academic Timetable Matrix - ${selectedClass}"\n` +
          `"Class Teacher: ${classTeacher}","Academic Year: 2026-2027"\n\n` +
          [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))].join('\n');
        zip.file(`Timetable_${selectedClass.replace(/\s+/g, '_')}_Matrix.csv`, csvContent);

        // 2. Schedule JSON
        zip.file(`Class_Schedule_${selectedClass.replace(/\s+/g, '_')}.json`, JSON.stringify({
          institution: 'VidyaFloww International Academy',
          academicSession: '2026-2027',
          classSection: selectedClass,
          classTeacher,
          workingDays: activeDays,
          periods: periodConfig,
          weeklyMatrix: scheduleData,
          exportedAt: new Date().toISOString(),
        }, null, 2));

        // 3. Faculty & Room Allocations JSON
        zip.file(`Faculty_Load_Quotas.json`, JSON.stringify(facultyList, null, 2));
        zip.file(`Room_Utilization_Master.json`, JSON.stringify(roomList, null, 2));

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Timetable_${selectedClass.replace(/\s+/g, '_')}_Archive.zip`;
        a.click();
        URL.revokeObjectURL(url);

        addNotification({
          title: 'Timetable ZIP Archive Downloaded',
          description: `Full package containing CSV + JSON schedules for ${selectedClass} generated.`,
          type: 'success',
        });
      }

      setIsExportModalOpen(false);
    } catch (err) {
      console.error(err);
      addNotification({
        title: 'Export Failed',
        description: 'Unable to compile export archive. Please try again.',
        type: 'error',
      });
    } finally {
      setIsExporting(false);
      setExportProgressText('');
    }
  };

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* ═══════════════════════════════════════════════════════════════════════
          1. MASTER CLASS SCHEDULE TOOLBAR & SLEEK DARK GRID (FULL HEIGHT)
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-h-0 flex flex-col space-y-3 sm:space-y-3.5 lg:space-y-4">
        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#101010] p-3 rounded-lg border border-[#242424] shadow-xs shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <VFSelect
              value={selectedClass}
              onChange={(e) => handleClassChange(String(e.target.value))}
              options={[
                { label: 'Class 9 - Section A', value: 'Class 9-A' },
                { label: 'Class 10 - Section B', value: 'Class 10-B' },
                { label: 'Class 11 - Science', value: 'Class 11-Sci' },
                { label: 'Class 12 - Commerce', value: 'Class 12-Com' },
              ]}
              className="w-48"
            />
            <div className="flex items-center gap-2 px-3 h-9 rounded-md bg-[#161616] border border-[#262626] text-xs">
              <School className="h-4 w-4 text-zinc-400 shrink-0" />
              <span className="font-medium text-zinc-400">{t('teachers.classTeacher')}:</span>
              <span className="font-bold text-white">{classTeacher}</span>
              <span className="text-zinc-400 font-mono">(Room 101)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            <VFButton
              variant="outline"
              size="sm"
              leftIcon={<Clock className="h-3.5 w-3.5 text-zinc-400" />}
              onClick={() => setIsConfigurePeriodsOpen(true)}
            >
              {t('action.edit') + ' ' + t('timetable.period')}
            </VFButton>
            <VFButton
              variant="outline"
              size="sm"
              leftIcon={<SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />}
              onClick={() => setIsConfigureTimetableOpen(true)}
            >
              {t('action.edit') + ' ' + t('nav.timetable')}
            </VFButton>
            <VFButton
              variant="outline"
              size="sm"
              leftIcon={<Users className="h-3.5 w-3.5 text-zinc-400" />}
              onClick={() => setIsWorkloadDrawerOpen(true)}
            >
              {t('nav.teachers')}
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono font-bold bg-[#242424] text-zinc-300 rounded">
                {substitutionsList.length}
              </span>
            </VFButton>
            <VFButton
              variant="outline"
              size="sm"
              leftIcon={<Download className="h-3.5 w-3.5 text-zinc-400" />}
              onClick={() => setIsExportModalOpen(true)}
            >
              {t('action.export')}
            </VFButton>
          </div>
        </div>

        {/* Sleek Deep Dark Grid with Mathematically Equal Height & Width Distribution */}
        <div className="flex-1 min-h-0 border border-[#242424] rounded-lg bg-[#0a0a0a] overflow-x-auto overflow-y-hidden no-scrollbar shadow-sm flex flex-col min-w-[900px]">
          {/* Header Row */}
          <div className="grid grid-cols-[130px_repeat(7,minmax(0,1fr))] border-b border-[#242424] bg-[#121212] shrink-0">
            <div className="p-3 font-black text-xs text-zinc-400 uppercase tracking-wider border-r border-[#242424] select-none flex items-center justify-center text-center">
              {isHindi ? 'डे / टाइम' : 'Day / Time'}
            </div>
            {classPeriods.map((p) => (
              <div
                key={p.id}
                className="p-3 font-bold text-xs text-zinc-300 border-r last:border-r-0 border-[#242424] select-none flex flex-col justify-center space-y-1"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-white text-xs font-black uppercase tracking-wider truncate">{p.name}</span>
                  <span className="text-[10px] font-mono font-bold text-zinc-400 bg-[#181818] px-1.5 py-0.2 rounded border border-[#2a2a2a] shrink-0">
                    {p.duration}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono block font-medium">
                  {p.start} – {p.end}
                </span>
              </div>
            ))}
          </div>

          {/* Body Rows with 100% Equal Height Distribution */}
          <div className={cn(
            'flex-1 min-h-0 grid divide-y divide-[#1c1c1c]',
            activeDays.length === 6 ? 'grid-rows-6' : 'grid-rows-5'
          )}>
            {activeDays.map((day) => {
              const dayTheme = DAY_THEMES[day] || DAY_THEMES.Monday;
              return (
                <div
                  key={day}
                  className="grid grid-cols-[130px_repeat(7,minmax(0,1fr))] divide-x divide-[#1c1c1c] h-full"
                >
                  {/* Day Column - Distinct Vibrant Color Pill Badge */}
                  <div className="p-2 font-bold bg-[#0d0d0d] select-none flex flex-col items-center justify-center space-y-1.5 text-center">
                    <span className={cn("block text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md border shadow-2xs", dayTheme.badgeBg)}>
                      {t(('timetable.' + day.toLowerCase()) as any) || day}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono block font-bold bg-[#141414] px-2 py-0.5 rounded border border-[#242424]">
                      {classPeriods.length} {t('timetable.period')}
                    </span>
                  </div>

                  {/* 7 Period Slots: EXACT EQUAL HEIGHT & WIDTH */}
                  {(scheduleData[day] || []).slice(0, classPeriods.length).map((slot, idx) => (
                    <div key={idx} className="p-1.5 bg-[#0a0a0a] flex flex-col min-h-0 h-full">
                      <div
                        onClick={() => handleOpenSlotEdit(day, idx, slot)}
                        className="h-full w-full p-2.5 rounded-lg bg-[#141414] border border-[#242424] flex flex-col justify-between space-y-1.5 transition-all group cursor-pointer shadow-xs select-none hover:bg-[#1a1a1a] hover:border-[#383838] hover:shadow-md"
                        title={`Click to edit or reassign ${slot.subject} (${slot.teacher})`}
                      >
                        {/* Top Row: Subject & Lab */}
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="font-extrabold text-foreground text-[13px] leading-tight tracking-tight truncate group-hover:text-white">
                            {slot.subject}
                          </span>
                          {slot.isLab && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 shrink-0">
                              Lab
                            </span>
                          )}
                        </div>

                        {/* Middle Row: Teacher */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <BookOpen className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                          <span className="truncate group-hover:text-foreground font-semibold">
                            {slot.teacher}
                          </span>
                        </div>

                        {/* Bottom Row: Room Badge & Edit trigger */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-[#202020] text-xs">
                          <span className="font-mono text-zinc-300 bg-[#1a1a1a] px-2.5 py-1 rounded-md border border-[#2a2a2a] text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs group-hover:border-[#383838] truncate">
                            <MapPin className="h-3 w-3 shrink-0 text-primary" />
                            {slot.room}
                          </span>
                          <span className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground text-[11px] flex items-center gap-1 font-semibold transition-opacity shrink-0">
                            <Pencil className="h-3 w-3" /> {t('action.edit')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. CONFIGURE PERIODS DRAWER (BELL SCHEDULE & TIME SLOTS)
          ═══════════════════════════════════════════════════════════════════════ */}
      <VFDrawer
        isOpen={isConfigurePeriodsOpen}
        onClose={() => setIsConfigurePeriodsOpen(false)}
        title="Configure Daily Periods & Bell Schedule"
        description="Set period start and end times, adjust durations, and configure break intervals"
        className="w-[660px] max-w-[95vw]"
        bodyClassName="p-0 flex flex-col overflow-hidden"
        footerActions={
          <div className="flex items-center justify-between w-full">
            <VFButton
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              onClick={() => {
                setPeriodConfig(DEFAULT_PERIOD_CONFIG);
                addNotification({
                  title: 'Period Timings Reset',
                  description: 'Default 7-period + 2-break bell schedule restored.',
                  type: 'info',
                });
              }}
            >
              Reset to Defaults
            </VFButton>
            <div className="flex items-center gap-2">
              <VFButton
                variant="outline"
                size="sm"
                onClick={() => setIsConfigurePeriodsOpen(false)}
              >
                Cancel
              </VFButton>
              <VFButton
                size="sm"
                leftIcon={<Check className="h-3.5 w-3.5" />}
                onClick={() => {
                  setIsConfigurePeriodsOpen(false);
                  addNotification({
                    title: 'Period Schedule Saved',
                    description: 'Daily campus bell timings and period durations updated.',
                    type: 'success',
                  });
                }}
              >
                Save Period Schedule
              </VFButton>
            </div>
          </div>
        }
      >
        <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 space-y-3.5 overflow-hidden">
          <div className="p-3.5 rounded-lg bg-[#121214] border border-[#27272a] space-y-1 shrink-0">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Standard Daily Session Structure
            </h4>
            <p className="text-xs text-zinc-400 font-medium">
              Institutional timing runs from 08:00 AM to 02:15 PM. Each class lecture is 45 minutes with morning and lunch breaks.
            </p>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-2.5 pr-1">
            {periodConfig.map((p, idx) => (
              <div
                key={p.id}
                className="p-3 rounded-md bg-[#141417] border border-[#24242a] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="h-7 w-7 rounded bg-[#161619] border border-[#27272e] flex items-center justify-center font-mono text-xs font-bold text-white shrink-0">
                    {idx + 1}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => {
                        const updated = [...periodConfig];
                        updated[idx] = { ...p, name: e.target.value };
                        setPeriodConfig(updated);
                      }}
                      className="h-8 px-2.5 rounded bg-[#111113] border border-[#27272e] text-xs font-bold text-white outline-none focus:border-zinc-400"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={p.start}
                        onChange={(e) => {
                          const updated = [...periodConfig];
                          updated[idx] = { ...p, start: e.target.value };
                          setPeriodConfig(updated);
                        }}
                        className="h-8 px-2 rounded bg-[#111113] border border-[#27272e] text-xs font-mono text-zinc-200 outline-none w-20 text-center"
                      />
                      <span className="text-zinc-500 text-xs">to</span>
                      <input
                        type="text"
                        value={p.end}
                        onChange={(e) => {
                          const updated = [...periodConfig];
                          updated[idx] = { ...p, end: e.target.value };
                          setPeriodConfig(updated);
                        }}
                        className="h-8 px-2 rounded bg-[#111113] border border-[#27272e] text-xs font-mono text-zinc-200 outline-none w-20 text-center"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-[11px] font-mono text-zinc-400 bg-[#161619] px-2 py-1 rounded border border-[#27272e]">
                        {p.duration}
                      </span>
                      <span className={cn(
                        'text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wide',
                        p.type === 'Break' ? 'bg-[#1e1e24] text-zinc-300 border-[#2e2e36]' : 'bg-[#141417] text-white border-[#27272e]'
                      )}>
                        {p.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </VFDrawer>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. CONFIGURE TIMETABLE DRAWER (5/6 DAYS, CLASS TEACHER, SLOTS)
          ═══════════════════════════════════════════════════════════════════════ */}
      <VFDrawer
        isOpen={isConfigureTimetableOpen}
        onClose={() => setIsConfigureTimetableOpen(false)}
        title="Configure Academic Timetable"
        description="Set weekly operating days, assign class mentors, and manage timetable structure"
        className="w-[660px] max-w-[95vw]"
        footerActions={
          <div className="flex items-center justify-between w-full">
            <VFButton
              variant="outline"
              size="sm"
              onClick={() => setIsConfigureTimetableOpen(false)}
            >
              Cancel
            </VFButton>
            <VFButton
              size="sm"
              leftIcon={<Check className="h-3.5 w-3.5" />}
              onClick={() => {
                setIsConfigureTimetableOpen(false);
                addNotification({
                  title: 'Timetable Configuration Applied',
                  description: `Weekly schedule set to ${workingDaysMode === '6days' ? '6-Day Week (Mon–Sat)' : '5-Day Week (Mon–Fri)'}.`,
                  type: 'success',
                });
              }}
            >
              Apply Settings
            </VFButton>
          </div>
        }
      >
        <div className="p-4 sm:p-5 space-y-5">
          {/* Operating Working Days Option */}
          <div className="p-4 rounded-lg bg-[#121212] border border-[#242424] space-y-3">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Academic School Operating Week
              </h4>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">
                Toggle between a 5-day week or 6-day week with Saturday academic sessions
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setWorkingDaysMode('5days')}
                className={cn(
                  'p-3.5 rounded-md border text-left transition-all cursor-pointer flex flex-col justify-between shadow-xs',
                  workingDaysMode === '5days'
                    ? 'bg-[#1c1c1c] border-primary text-white ring-1 ring-primary/40'
                    : 'bg-[#141414] border-[#242424] text-zinc-400 hover:bg-[#181818]'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white">5-Day Week</span>
                  {workingDaysMode === '5days' && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </div>
                <p className="text-xs text-zinc-400">Monday to Friday (Saturday Off)</p>
              </button>

              <button
                type="button"
                onClick={() => setWorkingDaysMode('6days')}
                className={cn(
                  'p-3.5 rounded-md border text-left transition-all cursor-pointer flex flex-col justify-between shadow-xs',
                  workingDaysMode === '6days'
                    ? 'bg-[#1c1c1c] border-primary text-white ring-1 ring-primary/40'
                    : 'bg-[#141414] border-[#242424] text-zinc-400 hover:bg-[#181818]'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white">6-Day Week</span>
                  {workingDaysMode === '6days' && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </div>
                <p className="text-xs text-zinc-400">Monday to Saturday (Full Session)</p>
              </button>
            </div>
          </div>

          {/* Class Teacher & Section Settings */}
          <div className="p-4 rounded-lg bg-[#121212] border border-[#242424] space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Class Section & Mentor Assignment
            </h4>
            <div className="space-y-3">
              <VFSelect
                label="Assigned Class Teacher"
                value={classTeacher}
                onChange={(e) => setClassTeacher(String(e.target.value))}
                options={[
                  { label: 'Mrs. Sunita Verma (Mathematics)', value: 'Mrs. Sunita Verma' },
                  { label: 'Dr. Rajesh Sharma (Physics)', value: 'Dr. Rajesh Sharma' },
                  { label: 'Ms. Ananya Gupta (English)', value: 'Ms. Ananya Gupta' },
                  { label: 'Dr. Manoj Nair (Chemistry)', value: 'Dr. Manoj Nair' },
                  { label: 'Mr. Vivek Patel (Social Science)', value: 'Mr. Vivek Patel' },
                  { label: 'Mr. Rahul Kumar (Biology)', value: 'Mr. Rahul Kumar' },
                ]}
              />
            </div>
          </div>
        </div>
      </VFDrawer>

      {/* ═══════════════════════════════════════════════════════════════════════
          5. REASSIGN / EDIT PERIOD SLOT MODAL (VFDialog)
          ═══════════════════════════════════════════════════════════════════════ */}
      <VFDialog
        isOpen={Boolean(editingSlot)}
        onClose={() => setEditingSlot(null)}
        title={editingSlot ? `Edit Timetable Slot · ${editingSlot.day} (Period ${editingSlot.slotIndex + 1})` : 'Edit Timetable Slot'}
        description={`${selectedClass} · Assigned Lecture Period & Faculty Allocation`}
        className="max-w-lg"
        footerActions={
          <div className="flex items-center justify-end gap-2 w-full">
            <VFButton
              size="sm"
              variant="outline"
              onClick={() => setEditingSlot(null)}
            >
              Cancel
            </VFButton>
            <VFButton
              size="sm"
              variant="outline"
              className="bg-white text-black hover:bg-zinc-200 border-none font-bold shadow-xs"
              leftIcon={<Check className="h-3.5 w-3.5 text-black" />}
              onClick={handleSaveSlotEdit}
            >
              Save Changes
            </VFButton>
          </div>
        }
      >
        {editingSlot && (
          <div className="p-4 sm:p-5 space-y-4">
            <div>
              <VFSelect
                label="Subject Name"
                value={editingSlot.subject}
                onChange={(e) =>
                  setEditingSlot({ ...editingSlot, subject: String(e.target.value) })
                }
                options={[
                  { label: 'Mathematics', value: 'Mathematics' },
                  { label: 'Physics', value: 'Physics' },
                  { label: 'Chemistry', value: 'Chemistry' },
                  { label: 'Biology', value: 'Biology' },
                  { label: 'English Literature', value: 'English Literature' },
                  { label: 'Social Science', value: 'Social Science' },
                  { label: 'Hindi Literature', value: 'Hindi Literature' },
                  { label: 'Computer Science', value: 'Computer Science' },
                  { label: 'Physical Education', value: 'Physical Education' },
                  { label: 'Fine Arts', value: 'Fine Arts' },
                  { label: 'Music & Drama', value: 'Music & Drama' },
                  { label: 'Library & Reading', value: 'Library & Reading' },
                  { label: 'Club Activity', value: 'Club Activity' },
                  { label: 'Mentorship & House Meeting', value: 'Mentorship & House Meeting' },
                ]}
              />
            </div>

            <div>
              <VFSelect
                label="Faculty Teacher Assigned"
                value={editingSlot.teacher}
                onChange={(e) =>
                  setEditingSlot({ ...editingSlot, teacher: String(e.target.value) })
                }
                options={[
                  { label: 'Mrs. Sunita Verma (Maths)', value: 'Mrs. Sunita Verma' },
                  { label: 'Dr. Rajesh Sharma (Physics)', value: 'Dr. Rajesh Sharma' },
                  { label: 'Ms. Ananya Gupta (English)', value: 'Ms. Ananya Gupta' },
                  { label: 'Dr. Manoj Nair (Chemistry)', value: 'Dr. Manoj Nair' },
                  { label: 'Mr. Rahul Kumar (Biology)', value: 'Mr. Rahul Kumar' },
                  { label: 'Mr. Vivek Patel (Social Sci)', value: 'Mr. Vivek Patel' },
                  { label: 'Mr. Subhash Das (Computer Sci)', value: 'Mr. Subhash Das' },
                  { label: 'Coach Singh (Physical Ed)', value: 'Coach Singh' },
                  { label: 'Mrs. Joshi (Library)', value: 'Mrs. Joshi' },
                  { label: 'Mr. Mishra (Hindi)', value: 'Mr. Mishra' },
                  { label: 'Ms. Roy (Fine Arts)', value: 'Ms. Roy' },
                  { label: 'Mr. Ali (Music/Drama)', value: 'Mr. Ali' },
                  { label: 'Faculty Squad (Co-Curricular)', value: 'Faculty Squad' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <VFSelect
                  label="Room / Location"
                  value={editingSlot.room}
                  onChange={(e) =>
                    setEditingSlot({ ...editingSlot, room: String(e.target.value) })
                  }
                  options={[
                    { label: 'Room 101 (Home Room)', value: 'Room 101' },
                    { label: 'Room 102', value: 'Room 102' },
                    { label: 'Physics Lab 204', value: 'Lab 204' },
                    { label: 'Chemistry Lab 102', value: 'Lab 102' },
                    { label: 'Computer Lab 3', value: 'Lab 3' },
                    { label: 'Central Library', value: 'Central Library' },
                    { label: 'Fine Arts Studio 1', value: 'Studio 1' },
                    { label: 'Sports Ground', value: 'Sports Ground' },
                    { label: 'Auditorium', value: 'Auditorium' },
                    { label: 'Main Campus', value: 'Main Campus' },
                  ]}
                />
              </div>

              <div>
                <VFSelect
                  label="Facility / Format"
                  value={editingSlot.isLab ? 'lab' : 'theory'}
                  onChange={(e) =>
                    setEditingSlot({ ...editingSlot, isLab: e.target.value === 'lab' })
                  }
                  options={[
                    { label: 'Classroom (Theory)', value: 'theory' },
                    { label: 'Laboratory (Practical)', value: 'lab' },
                  ]}
                />
              </div>
            </div>
          </div>
        )}
      </VFDialog>

      {/* ═══════════════════════════════════════════════════════════════════════
          6. FACULTY WORKLOAD & SUBSTITUTION MANAGEMENT DRAWER
          ═══════════════════════════════════════════════════════════════════════ */}
      <VFDrawer
        isOpen={isWorkloadDrawerOpen}
        onClose={() => {
          setIsWorkloadDrawerOpen(false);
          setIsAssigningProxy(false);
        }}
        title="Faculty Workload & Substitutions"
        description="Real-time proxy teacher allocation, weekly workload balancing, and room usage"
        className="max-w-2xl"
        footerActions={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-zinc-400 font-medium">
              Academic Session: 2026–2027 · Term 2
            </span>
            <VFButton
              variant="outline"
              size="sm"
              onClick={() => {
                setIsWorkloadDrawerOpen(false);
                setIsAssigningProxy(false);
              }}
            >
              Cancel
            </VFButton>
          </div>
        }
      >
        <div className="p-4 sm:p-5 space-y-4">
          {/* Drawer Segmented Tab Control */}
          <div className="flex items-center p-1 rounded-md bg-[#121214] border border-[#27272a] gap-1 w-full">
            <button
              onClick={() => setWorkloadDrawerTab('substitutions')}
              className={cn(
                'flex-1 h-8 px-3 rounded text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
                workloadDrawerTab === 'substitutions'
                  ? 'bg-[#1c1c1f] text-white border border-[#27272a] shadow-xs'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              )}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Today's Proxies ({substitutionsList.length})</span>
            </button>
            <button
              onClick={() => setWorkloadDrawerTab('faculty')}
              className={cn(
                'flex-1 h-8 px-3 rounded text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
                workloadDrawerTab === 'faculty'
                  ? 'bg-[#1c1c1f] text-white border border-[#27272a] shadow-xs'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Faculty Workload ({facultyList.length})</span>
            </button>
            <button
              onClick={() => setWorkloadDrawerTab('rooms')}
              className={cn(
                'flex-1 h-8 px-3 rounded text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
                workloadDrawerTab === 'rooms'
                  ? 'bg-[#1c1c1f] text-white border border-[#27272a] shadow-xs'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              )}
            >
              <School className="h-3.5 w-3.5" />
              <span>Lab & Room Load ({roomList.length})</span>
            </button>
          </div>

          {/* TAB 1: SUBSTITUTIONS */}
          {workloadDrawerTab === 'substitutions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md bg-[#121214] border border-[#27272a] shadow-xs">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Active Substitution Slips ({substitutionsList.length})
                  </h4>
                  <p className="text-xs text-zinc-400 font-medium mt-0.5">
                    Cover absent faculty with available teachers based on free period slots
                  </p>
                </div>
                <VFButton
                  size="sm"
                  variant={isAssigningProxy ? 'outline' : 'primary'}
                  leftIcon={<Plus className="h-3.5 w-3.5" />}
                  onClick={() => setIsAssigningProxy(!isAssigningProxy)}
                >
                  {isAssigningProxy ? 'Cancel' : 'Assign Proxy'}
                </VFButton>
              </div>

              {isAssigningProxy && (
                <div className="p-4 rounded-md bg-[#121214] border border-[#27272a] shadow-md space-y-3 animate-scale-in">
                  <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-white" />
                      <h4 className="text-sm font-bold text-white">
                        Appoint Substitute Proxy Teacher
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <VFSelect
                        label="Absent Faculty Member"
                        value={newAbsentTeacher}
                        onChange={(e) => setNewAbsentTeacher(String(e.target.value))}
                        options={[
                          { label: 'Dr. Rajesh Sharma (Physics)', value: 'Dr. Rajesh Sharma' },
                          { label: 'Ms. Pooja Rao (English)', value: 'Ms. Pooja Rao' },
                          { label: 'Mr. Arvind Gupta (Social)', value: 'Mr. Arvind Gupta' },
                          { label: 'Mr. Rahul Kumar (Biology)', value: 'Mr. Rahul Kumar' },
                        ]}
                      />
                    </div>
                    <div>
                      <VFSelect
                        label="Assign Proxy Teacher (Free Slot)"
                        value={newProxyTeacher}
                        onChange={(e) => setNewProxyTeacher(String(e.target.value))}
                        options={[
                          { label: 'Mrs. Sunita Verma (Maths - Free Period 3)', value: 'Mrs. Sunita Verma' },
                          { label: 'Mrs. Joshi (English - Free Period 5)', value: 'Mrs. Joshi' },
                          { label: 'Mr. Vivek Patel (Social - Free Period 6)', value: 'Mr. Vivek Patel' },
                          { label: 'Mr. Subhash Das (Computer - Free Period 4)', value: 'Mr. Subhash Das' },
                        ]}
                      />
                    </div>
                    <div>
                      <VFSelect
                        label="Target Period & Time"
                        value={newProxyPeriod}
                        onChange={(e) => setNewProxyPeriod(String(e.target.value))}
                        options={[
                          { label: 'Period 1 (08:00 – 08:45 AM)', value: 'Period 1 (08:00 – 08:45 AM)' },
                          { label: 'Period 2 (08:45 – 09:30 AM)', value: 'Period 2 (08:45 – 09:30 AM)' },
                          { label: 'Period 3 (09:30 – 10:15 AM)', value: 'Period 3 (09:30 – 10:15 AM)' },
                          { label: 'Period 4 (10:30 – 11:15 AM)', value: 'Period 4 (10:30 – 11:15 AM)' },
                          { label: 'Period 5 (11:15 – 12:00 PM)', value: 'Period 5 (11:15 – 12:00 PM)' },
                          { label: 'Period 6 (12:45 – 01:30 PM)', value: 'Period 6 (12:45 – 01:30 PM)' },
                          { label: 'Period 7 (01:30 – 02:15 PM)', value: 'Period 7 (01:30 – 02:15 PM)' },
                        ]}
                      />
                    </div>
                    <div>
                      <VFInput
                        label="Subject / Topic"
                        value={newProxySubject}
                        onChange={(e) => setNewProxySubject(e.target.value)}
                        placeholder="e.g. Mathematics or Physics Lab"
                      />
                    </div>
                    <div>
                      <VFInput
                        label="Room / Lab Assigned"
                        value={newProxyRoom}
                        onChange={(e) => setNewProxyRoom(e.target.value)}
                        placeholder="e.g. Room 101 or Lab 204"
                      />
                    </div>
                  </div>

                  <div>
                    <VFInput
                      label="Reason / Notes for Record"
                      value={newProxyReason}
                      onChange={(e) => setNewProxyReason(e.target.value)}
                      placeholder="e.g. Approved medical leave coverage"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <VFButton size="sm" variant="outline" onClick={() => setIsAssigningProxy(false)}>
                      Cancel
                    </VFButton>
                    <VFButton size="sm" leftIcon={<Check className="h-3.5 w-3.5" />} onClick={handleCreateProxy}>
                      Confirm Proxy Assignment
                    </VFButton>
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                {substitutionsList.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-lg bg-[#121214] border border-[#27272a] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                          <UserX className="h-3.5 w-3.5 text-zinc-500" />
                          {sub.absentTeacher} (Absent)
                        </span>
                        <span className="text-xs text-zinc-500">➔</span>
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          <UserCheck className="h-3.5 w-3.5 text-white" />
                          Assigned: {sub.proxyTeacher}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-white">
                        {sub.subject} • <span className="text-zinc-400 font-mono">{sub.room}</span>
                      </p>
                      <p className="text-xs text-zinc-400 font-mono">
                        {sub.period} · {sub.reason}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const nextStatus = sub.status === 'Assigned' ? 'Confirmed' : sub.status === 'Confirmed' ? 'Completed' : 'Assigned';
                          setSubstitutionsList(substitutionsList.map((s) => s.id === sub.id ? { ...s, status: nextStatus } : s));
                          addNotification({
                            title: 'Proxy Status Updated',
                            description: `${sub.proxyTeacher}'s duty status set to ${nextStatus}.`,
                            type: 'info',
                          });
                        }}
                        className={cn(
                          'text-xs font-mono font-bold px-2.5 py-1 rounded border cursor-pointer transition-all flex items-center gap-1',
                          sub.status === 'Confirmed'
                            ? 'bg-[#181e28] text-sky-300 border-sky-800/40'
                            : sub.status === 'Completed'
                            ? 'bg-emerald-950/30 text-emerald-300 border-emerald-800/40'
                            : 'bg-[#1c1c1f] text-zinc-300 border-[#27272a] hover:text-white'
                        )}
                        title="Click to toggle status (Assigned -> Confirmed -> Completed)"
                      >
                        <Check className="h-3 w-3" />
                        {sub.status}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSubstitutionsList(substitutionsList.filter((s) => s.id !== sub.id));
                          addNotification({
                            title: 'Proxy Appointment Removed',
                            description: `Substitute coverage record for ${sub.absentTeacher} dismissed.`,
                            type: 'info',
                          });
                        }}
                        className="h-7 w-7 rounded bg-[#161619] border border-[#27272a] hover:border-rose-900/60 hover:text-rose-400 text-zinc-500 flex items-center justify-center cursor-pointer transition-colors"
                        title="Remove proxy appointment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: FACULTY WORKLOAD */}
          {workloadDrawerTab === 'faculty' && (
            <div className="space-y-3">
              <div className="p-3 rounded-md bg-[#121214] border border-[#27272a] shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Weekly Teaching Quotas & Allocation
                  </h4>
                  <p className="text-xs text-zinc-400 font-medium mt-0.5">
                    Standard departmental limit: 28 Periods / Week
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-400 px-2 py-0.5 rounded bg-[#1c1c1f] border border-[#27272a]">
                  Quota: 28 P/Wk
                </span>
              </div>

              <div className="space-y-2.5">
                {facultyList.map((f) => {
                  const percentage = Math.round((f.assignedPeriods / f.maxPeriods) * 100);
                  return (
                    <div
                      key={f.id}
                      className="p-3.5 rounded-lg bg-[#121214] border border-[#27272a] shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-white">{f.name}</p>
                          <p className="text-xs text-zinc-400 font-medium">
                            {f.department} · Available: {f.freePeriodsToday}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-white">
                            {f.assignedPeriods} / {f.maxPeriods} Periods
                          </span>
                          <span className="text-xs font-mono block mt-0.5 text-zinc-400">
                            {f.status}
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-1.5 bg-[#09090b] rounded-xs overflow-hidden">
                        <div
                          className="h-full rounded-xs bg-white/70 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ROOM UTILIZATION */}
          {workloadDrawerTab === 'rooms' && (
            <div className="space-y-3">
              <div className="p-3 rounded-md bg-[#121214] border border-[#27272a] shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Infrastructure & Lab Utilization
                  </h4>
                  <p className="text-xs text-zinc-400 font-medium mt-0.5">
                    Live schedule occupancy across science laboratories and activity rooms
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-400 px-2 py-0.5 rounded bg-[#1c1c1f] border border-[#27272a]">
                  6 Facilities Monitored
                </span>
              </div>

              <div className="space-y-2.5">
                {roomList.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-lg bg-[#121214] border border-[#27272a] shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-sm font-bold text-white">{r.name}</p>
                      <p className="text-xs text-zinc-400 font-medium">
                        {r.type} · Capacity: {r.capacity} Students
                      </p>
                      <p className="text-xs font-mono text-zinc-400 font-semibold truncate">
                        Active: {r.currentClass}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold font-mono block text-white">
                        {r.utilizationRate}% Utilized
                      </span>
                      <span className="text-xs font-mono text-zinc-400 mt-0.5 block">
                        Occupied
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </VFDrawer>

      {/* ═══════════════════════════════════════════════════════════════════════
          6. MULTI-FORMAT EXPORT TIMETABLE MODAL
          ═══════════════════════════════════════════════════════════════════════ */}
      <VFDialog
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Academic Timetable"
        description={`Download weekly period schedules, matrix spreadsheets, and archive packages for ${selectedClass}`}
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
