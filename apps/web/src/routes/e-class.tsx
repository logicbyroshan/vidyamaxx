import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFButton,
  VFCard,
  VFDialog,
} from '@vidyamaxx/ui';
import {
  ExternalLink,
  Play,
  Video,
  Mic,
  Monitor,
  Users,
  Hand,
  MessageSquare,
  FileText,
  Download,
  Sparkles,
  BookOpen,
  Radio,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/e-class')({
  component: EClassOverviewPage,
});

interface VideoLecture {
  id: string;
  title: string;
  hindiTitle: string;
  subject: 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology' | 'Computer Science';
  grade: string;
  teacher: string;
  avatar: string;
  duration: string;
  date: string;
  views: number;
  thumbnailUrl: string;
  summary: string;
  aiNotes: string[];
  chapters: { time: string; label: string }[];
}

const LECTURE_VAULT: VideoLecture[] = [
  {
    id: 'LEC-MATH-101',
    title: 'Differential Calculus & Rate of Change Applications',
    hindiTitle: 'डिफरेंशियल कैलकुलस & रेट ऑफ चेंज एप्लिकेशन्स',
    subject: 'Mathematics',
    grade: 'Class 12-A',
    teacher: 'Dr. Alok Verma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    duration: '48:15',
    date: 'Today, 10:00 AM',
    views: 42,
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    summary: 'Comprehensive analysis of maxima, minima, tangents, and rate measurement derivatives with standard NCERT exemplars.',
    aiNotes: [
      'Chain rule and product rule applied to composite trigonometric functions.',
      'First derivative test vs Second derivative test for local extrema.',
      'Solved board question papers from 2023-2025 examination sets.',
    ],
    chapters: [
      { time: '00:00', label: 'Introduction & Formula Recall' },
      { time: '12:30', label: 'Rate of Change Geometric Interpretation' },
      { time: '28:45', label: 'NCERT Exemplar Problem #14' },
      { time: '41:10', label: 'Q&A & Homework Problem Assignment' },
    ],
  },
  {
    id: 'LEC-PHY-204',
    title: 'Electromagnetic Induction & Faraday’s Laws',
    hindiTitle: 'इलेक्ट्रोमैग्नेटिक इंडक्शन & फैराडे के नियम',
    subject: 'Physics',
    grade: 'Class 12-Sci',
    teacher: 'Prof. Sunita Rao',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    duration: '52:40',
    date: 'Yesterday, 11:30 AM',
    views: 58,
    thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
    summary: 'Live laboratory apparatus demonstration of magnetic flux linkage, Lenz law conservation of energy, and eddy current dampening.',
    aiNotes: [
      'Magnetic flux expression $\\Phi = B \\cdot A \\cos\\theta$.',
      'Induced EMF proportional to rate of change of magnetic flux linkage.',
      'Practical demonstration of copper plate oscillation dampening in magnetic field.',
    ],
    chapters: [
      { time: '00:00', label: 'Magnetic Flux & Coil Apparatus Setup' },
      { time: '15:20', label: 'Faraday’s Law Mathematical Derivation' },
      { time: '34:10', label: 'Lenz’s Law Direction of Induced Current' },
      { time: '47:00', label: 'Summary & Practice Numerical' },
    ],
  },
  {
    id: 'LEC-CHEM-302',
    title: 'Organic Chemistry: Aldehydes, Ketones & Carboxylic Acids',
    hindiTitle: 'ऑर्गेनिक केमिस्ट्री: एल्डिहाइड्स, कीटोन्स & कार्बोक्सिलिक एसिड्स',
    subject: 'Chemistry',
    grade: 'Class 11-A',
    teacher: 'Dr. Rajesh Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    duration: '44:20',
    date: '10 Sep 2026',
    views: 64,
    thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    summary: 'Nucleophilic addition mechanisms, Rosenmund reduction, and Tollens silver mirror identification test.',
    aiNotes: [
      'Nucleophilic addition to polar carbonyl $C=O$ bond.',
      'Aldol condensation mechanism and Cannizzaro disproportionation reaction.',
      'Distinction tests between aldehydes and ketones using Fehling solution.',
    ],
    chapters: [
      { time: '00:00', label: 'Carbonyl Group Nomenclature' },
      { time: '14:00', label: 'Preparation Methods & Reagents' },
      { time: '29:30', label: 'Nucleophilic Addition Mechanism' },
      { time: '39:15', label: 'Tollens Test Demonstration' },
    ],
  },
  {
    id: 'LEC-CS-401',
    title: 'Python Data Structures: Stacks, Queues & Recursion',
    hindiTitle: 'पायथन डेटा स्ट्रक्चर्स: स्टैक्स, क्यूज & रिकर्शन',
    subject: 'Computer Science',
    grade: 'Class 12-CS',
    teacher: 'Meera Iyer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    duration: '46:50',
    date: '08 Sep 2026',
    views: 78,
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    summary: 'Implementation of LIFO Stack and FIFO Queue using Python lists and collections.deque with algorithmic time complexity analysis.',
    aiNotes: [
      'Stack push/pop operations with underflow/overflow condition checking.',
      'Infix to Postfix expression conversion algorithm.',
      'Recursion call stack memory visualization.',
    ],
    chapters: [
      { time: '00:00', label: 'Linear Data Structures Overview' },
      { time: '11:20', label: 'Stack Implementation in Python' },
      { time: '26:40', label: 'Queue Operations with collections.deque' },
      { time: '38:00', label: 'Recursive Call Stack Trace' },
    ],
  },
];

