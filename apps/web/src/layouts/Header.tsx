import * as React from 'react';
import {
  Search,
  Bell,
  Calendar,
  ChevronDown,
  Check,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  Languages,
  Sparkles,
  Building2,
} from 'lucide-react';
import { useRouterState } from '@tanstack/react-router';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';
import { cn } from '@vidyafloww/ui';
import { apiClient, getAuthToken } from '@vidyafloww/api';
import { API_ENDPOINTS } from '@vidyafloww/constants';

interface HeaderProps {
  onSearchClick: () => void;
  onNotificationsClick: () => void;
}

export function Header({ onSearchClick, onNotificationsClick }: HeaderProps) {
  const {
    notifications,
    activeSession,
    setActiveSession,
    academicSessions,
    academicSessionRecords,
    branches,
    activeBranchId,
    setActiveBranch,
    isDashboardEditMode,
    toggleDashboardEditMode,
    sidebarExpanded,
    toggleSidebar,
    setLanguage,
    addNotification,
    toggleAIDrawer,
    isAIDrawerOpen,
  } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  const [isSessionMenuOpen, setIsSessionMenuOpen] = React.useState(false);
  const [isBranchMenuOpen, setIsBranchMenuOpen] = React.useState(false);
  const sessionMenuRef = React.useRef<HTMLDivElement>(null);
  const branchMenuRef = React.useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const { location } = useRouterState();
  const isOnDashboard = location.pathname === '/';
  const currentSessionObj = academicSessionRecords.find((s) => s.is_current);
  const activeBranch = branches.find((b) => b.id === activeBranchId) ?? branches[0] ?? null;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sessionMenuRef.current && !sessionMenuRef.current.contains(event.target as Node)) {
        setIsSessionMenuOpen(false);
      }
      if (branchMenuRef.current && !branchMenuRef.current.contains(event.target as Node)) {
        setIsBranchMenuOpen(false);
      }
    };
    if (isSessionMenuOpen || isBranchMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSessionMenuOpen, isBranchMenuOpen]);

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
            {(currentSessionObj ? activeSession === currentSessionObj.code : activeSession === '2026-2027') && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {t('status.active')}
              </span>
            )}
            <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ml-0.5", isSessionMenuOpen && "rotate-180")} />
          </button>

          {/* Custom Animated Glassmorphic Dropdown Menu */}
          {isSessionMenuOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-[4px] border border-border bg-[#0e0e0e] shadow-2xl p-1.5 z-50 animate-scale-in space-y-1">
              <div className="px-2.5 py-1.5 border-b border-border/60 mb-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  {isHindi ? 'एकेडमिक सेशन सेलेक्ट करें' : 'Select Academic Session'}
                </span>
              </div>
              {academicSessions.map((session) => {
                const isCurrent = session === activeSession;
                const rec = academicSessionRecords.find((r) => r.code === session);
                const isActiveAY = rec ? rec.is_current : session === '2026-2027';
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

        {/* Multi-Branch Campus Switcher (sets X-Branch-ID tenant header) */}
        {branches.length > 0 && activeBranch && (
          <div className="relative" ref={branchMenuRef}>
            <button
              onClick={() => setIsBranchMenuOpen(!isBranchMenuOpen)}
              className="flex items-center gap-2 px-3 h-9 rounded-md bg-[#0e0e0e] hover:bg-[#161616] border border-border text-foreground shadow-xs transition-all cursor-pointer outline-none max-w-[220px]"
              title="Switch Active Campus / Branch"
            >
              <Building2 className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="text-xs font-bold truncate">{activeBranch.code} · {activeBranch.city}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 shrink-0", isBranchMenuOpen && "rotate-180")} />
            </button>
            {isBranchMenuOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-[4px] border border-border bg-[#0e0e0e] shadow-2xl p-1.5 z-50 space-y-1">
                <div className="px-2.5 py-1.5 border-b border-border/60 mb-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Active Campus Branch
                  </span>
                </div>
                {branches.map((br) => {
                  const selected = br.id === activeBranch.id;
                  return (
                    <button
                      key={br.id}
                      onClick={() => {
                        setActiveBranch(br.id);
                        setIsBranchMenuOpen(false);
                        addNotification({
                          title: 'Active Campus Switched',
                          description: `Now scoped to ${br.name} (${br.code}).`,
                          type: 'info',
                        });
                      }}
                      className={cn(
                        "flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs transition-all cursor-pointer text-left",
                        selected ? "bg-[#1c1c1c] text-foreground border border-border font-bold" : "text-muted-foreground hover:text-foreground hover:bg-[#161616]"
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{br.name}</p>
                        <p className="text-[10px] text-muted-foreground">{br.code} · {br.city}</p>
                      </div>
                      {selected && <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
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

        {/* VidyaFloww AI Copilot Trigger */}
        <button
          onClick={toggleAIDrawer}
          type="button"
          className={cn(
            "relative rounded-md border transition-colors outline-none cursor-pointer h-9 w-9 aspect-square flex items-center justify-center shadow-xs group",
            isAIDrawerOpen
              ? "bg-[#1c1c1c] text-primary border-primary/50"
              : "bg-[#0e0e0e] hover:bg-[#161616] text-muted-foreground hover:text-primary border-border"
          )}
          title={isHindi ? "विद्याफ्लो AI को-पायलट (Shift+K)" : "VidyaFloww AI Copilot (Shift+K)"}
          aria-label="VidyaFloww AI Copilot"
        >
          <Sparkles className="h-4 w-4 shrink-0 text-primary transition-colors" />
        </button>

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
            if (getAuthToken()) {
              apiClient.patch(API_ENDPOINTS.AUTH.ME, { preferences: { language: nextLang } }).catch(() => {});
            }
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
      </div>
    </header>
  );
}
