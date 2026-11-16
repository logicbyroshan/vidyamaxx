import * as React from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { VFBadge } from '@vidyafloww/ui';
import { MODULE_REGISTRY } from '@vidyafloww/constants';
import {
  Search,
  LayoutDashboard,
  UserSquare,
  Users,
  GraduationCap,
  Calendar,
  CalendarCheck,
  BookOpenCheck,
  BookMarked,
  ClipboardList,
  FolderGit2,
  Laptop,
  Settings,
  Plus,
  ArrowRight,
  X,
  CreditCard,
  Bell,
  SlidersHorizontal,
  FileSpreadsheet,
  Building,
  School,
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from '../hooks/useTranslation';

const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  UserSquare,
  Users,
  GraduationCap,
  Calendar,
  CalendarCheck,
  BookOpenCheck,
  BookMarked,
  ClipboardList,
  FolderGit2,
  Laptop,
  Settings,
  CreditCard,
  Bell,
  SlidersHorizontal,
  FileSpreadsheet,
  Building,
  School,
};

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { lang } = useTranslation();
  const isHindi = lang === 'hi';
  const [search, setSearch] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<'all' | 'modules' | 'actions'>('all');

  const commands = React.useMemo(() => {
    const moduleCommands = MODULE_REGISTRY.map((mod) => ({
      id: mod.id,
      icon: ICON_MAP[mod.iconName] || LayoutDashboard,
      label: `Go to ${mod.code}. ${mod.label}`,
      sublabel: `Open ${mod.label} module`,
      route: mod.route,
      category: 'modules' as const,
      categoryLabel: 'Module',
      shortcut: `⌘${mod.code}`,
      onSelect: () => {
        navigate({ to: mod.route });
        onClose();
      },
    }));

    const actionCommands = [
      {
        id: 'act-new-admit',
        icon: Plus,
        label: 'New Student Admission Application',
        sublabel: 'Create a new applicant dossier',
        route: '/admissions',
        category: 'actions' as const,
        categoryLabel: 'Action',
        shortcut: 'Shift+A',
        onSelect: () => {
          navigate({ to: '/admissions' });
          onClose();
        },
      },
      {
        id: 'act-attendance-mark',
        icon: CalendarCheck,
        label: 'Mark Daily Student Attendance',
        sublabel: 'Take roll call for classes today',
        route: '/attendance',
        category: 'actions' as const,
        categoryLabel: 'Action',
        shortcut: 'Shift+T',
        onSelect: () => {
          navigate({ to: '/attendance' });
          onClose();
        },
      },
      {
        id: 'act-shortcuts',
        icon: SlidersHorizontal,
        label: 'Configure Quick Shortcuts',
        sublabel: 'Customize institutional actions dashboard grid',
        route: '/shortcuts',
        category: 'actions' as const,
        categoryLabel: 'Action',
        shortcut: 'Shift+S',
        onSelect: () => {
          navigate({ to: '/shortcuts' });
          onClose();
        },
      },
      {
        id: 'act-reports-compliance',
        icon: FileSpreadsheet,
        label: 'Generate Compliance & CBSE Reports',
        sublabel: 'Download official rosters & audit summaries',
        route: '/reports',
        category: 'actions' as const,
        categoryLabel: 'Action',
        shortcut: 'Shift+R',
        onSelect: () => {
          navigate({ to: '/reports' });
          onClose();
        },
      },
      {
        id: 'act-settings',
        icon: Settings,
        label: 'School Settings & Identity',
        sublabel: 'Update school name, logo preset and branding',
        route: '/settings',
        category: 'actions' as const,
        categoryLabel: 'Action',
        shortcut: 'Shift+O',
        onSelect: () => {
          navigate({ to: '/settings' });
          onClose();
        },
      },
    ];

    return [...moduleCommands, ...actionCommands];
  }, [navigate, onClose]);

  // Filter commands by active category tab
  const filteredCommands = React.useMemo(() => {
    if (activeCategory === 'all') return commands;
    return commands.filter((c) => c.category === activeCategory);
  }, [commands, activeCategory]);

  // Lock body scrolling when search drawer is open
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-start select-none">
        {/* Frosted Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />

        {/* Top-Down Search Drawer Container (slides smoothly from top edge) */}
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-50 w-full max-w-4xl mx-auto bg-[#101010] border-b border-x border-border/80 rounded-b-lg shadow-2xl overflow-hidden flex flex-col"
        >
          <Command
            className="w-full flex flex-col"
            label="Top Search Drawer"
          >
            {/* Top Search Input Row */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/70 bg-[#141414]">
              <Search className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                className="flex-1 h-9 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground font-medium border-none focus:ring-0"
                placeholder={isHindi ? "स्टूडेंट, टीचर, ERP मॉड्यूल, एक्शन या शॉर्टकट सर्च करें..." : "Search students, faculty, ERP modules, actions, shortcuts..."}
                autoFocus
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-xs text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded bg-muted/40 cursor-pointer"
                >
                  {isHindi ? 'क्लियर' : 'Clear'}
                </button>
              )}

              {/* Category Quick Filter Chips */}
              <div className="hidden sm:flex items-center gap-1.5 shrink-0 pl-2 border-l border-border/60">
                {(['all', 'modules', 'actions'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-[#222222] text-foreground border border-border shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {cat === 'all' ? (isHindi ? 'सभी' : 'All') : cat === 'modules' ? (isHindi ? 'मॉड्यूल' : 'Modules') : (isHindi ? 'एक्शन' : 'Actions')}
                  </button>
                ))}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors shrink-0 ml-1 cursor-pointer"
                title={isHindi ? "क्लोज़ (Esc)" : "Close search (Esc)"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Command List */}
            <Command.List className="max-h-[380px] overflow-y-auto p-3 space-y-1 no-scrollbar">
              <Command.Empty className="py-12 text-center text-xs text-muted-foreground space-y-1.5">
                <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="font-bold text-foreground text-sm">{isHindi ? "कोई रिजल्ट नहीं मिला" : "No matching results found"}</p>
                <p className="text-xs text-muted-foreground">{isHindi ? "स्टूडेंट्स, अटेंडेंस, टीचर्स, रिपोर्ट्स या सेटिंग्स सर्च करके देखें" : 'Try searching for "Students", "Attendance", "Teachers", "Reports" or "Settings"'}</p>
              </Command.Empty>

              <Command.Group
                heading={activeCategory === 'all' ? (isHindi ? 'क्विक नेविगेशन व एक्शन्स' : 'Quick Navigation & ERP Actions') : activeCategory === 'modules' ? (isHindi ? 'ERP मॉड्यूल' : 'ERP Modules') : (isHindi ? 'इंस्टीट्यूशनल एक्शन्स' : 'Institutional Actions')}
                className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-extrabold [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest"
              >
                {filteredCommands.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <Command.Item
                      key={cmd.id}
                      value={`${cmd.label} ${cmd.sublabel} ${cmd.category}`}
                      onSelect={cmd.onSelect}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all outline-none text-xs text-left cursor-pointer border border-transparent data-[selected=true]:bg-[#1c1c1c] data-[selected=true]:border-border/80 data-[selected=true]:shadow-xs text-foreground hover:bg-[#181818]"
                    >
                      <div className="h-8 w-8 rounded-md flex items-center justify-center shrink-0 bg-[#1c1c1c] border border-border/80 text-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground truncate leading-tight">{cmd.label}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{cmd.sublabel}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-mono text-muted-foreground bg-[#141414] px-1.5 py-0.5 rounded border border-border/60">
                          {cmd.shortcut}
                        </span>
                        <VFBadge variant="outline" className="text-[10px] font-semibold px-2 py-0.5 bg-[#141414]">
                          {cmd.categoryLabel}
                        </VFBadge>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </Command.Item>
                  );
                })}
              </Command.Group>
            </Command.List>

            {/* Bottom Footer Bar with Shortcuts Info */}
            <div className="px-5 py-2.5 bg-[#121212] border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <kbd className="px-1.5 py-0.5 rounded bg-[#1c1c1c] border border-border font-mono text-[10px] font-bold text-foreground">↑↓</kbd> {isHindi ? 'नेविगेट' : 'Navigate'}
                </span>
                <span className="flex items-center gap-1.5 text-[11px]">
                  <kbd className="px-1.5 py-0.5 rounded bg-[#1c1c1c] border border-border font-mono text-[10px] font-bold text-foreground">↵</kbd> {isHindi ? 'खोलें' : 'Open'}
                </span>
                <span className="flex items-center gap-1.5 text-[11px]">
                  <kbd className="px-1.5 py-0.5 rounded bg-[#1c1c1c] border border-border font-mono text-[10px] font-bold text-foreground">Esc</kbd> {isHindi ? 'बंद करें' : 'Close Drawer'}
                </span>
              </div>

              <span className="text-[11px] font-semibold text-muted-foreground hidden sm:inline">
                {isHindi ? 'कभी भी ' : 'Press '}<kbd className="px-1 py-0.2 bg-[#1c1c1c] border border-border rounded font-mono text-[10px] text-foreground">Ctrl+K</kbd>{isHindi ? ' दबाएं' : ' anytime'}
              </span>
            </div>
          </Command>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
