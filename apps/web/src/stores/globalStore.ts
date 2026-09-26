import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ConsentPurposeId,
  VerifiableParentalConsent,
  DataSubjectRequest,
  PrivacyGrievanceTicket,
  DataBreachIncident,
  PrivacyMetricsOverview,
  DSRStatus,
} from '@vidyafloww/types';
import {
  INITIAL_VERIFIABLE_PARENTAL_CONSENTS,
  INITIAL_DATA_SUBJECT_REQUESTS,
  INITIAL_PRIVACY_GRIEVANCES,
  INITIAL_DATA_BREACH_LOGS,
  INITIAL_PRIVACY_METRICS,
  DPDP_NOTICE_VERSION,
} from '@vidyafloww/constants';

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
  'privacy',
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

export interface ConsentItemState {
  status: 'granted' | 'withdrawn' | 'pending';
  grantedAt: string;
  noticeVersion: string;
  withdrawnAt?: string;
  revocationReason?: string;
}

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

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // ─── DPDP Act 2023 & DPDP Rules 2025 Privacy & Consent State ───
  consents: Record<ConsentPurposeId, ConsentItemState>;
  grantConsent: (purposeId: ConsentPurposeId) => void;
  withdrawConsent: (purposeId: ConsentPurposeId, reason?: string) => void;

  parentalConsents: VerifiableParentalConsent[];
  addVerifiableParentalConsent: (
    payload: Omit<VerifiableParentalConsent, 'id' | 'consentGrantedAt' | 'tokenizedProofId' | 'verificationStatus'> & {
      verificationStatus?: 'Verified' | 'Pending Verification';
    }
  ) => void;

  dataSubjectRequests: DataSubjectRequest[];
  submitDataSubjectRequest: (
    payload: Omit<DataSubjectRequest, 'id' | 'requestNumber' | 'submittedAt' | 'slaDeadline' | 'status' | 'assignedOfficer'>
  ) => void;
  updateDSRStatus: (id: string, status: DSRStatus, resolutionNotes?: string) => void;

  privacyGrievances: PrivacyGrievanceTicket[];
  submitPrivacyGrievance: (
    payload: Omit<PrivacyGrievanceTicket, 'id' | 'ticketNumber' | 'lodgedDate' | 'statutorySlaDeadline' | 'internalSlaTarget' | 'status' | 'assignedGrievanceOfficer' | 'dpbiEscalationEligible'>
  ) => void;
  resolvePrivacyGrievance: (id: string, resolutionSummary: string) => void;

  dataBreaches: DataBreachIncident[];
  reportDataBreach: (
    payload: Omit<DataBreachIncident, 'id' | 'incidentRef' | 'detectedAt' | 'status'>
  ) => void;
  updateBreachStatus: (
    id: string,
    status: DataBreachIncident['status'],
    containmentMeasures?: string,
    remediationPlan?: string
  ) => void;

  privacyMetrics: PrivacyMetricsOverview;
}

const INITIAL_CONSENTS: Record<ConsentPurposeId, ConsentItemState> = {
  core_academics: {
    status: 'granted',
    grantedAt: '01 Jan 2026, 09:00 AM',
    noticeVersion: DPDP_NOTICE_VERSION,
  },
  emergency_medical: {
    status: 'granted',
    grantedAt: '01 Jan 2026, 09:00 AM',
    noticeVersion: DPDP_NOTICE_VERSION,
  },
  transport_telemetry: {
    status: 'granted',
    grantedAt: '05 Jan 2026, 11:30 AM',
    noticeVersion: DPDP_NOTICE_VERSION,
  },
  biometric_access: {
    status: 'granted',
    grantedAt: '05 Jan 2026, 11:30 AM',
    noticeVersion: DPDP_NOTICE_VERSION,
  },
  communication_broadcasts: {
    status: 'granted',
    grantedAt: '05 Jan 2026, 11:30 AM',
    noticeVersion: DPDP_NOTICE_VERSION,
  },
  scholarships_aid: {
    status: 'withdrawn',
    grantedAt: '05 Jan 2026, 11:30 AM',
    noticeVersion: DPDP_NOTICE_VERSION,
    withdrawnAt: '12 Jan 2026, 04:00 PM',
    revocationReason: 'Not applying for institutional financial aid scholarship in active term.',
  },
};

