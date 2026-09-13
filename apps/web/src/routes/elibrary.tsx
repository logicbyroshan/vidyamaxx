import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFPageToolbar,
  VFButton,
  VFBadge,
  VFCard,
  VFDialog,
} from '@vidyamaxx/ui';
import {
  ExternalLink,
  BookOpen,
  BookMarked,
  QrCode,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/elibrary')({
  component: ELibraryOverviewPage,
});

interface DigitalBook {
  id: string;
  title: string;
  hindiTitle: string;
  subject: string;
  grade: string;
  publisher: string;
  pages: number;
  coverColor: string;
  accentColor: string;
  dikshaQr: string;
  author: string;
  edition: string;
  description: string;
  sampleChapterTitle: string;
  sampleChapterText: string[];
}

const NCERT_BOOKSHELF: DigitalBook[] = [
  {
    id: 'BK-NCERT-M10',
    title: 'NCERT Mathematics – Class 10',
    hindiTitle: 'NCERT गणित – क्लास 10 (मुख्य पाठ्यपुस्तक)',
    subject: 'Mathematics',
    grade: 'Class 10',
    publisher: 'NCERT New Delhi',
    pages: 328,
    coverColor: '#1e3a8a',
    accentColor: '#3b82f6',
    dikshaQr: 'DIKSHA-NCERT-M10',
    author: 'National Council of Educational Research & Training',
    edition: 'National Curriculum Framework 2026 Edition',
    description: 'Standard prescribed textbook covering Real Numbers, Polynomials, Quadratic Equations, Triangles, Trigonometry, and Statistics.',
    sampleChapterTitle: 'Chapter 8: Introduction to Trigonometry',
    sampleChapterText: [
      'In this chapter, we will study some ratios of the sides of a right triangle with respect to its acute angles, called trigonometric ratios of the angle.',
      'Consider a right triangle ABC, right-angled at B. The position of side BC with respect to angle A is side opposite to angle A. AC is the hypotenuse.',
      'sin A = (Side opposite to angle A) / Hypotenuse = BC / AC.',
      'cos A = (Side adjacent to angle A) / Hypotenuse = AB / AC.',
      'tan A = (Side opposite to angle A) / (Side adjacent to angle A) = BC / AB.',
    ],
  },
  {
    id: 'BK-NCERT-S10',
    title: 'NCERT Science & Technology – Class 10',
    hindiTitle: 'NCERT विज्ञान एवं प्रौद्योगिकी – क्लास 10',
    subject: 'Science',
    grade: 'Class 10',
    publisher: 'NCERT New Delhi',
    pages: 284,
    coverColor: '#065f46',
    accentColor: '#10b981',
    dikshaQr: 'DIKSHA-NCERT-S10',
    author: 'NCERT Science Textbook Development Committee',
    edition: 'Rationalized NCERT 2026',
    description: 'Foundational concepts of Chemical Reactions, Acids & Bases, Carbon Compounds, Life Processes, and Light Optics.',
    sampleChapterTitle: 'Chapter 6: Life Processes — Nutrition & Respiration',
    sampleChapterText: [
      'All living things perform certain basic functions to maintain life. These maintenance processes are needed to prevent damage and break-down.',
      'Since these maintenance processes are needed to prevent damage and break-down, energy is needed for them. This energy comes from outside the body of the individual organism.',
      'Photosynthesis Equation: 6CO₂ + 12H₂O + Sunlight + Chlorophyll → C₆H₁₂O₆ + 6O₂ + 6H₂O.',
    ],
  },
  {
    id: 'BK-NCERT-P12',
    title: 'NCERT Physics Part I & II – Class 12',
    hindiTitle: 'NCERT भौतिक विज्ञान भाग 1 & 2 – क्लास 12',
    subject: 'Physics',
    grade: 'Class 12',
    publisher: 'NCERT New Delhi',
    pages: 412,
    coverColor: '#7c2d12',
    accentColor: '#f97316',
    dikshaQr: 'DIKSHA-NCERT-P12',
    author: 'Department of Education in Science & Mathematics',
    edition: 'CBSE Prescribed 2026',
    description: 'Electrostatics, Current Electricity, Magnetism, Electromagnetic Waves, Ray Optics, and Semiconductor Electronics.',
    sampleChapterTitle: 'Chapter 3: Current Electricity & Kirchhoff’s Rules',
    sampleChapterText: [
      'Electric current is defined as the rate of flow of electric charges through a given cross-sectional area of a conductor.',
      'Ohm’s Law states that at constant temperature, the current flowing through a conductor is directly proportional to the potential difference across its ends: V = IR.',
      'Kirchhoff’s Junction Rule: At any junction, the sum of currents entering the junction is equal to the sum of currents leaving the junction (Conservation of Charge).',
    ],
  },
  {
    id: 'BK-NCERT-H10',
    title: 'Kshitij Bhag 2 (Hindi Literature) – Class 10',
    hindiTitle: 'क्षितिज भाग-२ (हिंदी मुख्य पाठ्यपुस्तक) – क्लास 10',
    subject: 'Hindi',
    grade: 'Class 10',
    publisher: 'NCERT New Delhi',
    pages: 196,
    coverColor: '#581c87',
    accentColor: '#a855f7',
    dikshaQr: 'DIKSHA-NCERT-H10',
    author: 'NCERT Hindi Editorial Board',
    edition: 'CBSE Course-A Approved',
    description: 'Hindi prose and poetry anthology featuring works of Surdas, Tulsidas, Jayashankar Prasad, and Yashpal.',
    sampleChapterTitle: 'अध्याय 1: पद – सूरदास (भ्रमरगीत से)',
    sampleChapterText: [
      'ऊधौ, तुम हौ अति बड़भागी। अपरस रहत सनेह तगा तैं, नाहिन मन अनुरागी।',
      'पुरइनि पात रहत जल भीतर, ता रस देह न दागी। ज्यौं जल माहँ तेल की गागरि, बूँद न ताकौं लागी।',
      'सूरदास अबला हम भोरी, गुर चाँटी ज्यौं पागी॥',
      'भावार्थ: गोपियां उद्धव पर व्यंग्य करते हुए कहती हैं कि हे उद्धव! तुम बहुत भाग्यशाली हो जो श्रीकृष्ण के निकट रहकर भी उनके प्रेम के बंधन से मुक्त रहे।',
    ],
  },
];

