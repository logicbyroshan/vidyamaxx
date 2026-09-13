import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from '../hooks/useTranslation';
import {
  VFPageContainer,
  VFStatCard,
  VFDataTable,
  VFButton,
  VFCard,
  VFTabs,
  VFBadge,
} from '@vidyamaxx/ui';
import {
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  Users,
  Sparkles,
} from 'lucide-react';

export const Route = createFileRoute('/learning')({
  component: LearningPage,
});

function LearningPage() {
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  const [lessonTopic, setLessonTopic] = React.useState('');
  const [generatedPlan, setGeneratedPlan] = React.useState<string | null>(null);

  const handleGenerateLessonPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTopic.trim()) return;
    setGeneratedPlan(
      `Structured 45-Min Lesson Plan for "${lessonTopic}":\n\n` +
      `1. Learning Objectives:\n` +
      `   • Introduce foundational concepts with practical real-world applications.\n` +
      `   • Guide students through 3 interactive problem examples.\n\n` +
      `2. Time Breakdown:\n` +
      `   • 00:00 - 00:10: Concept introduction & previous recap\n` +
      `   • 00:10 - 00:25: Guided explanation & demonstration\n` +
      `   • 00:25 - 00:35: Small group peer exercise\n` +
      `   • 00:35 - 00:45: Rapid recap quiz & homework assignment`
    );
  };

  const classData = [
    { code: 'CLS-9A', class: 'Class 9', section: 'Section A', subject: 'Mathematics', totalStudents: 40, avgAtt: '96.2%', status: 'Active' },
    { code: 'CLS-9B', class: 'Class 9', section: 'Section B', subject: 'Mathematics', totalStudents: 38, avgAtt: '92.4%', status: 'Active' },
    { code: 'CLS-10A', class: 'Class 10', section: 'Section A', subject: 'Physics', totalStudents: 42, avgAtt: '95.0%', status: 'Active' },
    { code: 'CLS-11SCI', class: 'Class 11', section: 'Science A', subject: 'Advanced Physics', totalStudents: 36, avgAtt: '98.1%', status: 'Active' },
  ];

  const classColumns = [
    {
      header: isHindi ? 'क्लास कोड' : 'Class Code',
      accessorKey: 'code',
      cell: (r: any) => <span className="font-mono font-bold text-primary text-base">{r.code}</span>,
    },
    {
      header: isHindi ? 'कक्षा व सेक्शन' : 'Grade & Section',
      accessorKey: 'class',
      cell: (r: any) => <span className="font-extrabold text-foreground text-base">{r.class} - {r.section}</span>,
    },
    {
      header: t('col.subject'),
      accessorKey: 'subject',
      cell: (r: any) => <span className="font-bold text-foreground text-base">{r.subject}</span>,
    },
    {
      header: isHindi ? 'स्टूडेंट्स' : 'Students',
      accessorKey: 'totalStudents',
      cell: (r: any) => <span className="font-black text-foreground text-base">{r.totalStudents} {isHindi ? 'स्टूडेंट्स' : 'Students'}</span>,
    },
    {
      header: isHindi ? 'एवरेज अटेंडेंस' : 'Avg Attendance',
      accessorKey: 'avgAtt',
      cell: (r: any) => <span className="font-black text-success text-base">{r.avgAtt}</span>,
    },
    {
      header: t('col.status'),
      accessorKey: 'status',
      cell: (r: any) => <VFBadge variant="success">{r.status === 'Active' ? (isHindi ? 'सक्रिय' : r.status) : r.status}</VFBadge>,
    },
  ];

  // 1. Classes & Dashboard View
  const classesContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <VFStatCard
          title={isHindi ? 'असाइंड कक्षाएं' : 'Assigned Classes'}
          value="4 Sections"
          icon={<Users className="h-5 w-5" />}
          trend="up"
          trendLabel={isHindi ? 'टोटल 156 स्टूडेंट्स' : '156 Total Students'}
          accentColor="blue"
        />
        <VFStatCard
          title={isHindi ? 'साप्ताहिक पीरियड्स' : 'Weekly Periods'}
          value="24 Periods"
          icon={<Clock className="h-5 w-5" />}
          trend="neutral"
          trendLabel="45-min slots"
          accentColor="cyan"
        />
        <VFStatCard
          title={isHindi ? 'सिलेबस गति' : 'Syllabus Pacing'}
          value="68.4%"
          icon={<TrendingUp className="h-5 w-5" />}
          trend="up"
          trendLabel={isHindi ? 'शेड्यूल से आगे' : 'Ahead of schedule'}
          accentColor="emerald"
        />
        <VFStatCard
          title={isHindi ? 'औसत क्लास GPA' : 'Average Class GPA'}
          value="3.84 / 4.0"
          icon={<Award className="h-5 w-5" />}
          trend="up"
          trendLabel="Term 1 Average"
          accentColor="purple"
        />
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-foreground tracking-tight">
            {isHindi ? 'टीचर को असाइंड क्लासेज' : 'Teacher Assigned Classes'}
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            {isHindi ? 'एक्टिव सेक्शन्स और स्टूडेंट अटेंडेंस ट्रैकिंग' : 'Active sections and student attendance tracking'}
          </p>
        </div>
        <VFDataTable
          columns={classColumns}
          data={classData}
          filterPlaceholder={isHindi ? 'कक्षा या विषय खोजें...' : 'Search class or subject...'}
        />
      </div>
    </div>
  );

  // 2. Lesson Planner View
  const plannerContent = (
    <div className="space-y-6">
      <VFCard
        title={isHindi ? 'इंटरैक्टिव पाठ योजना जनरेटर' : 'Interactive Lesson Plan Generator'}
        description={isHindi ? 'सेकंडों में 45 मिनट की संरचित पाठ योजना बनाएं' : 'Create structured 45-minute lesson timelines in seconds'}
      >
        <form onSubmit={handleGenerateLessonPlan} className="space-y-4 mt-1">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={lessonTopic}
              onChange={(e) => setLessonTopic(e.target.value)}
              placeholder={isHindi ? 'विषय का नाम दर्ज करें (उदा. विद्युत प्रेरण, द्विघात समीकरण)...' : 'Enter topic name (e.g. Electromagnetic Induction, Quadratic Equations)...'}
              className="flex-1 px-4 py-2.5 text-base border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium h-11"
            />
            <VFButton type="submit" size="sm" leftIcon={<Sparkles className="h-4 w-4" />}>
              {isHindi ? 'योजना बनाएं' : 'Generate Plan'}
            </VFButton>
          </div>

          {generatedPlan && (
            <div className="p-4 bg-muted/30 border border-border rounded-lg animate-fade-in">
              <pre className="text-base text-foreground font-sans whitespace-pre-wrap leading-relaxed">
                {generatedPlan}
              </pre>
            </div>
          )}
        </form>
      </VFCard>
    </div>
  );

  // 3. Syllabus Tracker View
  const syllabusContent = (
    <div className="space-y-6">
      <VFCard
        title={isHindi ? 'पाठ्यक्रम सिलेबस प्रगति' : 'Curriculum Syllabus Pacing'}
        description={isHindi ? 'टर्म अनुसार अध्याय पूर्ण स्थिति' : 'Term-wise chapter completion status'}
      >
        <div className="space-y-4 mt-1">
          {[
            { subject: 'Class 9 Mathematics', chapters: isHindi ? '14 में से 9 अध्याय पूरे' : '9 of 14 Chapters Completed', progress: 64 },
            { subject: 'Class 10 Physics', chapters: isHindi ? '15 में से 11 अध्याय पूरे' : '11 of 15 Chapters Completed', progress: 73 },
            { subject: 'Class 11 Advanced Physics', chapters: isHindi ? '12 में से 8 अध्याय पूरे' : '8 of 12 Chapters Completed', progress: 66 },
          ].map((s, i) => (
            <div key={i} className="space-y-1.5 text-base">
              <div className="flex justify-between font-bold">
                <span className="text-foreground text-base">{s.subject}</span>
                <span className="text-muted-foreground text-sm font-semibold">{s.chapters} ({s.progress}%)</span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${s.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </VFCard>
    </div>
  );

  const tabs = [
    { id: 'classes', label: isHindi ? 'मेरी कक्षाएं व डैशबोर्ड' : 'My Classes & Dashboard', icon: <Users className="h-4 w-4" />, content: classesContent },
    { id: 'planner', label: isHindi ? 'लेसन प्लानर' : 'Lesson Planner', icon: <Sparkles className="h-4 w-4" />, content: plannerContent },
    { id: 'syllabus', label: isHindi ? 'सिलेबस ट्रैकर' : 'Syllabus Tracker', icon: <BookOpen className="h-4 w-4" />, content: syllabusContent },
  ];

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* 1. Header Toolbar Box */}
      <div className="p-3.5 rounded-lg bg-[#141414] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-base font-extrabold text-foreground tracking-tight">
            {t('nav.teachers')}
          </span>
          <VFBadge variant="success" className="text-[10px] font-bold font-mono">
            {isHindi ? 'NEP 2020 संरेखित' : 'NEP 2020 Aligned'}
          </VFBadge>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <VFButton
            size="sm"
            className="h-9 px-3.5 text-xs font-bold shadow-xs"
            leftIcon={<Sparkles className="h-3.5 w-3.5" />}
            onClick={() => setGeneratedPlan('Auto-generating interactive lesson plan...')}
          >
            {isHindi ? 'AI पाठ योजना' : 'AI Lesson Plan'}
          </VFButton>
        </div>
      </div>

      <VFTabs items={tabs} defaultTabId="classes" variant="top-bar" />
    </VFPageContainer>
  );
}
