import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { apiClient, extractApiList } from '@vidyafloww/api';
import { VFPageContainer, VFCard, VFButton, VFBadge } from '@vidyafloww/ui';
import {
  Package,
  Wrench,
  IdCard,
  CalendarDays,
  Trophy,
  HeartPulse,
  ShieldAlert,
  FileCheck2,
  Plus,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';

export const Route = createFileRoute('/operations')({
  component: CampusOperationsHubPage,
});

type OpsTab =
  | 'inventory'
  | 'assets'
  | 'visitors'
  | 'events'
  | 'activities'
  | 'health'
  | 'counselling'
  | 'documents';

interface TabConfig {
  id: OpsTab;
  label: string;
  division: string;
  endpoint: string;
  canDelete: boolean;
  icon: React.ReactNode;
  columns: Array<{ key: string; label: string }>;
  fields: Array<{ name: string; label: string; placeholder: string; type?: string; defaultValue?: string }>;
}

const OPS_TABS: TabConfig[] = [
  {
    id: 'inventory',
    label: 'Inventory & Stores',
    division: 'Division #16',
    endpoint: '/operations/inventory/items/',
    canDelete: true,
    icon: <Package className="h-3.5 w-3.5" />,
    columns: [
      { key: 'sku_code', label: 'SKU' },
      { key: 'item_name', label: 'Item Name' },
      { key: 'category', label: 'Category' },
      { key: 'quantity_on_hand', label: 'Qty' },
      { key: 'reorder_threshold', label: 'Reorder At' },
    ],
    fields: [
      { name: 'sku_code', label: 'SKU Code', placeholder: 'INV-CHALK-01' },
      { name: 'item_name', label: 'Item Name', placeholder: 'Whiteboard Markers Box' },
      { name: 'category', label: 'Category', placeholder: 'Stationery', defaultValue: 'Stationery' },
      { name: 'quantity_on_hand', label: 'Quantity', placeholder: '50', type: 'number', defaultValue: '50' },
      { name: 'reorder_threshold', label: 'Reorder Threshold', placeholder: '10', type: 'number', defaultValue: '10' },
    ],
  },
  {
    id: 'assets',
    label: 'Assets & Maintenance',
    division: 'Division #17',
    endpoint: '/operations/assets/',
    canDelete: true,
    icon: <Wrench className="h-3.5 w-3.5" />,
    columns: [
      { key: 'asset_tag', label: 'Asset Tag' },
      { key: 'asset_name', label: 'Asset Name' },
      { key: 'location_room', label: 'Location' },
      { key: 'purchase_value_inr', label: 'Value (INR)' },
      { key: 'condition_status', label: 'Condition' },
    ],
    fields: [
      { name: 'asset_tag', label: 'Asset Tag', placeholder: 'AST-LAB-09' },
      { name: 'asset_name', label: 'Asset Name', placeholder: 'Smart Interactive Panel 75"' },
      { name: 'location_room', label: 'Location Room', placeholder: 'Physics Lab 1' },
      { name: 'purchase_value_inr', label: 'Purchase Value (INR)', placeholder: '125000.00', defaultValue: '85000.00' },
      { name: 'condition_status', label: 'Condition', placeholder: 'Operational', defaultValue: 'Operational' },
    ],
  },
  {
    id: 'visitors',
    label: 'Front Office Visitors',
    division: 'Division #26',
    endpoint: '/operations/front-office/visitors/',
    canDelete: true,
    icon: <IdCard className="h-3.5 w-3.5" />,
    columns: [
      { key: 'pass_number', label: 'Pass #' },
      { key: 'visitor_name', label: 'Visitor' },
      { key: 'visitor_phone', label: 'Phone' },
      { key: 'purpose', label: 'Purpose' },
      { key: 'person_to_meet', label: 'Meeting' },
      { key: 'status', label: 'Status' },
    ],
    fields: [
      { name: 'pass_number', label: 'Pass Number', placeholder: 'VP-2026-101' },
      { name: 'visitor_name', label: 'Visitor Name', placeholder: 'Rajesh Verma' },
      { name: 'visitor_phone', label: 'Phone', placeholder: '+91 98111 22334' },
      { name: 'purpose', label: 'Purpose', placeholder: 'Parent-Teacher Meeting', defaultValue: 'Parent-Teacher Meeting' },
      { name: 'person_to_meet', label: 'Person to Meet', placeholder: 'Principal Office', defaultValue: 'Principal Office' },
    ],
  },
  {
    id: 'events',
    label: 'Events & Calendar',
    division: 'Division #22',
    endpoint: '/operations/events/',
    canDelete: true,
    icon: <CalendarDays className="h-3.5 w-3.5" />,
    columns: [
      { key: 'title', label: 'Event Title' },
      { key: 'category', label: 'Category' },
      { key: 'start_date', label: 'Start Date' },
      { key: 'end_date', label: 'End Date' },
      { key: 'venue', label: 'Venue' },
    ],
    fields: [
      { name: 'title', label: 'Event Title', placeholder: 'Annual Science Exhibition' },
      { name: 'category', label: 'Category', placeholder: 'Academic', defaultValue: 'Academic' },
      { name: 'start_date', label: 'Start Date', placeholder: '2026-11-28', type: 'date', defaultValue: '2026-11-28' },
      { name: 'end_date', label: 'End Date', placeholder: '2026-11-29', type: 'date', defaultValue: '2026-11-29' },
      { name: 'venue', label: 'Venue', placeholder: 'Main Auditorium', defaultValue: 'Main Auditorium' },
    ],
  },
  {
    id: 'activities',
    label: 'Student Activities',
    division: 'Division #23',
    endpoint: '/operations/activities/',
    canDelete: true,
    icon: <Trophy className="h-3.5 w-3.5" />,
    columns: [
      { key: 'activity_name', label: 'Activity' },
      { key: 'club_or_house', label: 'Club / House' },
      { key: 'coordinator_name', label: 'Coordinator' },
      { key: 'participant_count', label: 'Participants' },
    ],
    fields: [
      { name: 'activity_name', label: 'Activity Name', placeholder: 'Inter-House Robotics Olympiad' },
      { name: 'club_or_house', label: 'Club or House', placeholder: 'Ashoka House', defaultValue: 'Ashoka House' },
      { name: 'coordinator_name', label: 'Coordinator', placeholder: 'Ms. Ananya Rao', defaultValue: 'Faculty Coordinator' },
      { name: 'participant_count', label: 'Participants', placeholder: '32', type: 'number', defaultValue: '25' },
    ],
  },
  {
    id: 'health',
    label: 'Student Health / Infirmary',
    division: 'Division #19',
    endpoint: '/engagement/health/visits/',
    canDelete: false,
    icon: <HeartPulse className="h-3.5 w-3.5" />,
    columns: [
      { key: 'admission_number', label: 'Adm No' },
      { key: 'student_name', label: 'Student' },
      { key: 'visit_date', label: 'Date' },
      { key: 'symptoms', label: 'Symptoms' },
      { key: 'treatment_given', label: 'Treatment' },
    ],
    fields: [
      { name: 'admission_number', label: 'Admission Number', placeholder: 'ADM-2026-001' },
      { name: 'student_name', label: 'Student Name', placeholder: 'Aarav Sharma' },
      { name: 'class_section_label', label: 'Class', placeholder: 'Class 10-A', defaultValue: 'Class 10-A' },
      { name: 'visit_date', label: 'Visit Date', placeholder: '2026-11-20', type: 'date', defaultValue: '2026-11-20' },
      { name: 'symptoms', label: 'Symptoms', placeholder: 'Mild headache' },
      { name: 'treatment_given', label: 'Treatment Given', placeholder: 'Rest + hydration' },
    ],
  },
  {
    id: 'counselling',
    label: 'Confidential Counselling',
    division: 'Division #20 (RBAC Restricted)',
    endpoint: '/engagement/counselling/records/',
    canDelete: false,
    icon: <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />,
    columns: [
      { key: 'admission_number', label: 'Adm No' },
      { key: 'student_name', label: 'Student' },
      { key: 'counsellor_name', label: 'Counsellor' },
      { key: 'session_date', label: 'Session Date' },
      { key: 'category', label: 'Category' },
    ],
    fields: [
      { name: 'admission_number', label: 'Admission Number', placeholder: 'ADM-2026-001' },
      { name: 'student_name', label: 'Student Name', placeholder: 'Aarav Sharma' },
      { name: 'counsellor_name', label: 'Counsellor Name', placeholder: 'Dr. Kavita Iyer' },
      { name: 'session_date', label: 'Session Date', placeholder: '2026-11-20', type: 'date', defaultValue: '2026-11-20' },
      { name: 'category', label: 'Category', placeholder: 'Academic Guidance', defaultValue: 'Academic Guidance' },
      { name: 'confidential_notes', label: 'Confidential Notes', placeholder: 'Encrypted session observations...' },
    ],
  },
  {
    id: 'documents',
    label: 'Compliance Documents',
    division: 'Division #12',
    endpoint: '/operations/documents/',
    canDelete: true,
    icon: <FileCheck2 className="h-3.5 w-3.5" />,
    columns: [
      { key: 'owner_code', label: 'Owner Code' },
      { key: 'owner_name', label: 'Owner Name' },
      { key: 'document_name', label: 'Document' },
      { key: 'document_category', label: 'Category' },
      { key: 'verification_status', label: 'Status' },
    ],
    fields: [
      { name: 'owner_code', label: 'Owner Code', placeholder: 'ADM-2026-001' },
      { name: 'owner_name', label: 'Owner Name', placeholder: 'Aarav Sharma' },
      { name: 'document_name', label: 'Document Name', placeholder: 'Transfer Certificate (TC)' },
      { name: 'document_category', label: 'Category', placeholder: 'Academic', defaultValue: 'Academic' },
      { name: 'verification_status', label: 'Status', placeholder: 'Verified', defaultValue: 'Verified' },
    ],
  },
];

function CampusOperationsHubPage() {
  const { addNotification } = useGlobalStore();
  const [activeTab, setActiveTab] = React.useState<OpsTab>('inventory');
  const [rows, setRows] = React.useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [formValues, setFormValues] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);

  const tabCfg = OPS_TABS.find((t) => t.id === activeTab) || OPS_TABS[0];

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiClient.get(tabCfg.endpoint);
      setRows(extractApiList<Record<string, unknown>>(res));
    } catch (err: unknown) {
      setRows([]);
      const msg = err instanceof Error ? err.message : 'Unable to load records for this division.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }, [tabCfg.endpoint]);

  React.useEffect(() => {
    const defaults: Record<string, string> = {};
    tabCfg.fields.forEach((f) => {
      defaults[f.name] = f.defaultValue ?? '';
    });
    setFormValues(defaults);
    loadData();
  }, [tabCfg, loadData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {};
      tabCfg.fields.forEach((f) => {
        const val = formValues[f.name] ?? '';
        payload[f.name] = f.type === 'number' ? Number(val || 0) : val;
      });
      await apiClient.post(tabCfg.endpoint, payload);
      addNotification({
        title: `${tabCfg.label} Saved`,
        description: 'Record persisted to VidyaFloww database.',
        type: 'success',
      });
      await loadData();
    } catch (err: unknown) {
      addNotification({
        title: 'Save Rejected',
        description: err instanceof Error ? err.message : 'Permission or validation error.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`${tabCfg.endpoint}${id}/`);
      setRows((prev) => prev.filter((r) => String(r.id) !== id));
      addNotification({ title: 'Record Deleted', description: 'Removed from database.', type: 'info' });
    } catch (err: unknown) {
      addNotification({
        title: 'Delete Rejected',
        description: err instanceof Error ? err.message : 'Insufficient permission.',
        type: 'error',
      });
    }
  };

  return (
    <VFPageContainer className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#141414] border border-border/80 rounded-[4px] p-3">
        <div>
          <h1 className="text-sm font-extrabold text-foreground">Campus Operations &amp; Student Welfare Hub</h1>
          <p className="text-xs text-muted-foreground">
            Live Django REST workspace covering Inventory, Assets, Front Office, Events, Activities, Infirmary, Confidential Counselling &amp; Documents.
          </p>
        </div>
        <VFButton size="sm" variant="outline" onClick={loadData} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
          Refresh
        </VFButton>
      </div>

      {/* 8 Division Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-[#121214] p-1.5 rounded-[4px] border border-border/70">
        {OPS_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded-[3px] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === t.id
                ? 'bg-[#242428] text-foreground border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Live Table */}
        <div className="lg:col-span-8">
          <VFCard
            title={
              <div className="flex items-center gap-2">
                {tabCfg.icon}
                <span>{tabCfg.label}</span>
                <VFBadge variant="outline" className="text-[10px] font-mono">{tabCfg.division}</VFBadge>
              </div>
            }
          >
            {errorMsg ? (
              <div className="p-4 rounded bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                <strong>Access / Server Notice:</strong> {errorMsg}
              </div>
            ) : loading ? (
              <p className="text-xs text-muted-foreground py-6 text-center">Loading live records...</p>
            ) : rows.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No records found in database for {tabCfg.label}. Add a record using the form on the right.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground">
                      {tabCfg.columns.map((c) => (
                        <th key={c.key} className="py-2 px-3 font-semibold">{c.label}</th>
                      ))}
                      {tabCfg.canDelete && <th className="py-2 px-3 text-right">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {rows.map((r) => (
                      <tr key={String(r.id)} className="hover:bg-[#1a1a1d]">
                        {tabCfg.columns.map((c) => (
                          <td key={c.key} className="py-2 px-3 text-foreground">{String(r[c.key] ?? '—')}</td>
                        ))}
                        {tabCfg.canDelete && (
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDelete(String(r.id))}
                              className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </VFCard>
        </div>

        {/* Live Create Form */}
        <div className="lg:col-span-4">
          <VFCard title={`New ${tabCfg.label} Entry`}>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              {tabCfg.fields.map((f) => (
                <div key={f.name}>
                  <label className="block text-muted-foreground font-semibold mb-1">{f.label}</label>
                  <input
                    type={f.type ?? 'text'}
                    required
                    value={formValues[f.name] ?? ''}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, [f.name]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full h-8 px-2.5 rounded-[3px] bg-[#161616] border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
              <VFButton type="submit" size="sm" className="w-full" disabled={submitting} leftIcon={<Plus className="h-3.5 w-3.5" />}>
                {submitting ? 'Saving...' : `Create ${tabCfg.label}`}
              </VFButton>
            </form>
          </VFCard>
        </div>
      </div>
    </VFPageContainer>
  );
}
