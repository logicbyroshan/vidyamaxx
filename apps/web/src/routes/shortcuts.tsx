import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFCard,
  VFButton,
  VFBadge,
  cn,
} from '@vidyamaxx/ui';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Bell,
  FileSpreadsheet,
  Settings,
  Calendar,
  UserPlus,
  ClipboardList,
  School,
  BookOpen,
  Laptop,
  BookOpenCheck,
  Smartphone,
  Search,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  BarChart3,
  Bus,
  Building2,
  MessageSquareWarning,
  Vote,
} from 'lucide-react';
import { useGlobalStore, DEFAULT_DASHBOARD_SHORTCUTS } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/shortcuts')({
  component: ShortcutsConfigPage,
});

export interface ShortcutAction {
  id: string;
  label: string;
  labelHi: string;
  desc: string;
  descHi: string;
  route: string;
  icon: any;
  category: 'Core' | 'Academic' | 'Finance' | 'Communication' | 'Operations' | 'System';
}

export const ALL_SHORTCUT_ACTIONS: ShortcutAction[] = [
  { id: 'attendance', label: 'Attendance', labelHi: 'अटेंडेंस', desc: 'Daily roll call & biometric logs', descHi: 'डेली अटेंडेंस & बायोमेट्रिक लॉग्स', route: '/attendance', icon: CalendarCheck, category: 'Core' },
  { id: 'admissions', label: 'Admissions', labelHi: 'एडमिशन', desc: 'Intake pipeline & lead verification', descHi: 'एडमिशन प्रक्रिया व सत्यापन', route: '/admissions', icon: UserPlus, category: 'Core' },
  { id: 'students', label: 'Students', labelHi: 'स्टूडेंट्स', desc: '360° student directory & dossiers', descHi: 'स्टूडेंट डायरेक्टरी & रिकॉर्ड्स', route: '/students', icon: GraduationCap, category: 'Core' },
  { id: 'teachers', label: 'Teachers', labelHi: 'टीचर्स', desc: 'Faculty profiles & workload matrix', descHi: 'टीचर प्रोफाइल्स & वर्कलोड', route: '/teachers', icon: Users, category: 'Academic' },
  { id: 'timetable', label: 'Timetable', labelHi: 'टाइमटेबल', desc: 'Class schedules & proxy assignment', descHi: 'कक्षा शेड्यूल व टाइमटेबल', route: '/timetable', icon: Calendar, category: 'Academic' },
  { id: 'fees', label: 'Payments', labelHi: 'फीस व पेमेंट्स', desc: 'Dues collection & digital receipts', descHi: 'फीस संग्रह व डिजिटल रसीदें', route: '/fees', icon: CreditCard, category: 'Finance' },
  { id: 'notices', label: 'Notices', labelHi: 'नोटिस व सर्कुलर', desc: 'Campus circulars & broadcasts', descHi: 'स्कूल सर्कुलर व घोषणाएं', route: '/notices', icon: Bell, category: 'Communication' },
  { id: 'teaching', label: 'Teaching', labelHi: 'शिक्षण', desc: 'Lesson planner & faculty pacing', descHi: 'पाठ योजना व शिक्षण ट्रैकिंग', route: '/teaching', icon: BookOpenCheck, category: 'Academic' },
  { id: 'homework', label: 'Homework', labelHi: 'होमवर्क', desc: 'Daily assignments & submissions', descHi: 'दैनिक असाइनमेंट व सबमिशन', route: '/homework', icon: BookOpen, category: 'Academic' },
  { id: 'examinations', label: 'Exams', labelHi: 'एग्जाम्स', desc: 'Marksheets, grades & report cards', descHi: 'मार्कशीट्स, ग्रेड्स & रिपोर्ट कार्ड्स', route: '/examinations', icon: ClipboardList, category: 'Academic' },
  { id: 'academics', label: 'Academics', labelHi: 'एकेडमिक्स', desc: 'Grade hierarchy & wing structure', descHi: 'कक्षा संरचना व विंग', route: '/academics', icon: School, category: 'Academic' },
  { id: 'transport', label: 'Transport', labelHi: 'ट्रांसपोर्ट', desc: 'Fleet GPS telematics & bus routes', descHi: 'बस रूट्स & लाइव GPS ट्रैकिंग', route: '/transport', icon: Bus, category: 'Operations' },
  { id: 'hostel', label: 'Hostel', labelHi: 'हॉस्टल', desc: 'Dormitory beds, outpass & mess menu', descHi: 'रूम अलॉटमेंट, आउटपास & मेस मेन्यू', route: '/hostel', icon: Building2, category: 'Operations' },
  { id: 'complaints', label: 'Complaints', labelHi: 'शिकायतें', desc: 'Grievance redressal & ticket tracking', descHi: 'शिकायत निवारण व टिकट ट्रैकिंग', route: '/complaints', icon: MessageSquareWarning, category: 'Operations' },
  { id: 'surveys', label: 'Surveys', labelHi: 'सर्वेक्षण', desc: 'Institutional feedback & community polls', descHi: 'संस्थागत फीडबैक व कम्युनिटी पोल', route: '/surveys', icon: Vote, category: 'Operations' },
  { id: 'statistics', label: 'Statistics', labelHi: 'आंकड़े व स्टेट्स', desc: 'Institutional telemetry & analytics', descHi: 'संस्थान के आंकड़े व विश्लेषण', route: '/statistics', icon: BarChart3, category: 'Operations' },
  { id: 'reports', label: 'Reports', labelHi: 'रिपोर्ट्स', desc: 'CBSE, RTE compliance & export audit', descHi: 'CBSE, RTE कंप्लायंस व ऑडिट', route: '/reports', icon: FileSpreadsheet, category: 'Operations' },
  { id: 'settings', label: 'Settings', labelHi: 'सेटिंग्स', desc: 'School branding, logos & AY session', descHi: 'स्कूल ब्रांडिंग, लोगो & सेशन', route: '/settings', icon: Settings, category: 'System' },
  { id: 'lms', label: 'E-Learning', labelHi: 'ई-लर्निंग', desc: 'Digital courses & lesson library', descHi: 'डिजिटल पाठ्यक्रम व पाठ्य सामग्री', route: '/lms', icon: Laptop, category: 'Academic' },
  { id: 'resources', label: 'Library', labelHi: 'लाइब्रेरी', desc: 'Resource catalog & book registers', descHi: 'किताबें व संसाधन कैटलॉग', route: '/resources', icon: BookOpenCheck, category: 'Operations' },
  { id: 'portal', label: 'Parent Portal', labelHi: 'पैरेंट पोर्टल', desc: 'Guardian access & communications', descHi: 'गार्जियन एक्सेस & कम्युनिकेशंस', route: '/portal', icon: Smartphone, category: 'Communication' },
];