const DIGITAL_CIRCULATION = [
  {
    loanId: 'LN-2026-801',
    student: 'Aarav Sharma (Class 10-A)',
    bookTitle: 'NCERT Mathematics – Class 10',
    borrowedDate: '08 Sep 2026',
    dueInDays: 6,
    progress: 72,
  },
  {
    loanId: 'LN-2026-802',
    student: 'Priya Patel (Class 12-Sci)',
    bookTitle: 'NCERT Physics Part I – Class 12',
    borrowedDate: '05 Sep 2026',
    dueInDays: 3,
    progress: 45,
  },
  {
    loanId: 'LN-2026-803',
    student: 'Sneha Singh (Class 11-A)',
    bookTitle: 'Kshitij Bhag 2 – Class 10',
    borrowedDate: '10 Sep 2026',
    dueInDays: 12,
    progress: 90,
  },
];

function ELibraryOverviewPage() {
  const { addNotification } = useGlobalStore();
  const { lang } = useTranslation();
  const isHindi = lang === 'hi';

  const [selectedGrade, setSelectedGrade] = React.useState<string>('All');
  const [activeBookForReader, setActiveBookForReader] = React.useState<DigitalBook | null>(null);
  const [readerTheme, setReaderTheme] = React.useState<'dark' | 'sepia' | 'light'>('dark');
  const [currentPage, setCurrentPage] = React.useState<number>(42);

  const standalonePort = '8011';
  const standaloneUrl = `http://localhost:${standalonePort}`;

  const handleLaunchELibrary = (path = '') => {
    const url = `${standaloneUrl}${path}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    addNotification({
      title: isHindi ? 'ई-लाइब्रेरी पोर्टल ओपन हो रहा है' : 'Opening E-Library Portal',
      description: isHindi ? 'पोर्ट 8011 पर डिजिटल बुक रीडर पर रिडायरेक्ट किया जा रहा है।' : 'Redirecting to digital book repository on port 8011.',
      type: 'info',
    });
  };

  const filteredBooks = selectedGrade === 'All'
    ? NCERT_BOOKSHELF
    : NCERT_BOOKSHELF.filter((b) => b.grade.includes(selectedGrade));

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* ── TOP HEADER & LAUNCH BAR ── */}
      <VFPageToolbar className="sm:p-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">
              {isHindi ? 'ई-लाइब्रेरी & NCERT डिजिटल रिपोजिटरी' : 'E-Library & NCERT Digital Repository'}
            </h1>
            <VFBadge variant="outline" className="text-[10.5px] font-mono font-bold bg-[#1a1a1a] text-purple-400 border-purple-500/30">
              DIKSHA Integrated · Port: {standalonePort}
            </VFBadge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            {isHindi
              ? 'कक्षा 6 से 12 की आधिकारिक NCERT डिजिटल पाठ्यपुस्तकें, इंटरएक्टिव बुक रीडर और डिजिटल सर्कुलेशन लेजर।'
              : 'Official NCERT digital textbooks for classes 6–12, interactive in-browser book reader & borrowing circulation ledger.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <VFButton
            size="sm"
            variant="outline"
            onClick={() => setActiveBookForReader(NCERT_BOOKSHELF[0])}
            className="rounded-[4px] gap-1.5 text-xs font-bold h-8 cursor-pointer bg-[#141414] hover:border-zinc-700"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>{isHindi ? 'रीडर लॉन्च करें' : 'Launch In-App Reader'}</span>
          </VFButton>
          <VFButton
            size="sm"
            onClick={() => handleLaunchELibrary()}
            className="rounded-[4px] gap-1.5 text-xs font-bold h-8 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isHindi ? 'ई-लाइब्रेरी पोर्टल खोलें' : 'Open E-Library'}</span>
          </VFButton>
        </div>
      </VFPageToolbar>

      {/* ── GRADE FILTER TABS ── */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border/80 pb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {['All', 'Class 10', 'Class 12', 'Class 11'].map((grd) => (
            <button
              key={grd}
              onClick={() => setSelectedGrade(grd)}
              className={`px-3 py-1 rounded-[3px] text-xs font-bold transition-all cursor-pointer ${
                selectedGrade === grd
                  ? 'bg-[#242424] text-foreground font-bold shadow-xs border border-border/80'
                  : 'bg-[#141414] text-muted-foreground font-semibold hover:text-foreground hover:bg-[#1a1a1a] border border-border/60'
              }`}
            >
              {grd}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-muted-foreground">
          {filteredBooks.length} {isHindi ? 'डिजिटल बुक्स उपलब्ध' : 'Textbooks Available'}
        </span>
      </div>

      {/* ── MAIN WORKSPACE: BOOKSHELF (LEFT 70%) + ACTIVE CIRCULATION (RIGHT 30%) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* ── LEFT: 3D BOOKSHELF & NCERT REPOSITORY (8 cols) ── */}
        <div className="lg:col-span-8 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="rounded-[4px] border border-border/80 bg-[#121212] hover:bg-[#161616] hover:border-zinc-700 transition-all p-3.5 flex gap-3.5 group shadow-xs cursor-pointer"
                onClick={() => setActiveBookForReader(book)}
              >
                {/* Visual Book Spine / Cover Mockup */}
                <div
                  style={{ backgroundColor: book.coverColor }}
                  className="w-24 h-32 rounded-[3px] shadow-md shrink-0 flex flex-col justify-between p-2 text-white border-l-4 border-white/20 relative overflow-hidden group-hover:scale-105 transition-transform"
                >
                  <div className="space-y-0.5">
                    <span className="text-[7.5px] font-mono font-bold uppercase tracking-widest bg-black/40 px-1 py-0.2 rounded">
                      NCERT
                    </span>
                    <p className="text-[9.5px] font-black leading-tight line-clamp-3 mt-1">
                      {book.title.split('–')[0]}
                    </p>
                  </div>

                  <div className="pt-1 border-t border-white/20 flex items-center justify-between text-[7px] font-mono opacity-85">
                    <span>{book.grade}</span>
                    <span>{book.pages}p</span>
                  </div>
                </div>

                {/* Book Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                        {book.subject}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                        <QrCode className="w-2.5 h-2.5 text-zinc-400" />
                        DIKSHA
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-foreground line-clamp-2 leading-tight">
                      {isHindi ? book.hindiTitle : book.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {book.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10.5px]">
                    <span className="font-mono text-muted-foreground">{book.edition.split(' ')[0]}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveBookForReader(book);
                      }}
                      className="text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isHindi ? 'पढ़ें ↗' : 'Read ↗'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: DIGITAL CIRCULATION & BORROWING LEDGER (4 cols) ── */}
        <div className="lg:col-span-4 space-y-4">
          <VFCard
            title={
              <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  {isHindi ? 'सक्रिय डिजिटल इश्यू लेजर' : 'Active Digital Loans'}
                </span>
              </div>
            }
            description={isHindi ? 'विद्यार्थियों द्वारा वर्तमान में पढ़ी जा रही बुक्स' : 'Issued e-books & active reading progress'}
            className="rounded-[4px] border-border/90 bg-[#0d0d0d]"
            headerClassName="py-2.5 px-3.5"
            bodyClassName="p-0"
          >
            <div className="divide-y divide-border/60 text-xs">
              {DIGITAL_CIRCULATION.map((loan) => (
                <div key={loan.loanId} className="p-3 space-y-1.5 hover:bg-[#121212] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-foreground text-[11px] truncate max-w-[170px]">
                      {loan.student}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded">
                      Due in {loan.dueInDays}d
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px] truncate">{loan.bookTitle}</p>
                  
                  {/* Reading Progress Bar */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[9.5px] font-mono text-muted-foreground">
                      <span>Reading Progress</span>
                      <span className="text-primary font-bold">{loan.progress}%</span>
                    </div>
                    <div className="w-full bg-[#1e1e1e] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${loan.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 border-t border-border/80 bg-[#101010]">
              <button
                onClick={() => handleLaunchELibrary('/circulation')}
                className="w-full py-1.5 rounded-[3px] bg-[#1a1a1a] hover:bg-[#222] border border-border text-center text-xs font-bold text-primary transition-colors cursor-pointer"
              >
                {isHindi ? 'पूरा सर्कुलेशन लेजर देखें ↗' : 'View Full Circulation Ledger ↗'}
              </button>
            </div>
          </VFCard>
        </div>
      </div>

      {/* ── IN-APP DIGITAL BOOK READER MODAL ── */}
      {activeBookForReader && (
        <VFDialog
          isOpen={Boolean(activeBookForReader)}
          onClose={() => setActiveBookForReader(null)}
          title={isHindi ? activeBookForReader.hindiTitle : activeBookForReader.title}
          description={`${activeBookForReader.grade} · ${activeBookForReader.publisher} · ${activeBookForReader.pages} Pages`}
          className="max-w-4xl"
          footerActions={
            <div className="flex items-center justify-between w-full flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="px-2.5 py-1 rounded bg-[#1c1c1c] hover:bg-[#252525] border border-border text-xs font-bold text-foreground flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <span className="font-mono text-xs font-bold text-foreground">
                  Page {currentPage} of {activeBookForReader.pages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(activeBookForReader.pages, p + 1))}
                  disabled={currentPage >= activeBookForReader.pages}
                  className="px-2.5 py-1 rounded bg-[#1c1c1c] hover:bg-[#252525] border border-border text-xs font-bold text-foreground flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <VFButton variant="outline" size="sm" onClick={() => setActiveBookForReader(null)}>
                  {isHindi ? 'क्लोज़ करें' : 'Close'}
                </VFButton>
                <VFButton
                  size="sm"
                  onClick={() => handleLaunchELibrary(`/reader/${activeBookForReader.id}`)}
                  className="font-bold"
                  leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  {isHindi ? 'फुल स्क्रीन रीडर खोलें' : 'Open in Fullscreen Reader'}
                </VFButton>
              </div>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            {/* Reader Top Toolbar */}
            <div className="p-2 px-3 rounded-[3px] bg-[#141414] border border-border flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-mono">Theme:</span>
                <button
                  onClick={() => setReaderTheme('dark')}
                  className={`px-2 py-0.5 rounded text-[10.5px] font-mono font-bold flex items-center gap-1 cursor-pointer ${
                    readerTheme === 'dark' ? 'bg-zinc-800 text-white border border-zinc-600' : 'text-muted-foreground'
                  }`}
                >
                  <Moon className="w-3 h-3" /> Dark
                </button>
                <button
                  onClick={() => setReaderTheme('sepia')}
                  className={`px-2 py-0.5 rounded text-[10.5px] font-mono font-bold flex items-center gap-1 cursor-pointer ${
                    readerTheme === 'sepia' ? 'bg-[#704214] text-amber-100 border border-amber-500' : 'text-muted-foreground'
                  }`}
                >
                  <Coffee className="w-3 h-3" /> Sepia
                </button>
                <button
                  onClick={() => setReaderTheme('light')}
                  className={`px-2 py-0.5 rounded text-[10.5px] font-mono font-bold flex items-center gap-1 cursor-pointer ${
                    readerTheme === 'light' ? 'bg-zinc-200 text-zinc-900 border border-zinc-400' : 'text-muted-foreground'
                  }`}
                >
                  <Sun className="w-3 h-3" /> Light
                </button>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10.5px]">
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> DIKSHA Verified
                </span>
              </div>
            </div>

            {/* Book Content Page Spread Mockup */}
            <div className={`p-6 sm:p-8 rounded-[4px] border shadow-inner transition-colors duration-150 font-serif leading-relaxed min-h-[300px] ${
              readerTheme === 'dark'
                ? 'bg-[#0f0f0f] border-zinc-800 text-zinc-200'
                : readerTheme === 'sepia'
                ? 'bg-[#fbf0d9] border-[#e2d5ba] text-[#43302b]'
                : 'bg-white border-zinc-300 text-zinc-900'
            }`}>
              <div className="border-b pb-2 mb-4 flex justify-between items-center text-[10px] font-sans opacity-70 border-current">
                <span>{activeBookForReader.title}</span>
                <span>Page {currentPage}</span>
              </div>

              <h2 className="text-base font-extrabold mb-3 tracking-tight font-sans">
                {activeBookForReader.sampleChapterTitle}
              </h2>

              <div className="space-y-3 text-xs sm:text-[13px]">
                {activeBookForReader.sampleChapterText.map((para, i) => (
                  <p key={i} className="leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </VFDialog>
      )}
    </VFPageContainer>
  );
}
