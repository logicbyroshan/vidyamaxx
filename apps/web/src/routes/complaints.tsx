import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from '../hooks/useTranslation';
import { useGlobalStore } from '../stores/globalStore';
import {
  VFPageContainer,
  VFPageToolbar,
  VFButton,
  VFBadge,
  VFDialog,
} from '@vidyamaxx/ui';
import {
  MessageSquareWarning,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Check,
  Building2,
  X,
} from 'lucide-react';

export const Route = createFileRoute('/complaints')({
  component: ComplaintsManagementPage,
});

interface GrievanceTicket {
  id: string;
  complainantType: 'Parent' | 'Student' | 'Faculty' | 'Staff';
  complainantName: string;
  category: 'Transport' | 'Academics' | 'Hostel' | 'Fees & Accounts' | 'Facilities';
  subject: string;
  description: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  lodgedDate: string;
  assignedOfficer: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  resolutionNotes?: string;
  expectedSLA: string;
}

const INITIAL_GRIEVANCES: GrievanceTicket[] = [
  {
    id: 'TKT-2026-089',
    complainantType: 'Parent',
    complainantName: 'Sunil Verma (Priya’s Father)',
    category: 'Transport',
    subject: 'Bus Route 2 morning arrival delayed by 15 mins near Preet Vihar',
    description: 'Bus Route 2 arrived at 07:35 AM instead of scheduled 07:20 AM due to roadblock.',
    priority: 'High',
    lodgedDate: 'Today, 08:45 AM',
    assignedOfficer: 'Transport Head (Surender Rawat)',
    status: 'In Progress',
    resolutionNotes: 'Driver contacted; alternate diversion route via Vikas Marg mapped.',
    expectedSLA: 'Today, 04:00 PM',
  },
  {
    id: 'TKT-2026-088',
    complainantType: 'Student',
    complainantName: 'Rahul Sharma (Class 10-A)',
    category: 'Hostel',
    subject: 'Room A-101 AC thermostat requires servicing',
    description: 'Air conditioning cooling reduced in afternoon hours.',
    priority: 'Medium',
    lodgedDate: 'Yesterday, 04:30 PM',
    assignedOfficer: 'Hostel Warden (R. K. Saxena)',
    status: 'In Progress',
    resolutionNotes: 'HVAC technician scheduled for maintenance today at 03:00 PM.',
    expectedSLA: 'Tomorrow, 12:00 PM',
  },
  {
    id: 'TKT-2026-085',
    complainantType: 'Parent',
    complainantName: 'Meenakshi Iyer (Aditya’s Mother)',
    category: 'Fees & Accounts',
    subject: 'Online fee receipt duplicate generated for Term 2 tuition',
    description: 'Bank deduction occurred once but portal shows unverified status.',
    priority: 'Urgent',
    lodgedDate: '05 Sep 2026',
    assignedOfficer: 'Chief Accounts Officer',
    status: 'Resolved',
    resolutionNotes: 'Bank gateway reference reconciled. Official receipt #VF-9021 issued.',
    expectedSLA: 'Resolved on time',
  },
  {
    id: 'TKT-2026-082',
    complainantType: 'Faculty',
    complainantName: 'Dr. Sarah Connor (Physics)',
    category: 'Academics',
    subject: 'Lab 204 Ray Optics light source replacement needed',
    description: '3 sodium vapor discharge lamps flickering during class experiments.',
    priority: 'Medium',
    lodgedDate: '02 Sep 2026',
    assignedOfficer: 'Academic Dean & Store Manager',
    status: 'Resolved',
    resolutionNotes: 'New optical replacement lamps fitted and certified.',
    expectedSLA: 'Resolved on time',
  },
  {
    id: 'TKT-2026-079',
    complainantType: 'Student',
    complainantName: 'Sneha Patel (Class 11-Sci)',
    category: 'Facilities',
    subject: 'Library Quiet Zone seating addition request',
    description: 'Peak evening hours require 6 additional study carrels near Reference Section.',
    priority: 'Low',
    lodgedDate: '29 Aug 2026',
    assignedOfficer: 'Head Librarian',
    status: 'Resolved',
    resolutionNotes: '8 ergonomic study cubicles installed in Wing B.',
    expectedSLA: 'Resolved on time',
  },
];

