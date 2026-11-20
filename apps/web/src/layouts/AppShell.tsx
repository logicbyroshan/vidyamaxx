import * as React from 'react';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';
import { NotificationsPanel } from './NotificationsPanel';
import { ToastContainer } from './ToastContainer';
import { AIChatDrawer } from '../components/AIChatDrawer';
import {
  useGlobalStore,
  initTheme,
  type AcademicSessionSummary,
  type BranchSummary,
  type Notification,
} from '../stores/globalStore';
import {
  apiClient,
  getAuthToken,
  registerAuthFailureHandler,
  setAuthToken,
} from '@vidyafloww/api';
import { API_ENDPOINTS } from '@vidyafloww/constants';
import { VFPage } from '@vidyafloww/ui';
import { Monitor, Smartphone, Laptop, ArrowRight, RefreshCw } from 'lucide-react';

function SmallScreenBlocker() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md">
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-[4px] bg-card border border-border/80 flex items-center justify-center shadow-lg">
            <Monitor className="h-9 w-9 text-primary" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-[4px] bg-destructive/15 border border-destructive/30 flex items-center justify-center">
            <Smartphone className="h-4 w-4 text-destructive" />
          </div>
        </div>

        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-destructive/10 border border-destructive/25 text-destructive text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-[4px]">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse inline-block" />
            Screen Too Small
          </span>
        </div>

        <h1 className="text-3xl font-black text-foreground tracking-tight leading-tight mt-3">
          Desktop Required
        </h1>
        <p className="text-base text-muted-foreground mt-3 leading-relaxed">
          VidyaFloww Command Portal is built exclusively for desktop screens. Your current viewport is too narrow to display it correctly.
        </p>

        <div className="mt-8 w-full bg-card border border-border/70 rounded-[4px] overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50 bg-muted/30">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Minimum Requirements</p>
          </div>
          <div className="px-5 py-4 flex items-center gap-4">
            <div className="flex-1 flex items-center gap-3">
              <div className="h-9 w-9 rounded-[4px] bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Laptop className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">1000px minimum width</p>
                <p className="text-xs text-muted-foreground">Desktop or large tablet landscape</p>
              </div>
            </div>
            <div className="shrink-0 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wide rounded-[4px]">
              Required
            </div>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold uppercase tracking-wide px-6 py-2.5 rounded-[4px] transition-all active:scale-95 cursor-pointer"
        >
          Try Again
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="text-xs text-muted-foreground mt-4">
          Current viewport: <span className="text-foreground font-bold">{typeof window !== 'undefined' ? window.innerWidth : '—'}px</span>
          &nbsp;·&nbsp; Required: <span className="text-primary font-bold">≥ 1000px</span>
        </p>
      </div>
    </div>
  );
}

