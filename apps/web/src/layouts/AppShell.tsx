import * as React from 'react';
import { Outlet, useLocation } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';
import { NotificationsPanel } from './NotificationsPanel';
import { ToastContainer } from './ToastContainer';
import { AIChatDrawer } from '../components/AIChatDrawer';
import { useGlobalStore, initTheme } from '../stores/globalStore';
import { VFPage } from '@vidyamaxx/ui';
import { Monitor, Smartphone, Laptop, ArrowRight } from 'lucide-react';

function SmallScreenBlocker() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-md">
        {/* Icon stack */}
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-lg bg-card border border-border/80 flex items-center justify-center shadow-lg">
            <Monitor className="h-9 w-9 text-primary" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-md bg-destructive/15 border border-destructive/30 flex items-center justify-center">
            <Smartphone className="h-4 w-4 text-destructive" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-destructive/10 border border-destructive/25 text-destructive text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse inline-block" />
            Screen Too Small
          </span>
        </div>

        <h1 className="text-3xl font-black text-foreground tracking-tight leading-tight mt-3">
          Desktop Required
        </h1>
        <p className="text-base text-muted-foreground mt-3 leading-relaxed">
          VidyaMaxx Command Portal is built exclusively for desktop screens. Your current viewport is too narrow to display it correctly.
        </p>

        {/* Requirement card */}
        <div className="mt-8 w-full bg-card border border-border/70 rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50 bg-muted/30">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Minimum Requirements</p>
          </div>
          <div className="px-5 py-4 flex items-center gap-4">
            <div className="flex-1 flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Laptop className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">1000px minimum width</p>
                <p className="text-xs text-muted-foreground">Desktop or large tablet landscape</p>
              </div>
            </div>
            <div className="shrink-0 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wide rounded-md">
              Required
            </div>
          </div>
        </div>

        {/* Mobile app hint */}
        <div className="mt-4 w-full bg-muted/40 border border-border/50 rounded-lg px-5 py-4 flex items-start gap-3 text-left">
          <Smartphone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Need mobile access?</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Download the VidyaMaxx Mobile App for iOS & Android — full feature parity for parents, students and teachers on the go.
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => window.location.reload()}
          className="mt-6 flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold uppercase tracking-wide px-6 py-2.5 rounded-md transition-all active:scale-95 cursor-pointer"
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
  '/admissions': 'Admissions',
  '/attendance': 'Attendance',
  '/academics': 'Academics',
  '/timetable': 'Timetable',
  '/teachers': 'Teachers',
  '/homework': 'Homework',
  '/examinations': 'Examinations',
  '/statistics': 'Statistics',
  '/fees': 'Payments',
  '/notices': 'Notices',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/shortcuts': 'Quick Shortcuts',
  '/license': 'License Details',
  '/lms': 'E-Learning',
  '/resources': 'Library',
  '/portal': 'Parent Portal',
  '/login': 'Login',
  '/signup': 'Sign Up',
  '/forgot-password': 'Forgot Password',
};

export function AppShell() {
  const location = useLocation();
  const { addNotification, schoolProfile, language, isAIDrawerOpen, setAIDrawerOpen, toggleAIDrawer } = useGlobalStore();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const mainRef = React.useRef<HTMLElement | null>(null);
  const [viewportWidth, setViewportWidth] = React.useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Dynamic Browser Tab Title: VidyaMaxx@{schoolProfile.name} - {pageName}
  React.useEffect(() => {
    const pageName = ROUTE_PAGE_NAMES[location.pathname] || 'Dashboard';
    const schoolName = schoolProfile?.name || 'VidyaMaxx International Academy';
    document.title = `VidyaMaxx@${schoolName} - ${pageName}`;
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

  // Apply language class to <html> for font switching
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
    // Only display the welcome notification immediately after an explicit user login
    const justLoggedIn = sessionStorage.getItem('vidyamaxx_just_logged_in');
    if (justLoggedIn && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/forgot-password') {
      sessionStorage.removeItem('vidyamaxx_just_logged_in');
      const timer = setTimeout(() => {
        addNotification({
          title: 'Welcome to VidyaMaxx',
          description: 'Your enterprise school management platform is ready.',
          type: 'info',
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift+K for VidyaMaxx AI Copilot Drawer
      if (e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleAIDrawer();
      }
      // Ctrl+K / Cmd+K for Command Palette
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleAIDrawer]);

  const isFullScreenPage =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/forgot-password';

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
