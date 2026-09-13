import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from '../hooks/useTranslation';
import { useGlobalStore } from '../stores/globalStore';
import {
  VFPageContainer,
  VFButton,
  VFCard,
  VFBadge,
  VFDialog,
} from '@vidyamaxx/ui';
import {
  BookOpenCheck,
  Clock,
  CheckCircle2,
  Plus,
  BookOpen,
  Printer,
  School,
  Sparkles,
} from 'lucide-react';

export const Route = createFileRoute('/teaching')({
  component: TeachingPage,
});

interface ClassWorkload {
  code: string;
  grade: string;
  section: string;
  subject: string;
  room: string;
  students: number;
  avgAttendance: string;
  weeklyPeriods: number;
  status: 'Active' | 'Review';
}

interface LessonPlanItem {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration: string;
  date: string;
  objectives: string[];
  outline: string;
}

const INITIAL_CLASSES: ClassWorkload[] = [
  { code: 'CLS-10A', grade: 'Class 10', section: 'A', subject: 'Physics', room: 'Lab 204', students: 42, avgAttendance: '95.2%', weeklyPeriods: 6, status: 'Active' },
  { code: 'CLS-09B', grade: 'Class 9', section: 'B', subject: 'Mathematics', room: 'Room 108', students: 38, avgAttendance: '92.4%', weeklyPeriods: 6, status: 'Active' },
  { code: 'CLS-11SCI', grade: 'Class 11', section: 'Science', subject: 'Advanced Physics', room: 'Lab 201', students: 36, avgAttendance: '98.1%', weeklyPeriods: 7, status: 'Active' },
  { code: 'CLS-09A', grade: 'Class 9', section: 'A', subject: 'Mathematics', room: 'Room 105', students: 40, avgAttendance: '96.0%', weeklyPeriods: 5, status: 'Active' },
];

const INITIAL_PLANS: LessonPlanItem[] = [
  {
    id: 'LP-101',
    title: 'Electromagnetic Induction & Faraday’s Laws',
    subject: 'Physics',
    grade: 'Class 10',
    duration: '45 mins',
    date: 'Today, 10:00 AM',
    objectives: [
      'Understand magnetic flux variation and induced electromotive force.',
      'Demonstrate Lenz’s law with coil and bar magnet simulation.',
      'Solve 2 numerical problems on induced EMF formula.',
    ],
    outline: '00-10m: Concept recap & coil demonstration\n10-25m: Faraday equation & magnetic flux derivation\n25-35m: Student peer calculation in pairs\n35-45m: Rapid exit quiz & homework assignment (Ch. 6 Q1-4)',
  },
  {
    id: 'LP-102',
    title: 'Quadratic Equations: Factorization & Discriminant',
    subject: 'Mathematics',
    grade: 'Class 9',
    duration: '45 mins',
    date: 'Tomorrow, 09:15 AM',
    objectives: [
      'Identify roots through split-the-middle-term method.',
      'Interpret real vs imaginary roots using discriminant D = b² - 4ac.',
    ],
    outline: '00-08m: Homework review & quadratic standard form\n08-22m: Step-by-step factorization examples on board\n22-35m: Guided worksheet exercise with 5 polynomial problems\n35-45m: Doubt clearing & assignment submission prompt',
  },
];

const DAILY_SCHEDULE = [
  { period: 'Period 1', time: '08:30 - 09:15', class: 'Class 10 - A', subject: 'Physics', room: 'Lab 204', type: 'Lecture' },
  { period: 'Period 2', time: '09:15 - 10:00', class: 'Class 9 - B', subject: 'Mathematics', room: 'Room 108', type: 'Problem Solving' },
  { period: 'Break', time: '10:00 - 10:20', class: '—', subject: 'Recess / Staff Room', room: 'Staff Lounge', type: 'Break' },
  { period: 'Period 3', time: '10:20 - 11:05', class: 'Class 11 - Sci', subject: 'Advanced Physics', room: 'Lab 201', type: 'Lab Practical' },
  { period: 'Period 4', time: '11:05 - 11:50', class: 'Free Period', subject: 'Lesson Planning / Doubt Desk', room: 'Faculty Cabin #12', type: 'Prep' },
  { period: 'Period 5', time: '12:30 - 01:15', class: 'Class 9 - A', subject: 'Mathematics', room: 'Room 105', type: 'Lecture' },
];

