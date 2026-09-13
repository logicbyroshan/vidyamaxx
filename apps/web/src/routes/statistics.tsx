import { useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFCard,
  VFStatCard,
  VFButton,
} from '@vidyamaxx/ui';
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

export const Route = createFileRoute('/statistics')({
  component: StatisticsPage,
});

function StatisticsPage() {
  const { activeSession } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';

  useEffect(() => {
    document.title = t('page.statistics') + ' – VidyaMaxx';
  }, [t]);

  // Intake & Attendance Trajectory Data
  const monthlyTrends = [
    { month: 'Apr', intake: 180, attendance: 92 },
    { month: 'May', intake: 220, attendance: 94 },
    { month: 'Jun', intake: 190, attendance: 91 },
    { month: 'Jul', intake: 310, attendance: 96 },
    { month: 'Aug', intake: 280, attendance: 95 },
    { month: 'Sep', intake: 340, attendance: 97 },
  ];

  // Wing distribution data
  const wingBreakdown = [
    { title: isHindi ? 'प्राइमरी विंग' : 'Primary Wing', grade: 'Grades 1–5', count: 430, pct: 34.5, color: '#3b82f6' },
    { title: isHindi ? 'मिडिल स्कूल' : 'Middle School', grade: 'Grades 6–8', count: 374, pct: 30.0, color: '#06b6d4' },
    { title: isHindi ? 'हाई स्कूल' : 'High School', grade: 'Grades 9–10', count: 250, pct: 20.0, color: '#10b981' },
    { title: isHindi ? 'सीनियर सेकेंडरी' : 'Senior Secondary', grade: 'Grades 11–12', count: 194, pct: 15.5, color: '#f59e0b' },
  ];

  return (
    <VFPageContainer className="space-y-3.5">
      {/* 1. Top Executive KPI Metric Cards (Clickable Deep Links) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <Link to="/students" className="block group focus:outline-hidden">
          <VFStatCard
            title={t('students.totalStudents')}
            value={activeSession === '2026–2027' ? '1,248' : '1,180'}
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
            value="18 : 1"
            icon={<School className="h-4.5 w-4.5" />}
            trend="neutral"
            trendLabel="CBSE Standard"
            accentColor="cyan"
            className="group-hover:border-zinc-700 transition-colors"
          />
        </Link>
        <Link to="/attendance" className="block group focus:outline-hidden">
          <VFStatCard
            title={isHindi ? 'डेली एवरेज अटेंडेंस' : 'Daily Attendance Avg'}
            value="96.9%"
            icon={<UserCheck className="h-4.5 w-4.5" />}
            trend="up"
            trendLabel="1,210 Active Daily"
            accentColor="emerald"
            className="group-hover:border-zinc-700 transition-colors"
          />
        </Link>
        <Link to="/examinations" className="block group focus:outline-hidden">
          <VFStatCard
            title={isHindi ? 'एनुअल बोर्ड पास रेट' : 'Board Exam Pass Rate'}
            value="98.6%"
            icon={<Award className="h-4.5 w-4.5" />}
            trend="up"
            trendLabel="+1.4% vs State Avg"
            accentColor="primary"
            className="group-hover:border-zinc-700 transition-colors"
          />
        </Link>
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
                <Link to="/admissions">
                  <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px] gap-1">
                    <span>{isHindi ? 'एडमिशन्स' : 'Admissions'}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </VFButton>
                </Link>
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
                  const intakeHeight = Math.max(14, Math.round((m.intake / 350) * 100));
                  const attHeight = Math.max(26, Math.round(((m.attendance - 75) / 25) * 100));
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
                <span className="font-mono font-extrabold text-primary text-xs sm:text-sm">340 Pupils</span>
              </div>
              <div className="p-2 rounded-[3px] bg-[#141414] border border-[#242424] text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Avg Attendance</span>
                <span className="font-mono font-extrabold text-emerald-400 text-xs sm:text-sm">96.9%</span>
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
                <span className="font-mono font-extrabold text-primary">1,248 Pupils (100%)</span>
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
              <span className="font-mono font-bold text-foreground">~31.2 Pupils / Section</span>
            </div>
          </VFCard>
        </div>
      </div>

      {/* 3. Six Dedicated Domain Operational Sections (1 Section Per Core Page with Direct Navigation) */}
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
              <span className="font-mono font-extrabold text-emerald-400 text-sm">96.9%</span>
              <span className="text-[10px] text-muted-foreground block font-mono">1,210 pupils</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'विलंबित' : 'Late'}</span>
              <span className="font-mono font-extrabold text-amber-400 text-sm">26</span>
              <span className="text-[10px] text-muted-foreground block font-mono">2.1%</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'अनुपस्थित' : 'Absent'}</span>
              <span className="font-mono font-extrabold text-rose-400 text-sm">12</span>
              <span className="text-[10px] text-muted-foreground block font-mono">1.0%</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50 text-muted-foreground">
            <span>Faculty Present: <strong className="text-foreground font-mono">61 / 62 (98.4%)</strong></span>
            <span className="text-emerald-400 font-semibold font-mono">Realtime Live</span>
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
            <Link to="/admissions">
              <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px] gap-1">
                <span>{isHindi ? 'एडमिशन्स' : 'Admissions'}</span>
                <ArrowUpRight className="h-3 w-3" />
              </VFButton>
            </Link>
          }
          className="bg-[#0d0d0d] border-border/90 hover:border-zinc-700 transition-colors"
          bodyClassName="p-3.5 space-y-3"
        >
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'आवेदन' : 'Intake'}</span>
              <span className="font-mono font-extrabold text-primary text-sm">340</span>
              <span className="text-[10px] text-muted-foreground block font-mono">AY 2026-27</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'स्क्रीनिंग' : 'Screened'}</span>
              <span className="font-mono font-extrabold text-amber-400 text-sm">142</span>
              <span className="text-[10px] text-muted-foreground block font-mono">In review</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'स्वीकृत' : 'Admitted'}</span>
              <span className="font-mono font-extrabold text-emerald-400 text-sm">188</span>
              <span className="text-[10px] text-muted-foreground block font-mono">Enrolled</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50 text-muted-foreground">
            <span>Conversion Rate: <strong className="text-foreground font-mono">55.3%</strong></span>
            <span className="text-primary font-semibold font-mono">Stage Active</span>
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
              <span className="font-mono font-extrabold text-blue-400 text-sm">1,248</span>
              <span className="text-[10px] text-muted-foreground block font-mono">Active</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'विंग्स' : 'Wings'}</span>
              <span className="font-mono font-extrabold text-foreground text-sm">4</span>
              <span className="text-[10px] text-muted-foreground block font-mono">Grades 1-12</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'औसत अनुपात' : 'Avg Section'}</span>
              <span className="font-mono font-extrabold text-foreground text-sm">31.2</span>
              <span className="text-[10px] text-muted-foreground block font-mono">Pupils/sec</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50 text-muted-foreground">
            <span>Gender Distribution: <strong className="text-foreground font-mono">52% M / 48% F</strong></span>
            <span className="text-blue-400 font-semibold font-mono">CBSE Indexed</span>
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
            <Link to="/fees">
              <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px] gap-1">
                <span>{isHindi ? 'फीस लेजर' : 'Fee Ledgers'}</span>
                <ArrowUpRight className="h-3 w-3" />
              </VFButton>
            </Link>
          }
          className="bg-[#0d0d0d] border-border/90 hover:border-emerald-500/40 transition-colors"
          bodyClassName="p-3.5 space-y-3"
        >
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'कलेक्शन' : 'Realized'}</span>
              <span className="font-mono font-extrabold text-emerald-400 text-sm">₹ 3.30 Cr</span>
              <span className="text-[10px] text-muted-foreground block font-mono">96.8%</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'टारगेट' : 'Target'}</span>
              <span className="font-mono font-extrabold text-foreground text-sm">₹ 3.70 Cr</span>
              <span className="text-[10px] text-muted-foreground block font-mono">Annual</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'बकाया' : 'Due'}</span>
              <span className="font-mono font-extrabold text-amber-400 text-sm">₹ 18 L</span>
              <span className="text-[10px] text-muted-foreground block font-mono">Outstanding</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50 text-muted-foreground">
            <span>Online Realization: <strong className="text-foreground font-mono">82.4%</strong></span>
            <span className="text-emerald-400 font-semibold font-mono">98.1% Target</span>
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
            <Link to="/examinations">
              <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px] gap-1">
                <span>{isHindi ? 'एग्जाम्स' : 'Exams'}</span>
                <ArrowUpRight className="h-3 w-3" />
              </VFButton>
            </Link>
          }
          className="bg-[#0d0d0d] border-border/90 hover:border-amber-500/40 transition-colors"
          bodyClassName="p-3.5 space-y-3"
        >
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'पास दर' : 'Pass Rate'}</span>
              <span className="font-mono font-extrabold text-amber-400 text-sm">98.6%</span>
              <span className="text-[10px] text-muted-foreground block font-mono">+1.4% State</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'डिस्टिंक्शन' : 'Honors'}</span>
              <span className="font-mono font-extrabold text-foreground text-sm">89.2%</span>
              <span className="text-[10px] text-muted-foreground block font-mono">324 pupils</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'रैंकर्स' : 'Rankers'}</span>
              <span className="font-mono font-extrabold text-emerald-400 text-sm">14</span>
              <span className="text-[10px] text-muted-foreground block font-mono">Top 0.5%</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50 text-muted-foreground">
            <span>Core Score Leader: <strong className="text-foreground font-mono">English (94.1%)</strong></span>
            <span className="text-amber-400 font-semibold font-mono">CBSE 9-Point</span>
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
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'सेक्शन्स' : 'Divisions'}</span>
              <span className="font-mono font-extrabold text-cyan-400 text-sm">16</span>
              <span className="text-[10px] text-muted-foreground block font-mono">Class 1-12</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'पेसिंग' : 'Syllabus'}</span>
              <span className="font-mono font-extrabold text-emerald-400 text-sm">68.4%</span>
              <span className="text-[10px] text-muted-foreground block font-mono">On schedule</span>
            </div>
            <div className="p-2 rounded-[3px] bg-[#141414] border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{isHindi ? 'फैकल्टी' : 'Faculty'}</span>
              <span className="font-mono font-extrabold text-foreground text-sm">62</span>
              <span className="text-[10px] text-muted-foreground block font-mono">18:1 Ratio</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50 text-muted-foreground">
            <span>Curriculum Tier: <strong className="text-foreground font-mono">CBSE Core</strong></span>
            <span className="text-cyan-400 font-semibold font-mono">100% Assigned</span>
          </div>
        </VFCard>
      </div>
    </VFPageContainer>
  );
}
