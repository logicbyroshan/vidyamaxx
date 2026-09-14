import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Theme is permanently dark — no light/system mode
export type Theme = 'dark';

export type Language = 'en' | 'hi';

export interface Notification {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  read: boolean;
  createdAt: number;
}

export interface SchoolProfile {
  name: string;
  shortCode: string;
  tagline: string;
  affiliation: string;
  logoType: 'icon' | 'custom_image' | 'preset';
  logoPreset: 'building' | 'shield' | 'graduation' | 'award' | 'book';
  customLogoUrl?: string;
  city: string;
}

export const DEFAULT_DASHBOARD_SHORTCUTS = [
  'attendance',
  'admissions',
  'students',
  'teachers',
  'timetable',
  'fees',
  'notices',
  'homework',
  'examinations',
  'academics',
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
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      // Always dark
      theme: 'dark',

      // Language default — English
      language: 'en',
      setLanguage: (language) => set({ language }),

      // School Profile default
      schoolProfile: {
        name: 'VidyaMaxx International Academy',
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

      // Academic Session state
      academicSessions: ['2026–2027', '2025–2026', '2024–2025'],
      activeSession: '2026–2027',
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
      addNotification: (notif) =>
        set((state) => ({
          notifications: [
            {
              ...notif,
              id: Math.random().toString(36).substring(2, 9),
              read: false,
              createdAt: Date.now(),
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
      name: 'vidyamaxx-global-storage',
      partialize: (state) => ({
        schoolProfile: state.schoolProfile,
        sidebarExpanded: state.sidebarExpanded,
        hasSeenPreloader: state.hasSeenPreloader,
        dashboardShortcuts: state.dashboardShortcuts,
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