const storeCreator: StateCreator<GlobalState> = (set) => ({
      // Always dark
      theme: 'dark',

      // Language default — English
      language: 'en',
      setLanguage: (language) => set({ language }),

      // School Profile default
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

      // ─── DPDP Privacy & Consent Implementation ───
      consents: INITIAL_CONSENTS,
      grantConsent: (purposeId) =>
        set((state) => ({
          consents: {
            ...state.consents,
            [purposeId]: {
              status: 'granted',
              grantedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
              noticeVersion: DPDP_NOTICE_VERSION,
            },
          },
        })),
      withdrawConsent: (purposeId, reason = 'Data Principal initiated withdrawal via Privacy Center') =>
        set((state) => ({
          consents: {
            ...state.consents,
            [purposeId]: {
              ...state.consents[purposeId],
              status: 'withdrawn',
              withdrawnAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
              revocationReason: reason,
            },
          },
        })),

      parentalConsents: INITIAL_VERIFIABLE_PARENTAL_CONSENTS,
      addVerifiableParentalConsent: (payload) =>
        set((state) => {
          const currentList = state.parentalConsents || INITIAL_VERIFIABLE_PARENTAL_CONSENTS;
          const newVpc: VerifiableParentalConsent = {
            ...payload,
            id: `VPC-2026-${String(currentList.length + 1).padStart(3, '0')}`,
            verificationStatus: payload.verificationStatus || 'Verified',
            consentGrantedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            tokenizedProofId: `VPC-SIG-SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          };
          return {
            parentalConsents: [newVpc, ...currentList],
          };
        }),

      dataSubjectRequests: INITIAL_DATA_SUBJECT_REQUESTS,
      submitDataSubjectRequest: (payload) =>
        set((state) => {
          const currentList = state.dataSubjectRequests || INITIAL_DATA_SUBJECT_REQUESTS;
          const dateStr = new Date();
          const slaDate = new Date(dateStr.getTime() + 30 * 24 * 60 * 60 * 1000);
          const newDsr: DataSubjectRequest = {
            ...payload,
            id: `DSR-2026-${String(currentList.length + 50).padStart(3, '0')}`,
            requestNumber: `DSR-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'Submitted',
            submittedAt: dateStr.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            slaDeadline: slaDate.toLocaleDateString('en-IN', { dateStyle: 'medium' }) + ' (30-day statutory SLA)',
            assignedOfficer: 'Adv. Ananya Deshmukh (DPO)',
          };
          return {
            dataSubjectRequests: [newDsr, ...currentList],
          };
        }),
      updateDSRStatus: (id, status, resolutionNotes) =>
        set((state) => ({
          dataSubjectRequests: (state.dataSubjectRequests || INITIAL_DATA_SUBJECT_REQUESTS).map((d) =>
            d.id === id
              ? {
                  ...d,
                  status,
                  ...(resolutionNotes ? { resolutionNotes } : {}),
                  ...(status === 'Completed'
                    ? { completedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) }
                    : {}),
                }
              : d
          ),
        })),

      privacyGrievances: INITIAL_PRIVACY_GRIEVANCES,
      submitPrivacyGrievance: (payload) =>
        set((state) => {
          const currentList = state.privacyGrievances || INITIAL_PRIVACY_GRIEVANCES;
          const dateStr = new Date();
          const statutoryDate = new Date(dateStr.getTime() + 90 * 24 * 60 * 60 * 1000);
          const internalDate = new Date(dateStr.getTime() + 7 * 24 * 60 * 60 * 1000);
          const newGrievance: PrivacyGrievanceTicket = {
            ...payload,
            id: `GRIEV-2026-${String(currentList.length + 101).padStart(3, '0')}`,
            ticketNumber: `GRV-DPDP-${Math.floor(9000 + Math.random() * 999)}`,
            status: 'Open',
            lodgedDate: dateStr.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            statutorySlaDeadline: statutoryDate.toLocaleDateString('en-IN', { dateStyle: 'medium' }) + ' (90-day DPDP limit)',
            internalSlaTarget: internalDate.toLocaleDateString('en-IN', { dateStyle: 'medium' }) + ' (7-day institutional SLA)',
            assignedGrievanceOfficer: 'Adv. Ananya Deshmukh (DPO)',
            dpbiEscalationEligible: false,
          };
          return {
            privacyGrievances: [newGrievance, ...currentList],
          };
        }),
      resolvePrivacyGrievance: (id, resolutionSummary) =>
        set((state) => ({
          privacyGrievances: (state.privacyGrievances || INITIAL_PRIVACY_GRIEVANCES).map((g) =>
            g.id === id
              ? {
                  ...g,
                  status: 'Resolved',
                  resolutionSummary,
                  resolvedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
                }
              : g
          ),
        })),

      dataBreaches: INITIAL_DATA_BREACH_LOGS,
      reportDataBreach: (payload) =>
        set((state) => {
          const currentList = state.dataBreaches || INITIAL_DATA_BREACH_LOGS;
          const newBreach: DataBreachIncident = {
            ...payload,
            id: `INC-2026-${String(currentList.length + 1).padStart(3, '0')}`,
            incidentRef: `INC-SEC-${Math.floor(100 + Math.random() * 900)}`,
            status: 'Detected',
            detectedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          };
          return {
            dataBreaches: [newBreach, ...currentList],
          };
        }),
      updateBreachStatus: (id, status, containmentMeasures, remediationPlan) =>
        set((state) => ({
          dataBreaches: (state.dataBreaches || INITIAL_DATA_BREACH_LOGS).map((b) =>
            b.id === id
              ? {
                  ...b,
                  status,
                  ...(containmentMeasures ? { containmentMeasures } : {}),
                  ...(remediationPlan ? { remediationPlan } : {}),
                  ...(status === 'Contained' || status === 'Remediated'
                    ? { containedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) }
                    : {}),
                }
              : b
          ),
        })),

  privacyMetrics: INITIAL_PRIVACY_METRICS,
});

