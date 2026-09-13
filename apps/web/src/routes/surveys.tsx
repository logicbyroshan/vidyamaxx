import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from '../hooks/useTranslation';
import { useGlobalStore } from '../stores/globalStore';
import {
  VFPageContainer,
  VFButton,
  VFBadge,
  VFDialog,
} from '@vidyamaxx/ui';
import {
  Vote,
  CheckCircle2,
  Plus,
  BarChart3,
  Download,
  Copy,
  Users,
} from 'lucide-react';

export const Route = createFileRoute('/surveys')({
  component: SurveysManagementPage,
});

interface InstitutionalSurvey {
  id: string;
  title: string;
  targetAudience: 'Parents' | 'Students' | 'Faculty' | 'All Community';
  category: string;
  responsesCount: number;
  totalTarget: number;
  satisfactionScore: string;
  status: 'Active' | 'Completed';
  endDate: string;
  keyFinding: string;
}

interface HistoricalSurvey {
  id: string;
  title: string;
  audience: string;
  completedDate: string;
  totalResponses: number;
  finalRating: string;
  reportUrl: string;
}

const INITIAL_SURVEYS: InstitutionalSurvey[] = [
  {
    id: 'SURV-101',
    title: 'Annual Parent Satisfaction & Academic Pacing Survey 2026',
    targetAudience: 'Parents',
    category: 'Academic & Institutional Excellence',
    responsesCount: 482,
    totalTarget: 600,
    satisfactionScore: '92.4%',
    status: 'Active',
    endDate: '15 Sep 2026',
    keyFinding: 'Strong appreciation for STEM labs and bi-monthly parent-teacher feedback transparency.',
  },
  {
    id: 'SURV-102',
    title: 'Student Cafeteria & Hostel Mess Nutrition Quality Poll',
    targetAudience: 'Students',
    category: 'Campus Dining & Hygiene',
    responsesCount: 310,
    totalTarget: 350,
    satisfactionScore: '88.6%',
    status: 'Active',
    endDate: '12 Sep 2026',
    keyFinding: '89% approve lunch menu; students requested more seasonal fruits during evening high tea.',
  },
  {
    id: 'SURV-103',
    title: 'Faculty Smart Board & Digital Learning Tools Usability Audit',
    targetAudience: 'Faculty',
    category: 'EdTech & Teaching Infrastructure',
    responsesCount: 48,
    totalTarget: 50,
    satisfactionScore: '96.2%',
    status: 'Active',
    endDate: '18 Sep 2026',
    keyFinding: 'High adoption of interactive whiteboard simulation; request for more math formula widgets.',
  },
  {
    id: 'SURV-104',
    title: 'Campus Safe Environment & Anti-Bullying Wellbeing Check',
    targetAudience: 'All Community',
    category: 'Student Welfare & Mental Health',
    responsesCount: 586,
    totalTarget: 620,
    satisfactionScore: '97.8%',
    status: 'Active',
    endDate: '20 Sep 2026',
    keyFinding: 'Overwhelming positive response on student emotional counselor accessibility.',
  },
];

const ARCHIVED_SURVEYS: HistoricalSurvey[] = [
  { id: 'SURV-098', title: 'Term 1 Exam Readiness & Revision Feedback', audience: 'Students (Gr 9-12)', completedDate: '15 Jul 2026', totalResponses: 412, finalRating: '4.6 / 5.0', reportUrl: '#' },
  { id: 'SURV-095', title: 'New Academic Year Bus Route Satisfaction Survey', audience: 'Parents', completedDate: '28 Apr 2026', totalResponses: 520, finalRating: '4.4 / 5.0', reportUrl: '#' },
  { id: 'SURV-092', title: 'Curriculum NEP 2020 Skill Subjects Preference Poll', audience: 'Parents & Students', completedDate: '10 Mar 2026', totalResponses: 680, finalRating: '4.8 / 5.0', reportUrl: '#' },
];

