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
  Sparkles,
  Printer,
  RotateCw,
  QrCode,
  ZoomIn,
  ZoomOut,
  Eye,
  Sliders,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/design-lab')({
  component: DesignLabOverviewPage,
});

type TemplateCategory = 'id-card' | 'marksheet' | 'certificate' | 'admit-card';

interface TemplateItem {
  id: string;
  title: string;
  hindiTitle: string;
  category: TemplateCategory;
  dimensions: string;
  dpi: number;
  orientation: 'Portrait' | 'Landscape';
  compliance: string;
  description: string;
  fieldsCount: number;
  sampleData: Record<string, string>;
  accentColor: string;
}

const TEMPLATE_PRESETS: TemplateItem[] = [
  {
    id: 'TPL-ID-01',
    title: 'Student Biometric PVC Smart Card',
    hindiTitle: 'स्टूडेंट बायोमेट्रिक स्मार्ट PVC आईडी कार्ड',
    category: 'id-card',
    dimensions: '85.6 × 53.98 mm (CR80)',
    dpi: 300,
    orientation: 'Portrait',
    compliance: 'ISO/IEC 7810 Standard',
    description: 'High-durability plastic PVC card layout featuring portrait headshot, RFID chip icon, emergency contact, and barcode.',
    fieldsCount: 12,
    accentColor: '#1d4ed8',
    sampleData: {
      studentName: 'Aarav Sharma',
      admissionNo: 'VF-2026-1042',
      classSec: 'Class 10-A',
      rollNo: '18',
      dob: '14 May 2011',
      bloodGroup: 'O+ Positive',
      guardianPhone: '+91 98765 43210',
      address: 'Sector 42, Green Park, New Delhi',
      validThru: 'March 2027',
      transportRoute: 'Bus Route #04 (Green Park Enclave)',
    },
  },
  {
    id: 'TPL-MS-01',
    title: 'CBSE Secondary Marksheet & Tabulation',
    hindiTitle: 'सीबीएसई सेकेंडरी मार्कशीट एंड टेबुलेशन',
    category: 'marksheet',
    dimensions: '210 × 297 mm (A4)',
    dpi: 300,
    orientation: 'Portrait',
    compliance: 'CBSE / State Board Approved',
    description: 'Bilingual marksheet layout with subject-wise theory & practical breakdown, auto-computed CGPA, and QR validation.',
    fieldsCount: 18,
    accentColor: '#047857',
    sampleData: {
      studentName: 'Priya Patel',
      rollNo: '1029481',
      schoolCode: 'CBSE-9104',
      session: '2026–2027',
      cgpa: '9.6',
      percentage: '96.4%',
      grade: 'A1 (Outstanding)',
    },
  },
  {
    id: 'TPL-CERT-01',
    title: 'Annual Academic & Merit Certificate',
    hindiTitle: 'एनुअल एकेडमिक एंड मेरिट सर्टिफिकेट',
    category: 'certificate',
    dimensions: '297 × 210 mm (A4)',
    dpi: 300,
    orientation: 'Landscape',
    compliance: 'Foil Emboss Compatible',
    description: 'Traditional ornate gold-leaf border with institutional seal, dynamic recipient name callout, and dual signature slots.',
    fieldsCount: 8,
    accentColor: '#b45309',
    sampleData: {
      studentName: 'Sneha Singh',
      grade: 'Class 11-Science',
      achievement: '1st Rank in Inter-School Science & Robotics Olympiad 2026',
      issueDate: '12 September 2026',
      certificateNo: 'VF/MERIT/2026/894',
    },
  },
  {
    id: 'TPL-ADMIT-01',
    title: 'Board Examination Admit Card & Hall Ticket',
    hindiTitle: 'बोर्ड एग्जाम एडमिट कार्ड & हॉल टिकट',
    category: 'admit-card',
    dimensions: '148 × 210 mm (A5)',
    dpi: 300,
    orientation: 'Portrait',
    compliance: 'All India Examination Standard',
    description: 'Secure examination entry pass with candidate photograph, subject datesheet matrix, exam center code, and barcode.',
    fieldsCount: 14,
    accentColor: '#6d28d9',
    sampleData: {
      studentName: 'Rohan Deshmukh',
      candidateId: 'ADM-2026-9812',
      centerCode: 'CTR-DEL-084',
      examHall: 'Main Academic Block – Hall 3',
      examDates: '15 Oct – 28 Oct 2026',
    },
  },
];

