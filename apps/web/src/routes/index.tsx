import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  VFPageContainer,
  VFStatCard,
  VFCard,
  VFButton,
  cn,
} from '@vidyafloww/ui';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  FileText,
  SlidersHorizontal,
  Calendar,
  School,
  BookOpenCheck,
  BookMarked,
  BarChart3,
  MessageSquareWarning,
  FileSpreadsheet,
  Settings,
  LucideIcon,
  Shield,
  BookOpen,
  Award,
  Building2,
  Bell,
  Activity,
  CheckCircle2,
  AlertCircle,
  Info,
  RefreshCw,
  Clock,
} from 'lucide-react';
import {
  useGlobalStore,
  DEFAULT_DASHBOARD_KPIS,
} from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';
import { API_ENDPOINTS } from '@vidyafloww/constants';
import { apiClient } from '@vidyafloww/api';

export const Route = createFileRoute('/')({
  component: DashboardPage,
});

type ShortcutAccent =
  | 'blue'
  | 'emerald'
  | 'violet'
  | 'cyan'
  | 'amber'
  | 'indigo'
  | 'pink'
  | 'teal'
  | 'rose'
  | 'sky'
  | 'orange';

const SHORTCUT_ACCENT_STYLES: Record<
  ShortcutAccent,
  {
    glow: string;
    cardHover: string;
    plate: string;
    icon: string;
    titleHover: string;
  }
