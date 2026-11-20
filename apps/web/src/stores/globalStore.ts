import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clearSessionTokens, setTenantHeaders } from '@vidyafloww/api';

// Theme is permanently dark — no light/system mode
export type Theme = 'dark';

export type Language = 'en' | 'hi';

export type AuthStatus = 'idle' | 'checking' | 'authenticated' | 'unauthenticated';

export interface AuthUser {
  id: string;
  full_name: string;
  hindi_name?: string;
  email: string | null;
  phone: string | null;
  is_verified: boolean;
  user_type?: string | null;
  active_school_id?: string | null;
}

export interface UserMembership {
  id: string;
  user_type: string;
  tenant_id: string;
  tenant_name: string;
  school_id: string | null;
  school_name: string | null;
  school_code: string | null;
  default_branch_id: string | null;
  preferences?: Record<string, unknown>;
}

export interface StaffResponsibilityScope {
  id: string;
  work_division: string;
  submodule_code?: string;
  actions: string[];
  branch_ids?: string[];
  grade_class_ids?: string[];
  section_ids?: string[];
  subject_ids?: string[];
}

export interface BranchSummary {
  id: string;
  code: string;
  name: string;
  city: string;
  board?: string;
  principal_name?: string;
  is_primary?: boolean;
  status: string;
}

export interface AcademicSessionSummary {
  id: string;
  code: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface Notification {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  read: boolean;
  createdAt: number;
  actionUrl?: string;
  fromServer?: boolean;
}

export interface SchoolProfile {
  id?: string;
  name: string;
  shortCode: string;
  tagline: string;
  affiliation: string;
  logoType: 'icon' | 'custom_image' | 'preset';
  logoPreset: 'building' | 'shield' | 'graduation' | 'award' | 'book';
  customLogoUrl?: string;
  city: string;
  establishedYear?: string;
  academicLevel?: string;
  principalName?: string;
}

export const DEFAULT_DASHBOARD_SHORTCUTS = [
  'attendance',
  'students',
  'teachers',
  'timetable',
  'academics',
  'teaching',
  'homework',
  'statistics',
  'complaints',
  'surveys',
  'reports',
  'settings',
];

export const DEFAULT_DASHBOARD_SECTIONS = [
  'quick_shortcuts',
  'student_attendance',
];

export const DEFAULT_DASHBOARD_KPIS = [
  'students',
  'teachers',
  'attendance',
  'admissions',
];

interface GlobalState {
  // Theme (always dark)
  theme: Theme;

  // Auth & Tenant Context
  authStatus: AuthStatus;
  currentUser: AuthUser | null;
  activeMembership: UserMembership | null;
  memberships: UserMembership[];
  responsibilities: StaffResponsibilityScope[];
  branches: BranchSummary[];
  activeBranchId: string | null;
  academicSessionRecords: AcademicSessionSummary[];
  setAuthStatus: (status: AuthStatus) => void;
  setAuthSession: (payload: {
    user: AuthUser;
    activeMembership: UserMembership | null;
    memberships: UserMembership[];
    responsibilities?: StaffResponsibilityScope[];
  }) => void;
  clearAuthSession: () => void;
  setBranches: (branches: BranchSummary[]) => void;
  setActiveBranch: (branchId: string | null) => void;
  switchActiveSchool: (schoolId: string) => void;
  setAcademicSessionRecords: (records: AcademicSessionSummary[]) => void;
  hasDivisionAccess: (division: string, action?: string) => boolean;

  // Language / Locale
  language: Language;
  setLanguage: (lang: Language) => void;

  // School Identity & Branding
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;

  // Academic Sessions & Active Session State
  academicSessions: string[];
  activeSession: string;
  setActiveSession: (session: string) => void;

  // Sidebar
  sidebarExpanded: boolean;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;

  // First-visit preloader flag
  hasSeenPreloader: boolean;
  setHasSeenPreloader: () => void;

  // Dashboard Edit Mode & Layout Customization
  isDashboardEditMode: boolean;
  toggleDashboardEditMode: () => void;
  setDashboardEditMode: (val: boolean) => void;

  dashboardSectionOrder: string[];
  setDashboardSectionOrder: (sections: string[]) => void;
  resetDashboardSectionOrder: () => void;

  dashboardKpiOrder: string[];
  setDashboardKpiOrder: (kpis: string[]) => void;
  resetDashboardKpiOrder: () => void;

