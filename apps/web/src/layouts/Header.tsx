import * as React from 'react';
import { Search, Bell, Building2, Shield, GraduationCap, Award, BookOpen, Calendar, Clock, ChevronDown, Check, LayoutGrid, PanelLeftClose, PanelLeftOpen, Languages } from 'lucide-react';
import { useRouterState } from '@tanstack/react-router';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';
import { cn } from '@vidyamaxx/ui';

interface HeaderProps {
  onSearchClick: () => void;
  onNotificationsClick: () => void;
}

export function Header({ onSearchClick, onNotificationsClick }: HeaderProps) {
  const {
    notifications,
    schoolProfile,
    activeSession,
    setActiveSession,
    academicSessions,
    isDashboardEditMode,
    toggleDashboardEditMode,
    sidebarExpanded,
    toggleSidebar,
    setLanguage,
    addNotification,
  } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  const [isSessionMenuOpen, setIsSessionMenuOpen] = React.useState(false);
  const sessionMenuRef = React.useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const { location } = useRouterState();
  const isOnDashboard = location.pathname === '/';

  // Universal Live Date & Time Clock
  const [currentDateTime, setCurrentDateTime] = React.useState(() => new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const { dateFormatted, timeFormatted, dayName } = React.useMemo(() => {
    const locale = isHindi ? 'hi-IN' : 'en-US';
    const day = currentDateTime.toLocaleDateString(locale, { weekday: 'short' });
    const date = currentDateTime.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
    const time = currentDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { dayName: day, dateFormatted: date, timeFormatted: time };
  }, [currentDateTime, isHindi]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sessionMenuRef.current && !sessionMenuRef.current.contains(event.target as Node)) {
        setIsSessionMenuOpen(false);
      }
    };
    if (isSessionMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSessionMenuOpen]);

  const getLogoTheme = () => {
    switch (schoolProfile.logoPreset) {
      case 'shield':
        return {
          badge: 'bg-blue-950/30 border-blue-500/35 hover:border-blue-500/55 shadow-[0_0_10px_rgba(59,130,246,0.12)]',
          iconContainer: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
          icon: <Shield className="h-4 w-4 text-blue-400 shrink-0" />,
        };
      case 'graduation':
        return {
          badge: 'bg-purple-950/30 border-purple-500/35 hover:border-purple-500/55 shadow-[0_0_10px_rgba(168,85,247,0.12)]',
          iconContainer: 'bg-purple-500/20 border-purple-500/40 text-purple-400',
          icon: <GraduationCap className="h-4 w-4 text-purple-400 shrink-0" />,
        };
      case 'award':
        return {
          badge: 'bg-amber-950/30 border-amber-500/35 hover:border-amber-500/55 shadow-[0_0_10px_rgba(245,158,11,0.12)]',
          iconContainer: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
          icon: <Award className="h-4 w-4 text-amber-400 shrink-0" />,
        };
      case 'book':
        return {
          badge: 'bg-emerald-950/30 border-emerald-500/35 hover:border-emerald-500/55 shadow-[0_0_10px_rgba(16,185,129,0.12)]',
          iconContainer: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
          icon: <BookOpen className="h-4 w-4 text-emerald-400 shrink-0" />,
        };
      case 'building':
      default:
        return {
          badge: 'bg-orange-950/30 border-orange-500/35 hover:border-orange-500/55 shadow-[0_0_10px_rgba(249,115,22,0.12)]',
          iconContainer: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
          icon: <Building2 className="h-4 w-4 text-orange-400 shrink-0" />,
        };
    }
  };

  const logoTheme = getLogoTheme();

  return (
    <header className="h-[64px] border-b border-border bg-black flex items-center justify-between px-4 sticky top-0 z-20 shrink-0 select-none">
      {/* Left: Sidebar Toggle + Academic Session Dropdown */}
      <div className="flex items-center gap-2.5">
        {/* Sidebar Toggle — same square box as Search/Notification buttons */}
        <button
          onClick={toggleSidebar}
          className="text-muted-foreground hover:text-foreground rounded-md bg-[#0e0e0e] hover:bg-[#161616] border border-border transition-colors outline-none cursor-pointer h-9 w-9 aspect-square flex items-center justify-center shadow-xs shrink-0"
          title={sidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {sidebarExpanded
            ? <PanelLeftClose className="h-4 w-4" />
            : <PanelLeftOpen className="h-4 w-4" />}
        </button>

        <div className="relative" ref={sessionMenuRef}>
          <button
            onClick={() => setIsSessionMenuOpen(!isSessionMenuOpen)}
            className="flex items-center justify-between gap-2.5 px-3 h-9 rounded-md bg-[#0e0e0e] hover:bg-[#161616] border border-border text-foreground shadow-xs transition-all cursor-pointer outline-none group min-w-[215px]"
            title={isHindi ? "एकेडमिक सेशन चेंज करें" : "Switch Academic Session"}
          >
            <Calendar className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <span>{t('dashboard.session')}:</span>
              <span className="text-sm font-bold text-foreground font-mono">
                {activeSession}
              </span>
            </div>
            {activeSession === '2026–2027' && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {t('status.active')}
              </span>
            )}
            <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ml-0.5", isSessionMenuOpen && "rotate-180")} />
          </button>

          {/* Custom Animated Glassmorphic Dropdown Menu */}
          {isSessionMenuOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-lg border border-border bg-[#0e0e0e] shadow-2xl p-1.5 z-50 animate-scale-in space-y-1">
              <div className="px-2.5 py-1.5 border-b border-border/60 mb-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  {isHindi ? 'एकेडमिक सेशन सेलेक्ट करें' : 'Select Academic Session'}
                </span>
              </div>
              {academicSessions.map((session) => {
                const isCurrent = session === activeSession;
                const isActiveAY = session === '2026–2027';
                return (
                  <button
                    key={session}
                    onClick={() => {
                      setActiveSession(session);
                      setIsSessionMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-sm transition-all cursor-pointer text-left font-semibold outline-none",
                      isCurrent
                        ? "bg-[#1c1c1c] text-foreground border border-border font-bold"
                        : "text-muted-foreground hover:text-foreground hover:bg-[#161616]"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-4 flex items-center justify-center shrink-0">
                        {isCurrent ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                        )}
                      </div>
                      <span className="font-mono text-xs">{session}</span>
                    </div>
                    <div>
                      {isActiveAY ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {t('status.active')}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                          {isHindi ? 'आर्काइव्ड' : 'Archived'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: Configure Dashboard Button, Search, Notifications & School Identity */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Configure Dashboard Button — icon-only button visible on the Dashboard page */}
        {isOnDashboard && (
          <button
            onClick={toggleDashboardEditMode}
            type="button"
            className={cn(
              "relative rounded-[4px] border transition-colors outline-none cursor-pointer h-9 w-9 aspect-square flex items-center justify-center shadow-xs group",
              isDashboardEditMode
                ? "bg-amber-500/15 text-amber-400 border-amber-500/50 shadow-xs ring-1 ring-amber-500/40"
                : "bg-[#0e0e0e] hover:bg-[#161616] text-muted-foreground hover:text-foreground border-border"
            )}
            title={isDashboardEditMode ? (isHindi ? "कस्टमाइज़ेशन से बाहर निकलें" : "Exit Dashboard Configuration") : (isHindi ? "डैशबोर्ड कॉन्फ़िगर करें" : "Configure Dashboard & Rearrange Cards")}
            aria-label={isDashboardEditMode ? (isHindi ? "कस्टमाइज़ेशन से बाहर निकलें" : "Exit Dashboard Configuration") : (isHindi ? "डैशबोर्ड कॉन्फ़िगर करें" : "Configure Dashboard & Rearrange Cards")}
          >
            <LayoutGrid className={cn("h-4 w-4 shrink-0 transition-colors", isDashboardEditMode ? "text-amber-400" : "text-muted-foreground group-hover:text-foreground")} />
          </button>
        )}

        {/* Square Search Button Beside Notifications */}
        <button
          onClick={onSearchClick}
          className="relative text-muted-foreground hover:text-foreground rounded-md bg-[#0e0e0e] hover:bg-[#161616] border border-border transition-colors outline-none cursor-pointer h-9 w-9 aspect-square flex items-center justify-center shadow-xs group"
          title={isHindi ? "सर्च करें... (Ctrl+K)" : "Search students, faculty, records... (⌘K / Ctrl+K)"}
        >
          <Search className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        {/* Language Switch Button — Compact icon-only button before notifications */}
        <button
          onClick={() => {
            const nextLang = isHindi ? 'en' : 'hi';
            setLanguage(nextLang);
            addNotification({
              title: nextLang === 'hi' ? 'लैंग्वेज चेंज की गई' : 'Language Changed',
              description: nextLang === 'hi' ? 'प्लेटफॉर्म लैंग्वेज हिन्दी (Hinglish) सेट की गई।' : 'Platform language set to English (Mukta).',
              type: 'info',
            });
          }}
          className="relative text-muted-foreground hover:text-foreground rounded-md bg-[#0e0e0e] hover:bg-[#161616] border border-border transition-colors outline-none cursor-pointer h-9 w-9 aspect-square flex items-center justify-center shadow-xs group"
          title={isHindi ? "Switch to English" : "Switch to हिन्दी"}
          aria-label={isHindi ? "Switch to English" : "Switch to Hindi"}
        >
          <Languages className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        {/* Notifications */}
        <button
          onClick={onNotificationsClick}
          className="relative text-muted-foreground hover:text-foreground rounded-md bg-[#0e0e0e] hover:bg-[#161616] border border-border transition-colors outline-none cursor-pointer h-9 w-9 aspect-square flex items-center justify-center shadow-xs"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" />
          )}
        </button>

        {/* Universal Live Date & Time Indicator */}
        <div className="hidden md:flex items-center justify-between gap-2.5 px-3 h-9 rounded-md bg-[#0e0e0e] border border-border shadow-xs select-none min-w-[230px]" title="Universal Academic System Date & Time">
          <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="font-bold text-foreground">{dayName}, {dateFormatted}</span>
          </div>
          <span className="h-3.5 w-[1px] bg-border shrink-0" />
          <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-zinc-300 bg-[#141414] px-1.5 py-0.5 rounded border border-[#242424]">
            <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
            <span>{timeFormatted}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-5 w-[1px] bg-border mx-0.5 hidden sm:block" />

        {/* Dynamic Colorful School Logo & Name Badge on Right */}
        <div className={cn(
          "flex items-center gap-2 px-2.5 rounded-md border h-9 transition-all shadow-xs",
          logoTheme.badge
        )}>
          <div className={cn(
            "h-6 w-6 rounded flex items-center justify-center shrink-0 overflow-hidden border",
            logoTheme.iconContainer
          )}>
            {schoolProfile.customLogoUrl ? (
              <img
                src={schoolProfile.customLogoUrl}
                alt={schoolProfile.name}
                className="h-full w-full object-contain"
              />
            ) : (
              logoTheme.icon
            )}
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-foreground tracking-tight max-w-[160px] truncate" title={schoolProfile.name}>
            {schoolProfile.name}
          </span>
        </div>
      </div>
    </header>
  );
}
