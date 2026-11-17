import * as React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
  Users,
  Sparkles,
  ChevronRight,
  Building2,
  Award,
  School,
  ExternalLink,
  Laptop,
  Smartphone,
  Globe,
  Layers,
  CalendarCheck,
  Clock,
  Menu,
  X,
  Check,
} from 'lucide-react';

const TRUSTED_INSTITUTIONS = [
  { name: 'Delhi Public School', short: 'DPS', icon: Award },
  { name: 'Springdales School', short: 'SPRD', icon: School },
  { name: 'The Heritage School', short: 'HERITAGE', icon: Building2 },
  { name: 'St. Xavier High School', short: 'ST. XAVIER', icon: Award },
  { name: 'Ryan International', short: 'RYAN', icon: School },
  { name: 'Kendriya Vidyalaya', short: 'KVS', icon: Building2 },
  { name: 'Modern School', short: 'MODERN', icon: Award },
  { name: 'Amity International', short: 'AMITY', icon: School },
  { name: 'Bal Bharati Public', short: 'BBPS', icon: Building2 },
  { name: 'The Doon School', short: 'DOON', icon: Award },
  { name: 'Mayo College', short: 'MAYO', icon: School },
  { name: 'Sanskriti School', short: 'SANSKRITI', icon: Building2 },
];

