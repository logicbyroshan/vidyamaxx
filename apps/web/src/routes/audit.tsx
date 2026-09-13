import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFCard,
  VFButton,
  VFBadge,
  VFSelect,
  VFInput,
  VFTable,
  VFTableHead,
  VFTableHeaderCell,
  VFTableBody,
  VFTableRow,
  VFTableCell,
} from '@vidyamaxx/ui';
import {
  ArrowLeft,
  Search,
  Download,
  Terminal,
  RotateCcw,
  Shield,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/audit')({
  component: AuditLogPage,
});

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  category: 'Auth' | 'Students' | 'Exams' | 'Finance' | 'Settings' | 'Gate';
  ip: string;
  status: 'Success' | 'Warning' | 'Blocked';
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'EVT-9041', timestamp: '01 Sep 2026, 02:44:12 PM', actor: 'Roshan Singh (Super Admin)', role: 'Super Administrator', action: 'Modified School Identity & Branding', target: 'Settings > School Profile', category: 'Settings', ip: '103.21.244.18', status: 'Success' },
  { id: 'EVT-9040', timestamp: '01 Sep 2026, 02:30:05 PM', actor: 'Dr. Rajesh Sharma', role: 'School Principal', action: 'Approved Class 10 Admission Dossier & Faculty Schedule', target: 'Student #STU-2026-042', category: 'Students', ip: '103.21.244.22', status: 'Success' },
  { id: 'EVT-9039', timestamp: '01 Sep 2026, 01:15:42 PM', actor: 'Dr. Rajesh Sharma', role: 'School Principal', action: 'Assigned Proxy Teacher for Class 9 Physics Lab', target: 'Timetable > Proxy Matrix', category: 'Students', ip: '103.21.244.22', status: 'Success' },
  { id: 'EVT-9038', timestamp: '01 Sep 2026, 11:45:18 AM', actor: 'Unknown Client (External IP)', role: 'Parent & Student Portal', action: 'Failed 2FA Login Attempt (Invalid OTP)', target: 'Auth / Gateway', category: 'Auth', ip: '49.207.192.8', status: 'Blocked' },
  { id: 'EVT-9037', timestamp: '01 Sep 2026, 10:20:33 AM', actor: 'Mr. Arvind Gupta', role: 'Accountant / Bursar', action: 'Generated Monthly Fee Reconciliation', target: 'Finance > Term 1 Dues', category: 'Finance', ip: '103.21.244.30', status: 'Success' },
  { id: 'EVT-9036', timestamp: '01 Sep 2026, 09:05:10 AM', actor: 'Biometric Gateway Sync', role: 'Super Administrator', action: 'Turnstile Terminal Handshake Synchronized', target: 'Gate 1 & Gate 2 Turnstiles', category: 'Gate', ip: '192.168.1.101', status: 'Success' },
  { id: 'EVT-9035', timestamp: '01 Sep 2026, 08:30:19 AM', actor: 'Mrs. S. Joshi', role: 'Front Office / Registrar', action: 'Issued Transfer Certificate #TC-882', target: 'Student Registry', category: 'Students', ip: '103.21.244.41', status: 'Success' },
  { id: 'EVT-9034', timestamp: '01 Sep 2026, 08:02:44 AM', actor: 'Dr. Rajesh Sharma', role: 'School Principal', action: 'Reviewed & Approved Class 11 Term Marksheets', target: 'Examinations > Class 11-Sci', category: 'Exams', ip: '103.21.244.22', status: 'Success' },
  { id: 'EVT-9033', timestamp: '01 Sep 2026, 07:45:00 AM', actor: 'System Automated Daemon', role: 'Super Administrator', action: 'Created AES-256 Cloud Backup Snapshot', target: 'AWS S3 Mumbai Archive', category: 'Settings', ip: '127.0.0.1', status: 'Success' },
];