function SurveysManagementPage() {
  const { t, lang } = useTranslation();
  const { addNotification } = useGlobalStore();
  const isHindi = lang === 'hi';

  React.useEffect(() => {
    document.title = (isHindi ? 'सर्वे & फीडबैक' : 'Surveys & Feedback') + ' – VidyaMaxx';
  }, [isHindi]);

  const [activeTab, setActiveTab] = React.useState<'active' | 'results'>('active');
  const [surveys, setSurveys] = React.useState<InstitutionalSurvey[]>(INITIAL_SURVEYS);
  const [archives] = React.useState<HistoricalSurvey[]>(ARCHIVED_SURVEYS);
  const [selectedSurvey, setSelectedSurvey] = React.useState<InstitutionalSurvey | null>(null);
  const [isNewSurveyModalOpen, setIsNewSurveyModalOpen] = React.useState(false);

  // New Survey Form State
  const [surveyTitle, setSurveyTitle] = React.useState('');
  const [surveyAudience, setSurveyAudience] = React.useState<'Parents' | 'Students' | 'Faculty' | 'All Community'>('Parents');
  const [surveyCategory, setSurveyCategory] = React.useState('Academic & Student Welfare');
  const [surveyTarget, setSurveyTarget] = React.useState('500');

  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyTitle.trim()) return;

    const newSurvey: InstitutionalSurvey = {
      id: `SURV-${Math.floor(100 + Math.random() * 900)}`,
      title: surveyTitle.trim(),
      targetAudience: surveyAudience,
      category: surveyCategory,
      responsesCount: 0,
      totalTarget: parseInt(surveyTarget, 10) || 500,
      satisfactionScore: '—',
      status: 'Active',
      endDate: '30 Sep 2026',
      keyFinding: 'Survey initialized. Accepting community responses.',
    };

    setSurveys([newSurvey, ...surveys]);
    setIsNewSurveyModalOpen(false);
    setSurveyTitle('');

    addNotification({
      title: isHindi ? 'न्यू सर्वे पब्लिश हुआ' : 'Survey Published',
      description: `Survey "${newSurvey.title}" is now active for ${newSurvey.targetAudience}.`,
      type: 'success',
    });
  };

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* ── SINGLE UNIFIED HEADER (No Double Header, No Stat Cards) ── */}
      <div className="p-3 rounded-[4px] bg-[#141414] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-xs">
        {/* Left: 2 Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-[4px] border border-border/70">
            <button
              type="button"
              id="tab-active"
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-[3px] transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-[#242424] text-foreground shadow-xs border border-border/80'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Vote className="h-3.5 w-3.5" />
              {isHindi ? 'एक्टिव सर्वे & पोल्स' : 'Active Surveys & Polls'}
            </button>
            <button
              type="button"
              id="tab-results"
              onClick={() => setActiveTab('results')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-[3px] transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'results'
                  ? 'bg-[#242424] text-foreground shadow-xs border border-border/80'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              {isHindi ? 'सेंटीमेंट एनालिसिस & आर्काइव' : 'Sentiment & Archive'}
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <VFButton
            size="sm"
            onClick={() => setIsNewSurveyModalOpen(true)}
            className="h-8 px-3.5 text-xs font-bold shadow-xs rounded-[4px]"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            {isHindi ? '+ न्यू सर्वे क्रिएट करें' : '+ Create Survey'}
          </VFButton>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          TAB 1: ACTIVE SURVEYS & POLLS
          ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'active' && (
        <div className="flex-1 min-h-0 flex flex-col space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {surveys.map((s) => {
              const progressPct = Math.round((s.responsesCount / s.totalTarget) * 100);

              return (
                <div
                  key={s.id}
                  className="p-4 rounded-[4px] border border-border/80 bg-card hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-primary">{s.id}</span>
                        <VFBadge variant="outline" className="text-xs px-2 py-0.5 rounded-[3px]">{s.targetAudience}</VFBadge>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">Closes: {s.endDate}</span>
                    </div>

                    <h4 className="text-sm font-bold text-foreground leading-snug">{s.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{s.category}</p>

                    {/* Progress Bar */}
                    <div className="mt-3.5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Responses Collected</span>
                        <span className="font-mono font-bold text-foreground">
                          {s.responsesCount} / {s.totalTarget} ({progressPct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-[2px] bg-muted/60 overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-[2px]"
                          style={{ width: `${Math.min(progressPct, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Key finding preview */}
                    <div className="mt-3.5 p-2.5 bg-[#141414] border border-border/70 rounded-[3px] text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Key Finding:</strong> {s.keyFinding}
                    </div>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-muted-foreground">Satisfaction:</span>
                      <span className="text-emerald-400 font-mono text-sm">{s.satisfactionScore}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(`https://portal.vidyamaxx.org/survey/${s.id.toLowerCase()}`);
                          addNotification({
                            title: isHindi ? 'सर्वे लिंक कॉपी हुआ' : 'Survey Link Copied',
                            description: 'Shareable poll URL copied to clipboard.',
                            type: 'info',
                          });
                        }}
                        className="h-7 px-2.5 rounded-[3px] bg-[#1c1c1c] hover:bg-[#252525] border border-border/80 text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Copy Shareable Link"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>Link</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedSurvey(s)}
                        className="h-7 px-3 rounded-[3px] bg-[#1c1c1c] hover:bg-[#252525] border border-border/80 text-xs font-bold text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{isHindi ? 'इनसाइट्स' : 'Insights'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          TAB 2: SENTIMENT ANALYSIS & HISTORICAL ARCHIVE
          ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'results' && (
        <div className="flex-1 min-h-0 flex flex-col space-y-4">
          {/* Sentiment & NPS Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-[4px] border border-border/80 bg-card space-y-2.5">
              <h5 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Stakeholder Satisfaction
              </h5>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>Parents Satisfaction</span><span className="font-bold text-emerald-400 font-mono">92.4%</span></div>
                <div className="flex justify-between"><span>Student Experience</span><span className="font-bold text-emerald-400 font-mono">88.6%</span></div>
                <div className="flex justify-between"><span>Faculty Happiness</span><span className="font-bold text-emerald-400 font-mono">96.2%</span></div>
                <div className="flex justify-between"><span>Safe Environment</span><span className="font-bold text-emerald-400 font-mono">97.8%</span></div>
              </div>
            </div>

            <div className="p-3.5 rounded-[4px] border border-border/80 bg-card space-y-2.5">
              <h5 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-400" />
                Net Promoter Score (NPS)
              </h5>
              <div className="space-y-1.5 text-xs">
                <p className="text-indigo-400 font-mono font-bold text-xl">+74 NPS</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Institutional benchmark: Top decile nationwide. 82% Promoters, 14% Passive, 4% Detractors.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-[4px] border border-border/80 bg-card space-y-2.5">
              <h5 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Recent Actions Implemented
              </h5>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>• Added 8 study carrels in library</p>
                <p>• Preet Vihar morning bus timing +10m</p>
                <p>• Added seasonal fruits in hostel tea</p>
                <p>• Upgraded Physics Lab 204 sodium lamps</p>
              </div>
            </div>
          </div>

          {/* Historical Completed Audits */}
          <div className="border border-border/80 rounded-[4px] overflow-hidden bg-card">
            <div className="p-3.5 bg-[#141414] border-b border-border/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  {isHindi ? 'पिछले सेशन्स के कंप्लीट सर्वे रिकॉर्ड्स' : 'Archived Surveys & Compliance Reports'}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isHindi ? 'डाउनलोडेबल ऑडिट & इंस्टीट्यूशनल कंप्लायंस रिपोर्ट्स' : 'Past feedback surveys with verified community participation logs'}
                </p>
              </div>
              <VFBadge variant="outline" className="font-mono text-xs px-2.5 py-1 rounded-[3px]">
                3 Archived Audits
              </VFBadge>
            </div>
            <div className="overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full min-w-full">
              <table className="w-full min-w-full text-left border-collapse text-xs table-auto">
                <thead>
                  <tr className="border-b border-border/80 bg-[#141414] text-muted-foreground font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">
                    <th className="py-2.5 px-3 text-center w-12">#</th>
                    <th className="py-2.5 px-3">{isHindi ? 'सर्वे टाइटल' : 'Survey Title'}</th>
                    <th className="py-2.5 px-3">{isHindi ? 'टारगेट ऑडियंस' : 'Audience'}</th>
                    <th className="py-2.5 px-3">{isHindi ? 'कंप्लीशन डेट' : 'Completion Date'}</th>
                    <th className="py-2.5 px-3 text-center">{isHindi ? 'टोटल रिस्पॉन्स' : 'Total Responses'}</th>
                    <th className="py-2.5 px-3 text-center">{isHindi ? 'फाइनल रेटिंग' : 'Final Rating'}</th>
                    <th className="py-2.5 px-3 text-center w-20">{t('col.action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {archives.map((a) => (
                    <tr key={a.id} className="hover:bg-[#1a1a1a] transition-colors whitespace-nowrap">
                      <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground text-center">{a.id}</td>
                      <td className="py-2.5 px-3 font-bold text-foreground text-xs sm:text-sm max-w-[220px] sm:max-w-[280px] truncate" title={a.title}>{a.title}</td>
                      <td className="py-2.5 px-3 text-xs text-muted-foreground font-medium">{a.audience}</td>
                      <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground">{a.completedDate}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-xs text-foreground text-center">{a.totalResponses}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-xs text-emerald-400 text-center">{a.finalRating}</td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            addNotification({
                              title: isHindi ? 'रिपोर्ट डाउनलोड' : 'Downloading Report',
                              description: `${a.title} summary PDF report.`,
                              type: 'info',
                            });
                          }}
                          className="px-2.5 py-1 rounded-[3px] bg-[#1c1c1c] hover:bg-[#252525] border border-border/80 text-xs font-bold text-foreground flex items-center gap-1.5 transition-colors cursor-pointer mx-auto"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Survey Dialog ── */}
      <VFDialog
        isOpen={isNewSurveyModalOpen}
        onClose={() => setIsNewSurveyModalOpen(false)}
        title={isHindi ? 'न्यू इंस्टीट्यूशनल सर्वे क्रिएट करें' : 'Create Institutional Survey'}
        description={isHindi ? 'टाइटल, टारगेट ऑडियंस और रिस्पॉन्स टारगेट सेट करें' : 'Configure stakeholder polling audience and deployment parameters'}
        className="max-w-md rounded-[4px]"
        footerActions={
          <div className="flex items-center justify-end gap-2 w-full">
            <VFButton
              variant="outline"
              size="sm"
              onClick={() => setIsNewSurveyModalOpen(false)}
              className="rounded-[3px]"
            >
              {isHindi ? 'कैंसिल' : 'Cancel'}
            </VFButton>
            <VFButton
              size="sm"
              onClick={handleCreateSurvey}
              className="rounded-[3px]"
            >
              {isHindi ? 'सर्वे पब्लिश करें' : 'Publish Survey'}
            </VFButton>
          </div>
        }
      >
        <form onSubmit={handleCreateSurvey} className="space-y-3 py-1 text-xs">
          <div>
            <label className="block text-muted-foreground font-semibold mb-1">
              {isHindi ? 'सर्वे टाइटल' : 'Survey Title'}
            </label>
            <input
              type="text"
              required
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              placeholder="e.g. Mid-Term Student Sports Facilities Survey"
              className="w-full px-3 py-1.5 border border-border rounded-[3px] bg-[#161616] text-foreground text-xs focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                {isHindi ? 'टारगेट ऑडियंस' : 'Target Audience'}
              </label>
              <select
                value={surveyAudience}
                onChange={(e) => setSurveyAudience(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-border rounded-[3px] bg-[#161616] text-foreground text-xs focus:outline-none"
              >
                <option value="Parents">Parents</option>
                <option value="Students">Students</option>
                <option value="Faculty">Faculty</option>
                <option value="All Community">All Community</option>
              </select>
            </div>
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                {isHindi ? 'टारगेट रिस्पॉन्स' : 'Target Responses'}
              </label>
              <input
                type="number"
                value={surveyTarget}
                onChange={(e) => setSurveyTarget(e.target.value)}
                placeholder="500"
                className="w-full px-3 py-1.5 border border-border rounded-[3px] bg-[#161616] text-foreground text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-muted-foreground font-semibold mb-1">
              {isHindi ? 'कैटेगरी' : 'Category'}
            </label>
            <input
              type="text"
              value={surveyCategory}
              onChange={(e) => setSurveyCategory(e.target.value)}
              placeholder="e.g. Campus Facilities & Sports"
              className="w-full px-3 py-1.5 border border-border rounded-[3px] bg-[#161616] text-foreground text-xs focus:outline-none"
            />
          </div>
        </form>
      </VFDialog>

      {/* ── View Survey Insights Dialog ── */}
      {selectedSurvey && (
        <VFDialog
          isOpen={!!selectedSurvey}
          onClose={() => setSelectedSurvey(null)}
          title={selectedSurvey.title}
          description={`${selectedSurvey.id} · ${selectedSurvey.targetAudience} · Category: ${selectedSurvey.category}`}
          className="max-w-md rounded-[4px]"
          footerActions={
            <VFButton
              variant="outline"
              size="sm"
              onClick={() => setSelectedSurvey(null)}
              className="rounded-[3px]"
            >
              {isHindi ? 'क्लोज़ करें' : 'Close'}
            </VFButton>
          }
        >
          <div className="space-y-3 py-1 text-xs">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-[#161616] border border-border/80 rounded-[3px]">
                <span className="text-xs text-muted-foreground uppercase font-bold">Responses</span>
                <p className="font-mono text-base font-bold text-foreground mt-1">{selectedSurvey.responsesCount} Submissions</p>
              </div>
              <div className="p-3 bg-[#161616] border border-border/80 rounded-[3px]">
                <span className="text-xs text-muted-foreground uppercase font-bold">Satisfaction Score</span>
                <p className="font-mono text-base font-bold text-emerald-400 mt-1">{selectedSurvey.satisfactionScore}</p>
              </div>
            </div>

            <div className="p-3.5 bg-[#161616] border border-border/80 rounded-[3px] space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key Stakeholder Finding:</span>
              <p className="text-xs text-foreground leading-relaxed">{selectedSurvey.keyFinding}</p>
            </div>
          </div>
        </VFDialog>
      )}
    </VFPageContainer>
  );
}