function ComplaintsManagementPage() {
  const { t, lang } = useTranslation();
  const { addNotification } = useGlobalStore();
  const isHindi = lang === 'hi';

  React.useEffect(() => {
    document.title = (isHindi ? 'शिकायतें व निवारण' : 'Complaints & Grievances') + ' – VidyaMaxx';
  }, [isHindi]);

  const [activeTab, setActiveTab] = React.useState<'registry' | 'queue'>('registry');
  const [grievances, setGrievances] = React.useState<GrievanceTicket[]>(INITIAL_GRIEVANCES);
  const [statusFilter, setStatusFilter] = React.useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('All');
  const [searchGrievance, setSearchGrievance] = React.useState('');
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const [isLodgeModalOpen, setIsLodgeModalOpen] = React.useState(false);
  const [viewingTicket, setViewingTicket] = React.useState<GrievanceTicket | null>(null);

  // New Grievance form
  const [complainantName, setComplainantName] = React.useState('');
  const [complainantType, setComplainantType] = React.useState<'Parent' | 'Student' | 'Faculty' | 'Staff'>('Parent');
  const [ticketCategory, setTicketCategory] = React.useState<'Transport' | 'Academics' | 'Hostel' | 'Fees & Accounts' | 'Facilities'>('Transport');
  const [ticketSubject, setTicketSubject] = React.useState('');
  const [ticketPriority, setTicketPriority] = React.useState<'Urgent' | 'High' | 'Medium' | 'Low'>('High');
  const [ticketDesc, setTicketDesc] = React.useState('');

  const handleLodgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !complainantName.trim()) return;

    const newTicket: GrievanceTicket = {
      id: `TKT-2026-${Math.floor(100 + Math.random() * 900)}`,
      complainantType,
      complainantName: complainantName.trim(),
      category: ticketCategory,
      subject: ticketSubject.trim(),
      description: ticketDesc.trim() || 'Details provided to grievance cell.',
      priority: ticketPriority,
      lodgedDate: 'Today, Just now',
      assignedOfficer: 'Department In-Charge',
      status: 'Open',
      expectedSLA: 'Within 48 Hours',
    };

    setGrievances([newTicket, ...grievances]);
    setIsLodgeModalOpen(false);
    setComplainantName('');
    setTicketSubject('');
    setTicketDesc('');

    addNotification({
      title: isHindi ? 'शिकायत दर्ज हुई' : 'Grievance Registered',
      description: `Ticket ${newTicket.id} has been routed to ${newTicket.category} department.`,
      type: 'success',
    });
  };

  const handleMarkResolved = (id: string) => {
    setGrievances((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: 'Resolved', resolutionNotes: 'Resolved by administrative authority.' } : g))
    );
    addNotification({
      title: isHindi ? 'शिकायत का समाधान हुआ' : 'Grievance Marked Resolved',
      description: `Ticket ${id} closed successfully.`,
      type: 'success',
    });
  };

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* ── SINGLE UNIFIED TOOLBAR & HEADER ── */}
      <VFPageToolbar className="flex-wrap items-center justify-between gap-2.5">
        {/* Left: Tabs & Inline Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-[4px] border border-border/70">
            <button
              type="button"
              id="tab-registry"
              onClick={() => setActiveTab('registry')}
              className={`px-3 py-1.5 text-xs font-bold rounded-[3px] transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'registry'
                  ? 'bg-[#242424] text-foreground shadow-xs border border-border/80'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquareWarning className="h-3.5 w-3.5" />
              {isHindi ? 'शिकायत पंजिका' : 'Grievance Registry'}
            </button>
            <button
              type="button"
              id="tab-queue"
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 text-xs font-bold rounded-[3px] transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'queue'
                  ? 'bg-[#242424] text-foreground shadow-xs border border-border/80'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              {isHindi ? 'सक्रिय कतार व एसएलए' : 'Action Queue & SLA'}
            </button>
          </div>

          {/* Inline Dropdown Filters (Moved into top bar) */}
          {activeTab === 'registry' && (
            <div className="flex items-center gap-2 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 bg-[#181818] px-2.5 py-1.5 rounded-[3px] border border-border/70">
                <span className="text-xs text-muted-foreground font-semibold">{isHindi ? 'स्थिति:' : 'Status:'}</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-transparent border-0 text-xs font-bold text-foreground focus:ring-0 p-0 cursor-pointer"
                >
                  <option value="All">{isHindi ? 'सभी' : 'All'}</option>
                  <option value="Open">{isHindi ? 'खुली' : 'Open'}</option>
                  <option value="In Progress">{isHindi ? 'प्रगति पर' : 'In Progress'}</option>
                  <option value="Resolved">{isHindi ? 'निस्तारित' : 'Resolved'}</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-[#181818] px-2.5 py-1.5 rounded-[3px] border border-border/70">
                <span className="text-xs text-muted-foreground font-semibold">{isHindi ? 'विभाग:' : 'Dept:'}</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent border-0 text-xs font-bold text-foreground focus:ring-0 p-0 cursor-pointer"
                >
                  <option value="All">{isHindi ? 'सभी विभाग' : 'All Departments'}</option>
                  <option value="Transport">Transport</option>
                  <option value="Academics">Academics</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Fees & Accounts">Fees & Accounts</option>
                  <option value="Facilities">Facilities</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Right: Icon-only / Expandable Search + Single '+' Lodge Grievance Action */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {activeTab === 'registry' && (
            <div className="flex items-center">
              {isSearchOpen || searchGrievance ? (
                <div className="relative flex items-center animate-in fade-in duration-150">
                  <input
                    type="text"
                    autoFocus
                    value={searchGrievance}
                    onChange={(e) => setSearchGrievance(e.target.value)}
                    placeholder={isHindi ? 'खोजें...' : 'Search ticket or name...'}
                    className="w-44 sm:w-56 h-8 px-2.5 pl-7 pr-7 border border-border rounded-[3px] bg-[#181818] text-foreground text-xs focus:outline-none focus:border-zinc-500"
                  />
                  <Search className="h-3.5 w-3.5 absolute left-2 text-muted-foreground pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchGrievance('');
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                    title="Close search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <VFButton
                  size="icon"
                  variant="outline"
                  onClick={() => setIsSearchOpen(true)}
                  className="h-8 w-8 rounded-[4px] text-muted-foreground hover:text-foreground hover:border-zinc-700"
                  title={isHindi ? 'शिकायत खोजें' : 'Search Grievances'}
                >
                  <Search className="h-3.5 w-3.5" />
                </VFButton>
              )}
            </div>
          )}

          <VFButton
            size="sm"
            onClick={() => setIsLodgeModalOpen(true)}
            className="h-8 px-3 text-xs font-bold shadow-xs rounded-[4px]"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            {isHindi ? 'शिकायत दर्ज करें' : 'Lodge Grievance'}
          </VFButton>
        </div>
      </VFPageToolbar>

      {/* ──────────────────────────────────────────────────────────────────────────
          TAB 1: GRIEVANCE REGISTRY
          ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'registry' && (
        <div className="flex-1 min-h-0 flex flex-col space-y-4">

          {/* Table */}
          <div className="border border-border/80 rounded-[4px] overflow-hidden bg-card w-full min-w-full">
            <div className="overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full min-w-full">
              <table className="w-full min-w-full text-left border-collapse text-xs table-auto">
                <thead>
                  <tr className="border-b border-border/80 bg-[#141414] text-muted-foreground font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">
                    <th className="py-2.5 px-3">{isHindi ? 'टिकट आईडी' : 'Ticket ID'}</th>
                    <th className="py-2.5 px-3">{isHindi ? 'शिकायतकर्ता' : 'Complainant'}</th>
                    <th className="py-2.5 px-3">{isHindi ? 'विभाग' : 'Category'}</th>
                    <th className="py-2.5 px-3">{isHindi ? 'विषय' : 'Subject'}</th>
                    <th className="py-2.5 px-3 text-center">{isHindi ? 'प्राथमिकता' : 'Priority'}</th>
                    <th className="py-2.5 px-3 text-center">{isHindi ? 'दर्ज तिथि' : 'Lodged'}</th>
                    <th className="py-2.5 px-3 text-center">{t('col.status')}</th>
                    <th className="py-2.5 px-3 text-center">{t('col.action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {grievances
                    .filter((g) => (statusFilter === 'All' ? true : g.status === statusFilter))
                    .filter((g) => (categoryFilter === 'All' ? true : g.category === categoryFilter))
                    .filter(
                      (g) =>
                        g.subject.toLowerCase().includes(searchGrievance.toLowerCase()) ||
                        g.complainantName.toLowerCase().includes(searchGrievance.toLowerCase()) ||
                        g.id.toLowerCase().includes(searchGrievance.toLowerCase())
                    )
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-[#1a1a1a] transition-colors whitespace-nowrap">
                        <td className="py-2.5 px-3 font-mono font-bold text-xs text-primary">{item.id}</td>
                        <td className="py-2.5 px-3">
                          <div className="text-xs sm:text-sm font-bold text-foreground max-w-[170px] truncate" title={item.complainantName}>{item.complainantName}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[170px]">{item.complainantType}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <VFBadge variant="outline" className="text-xs px-2 py-0.5 rounded-[3px]">{item.category}</VFBadge>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="text-xs sm:text-sm font-bold text-foreground max-w-[240px] lg:max-w-[300px] truncate" title={item.subject}>{item.subject}</div>
                          <div className="text-[11px] text-muted-foreground truncate max-w-[240px] lg:max-w-[300px] mt-0.5" title={item.description}>{item.description}</div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <VFBadge
                            variant={item.priority === 'Urgent' ? 'danger' : item.priority === 'High' ? 'warning' : 'outline'}
                            className="text-xs px-2 py-0.5 rounded-[3px]"
                          >
                            {item.priority}
                          </VFBadge>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground text-center">{item.lodgedDate}</td>
                        <td className="py-2.5 px-3 text-center">
                          <VFBadge
                            variant={item.status === 'Resolved' ? 'success' : item.status === 'In Progress' ? 'warning' : 'danger'}
                            className="text-xs px-2 py-0.5 rounded-[3px]"
                          >
                            {item.status}
                          </VFBadge>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => setViewingTicket(item)}
                            className="px-2.5 py-1 rounded-[3px] bg-[#1c1c1c] hover:bg-[#252525] border border-border/80 text-xs font-bold text-foreground transition-colors cursor-pointer mx-auto"
                          >
                            {isHindi ? 'डिटेल्स' : 'Details'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          TAB 2: ACTION QUEUE & RESOLUTION SLA
          ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'queue' && (
        <div className="flex-1 min-h-0 flex flex-col space-y-4">
          <div className="border border-border/80 rounded-[4px] overflow-hidden bg-card">
            <div className="p-3.5 bg-[#141414] border-b border-border/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  {isHindi ? 'तत्काल कार्रवाई योग्य लंबित शिकायतें' : 'Pending & Actionable Grievance Queue'}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isHindi ? 'प्राथमिकता के आधार पर सीधे समाधान व हस्ताक्षर' : 'Active institutional tickets requiring departmental resolution'}
                </p>
              </div>
              <VFBadge variant="warning" className="font-mono text-xs px-2.5 py-1 rounded-[3px]">
                {grievances.filter((g) => g.status !== 'Resolved').length} {isHindi ? 'लंबित' : 'Pending Action'}
              </VFBadge>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {grievances
                .filter((g) => g.status !== 'Resolved')
                .map((item) => (
                  <div key={item.id} className="p-3.5 rounded-[3px] border border-border/80 bg-[#161616] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold text-xs text-primary">{item.id}</span>
                        <VFBadge
                          variant={item.priority === 'Urgent' ? 'danger' : 'warning'}
                          className="text-xs px-2 py-0.5 rounded-[3px]"
                        >
                          {item.priority}
                        </VFBadge>
                      </div>
                      <h4 className="text-sm font-bold text-foreground line-clamp-1">{item.subject}</h4>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.description}</p>
                      <div className="mt-2.5 text-xs text-muted-foreground flex items-center justify-between border-t border-border/50 pt-2.5">
                        <span>By: <strong className="text-foreground">{item.complainantName}</strong></span>
                        <span className="font-mono text-primary font-bold text-xs">{item.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-2.5 mt-3">
                      <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        SLA: {item.expectedSLA}
                      </span>
                      <VFButton
                        size="sm"
                        variant="success"
                        className="h-7 px-3 text-xs rounded-[3px] font-bold"
                        leftIcon={<Check className="h-3.5 w-3.5" />}
                        onClick={() => handleMarkResolved(item.id)}
                      >
                        {isHindi ? 'समाधान करें' : 'Mark Resolved'}
                      </VFButton>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Department Breakdown & Resolution Analytics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-[4px] border border-border/80 bg-card space-y-2.5">
              <h5 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Department Breakdown
              </h5>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>Transport</span><span className="font-bold text-foreground font-mono">14 (33%)</span></div>
                <div className="flex justify-between"><span>Academics</span><span className="font-bold text-foreground font-mono">11 (26%)</span></div>
                <div className="flex justify-between"><span>Hostel</span><span className="font-bold text-foreground font-mono">8 (19%)</span></div>
                <div className="flex justify-between"><span>Fees & Facilities</span><span className="font-bold text-foreground font-mono">9 (22%)</span></div>
              </div>
            </div>

            <div className="p-3.5 rounded-[4px] border border-border/80 bg-card space-y-2.5">
              <h5 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                Avg Resolution Speed
              </h5>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>IT & Accounts</span><span className="font-bold text-emerald-400 font-mono">0.8 Days</span></div>
                <div className="flex justify-between"><span>Transport</span><span className="font-bold text-emerald-400 font-mono">1.2 Days</span></div>
                <div className="flex justify-between"><span>Hostel</span><span className="font-bold text-emerald-400 font-mono">1.5 Days</span></div>
                <div className="flex justify-between"><span>Academics</span><span className="font-bold text-emerald-400 font-mono">2.1 Days</span></div>
              </div>
            </div>

            <div className="p-3.5 rounded-[4px] border border-border/80 bg-card space-y-2.5">
              <h5 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                SLA Compliance Rate
              </h5>
              <div className="space-y-1.5 text-xs">
                <p className="text-emerald-400 font-mono font-bold text-base">96.8% Compliant</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  36 of 42 tickets resolved inside institutional 48-hour SLA limits. Zero overdue cases.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Lodge Grievance Dialog ── */}
      <VFDialog
        isOpen={isLodgeModalOpen}
        onClose={() => setIsLodgeModalOpen(false)}
        title={isHindi ? 'नई शिकायत दर्ज करें' : 'Lodge New Institutional Grievance'}
        description={isHindi ? 'डिपार्टमेंट, प्रायोरिटी और डिटेल्स एंटर करें' : 'Register an official stakeholder grievance with automatic SLA routing'}
        className="max-w-md rounded-[4px]"
        footerActions={
          <div className="flex items-center justify-end gap-2 w-full">
            <VFButton
              variant="outline"
              size="sm"
              onClick={() => setIsLodgeModalOpen(false)}
              className="rounded-[3px]"
            >
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </VFButton>
            <VFButton
              size="sm"
              onClick={handleLodgeSubmit}
              className="rounded-[3px]"
            >
              {isHindi ? 'शिकायत सबमिट करें' : 'Submit Grievance'}
            </VFButton>
          </div>
        }
      >
        <form onSubmit={handleLodgeSubmit} className="space-y-3 py-1 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                {isHindi ? 'शिकायतकर्ता प्रकार' : 'Complainant Type'}
              </label>
              <select
                value={complainantType}
                onChange={(e) => setComplainantType(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-border rounded-[3px] bg-[#161616] text-foreground text-xs focus:outline-none"
              >
                <option value="Parent">Parent</option>
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                {isHindi ? 'नाम व संपर्क' : 'Name & Ward'}
              </label>
              <input
                type="text"
                required
                value={complainantName}
                onChange={(e) => setComplainantName(e.target.value)}
                placeholder="e.g. Ramesh Saxena"
                className="w-full px-3 py-1.5 border border-border rounded-[3px] bg-[#161616] text-foreground text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                {isHindi ? 'संबंधित विभाग' : 'Department Category'}
              </label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-border rounded-[3px] bg-[#161616] text-foreground text-xs focus:outline-none"
              >
                <option value="Transport">Transport</option>
                <option value="Academics">Academics</option>
                <option value="Hostel">Hostel</option>
                <option value="Fees & Accounts">Fees & Accounts</option>
                <option value="Facilities">Facilities</option>
              </select>
            </div>
            <div>
              <label className="block text-muted-foreground font-semibold mb-1">
                {isHindi ? 'प्राथमिकता' : 'Priority Level'}
              </label>
              <select
                value={ticketPriority}
                onChange={(e) => setTicketPriority(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-border rounded-[3px] bg-[#161616] text-foreground text-xs focus:outline-none"
              >
                <option value="Urgent">Urgent (24h)</option>
                <option value="High">High (48h)</option>
                <option value="Medium">Medium (72h)</option>
                <option value="Low">Low (5 Days)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-muted-foreground font-semibold mb-1">
              {isHindi ? 'शिकायत विषय' : 'Subject Summary'}
            </label>
            <input
              type="text"
              required
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              placeholder="e.g. Bus stop morning delay inquiry"
              className="w-full px-3 py-1.5 border border-border rounded-[3px] bg-[#161616] text-foreground text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-muted-foreground font-semibold mb-1">
              {isHindi ? 'डिटेल्ड डिस्क्रिप्शन' : 'Detailed Description'}
            </label>
            <textarea
              rows={3}
              value={ticketDesc}
              onChange={(e) => setTicketDesc(e.target.value)}
              placeholder="Provide specific dates, timings, bus numbers, or room numbers..."
              className="w-full px-3 py-1.5 border border-border rounded-[3px] bg-[#161616] text-foreground text-xs focus:outline-none"
            />
          </div>
        </form>
      </VFDialog>

      {/* ── View Grievance Details Modal ── */}
      {viewingTicket && (
        <VFDialog
          isOpen={!!viewingTicket}
          onClose={() => setViewingTicket(null)}
          title={`${viewingTicket.id}: ${viewingTicket.subject}`}
          description={`By ${viewingTicket.complainantName} (${viewingTicket.complainantType}) · ${viewingTicket.category}`}
          className="max-w-lg rounded-[4px]"
          footerActions={
            <div className="flex items-center justify-between w-full">
              <VFBadge
                variant={viewingTicket.status === 'Resolved' ? 'success' : 'warning'}
                className="text-xs rounded-[3px]"
              >
                {viewingTicket.status}
              </VFBadge>
              <div className="flex items-center gap-2">
                {viewingTicket.status !== 'Resolved' && (
                  <VFButton
                    size="sm"
                    variant="success"
                    className="rounded-[3px] text-xs font-bold"
                    onClick={() => {
                      handleMarkResolved(viewingTicket.id);
                      setViewingTicket(null);
                    }}
                  >
                    {isHindi ? 'समाधान मार्क करें' : 'Mark Resolved'}
                  </VFButton>
                )}
                <VFButton
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingTicket(null)}
                  className="rounded-[3px]"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </VFButton>
              </div>
            </div>
          }
        >
          <div className="space-y-3 py-1 text-xs">
            <div className="p-3 rounded-[3px] bg-[#161616] border border-border/80 space-y-2">
              <p className="font-semibold text-foreground text-xs">{viewingTicket.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2.5 border-t border-border/60">
                <div>
                  <span className="block text-xs uppercase font-bold text-muted-foreground">Assigned Officer:</span>
                  <span className="text-foreground font-semibold">{viewingTicket.assignedOfficer}</span>
                </div>
                <div>
                  <span className="block text-xs uppercase font-bold text-muted-foreground">Target SLA:</span>
                  <span className="text-amber-400 font-mono font-bold">{viewingTicket.expectedSLA}</span>
                </div>
              </div>
            </div>

            {viewingTicket.resolutionNotes && (
              <div className="p-3 rounded-[3px] bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 space-y-1">
                <span className="font-bold uppercase tracking-wider text-xs block">Official Redressal Notes:</span>
                <p className="text-xs">{viewingTicket.resolutionNotes}</p>
              </div>
            )}
          </div>
        </VFDialog>
      )}
    </VFPageContainer>
  );
}