> = {
  blue: {
    glow: 'rgba(59, 130, 246, 0.16)',
    cardHover: 'hover:border-blue-500/45',
    plate:
      'bg-gradient-to-b from-blue-500/15 via-blue-500/10 to-blue-600/5 border-blue-500/30 group-hover/shortcut:border-blue-400/60 group-hover/shortcut:bg-blue-500/20 shadow-[0_2px_10px_rgba(59,130,246,0.12)] group-hover/shortcut:shadow-[0_4px_18px_rgba(59,130,246,0.25)]',
    icon: 'text-blue-400 group-hover/shortcut:text-blue-300',
    titleHover: 'group-hover/shortcut:text-blue-400',
  },
  emerald: {
    glow: 'rgba(16, 185, 129, 0.16)',
    cardHover: 'hover:border-emerald-500/45',
    plate:
      'bg-gradient-to-b from-emerald-500/15 via-emerald-500/10 to-emerald-600/5 border-emerald-500/30 group-hover/shortcut:border-emerald-400/60 group-hover/shortcut:bg-emerald-500/20 shadow-[0_2px_10px_rgba(16,185,129,0.12)] group-hover/shortcut:shadow-[0_4px_18px_rgba(16,185,129,0.25)]',
    icon: 'text-emerald-400 group-hover/shortcut:text-emerald-300',
    titleHover: 'group-hover/shortcut:text-emerald-400',
  },
  violet: {
    glow: 'rgba(139, 92, 246, 0.16)',
    cardHover: 'hover:border-violet-500/45',
    plate:
      'bg-gradient-to-b from-violet-500/15 via-violet-500/10 to-violet-600/5 border-violet-500/30 group-hover/shortcut:border-violet-400/60 group-hover/shortcut:bg-violet-500/20 shadow-[0_2px_10px_rgba(139,92,246,0.12)] group-hover/shortcut:shadow-[0_4px_18px_rgba(139,92,246,0.25)]',
    icon: 'text-violet-400 group-hover/shortcut:text-violet-300',
    titleHover: 'group-hover/shortcut:text-violet-400',
  },
  cyan: {
    glow: 'rgba(6, 182, 212, 0.16)',
    cardHover: 'hover:border-cyan-500/45',
    plate:
      'bg-gradient-to-b from-cyan-500/15 via-cyan-500/10 to-cyan-600/5 border-cyan-500/30 group-hover/shortcut:border-cyan-400/60 group-hover/shortcut:bg-cyan-500/20 shadow-[0_2px_10px_rgba(6,182,212,0.12)] group-hover/shortcut:shadow-[0_4px_18px_rgba(6,182,212,0.25)]',
    icon: 'text-cyan-400 group-hover/shortcut:text-cyan-300',
    titleHover: 'group-hover/shortcut:text-cyan-400',
  },
  amber: {
    glow: 'rgba(245, 158, 11, 0.16)',
    cardHover: 'hover:border-amber-500/45',
    plate:
      'bg-gradient-to-b from-amber-500/15 via-amber-500/10 to-amber-600/5 border-amber-500/30 group-hover/shortcut:border-amber-400/60 group-hover/shortcut:bg-amber-500/20 shadow-[0_2px_10px_rgba(245,158,11,0.12)] group-hover/shortcut:shadow-[0_4px_18px_rgba(245,158,11,0.25)]',
    icon: 'text-amber-400 group-hover/shortcut:text-amber-300',
    titleHover: 'group-hover/shortcut:text-amber-400',
  },
  indigo: {
    glow: 'rgba(99, 102, 241, 0.16)',
    cardHover: 'hover:border-indigo-500/45',
    plate:
      'bg-gradient-to-b from-indigo-500/15 via-indigo-500/10 to-indigo-600/5 border-indigo-500/30 group-hover/shortcut:border-indigo-400/60 group-hover/shortcut:bg-indigo-500/20 shadow-[0_2px_10px_rgba(99,102,241,0.12)] group-hover/shortcut:shadow-[0_4px_18px_rgba(99,102,241,0.25)]',
    icon: 'text-indigo-400 group-hover/shortcut:text-indigo-300',
    titleHover: 'group-hover/shortcut:text-indigo-400',
  },
  pink: {
    glow: 'rgba(236, 72, 153, 0.16)',
    cardHover: 'hover:border-pink-500/45',
    plate:
      'bg-gradient-to-b from-pink-500/15 via-pink-500/10 to-pink-600/5 border-pink-500/30 group-hover/shortcut:border-pink-400/60 group-hover/shortcut:bg-pink-500/20 shadow-[0_2px_10px_rgba(236,72,153,0.12)] group-hover/shortcut:shadow-[0_4px_18px_rgba(236,72,153,0.25)]',
    icon: 'text-pink-400 group-hover/shortcut:text-pink-300',
    titleHover: 'group-hover/shortcut:text-pink-400',
  },
  teal: {
    glow: 'rgba(20, 184, 166, 0.16)',
    cardHover: 'hover:border-teal-500/45',
    plate:
      'bg-gradient-to-b from-teal-500/15 via-teal-500/10 to-teal-600/5 border-teal-500/30 group-hover/shortcut:border-teal-400/60 group-hover/shortcut:bg-teal-500/20 shadow-[0_2px_10px_rgba(20,184,166,0.12)] group-hover/shortcut:shadow-[0_4px_18px_rgba(20,184,166,0.25)]',
    icon: 'text-teal-400 group-hover/shortcut:text-teal-300',
    titleHover: 'group-hover/shortcut:text-teal-400',
  },
  rose: {
    glow: 'rgba(244, 63, 94, 0.16)',
    cardHover: 'hover:border-rose-500/45',
    plate:
      'bg-gradient-to-b from-rose-500/15 via-rose-500/10 to-rose-600/5 border-rose-500/30 group-hover/shortcut:border-rose-400/60 group-hover/shortcut:bg-rose-500/20 shadow-[0_2px_10px_rgba(244,63,94,0.12)] group-hover/shortcut:shadow-[0_4px_18px_rgba(244,63,94,0.25)]',
    icon: 'text-rose-400 group-hover/shortcut:text-rose-300',
    titleHover: 'group-hover/shortcut:text-rose-400',
  },
  sky: {
    glow: 'rgba(14, 165, 233, 0.16)',
    cardHover: 'hover:border-sky-500/45',
    plate:
      'bg-gradient-to-b from-sky-500/15 via-sky-500/10 to-sky-600/5 border-sky-500/30 group-hover/shortcut:border-sky-400/60 group-hover/shortcut:bg-sky-500/20 shadow-[0_2px_10px_rgba(14,165,233,0.12)] group-hover/shortcut:shadow-[0_4px_18px_rgba(14,165,233,0.25)]',
    icon: 'text-sky-400 group-hover/shortcut:text-sky-300',
    titleHover: 'group-hover/shortcut:text-sky-400',
  },
  orange: {
    glow: 'rgba(249, 115, 22, 0.16)',
    cardHover: 'hover:border-orange-500/45',
    plate:
      'bg-gradient-to-b from-orange-500/15 via-orange-500/10 to-orange-600/5 border-orange-500/30 group-hover/shortcut:border-orange-400/60 group-hover/shortcut:bg-orange-500/20 shadow-[0_2px_10px_rgba(249,115,22,0.12)] group-hover/shortcut:shadow-[0_4px_18px_rgba(249,115,22,0.25)]',
    icon: 'text-orange-400 group-hover/shortcut:text-orange-300',
    titleHover: 'group-hover/shortcut:text-orange-400',
  },
};