  // Dashboard Quick Action Shortcuts Configuration
  dashboardShortcuts: string[];
  setDashboardShortcuts: (shortcuts: string[]) => void;
  resetDashboardShortcuts: () => void;

  // AI Copilot Drawer state
  isAIDrawerOpen: boolean;
  setAIDrawerOpen: (isOpen: boolean) => void;
  toggleAIDrawer: () => void;

  // Notifications
  notifications: Notification[];
  setNotificationsFromServer: (items: Notification[]) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      // Always dark
      theme: 'dark',

      // Auth & Tenant Context
      authStatus: 'idle',
      currentUser: null,
      activeMembership: null,
      memberships: [],
      responsibilities: [],
      branches: [],
      activeBranchId: null,
      academicSessionRecords: [],

      setAuthStatus: (authStatus) => set({ authStatus }),
      setAuthSession: ({ user, activeMembership, memberships, responsibilities = [] }) => {
        const schoolId = activeMembership?.school_id ?? user.active_school_id ?? null;
        const branchId = activeMembership?.default_branch_id ?? null;
        setTenantHeaders(schoolId, branchId);
        const prefs = (activeMembership?.preferences ?? {}) as Record<string, unknown>;
        const updates: Partial<GlobalState> = {
          authStatus: 'authenticated',
          currentUser: user,
          activeMembership,
          memberships,
          responsibilities,
          activeBranchId: branchId,
        };
        if (Array.isArray(prefs.dashboardShortcuts) && prefs.dashboardShortcuts.length > 0) {
          updates.dashboardShortcuts = prefs.dashboardShortcuts as string[];
        }
        if (Array.isArray(prefs.dashboardKpiOrder) && prefs.dashboardKpiOrder.length === 4) {
          updates.dashboardKpiOrder = prefs.dashboardKpiOrder as string[];
        }
        if (Array.isArray(prefs.dashboardSectionOrder) && prefs.dashboardSectionOrder.length > 0) {
          updates.dashboardSectionOrder = prefs.dashboardSectionOrder as string[];
        }
        if (prefs.language === 'en' || prefs.language === 'hi') {
          updates.language = prefs.language;
        }
        set(updates);
      },
      clearAuthSession: () => {
        clearSessionTokens();
        set({
          authStatus: 'unauthenticated',
          currentUser: null,
          activeMembership: null,
          memberships: [],
          responsibilities: [],
          branches: [],
          activeBranchId: null,
        });
      },
      setBranches: (branches) =>
        set((state) => {
          const validCurrent = branches.find((b) => b.id === state.activeBranchId);
          const primary = validCurrent ?? branches.find((b) => b.is_primary) ?? branches[0] ?? null;
          const nextBranchId = primary?.id ?? null;
          const schoolId = state.activeMembership?.school_id ?? state.currentUser?.active_school_id ?? null;
          setTenantHeaders(schoolId, nextBranchId);
          return { branches, activeBranchId: nextBranchId };
        }),
      setActiveBranch: (branchId) => {
        const state = get();
        const schoolId = state.activeMembership?.school_id ?? state.currentUser?.active_school_id ?? null;
        setTenantHeaders(schoolId, branchId);
        set({ activeBranchId: branchId });
      },
      switchActiveSchool: (schoolId) => {
        const state = get();
        const nextMembership =
          state.memberships.find((m) => m.school_id === schoolId) ?? state.activeMembership;
        const nextBranchId = nextMembership?.default_branch_id ?? null;
        setTenantHeaders(schoolId, nextBranchId);
        set({
          activeMembership: nextMembership,
          activeBranchId: nextBranchId,
        });
      },
      setAcademicSessionRecords: (records) =>
        set(() => {
          const codes = records.map((r) => r.code);
          const current = records.find((r) => r.is_current) ?? records[0];
          return {
            academicSessionRecords: records,
            academicSessions: codes.length > 0 ? codes : ['2026-2027'],
            activeSession: current?.code ?? '2026-2027',
          };
        }),
      hasDivisionAccess: (division, action = 'view') => {
        const { activeMembership, responsibilities } = get();
        if (!activeMembership) return false;
        const ut = activeMembership.user_type;
        if (['SUPER_ADMIN', 'SUPER_EXECUTIVE', 'SCHOOL_ADMIN', 'SCHOOL_EXECUTIVE'].includes(ut)) {
          return true;
        }
        if (ut === 'STAFF') {
          return responsibilities.some(
            (r) =>
              r.work_division === division &&
              (r.actions.includes(action) || r.actions.includes('manage') || r.actions.includes('*'))
          );
        }
        return false;
      },

