import { useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFCard,
  VFBadge,
  VFStatCard,
  VFButton,
} from '@vidyamaxx/ui';
import {
  Users,
  UserCheck,
  TrendingUp,
  CreditCard,
  Sparkles,
  Award,
  School,
  CheckCircle2,
  Layers,
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
    { title: isHindi ? 'प्राइमरी विंग' : 'Primary Wing', grade: 'Grades 1 – 5', count: 430, pct: 34.5, color: '#3b82f6' },
    { title: isHindi ? 'मिडिल स्कूल' : 'Middle School', grade: 'Grades 6 – 8', count: 374, pct: 30.0, color: '#06b6d4' },
    { title: isHindi ? 'हाई स्कूल' : 'High School', grade: 'Grades 9 – 10', count: 250, pct: 20.0, color: '#10b981' },
    { title: isHindi ? 'सीनियर सेकेंडरी' : 'Senior Secondary', grade: 'Grades 11 – 12', count: 194, pct: 15.5, color: '#f59e0b' },
  ];

  // Quarterly revenue realization
  const quarterlyFeeData = [
    { quarter: 'Q1 (Apr–Jun)', target: '₹ 85 L', collected: '₹ 80 L', pct: 94.1, status: 'Completed' },
    { quarter: 'Q2 (Jul–Sep)', target: '₹ 95 L', collected: '₹ 92 L', pct: 96.8, status: 'Active' },
    { quarter: 'Q3 (Oct–Dec)', target: '₹ 90 L', collected: '₹ 70 L', pct: 77.7, status: 'Upcoming' },
    { quarter: 'Q4 (Jan–Mar)', target: '₹ 100 L', collected: '₹ 88 L', pct: 88.0, status: 'Projected' },
  ];

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* 1. Top Executive KPI Metric Cards (Clickable Deep Links to Detailed Domains) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <Link to="/students" className="block group focus:outline-hidden">
          <VFStatCard
            title={t('students.totalStudents')}
            value={activeSession === '2026–2027' ? '1,248' : '1,180'}
            icon={<Users className="h-4.5 w-4.5" />}
            trend="up"
            trendLabel={`Session ${activeSession}`}
            accentColor="blue"
            className="group-hover:border-primary/50 transition-colors"
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
            className="group-hover:border-cyan-500/50 transition-colors"
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
            className="group-hover:border-emerald-500/50 transition-colors"
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
            className="group-hover:border-primary/50 transition-colors"
          />
        </Link>
      </div>

      {/* 2. Quick Domain Navigation Register (Direct jump to detailed functional pages) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2.5 px-3 rounded-[4px] bg-[#0d0d0d] border border-border/80 text-xs">
        <div className="flex items-center gap-2 shrink-0">
          <Layers className="h-3.5 w-3.5 text-primary" />
          <span className="font-bold text-foreground">
            {isHindi ? 'डिटेल्ड रिकॉर्ड रजिस्टर:' : 'Detailed Registers & Reports:'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link to="/attendance">
            <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px]">
              {isHindi ? 'अटेंडेंस' : 'Attendance'} ↗
            </VFButton>
          </Link>
          <Link to="/admissions">
            <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px]">
              {isHindi ? 'एडमिशन्स' : 'Admissions'} ↗
            </VFButton>
          </Link>
          <Link to="/students">
            <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px]">
              {isHindi ? 'स्टूडेंट डायरेक्टरी' : 'Students'} ↗
            </VFButton>
          </Link>
          <Link to="/fees">
            <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px]">
              {isHindi ? 'फीस लेजर' : 'Fee Ledgers'} ↗
            </VFButton>
          </Link>
          <Link to="/examinations">
            <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px]">
              {isHindi ? 'एग्जाम्स' : 'Exams'} ↗
            </VFButton>
          </Link>
          <Link to="/academics">
            <VFButton size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold rounded-[4px]">
              {isHindi ? 'क्लासेज' : 'Academics'} ↗
            </VFButton>
          </Link>
        </div>
      </div>

      {/* 3. Section 1: Modern Attendance & Intake Trajectory + Wing Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Modern Interactive Trajectory Visual (7 cols) */}
        <div className="lg:col-span-7">
          <VFCard
            title={
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span>{isHindi ? 'अटेंडेंस & स्टूडेंट एडमिशन ट्रेंड्स' : 'Attendance & Intake Trajectory'}</span>
              </div>
            }
            description={
              isHindi
                ? 'मंथली एडमिशन्स और डेली अटेंडेंस ट्रेंड्स'
                : 'Monthly intake volume & daily attendance rate'
            }
            actions={
              <div className="flex items-center gap-2 flex-wrap">
                <Link to="/attendance">
                  <VFButton
                    size="sm"
                    variant="outline"
                    className="h-7 px-2.5 text-xs font-bold rounded-[4px]"
                  >
                    {isHindi ? 'अटेंडेंस ↗' : 'Attendance ↗'}
                  </VFButton>
                </Link>
                <Link to="/admissions">
                  <VFButton
                    size="sm"
                    variant="outline"
                    className="h-7 px-2.5 text-xs font-bold rounded-[4px]"
                  >
                    {isHindi ? 'एडमिशन्स ↗' : 'Admissions ↗'}
                  </VFButton>
                </Link>
              </div>
            }
            className="bg-[#0d0d0d] border-border/90 h-full flex flex-col"
            bodyClassName="p-4 flex-1 flex flex-col justify-between space-y-3"
          >
            {/* Trajectory Graphic Visual Bars with Full Height Utilization */}
            <div className="space-y-3 pt-1 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-muted-foreground pb-1 border-b border-[#202020]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <span className="h-2.5 w-2.5 rounded-[2px] bg-primary" />
                    New Student Intake (Pupils)
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-400" />
                    Daily Attendance (%)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">Session AY 2026–27</span>
              </div>

              {/* Responsive Full-Height Metric Visual Track */}
              <div className="grid grid-cols-6 gap-2 sm:gap-3.5 items-stretch pt-2 flex-1 min-h-[220px]">
                {monthlyTrends.map((m, idx) => {
                  const intakeHeight = Math.max(12, Math.round((m.intake / 350) * 100));
                  const attHeight = Math.max(15, Math.round(((m.attendance - 80) / 20) * 100));
                  return (
                    <div key={idx} className="flex flex-col items-center justify-end h-full gap-1.5 group/bar">
                      <div className="text-[10.5px] font-mono font-bold text-emerald-400/90 group-hover/bar:text-emerald-400 transition-colors">
                        {m.attendance}%
                      </div>
                      <div className="w-full flex items-end justify-center gap-1.5 flex-1 min-h-[160px] bg-[#141414] rounded-[3px] p-1.5 border border-border/60">
                        {/* Intake Bar */}
                        <div
                          style={{ height: `${intakeHeight}%` }}
                          className="w-1/2 bg-gradient-to-t from-orange-600 to-primary rounded-t-[2px] transition-all duration-300 group-hover/bar:brightness-110 shadow-xs"
                          title={`Intake: ${m.intake} Pupils`}
                        />
                        {/* Attendance Bar */}
                        <div
                          style={{ height: `${attHeight}%` }}
                          className="w-1/2 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-[2px] transition-all duration-300 group-hover/bar:brightness-110 shadow-xs"
                          title={`Attendance: ${m.attendance}%`}
                        />
                      </div>
                      <span className="text-xs font-bold font-mono text-foreground shrink-0">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Summary Highlights Footer */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#202020] text-xs">
              <div className="p-2.5 rounded-[4px] bg-[#141414] border border-[#242424] text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Peak Intake</span>
                <span className="font-mono font-extrabold text-primary">340 Students</span>
              </div>
              <div className="p-2.5 rounded-[4px] bg-[#141414] border border-[#242424] text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Avg Attendance</span>
                <span className="font-mono font-extrabold text-emerald-400">96.9%</span>
              </div>
              <div className="p-2.5 rounded-[4px] bg-[#141414] border border-[#242424] text-center">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Biometric Sync</span>
                <span className="font-mono font-extrabold text-blue-400">100% Realtime</span>
              </div>
            </div>
          </VFCard>
        </div>

        {/* Modern Wing Enrollment Distribution (5 cols) */}
        <div className="lg:col-span-5">
          <VFCard
            title={
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-400" />
                <span>{isHindi ? 'विंग अनुसार स्टूडेंट डिस्ट्रिब्यूशन' : 'Enrollment by Academic Wing'}</span>
              </div>
            }
            description={isHindi ? 'विंग अनुसार स्टूडेंट एनरोलमेंट' : 'Student distribution across academic wings'}
            actions={
              <Link to="/students">
                <VFButton
                  size="sm"
                  variant="outline"
                  className="h-7 px-2.5 text-xs font-bold rounded-[4px]"
                >
                  {isHindi ? 'स्टूडेंट्स ↗' : 'Students ↗'}
                </VFButton>
              </Link>
            }
            className="bg-[#0d0d0d] border-border/90 h-full flex flex-col"
            bodyClassName="p-4 flex-1 flex flex-col justify-between space-y-4"
          >
            {/* Modern Segmented Progress Stack */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">Capacity Allocation</span>
                <span className="font-mono font-extrabold text-primary">1,248 Pupils (100%)</span>
              </div>
              <div className="h-3.5 w-full bg-[#161616] rounded-[3px] overflow-hidden flex gap-0.5 p-0.5 border border-[#282828]">
                {wingBreakdown.map((w, idx) => (
                  <div
                    key={idx}
                    style={{ width: `${w.pct}%`, backgroundColor: w.color }}
                    className="h-full rounded-[1px] transition-all hover:opacity-90"
                    title={`${w.title}: ${w.count} (${w.pct}%)`}
                  />
                ))}
              </div>
            </div>

            {/* Wing Tiles List */}
            <div className="space-y-2">
              {wingBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 px-3 rounded-[4px] border border-border/80 bg-[#141414] flex items-center justify-between gap-3 hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="h-3 w-3 rounded-[2px] shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="text-xs font-bold text-foreground truncate">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{item.grade}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-foreground font-mono">{item.count}</span>
                    <span className="text-[11px] font-semibold text-muted-foreground block">{item.pct}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-[4px] bg-[#141414] border border-[#242424] flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Class Section Ratio:</span>
              <span className="font-mono font-bold text-foreground">~31.2 Pupils / Class</span>
            </div>
          </VFCard>
        </div>
      </div>

      {/* 4. Section 2: Fee Realization vs Target + Academic Honors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Fee Realization Progress Gauges (7 cols) */}
        <div className="lg:col-span-7">
          <VFCard
            title={
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <span>{isHindi ? 'फीस कलेक्शन बनाम बजट टारगेट' : 'Fee Collection vs Budget Target'}</span>
              </div>
            }
            description={
              isHindi
                ? 'क्वार्टरली कलेक्शन एनालिसिस'
                : 'Quarterly collection vs annual budget target'
            }
            actions={
              <div className="flex items-center gap-2">
                <VFBadge variant="success" className="text-xs font-bold font-mono">98.1% Realized</VFBadge>
                <Link to="/fees">
                  <VFButton
                    size="sm"
                    variant="outline"
                    className="h-7 px-2.5 text-xs font-bold rounded-[4px]"
                  >
                    {isHindi ? 'फीस लेजर ↗' : 'Fee Ledgers ↗'}
                  </VFButton>
                </Link>
              </div>
            }
            className="bg-[#0d0d0d] border-border/90"
            bodyClassName="p-4 space-y-4"
          >
            <div className="space-y-3">
              {quarterlyFeeData.map((q, idx) => (
                <div key={idx} className="p-3 rounded-[4px] bg-[#141414] border border-[#242424] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-foreground">{q.quarter}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">({q.status})</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-extrabold text-emerald-400">{q.collected}</span>
                      <span className="text-muted-foreground">/ {q.target}</span>
                      <span className="font-bold text-foreground">({q.pct}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-[2px] bg-[#222222] overflow-hidden">
                    <div
                      className="h-full rounded-[2px] bg-gradient-to-r from-orange-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${q.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </VFCard>
        </div>

        {/* Academic Excellence & Distinction Standings (5 cols) */}
        <div className="lg:col-span-5">
          <VFCard
            title={
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>{isHindi ? 'एकेडमिक एक्सीलेंस & अचीवमेंट्स' : 'Academic Standing & Distinctions'}</span>
              </div>
            }
            description={
              isHindi
                ? 'बोर्ड रिजल्ट्स और मेरिट डिस्टिंक्शन'
                : 'Board standings & merit honors'
            }
            actions={
              <Link to="/examinations">
                <VFButton
                  size="sm"
                  variant="outline"
                  className="h-7 px-2.5 text-xs font-bold rounded-[4px]"
                >
                  {isHindi ? 'एग्जाम रिजल्ट्स ↗' : 'Exam Standings ↗'}
                </VFButton>
              </Link>
            }
            className="bg-[#0d0d0d] border-border/90 h-full flex flex-col"
            bodyClassName="p-4 flex-1 flex flex-col justify-between space-y-3"
          >
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-[4px] bg-[#141414] border border-[#242424] space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  {isHindi ? 'डिस्टिंक्शन रेट' : 'Distinction (>75%)'}
                </span>
                <p className="text-xl font-black text-foreground font-mono">89.2%</p>
                <p className="text-[11px] text-emerald-400 font-medium">324 Students with Honors</p>
              </div>
              <div className="p-3 rounded-[4px] bg-[#141414] border border-[#242424] space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  {isHindi ? 'स्टेट मेरिट रैंकर्स' : 'State Merit Rankers'}
                </span>
                <p className="text-xl font-black text-foreground font-mono">14 Pupils</p>
                <p className="text-[11px] text-blue-400 font-medium">Top 0.5 percentile CBSE</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#202020]">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                {isHindi ? 'मेन सब्जेक्ट-वाइज़ एवरेज मार्क्स' : 'Core Subject Averages'}
              </span>
              <div className="space-y-2 text-xs">
                {[
                  { subject: 'Mathematics', score: 92.4, color: 'bg-blue-500' },
                  { subject: 'Science & Tech', score: 91.8, color: 'bg-emerald-500' },
                  { subject: 'English & Lit', score: 94.1, color: 'bg-amber-500' },
                ].map((s, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground">{s.subject}</span>
                      <span className="font-mono font-bold text-foreground">{s.score}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-[2px] bg-[#222222] overflow-hidden">
                      <div
                        className={`h-full rounded-[2px] ${s.color}`}
                        style={{ width: `${s.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </VFCard>
        </div>
      </div>

      {/* 5. Section 3: Class Roster Summary (4-Column Grid) */}
      <VFCard
        title={
          <div className="flex items-center gap-2">
            <School className="h-4 w-4 text-primary" />
            <span>{isHindi ? 'कक्षावार नामांकन व अटेंडेंस सारांश' : 'Senior Secondary & High School Roster Summary'}</span>
          </div>
        }
        description={
          isHindi
            ? 'क्लास 9 से 12 के स्टूडेंट्स, सेक्शन्स और एक्टिव अटेंडेंस रेट का संक्षिप्त विवरण'
            : 'Operational division strength and realtime attendance benchmark across core grades'
        }
        actions={
          <Link to="/academics">
            <VFButton
              size="sm"
              variant="outline"
              className="h-7 px-2.5 text-xs font-bold rounded-[4px]"
            >
              {isHindi ? 'एकेडमिक डिवीजनों ↗' : 'Academic Divisions ↗'}
            </VFButton>
          </Link>
        }
        className="bg-[#0d0d0d] border-border/90"
        bodyClassName="p-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { grade: 'Class 9', total: '320 Students', sections: '4 Sections', standing: '96.2% Attendance', ratio: '80 / Section' },
            { grade: 'Class 10', total: '310 Students', sections: '4 Sections', standing: '97.8% Attendance', ratio: '77 / Section' },
            { grade: 'Class 11', total: '308 Students', sections: '4 Sections', standing: '94.5% Attendance', ratio: '77 / Section' },
            { grade: 'Class 12', total: '310 Students', sections: '4 Sections', standing: '98.1% Attendance', ratio: '77 / Section' },
          ].map((c, i) => (
            <div
              key={i}
              className="p-3 rounded-[4px] bg-[#141414] border border-border/80 space-y-2 hover:border-primary/40 transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between">
                <p className="font-extrabold text-foreground text-sm">{c.grade}</p>
                <VFBadge variant="outline" className="text-[10px] font-mono font-bold">
                  {c.sections}
                </VFBadge>
              </div>
              <p className="text-xl font-black text-foreground font-mono">{c.total}</p>
              <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground pt-1.5 border-t border-border/50">
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {c.standing}
                </span>
                <span className="font-mono text-[10px]">{c.ratio}</span>
              </div>
            </div>
          ))}
        </div>
      </VFCard>
    </VFPageContainer>
  );
}