export const useGlobalStore = create<GlobalState>()(
  persist(storeCreator, {
    name: 'vidyafloww-global-storage',
    merge: (persistedState: any, currentState: any) => ({
      ...currentState,
      ...(persistedState || {}),
      consents: persistedState?.consents || currentState.consents || INITIAL_CONSENTS,
      parentalConsents: persistedState?.parentalConsents || currentState.parentalConsents || INITIAL_VERIFIABLE_PARENTAL_CONSENTS,
      dataSubjectRequests: persistedState?.dataSubjectRequests || currentState.dataSubjectRequests || INITIAL_DATA_SUBJECT_REQUESTS,
      privacyGrievances: persistedState?.privacyGrievances || currentState.privacyGrievances || INITIAL_PRIVACY_GRIEVANCES,
      dataBreaches: persistedState?.dataBreaches || currentState.dataBreaches || INITIAL_DATA_BREACH_LOGS,
    }),
    partialize: (state: any) => ({
      schoolProfile: state.schoolProfile,
      sidebarExpanded: state.sidebarExpanded,
      hasSeenPreloader: state.hasSeenPreloader,
      dashboardShortcuts: state.dashboardShortcuts,
      language: state.language,
      consents: state.consents,
      parentalConsents: state.parentalConsents,
      dataSubjectRequests: state.dataSubjectRequests,
      privacyGrievances: state.privacyGrievances,
      dataBreaches: state.dataBreaches,
    }),
  } as any)
);

// Force dark mode on every load — no toggle needed
export const initTheme = () => {
  document.documentElement.classList.remove('light', 'system');
  document.documentElement.classList.add('dark');
};
