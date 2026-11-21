import * as React from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { cn, VFAvatar, VFDialog, VFButton } from '@vidyafloww/ui';
import {
  BarChart3,
  BookMarked,
  BookOpenCheck,
  Calendar,
  CalendarCheck,
  FileSpreadsheet,
  GraduationCap,
  Key,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  MessageSquareWarning,
  School,
  Settings,
  Users,
  Vote,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';
import { TranslationKey } from '../lib/i18n';
import { apiClient } from '@vidyafloww/api';
import { API_ENDPOINTS } from '@vidyafloww/constants';

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
    ],
  },
  {
    id: 'admin-group',
    items: [
      { id: 'statistics', labelKey: 'nav.statistics', route: '/statistics', icon: BarChart3 },
      { id: 'operations', labelKey: 'nav.operations', route: '/operations', icon: BookOpenCheck },
      { id: 'complaints', labelKey: 'nav.complaints', route: '/complaints', icon: MessageSquareWarning },
      { id: 'surveys', labelKey: 'nav.surveys', route: '/surveys', icon: Vote },
      { id: 'reports', labelKey: 'nav.reports', route: '/reports', icon: FileSpreadsheet },
      { id: 'license', labelKey: 'nav.license', route: '/license', icon: Key },
      { id: 'settings', labelKey: 'nav.settings', route: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const { sidebarExpanded, activeSession, addNotification, currentUser, activeMembership, clearAuthSession } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const displayName = currentUser?.full_name || 'Authenticated User';
  const roleLabel = (activeMembership?.user_type || currentUser?.user_type || 'STAFF')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Proceed to clear local session even if token already expired
    } finally {
      clearAuthSession();
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
      addNotification({
        title: isHindi ? 'साइन आउट किया गया' : 'Signed Out',
        description: isHindi ? 'VidyaFlow से सफलतापूर्वक साइन आउट हो गए।' : 'Safely signed out of VidyaFlow.',
        type: 'info',
      });
      navigate({ to: '/login' });
    }
  };

  // Unified fixed expanded width ensuring both English and Devanagari Hindi labels fit comfortably
  const expandedWidth = 240;

  return (
    <aside
      className="flex flex-col h-full bg-black border-r border-border transition-[width] duration-300 ease-in-out relative z-40 shrink-0 select-none overflow-hidden"
      style={{
        width: sidebarExpanded ? `${expandedWidth}px` : '68px',
        minWidth: sidebarExpanded ? `${expandedWidth}px` : '68px',
      }}
    >
      {/* ── HEADER ── 64px height, perfectly centered in collapsed mode */}
      <div
        className={cn(
          'flex h-[64px] items-center border-b border-border bg-black relative shrink-0 transition-all duration-300',
          sidebarExpanded ? 'px-4 justify-start' : 'px-0 justify-center'
        )}
      >
        {/* Logo: strictly centered when collapsed at x = 34px */}
        <div className="h-8 w-8 min-w-[32px] shrink-0 flex items-center justify-center overflow-hidden">
          <img src="/logo.png" alt="VidyaFlow Logo" className="h-8 w-8 object-contain" />
        </div>

        {/* Brand text */}
        {sidebarExpanded && (
          <div className="flex flex-col min-w-0 overflow-hidden whitespace-nowrap ml-3">
            <span className="text-[17px] font-black tracking-tight leading-none text-foreground">
              Vidya<span className="text-primary">Flow</span>
            </span>
          </div>
        )}
      </div>

      {/* ── NAV LIST ── perfectly centered with identical 4-side padding in collapsed mode */}
      <div className={cn('flex-1 overflow-y-auto no-scrollbar py-3', sidebarExpanded ? 'px-3.5' : 'px-0')}>
        {NAVIGATION_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx}>
            {/* Divider between navigation groups */}
            {groupIdx > 0 && (
              <div className={cn('h-[1px] bg-border my-2.5', sidebarExpanded ? '-mx-3.5' : 'w-full')} />
            )}

            <div className={cn('flex flex-col gap-1.5', !sidebarExpanded && 'items-center')}>
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
                      'flex items-center h-10 rounded-[4px] border outline-none overflow-hidden transition-all duration-150',
                      sidebarExpanded
                        ? 'w-full px-3 justify-start'
                        : 'w-10 h-10 justify-center p-0',
                      isActive
                        ? 'bg-[#1c1c1c] border-[#323232] text-foreground font-bold shadow-xs'
                        : 'border-transparent text-muted-foreground hover:bg-[#141414] hover:text-foreground font-medium'
                    )}
                  >
                    {/* Icon: always visible, fixed 18px */}
                    <Icon
                      className={cn(
                        'shrink-0 h-[18px] w-[18px]',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    />

                    {/* Label: only rendered when sidebar is expanded for clean zero-offset centering when collapsed */}
                    {sidebarExpanded && (
                      <span className="text-sm leading-snug overflow-hidden font-[inherit] whitespace-nowrap truncate ml-2.5">
                        {label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── BOTTOM USER PROFILE CARD ── perfectly centered in collapsed mode */}
      <div className={cn('border-t border-border bg-black shrink-0 py-3', sidebarExpanded ? 'px-3.5' : 'px-0')}>
        <div
          className={cn(
            'flex items-center h-10 overflow-hidden rounded-[4px] cursor-pointer hover:bg-[#141414] transition-colors',
            sidebarExpanded ? 'w-full px-2 justify-start' : 'w-10 h-10 mx-auto justify-center p-0'
          )}
          onClick={() => {
            if (!sidebarExpanded) setIsLogoutModalOpen(true);
          }}
          title={!sidebarExpanded ? `${displayName} (${roleLabel}) - Click to Sign Out` : undefined}
        >
          {/* Avatar: strictly 32px, centered when collapsed */}
          <div className="h-8 w-8 min-w-[32px] max-w-[32px] shrink-0 flex items-center justify-center">
            <VFAvatar fallback={displayName} size="sm" className="h-8 w-8 text-xs font-bold rounded-[4px] bg-amber-500/20 text-amber-400 border border-amber-500/30" />
          </div>

          {/* User info: visible when expanded */}
          {sidebarExpanded && (
            <div className="flex flex-col min-w-0 overflow-hidden whitespace-nowrap ml-2.5">
              <p className="text-xs font-bold text-foreground truncate leading-none">{displayName}</p>
              <p className="text-[10px] text-muted-foreground font-semibold truncate mt-[3px]">{roleLabel}</p>
            </div>
          )}

          {/* Sign-out button: visible when expanded */}
          {sidebarExpanded && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLogoutModalOpen(true);
              }}
              title="Sign Out of VidyaFlow"
              aria-label="Sign Out of VidyaFlow"
              className="ml-auto text-muted-foreground hover:text-rose-400 p-1.5 rounded-[4px] hover:bg-white/5 transition-colors duration-200 shrink-0 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
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
              className="rounded-[4px]"
            >
              {t('action.cancel')}
            </VFButton>
            <VFButton
              variant="danger"
              size="sm"
              disabled={isLoggingOut}
              leftIcon={<LogOut className="h-3.5 w-3.5" />}
              className="rounded-[4px] font-bold"
              onClick={handleConfirmLogout}
            >
              {isLoggingOut ? (isHindi ? 'साइन आउट हो रहा है...' : 'Signing out...') : t('action.signOut')}
            </VFButton>
          </div>
        }
      >
        <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 text-xs text-muted-foreground space-y-1">
          <p>User: <strong className="text-foreground">{displayName}</strong> ({roleLabel})</p>
          <p>Session: <strong className="text-emerald-400 font-mono">{activeSession}</strong></p>
        </div>
      </VFDialog>
    </aside>
  );
}