const LIVE_DOUBTS = [
  { student: 'Sneha Singh', time: '10:14 AM', question: 'Sir, why does the second derivative test fail when f"(x) = 0?' },
  { student: 'Amit Patel', time: '10:19 AM', question: 'Can we apply product rule directly on 3 composite functions?' },
  { student: 'Kavya Nair', time: '10:27 AM', question: 'Is Question #18 required for tomorrow’s class test?' },
];

function EClassOverviewPage() {
  const { addNotification } = useGlobalStore();
  const { lang } = useTranslation();
  const isHindi = lang === 'hi';

  const [selectedSubject, setSelectedSubject] = React.useState<string>('All');
  const [selectedLecture, setSelectedLecture] = React.useState<VideoLecture | null>(null);
  const [activeTab, setActiveTab] = React.useState<'live-studio' | 'recordings'>('live-studio');
  const [playbackSpeed, setPlaybackSpeed] = React.useState<string>('1.0x');

  const standalonePort = '8012';
  const standaloneUrl = `http://localhost:${standalonePort}`;

  const handleLaunchEClass = (path = '') => {
    const url = `${standaloneUrl}${path}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    addNotification({
      title: isHindi ? 'ई-क्लास स्टूडियो ओपन हो रहा है' : 'Opening E-Class Studio',
      description: isHindi ? 'पोर्ट 8012 पर लाइव क्लासरूम ब्रॉडकास्ट पर रिडायरेक्ट किया जा रहा है।' : 'Redirecting to live classroom broadcast on port 8012.',
      type: 'info',
    });
  };

  const filteredLectures = selectedSubject === 'All'
    ? LECTURE_VAULT
    : LECTURE_VAULT.filter((l) => l.subject === selectedSubject);

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* ── TOP HEADER & LAUNCH BAR ── */}
      <div className="p-3 sm:p-3.5 rounded-[4px] bg-[#141414] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">
              {isHindi ? 'ई-क्लास & डिजिटल ब्रॉडकास्ट स्टूडियो' : 'E-Classroom & Digital Broadcast Studio'}
            </h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-[#1a1a1a] border border-rose-500/30 text-rose-400 text-[10.5px] font-bold">
              <Radio className="w-3 h-3 animate-pulse text-rose-500" />
              <span>LIVE BROADCAST READY</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            {isHindi
              ? 'डिजिटल स्मार्ट बोर्ड स्क्रीनकास्ट, लाइव लेक्चर ब्रॉडकास्ट, रिकॉर्डिंग वॉल्ट और AI लेक्चर नोट्स।'
              : 'Interactive smart board screencasting, live classroom streaming, lecture video vault & AI summary notes.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <VFButton
            size="sm"
            variant="outline"
            onClick={() => handleLaunchEClass('/live')}
            className="rounded-[4px] gap-1.5 text-xs font-bold h-8 cursor-pointer bg-[#141414] hover:border-zinc-700"
          >
            <Video className="w-3.5 h-3.5 text-rose-400" />
            <span>{isHindi ? 'लाइव क्लास स्टार्ट करें' : 'Start Live Class'}</span>
          </VFButton>
          <VFButton
            size="sm"
            onClick={() => handleLaunchEClass()}
            className="rounded-[4px] gap-1.5 text-xs font-bold h-8 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isHindi ? 'ई-क्लास पोर्टल खोलें' : 'Open E-Class Portal'}</span>
          </VFButton>
        </div>
      </div>

      {/* ── WORKSPACE MODE TABS ── */}
      <div className="flex items-center justify-between border-b border-border/80 pb-2">
        <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-[4px] border border-border/70">
          <button
            onClick={() => setActiveTab('live-studio')}
            className={`px-3 py-1.5 rounded-[3px] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'live-studio'
                ? 'bg-[#242424] text-foreground shadow-xs border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>{isHindi ? 'लाइव क्लासरूम ब्रॉडकास्ट' : 'Live Classroom Studio'}</span>
          </button>
          <button
            onClick={() => setActiveTab('recordings')}
            className={`px-3 py-1.5 rounded-[3px] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'recordings'
                ? 'bg-[#242424] text-foreground shadow-xs border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isHindi ? 'लेक्चर रिकॉर्डिंग्स & AI नोट्स' : 'Lecture Vault & AI Notes'}</span>
            <span className="px-1.5 py-0.2 rounded-[2px] bg-white/10 text-[10px] font-mono font-bold">
              {LECTURE_VAULT.length}
            </span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline-block">
          Port: {standalonePort} · WebRTC Low-Latency
        </span>
      </div>

      {/* ── TAB 1: LIVE BROADCAST STUDIO VIEW ── */}
      {activeTab === 'live-studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main Broadcast Stage (8 cols) */}
          <div className="lg:col-span-8 flex flex-col rounded-[4px] border border-border/90 bg-[#080808] shadow-md overflow-hidden">
            {/* Top Stream Status Bar */}
            <div className="p-2.5 px-3.5 bg-[#121212] border-b border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="flex items-center gap-1 font-bold text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  LIVE
                </span>
                <span className="text-zinc-600">|</span>
                <span className="text-foreground font-bold">Class 12-A · Mathematics (Calculus)</span>
                <span className="text-zinc-600">|</span>
                <span className="text-muted-foreground">1080p 60FPS</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-[3px] bg-[#1a1a1a] border border-border font-mono text-[10.5px] font-bold text-emerald-400 flex items-center gap-1">
                  <Users className="w-3 h-3 text-emerald-400" />
                  48 Students Connected
                </span>
              </div>
            </div>

            {/* Smart Whiteboard & Stream Canvas Viewport */}
            <div className="relative aspect-video w-full bg-[#0a0f18] p-4 flex flex-col justify-between border-b border-border/80 overflow-hidden select-none">
              
              {/* Whiteboard Math Equation Content Mockup */}
              <div className="relative z-1 space-y-3 font-mono">
                <div className="inline-block px-2.5 py-1 rounded-[3px] bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-bold">
                  Topic: Applications of Derivatives — Maximum Profit & Cost Functions
                </div>
                
                <div className="p-3 rounded-[4px] bg-[#071326]/90 border border-blue-500/20 text-xs space-y-2 text-zinc-200">
                  <p className="font-bold text-emerald-400">Given Total Cost Function: C(x) = 0.005x³ - 0.02x² + 30x + 5000</p>
                  <p className="text-zinc-300">1. Marginal Cost MC = dC/dx = 0.015x² - 0.04x + 30</p>
                  <p className="text-zinc-300">2. At x = 100 units: MC = 0.015(10000) - 0.04(100) + 30 = 150 - 4 + 30 = <span className="font-black text-amber-300">₹176 / unit</span></p>
                </div>
              </div>

              {/* Floating Instructor WebCam Feed (Picture-in-Picture) */}
              <div className="absolute bottom-3 right-3 w-36 sm:w-44 aspect-4/3 rounded-[4px] border-2 border-primary shadow-xl overflow-hidden bg-black z-10">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                  alt="Instructor Dr. Alok Verma"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 left-1.5 px-1.5 py-0.2 rounded bg-black/80 text-[9px] font-bold text-white flex items-center gap-1 font-mono">
                  <Mic className="w-2.5 h-2.5 text-emerald-400" />
                  Dr. Alok Verma
                </div>
              </div>

              {/* Studio Bottom Controls Bar */}
              <div className="relative z-1 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-1 rounded-[3px] bg-black/60 border border-white/10 text-white font-mono text-[10.5px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" />
                    34:18 Elapsed
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <VFButton size="sm" onClick={() => handleLaunchEClass('/live')} className="h-7 text-xs font-bold rounded-[3px] bg-rose-600 hover:bg-rose-700">
                    <Radio className="w-3 h-3 mr-1" />
                    Join Live Class
                  </VFButton>
                </div>
              </div>
            </div>

            {/* Smart Board Pen & Presentation Tools */}
            <div className="p-2.5 bg-[#121212] flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">Interactive Board Tools:</span>
                <span className="px-2 py-0.5 rounded bg-[#1c1c1c] text-[10.5px] text-zinc-300 font-mono">Digital Pen</span>
                <span className="px-2 py-0.5 rounded bg-[#1c1c1c] text-[10.5px] text-zinc-300 font-mono">LaTeX Equation</span>
                <span className="px-2 py-0.5 rounded bg-[#1c1c1c] text-[10.5px] text-zinc-300 font-mono">GeoGebra Graphing</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Auto-Recording Saved to Vault</span>
              </div>
            </div>
          </div>

          {/* Right Live Interaction & Doubts Stream (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Live Raised Hands & Doubts */}
            <VFCard
              title={
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">
                    {isHindi ? 'लाइव डाउट बोर्ड & प्रश्न' : 'Live Class Doubts & Q&A'}
                  </span>
                </div>
              }
              description={isHindi ? 'विद्यार्थियों के वास्तविक समय प्रश्न' : 'Real-time student chat & raised hand queue'}
              className="rounded-[4px] border-border/90 bg-[#0d0d0d]"
              headerClassName="py-2.5 px-3.5"
              bodyClassName="p-0"
            >
              <div className="divide-y divide-border/60 text-xs">
                {LIVE_DOUBTS.map((d, idx) => (
                  <div key={idx} className="p-3 space-y-1 hover:bg-[#121212] transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-[11.5px] flex items-center gap-1">
                        <Hand className="w-3 h-3 text-amber-400" />
                        {d.student}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">{d.time}</span>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed bg-[#141414] p-2 rounded-[3px] border border-border/60">
                      "{d.question}"
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-2.5 border-t border-border/80 bg-[#101010]">
                <button
                  onClick={() => handleLaunchEClass('/chat')}
                  className="w-full py-1.5 rounded-[3px] bg-[#1a1a1a] hover:bg-[#222] border border-border text-center text-xs font-bold text-primary transition-colors cursor-pointer"
                >
                  {isHindi ? 'सभी डाउट्स व चैट देखें ↗' : 'Open Full Q&A Stream ↗'}
                </button>
              </div>
            </VFCard>

            {/* Smart Board Lecture Notes Card */}
            <VFCard
              title={
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-foreground">
                    {isHindi ? 'आज के स्मार्ट बोर्ड नोट्स' : 'Today’s Board PDF Notes'}
                  </span>
                </div>
              }
              className="rounded-[4px] border-border/90 bg-[#0d0d0d]"
              headerClassName="py-2.5 px-3.5"
              bodyClassName="p-3.5 space-y-2.5"
            >
              <div className="p-2.5 rounded bg-[#141414] border border-border/80 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-foreground text-[11.5px]">Calculus_Derivatives_Part2.pdf</p>
                  <p className="text-muted-foreground text-[10px] font-mono">14 Pages · 4.2 MB · Vector PDF</p>
                </div>
                <VFButton size="sm" variant="outline" className="h-7 px-2 text-xs font-bold rounded-[3px]">
                  <Download className="w-3 h-3 mr-1" />
                  PDF
                </VFButton>
              </div>
            </VFCard>

          </div>
        </div>
      )}

      {/* ── TAB 2: LECTURE VAULT & AI NOTES REPOSITORY ── */}
      {activeTab === 'recordings' && (
        <div className="space-y-3.5">
          
          {/* Subject Filter Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {['All', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-2.5 py-1 rounded-[3px] text-xs font-bold transition-all cursor-pointer ${
                    selectedSubject === sub
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-[#141414] text-muted-foreground hover:text-foreground hover:bg-[#1c1c1c] border border-border/70'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-muted-foreground">
              {filteredLectures.length} {isHindi ? 'लेक्चर वीडियोज' : 'Lectures Found'}
            </span>
          </div>

          {/* Video Lectures Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
            {filteredLectures.map((lec) => (
              <div
                key={lec.id}
                onClick={() => setSelectedLecture(lec)}
                className="rounded-[4px] border border-border/80 bg-[#121212] hover:bg-[#161616] hover:border-zinc-700 transition-all cursor-pointer flex flex-col justify-between group overflow-hidden shadow-xs"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  <img
                    src={lec.thumbnailUrl}
                    alt={lec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-[2px] bg-black/85 text-white font-mono text-[10px] font-bold">
                    {lec.duration}
                  </div>
                  {/* Subject Tag */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-[2px] bg-[#1a1a1a] text-zinc-300 border border-border font-mono text-[9.5px] font-bold uppercase">
                    {lec.subject}
                  </div>
                  {/* Play Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-[4px] bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-foreground line-clamp-2 leading-tight">
                      {isHindi ? lec.hindiTitle : lec.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                      {lec.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10.5px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <img src={lec.avatar} alt={lec.teacher} className="w-4 h-4 rounded-[2px] object-cover" />
                      <span className="truncate max-w-[110px]">{lec.teacher}</span>
                    </div>
                    <span className="font-mono">{lec.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VIDEO PLAYER & AI LECTURE NOTES MODAL ── */}
      {selectedLecture && (
        <VFDialog
          isOpen={Boolean(selectedLecture)}
          onClose={() => setSelectedLecture(null)}
          title={isHindi ? selectedLecture.hindiTitle : selectedLecture.title}
          description={`${selectedLecture.subject} · ${selectedLecture.grade} · Faculty: ${selectedLecture.teacher}`}
          className="max-w-3xl"
          footerActions={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">{isHindi ? 'प्लेबैक स्पीड:' : 'Speed:'}</span>
                {['1.0x', '1.25x', '1.5x'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold cursor-pointer ${
                      playbackSpeed === s ? 'bg-primary text-white' : 'bg-[#181818] text-muted-foreground'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <VFButton variant="outline" size="sm" onClick={() => setSelectedLecture(null)}>
                  {isHindi ? 'क्लोज़ करें' : 'Close'}
                </VFButton>
                <VFButton
                  size="sm"
                  onClick={() => handleLaunchEClass(`/recording/${selectedLecture.id}`)}
                  className="font-bold"
                  leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  {isHindi ? 'स्टूडियो में चलाएं' : 'Open in Full Studio'}
                </VFButton>
              </div>
            </div>
          }
        >
          <div className="space-y-3.5 text-xs">
            {/* Simulated Video Player Box */}
            <div className="relative aspect-video w-full rounded-[4px] overflow-hidden bg-black border border-border shadow-md flex items-center justify-center">
              <img src={selectedLecture.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex flex-col justify-between p-3 bg-gradient-to-t from-black/90 via-transparent to-black/40">
                <div className="flex justify-between items-center text-[10.5px] font-mono text-white">
                  <span className="font-bold bg-primary/90 px-2 py-0.5 rounded">{selectedLecture.grade}</span>
                  <span>Duration: {selectedLecture.duration}</span>
                </div>
                
                <div className="text-center my-auto">
                  <button
                    onClick={() => handleLaunchEClass(`/recording/${selectedLecture.id}`)}
                    className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer mx-auto"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>
                </div>

                <div className="w-full space-y-1">
                  <div className="w-full bg-zinc-700 rounded-full h-1">
                    <div className="bg-primary h-1 rounded-full w-1/3" />
                  </div>
                  <div className="flex justify-between text-[9.5px] font-mono text-zinc-300">
                    <span>14:20</span>
                    <span>{selectedLecture.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary Notes & Chapter Bookmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* AI Key Insights */}
              <div className="p-3 rounded-[4px] bg-[#141414] border border-border space-y-2">
                <div className="flex items-center gap-1.5 text-primary font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'AI लेक्चर समरी & मुख्य बिंदु' : 'AI Lecture Key Takeaways'}</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-zinc-300 list-disc pl-3.5">
                  {selectedLecture.aiNotes.map((n, i) => (
                    <li key={i} className="leading-relaxed">{n}</li>
                  ))}
                </ul>
              </div>

              {/* Chapters & Timeline */}
              <div className="p-3 rounded-[4px] bg-[#141414] border border-border space-y-2">
                <div className="flex items-center gap-1.5 text-foreground font-bold">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isHindi ? 'चैप्टर बुकमार्क्स' : 'Video Chapter Index'}</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  {selectedLecture.chapters.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-1 rounded hover:bg-[#1e1e1e] transition-colors">
                      <span className="text-zinc-300 truncate">{c.label}</span>
                      <span className="font-mono text-[10px] text-primary font-bold">{c.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </VFDialog>
      )}
    </VFPageContainer>
  );
}