export interface ShortcutAction {
  id: string;
  label: string;
  hindiLabel: string;
  desc: string;
  hindiDesc: string;
  route: string;
  icon: LucideIcon;
  accent: ShortcutAccent;
}

interface AuditLogItem {
  id: string;
  created_at: string;
  actor_name: string;
  actor_role_label: string;
  category: string;
  action: string;
  target_type: string;
  target_id: string;
  status: string;
}

const FIXED_SHORTCUTS: ShortcutAction[] = [
  {
    id: 'students',
    label: 'Students',
    hindiLabel: 'स्टूडेंट डायरेक्टरी',
    desc: 'Directory & Profiles',
    hindiDesc: 'डॉक्यूमेंट्स & प्रोफाइल्स',
    route: '/students',
    icon: GraduationCap,
    accent: 'blue',
  },
  {
    id: 'attendance',
    label: 'Attendance',
    hindiLabel: 'डेली अटेंडेंस',
    desc: 'Roll Call & Biometrics',
    hindiDesc: 'बायोमेट्रिक & रजिस्टर',
    route: '/attendance',
    icon: CalendarCheck,
    accent: 'emerald',
  },
  {
    id: 'timetable',
    label: 'Timetable',
    hindiLabel: 'टाइमटेबल',
    desc: 'Schedules & Periods',
    hindiDesc: 'शेड्यूल्स & पीरियड्स',
    route: '/timetable',
    icon: Calendar,
    accent: 'violet',
  },
  {
    id: 'teachers',
    label: 'Teachers',
    hindiLabel: 'टीचर्स & फैकल्टी',
    desc: 'Faculty & Roster',
    hindiDesc: 'वर्कलोड & रोस्टर',
    route: '/teachers',
    icon: Users,
    accent: 'cyan',
  },
  {
    id: 'academics',
    label: 'Academics',
    hindiLabel: 'अकादमिक्स',
    desc: 'Curriculum & Classes',
    hindiDesc: 'करिकुलम & क्लासेज',
    route: '/academics',
    icon: School,
    accent: 'amber',
  },
  {
    id: 'teaching',
    label: 'Teaching',
    hindiLabel: 'शिक्षण योजना',
    desc: 'Lesson Plans & Pacing',
    hindiDesc: 'पाठ योजना व पेसिंग',
    route: '/teaching',
    icon: BookOpenCheck,
    accent: 'indigo',
  },
  {
    id: 'homework',
    label: 'Homework',
    hindiLabel: 'होमवर्क',
    desc: 'Assignments & Review',
    hindiDesc: 'असाइनमेंट्स & रिव्यू',
    route: '/homework',
    icon: BookMarked,
    accent: 'pink',
  },
  {
    id: 'statistics',
    label: 'Statistics',
    hindiLabel: 'स्टैटिस्टिक्स & एनालिटिक्स',
    desc: 'Analytics & Insights',
    hindiDesc: 'एनालिटिक्स & इनसाइट्स',
    route: '/statistics',
    icon: BarChart3,
    accent: 'teal',
  },
  {
    id: 'complaints',
    label: 'Complaints',
    hindiLabel: 'शिकायत निवारण',
    desc: 'Grievance & Tickets',
    hindiDesc: 'शिकायतें व निवारण',
    route: '/complaints',
    icon: MessageSquareWarning,
    accent: 'rose',
  },
  {
    id: 'reports',
    label: 'Reports',
    hindiLabel: 'रिपोर्ट्स',
    desc: 'Analytics & Audits',
    hindiDesc: 'एनालिटिक्स & ऑडिट्स',
    route: '/reports',
    icon: FileSpreadsheet,
    accent: 'sky',
  },
  {
    id: 'settings',
    label: 'Settings',
    hindiLabel: 'सेटिंग्स',
    desc: 'System & Branding',
    hindiDesc: 'सिस्टम & ब्रांडिंग',
    route: '/settings',
    icon: Settings,
    accent: 'orange',
  },
];