      // Language default — English
      language: 'en',
      setLanguage: (language) => set({ language }),

      // School Profile default (hydrated from GET /api/v1/schools/current/)
      schoolProfile: {
        name: 'VidyaFloww International Academy',
        shortCode: 'VF-DELHI',
        tagline: 'Excellence in Education & Character',
        affiliation: 'CBSE Affiliation #1630982',
        logoType: 'preset',
        logoPreset: 'building',
        customLogoUrl: '',
        city: 'New Delhi, India',
      },
      updateSchoolProfile: (profile) =>
        set((state) => ({
          schoolProfile: {
            ...state.schoolProfile,
            ...profile,
          },
        })),

      // Academic Session state (hydrated from GET /api/v1/academics/sessions/)
      academicSessions: ['2026-2027'],
      activeSession: '2026-2027',
      setActiveSession: (activeSession) => set({ activeSession }),

      // Sidebar state
      sidebarExpanded: true,
      toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      setSidebarExpanded: (sidebarExpanded) => set({ sidebarExpanded }),

      // Preloader: false = not yet seen (show it); true = already seen
      hasSeenPreloader: false,
      setHasSeenPreloader: () => set({ hasSeenPreloader: true }),

      // Dashboard Customization state
      isDashboardEditMode: false,
      toggleDashboardEditMode: () => set((state) => ({ isDashboardEditMode: !state.isDashboardEditMode })),
      setDashboardEditMode: (isDashboardEditMode) => set({ isDashboardEditMode }),

      dashboardSectionOrder: DEFAULT_DASHBOARD_SECTIONS,
      setDashboardSectionOrder: (dashboardSectionOrder) => set({ dashboardSectionOrder }),
      resetDashboardSectionOrder: () => set({ dashboardSectionOrder: DEFAULT_DASHBOARD_SECTIONS }),

      dashboardKpiOrder: DEFAULT_DASHBOARD_KPIS,
      setDashboardKpiOrder: (dashboardKpiOrder) => set({ dashboardKpiOrder }),
      resetDashboardKpiOrder: () => set({ dashboardKpiOrder: DEFAULT_DASHBOARD_KPIS }),

      // Dashboard Quick Action Shortcuts
      dashboardShortcuts: DEFAULT_DASHBOARD_SHORTCUTS,
      setDashboardShortcuts: (dashboardShortcuts) => set({ dashboardShortcuts }),
      resetDashboardShortcuts: () => set({ dashboardShortcuts: DEFAULT_DASHBOARD_SHORTCUTS }),

      // AI Copilot Drawer state
      isAIDrawerOpen: false,
      setAIDrawerOpen: (isAIDrawerOpen) => set({ isAIDrawerOpen }),
      toggleAIDrawer: () => set((state) => ({ isAIDrawerOpen: !state.isAIDrawerOpen })),

      // Notifications state
      notifications: [],
      setNotificationsFromServer: (items) =>
        set((state) => {
          const localOnly = state.notifications.filter((n) => !n.fromServer);
          const merged = [...items, ...localOnly].slice(0, 50);
          return { notifications: merged };
        }),
      addNotification: (notif) =>
        set((state) => ({
          notifications: [
            {
              ...notif,
              id: Math.random().toString(36).substring(2, 9),
              read: false,
              createdAt: Date.now(),
              fromServer: false,
            },
            ...state.notifications,
          ].slice(0, 50),
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'vidyafloww-global-storage',
      partialize: (state) => ({
        schoolProfile: state.schoolProfile,
        sidebarExpanded: state.sidebarExpanded,
        hasSeenPreloader: state.hasSeenPreloader,
        dashboardShortcuts: state.dashboardShortcuts,
        dashboardKpiOrder: state.dashboardKpiOrder,
        dashboardSectionOrder: state.dashboardSectionOrder,
        language: state.language,
      }),
    }
  )
);

// Force dark mode on every load — no toggle needed
export const initTheme = () => {
  document.documentElement.classList.remove('light', 'system');
  document.documentElement.classList.add('dark');
};