export default function LandingApp() {
  const [activeTab, setActiveTab] = React.useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const WEB_APP_URL = 'http://localhost:3000';
  const LOGIN_URL = 'http://localhost:3000/login';

  const capabilities = [
    {
      id: 'timetable',
      title: 'Smart 7-Day Timetables & Auto-Proxy',
      badge: 'Academic Core',
      icon: Calendar,
      description:
        'AI-driven conflict-free schedule optimizer with real-time faculty absence tracking, instant proxy substitute assignment, and 7-day vibrant department color coding.',
      highlights: [
        'Automatic faculty proxy reassignment upon leave punch',
        'Lab room collision detection & double-period management',
        'Direct export to high-res PDF and Excel roster sheets',
        'Zero-period remedial and Olympiad slot configuration',
      ],
      previewStats: [
        { label: 'Conflicts Resolved', val: '100%' },
        { label: 'Weekly Period Slots', val: '42 Periods' },
        { label: 'Proxy Reassign Time', val: '< 10s' },
      ],
    },
    {
      id: 'admissions',
      title: '360° Candidate Admissions & Merit OCR',
      badge: 'Student Lifecycle',
      icon: Users,
      description:
        'End-to-end applicant onboarding pipeline with optical document verification, algorithmic merit scoring, sibling quotas, and automated parent communication.',
      highlights: [
        'Instant OCR extraction of transfer certificates & marks cards',
        'Dynamic merit weighting algorithm (85% academic, 15% sports)',
        'Unified 360° Candidate Dossier with verified identity previews',
        'Bulk admission offer dispatches via WhatsApp and SMS DLT',
      ],
      previewStats: [
        { label: 'Processing Speed', val: '3.2x Faster' },
        { label: 'OCR Accuracy', val: '99.4%' },
        { label: 'Document Rejection', val: 'Automated' },
      ],
    },
    {
      id: 'attendance',
      title: 'Biometric Roll-Call & WhatsApp Alerts',
      badge: 'Real-Time Telemetry',
      icon: CalendarCheck,
      description:
        'Unified classroom and gate punch attendance engine with automated multi-channel absentee notification triggers and consecutive absence alert monitoring.',
      highlights: [
        'Facial recognition, RFID card, and teacher 1-click batch roll-call',
        'Automated parent WhatsApp alerts for unexcused absences',
        'Student leave workflow with medical prescription attachments',
        'Visual 6-month attendance heatmaps and trend analysis',
      ],
      previewStats: [
        { label: 'Daily Punch Speed', val: '0.4s' },
        { label: 'WhatsApp Dispatch', val: 'Instant' },
        { label: 'Uninformed Leaves', val: 'Auto-Flagged' },
      ],
    },
    {
      id: 'fees',
      title: 'Institutional Fees, GST & Auto-Debit',
      badge: 'Financial Governance',
      icon: CreditCard,
      description:
        'Corporate-grade institutional billing engine supporting quarterly fee schedules, UPI/Card auto-debit, itemized tax invoices, and real-time bank reconciliation.',
      highlights: [
        'Automated payment gateway reconciliation with zero manual ledger entry',
        'CBSE & state board itemized GST compliant tax receipts',
        'Automated fee defaulter reminders on WhatsApp & SMS',
        'Corporate saved cards and NEFT/RTGS institutional accounts',
      ],
      previewStats: [
        { label: 'Collection Rate', val: '98.9%' },
        { label: 'Reconciliation', val: 'Real-Time' },
        { label: 'Default Rate', val: '-65%' },
      ],
    },
  ];

  const faqs = [
    {
      q: 'How does VidyaFloww handle data sovereignty and privacy compliance?',
      a: 'All student, faculty, and institutional data is encrypted using AES-256 at rest and TLS 1.3 in transit. Databases are hosted exclusively within Indian sovereign data centers (AWS / GCP Mumbai region), fully satisfying CBSE, ICSE, and the Digital Personal Data Protection (DPDP) Act standards.',
    },
    {
      q: 'Can VidyaFloww integrate with existing biometric gates and RFID hardware?',
      a: 'Yes. VidyaFloww includes native hardware connectors for leading biometric face scanners, RFID turnstiles, and GPS bus trackers via secure webhook telemetry with sub-second synchronization.',
    },
    {
      q: 'What is the implementation timeline for a school with 2,000+ students?',
      a: 'Most schools complete full digital migration within 48 to 72 hours using our automated CSV/Excel roster import wizard. Our deployment engineers handle timetable configuration, fee structure setup, and staff onboarding.',
    },
    {
      q: 'Is VidyaFloww accessible on mobile and desktop offline?',
      a: 'Yes. VidyaFloww is a tri-platform ecosystem featuring a responsive Web Cloud Portal, an Electron-powered Desktop Ultra App with offline SQLite fallback, and a dedicated Mobile App for teachers and parents.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* ═══════════════════════════════════════════════════════════════════════
          STICKY NAVIGATION BAR
          ═══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1c1c1c] bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="VidyaFlow Logo"
              className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-white leading-none">
                Vidya<span className="text-primary">Flow</span>
              </span>
            </div>
          </a>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7">
            <a href="#features" className="text-xs font-bold text-zinc-300 hover:text-white transition-colors">
              Modules & Capabilities
            </a>
            <a href="#architecture" className="text-xs font-bold text-zinc-300 hover:text-white transition-colors">
              Ecosystem
            </a>
            <a href="#metrics" className="text-xs font-bold text-zinc-300 hover:text-white transition-colors">
              Impact
            </a>
            <a href="#pricing" className="text-xs font-bold text-zinc-300 hover:text-white transition-colors">
              Institutional Plans
            </a>
            <a href="#security" className="text-xs font-bold text-zinc-300 hover:text-white transition-colors">
              Data Security
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#121212] border border-[#242424] text-[11px] font-mono text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-xs bg-emerald-400 animate-pulse" />
              <span>SLA 99.98% Live</span>
            </div>

            <a
              href={LOGIN_URL}
              className="px-3.5 py-2 rounded-md bg-[#141414] hover:bg-[#1f1f1f] border border-[#282828] text-xs font-bold text-foreground transition-colors cursor-pointer"
            >
              Sign In
            </a>

            <a
              href={WEB_APP_URL}
              className="px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
            >
              <span>Launch Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md bg-[#141414] border border-[#242424] text-zinc-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#222222] bg-[#0c0c0c] p-4 space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-zinc-300 py-1"
            >
              Modules & Capabilities
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-zinc-300 py-1"
            >
              Ecosystem
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-zinc-300 py-1"
            >
              Institutional Plans
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={LOGIN_URL}
                className="w-full py-2.5 text-center rounded-md bg-[#141414] border border-[#262626] text-xs font-bold text-foreground"
              >
                Institutional Sign In
              </a>
              <a
                href={WEB_APP_URL}
                className="w-full py-2.5 text-center rounded-md bg-primary text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <span>Launch Demo Web App</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
        {/* Soft Radial Ambient Glow */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[450px] rounded-2xl pointer-events-none blur-[150px] opacity-15"
          style={{ background: 'radial-gradient(circle, #ea580c 0%, transparent 70%)' }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#121212] border border-[#262626] text-xs font-semibold text-zinc-300 shadow-xs">
            <span className="flex h-2 w-2 rounded-xs bg-primary" />
            <span>CBSE & ICSE 2026–27 Certified</span>
            <span className="text-zinc-600 font-mono">•</span>
            <span className="text-primary font-bold">AI-Powered School Automation</span>
          </div>

          {/* Main H1 Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
            The Unified Operating System for <span className="text-primary">Modern Campuses</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Seamlessly orchestrate admissions, conflict-free dynamic timetables, biometric roll-call,
            automated fee reconciliation, and 360° candidate dossiers in one ultra-fast institutional workspace.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <a
              href={WEB_APP_URL}
              className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-primary hover:bg-primary/90 text-white font-extrabold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch Live Interactive Portal</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href={LOGIN_URL}
              className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626] text-foreground font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Sign In as Super Admin</span>
            </a>
          </div>

          {/* Highlights checklist */}
          <div className="flex flex-wrap items-center justify-center gap-5 pt-3 text-xs font-semibold text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Instant Cloud Provisioning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Role-Based Multi-Campus Governance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>100% Data Sovereignty in India</span>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              HERO LIVE DASHBOARD PREVIEW MOCKUP (INTERACTIVE)
              ═══════════════════════════════════════════════════════════════════ */}
          <div className="pt-8 sm:pt-12">
            <div className="relative rounded-xl border border-[#282828] bg-[#0d0d0d] p-3 sm:p-5 shadow-2xl overflow-hidden group text-left">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#202020] mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-xs bg-[#2b2b2b]" />
                  <div className="h-3 w-3 rounded-xs bg-[#2b2b2b]" />
                  <div className="h-3 w-3 rounded-xs bg-[#2b2b2b]" />
                  <span className="ml-2 text-xs font-mono font-bold text-zinc-400">
                    vidyafloww.internal/app/dashboard · Live Active Session
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    LIVE TELEMETRY
                  </span>
                </div>
              </div>

              {/* Mockup KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="p-3 rounded-[4px] bg-[#141414] border border-[#222222]">
                  <p className="text-[10px] uppercase font-bold text-zinc-500">Enrolled Pupils</p>
                  <p className="text-xl sm:text-2xl font-black text-white mt-1">2,451</p>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-1">↑ +12 this month</p>
                </div>
                <div className="p-3 rounded-[4px] bg-[#141414] border border-[#222222]">
                  <p className="text-[10px] uppercase font-bold text-zinc-500">Faculty Coverage</p>
                  <p className="text-xl sm:text-2xl font-black text-white mt-1">98.2%</p>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-1">Optimal Coverage</p>
                </div>
                <div className="p-3 rounded-[4px] bg-[#141414] border border-[#222222]">
                  <p className="text-[10px] uppercase font-bold text-zinc-500">Net Attendance</p>
                  <p className="text-xl sm:text-2xl font-black text-white mt-1">94.5%</p>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-1">↑ +1.2% vs yesterday</p>
                </div>
                <div className="p-3 rounded-[4px] bg-[#141414] border border-[#222222]">
                  <p className="text-[10px] uppercase font-bold text-zinc-500">Admissions Pipeline</p>
                  <p className="text-xl sm:text-2xl font-black text-white mt-1">28 Verified</p>
                  <p className="text-[10px] text-primary font-semibold mt-1">18 Auto-Verified</p>
                </div>
              </div>

              {/* Mockup Modules Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Left: Faculty Proxy Widget */}
                <div className="p-3.5 rounded-[4px] bg-[#141414] border border-[#222222] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      Smart Teacher Proxy Reassignment
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                      Auto-Resolved
                    </span>
                  </div>

                  <div className="p-2.5 rounded-md bg-[#181818] border border-[#282828] flex items-center justify-between gap-2 text-xs">
                    <div>
                      <p className="font-bold text-white">Dr. Rajesh Sharma</p>
                      <p className="text-[10px] text-zinc-400">Physics HOD · Medical Leave</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">Mr. Arvind Gupta</p>
                      <p className="text-[10px] text-zinc-500 font-mono">Period 3 (Lab 204)</p>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Actions Matrix */}
                <div className="p-3.5 rounded-[4px] bg-[#141414] border border-[#222222] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                      Command Launchpad
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">12 Active Modules</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-md bg-[#181818] border border-[#282828] font-bold text-zinc-300">
                      Admissions
                    </div>
                    <div className="p-2 rounded-md bg-[#181818] border border-[#282828] font-bold text-zinc-300">
                      Timetable
                    </div>
                    <div className="p-2 rounded-md bg-[#181818] border border-[#282828] font-bold text-zinc-300">
                      Payments
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlay Callout */}
              <div className="mt-3 pt-3 border-t border-[#1c1c1c] flex items-center justify-between text-xs">
                <span className="text-zinc-500">Explore complete interactive management portal</span>
                <a
                  href={WEB_APP_URL}
                  className="font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Enter Full Live Application <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TRUSTED INSTITUTIONS INFINITE MARQUEE
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-8 border-y border-[#181818] bg-[#080808] select-none space-y-3">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">
            Trusted by 150+ Leading Educational Campuses Across India
          </p>
        </div>

        <div
          className="relative w-full overflow-hidden py-1 group cursor-pointer"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          }}
        >
          {/* Subtle Vignettes */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

          {/* Continuous Single Track with 4 sets of 12 schools */}
          <div className="animate-marquee flex gap-3 items-center group-hover:[animation-play-state:paused] pr-3">
            {[
              ...TRUSTED_INSTITUTIONS,
              ...TRUSTED_INSTITUTIONS,
              ...TRUSTED_INSTITUTIONS,
              ...TRUSTED_INSTITUTIONS,
            ].map((inst, i) => {
              const Icon = inst.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-md bg-[#121212] border border-[#222222] text-xs font-semibold text-zinc-300 shadow-xs hover:border-primary/60 hover:text-primary transition-colors whitespace-nowrap shrink-0 hover:bg-[#181818] cursor-pointer"
                >
                  <div className="h-4 w-4 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-2.5 w-2.5" />
                  </div>
                  <span className="font-bold text-xs">{inst.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CORE CAPABILITIES INTERACTIVE SHOWCASE
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">
            Institutional Modules
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Engineered for Campus Complexity
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Eliminate fragmented software tools. VidyaFloww consolidates every operational touchpoint into a unified, high-integrity platform.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
          {capabilities.map((c, idx) => {
            const Icon = c.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={c.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-[#121212] text-zinc-400 hover:text-white border-[#242424] hover:bg-[#181818]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{c.title.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Showcase Card */}
        {capabilities[activeTab] && (
          <div className="rounded-xl border border-[#262626] bg-[#0e0e0e] p-6 sm:p-9 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                  {capabilities[activeTab].badge}
                </span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {capabilities[activeTab].title}
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
                {capabilities[activeTab].description}
              </p>

              {/* Highlights List */}
              <div className="space-y-2.5 pt-2">
                {capabilities[activeTab].highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <a
                  href={WEB_APP_URL}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#161616] hover:bg-[#202020] border border-[#2a2a2a] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Experience this Module Live</span>
                  <ArrowRight className="h-3.5 w-3.5 text-primary" />
                </a>
              </div>
            </div>

            {/* Metrics & Mini-Dashboard */}
            <div className="lg:col-span-5 space-y-4 rounded-[4px] bg-[#141414] border border-[#242424] p-5 shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Performance Telemetry
              </span>

              <div className="grid grid-cols-1 gap-3">
                {capabilities[activeTab].previewStats.map((st, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-md bg-[#181818] border border-[#282828] flex items-center justify-between"
                  >
                    <span className="text-xs text-zinc-400 font-medium">{st.label}</span>
                    <span className="text-sm sm:text-base font-black text-primary font-mono">{st.val}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Verified with 100% CBSE Schema Compliance</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TRI-PLATFORM ECOSYSTEM ARCHITECTURE
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="architecture" className="py-16 sm:py-24 border-t border-[#181818] bg-[#060606]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">
              Unified Ecosystem
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              One Engine. Three Native Interfaces.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Every campus stakeholder accesses synchronized records across dedicated form factors with zero data drift.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Web Cloud Portal */}
            <div className="p-6 rounded-xl bg-[#0f0f0f] border border-[#222222] space-y-4 hover:border-primary/50 transition-colors">
              <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Web Cloud Portal</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Comprehensive command center for Principals, Admission Deans, Timetable Coordinators, and Chief Financial Officers.
              </p>
              <div className="pt-2 text-xs font-mono text-zinc-500 space-y-1">
                <p>• Zero installation required</p>
                <p>• Chrome, Safari, Edge, Firefox</p>
                <p>• Instant real-time WebSocket sync</p>
              </div>
            </div>

            {/* 2. Desktop Ultra ERP */}
            <div className="p-6 rounded-xl bg-[#0f0f0f] border border-[#222222] space-y-4 hover:border-primary/50 transition-colors">
              <div className="h-10 w-10 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Laptop className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Desktop Ultra ERP</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                High-throughput Electron desktop workstation built for campus registrars, cash counters, and biometric gate hubs.
              </p>
              <div className="pt-2 text-xs font-mono text-zinc-500 space-y-1">
                <p>• Offline-first SQLite local store</p>
                <p>• Direct thermal receipt printing</p>
                <p>• Hardware RFID turnstile link</p>
              </div>
            </div>

            {/* 3. Mobile Parent & Teacher */}
            <div className="p-6 rounded-xl bg-[#0f0f0f] border border-[#222222] space-y-4 hover:border-primary/50 transition-colors">
              <div className="h-10 w-10 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Mobile Parent & Staff App</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Native iOS and Android app for parent fee payments, real-time GPS bus tracking, digital report cards, and teacher daily logs.
              </p>
              <div className="pt-2 text-xs font-mono text-zinc-500 space-y-1">
                <p>• Biometric Face ID login</p>
                <p>• Live bus telemetry tracking</p>
                <p>• Push alerts for exam marks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          IMPACT METRICS SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="metrics" className="py-16 border-y border-[#181818] bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black text-white font-mono">150+</p>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Top Campuses</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black text-primary font-mono">250K+</p>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Active Pupils</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black text-emerald-400 font-mono">99.98%</p>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Uptime SLA</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black text-white font-mono">4.8h</p>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Saved / Faculty / Week</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          INSTITUTIONAL PRICING PLANS
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">
            Predictable Billing
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Institutional Licensing Plans
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Transparent annual subscriptions tailored to campus capacity with unlimited faculty seats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1: Standard Academy */}
          <div className="p-6 rounded-xl bg-[#0f0f0f] border border-[#222222] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Standard Academy
              </span>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">₹ 1,20,000</p>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">per campus / academic year</p>
              </div>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                Ideal for standalone single-branch K-10 institutions up to 1,000 pupils.
              </p>
              <div className="space-y-2 pt-2 text-xs text-zinc-300">
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Full Admissions & 360° Dossiers
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Smart 7-Day Timetables
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Biometric Daily Attendance
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> 10,000 Monthly SMS Credits
                </p>
              </div>
            </div>

            <a
              href={LOGIN_URL}
              className="w-full py-2.5 text-center rounded-md bg-[#161616] hover:bg-[#202020] border border-[#282828] text-xs font-bold text-foreground transition-colors"
            >
              Get Started
            </a>
          </div>

          {/* Plan 2: Premier Campus (Highlighted) */}
          <div className="p-6 rounded-xl bg-[#121212] border-2 border-primary space-y-6 flex flex-col justify-between relative shadow-xl shadow-primary/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-md">
              Most Selected
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                Premier Campus
              </span>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">₹ 2,40,000</p>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">per campus / academic year</p>
              </div>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                Comprehensive solution for K-12 CBSE/ICSE institutions up to 3,000 pupils.
              </p>
              <div className="space-y-2 pt-2 text-xs text-zinc-300">
                <p className="flex items-center gap-2 font-bold text-white">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Everything in Standard +
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> AI Faculty Proxy Auto-Assignment
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Real-Time Payment Auto-Debit & GST
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Unlimited WhatsApp Broadcasts
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Dedicated SLA Account Manager
                </p>
              </div>
            </div>

            <a
              href={WEB_APP_URL}
              className="w-full py-2.5 text-center rounded-md bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Deploy Premier Instance
            </a>
          </div>

          {/* Plan 3: Multi-Campus Enterprise */}
          <div className="p-6 rounded-xl bg-[#0f0f0f] border border-[#222222] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Multi-Campus Group
              </span>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">Custom Tier</p>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">multi-branch institutional cluster</p>
              </div>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                For educational societies, trust boards, and multi-city school networks.
              </p>
              <div className="space-y-2 pt-2 text-xs text-zinc-300">
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Multi-Branch Group Tenancy
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Centralized Trust Financial Consolidation
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Custom ERP & Biometric Integrations
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> 24/7 Dedicated On-Site Technical Support
                </p>
              </div>
            </div>

            <a
              href={LOGIN_URL}
              className="w-full py-2.5 text-center rounded-md bg-[#161616] hover:bg-[#202020] border border-[#282828] text-xs font-bold text-foreground transition-colors"
            >
              Contact Board Desk
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DATA SECURITY & SOVEREIGNTY CHARTER
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="security" className="py-16 border-t border-[#181818] bg-[#070707]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Institutional Trust
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Sovereign Cloud. Zero Third-Party Leakage.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
              We uphold the highest standard of student data confidentiality. VidyaFloww never monetizes student records, runs zero advertising scripts, and guarantees 100% data residency within India.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-md bg-[#121212] border border-[#222222]">
                <p className="text-xs font-bold text-white">AES-256 Bit</p>
                <p className="text-[10px] text-zinc-500">Encrypted at rest & transit</p>
              </div>
              <div className="p-3 rounded-md bg-[#121212] border border-[#222222]">
                <p className="text-xs font-bold text-white">CBSE Charter</p>
                <p className="text-[10px] text-zinc-500">100% Schema Certified</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#101010] border border-[#222222] space-y-3 shadow-xl">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
              Compliance Standard
            </span>
            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-center justify-between p-2.5 rounded-md bg-[#141414] border border-[#242424]">
                <span>Digital Personal Data Protection (DPDP) Act</span>
                <span className="text-emerald-400 font-bold">Compliant</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-md bg-[#141414] border border-[#242424]">
                <span>MeitY Empanelled Cloud Infrastructure</span>
                <span className="text-emerald-400 font-bold">Mumbai Hub</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-md bg-[#141414] border border-[#242424]">
                <span>Automated Hourly Immutable Snapshots</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FAQS ACCORDION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-[4px] bg-[#0e0e0e] border border-[#222222] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-white cursor-pointer hover:text-primary transition-colors"
                >
                  <span>{f.q}</span>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      isOpen ? 'rotate-90 text-primary' : 'text-zinc-500'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium border-t border-[#1c1c1c]/50">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FINAL CALL TO ACTION BANNER
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 border-t border-[#181818] bg-gradient-to-b from-black to-[#0d0905]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Modernize Your Campus Management?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-medium">
            Experience the complete VidyaFloww ecosystem live in your browser with zero commitments or setup.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <a
              href={WEB_APP_URL}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Live Portal</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={LOGIN_URL}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#141414] hover:bg-[#1f1f1f] border border-[#282828] text-foreground font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In to Institutional Account</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[#1a1a1a] bg-black py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="VidyaFloww Logo" className="h-6 w-6 object-contain" />
            <span className="font-bold text-zinc-300">VidyaFloww Technologies</span>
            <span>•</span>
            <span>Enterprise Campus OS</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400 font-semibold">
            <a href={LOGIN_URL} className="hover:text-white">Sign In</a>
            <a href={WEB_APP_URL} className="hover:text-white">Live App</a>
            <a href="#security" className="hover:text-white">Security Charter</a>
            <a href="#pricing" className="hover:text-white">Licensing</a>
          </div>

          <p>© 2026 VidyaFloww Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