const PRINT_QUEUE = [
  {
    batchId: 'BATCH-2026-901',
    template: 'Student Biometric PVC Smart Card',
    target: 'Class 10-A (42 Cards)',
    format: 'PVC Plastic (300 DPI)',
    status: 'Ready to Print',
    progress: 100,
    createdAt: 'Today, 09:30 AM',
  },
  {
    batchId: 'BATCH-2026-902',
    template: 'CBSE Secondary Marksheet',
    target: 'Class 12-Sci (38 Sheets)',
    format: 'Heavyweight Matte Paper',
    status: 'Queued',
    progress: 45,
    createdAt: 'Today, 08:45 AM',
  },
  {
    batchId: 'BATCH-2026-903',
    template: 'Academic Merit Certificate',
    target: 'Sports Meet Winners (15 Sheets)',
    format: 'Gold Foil Border Parchment',
    status: 'Exported PDF',
    progress: 100,
    createdAt: 'Yesterday',
  },
];

function DesignLabOverviewPage() {
  const { addNotification } = useGlobalStore();
  const { lang } = useTranslation();
  const isHindi = lang === 'hi';

  const [activeTemplate, setActiveTemplate] = React.useState<TemplateItem>(TEMPLATE_PRESETS[0]);
  const [zoomLevel, setZoomLevel] = React.useState<number>(100);
  const [isBackSide, setIsBackSide] = React.useState<boolean>(false);
  const [colorTheme, setColorTheme] = React.useState<string>('navy');
  const [selectedForModal, setSelectedForModal] = React.useState<TemplateItem | null>(null);

  const standalonePort = '8015';
  const standaloneUrl = `http://localhost:${standalonePort}`;

  const handleLaunchDesignStudio = (path = '') => {
    const url = `${standaloneUrl}${path}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    addNotification({
      title: isHindi ? 'डिजाइन स्टूडियो ओपन हो रहा है' : 'Opening Design Studio',
      description: isHindi ? 'पोर्ट 8015 पर डॉक्यूमेंट डिज़ाइनर पर रिडायरेक्ट किया जा रहा है।' : 'Redirecting to visual template studio on port 8015.',
      type: 'info',
    });
  };

  const handlePrintSample = () => {
    addNotification({
      title: isHindi ? 'सैंपल PDF तैयार' : 'Sample PDF Spooled',
      description: isHindi
        ? `"${activeTemplate.title}" का 300 DPI सैंपल PDF डाउनलोड के लिए तैयार है।`
        : `High-res 300 DPI vector preview for "${activeTemplate.title}" generated.`,
      type: 'success',
    });
  };

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* ── TOP HEADER & LAUNCHER BAR ── */}
      <VFPageToolbar className="sm:p-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">
              {isHindi ? 'डिजाइन लैब & डॉक्यूमेंट पब्लिशर' : 'Design Lab & Document Publisher'}
            </h1>
            <VFBadge variant="outline" className="text-[10.5px] font-mono font-bold bg-[#1a1a1a] text-zinc-300 border-border/80">
              Port: {standalonePort}
            </VFBadge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            {isHindi
              ? 'स्टूडेंट स्मार्ट PVC आईडी कार्ड्स, CBSE मार्कशीट्स, एडमिट कार्ड्स और मेरिट सर्टिफिकेट्स का विजुअल डिज़ाइन स्टूडियो।'
              : 'Visual document generator for smart biometric PVC ID cards, CBSE report cards, admit cards & merit certificates.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <VFButton
            size="sm"
            variant="outline"
            onClick={handlePrintSample}
            className="rounded-[4px] gap-1.5 text-xs font-bold h-8 cursor-pointer bg-[#141414] hover:border-zinc-700"
          >
            <Printer className="w-3.5 h-3.5 text-foreground" />
            <span>{isHindi ? 'सैंपल टेस्ट प्रिंट' : 'Print Sample'}</span>
          </VFButton>
          <VFButton
            size="sm"
            onClick={() => handleLaunchDesignStudio(`/editor/${activeTemplate.id}`)}
            className="rounded-[4px] gap-1.5 text-xs font-bold h-8 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isHindi ? 'डिजाइन स्टूडियो लॉन्च करें' : 'Open in Studio'}</span>
          </VFButton>
        </div>
      </VFPageToolbar>

      {/* ── TEMPLATE CATEGORY SELECTOR CHIPS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {TEMPLATE_PRESETS.map((tpl) => {
          const isSelected = activeTemplate.id === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => {
                setActiveTemplate(tpl);
                setIsBackSide(false);
              }}
              className={`p-3 rounded-[4px] border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'bg-[#1c1c1c] border-zinc-500 shadow-xs'
                  : 'bg-[#141414] border-border/80 hover:bg-[#181818] hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground px-1.5 py-0.5 bg-[#1e1e1e] rounded-[2px]">
                  {tpl.category}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">{tpl.dimensions.split(' ')[0]}</span>
              </div>
              <p className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-foreground' : 'text-foreground/90'}`}>
                {isHindi ? tpl.hindiTitle : tpl.title}
              </p>
              <span className="text-[10.5px] text-muted-foreground mt-1 font-mono">
                {tpl.fieldsCount} {isHindi ? 'वेरिएबल डेटा फील्ड्स' : 'Merge Fields'}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── MAIN WORKSPACE: LIVE CANVAS (LEFT 65%) + INSPECTOR & PRINT QUEUE (RIGHT 35%) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* ── LEFT: INTERACTIVE LIVE CANVAS PREVIEW (8 cols) ── */}
        <div className="lg:col-span-8 flex flex-col rounded-[4px] border border-border/90 bg-[#0a0a0a] shadow-md overflow-hidden">
          
          {/* Canvas Controls Toolbar */}
          <div className="p-2.5 px-4 bg-[#121212] border-b border-border flex items-center justify-between gap-3 text-xs flex-wrap">
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span className="text-foreground font-bold">{activeTemplate.title}</span>
              <span>·</span>
              <span>{activeTemplate.dimensions}</span>
              <span>·</span>
              <span className="text-emerald-400 font-bold">{activeTemplate.dpi} DPI Vector</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Flip toggle (only for ID Card) */}
              {activeTemplate.category === 'id-card' && (
                <button
                  onClick={() => setIsBackSide(!isBackSide)}
                  className="px-2 py-1 rounded-[3px] bg-[#1a1a1a] hover:bg-[#252525] border border-border text-[11px] font-bold text-foreground flex items-center gap-1 cursor-pointer transition-colors"
                  title="Flip Front/Back"
                >
                  <RotateCw className="w-3 h-3 text-primary" />
                  <span>{isBackSide ? (isHindi ? 'फ्रंट साइड' : 'Front Side') : (isHindi ? 'बैक साइड' : 'Back Side')}</span>
                </button>
              )}

              {/* Zoom controls */}
              <div className="flex items-center bg-[#181818] border border-border rounded-[3px] p-0.5 font-mono text-[11px]">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                  className="px-1.5 py-0.5 hover:bg-[#222] text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="px-2 font-bold text-foreground">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(135, z + 15))}
                  className="px-1.5 py-0.5 hover:bg-[#222] text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>

              {/* Theme palette selector */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-border/80">
                <button
                  onClick={() => setColorTheme('navy')}
                  className={`w-4 h-4 rounded-[3px] bg-blue-700 cursor-pointer border ${colorTheme === 'navy' ? 'border-white ring-1 ring-blue-500' : 'border-transparent'}`}
                  title="Navy Theme"
                />
                <button
                  onClick={() => setColorTheme('emerald')}
                  className={`w-4 h-4 rounded-[3px] bg-emerald-700 cursor-pointer border ${colorTheme === 'emerald' ? 'border-white ring-1 ring-emerald-500' : 'border-transparent'}`}
                  title="Emerald Theme"
                />
                <button
                  onClick={() => setColorTheme('maroon')}
                  className={`w-4 h-4 rounded-[3px] bg-rose-800 cursor-pointer border ${colorTheme === 'maroon' ? 'border-white ring-1 ring-rose-500' : 'border-transparent'}`}
                  title="Maroon Theme"
                />
              </div>
            </div>
          </div>

          {/* Canvas Viewport Area */}
          <div className="p-6 md:p-8 bg-[#0e0e0e] flex items-center justify-center min-h-[460px] overflow-auto select-none">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
              className="transition-transform duration-150"
            >
              {/* ── 1. RENDER: STUDENT SMART PVC ID CARD ── */}
              {activeTemplate.category === 'id-card' && (
                <div className="w-[300px] h-[460px] rounded-[10px] bg-white text-zinc-900 shadow-2xl border border-zinc-300 relative overflow-hidden flex flex-col justify-between font-sans">
                  {!isBackSide ? (
                    /* FRONT SIDE OF ID CARD */
                    <>
                      {/* Institutional Header Banner */}
                      <div className={`p-3 text-white flex items-center gap-2.5 shadow-xs ${
                        colorTheme === 'emerald' ? 'bg-[#064e3b]' : colorTheme === 'maroon' ? 'bg-[#881337]' : 'bg-[#0f2d59]'
                      }`}>
                        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-black text-[10px] text-white">
                          VF
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-black uppercase tracking-wider leading-tight">VIDYAMAXX ACADEMY</p>
                          <p className="text-[8.5px] opacity-85 uppercase font-medium">Affiliated to CBSE · Code 9104</p>
                        </div>
                      </div>

                      {/* Photo & Identity Core */}
                      <div className="p-4 flex flex-col items-center text-center space-y-2.5">
                        <div className="relative">
                          <div className={`w-24 h-30 rounded-[4px] overflow-hidden border-2 shadow-sm ${
                            colorTheme === 'emerald' ? 'border-emerald-600' : colorTheme === 'maroon' ? 'border-rose-600' : 'border-blue-600'
                          }`}>
                            <img
                              src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80"
                              alt="Student"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Holographic Chip Badge */}
                          <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded-[2px] bg-amber-400 text-zinc-950 font-mono text-[8px] font-black shadow-xs border border-amber-500">
                            RFID
                          </div>
                        </div>

                        <div>
                          <h2 className="text-sm font-extrabold text-zinc-900 tracking-tight leading-tight">
                            {activeTemplate.sampleData.studentName}
                          </h2>
                          <p className="text-[11px] font-bold text-blue-700 mt-0.5">
                            {activeTemplate.sampleData.classSec} · Roll #{activeTemplate.sampleData.rollNo}
                          </p>
                          <p className="text-[9.5px] font-mono text-zinc-500 mt-0.5">
                            ID: {activeTemplate.sampleData.admissionNo}
                          </p>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-1 text-[10px] text-left pt-2 border-t border-zinc-200">
                          <div>
                            <span className="text-zinc-500 text-[9px] block">BLOOD GROUP</span>
                            <span className="font-bold text-zinc-800">{activeTemplate.sampleData.bloodGroup}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 text-[9px] block">VALID THRU</span>
                            <span className="font-bold text-zinc-800">{activeTemplate.sampleData.validThru}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Barcode Strip */}
                      <div className="p-2.5 bg-zinc-100 border-t border-zinc-200 flex flex-col items-center justify-center">
                        <div className="w-48 h-6 bg-zinc-900 flex items-center justify-center text-[9px] font-mono tracking-[4px] text-white">
                          ||||||| | |||| ||| |||| |
                        </div>
                        <span className="text-[8px] font-mono text-zinc-500 mt-0.5">EMERGENCY: {activeTemplate.sampleData.guardianPhone}</span>
                      </div>
                    </>
                  ) : (
                    /* BACK SIDE OF ID CARD */
                    <div className="p-4 flex flex-col justify-between h-full bg-zinc-50 text-zinc-800 text-[10px]">
                      <div>
                        <p className="font-extrabold text-xs text-zinc-900 mb-1">STUDENT LOGISTICS & RESIDENCE</p>
                        <p className="text-zinc-600 text-[10px] leading-relaxed">
                          <strong className="text-zinc-800">Address:</strong> {activeTemplate.sampleData.address}
                        </p>
                        <p className="text-zinc-600 text-[10px] mt-1.5">
                          <strong className="text-zinc-800">Transport:</strong> {activeTemplate.sampleData.transportRoute}
                        </p>
                      </div>

                      <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[9px] text-amber-900 leading-tight">
                        <strong>Terms:</strong> This identity credential remains institutional property. If found, return to VidyaMaxx Academy, Sector 42 Campus.
                      </div>

                      <div className="flex items-end justify-between pt-2 border-t border-zinc-300">
                        <div className="w-12 h-12 bg-white p-1 rounded border border-zinc-200 flex items-center justify-center">
                          <QrCode className="w-9 h-9 text-zinc-800" />
                        </div>
                        <div className="text-right">
                          <div className="w-20 border-b border-zinc-800 pb-1 mb-0.5 text-center font-serif text-[10px] italic text-zinc-800">
                            Dr. S. K. Mehta
                          </div>
                          <span className="text-[8px] font-bold text-zinc-500 uppercase">Authorized Principal</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── 2. RENDER: CBSE SECONDARY MARKSHEET PREVIEW ── */}
              {activeTemplate.category === 'marksheet' && (
                <div className="w-[340px] h-[480px] rounded-[4px] bg-[#fbfbfa] text-zinc-900 shadow-2xl border border-zinc-300 p-4 flex flex-col justify-between font-sans text-xs">
                  <div>
                    {/* Marksheet Header */}
                    <div className="text-center pb-2 border-b border-zinc-400">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900">CENTRAL BOARD OF SECONDARY EDUCATION</p>
                      <h2 className="text-xs font-extrabold uppercase mt-0.5">SECONDARY SCHOOL EXAMINATION 2026</h2>
                      <p className="text-[9px] text-zinc-600">MARKS STATEMENT & CUMULATIVE GRADE REPORT</p>
                    </div>

                    {/* Candidate Metadata */}
                    <div className="grid grid-cols-2 gap-1 text-[9.5px] py-2 border-b border-zinc-300">
                      <p><strong>Candidate:</strong> {activeTemplate.sampleData.studentName}</p>
                      <p><strong>Roll No:</strong> {activeTemplate.sampleData.rollNo}</p>
                      <p><strong>School Code:</strong> {activeTemplate.sampleData.schoolCode}</p>
                      <p><strong>Session:</strong> {activeTemplate.sampleData.session}</p>
                    </div>

                    {/* Marks Table */}
                    <table className="w-full text-[9px] mt-2 border border-zinc-400 text-left">
                      <thead>
                        <tr className="bg-zinc-200 font-bold border-b border-zinc-400">
                          <th className="p-1">Subject</th>
                          <th className="p-1 text-center">Theory</th>
                          <th className="p-1 text-center">Practical</th>
                          <th className="p-1 text-center">Total</th>
                          <th className="p-1 text-right">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 font-mono">
                        <tr><td className="p-1 font-sans">English Core</td><td className="text-center">78</td><td className="text-center">19</td><td className="text-center font-bold">97</td><td className="text-right font-bold text-emerald-700">A1</td></tr>
                        <tr><td className="p-1 font-sans">Mathematics</td><td className="text-center">76</td><td className="text-center">20</td><td className="text-center font-bold">96</td><td className="text-right font-bold text-emerald-700">A1</td></tr>
                        <tr><td className="p-1 font-sans">Science & Tech</td><td className="text-center">77</td><td className="text-center">19</td><td className="text-center font-bold">96</td><td className="text-right font-bold text-emerald-700">A1</td></tr>
                        <tr><td className="p-1 font-sans">Social Science</td><td className="text-center">75</td><td className="text-center">20</td><td className="text-center font-bold">95</td><td className="text-right font-bold text-emerald-700">A1</td></tr>
                        <tr><td className="p-1 font-sans">Hindi Course-A</td><td className="text-center">78</td><td className="text-center">20</td><td className="text-center font-bold">98</td><td className="text-right font-bold text-emerald-700">A1</td></tr>
                      </tbody>
                    </table>

                    {/* Score Summary */}
                    <div className="mt-2 p-2 rounded bg-emerald-50 border border-emerald-200 flex justify-between text-[10px] font-bold">
                      <span>TOTAL: 482 / 500 ({activeTemplate.sampleData.percentage})</span>
                      <span className="text-emerald-800 font-mono font-black">CGPA: {activeTemplate.sampleData.cgpa}</span>
                    </div>
                  </div>

                  {/* Marksheet Footer Seal */}
                  <div className="flex items-end justify-between pt-2 border-t border-zinc-400 text-[9px]">
                    <div className="flex items-center gap-1.5">
                      <QrCode className="w-8 h-8 text-zinc-900" />
                      <span className="text-[8px] font-mono text-zinc-500">QR Validated<br/>Govt Server</span>
                    </div>
                    <div className="text-center">
                      <div className="w-16 border-b border-zinc-800 pb-0.5 text-[9px] font-serif italic">Verified</div>
                      <span className="text-[8px] font-bold text-zinc-600">Controller of Exams</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 3. RENDER: ACADEMIC MERIT CERTIFICATE PREVIEW ── */}
              {activeTemplate.category === 'certificate' && (
                <div className="w-[460px] h-[310px] rounded-[4px] bg-[#fffdfa] text-zinc-900 shadow-2xl border-4 border-amber-600/80 p-5 flex flex-col justify-between font-serif relative overflow-hidden">
                  <div className="absolute inset-1 border border-amber-500/50 pointer-events-none" />
                  
                  <div className="text-center relative z-1">
                    <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-800">VIDYAMAXX ACADEMIC FOUNDATION</p>
                    <h2 className="text-lg font-black tracking-wide text-zinc-900 mt-1 uppercase font-serif">Certificate of Excellence</h2>
                    <p className="text-[9px] font-sans text-zinc-500 tracking-wider uppercase mt-0.5">THIS RECOGNITION IS PROUDLY CONFERRED UPON</p>
                  </div>

                  <div className="text-center my-auto py-2 relative z-1">
                    <h3 className="text-base font-extrabold text-amber-900 font-serif border-b border-amber-300 pb-1 inline-block px-4">
                      {activeTemplate.sampleData.studentName}
                    </h3>
                    <p className="text-[10px] font-sans text-zinc-700 mt-1">
                      of <strong>{activeTemplate.sampleData.grade}</strong> for outstanding performance in
                    </p>
                    <p className="text-[10.5px] font-sans font-semibold text-zinc-900 italic mt-0.5">
                      "{activeTemplate.sampleData.achievement}"
                    </p>
                  </div>

                  <div className="flex items-end justify-between pt-2 border-t border-amber-300 text-[9px] font-sans relative z-1">
                    <div>
                      <span className="text-[8px] font-mono text-zinc-500 block">NO: {activeTemplate.sampleData.certificateNo}</span>
                      <span className="font-bold text-zinc-700">DATE: {activeTemplate.sampleData.issueDate}</span>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-600 flex items-center justify-center text-amber-800 font-bold text-[8px]">
                      SEAL
                    </div>

                    <div className="text-center">
                      <div className="w-20 border-b border-zinc-700 pb-0.5 font-serif italic text-[10px]">Dr. S. K. Mehta</div>
                      <span className="text-[8px] font-bold text-zinc-600 uppercase">Head of Campus</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 4. RENDER: ADMIT CARD PREVIEW ── */}
              {activeTemplate.category === 'admit-card' && (
                <div className="w-[320px] h-[460px] rounded-[4px] bg-white text-zinc-900 shadow-2xl border border-zinc-300 p-3.5 flex flex-col justify-between font-sans text-xs">
                  <div>
                    <div className="text-center pb-2 border-b border-zinc-300">
                      <p className="text-[10px] font-black uppercase text-purple-900 tracking-wider">ANNUAL BOARD EXAMINATION 2026</p>
                      <h2 className="text-xs font-extrabold uppercase">OFFICIAL ADMIT CARD & HALL TICKET</h2>
                    </div>

                    <div className="flex gap-2.5 py-2.5 border-b border-zinc-200">
                      <div className="w-16 h-20 rounded bg-zinc-200 border border-zinc-300 overflow-hidden shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80"
                          alt="Candidate"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 text-[10px] space-y-0.5">
                        <p><strong>Candidate:</strong> {activeTemplate.sampleData.studentName}</p>
                        <p><strong>Roll No:</strong> {activeTemplate.sampleData.candidateId}</p>
                        <p><strong>Center:</strong> {activeTemplate.sampleData.centerCode}</p>
                        <p><strong>Room:</strong> {activeTemplate.sampleData.examHall}</p>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="mt-2 text-[9px]">
                      <p className="font-bold text-zinc-700 uppercase mb-1">Schedule & Subject Breakdown</p>
                      <div className="space-y-1 font-mono">
                        <div className="p-1 bg-zinc-100 rounded flex justify-between"><span>15 Oct · 09:30 AM</span><span className="font-bold">Mathematics (041)</span></div>
                        <div className="p-1 bg-zinc-100 rounded flex justify-between"><span>18 Oct · 09:30 AM</span><span className="font-bold">Physics (042)</span></div>
                        <div className="p-1 bg-zinc-100 rounded flex justify-between"><span>22 Oct · 09:30 AM</span><span className="font-bold">Chemistry (043)</span></div>
                        <div className="p-1 bg-zinc-100 rounded flex justify-between"><span>26 Oct · 09:30 AM</span><span className="font-bold">English Core (301)</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-300">
                    <div className="w-32 h-5 bg-zinc-900 flex items-center justify-center text-[8px] font-mono text-white tracking-[3px]">
                      ||| ||||| || |||| ||
                    </div>
                    <div className="text-center text-[8px] font-bold text-zinc-500">
                      <div className="w-14 border-b border-zinc-600 mb-0.5" />
                      INVIGILATOR
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: INSPECTOR & PRINT QUEUE SPOOLER (4 cols) ── */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Template Inspector Card */}
          <VFCard
            title={
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  {isHindi ? 'टेम्पलेट स्पेसिफिकेशन' : 'Template Specifications'}
                </span>
              </div>
            }
            className="rounded-[4px] border-border/90 bg-[#0d0d0d]"
            headerClassName="py-2.5 px-3.5"
            bodyClassName="p-3.5 space-y-3"
          >
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">{isHindi ? 'फॉर्मेट / मानक:' : 'Standard Compliance:'}</span>
                <span className="font-semibold text-foreground">{activeTemplate.compliance}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">{isHindi ? 'डाइमेंशन्स:' : 'Canvas Size:'}</span>
                <span className="font-mono text-foreground">{activeTemplate.dimensions}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">{isHindi ? 'प्रिंट रेजोल्यूशन:' : 'Print Resolution:'}</span>
                <span className="font-mono font-bold text-emerald-400">{activeTemplate.dpi} DPI (Vector CMYK)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">{isHindi ? 'वेरिएबल डेटा टैग्स:' : 'Variable Tags:'}</span>
                <span className="font-mono font-bold text-primary">{activeTemplate.fieldsCount} Dynamic Tags</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex gap-2">
              <VFButton
                size="sm"
                variant="outline"
                onClick={() => setSelectedForModal(activeTemplate)}
                className="w-full text-xs font-bold h-8 rounded-[4px] cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                <span>{isHindi ? 'डिटेल्स देखें' : 'View Variables'}</span>
              </VFButton>
              <VFButton
                size="sm"
                onClick={() => handleLaunchDesignStudio(`/editor/${activeTemplate.id}`)}
                className="w-full text-xs font-bold h-8 rounded-[4px] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                <span>{isHindi ? 'एडिट करें' : 'Visual Edit'}</span>
              </VFButton>
            </div>
          </VFCard>

          {/* Batch Print Spooler Queue */}
          <VFCard
            title={
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-foreground">
                  {isHindi ? 'बैच प्रिंटिंग स्पूलर' : 'Batch Print Spooler'}
                </span>
              </div>
            }
            className="rounded-[4px] border-border/90 bg-[#0d0d0d]"
            headerClassName="py-2.5 px-3.5"
            bodyClassName="p-0"
          >
            <div className="divide-y divide-border/60 text-xs">
              {PRINT_QUEUE.map((job) => (
                <div key={job.batchId} className="p-3 space-y-1.5 hover:bg-[#121212] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-primary text-[11px]">{job.batchId}</span>
                    <VFBadge
                      variant={job.status === 'Ready to Print' ? 'success' : job.status === 'Queued' ? 'warning' : 'primary'}
                      className="text-[9.5px]"
                    >
                      {job.status}
                    </VFBadge>
                  </div>
                  <p className="font-bold text-foreground text-[11.5px] truncate">{job.template}</p>
                  <p className="text-muted-foreground text-[10.5px]">{job.target} · {job.format}</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-[#1e1e1e] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${job.progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </VFCard>

        </div>
      </div>

      {/* ── DETAIL MODAL ── */}
      {selectedForModal && (
        <VFDialog
          isOpen={Boolean(selectedForModal)}
          onClose={() => setSelectedForModal(null)}
          title={isHindi ? selectedForModal.hindiTitle : selectedForModal.title}
          description={`${selectedForModal.category.toUpperCase()} · ${selectedForModal.dimensions} · ${selectedForModal.dpi} DPI`}
          footerActions={
            <div className="flex items-center justify-end gap-2 w-full">
              <VFButton variant="outline" size="sm" onClick={() => setSelectedForModal(null)}>
                {isHindi ? 'क्लोज़ करें' : 'Close'}
              </VFButton>
              <VFButton
                size="sm"
                onClick={() => {
                  setSelectedForModal(null);
                  handleLaunchDesignStudio(`/editor/${selectedForModal.id}`);
                }}
                className="font-bold"
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                {isHindi ? 'डिजाइन स्टूडियो में खोलें' : 'Open in Studio'}
              </VFButton>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-[4px] bg-[#141414] border border-border space-y-1.5">
              <p className="text-muted-foreground text-[11px]">{selectedForModal.description}</p>
            </div>

            <div>
              <p className="font-bold text-foreground mb-1.5">{isHindi ? 'उपलब्ध डायनामिक डेटा फील्ड्स:' : 'Sample Variable Bindings:'}</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(selectedForModal.sampleData).map(([k, v]) => (
                  <div key={k} className="p-2 rounded bg-[#111] border border-border/80">
                    <span className="font-mono text-[9.5px] text-primary block">{`{{${k}}}`}</span>
                    <span className="text-foreground text-[11px] font-medium truncate block">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </VFDialog>
      )}
    </VFPageContainer>
  );
}