const ROLE_OPTIONS = [
  { label: 'All Roles', value: 'All' },
  { label: 'Super Administrator', value: 'Super Administrator' },
  { label: 'School Principal', value: 'School Principal' },
  { label: 'Front Office / Registrar', value: 'Front Office / Registrar' },
  { label: 'Accountant / Bursar', value: 'Accountant / Bursar' },
  { label: 'Parent & Student Portal', value: 'Parent & Student Portal' },
];

const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: 'All' },
  { label: 'Authentication & Access', value: 'Auth' },
  { label: 'Admissions & Students', value: 'Students' },
  { label: 'Exams & Grades', value: 'Exams' },
  { label: 'Finance & Fees', value: 'Finance' },
  { label: 'Settings & Branding', value: 'Settings' },
  { label: 'Gate Biometrics', value: 'Gate' },
];

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'All' },
  { label: 'Success (200 OK)', value: 'Success' },
  { label: 'Blocked (403 Forbidden)', value: 'Blocked' },
  { label: 'Warning (400 Alert)', value: 'Warning' },
];

function AuditLogPage() {
  const { addNotification } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  React.useEffect(() => { document.title = t('page.audit') + ' – VidyaMaxx'; }, [t]);

  // Filters State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = React.useState<string>('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = React.useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState<string>('All');

  // Live stream log state
  const [liveStreamLogs, setLiveStreamLogs] = React.useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Live simulation for table events
  React.useEffect(() => {
    const mockActors = [
      { name: 'Dr. Rajesh Sharma', role: 'School Principal', action: 'Viewed Faculty Workload Matrix', target: 'Teachers > Schedule', category: 'Students' as const, ip: '103.21.244.22', status: 'Success' as const },
      { name: 'Biometric Turnstile #1', role: 'Super Administrator', action: 'Student Gate Tap (ADM-2026-081)', target: 'Main Gate Terminal', category: 'Gate' as const, ip: '192.168.1.101', status: 'Success' as const },
      { name: 'Dr. Rajesh Sharma', role: 'School Principal', action: 'Signed off Class 10 Midterm Exam Schedule', target: 'Examinations > Class 10', category: 'Exams' as const, ip: '103.21.244.22', status: 'Success' as const },
      { name: 'Gateway Webhook', role: 'Super Administrator', action: 'WhatsApp Broadcast Receipt Delivered', target: 'Gupshup Gateway DLT', category: 'Settings' as const, ip: '103.21.244.18', status: 'Success' as const },
      { name: 'Mrs. S. Joshi', role: 'Front Office / Registrar', action: 'Registered New Admission Candidate #ADM-2026-118', target: 'Admissions Pipeline', category: 'Students' as const, ip: '103.21.244.41', status: 'Success' as const },
      { name: 'Mr. Arvind Gupta', role: 'Accountant / Bursar', action: 'Recorded Term 1 Fee Receipt #REC-9824', target: 'Fees > Payment Ledger', category: 'Finance' as const, ip: '103.21.244.30', status: 'Success' as const },
    ];

    const interval = setInterval(() => {
      const randomEntry = mockActors[Math.floor(Math.random() * mockActors.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      const dateStr = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

      const newLog: AuditLogEntry = {
        id: `EVT-${Math.floor(9042 + Math.random() * 1000)}`,
        timestamp: `${dateStr}, ${timeStr}`,
        actor: randomEntry.name,
        role: randomEntry.role,
        action: randomEntry.action,
        target: randomEntry.target,
        category: randomEntry.category,
        ip: randomEntry.ip,
        status: randomEntry.status,
      };

      setLiveStreamLogs((prev) => [newLog, ...prev.slice(0, 50)]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleExportAuditLogs = () => {
    addNotification({
      title: 'Audit Log Exported',
      description: 'Exported tamper-proof ISO/IEC 27001 audit report as CSV.',
      type: 'success',
    });
  };

  const handleResetFilters = () => {
    setSelectedRoleFilter('All');
    setSelectedCategoryFilter('All');
    setSelectedStatusFilter('All');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedRoleFilter !== 'All' || selectedCategoryFilter !== 'All' || selectedStatusFilter !== 'All' || Boolean(searchQuery);

  const filteredLogs = React.useMemo(() => {
    return liveStreamLogs.filter((log) => {
      const matchesSearch =
        log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ip.includes(searchQuery);

      const matchesRole = selectedRoleFilter === 'All' || log.role.toLowerCase().includes(selectedRoleFilter.toLowerCase());
      const matchesCategory = selectedCategoryFilter === 'All' || log.category === selectedCategoryFilter;
      const matchesStatus = selectedStatusFilter === 'All' || log.status === selectedStatusFilter;

      return matchesSearch && matchesRole && matchesCategory && matchesStatus;
    });
  }, [liveStreamLogs, searchQuery, selectedRoleFilter, selectedCategoryFilter, selectedStatusFilter]);

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* 1. Sleek Header Toolbar Box */}
      <div className="p-3 rounded-[4px] bg-[#141414] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <Link to="/settings">
            <VFButton
              size="sm"
              variant="outline"
              className="h-8 px-2.5 text-xs font-bold rounded-[4px] bg-[#141414] hover:bg-[#1f1f1f] border-border text-foreground"
              leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
            >
              {isHindi ? 'सेटिंग्स' : 'Settings'}
            </VFButton>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#141414] border border-border/80 text-xs font-mono font-bold text-foreground">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isHindi ? 'ऑडिट लॉग रजिस्टर' : 'Audit Logs & Activity Trail'}</span>
            </div>
            <VFBadge variant="success" className="text-[10px] font-mono font-bold">
              Live Stream Active
            </VFBadge>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Link to="/security">
            <VFButton
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs font-bold rounded-[4px]"
              leftIcon={<Shield className="h-3.5 w-3.5 text-rose-400" />}
            >
              {isHindi ? 'सुरक्षा व अनुमतियां ↗' : 'Security & Roles ↗'}
            </VFButton>
          </Link>

          <VFButton
            size="sm"
            variant="outline"
            onClick={handleExportAuditLogs}
            className="h-8 px-3.5 text-xs font-bold rounded-[4px]"
            leftIcon={<Download className="h-3.5 w-3.5" />}
          >
            {t('action.export')}
          </VFButton>
        </div>
      </div>

      {/* 2. Interactive Global Search & VFSelect Dropdown Filters Bar */}
      <div className="p-2.5 rounded-[4px] bg-[#0d0d0d] border border-border/90 flex flex-wrap items-center justify-between gap-2.5 shrink-0 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Global VFInput Search */}
          <div className="flex-1 min-w-[220px]">
            <VFInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? "एक्टर, एक्शन, टारगेट, आईपी या इवेंट आईडी से खोजें..." : "Search logs by actor, action, target, IP, or event ID..."}
              leftIcon={<Search className="h-3.5 w-3.5" />}
              className="bg-[#141414] border-border h-8 text-xs rounded-[4px]"
            />
          </div>

          {/* Global VFSelect Role Filter */}
          <VFSelect
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(String(e.target.value))}
            options={ROLE_OPTIONS}
            className="w-40 shrink-0 bg-[#141414] border-border h-8 text-xs rounded-[4px]"
          />

          {/* Global VFSelect Category Filter */}
          <VFSelect
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(String(e.target.value))}
            options={CATEGORY_OPTIONS}
            className="w-40 shrink-0 bg-[#141414] border-border h-8 text-xs rounded-[4px]"
          />

          {/* Global VFSelect Status Filter */}
          <VFSelect
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(String(e.target.value))}
            options={STATUS_OPTIONS}
            className="w-36 shrink-0 bg-[#141414] border-border h-8 text-xs rounded-[4px]"
          />
        </div>

        {hasActiveFilters && (
          <VFButton
            size="sm"
            variant="outline"
            onClick={handleResetFilters}
            className="h-8 px-3 text-xs rounded-[4px]"
            leftIcon={<RotateCcw className="h-3 w-3" />}
          >
            {isHindi ? 'फ़िल्टर रीसेट करें' : 'Reset'}
          </VFButton>
        )}
      </div>

      {/* 3. Global VFTable Live Audit Logs */}
      <VFCard className="bg-[#0d0d0d] border-border/90" bodyClassName="p-0 overflow-x-auto no-scrollbar">
        <VFTable className="rounded-none border-0 w-full">
          <VFTableHead className="bg-[#1a1a1a]">
            <VFTableRow>
              <VFTableHeaderCell className="py-3 px-4 text-xs font-bold text-muted-foreground">{isHindi ? 'इवेंट आईडी' : 'Event ID'}</VFTableHeaderCell>
              <VFTableHeaderCell className="py-3 px-3 text-xs font-bold text-muted-foreground">{isHindi ? 'समय व तारीख' : 'Timestamp'}</VFTableHeaderCell>
              <VFTableHeaderCell className="py-3 px-3 text-xs font-bold text-muted-foreground">{isHindi ? 'उपयोगकर्ता' : 'Actor Details'}</VFTableHeaderCell>
              <VFTableHeaderCell className="py-3 px-3 text-xs font-bold text-muted-foreground">{isHindi ? 'रोल' : 'Role Tier'}</VFTableHeaderCell>
              <VFTableHeaderCell className="py-3 px-3 text-xs font-bold text-muted-foreground">{isHindi ? 'कार्रवाई' : 'Action Performed'}</VFTableHeaderCell>
              <VFTableHeaderCell className="py-3 px-3 text-xs font-bold text-muted-foreground">{isHindi ? 'टारगेट मॉड्यूल' : 'Target Scope'}</VFTableHeaderCell>
              <VFTableHeaderCell className="py-3 px-3 text-xs font-bold text-muted-foreground font-mono">{isHindi ? 'क्लाइंट आईपी' : 'Client IP'}</VFTableHeaderCell>
              <VFTableHeaderCell className="py-3 px-4 text-xs font-bold text-muted-foreground text-right">{t('col.status')}</VFTableHeaderCell>
            </VFTableRow>
          </VFTableHead>
          <VFTableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <VFTableRow key={log.id} className="hover:bg-[#1a1a1a]/70">
                  <VFTableCell className="py-3 px-4 font-mono font-bold text-primary text-xs">{log.id}</VFTableCell>
                  <VFTableCell className="py-3 px-3 text-muted-foreground whitespace-nowrap text-xs">{log.timestamp}</VFTableCell>
                  <VFTableCell className="py-3 px-3 font-bold text-foreground text-xs">{log.actor}</VFTableCell>
                  <VFTableCell className="py-3 px-3">
                    <VFBadge variant="outline" className="text-[10px] font-bold">
                      {log.role}
                    </VFBadge>
                  </VFTableCell>
                  <VFTableCell className="py-3 px-3 font-semibold text-foreground text-xs">{log.action}</VFTableCell>
                  <VFTableCell className="py-3 px-3 text-muted-foreground text-xs">{log.target}</VFTableCell>
                  <VFTableCell className="py-3 px-3 font-mono text-[11px] text-foreground">{log.ip}</VFTableCell>
                  <VFTableCell className="py-3 px-4 text-right">
                    <VFBadge
                      variant={log.status === 'Success' ? 'success' : log.status === 'Blocked' ? 'danger' : 'warning'}
                      className="text-[10px] font-bold"
                    >
                      {log.status === 'Success' ? (isHindi ? 'सफल' : 'Success') : log.status === 'Blocked' ? (isHindi ? 'ब्लॉक' : 'Blocked') : log.status}
                    </VFBadge>
                  </VFTableCell>
                </VFTableRow>
              ))
            ) : (
              <VFTableRow>
                <VFTableCell colSpan={8} className="text-center py-12 text-muted-foreground font-semibold">
                  {isHindi ? 'वर्तमान फ़िल्टर से मेल खाता कोई सुरक्षा ऑडिट इवेंट नहीं मिला।' : 'No security audit events matching current filter criteria.'}
                </VFTableCell>
              </VFTableRow>
            )}
          </VFTableBody>
        </VFTable>
      </VFCard>
    </VFPageContainer>
  );
}