function formatRelativeTime(timestampMs: number, isHindi: boolean): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - timestampMs) / 1000));
  if (diffSec < 60) return isHindi ? 'अभी' : 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return isHindi ? `${diffMin} मि. पहले` : `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return isHindi ? `${diffHr} घं. पहले` : `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return isHindi ? `${diffDays} दि. पहले` : `${diffDays}d ago`;
}

export function DashboardPage() {
  const {
    dashboardKpiOrder,
    notifications,
    markNotificationRead,
    schoolProfile,
    activeSession,
  } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';

  React.useEffect(() => {
    document.title = t('page.dashboard') + ' \u2013 VidyaFlow';
  }, [t]);

  // Hero Welcome Banner <-> KPI Stats Slider (shows Welcome on every load, then glides to Stats after 3.5s)
  const [activeTopSlide, setActiveTopSlide] = React.useState<'welcome' | 'stats'>('welcome');
  const [isSliderHovered, setIsSliderHovered] = React.useState(false);

  React.useEffect(() => {
    if (activeTopSlide !== 'welcome' || isSliderHovered) return;
    const timer = setTimeout(() => {
      setActiveTopSlide('stats');
    }, 3500);
    return () => clearTimeout(timer);
  }, [activeTopSlide, isSliderHovered]);

  // Live Academic Date & Time Clock
  const [currentDateTime, setCurrentDateTime] = React.useState(() => new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { dateFormatted, timeFormatted, dayName } = React.useMemo(() => {
    const locale = isHindi ? 'hi-IN' : 'en-US';
    const day = currentDateTime.toLocaleDateString(locale, { weekday: 'long' });
    const date = currentDateTime.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
    const time = currentDateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    return { dayName: day, dateFormatted: date, timeFormatted: time };
  }, [currentDateTime, isHindi]);

  const renderSchoolLogo = (preset?: string) => {
    switch (preset) {
      case 'shield':
        return <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-white shrink-0" />;
      case 'graduation':
        return <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 text-white shrink-0" />;
      case 'award':
        return <Award className="h-6 w-6 sm:h-7 sm:w-7 text-white shrink-0" />;
      case 'book':
        return <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-white shrink-0" />;
      case 'building':
      default:
        return <Building2 className="h-6 w-6 sm:h-7 sm:w-7 text-white shrink-0" />;
    }
  };

  // KPI order array
  const currentKpis = React.useMemo(() => {
    return dashboardKpiOrder && dashboardKpiOrder.length === 4
      ? dashboardKpiOrder
      : DEFAULT_DASHBOARD_KPIS;
  }, [dashboardKpiOrder]);

  // Live executive command dashboard data from Django backend (/api/v1/analytics/dashboard/)
  const [dashboardData, setDashboardData] = React.useState<{
    total_students: number;
    active_students?: number;
    total_staff: number;
    active_staff?: number;
    total_classes: number;
    open_grievances: number;
    pending_admissions: number;
    daily_attendance_pct: string;
    fee_collection_status: string;
    attendance_exceptions?: Array<{
      id: string;
      admission_number: string;
      student: string;
      class_section: string;
      roll_number: string;
      status: string;
      remarks: string;
      severity: 'danger' | 'warning';
    }>;
  } | null>(null);

  // Live system & audit logs from Django backend (/api/v1/audit/events/)
  const [auditLogs, setAuditLogs] = React.useState<AuditLogItem[]>([]);
  const [isRefreshingFeed, setIsRefreshingFeed] = React.useState(false);

  const fetchRightPanelFeed = React.useCallback(async () => {
    setIsRefreshingFeed(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.AUDIT.EVENTS);
      const raw = res.data?.results ?? res.data?.data ?? res.data ?? [];
      if (Array.isArray(raw)) {
        setAuditLogs(raw.slice(0, 25));
      }
    } catch {
      // User may not have SECURITY_AUDIT permission — notifications still display cleanly
    } finally {
      setIsRefreshingFeed(false);
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    apiClient
      .get(API_ENDPOINTS.ANALYTICS.DASHBOARD)
      .then((res) => {
        if (!cancelled) {
          const d = res.data?.data ?? res.data;
          if (d) setDashboardData(d);
        }
      })
      .catch(() => {});

    fetchRightPanelFeed();

    return () => {
      cancelled = true;
    };
  }, [activeSession, fetchRightPanelFeed]);

  // Live attendance exceptions mapped from backend response
  const studentExceptions = React.useMemo(() => {
    const rows = dashboardData?.attendance_exceptions ?? [];
    return rows.map((ex) => ({
      student: ex.student,
      class: `Class ${ex.class_section}${ex.roll_number ? ` · Roll #${ex.roll_number}` : ''}`,
      alert: ex.remarks,
      severity: ex.severity,
    }));
  }, [dashboardData]);

  // Unified chronological feed (Notifications + Latest System Logs) for default 25% panel mode
  const combinedFeed = React.useMemo(() => {
    type UnifiedEntry =
      | {
          kind: 'notification';
          id: string;
          title: string;
          subtitle?: string;
          notifType: 'success' | 'error' | 'warning' | 'info';
          read: boolean;
          timestamp: number;
          actionUrl?: string;
        }
      | {
          kind: 'log';
          id: string;
          title: string;
          subtitle: string;
          category: string;
          status: string;
          timestamp: number;
        };

    const notifEntries: UnifiedEntry[] = notifications.map((n) => ({
      kind: 'notification',
      id: `notif-${n.id}`,
      title: n.title,
      subtitle: n.description,
      notifType: n.type,
      read: n.read,
      timestamp: n.createdAt || Date.now(),
      actionUrl: n.actionUrl,
    }));

    const logEntries: UnifiedEntry[] = auditLogs.map((l) => ({
      kind: 'log',
      id: `log-${l.id}`,
      title: l.action || 'System Event',
      subtitle: `${l.actor_name || 'System'}${l.target_type ? ` · ${l.target_type}` : ''}`,
      category: l.category || 'AUDIT',
      status: l.status || 'SUCCESS',
      timestamp: l.created_at ? new Date(l.created_at).getTime() : Date.now(),
    }));

    return [...notifEntries, ...logEntries]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 30);
  }, [notifications, auditLogs]);

  const unreadNotifCount = React.useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // Render individual KPI Card
  const renderKpiCard = (kpiId: string) => {
    let kpiProps: any = {};
    if (kpiId === 'students') {
      kpiProps = {
        title: t('dashboard.totalStudents'),
        value: dashboardData ? dashboardData.total_students.toLocaleString('en-IN') : '—',
        icon: <Users className="h-5.5 w-5.5 text-foreground" />,
        trend: 'up',
        trendLabel: dashboardData ? `${dashboardData.total_classes} Active Classes` : 'Loading...',
        accentColor: 'blue',
      };
    } else if (kpiId === 'staff' || kpiId === 'teachers') {
      const staffCount = dashboardData?.total_staff ?? 0;
      const activeStaff = dashboardData?.active_staff ?? staffCount;
      const coverage = staffCount > 0 ? `${Math.round((activeStaff / staffCount) * 100)}%` : '0%';
      kpiProps = {
        title: t('dashboard.totalTeachers'),
        value: dashboardData ? `${staffCount}` : '—',
        icon: <GraduationCap className="h-5.5 w-5.5 text-foreground" />,
        trend: 'up',
        trendLabel: dashboardData ? `${coverage} active faculty` : 'Loading...',
        accentColor: 'cyan',
      };
    } else if (kpiId === 'attendance') {
      kpiProps = {
        title: t('dashboard.todayAttendance'),
        value: dashboardData?.daily_attendance_pct ?? '—',
        icon: <CalendarCheck className="h-5.5 w-5.5 text-foreground" />,
        trend: 'up',
        trendLabel: dashboardData ? `${studentExceptions.length} exceptions logged` : 'Loading...',
        accentColor: 'emerald',
      };
    } else if (kpiId === 'admissions') {
      kpiProps = {
        title: t('dashboard.newAdmissions'),
        value: dashboardData ? String(dashboardData.pending_admissions) : '—',
        icon: <FileText className="h-5.5 w-5.5 text-foreground" />,
        trend: 'neutral',
        trendLabel: dashboardData ? `${dashboardData.open_grievances} open grievances` : 'Loading...',
        accentColor: 'purple',
      };
    }

    return (
      <div key={kpiId} className="relative">
        <VFStatCard
          {...kpiProps}
          accentColor={kpiProps.accentColor || 'blue'}
          showTopBar={false}
          className="h-full hover:bg-[#181818] rounded-[4px] shadow-xs transition-all"
        />
      </div>
    );
  };

  const renderNotifIcon = (type: 'success' | 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
      default:
        return <Info className="h-3.5 w-3.5 text-primary shrink-0" />;
    }
  };

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* ── UNIFIED HERO / KPI STATS SLIDER (Welcome Banner glides into KPI Stat Cards) ── */}
      <div
        className="w-full space-y-1.5"
        onMouseEnter={() => setIsSliderHovered(true)}
        onMouseLeave={() => setIsSliderHovered(false)}
      >
        <div className="relative w-full overflow-hidden rounded-[4px]">
          <AnimatePresence mode="wait" initial={false}>
            {activeTopSlide === 'welcome' ? (
              <motion.div
                key="welcome-slide"
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full min-h-[112px] relative overflow-hidden rounded-[4px] border border-orange-500/40 hover:border-orange-400/70 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 px-4 py-4 sm:px-5 sm:py-4 lg:px-6 shadow-md shadow-orange-950/20 text-white flex items-center transition-all duration-200 group"
              >
                {/* Subtle ambient light glow */}
                <div
                  className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-25 z-0"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 70%)',
                  }}
                  aria-hidden="true"
                />

                <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left: School Logo & Institutional Details */}
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className="h-13 w-13 sm:h-14 sm:w-14 rounded-[4px] bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                      {schoolProfile.customLogoUrl ? (
                        <img
                          src={schoolProfile.customLogoUrl}
                          alt={schoolProfile.name}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        renderSchoolLogo(schoolProfile.logoPreset)
                      )}
                    </div>

                    <div className="min-w-0">
                      <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-white tracking-tight leading-snug truncate">
                        {schoolProfile.name}
                      </h1>

                      {schoolProfile.tagline && (
                        <p className="text-xs sm:text-[13px] text-orange-100 font-medium leading-snug truncate mt-0.5">
                          {schoolProfile.tagline}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] sm:text-xs text-orange-100/90 font-medium">
                        {schoolProfile.affiliation && (
                          <span className="px-1.5 py-0.5 rounded-[3px] bg-white/15 border border-white/25 text-white font-semibold text-[11px]">
                            {schoolProfile.affiliation}
                          </span>
                        )}
                        {schoolProfile.city && <span>{schoolProfile.city}</span>}
                        {schoolProfile.city && activeSession && <span>•</span>}
                        {activeSession && <span>{isHindi ? 'सत्र' : 'Session'} {activeSession}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Right: Academic Date & Live Time */}
                  <div className="flex flex-col md:items-end justify-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/20">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight tabular-nums leading-none">
                      {timeFormatted}
                    </div>
                    <div className="text-xs sm:text-[13px] font-semibold text-orange-100 mt-1.5 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-orange-200 shrink-0" />
                      <span>{dayName}, {dateFormatted}</span>
                    </div>
                  </div>
                </div>

                {/* Subtle bottom auto-slide progress indicator */}
                {!isSliderHovered && (
                  <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: 3.5, ease: 'linear' }}
                    style={{ transformOrigin: 'left' }}
                    className="absolute bottom-0 inset-x-0 h-[2px] bg-white/70 pointer-events-none"
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="stats-slide"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 32 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-3.5 lg:gap-4 min-h-[112px] items-stretch"
              >
                {currentKpis.map((kpiId) => renderKpiCard(kpiId))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Minimal Slider Dots — allows manual peek back to Welcome Banner or immediate switch to Stats */}
        <div className="flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTopSlide('welcome')}
            aria-label={isHindi ? 'स्कूल वेलकम बैनर दिखाएं' : 'Show school welcome banner'}
            title={isHindi ? 'स्कूल वेलकम बैनर' : 'School Welcome Banner'}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
              activeTopSlide === 'welcome'
                ? 'w-5 bg-primary'
                : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
            )}
          />
          <button
            type="button"
            onClick={() => setActiveTopSlide('stats')}
            aria-label={isHindi ? 'लाइव स्टैट्स दिखाएं' : 'Show live KPI stats'}
            title={isHindi ? 'लाइव स्टैट्स' : 'Live KPI Stats'}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
              activeTopSlide === 'stats'
                ? 'w-5 bg-primary'
                : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
            )}
          />
        </div>
      </div>

      {/* ── MAIN CONTENT: QUICK ACTIONS (75%) + FIXED 25% NOTIFICATIONS & LATEST LOGS PANEL ── */}
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-3.5 lg:gap-4 items-stretch">
        {/* LEFT: Quick Actions Hub — 75% width */}
        <div className="w-full lg:w-[75%] flex-[3] min-w-0">
          <VFCard
            title={isHindi ? 'क्विक एक्शंस हब (Quick Actions)' : 'Quick Management Actions'}
            headerClassName="py-2.5 px-3 sm:px-3.5"
            className="border-border/80 bg-card shadow-xs rounded-[4px]"
            bodyClassName="p-3 sm:p-3.5"
            actions={
              <Link to="/shortcuts">
                <VFButton
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 bg-[#141414] hover:bg-[#1f1f1f] text-foreground border-border cursor-pointer shadow-xs rounded-[4px]"
                  title={t('action.edit')}
                  aria-label={t('action.edit')}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-foreground" />
                </VFButton>
              </Link>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
              {FIXED_SHORTCUTS.map((action) => {
                const Icon = action.icon;
                const style = SHORTCUT_ACCENT_STYLES[action.accent];
                return (
                  <Link
                    key={action.id}
                    to={action.route}
                    className={cn(
                      'aspect-square relative overflow-hidden p-2 sm:p-2.5 rounded-[4px] border border-border/75 bg-[#121212] hover:bg-[#181818] transition-all duration-200 flex flex-col items-center justify-between text-center group/shortcut shadow-xs hover:shadow-md cursor-pointer',
                      style.cardHover
                    )}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-25 group-hover/shortcut:opacity-75"
                      style={{
                        background: `radial-gradient(circle at 50% 32%, ${style.glow} 0%, rgba(18, 18, 18, 0) 64%)`,
                      }}
                    />

                    <div className="relative z-1 flex-1 flex items-center justify-center w-full my-auto">
                      <div
                        className={cn(
                          'w-12 h-12 sm:w-13 sm:h-13 rounded-[4px] border flex items-center justify-center transition-all duration-200 group-hover/shortcut:-translate-y-0.5',
                          style.plate
                        )}
                      >
                        <Icon className={cn('w-6 h-6 sm:w-6.5 sm:h-6.5 transition-colors shrink-0', style.icon)} strokeWidth={2} />
                      </div>
                    </div>

                    <div className="relative z-1 w-full pt-1">
                      <p className={cn('text-[11.5px] sm:text-xs font-extrabold text-foreground transition-colors leading-tight truncate px-0.5', style.titleHover)}>
                        {isHindi ? action.hindiLabel : action.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5 truncate px-0.5">
                        {isHindi ? action.hindiDesc : action.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </VFCard>
        </div>

        {/* RIGHT: Permanent Fixed 25% Notifications & Latest Logs Panel (All User Types) */}
        <div className="w-full lg:w-[25%] flex-[1] min-w-0 relative">
          <div className="lg:absolute lg:inset-0 flex flex-col">
            <VFCard
              title={
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="truncate">
                    {isHindi ? 'नोटिफिकेशन व लॉग्स' : 'Notifications & Logs'}
                  </span>
                  {unreadNotifCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-[3px] bg-primary/15 border border-primary/30 text-primary text-[10px] font-bold font-mono leading-none shrink-0">
                      {unreadNotifCount}
                    </span>
                  )}
                </div>
              }
              headerClassName="py-2.5 px-3"
              className="rounded-[4px] border-border/80 bg-card shadow-xs flex flex-col flex-1 h-full min-h-0 max-h-[500px] lg:max-h-none"
              bodyClassName="p-2.5 flex flex-col flex-1 min-h-0 overflow-hidden"
              actions={
                <button
                  type="button"
                  onClick={fetchRightPanelFeed}
                  className="h-7 w-7 rounded-[4px] bg-[#141414] hover:bg-[#1f1f1f] border border-border text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                  title={isHindi ? 'रिफ्रेश करें' : 'Refresh notifications & logs'}
                  aria-label="Refresh notifications and logs"
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', isRefreshingFeed && 'animate-spin text-primary')} />
                </button>
              }
            >
              {/* Scrollable Unified Notifications & Latest Logs Feed */}
              <div
                className="space-y-2 overflow-y-auto flex-1 min-h-0 h-0 pr-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {combinedFeed.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-10 text-center text-xs text-muted-foreground px-2">
                    <Bell className="h-6 w-6 text-primary/60 mb-2" />
                    <p className="font-bold text-foreground">
                      {isHindi ? 'कोई नया अपडेट नहीं' : 'All Caught Up'}
                    </p>
                    <p className="text-[11px] mt-0.5">
                      {isHindi
                        ? 'नोटिफिकेशन और सिस्टम लॉग्स यहाँ लाइव दिखेंगे।'
                        : 'New notifications and latest activity logs will appear here.'}
                    </p>
                  </div>
                ) : (
                  combinedFeed.map((item) =>
                    item.kind === 'notification' ? (
                      <div
                        key={item.id}
                        onClick={() => {
                          const rawId = item.id.replace(/^notif-/, '');
                          if (!item.read) markNotificationRead(rawId);
                        }}
                        className={cn(
                          'p-2.5 rounded-[4px] border transition-all cursor-pointer space-y-1',
                          !item.read
                            ? 'bg-[#17171c] border-primary/35 hover:border-primary/60'
                            : 'bg-[#131316] border-border/70 hover:bg-[#18181c]'
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">{renderNotifIcon(item.notifType)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1.5">
                              <p className="text-xs font-bold text-foreground truncate">
                                {item.title}
                              </p>
                              {!item.read && (
                                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                              )}
                            </div>
                            {item.subtitle && (
                              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug mt-0.5">
                                {item.subtitle}
                              </p>
                            )}
                            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-zinc-500">
                              <span className="px-1 py-0.5 rounded bg-primary/10 text-primary/90 font-bold uppercase tracking-wider text-[9px]">
                                {isHindi ? 'अलर्ट' : 'Alert'}
                              </span>
                              <span>•</span>
                              <Clock className="h-2.5 w-2.5 shrink-0" />
                              <span>{formatRelativeTime(item.timestamp, isHindi)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-[4px] border border-border/70 bg-[#131316] hover:bg-[#18181c] transition-all space-y-1"
                      >
                        <div className="flex items-start gap-2">
                          <Activity className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                              {item.subtitle}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-zinc-500">
                              <span className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono uppercase text-[9px] truncate max-w-[90px]">
                                {item.category}
                              </span>
                              <span>•</span>
                              <Clock className="h-2.5 w-2.5 shrink-0" />
                              <span>{formatRelativeTime(item.timestamp, isHindi)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>

              {/* Compact Footer Link */}
              <div className="pt-2 mt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground font-mono text-[10px]">
                  {combinedFeed.length} {isHindi ? 'इवेंट्स' : 'items'}
                </span>
                <Link
                  to="/reports"
                  className="text-primary hover:text-orange-300 font-bold transition-colors"
                >
                  {isHindi ? 'सभी देखें →' : 'View All →'}
                </Link>
              </div>
            </VFCard>
          </div>
        </div>
      </div>
    </VFPageContainer>
  );
}