const MAX_SHORTCUTS = 12;

function ShortcutsConfigPage() {
  const { dashboardShortcuts, setDashboardShortcuts, resetDashboardShortcuts, addNotification } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';

  const [selectedIds, setSelectedIds] = React.useState<string[]>(
    dashboardShortcuts && dashboardShortcuts.length > 0 ? dashboardShortcuts.slice(0, MAX_SHORTCUTS) : DEFAULT_DASHBOARD_SHORTCUTS.slice(0, MAX_SHORTCUTS)
  );
  const [searchQuery, setSearchQuery] = React.useState('');
  const [saveToast, setSaveToast] = React.useState(false);

  // Sync state if store updates
  React.useEffect(() => {
    if (dashboardShortcuts && dashboardShortcuts.length > 0) {
      setSelectedIds(dashboardShortcuts.slice(0, MAX_SHORTCUTS));
    }
  }, [dashboardShortcuts]);

  // Reordering handlers
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= selectedIds.length) return;

    setSelectedIds((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleRemove = (id: string) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleAdd = (id: string) => {
    if (selectedIds.length >= MAX_SHORTCUTS) {
      addNotification({
        title: isHindi ? 'मैक्सिमम लिमिट (12)' : 'Maximum 12 Limit',
        description: isHindi ? 'आप मैक्सिमम 12 शॉर्टकट्स सेलेक्ट कर सकते हैं।' : 'Maximum 12 shortcuts allowed on the home workspace.',
        type: 'warning',
      });
      return;
    }
    if (!selectedIds.includes(id)) {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const handleSave = () => {
    setDashboardShortcuts(selectedIds);
    setSaveToast(true);
    addNotification({
      title: isHindi ? 'शॉर्टकट्स सेव हुए' : 'Shortcuts Saved',
      description: isHindi ? 'डैशबोर्ड क्विक एक्शंस सफलतापूर्वक अपडेट हुए।' : 'Active home workspace quick action links updated successfully.',
      type: 'success',
    });
    setTimeout(() => {
      setSaveToast(false);
    }, 3000);
  };

  const handleReset = () => {
    resetDashboardShortcuts();
    setSelectedIds(DEFAULT_DASHBOARD_SHORTCUTS.slice(0, MAX_SHORTCUTS));
    setSaveToast(true);
    addNotification({
      title: isHindi ? 'डिफ़ॉल्ट रिस्टोर' : 'Defaults Restored',
      description: isHindi ? 'स्टैंडर्ड 12 क्विक एक्शन शॉर्टकट्स डिफ़ॉल्ट पर रीसेट हुए।' : 'Standard 12 quick action shortcuts reset to default order.',
      type: 'info',
    });
    setTimeout(() => {
      setSaveToast(false);
    }, 3000);
  };

  // 1. Active items in sequence
  const activeShortcutObjects = selectedIds
    .map((id) => ALL_SHORTCUT_ACTIONS.find((a) => a.id === id))
    .filter((a): a is ShortcutAction => Boolean(a));

  // 2. All shortcuts sorted: active ones on top, inactive ones below
  const sortedAllShortcuts = React.useMemo(() => {
    return [...ALL_SHORTCUT_ACTIONS].sort((a, b) => {
      const aActive = selectedIds.includes(a.id);
      const bActive = selectedIds.includes(b.id);
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      if (aActive && bActive) {
        return selectedIds.indexOf(a.id) - selectedIds.indexOf(b.id);
      }
      return 0;
    });
  }, [selectedIds]);

  // Filtered list for left side
  const filteredSortedShortcuts = React.useMemo(() => {
    return sortedAllShortcuts.filter((a) => {
      const query = searchQuery.toLowerCase();
      return (
        !searchQuery ||
        a.label.toLowerCase().includes(query) ||
        a.labelHi.includes(query) ||
        a.desc.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query)
      );
    });
  }, [sortedAllShortcuts, searchQuery]);

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-[4px] border border-border/80 bg-[#141414] shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/">
            <VFButton
              size="sm"
              variant="outline"
              className="h-9 px-3 bg-[#141414] hover:bg-[#1f1f1f] text-foreground border-border cursor-pointer shadow-xs"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              {t('nav.dashboard')}
            </VFButton>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight">
                {isHindi ? 'क्विक एक्शन शॉर्टकट्स कस्टमाइज़ करें' : 'Configure Quick Actions'}
              </h2>
              <VFBadge variant="primary" className="text-xs font-bold font-mono">
                {selectedIds.length} / {MAX_SHORTCUTS} {isHindi ? 'एक्टिव' : 'Active'}
              </VFBadge>
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {isHindi
                ? 'अपने मेन डैशबोर्ड के लिए मैक्सिमम 12 क्विक एक्शन शॉर्टकट्स सेलेक्ट और अरेंज करें।'
                : 'Select and arrange up to 12 quick action shortcuts for your institutional home launchpad.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleReset}
            className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-muted/40 transition-colors border border-transparent hover:border-border cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {isHindi ? 'डिफ़ॉल्ट रीसेट करें (12)' : 'Reset Defaults (12)'}
          </button>
          <VFButton
            size="sm"
            onClick={handleSave}
            className="h-9 px-4 text-xs font-bold cursor-pointer"
            leftIcon={<Check className="h-4 w-4" />}
          >
            {t('action.saveChanges')}
          </VFButton>
        </div>
      </div>

      {/* Save Notification Banner */}
      {saveToast && (
        <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200 shrink-0">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0" />
            <span>{isHindi ? 'डैशबोर्ड क्विक एक्शन शॉर्टकट्स सफलतापूर्वक अपडेट हुए!' : 'Dashboard quick action shortcuts updated successfully! Changes are live on your home workspace.'}</span>
          </div>
          <Link to="/" className="underline text-emerald-300 hover:text-white font-black">
            {isHindi ? 'डैशबोर्ड पर जाएं →' : 'Go to Dashboard →'}
          </Link>
        </div>
      )}

      {/* Main Full-Width Split Layout: Left Pool (All with Active sorted on top) + Right Dashboard Grid (12 Slots) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT COLUMN: All Shortcuts Pool (Active on Top with Remove, Inactive below with Add) (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col min-h-0">
          <VFCard
            title={
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-foreground">
                  {isHindi ? 'अवेलेबल एक्शंस पूल' : 'Available Actions Pool'}
                </span>
                <VFBadge variant="outline" className="text-[11px] font-mono font-bold bg-[#161616]">
                  {filteredSortedShortcuts.length} {isHindi ? 'मॉड्यूल्स' : 'Modules'}
                </VFBadge>
              </div>
            }
            description={
              isHindi
                ? 'एक्टिव शॉर्टकट्स टॉप पर दिखते हैं। कस्टमाइज़ करने के लिए ऐड या रिमूव पर क्लिक करें।'
                : 'Active shortcuts appear at the top. Click Add or Remove to customize your launchpad.'
            }
            className="h-full flex flex-col min-h-0 bg-[#0d0d0d] border-border/90"
            bodyClassName="p-3.5 flex flex-col flex-1 min-h-0 space-y-3 overflow-hidden"
          >
            {/* Full Width Search Bar */}
            <div className="relative shrink-0">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi ? "एक्शन मॉड्यूल्स सर्च करें..." : "Search action modules by title or keyword..."}
                className="w-full pl-8 pr-3 h-9 rounded-[4px] bg-[#141414] border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-zinc-400 transition-colors"
              />
            </div>

            {/* List of All Modules — Natural page flow */}
            <div className="space-y-2">
              {filteredSortedShortcuts.map((action) => {
                const Icon = action.icon;
                const isActive = selectedIds.includes(action.id);
                const activeIndex = selectedIds.indexOf(action.id);

                return (
                  <div
                    key={action.id}
                    className={cn(
                      "p-2.5 rounded-[4px] border transition-all flex items-center justify-between gap-3 shadow-xs",
                      isActive
                        ? "bg-[#141414] border-[#2c2c2c] hover:border-[#3a3a3a]"
                        : "bg-[#0f0f0f] border-border/60 hover:border-border opacity-75 hover:opacity-100"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Status indicator or Position Tag */}
                      {isActive ? (
                        <span className="h-6 w-6 rounded bg-[#202020] border border-[#303030] text-[11px] font-mono font-black text-primary flex items-center justify-center shrink-0 shadow-2xs">
                          {activeIndex + 1}
                        </span>
                      ) : (
                        <span className="h-6 w-6 rounded bg-[#181818] border border-border text-[10px] font-mono text-muted-foreground flex items-center justify-center shrink-0">
                          +
                        </span>
                      )}

                      {/* Icon box (matching dashboard sleek colors) */}
                      <div className={cn(
                        "h-8 w-8 rounded-[4px] flex items-center justify-center shrink-0 shadow-xs border transition-colors",
                        isActive
                          ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
                          : "bg-[#161616] border-border text-muted-foreground"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className={cn("text-xs font-bold truncate", isActive ? "text-foreground" : "text-muted-foreground")}>
                            {isHindi ? action.labelHi : action.label}
                          </p>
                          <span className="text-[9px] font-mono text-muted-foreground uppercase px-1.5 py-0.2 rounded bg-[#1c1c1c] border border-border/70">
                            {action.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate">{isHindi ? action.descHi : action.desc}</p>
                      </div>
                    </div>

                    {/* Action Button: Remove if Active, Add if Inactive */}
                    <div className="shrink-0 flex items-center gap-1.5">
                      {isActive ? (
                        <button
                          onClick={() => handleRemove(action.id)}
                          className="h-7 px-2.5 text-[11px] font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md border border-rose-500/30 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                          title={isHindi ? "शॉर्टकट रिमूव करें" : "Remove from quick actions"}
                        >
                          <Trash2 className="h-3 w-3" /> {isHindi ? 'रिमूव करें' : 'Remove'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAdd(action.id)}
                          disabled={selectedIds.length >= MAX_SHORTCUTS}
                          className={cn(
                            "h-7 px-2.5 text-[11px] font-bold rounded-md border flex items-center gap-1 transition-colors shadow-2xs",
                            selectedIds.length >= MAX_SHORTCUTS
                              ? "opacity-30 border-border text-muted-foreground cursor-not-allowed"
                              : "text-primary hover:bg-primary/10 border-primary/40 cursor-pointer"
                          )}
                          title={selectedIds.length >= MAX_SHORTCUTS ? (isHindi ? "मैक्सिमम 12 शॉर्टकट्स की लिमिट पूरी हुई" : "Max 12 shortcuts reached") : (isHindi ? "क्विक एक्शन में ऐड करें" : "Add to quick actions")}
                        >
                          <Plus className="h-3 w-3" /> {isHindi ? 'ऐड करें' : 'Add'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </VFCard>
        </div>

        {/* RIGHT COLUMN: Active Launchpad Preview (Max 12 Slots, Exact Dashboard Styling) (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col min-h-0">
          <VFCard
            title={
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-foreground">
                  {isHindi ? 'डैशबोर्ड क्विक एक्शंस लॉन्चपैड' : 'Dashboard Quick Actions Launchpad'}
                </span>
                <VFBadge variant="success" className="text-[11px] font-mono font-bold">
                  {selectedIds.length} / {MAX_SHORTCUTS} {isHindi ? 'स्लॉट्स' : 'Slots'}
                </VFBadge>
              </div>
            }
            description={
              isHindi
                ? 'आपके 12-स्लॉट लॉन्चपैड का लाइव प्रीव्यू। रीऑर्डर करने के लिए एरो कंट्रोल्स यूज़ करें।'
                : 'Live preview of your 12-slot launchpad. Use the arrow controls or remove buttons to adjust.'
            }
            className="h-full flex flex-col min-h-0 bg-[#0d0d0d] border-border/90"
            bodyClassName="p-3.5 flex flex-col flex-1 min-h-0 space-y-3 overflow-hidden"
          >
            {/* 12-Slot Dashboard Grid Preview (4 cols on large screens, 3 cols on medium) */}
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {/* Active items */}
                {activeShortcutObjects.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <div
                      key={action.id}
                      className="p-3 rounded-[4px] border border-border/80 bg-[#141414] hover:bg-[#1a1a1a] hover:border-zinc-700 transition-all flex flex-col items-center justify-between text-center group shadow-xs select-none min-h-[108px] relative overflow-hidden"
                    >
                      {/* Top bar with sequence number & reorder controls */}
                      <div className="w-full flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                        <span className="font-mono font-black text-primary px-1.5 py-0.2 rounded bg-[#1c1c1c] border border-[#2a2a2a]">
                          #{idx + 1}
                        </span>
                        <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleMove(idx, 'up')}
                            disabled={idx === 0}
                            className={cn(
                              "p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-[#242424] cursor-pointer",
                              idx === 0 && "opacity-20 cursor-not-allowed"
                            )}
                            title={isHindi ? "ऊपर मूव करें" : "Move left/up"}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMove(idx, 'down')}
                            disabled={idx === selectedIds.length - 1}
                            className={cn(
                              "p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-[#242424] cursor-pointer",
                              idx === selectedIds.length - 1 && "opacity-20 cursor-not-allowed"
                            )}
                            title={isHindi ? "नीचे मूव करें" : "Move right/down"}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Icon container (matching dashboard orange glassmorphic styling) */}
                      <div className="h-9 w-9 rounded-[4px] flex items-center justify-center border border-orange-500/25 bg-gradient-to-b from-orange-500/15 via-orange-500/10 to-orange-600/5 text-orange-400 mb-1 group-hover:scale-105 group-hover:bg-orange-500/20 group-hover:border-orange-500/50 group-hover:text-orange-300 transition-all shrink-0 shadow-xs">
                        <Icon className="h-4.5 w-4.5" />
                      </div>

                      {/* Label */}
                      <p className="text-xs font-bold text-foreground group-hover:text-white transition-colors leading-snug w-full text-center truncate px-1">
                        {isHindi ? action.labelHi : action.label}
                      </p>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemove(action.id)}
                        className="mt-1 text-[10px] font-semibold text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer"
                        title={isHindi ? "रिमूव करें" : "Remove shortcut"}
                      >
                        {isHindi ? 'रिमूव करें' : 'Remove'}
                      </button>
                    </div>
                  );
                })}

                {/* Available empty placeholder slots if < 12 */}
                {Array.from({ length: Math.max(0, MAX_SHORTCUTS - activeShortcutObjects.length) }).map((_, emptyIdx) => {
                  const slotNum = activeShortcutObjects.length + emptyIdx + 1;
                  return (
                    <div
                      key={`empty-${emptyIdx}`}
                      className="p-3 rounded-[4px] border border-dashed border-border/60 bg-[#0e0e0e]/50 flex flex-col items-center justify-center text-center select-none min-h-[108px] text-muted-foreground/60 space-y-1"
                    >
                      <div className="h-8 w-8 rounded-[4px] border border-dashed border-border/60 flex items-center justify-center text-xs font-mono font-bold">
                        {slotNum}
                      </div>
                      <span className="text-[10px] font-semibold">
                        {isHindi ? 'अवेलेबल स्लॉट' : 'Available Slot'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </VFCard>
        </div>

      </div>
    </VFPageContainer>
  );
}