const ROUTE_PAGE_NAMES: Record<string, string> = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/students': 'Students',
  '/attendance': 'Attendance',
  '/academics': 'Academics',
  '/timetable': 'Timetable',
  '/teachers': 'Teachers',
  '/teaching': 'Teaching Workspace',
  '/homework': 'Homework',
  '/statistics': 'Statistics',
  '/complaints': 'Complaints & Helpdesk',
  '/surveys': 'Surveys',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/security': 'Security & Permissions',
  '/audit': 'Audit Trail',
  '/shortcuts': 'Quick Shortcuts',
  '/license': 'License Details',
  '/login': 'Login',
  '/signup': 'Sign Up',
  '/forgot-password': 'Forgot Password',
};

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    authStatus,
    setAuthStatus,
    setAuthSession,
    clearAuthSession,
    setBranches,
    setAcademicSessionRecords,
    setNotificationsFromServer,
    updateSchoolProfile,
    addNotification,
    schoolProfile,
    language,
    isAIDrawerOpen,
    setAIDrawerOpen,
    toggleAIDrawer,
  } = useGlobalStore();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const mainRef = React.useRef<HTMLElement | null>(null);
  const [viewportWidth, setViewportWidth] = React.useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const isFullScreenPage =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/forgot-password';

  // Register global 401 failure handler
  React.useEffect(() => {
    registerAuthFailureHandler(() => {
      clearAuthSession();
      if (window.location.pathname !== '/login') {
        navigate({ to: '/login' });
      }
    });
    return () => registerAuthFailureHandler(null);
  }, [clearAuthSession, navigate]);

  // Bootstrap real session, school profile, branches, sessions & notifications on app load
  React.useEffect(() => {
    if (isFullScreenPage) return;
    if (authStatus === 'authenticated' && getAuthToken()) return;

    let cancelled = false;
    async function bootstrapSession() {
      setAuthStatus('checking');
      try {
        // Attempt silent refresh from HttpOnly cookie if in-memory token was cleared by page reload
        if (!getAuthToken()) {
          const refreshRes = await apiClient.post<{ access_token: string }>(API_ENDPOINTS.AUTH.REFRESH);
          if (refreshRes.data?.access_token) {
            setAuthToken(refreshRes.data.access_token);
          }
        }

        if (!getAuthToken()) {
          if (!cancelled) {
            clearAuthSession();
            navigate({ to: '/login' });
          }
          return;
        }

        const meRes = await apiClient.get(API_ENDPOINTS.AUTH.ME);
        if (cancelled) return;

        const me = meRes.data;
        const activeMem = me.active_membership ?? me.memberships?.[0] ?? null;
        setAuthSession({
          user: me.user,
          activeMembership: activeMem,
          memberships: me.memberships ?? [],
          responsibilities: me.responsibilities ?? [],
        });

        // Hydrate school branding, branches, academic sessions, and notifications in parallel
        const [schoolRes, branchesRes, sessionsRes, notifsRes] = await Promise.allSettled([
          apiClient.get(API_ENDPOINTS.SCHOOLS.CURRENT),
          apiClient.get(API_ENDPOINTS.SCHOOLS.BRANCHES),
          apiClient.get(API_ENDPOINTS.ACADEMICS.SESSIONS),
          apiClient.get(API_ENDPOINTS.NOTIFICATIONS.LIST),
        ]);

        if (cancelled) return;

        if (schoolRes.status === 'fulfilled') {
          const sc = schoolRes.value.data?.school ?? schoolRes.value.data?.data ?? schoolRes.value.data;
          if (sc?.name) {
            updateSchoolProfile({
              id: sc.id,
              name: sc.name,
              shortCode: sc.short_code || schoolProfile.shortCode,
              tagline: sc.tagline || schoolProfile.tagline,
              affiliation: sc.affiliation_number
                ? `${sc.board_affiliation || 'CBSE'} Affiliation #${sc.affiliation_number}`
                : schoolProfile.affiliation,
              city: sc.city || schoolProfile.city,
              establishedYear: sc.established_year,
              academicLevel: sc.academic_level,
              principalName: sc.principal_name,
              customLogoUrl: sc.logo_url || '',
            });
          }
        }

        if (branchesRes.status === 'fulfilled') {
          const rows = (branchesRes.value.data?.results ?? branchesRes.value.data?.data ?? []) as BranchSummary[];
          if (Array.isArray(rows) && rows.length > 0) {
            setBranches(rows);
          }
        }

        if (sessionsRes.status === 'fulfilled') {
          const rows = (sessionsRes.value.data?.results ?? sessionsRes.value.data?.data ?? []) as AcademicSessionSummary[];
          if (Array.isArray(rows) && rows.length > 0) {
            setAcademicSessionRecords(rows);
          }
        }

        if (notifsRes.status === 'fulfilled') {
          const raw = notifsRes.value.data?.results ?? notifsRes.value.data?.data ?? [];
          if (Array.isArray(raw)) {
            const mapped: Notification[] = raw.map((n: Record<string, unknown>) => ({
              id: String(n.id),
              title: String(n.title ?? ''),
              description: n.description ? String(n.description) : undefined,
              type: (['success', 'error', 'warning', 'info'].includes(String(n.notification_type))
                ? String(n.notification_type)
                : 'info') as Notification['type'],
              read: Boolean(n.is_read),
              createdAt: n.created_at ? new Date(String(n.created_at)).getTime() : Date.now(),
              actionUrl: n.action_url ? String(n.action_url) : undefined,
              fromServer: true,
            }));
            setNotificationsFromServer(mapped);
          }
        }
      } catch {
        if (!cancelled) {
          clearAuthSession();
          navigate({ to: '/login' });
        }
      }
    }

    bootstrapSession();
    return () => {
      cancelled = true;
    };
  }, [
    isFullScreenPage,
    authStatus,
    setAuthStatus,
    setAuthSession,
    clearAuthSession,
    setBranches,
    setAcademicSessionRecords,
    setNotificationsFromServer,
    updateSchoolProfile,
    navigate,
  ]);

  // Dynamic Browser Tab Title
  React.useEffect(() => {
    const pageName = ROUTE_PAGE_NAMES[location.pathname] || 'Dashboard';
    const schoolName = schoolProfile?.name || 'VidyaFloww International Academy';
    document.title = `VidyaFloww@${schoolName} - ${pageName}`;
  }, [location.pathname, schoolProfile?.name]);

  // Scroll to top on route change
  React.useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  React.useEffect(() => {
    const checkWidth = () => setViewportWidth(window.innerWidth);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  React.useEffect(() => {
    const html = document.documentElement;
    if (language === 'hi') {
      html.classList.add('lang-hi');
      html.setAttribute('lang', 'hi');
    } else {
      html.classList.remove('lang-hi');
      html.setAttribute('lang', 'en');
    }
  }, [language]);

  React.useEffect(() => {
    initTheme();
    const justLoggedIn = sessionStorage.getItem('vidyafloww_just_logged_in');
    if (justLoggedIn && !isFullScreenPage) {
      sessionStorage.removeItem('vidyafloww_just_logged_in');
      const timer = setTimeout(() => {
        addNotification({
          title: 'Welcome to VidyaFloww',
          description: 'Your authenticated enterprise school workspace is connected.',
          type: 'success',
        });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isFullScreenPage, addNotification]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleAIDrawer();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleAIDrawer]);

  if (isFullScreenPage) {
    return (
      <div className="w-full min-h-screen bg-black text-foreground overflow-hidden">
        <Outlet />
      </div>
    );
  }

  if (viewportWidth < 1000) {
    return <SmallScreenBlocker />;
  }

  if (authStatus === 'checking' || authStatus === 'idle') {
    return (
      <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        <p className="text-xs font-mono uppercase tracking-widest">Verifying VidyaFloww Session...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-black min-h-screen">
      <div className="max-w-[2000px] mx-auto min-w-[1000px] h-screen overflow-hidden flex flex-row bg-black">
        <VFPage className="flex-row h-screen overflow-hidden w-full bg-black">
          <Sidebar />
          <div className="flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300 ease-in-out min-w-0 bg-background">
            <Header
              onSearchClick={() => setIsCommandPaletteOpen(true)}
              onNotificationsClick={() => setIsNotificationsOpen(true)}
            />
            <main ref={mainRef} className="flex-1 overflow-y-auto no-scrollbar min-w-0 bg-background relative flex flex-col overflow-x-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="w-full flex-1 flex flex-col min-h-full"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
          <CommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
          />
          <NotificationsPanel
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
          <AIChatDrawer
            isOpen={isAIDrawerOpen}
            onClose={() => setAIDrawerOpen(false)}
          />
          <ToastContainer />
        </VFPage>
      </div>
    </div>
  );
}