function TeachingPage() {
  const { t, lang } = useTranslation();
  const { addNotification } = useGlobalStore();
  const isHindi = lang === 'hi';

  React.useEffect(() => {
    document.title = (isHindi ? 'टीचिंग' : 'Teaching') + ' – VidyaMaxx';
  }, [isHindi]);

  const [activeTab, setActiveTab] = React.useState<'classes' | 'planner'>('classes');
  const [classes] = React.useState<ClassWorkload[]>(INITIAL_CLASSES);
  const [plans, setPlans] = React.useState<LessonPlanItem[]>(INITIAL_PLANS);
  const [activePlan, setActivePlan] = React.useState<LessonPlanItem | null>(null);
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = React.useState(false);

  // New Lesson Plan Form State
  const [newTitle, setNewTitle] = React.useState('');
  const [newSubject, setNewSubject] = React.useState('Physics');
  const [newGrade, setNewGrade] = React.useState('Class 10');
  const [newObjective, setNewObjective] = React.useState('');
  const [isGeneratingAI, setIsGeneratingAI] = React.useState(false);

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPlan: LessonPlanItem = {
      id: `LP-${Date.now().toString().slice(-3)}`,
      title: newTitle.trim(),
      subject: newSubject,
      grade: newGrade,
      duration: '45 mins',
      date: 'Today, Just now',
      objectives: newObjective.trim() ? [newObjective.trim()] : [
        'Understand foundational concepts with real-world applications.',
        'Solve 3 interactive problem examples in class.',
      ],
      outline: `00-10m: Concept introduction & previous recap\n10-25m: Structured explanation of ${newTitle}\n25-35m: Small group peer exercise\n35-45m: Rapid recap quiz & homework assignment`,
    };

    setPlans([newPlan, ...plans]);
    setIsNewPlanModalOpen(false);
    setNewTitle('');
    setNewObjective('');
    addNotification({
      title: isHindi ? 'लेसन प्लान क्रिएट हुआ' : 'Lesson Plan Created',
      description: isHindi ? `"${newPlan.title}" सफलतापूर्वक सेव हुआ।` : `"${newPlan.title}" has been saved.`,
      type: 'success',
    });
  };

  const handleAIAssist = () => {
    if (!newTitle.trim()) {
      setNewTitle('Thermodynamics & Heat Engine Cycles');
    }
    setIsGeneratingAI(true);
    setTimeout(() => {
      setIsGeneratingAI(false);
      setNewObjective('Derive Carnot efficiency formula and explain real-life refrigeration cycles.');
    }, 400);
  };

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* ── SINGLE UNIFIED HEADER (Consistent Standard Padding & Typography) ── */}
      <div className="p-3 rounded-[4px] bg-[#141414] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-xs">
        {/* Left: Tab Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#1a1a1a] p-1 rounded-[4px] border border-border/70">
            <button
              type="button"
              id="tab-classes"
              onClick={() => setActiveTab('classes')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-[3px] transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'classes'
                  ? 'bg-[#242424] text-foreground shadow-xs border border-border/80'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <School className="h-4 w-4" />
              {isHindi ? 'असाइंड क्लासेज & वर्कलोड' : 'Classes & Workload'}
            </button>
            <button
              type="button"
              id="tab-planner"
              onClick={() => setActiveTab('planner')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-[3px] transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'planner'
                  ? 'bg-[#242424] text-foreground shadow-xs border border-border/80'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpenCheck className="h-4 w-4" />
              {isHindi ? 'लेसन प्लानर & रूटीन' : 'Lesson Planner'}
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <VFButton
            size="sm"
            onClick={() => setIsNewPlanModalOpen(true)}
            className="h-8 px-3.5 text-xs font-bold shadow-xs rounded-[4px]"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            {isHindi ? '+ न्यू लेसन प्लान' : '+ New Lesson Plan'}
          </VFButton>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          TAB 1: ASSIGNED CLASSES & WORKLOAD (Standardized Cell Padding & Hierarchy)
          ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'classes' && (
        <div className="flex-1 min-h-0 flex flex-col space-y-4">
          <div className="border border-border/80 rounded-[4px] overflow-hidden bg-card w-full min-w-full">
            <div className="overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full min-w-full">
              <table className="w-full min-w-full text-left border-collapse text-xs table-auto">
                <thead>
                  <tr className="border-b border-border/80 bg-[#141414] text-muted-foreground font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">
                    <th className="py-2.5 px-3">{isHindi ? 'क्लास कोड' : 'Class Code'}</th>
                    <th className="py-2.5 px-3">{isHindi ? 'क्लास & सेक्शन' : 'Grade & Section'}</th>
                    <th className="py-2.5 px-3">{t('col.subject')}</th>
                    <th className="py-2.5 px-3">{isHindi ? 'रूम नंबर' : 'Room'}</th>
                    <th className="py-2.5 px-3">{isHindi ? 'स्टूडेंट्स काउंट' : 'Students'}</th>
                    <th className="py-2.5 px-3">{isHindi ? 'वीकली पीरियड्स' : 'Weekly Periods'}</th>
                    <th className="py-2.5 px-3">{isHindi ? 'एवरेज अटेंडेंस' : 'Avg Attendance'}</th>
                    <th className="py-2.5 px-3 text-right">{t('col.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {classes.map((cls) => (
                    <tr key={cls.code} className="hover:bg-[#1a1a1a] transition-colors whitespace-nowrap">
                      <td className="py-2.5 px-3 font-mono font-bold text-primary text-xs">{cls.code}</td>
                      <td className="py-2.5 px-3 font-bold text-foreground text-xs sm:text-sm">{cls.grade} – {cls.section}</td>
                      <td className="py-2.5 px-3 text-foreground font-medium text-xs max-w-[180px] truncate" title={cls.subject}>{cls.subject}</td>
                      <td className="py-2.5 px-3 text-muted-foreground font-mono text-xs">{cls.room}</td>
                      <td className="py-2.5 px-3 font-bold text-foreground text-xs">{cls.students} students</td>
                      <td className="py-2.5 px-3 font-mono text-muted-foreground text-xs">{cls.weeklyPeriods} periods/wk</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400 text-xs">{cls.avgAttendance}</td>
                      <td className="py-2.5 px-3 text-right">
                        <VFBadge variant="success" className="text-xs px-2 py-0.5 rounded-[3px]">{cls.status}</VFBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          TAB 2: LESSON PLANNER & DAILY ROUTINE (Enhanced Cards & Typography)
          ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'planner' && (
        <div className="flex-1 min-h-0 flex flex-col space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Saved Plans */}
            <div className="lg:col-span-1 space-y-2.5">
              <div className="p-3 bg-[#141414] border border-border/80 rounded-[4px] flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">{isHindi ? 'सेव्ड लेसन प्लान्स' : 'Saved Lesson Plans'}</span>
                <span className="text-xs text-muted-foreground font-mono">{plans.length} Plans</span>
              </div>
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {plans.map((p) => {
                  const isSelected = activePlan?.id === p.id || (!activePlan && plans[0]?.id === p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => setActivePlan(p)}
                      className={`p-3.5 rounded-[4px] border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#1c1c1c] border-primary/50 text-foreground shadow-xs'
                          : 'bg-card border-border/80 hover:bg-[#161616] text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-primary font-bold">{p.id}</span>
                        <span className="text-xs text-muted-foreground font-mono">{p.duration}</span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground mt-1.5 line-clamp-1">{p.title}</h4>
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <VFBadge variant="outline" className="text-xs px-2 py-0.5 rounded-[3px]">{p.grade}</VFBadge>
                        <span className="text-muted-foreground font-medium">{p.subject}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Plan Timeline */}
            <div className="lg:col-span-2">
              {(() => {
                const current = activePlan || plans[0];
                if (!current) return null;
                return (
                  <VFCard
                    title={current.title}
                    description={`${current.grade} · ${current.subject} · ${current.duration} Timeline`}
                    className="rounded-[4px] border-border/80"
                  >
                    <div className="space-y-4 text-xs mt-1">
                      <div>
                        <h4 className="font-bold text-foreground uppercase tracking-wider text-xs mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          {isHindi ? 'प्राइमरी लर्निंग ऑब्जेक्टिव्स' : 'Learning Objectives'}
                        </h4>
                        <ul className="space-y-1.5 pl-4 list-disc text-muted-foreground text-xs leading-relaxed">
                          {current.objectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t border-border/80 pt-3.5">
                        <h4 className="font-bold text-foreground uppercase tracking-wider text-xs mb-2 flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-primary" />
                          {isHindi ? '45 मिनट टाइम ब्रेकडाउन' : '45-Minute Period Breakdown'}
                        </h4>
                        <div className="p-3.5 bg-[#121212] border border-border/70 rounded-[4px] font-mono text-xs whitespace-pre-wrap text-foreground/90 leading-relaxed">
                          {current.outline}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/80">
                        <VFButton
                          size="sm"
                          variant="outline"
                          leftIcon={<Printer className="h-3.5 w-3.5" />}
                          onClick={() => window.print()}
                          className="rounded-[4px] h-8 px-3 text-xs font-bold"
                        >
                          {isHindi ? 'प्रिंट करें' : 'Print'}
                        </VFButton>
                        <VFButton
                          size="sm"
                          leftIcon={<BookOpen className="h-3.5 w-3.5" />}
                          onClick={() => {
                            addNotification({
                              title: isHindi ? 'क्लास में स्टार्ट किया गया' : 'Active in Classroom',
                              description: `Timer active for "${current.title}".`,
                              type: 'info',
                            });
                          }}
                          className="rounded-[4px] h-8 px-3.5 text-xs font-bold"
                        >
                          {isHindi ? 'क्लास में लॉन्च करें' : 'Launch in Class'}
                        </VFButton>
                      </div>
                    </div>
                  </VFCard>
                );
              })()}
            </div>
          </div>

          {/* Daily Schedule Row */}
          <div className="border border-border/80 rounded-[4px] bg-[#141414] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">{isHindi ? 'आज का पीरियड टाइमटेबल' : 'Today’s Period Timetable'}</span>
              <span className="text-xs text-muted-foreground font-mono">Monday, 07 Sep 2026</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {DAILY_SCHEDULE.map((slot, idx) => (
                <div key={idx} className="p-2.5 bg-[#1a1a1a] border border-border/70 rounded-[4px] text-xs space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-primary text-xs">{slot.period}</span>
                    <span className="text-xs text-muted-foreground font-mono">{slot.type}</span>
                  </div>
                  <p className="font-bold text-foreground truncate text-xs">{slot.class}</p>
                  <p className="text-muted-foreground truncate text-xs">{slot.subject}</p>
                  <p className="text-xs font-mono text-emerald-400 mt-1">{slot.room}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Create Lesson Plan Dialog ── */}
      <VFDialog
        isOpen={isNewPlanModalOpen}
        onClose={() => setIsNewPlanModalOpen(false)}
        title={isHindi ? 'न्यू लेसन प्लान क्रिएट करें' : 'Create New Lesson Plan'}
        description={isHindi ? '45 मिनट का स्ट्रक्चर्ड टीचिंग टाइमलाइन और लर्निंग ऑब्जेक्टिव्स एंटर करें' : 'Build a 45-minute structured teaching timeline and learning objectives'}
        className="max-w-md rounded-[4px]"
        footerActions={
          <div className="flex items-center justify-end gap-2 w-full">
            <VFButton
              variant="outline"
              size="sm"
              onClick={() => setIsNewPlanModalOpen(false)}
              className="rounded-[4px]"
            >
              {t('action.cancel')}
            </VFButton>
            <VFButton
              variant="primary"
              size="sm"
              onClick={handleCreatePlan}
              disabled={!newTitle.trim()}
              className="rounded-[4px] font-bold"
            >
              {isHindi ? 'प्लान सेव करें' : 'Save Plan'}
            </VFButton>
          </div>
        }
      >
        <form onSubmit={handleCreatePlan} className="space-y-3 text-xs mt-1">
          <div>
            <label className="block font-bold text-foreground mb-1">
              {isHindi ? 'लेसन टॉपिक / टाइटल' : 'Lesson Topic / Title'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Electromagnetic Induction"
                className="flex-1 px-3 py-2 border border-border rounded-[4px] bg-[#161616] text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <VFButton
                type="button"
                size="sm"
                variant="outline"
                leftIcon={<Sparkles className="h-3 w-3 text-amber-400" />}
                onClick={handleAIAssist}
                disabled={isGeneratingAI}
                className="rounded-[4px] text-[11px] shrink-0"
              >
                {isGeneratingAI ? 'AI...' : 'AI Suggest'}
              </VFButton>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-foreground mb-1">{isHindi ? 'सब्जेक्ट' : 'Subject'}</label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full px-2.5 py-2 border border-border rounded-[4px] bg-[#161616] text-foreground text-xs focus:outline-none"
              >
                <option value="Physics">Physics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-foreground mb-1">{isHindi ? 'क्लास' : 'Grade'}</label>
              <select
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                className="w-full px-2.5 py-2 border border-border rounded-[4px] bg-[#161616] text-foreground text-xs focus:outline-none"
              >
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-foreground mb-1">
              {isHindi ? 'प्राइमरी लर्निंग ऑब्जेक्टिव्स' : 'Primary Learning Objective'}
            </label>
            <textarea
              rows={3}
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              placeholder="e.g. Derive induced EMF equation and solve 2 numerical exercises..."
              className="w-full px-3 py-2 border border-border rounded-[4px] bg-[#161616] text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
        </form>
      </VFDialog>
    </VFPageContainer>
  );
}
