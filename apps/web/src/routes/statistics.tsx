import { useEffect, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFCard,
  VFStatCard,
  VFButton,
} from '@vidyafloww/ui';
import {
  Users,
  UserCheck,
  TrendingUp,
  CreditCard,
  Award,
  School,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';
import { SUBSYSTEMS, getSubsystemUrl, API_ENDPOINTS } from '@vidyafloww/constants';
import { apiClient } from '@vidyafloww/api';

export const Route = createFileRoute('/statistics')({
  component: StatisticsPage,
});

interface StatisticsPayload {
  total_students: number;
  total_staff?: number;
  teacher_student_ratio: string;
  daily_attendance_avg: string;
  board_pass_rate: string;
  monthly_trends: Array<{ month: string; intake: number; attendance: number }>;
  wing_breakdown: Array<{ title: string; grade: string; count: number; pct: number }>;
  attendance_summary?: {
    present_count: number;
    late_count: number;
    absent_count: number;
    latest_date: string | null;
  };
  students_summary?: {
    active_count: number;
    wings_count: number;
    sections_count: number;
    avg_per_section: number;
    male_pct: number;
    female_pct: number;
  };
  finance_summary?: {
    invoices_count: number;
    total_gross_inr: string;
    total_paid_inr: string;
    total_due_inr: string;
    realization_pct: number;
  };
  admissions_summary?: {
    total_applications: number;
    screened: number;
    approved: number;
    enrolled: number;
    conversion_rate_pct: number;
  };
  exam_summary?: {
    total_marks_logged: number;
    pass_rate_pct: number;
    distinction_count: number;
    distinction_pct: number;
    topper_count: number;
  };
  academics_summary?: {
    classes_count: number;
    sections_count: number;
    syllabus_avg_pct: number;
  };
}

function formatInrCompact(raw: string | number | undefined): string {
  const num = Number(raw ?? 0);
  if (!Number.isFinite(num) || num === 0) return '₹ 0';
  if (num >= 1e7) return `₹ ${(num / 1e7).toFixed(2)} Cr`;
  if (num >= 1e5) return `₹ ${(num / 1e5).toFixed(2)} L`;
  return `₹ ${num.toLocaleString('en-IN')}`;
}

function StatisticsPage() {
  const { activeSession } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  const [stats, setStats] = useState<StatisticsPayload | null>(null);

  useEffect(() => {
    document.title = t('page.statistics') + ' – VidyaFloww';
    apiClient
      .get(API_ENDPOINTS.ANALYTICS.STATISTICS)
      .then((res) => {
        const d = res.data?.data ?? res.data;
        if (d) setStats(d as StatisticsPayload);
      })
      .catch(() => {});
  }, [t, activeSession]);

  const wingColors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];
  const monthlyTrends =
    stats?.monthly_trends && stats.monthly_trends.length > 0
      ? stats.monthly_trends.slice(0, 6)
      : [
          { month: 'Apr', intake: 0, attendance: 0 },
          { month: 'May', intake: 0, attendance: 0 },
          { month: 'Jun', intake: 0, attendance: 0 },
          { month: 'Jul', intake: 0, attendance: 0 },
          { month: 'Aug', intake: 0, attendance: 0 },
          { month: 'Sep', intake: 0, attendance: 0 },
        ];

  const wingBreakdown = (stats?.wing_breakdown ?? []).map((w, i) => ({
    ...w,
    color: wingColors[i % wingColors.length],
  }));

  const maxIntake = Math.max(10, ...monthlyTrends.map((m) => m.intake));

  return (
    <VFPageContainer className="space-y-3.5">
      {/* 1. Top Executive KPI Metric Cards (Clickable Deep Links) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <Link to="/students" className="block group focus:outline-hidden">
          <VFStatCard
            title={t('students.totalStudents')}
            value={stats ? stats.total_students.toLocaleString('en-IN') : '—'}
            icon={<Users className="h-4.5 w-4.5" />}
            trend="up"
            trendLabel={`Session ${activeSession}`}
            accentColor="blue"
            className="group-hover:border-zinc-700 transition-colors"
          />
        </Link>
        <Link to="/teachers" className="block group focus:outline-hidden">
          <VFStatCard
            title={isHindi ? 'टीचर-स्टूडेंट रेश्यो' : 'Teacher-Student Ratio'}
            value={stats?.teacher_student_ratio ?? '—'}
            icon={<School className="h-4.5 w-4.5" />}
            trend="neutral"
            trendLabel="Live Staff Ratio"
            accentColor="cyan"
            className="group-hover:border-zinc-700 transition-colors"
          />
        </Link>
        <Link to="/attendance" className="block group focus:outline-hidden">
          <VFStatCard
            title={isHindi ? 'डेली एवरेज अटेंडेंस' : 'Daily Attendance Avg'}
            value={stats?.daily_attendance_avg ?? '—'}
            icon={<UserCheck className="h-4.5 w-4.5" />}
            trend="up"
            trendLabel="Live Attendance Feed"
            accentColor="emerald"
            className="group-hover:border-zinc-700 transition-colors"
          />
        </Link>
        <a href={getSubsystemUrl(SUBSYSTEMS.EXAMINATIONS)} target="_blank" rel="noopener noreferrer" className="block group focus:outline-hidden">
          <VFStatCard
            title={isHindi ? 'एनुअल बोर्ड पास रेट' : 'Board Exam Pass Rate'}
            value={stats?.board_pass_rate ?? '—'}
            icon={<Award className="h-4.5 w-4.5" />}
            trend="up"
            trendLabel="From Exam Marks Ledger"
            accentColor="primary"
            className="group-hover:border-zinc-700 transition-colors"
          />
        </a>
      </div>

      {/* 2. Primary Analytical Visuals: Trajectory Chart (% inside bars) + Wing Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Trajectory Visual (7 cols) */}
        <div className="lg:col-span-7">
          <VFCard
            title={
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-foreground">{isHindi ? 'अटेंडेंस & एडमिशन ट्रेंड्स' : 'Attendance & Intake Trajectory'}</span>
              </div>
            }
            actions={
              <div className="flex items-center gap-1.5">
                <Link to="/attendance">
                  <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px] gap-1">
                    <span>{isHindi ? 'अटेंडेंस' : 'Attendance'}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </VFButton>
                </Link>
                <a href={getSubsystemUrl(SUBSYSTEMS.ADMISSIONS)} target="_blank" rel="noopener noreferrer">
                  <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px] gap-1">
                    <span>{isHindi ? 'एडमिशन्स' : 'Admissions'}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </VFButton>
                </a>
              </div>
            }
            className="bg-[#0d0d0d] border-border/90 h-full flex flex-col"
            bodyClassName="p-3.5 flex-1 flex flex-col justify-between space-y-3"
          >
            {/* Visual Track */}
            <div className="space-y-2 pt-1 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-[#202020]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <span className="h-2.5 w-2.5 rounded-[2px] bg-primary" />
                    Intake (Pupils)
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-400" />
                    Daily Attendance (%)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">Session AY 2026–27</span>
              </div>

              {/* Trajectory Bars with % INSIDE the attendance bars only */}
              <div className="grid grid-cols-6 gap-2 sm:gap-3 items-stretch pt-2 flex-1 min-h-[170px]">
                {monthlyTrends.map((m, idx) => {
                  const intakeHeight = Math.max(12, Math.round((m.intake / maxIntake) * 100));
                  const attHeight = Math.max(18, Math.round(Math.min(100, m.attendance)));
                  return (
                    <div key={idx} className="flex flex-col items-center justify-end h-full gap-1.5 group/bar">
                      <div className="w-full flex items-end justify-center gap-1.5 flex-1 min-h-[150px] bg-[#141414] rounded-[3px] p-1.5 border border-border/60">
                        {/* Intake Bar */}
                        <div
                          style={{ height: `${intakeHeight}%` }}
                          className="w-1/2 bg-gradient-to-t from-orange-600 to-primary rounded-t-[2px] transition-all duration-300 group-hover/bar:brightness-110 shadow-xs"
                          title={`Intake: ${m.intake} Pupils`}
                        />
                        {/* Attendance Bar with % INSIDE the bar */}
                        <div
                          style={{ height: `${attHeight}%` }}
                          className="w-1/2 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-[2px] transition-all duration-300 group-hover/bar:brightness-110 shadow-xs flex flex-col items-center justify-start pt-1 overflow-hidden"
                          title={`Attendance: ${m.attendance}%`}
                        >
                          <span className="text-[9.5px] font-mono font-black text-black leading-none select-none tracking-tight">
                            {m.attendance}%
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold font-mono text-foreground shrink-0">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Metrics Footer */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#202020] text-xs">
              <div className="p-2 rounded-[3px] bg-[#141414] border border-[#242424] text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Peak Intake</span>
                <span className="font-mono font-extrabold text-primary text-xs sm:text-sm">
                  {Math.max(0, ...monthlyTrends.map((m) => m.intake))} Pupils
                </span>
              </div>
              <div className="p-2 rounded-[3px] bg-[#141414] border border-[#242424] text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Avg Attendance</span>
                <span className="font-mono font-extrabold text-emerald-400 text-xs sm:text-sm">
                  {stats?.daily_attendance_avg ?? '—'}
                </span>
              </div>
              <div className="p-2 rounded-[3px] bg-[#141414] border border-[#242424] text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Biometric Sync</span>
                <span className="font-mono font-extrabold text-blue-400 text-xs sm:text-sm">Realtime</span>
              </div>
            </div>
          </VFCard>
        </div>

        {/* Wing Enrollment Distribution (5 cols) */}
        <div className="lg:col-span-5">
          <VFCard
            title={
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-400" />
                <span className="font-bold text-foreground">{isHindi ? 'विंग स्टूडेंट एनरोलमेंट' : 'Enrollment by Academic Wing'}</span>
              </div>
            }
            actions={
              <Link to="/students">
                <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px] gap-1">
                  <span>{isHindi ? 'स्टूडेंट्स' : 'Students'}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </VFButton>
              </Link>
            }
            className="bg-[#0d0d0d] border-border/90 h-full flex flex-col"
            bodyClassName="p-3.5 flex-1 flex flex-col justify-between space-y-3"
          >
            {/* Segmented Stack */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">Capacity Allocation</span>
                <span className="font-mono font-extrabold text-primary">
                  {stats ? `${stats.total_students.toLocaleString('en-IN')} Pupils` : '—'}
                </span>
              </div>
              <div className="h-3 w-full bg-[#161616] rounded-[3px] overflow-hidden flex gap-0.5 p-0.5 border border-[#282828]">
                {wingBreakdown.map((w, idx) => (
                  <div
                    key={idx}
                    style={{ width: `${w.pct}%`, backgroundColor: w.color }}
                    className="h-full rounded-[1px]"
                    title={`${w.title}: ${w.count} (${w.pct}%)`}
                  />
                ))}
              </div>
            </div>

            {/* Wing Tiles List */}
            <div className="space-y-1.5">
              {wingBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 px-2.5 rounded-[3px] border border-border/70 bg-[#141414] flex items-center justify-between gap-2 hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-2.5 w-2.5 rounded-[2px] shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-foreground truncate">{item.title}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">({item.grade})</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <span className="text-xs font-extrabold text-foreground">{item.count}</span>
                    <span className="text-[10px] text-muted-foreground">({item.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2 rounded-[3px] bg-[#141414] border border-[#242424] flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Class Section Ratio:</span>
              <span className="font-mono font-bold text-foreground">
                {stats?.students_summary ? `${stats.students_summary.avg_per_section} Pupils / Section` : '—'}
              </span>
            </div>
          </VFCard>
        </div>
      </div>

      {/* 3. Six Dedicated Domain Operational Sections (100% Live DB Telemetry) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {/* 1. ATTENDANCE REGISTER */}
        <VFCard
          title={
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span className="font-bold text-foreground">{isHindi ? 'अटेंडेंस रजिस्टर' : 'Attendance Register'}</span>
            </div>
          }
          actions={
            <Link to="/attendance">
              <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px] gap-1">
                <span>{isHindi ? 'अटेंडेंस' : 'Attendance'}</span>
                <ArrowUpRight className="h-3 w-3" />
              </VFButton>
            </Link>
          }
          className="bg-[#0d0d0d] border-border/90 hover:border-emerald-500/40 transition-colors"
          bodyClassName="p-3.5 space-y-3"
        >
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'उपस्थिति' : 'Present'}</span>
              <span className="font-mono font-extrabold text-emerald-400 text-sm">{stats?.daily_attendance_avg ?? '—'}</span>
              <span className="text-[10px] text-muted-foreground block font-mono">
                {stats?.attendance_summary ? `${stats.attendance_summary.present_count} pupils` : '—'}
              </span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'विलंबित' : 'Late'}</span>
              <span className="font-mono font-extrabold text-amber-400 text-sm">{stats?.attendance_summary?.late_count ?? 0}</span>
              <span className="text-[10px] text-muted-foreground block font-mono">Latest Day</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'अनुपस्थित' : 'Absent'}</span>
              <span className="font-mono font-extrabold text-rose-400 text-sm">{stats?.attendance_summary?.absent_count ?? 0}</span>
              <span className="text-[10px] text-muted-foreground block font-mono">Exceptions</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50 text-muted-foreground">
            <span>Active Staff: <strong className="text-foreground font-mono">{stats?.total_staff ?? 0}</strong></span>
            <span className="text-emerald-400 font-semibold font-mono">{stats?.attendance_summary?.latest_date ?? 'Live Sync'}</span>
          </div>
        </VFCard>

        {/* 2. ADMISSIONS & INTAKE */}
        <VFCard
          title={
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-bold text-foreground">{isHindi ? 'एडमिशन्स & इंटेक' : 'Admissions & Intake'}</span>
            </div>
          }
          actions={
            <a href={getSubsystemUrl(SUBSYSTEMS.ADMISSIONS)} target="_blank" rel="noopener noreferrer">
              <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px] gap-1">
                <span>{isHindi ? 'एडमिशन्स' : 'Admissions'}</span>
                <ArrowUpRight className="h-3 w-3" />
              </VFButton>
            </a>
          }
          className="bg-[#0d0d0d] border-border/90 hover:border-zinc-700 transition-colors"
          bodyClassName="p-3.5 space-y-3"
        >
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'आवेदन' : 'Intake'}</span>
              <span className="font-mono font-extrabold text-primary text-sm">{stats?.admissions_summary?.total_applications ?? 0}</span>
              <span className="text-[10px] text-muted-foreground block font-mono">{activeSession}</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'स्क्रीनिंग' : 'Screened'}</span>
              <span className="font-mono font-extrabold text-amber-400 text-sm">{stats?.admissions_summary?.screened ?? 0}</span>
              <span className="text-[10px] text-muted-foreground block font-mono">In review</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'स्वीकृत' : 'Admitted'}</span>
              <span className="font-mono font-extrabold text-emerald-400 text-sm">
                {(stats?.admissions_summary?.approved ?? 0) + (stats?.admissions_summary?.enrolled ?? 0)}
              </span>
              <span className="text-[10px] text-muted-foreground block font-mono">Approved/Enrolled</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50 text-muted-foreground">
            <span>Conversion Rate: <strong className="text-foreground font-mono">{stats?.admissions_summary?.conversion_rate_pct ?? 0}%</strong></span>
            <span className="text-primary font-semibold font-mono">Live Pipeline</span>
          </div>
        </VFCard>

        {/* 3. STUDENTS DIRECTORY */}
        <VFCard
          title={
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="font-bold text-foreground">{isHindi ? 'स्टूडेंट डायरेक्टरी' : 'Students Directory'}</span>
            </div>
          }
          actions={
            <Link to="/students">
              <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px] gap-1">
                <span>{isHindi ? 'स्टूडेंट्स' : 'Students'}</span>
                <ArrowUpRight className="h-3 w-3" />
              </VFButton>
            </Link>
          }
          className="bg-[#0d0d0d] border-border/90 hover:border-blue-500/40 transition-colors"
          bodyClassName="p-3.5 space-y-3"
        >
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'कुल छात्र' : 'Enrolled'}</span>
              <span className="font-mono font-extrabold text-blue-400 text-sm">{stats?.total_students ?? 0}</span>
              <span className="text-[10px] text-muted-foreground block font-mono">Active</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'विंग्स' : 'Wings'}</span>
              <span className="font-mono font-extrabold text-foreground text-sm">{stats?.students_summary?.wings_count ?? 0}</span>
              <span className="text-[10px] text-muted-foreground block font-mono">Academic Wings</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'औसत अनुपात' : 'Avg Section'}</span>
              <span className="font-mono font-extrabold text-foreground text-sm">{stats?.students_summary?.avg_per_section ?? 0}</span>
              <span className="text-[10px] text-muted-foreground block font-mono">Pupils/sec</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50 text-muted-foreground">
            <span>
              Gender Split:{' '}
              <strong className="text-foreground font-mono">
                {stats?.students_summary ? `${stats.students_summary.male_pct}% M / ${stats.students_summary.female_pct}% F` : '—'}
              </strong>
            </span>
            <span className="text-blue-400 font-semibold font-mono">Live Registry</span>
          </div>
        </VFCard>

        {/* 4. FEES & FINANCE */}
        <VFCard
          title={
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-400" />
              <span className="font-bold text-foreground">{isHindi ? 'फीस लेजर & कलेक्शन' : 'Fee Ledgers & Finance'}</span>
            </div>
          }
          actions={
            <a href={getSubsystemUrl(SUBSYSTEMS.PAYMENTS)} target="_blank" rel="noopener noreferrer">
              <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px] gap-1">
                <span>{isHindi ? 'फीस लेजर' : 'Fee Ledgers'}</span>
                <ArrowUpRight className="h-3 w-3" />
              </VFButton>
            </a>
          }
          className="bg-[#0d0d0d] border-border/90 hover:border-emerald-500/40 transition-colors"
          bodyClassName="p-3.5 space-y-3"
        >
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'कलेक्शन' : 'Realized'}</span>
              <span className="font-mono font-extrabold text-emerald-400 text-sm">
                {formatInrCompact(stats?.finance_summary?.total_paid_inr)}
              </span>
              <span className="text-[10px] text-muted-foreground block font-mono">
                {stats?.finance_summary?.realization_pct ?? 0}%
              </span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'टारगेट' : 'Assessed'}</span>
              <span className="font-mono font-extrabold text-foreground text-sm">
                {formatInrCompact(stats?.finance_summary?.total_gross_inr)}
              </span>
              <span className="text-[10px] text-muted-foreground block font-mono">
                {stats?.finance_summary?.invoices_count ?? 0} Invoices
              </span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'बकाया' : 'Due'}</span>
              <span className="font-mono font-extrabold text-amber-400 text-sm">
                {formatInrCompact(stats?.finance_summary?.total_due_inr)}
              </span>
              <span className="text-[10px] text-muted-foreground block font-mono">Outstanding</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50 text-muted-foreground">
            <span>Realization Rate: <strong className="text-foreground font-mono">{stats?.finance_summary?.realization_pct ?? 0}%</strong></span>
            <span className="text-emerald-400 font-semibold font-mono">Immutable Ledger</span>
          </div>
        </VFCard>

        {/* 5. EXAMINATIONS & RESULTS */}
        <VFCard
          title={
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              <span className="font-bold text-foreground">{isHindi ? 'बोर्ड रिजल्ट्स & एग्जाम्स' : 'Examinations & Standings'}</span>
            </div>
          }
          actions={
            <a href={getSubsystemUrl(SUBSYSTEMS.EXAMINATIONS)} target="_blank" rel="noopener noreferrer">
              <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px] gap-1">
                <span>{isHindi ? 'एग्जाम्स' : 'Exams'}</span>
                <ArrowUpRight className="h-3 w-3" />
              </VFButton>
            </a>
          }
          className="bg-[#0d0d0d] border-border/90 hover:border-amber-500/40 transition-colors"
          bodyClassName="p-3.5 space-y-3"
        >
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'पास दर' : 'Pass Rate'}</span>
              <span className="font-mono font-extrabold text-amber-400 text-sm">{stats?.board_pass_rate ?? '—'}</span>
              <span className="text-[10px] text-muted-foreground block font-mono">
                {stats?.exam_summary?.total_marks_logged ?? 0} entries
              </span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'डिस्टिंक्शन' : 'Honors'}</span>
              <span className="font-mono font-extrabold text-foreground text-sm">{stats?.exam_summary?.distinction_pct ?? 0}%</span>
              <span className="text-[10px] text-muted-foreground block font-mono">
                {stats?.exam_summary?.distinction_count ?? 0} scores &ge;75%
              </span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'रैंकर्स' : 'Top 90%+'}</span>
              <span className="font-mono font-extrabold text-emerald-400 text-sm">{stats?.exam_summary?.topper_count ?? 0}</span>
              <span className="text-[10px] text-muted-foreground block font-mono">A1 Distinction</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50 text-muted-foreground">
            <span>Marks Evaluated: <strong className="text-foreground font-mono">{stats?.exam_summary?.total_marks_logged ?? 0}</strong></span>
            <span className="text-amber-400 font-semibold font-mono">Live Exam Ledger</span>
          </div>
        </VFCard>

        {/* 6. ACADEMIC OPERATIONS */}
        <VFCard
          title={
            <div className="flex items-center gap-2">
              <School className="h-4 w-4 text-cyan-400" />
              <span className="font-bold text-foreground">{isHindi ? 'एकेडमिक ऑपरेशन्स' : 'Academics & Operations'}</span>
            </div>
          }
          actions={
            <Link to="/academics">
              <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px] gap-1">
                <span>{isHindi ? 'क्लासेज' : 'Academics'}</span>
                <ArrowUpRight className="h-3 w-3" />
              </VFButton>
            </Link>
          }
          className="bg-[#0d0d0d] border-border/90 hover:border-cyan-500/40 transition-colors"
          bodyClassName="p-3.5 space-y-3"
        >
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'सेक्शन्स' : 'Classes'}</span>
              <span className="font-mono font-extrabold text-cyan-400 text-sm">{stats?.academics_summary?.classes_count ?? 0}</span>
              <span className="text-[10px] text-muted-foreground block font-mono">
                {stats?.academics_summary?.sections_count ?? 0} Sections
              </span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'पेसिंग' : 'Syllabus'}</span>
              <span className="font-mono font-extrabold text-emerald-400 text-sm">{stats?.academics_summary?.syllabus_avg_pct ?? 0}%</span>
              <span className="text-[10px] text-muted-foreground block font-mono">Lesson Plans</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'फैकल्टी' : 'Faculty'}</span>
              <span className="font-mono font-extrabold text-foreground text-sm">{stats?.total_staff ?? 0}</span>
              <span className="text-[10px] text-muted-foreground block font-mono">{stats?.teacher_student_ratio ?? '—'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50 text-muted-foreground">
            <span>Curriculum Status: <strong className="text-foreground font-mono">Active Session</strong></span>
            <span className="text-cyan-400 font-semibold font-mono">Live ORM Sync</span>
          </div>
        </VFCard>
      </div>
    </VFPageContainer>
  );
}
