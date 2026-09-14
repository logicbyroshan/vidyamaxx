import * as React from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { cn, VFAvatar, VFDialog, VFButton } from '@vidyamaxx/ui';
import {
  Award,
  BarChart3,
  Bell,
  BookMarked,
  BookOpenCheck,
  Building2,
  Bus,
  Calendar,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  FileSpreadsheet,
  GraduationCap,
  Key,
  LayoutDashboard,
  Library,
  LogOut,
  LucideIcon,
  MessageSquareWarning,
  Palette,
  School,
  Settings,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
  Video,
  Vote,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';
import { TranslationKey } from '../lib/i18n';

interface NavItem {
  id: string;
  labelKey: TranslationKey;
  route: string;
  icon: LucideIcon;
}

interface NavGroup {
  id: string;
  labelKey?: TranslationKey;
  items: NavItem[];
}

const NAVIGATION_GROUPS: NavGroup[] = [
  {
    id: 'primary',
    items: [
      { id: 'dashboard', labelKey: 'nav.dashboard', route: '/', icon: LayoutDashboard },
    ],
  },
  {
    id: 'core',
    items: [
      { id: 'students', labelKey: 'nav.students', route: '/students', icon: GraduationCap },
      { id: 'admissions', labelKey: 'nav.admissions', route: '/admissions', icon: UserPlus },
      { id: 'attendance', labelKey: 'nav.attendance', route: '/attendance', icon: CalendarCheck },
      { id: 'timetable', labelKey: 'nav.timetable', route: '/timetable', icon: Calendar },
      { id: 'teachers', labelKey: 'nav.teachers', route: '/teachers', icon: Users },
    ],
  },
  {
    id: 'academics-group',
    items: [
      { id: 'academics', labelKey: 'nav.academics', route: '/academics', icon: School },
      { id: 'teaching', labelKey: 'nav.teaching', route: '/teaching', icon: BookOpenCheck },
      { id: 'homework', labelKey: 'nav.homework', route: '/homework', icon: BookMarked },
      { id: 'examinations', labelKey: 'nav.examinations', route: '/examinations', icon: ClipboardList },
    ],
  },
  {
    id: 'subsystems-group',
    items: [
      { id: 'hrmanage', labelKey: 'nav.hrManage', route: '/hr-manage', icon: UserCheck },
      { id: 'eclass', labelKey: 'nav.eclass', route: '/e-class', icon: Video },
      { id: 'elibrary', labelKey: 'nav.elibrary', route: '/elibrary', icon: Library },
      { id: 'transport', labelKey: 'nav.transport', route: '/transport', icon: Bus },
      { id: 'hostel', labelKey: 'nav.hostel', route: '/hostel', icon: Building2 },
      { id: 'designlab', labelKey: 'nav.designLab', route: '/design-lab', icon: Palette },
    ],
  },
  {
    id: 'finance-group',
    items: [
      { id: 'fees', labelKey: 'nav.fees', route: '/fees', icon: CreditCard },
      { id: 'scholarships', labelKey: 'nav.scholarships', route: '/scholarships', icon: Award },
    ],
  },
  {
    id: 'admin-group',
    items: [
      { id: 'statistics', labelKey: 'nav.statistics', route: '/statistics', icon: BarChart3 },
      { id: 'notices', labelKey: 'nav.notices', route: '/notices', icon: Bell },
      { id: 'complaints', labelKey: 'nav.complaints', route: '/complaints', icon: MessageSquareWarning },
      { id: 'surveys', labelKey: 'nav.surveys', route: '/surveys', icon: Vote },
      { id: 'reports', labelKey: 'nav.reports', route: '/reports', icon: FileSpreadsheet },
      { id: 'license', labelKey: 'nav.license', route: '/license', icon: Key },
      { id: 'settings', labelKey: 'nav.settings', route: '/settings', icon: Settings },
    ],
  },
];

const COLLAPSED_ICON_PL = 11;
const EXPANDED_LINK_PL = 12;
const EXPANDED_ICON_GAP = 10;

export function Sidebar() {
  const { sidebarExpanded, activeSession, addNotification, toggleAIDrawer, isAIDrawerOpen } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  // Unified fixed expanded width ensuring both English and Devanagari Hindi labels fit comfortably with ample breathing room and never shift or resize layout on language toggle
  const expandedWidth = 240;

  return (
    <aside
      className="flex flex-col h-full bg-black border-r border-border transition-[width] duration-300 ease-in-out relative z-40 shrink-0 select-none overflow-hidden"
      style={{
        width: sidebarExpanded ? `${expandedWidth}px` : '68px',
        minWidth: sidebarExpanded ? `${expandedWidth}px` : '68px',
      }}
    >
      {/* ── HEADER ── 64px height, balanced padding matching logo center */}
      <div
        className="flex h-[64px] items-center border-b border-border bg-black relative shrink-0"
        style={{
          paddingLeft: sidebarExpanded ? '16px' : '18px',
          paddingRight: sidebarExpanded ? '16px' : '18px',
          transition: 'padding 300ms ease-in-out',
        }}
      >
        {/* Logo: strictly centered when collapsed at x = 34px */}
        <div className="h-8 w-8 min-w-[32px] shrink-0 flex items-center justify-center overflow-hidden">
          <img src="/logo.png" alt="VidyaMaxx Logo" className="h-8 w-8 object-contain" />
        </div>

        {/* Brand text: CSS-only fade + collapse */}
        <div
          className="flex flex-col min-w-0 overflow-hidden whitespace-nowrap"
          style={{
            opacity: sidebarExpanded ? 1 : 0,
            maxWidth: sidebarExpanded ? '160px' : '0px',
            marginLeft: sidebarExpanded ? '12px' : '0px',
            transition: 'opacity 300ms ease-in-out, max-width 300ms ease-in-out, margin-left 300ms ease-in-out',
          }}
        >
          <span className="text-[17px] font-black tracking-tight leading-none text-foreground">
            Vidya<span className="text-primary">Maxx</span>
          </span>
          <span className="text-[9px] text-muted-foreground font-bold tracking-wider uppercase mt-[3px]">
            {t('page.settings')} &amp; Management
          </span>
        </div>
      </div>

      {/* ── NAV LIST ── px-3.5 outer padding for balanced 68px geometry */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3">
        {NAVIGATION_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx}>
            {/* Full-bleed divider: -mx-3.5 cancels the container padding */}
            {groupIdx > 0 && (
              <div className="-mx-3.5 h-[1px] bg-border mt-3 mb-3" />
            )}

            <div className="flex flex-col gap-1.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const label = t(item.labelKey);
                const isActive =
                  item.route === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.route);

                return (
                  <Link
                    key={item.id}
                    to={item.route}
                    title={!sidebarExpanded ? label : undefined}
                    className={cn(
                      'flex items-center h-10 w-full rounded-md border outline-none overflow-hidden',
                      'transition-colors duration-150',
                      isActive
                        ? 'bg-[#1c1c1c] border-[#323232] text-foreground font-bold shadow-xs'
                        : 'border-transparent text-muted-foreground hover:bg-[#141414] hover:text-foreground font-medium'
                    )}
                    style={{
                      // paddingLeft centers the 18px icon at x = 34px in collapsed 68px bar
                      paddingLeft: sidebarExpanded ? `${EXPANDED_LINK_PL}px` : `${COLLAPSED_ICON_PL}px`,
                      paddingRight: sidebarExpanded ? `${EXPANDED_LINK_PL}px` : '11px',
                      transition: 'padding 300ms ease-in-out, background-color 150ms, border-color 150ms',
                    }}
                  >
                    {/* Icon: always visible, fixed 18px */}
                    <Icon
                      className={cn(
                        'shrink-0 h-[18px] w-[18px]',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    />

                    {/* Label: CSS fade + collapse — ample 165px maxWidth fits both English & Devanagari without touching edge */}
                    <span
                      className="text-sm leading-snug overflow-hidden font-[inherit] whitespace-nowrap truncate"
                      style={{
                        opacity: sidebarExpanded ? 1 : 0,
                        maxWidth: sidebarExpanded ? '175px' : '0px',
                        marginLeft: sidebarExpanded ? `${EXPANDED_ICON_GAP}px` : '0px',
                        transition: 'opacity 300ms ease-in-out, max-width 300ms ease-in-out, margin-left 300ms ease-in-out',
                      }}
                    >
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
 
      {/* ── AI COPILOT BUTTON ── prominent entry point above user profile card */}
      <div className="border-t border-border bg-black shrink-0 px-3.5 py-2">
        <button
          type="button"
          onClick={() => toggleAIDrawer()}
          title={!sidebarExpanded ? (isHindi ? 'विद्यामैक्स AI (Shift+K)' : 'VidyaMaxx AI Copilot (Shift+K)') : undefined}
          className={cn(
            'flex items-center h-10 w-full rounded-md border outline-none overflow-hidden cursor-pointer select-none',
            'transition-colors duration-150',
            isAIDrawerOpen
              ? 'bg-[#1c1c1c] border-primary/50 text-primary shadow-xs'
              : 'border-border/80 bg-[#121212] text-foreground hover:bg-[#181818] hover:border-zinc-700'
          )}
          style={{
            paddingLeft: sidebarExpanded ? `${EXPANDED_LINK_PL}px` : `${COLLAPSED_ICON_PL}px`,
            paddingRight: sidebarExpanded ? `${EXPANDED_LINK_PL}px` : '11px',
            transition: 'padding 300ms ease-in-out, background-color 150ms, border-color 150ms',
          }}
        >
          <Sparkles className="shrink-0 h-[18px] w-[18px] text-primary" />
          <span
            className="text-sm font-bold text-foreground overflow-hidden font-[inherit] whitespace-nowrap truncate"
            style={{
              opacity: sidebarExpanded ? 1 : 0,
              maxWidth: sidebarExpanded ? '125px' : '0px',
              marginLeft: sidebarExpanded ? `${EXPANDED_ICON_GAP}px` : '0px',
              transition: 'opacity 300ms ease-in-out, max-width 300ms ease-in-out, margin-left 300ms ease-in-out',
            }}
          >
            {isHindi ? 'विद्यामैक्स AI' : 'VidyaMaxx AI'}
          </span>
          <span
            className="ml-auto text-[10px] font-mono font-bold text-muted-foreground bg-[#1c1c1c] px-1.5 py-0.5 rounded border border-border/60 shrink-0"
            style={{
              opacity: sidebarExpanded ? 1 : 0,
              maxWidth: sidebarExpanded ? '32px' : '0px',
              transition: 'opacity 300ms ease-in-out, max-width 300ms ease-in-out',
            }}
          >
            ⇧K
          </span>
        </button>
      </div>

      {/* ── BOTTOM USER PROFILE CARD ── px-3.5 py-3, perfectly centered in collapsed mode */}
      <div className="border-t border-border bg-black shrink-0 px-3.5 py-3">
        <div
          className="flex items-center h-10 w-full overflow-hidden rounded-md cursor-pointer hover:bg-[#141414] transition-colors"
          onClick={() => {
            if (!sidebarExpanded) setIsLogoutModalOpen(true);
          }}
          title={!sidebarExpanded ? 'Roshan Singh (Super Admin) - Click to Sign Out' : undefined}
          style={{
            paddingLeft: sidebarExpanded ? '4px' : '4px',
            paddingRight: sidebarExpanded ? '8px' : '4px',
            transition: 'padding 300ms ease-in-out',
          }}
        >
          {/* Avatar: strictly 32px, centered with 4px margin on each side when collapsed */}
          <div className="h-8 w-8 min-w-[32px] max-w-[32px] shrink-0 flex items-center justify-center">
            <VFAvatar fallback="Roshan Singh" size="sm" className="h-8 w-8 text-xs font-bold rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30" />
          </div>

          {/* User info: fades on collapse */}
          <div
            className="flex flex-col min-w-0 overflow-hidden whitespace-nowrap"
            style={{
              opacity: sidebarExpanded ? 1 : 0,
              maxWidth: sidebarExpanded ? '120px' : '0px',
              marginLeft: sidebarExpanded ? `${EXPANDED_ICON_GAP}px` : '0px',
              transition: 'opacity 300ms ease-in-out, max-width 300ms ease-in-out, margin-left 300ms ease-in-out',
            }}
          >
            <p className="text-xs font-bold text-foreground truncate leading-none">Roshan Singh</p>
            <p className="text-[10px] text-muted-foreground font-semibold truncate mt-[3px]">Super Admin</p>
          </div>

          {/* Sign-out button: visible when expanded */}
          <div
            className="ml-auto overflow-hidden flex items-center"
            style={{
              opacity: sidebarExpanded ? 1 : 0,
              maxWidth: sidebarExpanded ? '32px' : '0px',
              transition: 'opacity 300ms ease-in-out, max-width 300ms ease-in-out',
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLogoutModalOpen(true);
              }}
              title="Sign Out of VidyaMaxx"
              className="text-muted-foreground hover:text-rose-400 p-1.5 rounded-md hover:bg-[#1f1f1f] transition-colors duration-200 shrink-0 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <VFDialog
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title={t('action.signOut') + '?'}
        description={isHindi ? 'करेंट सेशन एंड करें? आप अपने क्रेडेंशियल्स के साथ कभी भी वापस साइन इन कर सकते हैं।' : 'End your current session? You can sign back in anytime with your institutional credentials.'}
        className="max-w-md"
        footerActions={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <VFButton
              variant="outline"
              size="sm"
              onClick={() => setIsLogoutModalOpen(false)}
              className="rounded-md"
            >
              {t('action.cancel')}
            </VFButton>
            <VFButton
              variant="danger"
              size="sm"
              leftIcon={<LogOut className="h-3.5 w-3.5" />}
              className="rounded-md font-bold"
              onClick={() => {
                setIsLogoutModalOpen(false);
                addNotification({
                  title: isHindi ? 'साइन आउट किया गया' : 'Signed Out',
                  description: isHindi ? 'VidyaMaxx से सफलतापूर्वक साइन आउट हो गए।' : 'Safely signed out of VidyaMaxx.',
                  type: 'info',
                });
                navigate({ to: '/' });
              }}
            >
              {t('action.signOut')}
            </VFButton>
          </div>
        }
      >
        <div className="p-3.5 rounded-md bg-[#141414] border border-border/80 text-xs text-muted-foreground space-y-1">
          <p>User: <strong className="text-foreground">Roshan Singh</strong> (Super Admin)</p>
          <p>Session: <strong className="text-emerald-400 font-mono">{activeSession}</strong></p>
        </div>
      </VFDialog>
    </aside>
  );
}
