import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFButton,
  VFBadge,
  VFCard,
  VFTable,
  VFTableHead,
  VFTableBody,
  VFTableRow,
  VFTableHeaderCell,
  VFTableCell,
  cn,
} from '@vidyamaxx/ui';
import {
  Plus,
  Download,
  Send,
  Bold,
  Italic,
  List,
  Quote,
  Image,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  Eye,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/homework')({
  component: HomeworkPage,
});

interface HomeworkRecord {
  id: string;
  code: string;
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  instructions: string;
  submitted: number;
  totalStudents: number;
  status: 'Published' | 'Draft' | 'Closed';
  createdAt: string;
}

interface StudentSubmission {
  roll: string;
  name: string;
  status: 'Submitted' | 'Pending' | 'Late';
  submittedAt: string;
  file: string;
}

const CLASSES = [
  { label: 'Class 10 – A', value: 'Class 10-A' },
  { label: 'Class 10 – B', value: 'Class 10-B' },
  { label: 'Class 9 – A', value: 'Class 9-A' },
  { label: 'Class 11 – Sci', value: 'Class 11-Sci' },
  { label: 'Class 12 – Com', value: 'Class 12-Com' },
];

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'English Core',
  'Computer Science', 'Accountancy', 'Biology', 'Hindi', 'Social Science',
];

const INITIAL_HOMEWORK: HomeworkRecord[] = [
  { id: '1', code: 'HW-2026-01', title: 'Quadratic Equations — Problem Set', subject: 'Mathematics', class: 'Class 10-A', dueDate: '2026-09-08', instructions: '', submitted: 38, totalStudents: 42, status: 'Published', createdAt: '07 Sep' },
  { id: '2', code: 'HW-2026-02', title: 'Electromagnetism Numericals', subject: 'Physics', class: 'Class 10-A', dueDate: '2026-09-10', instructions: '', submitted: 24, totalStudents: 42, status: 'Published', createdAt: '07 Sep' },
  { id: '3', code: 'HW-2026-03', title: 'Chemical Reactions & Stoichiometry', subject: 'Chemistry', class: 'Class 10-B', dueDate: '2026-09-14', instructions: '', submitted: 12, totalStudents: 40, status: 'Published', createdAt: '06 Sep' },
  { id: '4', code: 'HW-2026-04', title: 'Shakespearean Soliloquies Essay', subject: 'English Core', class: 'Class 9-A', dueDate: '2026-09-18', instructions: '', submitted: 35, totalStudents: 38, status: 'Published', createdAt: '05 Sep' },
  { id: '5', code: 'HW-2026-05', title: 'Python Recursion & Binary Search Trees', subject: 'Computer Science', class: 'Class 11-Sci', dueDate: '2026-09-20', instructions: '', submitted: 28, totalStudents: 35, status: 'Published', createdAt: '05 Sep' },
  { id: '6', code: 'HW-2026-06', title: 'Company Balance Sheet Ledger', subject: 'Accountancy', class: 'Class 12-Com', dueDate: '2026-09-22', instructions: '', submitted: 19, totalStudents: 34, status: 'Draft', createdAt: '04 Sep' },
];

// Per-class mock submissions so detail feels real
const SUBMISSIONS_BY_CLASS: Record<string, StudentSubmission[]> = {
  'Class 10-A': [
    { roll: '101', name: 'Aditya Verma', status: 'Submitted', submittedAt: 'Yesterday, 04:20 PM', file: 'Aditya_HW.pdf' },
    { roll: '102', name: 'Priya Sharma', status: 'Submitted', submittedAt: 'Yesterday, 07:15 PM', file: 'Priya_HW.pdf' },
    { roll: '103', name: 'Rahul Gupta', status: 'Submitted', submittedAt: 'Today, 09:10 AM', file: 'Rahul_HW.pdf' },
    { roll: '104', name: 'Sneha Rao', status: 'Pending', submittedAt: '—', file: '—' },
    { roll: '105', name: 'Ishaan Malhotra', status: 'Late', submittedAt: 'Today, 02:30 PM', file: 'Ishaan_HW.jpg' },
    { roll: '106', name: 'Ananya Iyer', status: 'Submitted', submittedAt: 'Yesterday, 11:59 PM', file: 'Ananya_HW.pdf' },
    { roll: '107', name: 'Rohan Joshi', status: 'Pending', submittedAt: '—', file: '—' },
    { roll: '108', name: 'Meera Nair', status: 'Submitted', submittedAt: 'Today, 08:45 AM', file: 'Meera_HW.pdf' },
  ],
  'Class 10-B': [
    { roll: '201', name: 'Karan Singh', status: 'Submitted', submittedAt: 'Today, 10:00 AM', file: 'Karan_HW.pdf' },
    { roll: '202', name: 'Divya Menon', status: 'Pending', submittedAt: '—', file: '—' },
    { roll: '203', name: 'Arjun Rao', status: 'Late', submittedAt: 'Today, 03:10 PM', file: 'Arjun_HW.jpg' },
    { roll: '204', name: 'Nisha Patel', status: 'Submitted', submittedAt: 'Yesterday, 09:00 PM', file: 'Nisha_HW.pdf' },
  ],
  'Class 9-A': [
    { roll: '301', name: 'Vivek Kumar', status: 'Submitted', submittedAt: 'Today, 08:00 AM', file: 'Vivek_HW.pdf' },
    { roll: '302', name: 'Sonal Tiwari', status: 'Submitted', submittedAt: 'Yesterday, 06:00 PM', file: 'Sonal_HW.pdf' },
    { roll: '303', name: 'Dev Sharma', status: 'Pending', submittedAt: '—', file: '—' },
  ],
  'Class 11-Sci': [
    { roll: '401', name: 'Riya Das', status: 'Submitted', submittedAt: 'Today, 11:30 AM', file: 'Riya_HW.py' },
    { roll: '402', name: 'Mohit Kapoor', status: 'Late', submittedAt: 'Today, 04:00 PM', file: 'Mohit_HW.py' },
    { roll: '403', name: 'Tanvi Bose', status: 'Submitted', submittedAt: 'Yesterday, 05:00 PM', file: 'Tanvi_HW.py' },
  ],
  'Class 12-Com': [
    { roll: '501', name: 'Akash Jain', status: 'Submitted', submittedAt: 'Today, 09:45 AM', file: 'Akash_Ledger.xlsx' },
    { roll: '502', name: 'Pooja Mehta', status: 'Pending', submittedAt: '—', file: '—' },
    { roll: '503', name: 'Sahil Roy', status: 'Submitted', submittedAt: 'Yesterday, 08:00 PM', file: 'Sahil_Ledger.xlsx' },
  ],
};

function execFormat(cmd: string, value?: string) {
  document.execCommand(cmd, false, value);
}

function HomeworkPage() {
  const { addNotification } = useGlobalStore();
  const { lang } = useTranslation();
  const isHindi = lang === 'hi';

  React.useEffect(() => {
    document.title = (isHindi ? 'होमवर्क' : 'Homework') + ' – VidyaMaxx';
  }, [isHindi]);

  const [activeTab, setActiveTab] = React.useState<'assign' | 'review'>('assign');

  // ── ASSIGN STATE ──────────────────────────────────────────
  const [assignClass, setAssignClass] = React.useState<string>('Class 10-A');
  const [assignSubject, setAssignSubject] = React.useState<string>('Mathematics');
  const [assignDue, setAssignDue] = React.useState<string>('');
  const [assignStatus, setAssignStatus] = React.useState<'Published' | 'Draft'>('Published');
  const editorRef = React.useRef<HTMLDivElement>(null);

  // ── REVIEW STATE ──────────────────────────────────────────
  const [homeworkList, setHomeworkList] = React.useState<HomeworkRecord[]>(INITIAL_HOMEWORK);
  const [reviewSearch, setReviewSearch] = React.useState<string>('');
  const [reviewStatusFilter, setReviewStatusFilter] = React.useState<string>('All');
  // When set, shows the submission detail view for that homework
  const [detailHW, setDetailHW] = React.useState<HomeworkRecord | null>(null);

  // Filtered all-class homework for review list
  const filteredHomework = React.useMemo(() => {
    return homeworkList.filter((h) => {
      const matchStatus = reviewStatusFilter === 'All' || h.status === reviewStatusFilter;
      const q = reviewSearch.toLowerCase().trim();
      const matchSearch = !q
        || h.title.toLowerCase().includes(q)
        || h.subject.toLowerCase().includes(q)
        || h.code.toLowerCase().includes(q)
        || h.class.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [homeworkList, reviewSearch, reviewStatusFilter]);

  // Submissions for the detail view
  const detailSubmissions: StudentSubmission[] = detailHW
    ? (SUBMISSIONS_BY_CLASS[detailHW.class] ?? [])
    : [];

  // ── IMAGE PASTE HANDLER ───────────────────────────────────
  const handleEditorPaste = React.useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((i) => i.type.startsWith('image/'));
    if (!imageItem) return; // let default text paste proceed

    e.preventDefault();
    const blob = imageItem.getAsFile();
    if (!blob || !editorRef.current) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      editorRef.current?.focus();
      execFormat('insertImage', dataUrl);
    };
    reader.readAsDataURL(blob);
  }, []);

  // ── ASSIGN SUBMIT ─────────────────────────────────────────
  const handleAssignHomework = () => {
    const textContent = editorRef.current?.textContent?.trim() || '';
    const htmlContent = editorRef.current?.innerHTML?.trim() || '';

    if (!textContent) {
      addNotification({ title: 'Empty', description: 'Write the homework before sending.', type: 'warning' });
      return;
    }
    if (!assignDue) {
      addNotification({ title: 'Due date required', description: 'Set a due date.', type: 'warning' });
      return;
    }

    const newHW: HomeworkRecord = {
      id: String(Date.now()),
      code: `HW-2026-0${homeworkList.length + 1}`,
      title: textContent.slice(0, 60) + (textContent.length > 60 ? '…' : ''),
      subject: assignSubject,
      class: assignClass,
      dueDate: assignDue,
      instructions: htmlContent,
      submitted: 0,
      totalStudents: 42,
      status: assignStatus,
      createdAt: 'Today',
    };

    setHomeworkList((prev) => [newHW, ...prev]);
    if (editorRef.current) editorRef.current.innerHTML = '';
    setAssignDue('');

    addNotification({
      title: assignStatus === 'Published' ? (isHindi ? 'होमवर्क सेंड हुआ' : 'Homework Sent') : 'Draft Saved',
      description: `${newHW.code} → ${assignClass} · ${assignSubject}`,
      type: 'success',
    });
  };

  const handleExport = () => {
    addNotification({ title: 'Exported', description: 'Homework roster exported as CSV.', type: 'success' });
  };

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">

      {/* ── SINGLE UNIFIED HEADER ──────────────────────────── */}
      <div className="p-2.5 rounded-[4px] bg-[#141414] border border-border/80 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 shrink-0 shadow-xs">

        {/* Left: Tab switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#1a1a1a] p-0.5 rounded-[4px] border border-border/70 text-xs">
            <button
              type="button"
              id="tab-assign"
              onClick={() => { setActiveTab('assign'); setDetailHW(null); }}
              className={cn(
                'px-3 py-1.5 font-bold rounded-[3px] transition-colors cursor-pointer flex items-center gap-1.5',
                activeTab === 'assign'
                  ? 'bg-[#2a2a2a] text-foreground shadow-xs border border-border/70'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Plus className="h-3.5 w-3.5" />
              {isHindi ? 'असाइन करें' : 'Assign'}
            </button>
            <button
              type="button"
              id="tab-review"
              onClick={() => { setActiveTab('review'); setDetailHW(null); }}
              className={cn(
                'px-3 py-1.5 font-bold rounded-[3px] transition-colors cursor-pointer flex items-center gap-1.5',
                activeTab === 'review'
                  ? 'bg-[#2a2a2a] text-foreground shadow-xs border border-border/70'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              {isHindi ? 'रिव्यू करें' : 'Review'}
            </button>
          </div>

          {/* Class selector – only in Assign tab */}
          {activeTab === 'assign' && (
            <>
              <div className="h-4 w-[1px] bg-border/70" />
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Class:</span>
                <div className="relative">
                  <select
                    id="assign-class"
                    value={assignClass}
                    onChange={(e) => setAssignClass(e.target.value)}
                    className="h-8 pl-2.5 pr-7 text-xs bg-[#1a1a1a] border border-border rounded-[4px] text-foreground font-bold focus:outline-none focus:border-zinc-500 appearance-none cursor-pointer"
                  >
                    {CLASSES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </>
          )}

          {/* In Review detail view: back breadcrumb */}
          {activeTab === 'review' && detailHW && (
            <>
              <div className="h-4 w-[1px] bg-border/70" />
              <button
                type="button"
                onClick={() => setDetailHW(null)}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                All Homework
              </button>
              <span className="text-muted-foreground text-xs">›</span>
              <span className="text-xs font-bold text-foreground truncate max-w-[180px]">{detailHW.code}</span>
            </>
          )}
        </div>

        {/* Right side in Assign tab: Subject, Due date, and Publish badges */}
        {activeTab === 'assign' && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Subject Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground">Subject:</span>
              <div className="relative">
                <select
                  id="assign-subject"
                  value={assignSubject}
                  onChange={(e) => setAssignSubject(e.target.value)}
                  className="h-8 pl-2.5 pr-7 text-xs bg-[#1a1a1a] border border-border rounded-[4px] text-foreground font-bold focus:outline-none focus:border-zinc-500 appearance-none cursor-pointer"
                >
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="h-4 w-[1px] bg-border/70 hidden sm:block" />

            {/* Due Date */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground">Due:</span>
              <input
                type="date"
                id="assign-due"
                value={assignDue}
                onChange={(e) => setAssignDue(e.target.value)}
                className="h-8 px-2.5 text-xs bg-[#1a1a1a] border border-border rounded-[4px] text-foreground font-mono focus:outline-none focus:border-zinc-500 cursor-pointer"
              />
            </div>

            <div className="h-4 w-[1px] bg-border/70 hidden sm:block" />

            {/* Publish Status Badges */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground">Publish:</span>
              <div className="flex items-center gap-0.5 bg-[#1a1a1a] p-0.5 rounded-[4px] border border-border/70 text-xs">
                <button
                  type="button"
                  onClick={() => setAssignStatus('Published')}
                  className={cn(
                    'px-2.5 py-1 rounded-[3px] font-bold transition-colors cursor-pointer text-xs',
                    assignStatus === 'Published'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Now
                </button>
                <button
                  type="button"
                  onClick={() => setAssignStatus('Draft')}
                  className={cn(
                    'px-2.5 py-1 rounded-[3px] font-bold transition-colors cursor-pointer text-xs',
                    assignStatus === 'Draft'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right: Review filters (hidden in detail view since only submission table shown) */}
        {activeTab === 'review' && !detailHW && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search homework..."
                value={reviewSearch}
                onChange={(e) => setReviewSearch(e.target.value)}
                className="h-8 pl-8 pr-3 text-xs bg-[#1a1a1a] border border-border rounded-[4px] text-foreground placeholder:text-muted-foreground w-40 focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="relative">
              <select
                value={reviewStatusFilter}
                onChange={(e) => setReviewStatusFilter(e.target.value)}
                className="h-8 pl-2.5 pr-7 text-xs bg-[#1a1a1a] border border-border rounded-[4px] text-foreground font-semibold focus:outline-none focus:border-zinc-500 appearance-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Closed">Closed</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
            <VFButton
              size="sm"
              variant="outline"
              onClick={handleExport}
              className="h-8 px-2.5 text-xs font-bold rounded-[4px]"
              leftIcon={<Download className="h-3.5 w-3.5" />}
            >
              Export
            </VFButton>
          </div>
        )}

        {/* Detail view right side: export submissions */}
        {activeTab === 'review' && detailHW && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-muted-foreground">
              {detailHW.class} · {detailHW.subject}
            </span>
            <VFButton
              size="sm"
              variant="outline"
              onClick={handleExport}
              className="h-8 px-2.5 text-xs font-bold rounded-[4px]"
              leftIcon={<Download className="h-3.5 w-3.5" />}
            >
              Export
            </VFButton>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          TAB 1 — ASSIGN (Rich-text editor)
          ══════════════════════════════════════════ */}
      {activeTab === 'assign' && (
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Rich Text Editor */}
          <VFCard className="bg-[#141414] border-border/80 flex-1 min-h-0 flex flex-col" bodyClassName="p-0 flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-3 py-2 border-b border-border/70 bg-[#1a1a1a] shrink-0">
              <span className="text-[10px] font-semibold text-muted-foreground mr-2 hidden sm:inline">Format</span>

              {[
                { icon: <Bold className="h-3.5 w-3.5" />, cmd: 'bold', title: 'Bold' },
                { icon: <Italic className="h-3.5 w-3.5" />, cmd: 'italic', title: 'Italic' },
              ].map((btn) => (
                <button
                  key={btn.cmd}
                  type="button"
                  title={btn.title}
                  onMouseDown={(e) => { e.preventDefault(); execFormat(btn.cmd); }}
                  className="p-1.5 rounded-[3px] text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                >
                  {btn.icon}
                </button>
              ))}

              <div className="w-[1px] h-4 bg-border/70 mx-1" />

              <button type="button" title="Bullet list" onMouseDown={(e) => { e.preventDefault(); execFormat('insertUnorderedList'); }} className="p-1.5 rounded-[3px] text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a] transition-colors cursor-pointer">
                <List className="h-3.5 w-3.5" />
              </button>
              <button type="button" title="Numbered list" onMouseDown={(e) => { e.preventDefault(); execFormat('insertOrderedList'); }} className="p-1.5 rounded-[3px] text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a] transition-colors cursor-pointer">
                <FileText className="h-3.5 w-3.5" />
              </button>
              <button type="button" title="Quote" onMouseDown={(e) => { e.preventDefault(); execFormat('formatBlock', 'blockquote'); }} className="p-1.5 rounded-[3px] text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a] transition-colors cursor-pointer">
                <Quote className="h-3.5 w-3.5" />
              </button>

              <div className="w-[1px] h-4 bg-border/70 mx-1" />

              {['H1', 'H2', 'H3'].map((h) => (
                <button
                  key={h}
                  type="button"
                  title={`Heading ${h.slice(1)}`}
                  onMouseDown={(e) => { e.preventDefault(); execFormat('formatBlock', h.toLowerCase()); }}
                  className="px-1.5 py-1 text-[10px] font-black rounded-[3px] text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                >
                  {h}
                </button>
              ))}

              <div className="w-[1px] h-4 bg-border/70 mx-1" />

              {/* File-picker attach (for manual pick) */}
              <label title="Attach photo" className="p-1.5 rounded-[3px] text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a] transition-colors cursor-pointer flex items-center gap-1">
                <Image className="h-3.5 w-3.5" />
                <span className="text-[10px] font-semibold hidden sm:inline">Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file || !editorRef.current) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const dataUrl = ev.target?.result as string;
                      editorRef.current?.focus();
                      execFormat('insertImage', dataUrl);
                    };
                    reader.readAsDataURL(file);
                    e.target.value = '';
                  }}
                />
              </label>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { if (editorRef.current) editorRef.current.innerHTML = ''; }}
                  className="text-[10px] font-semibold text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer px-1.5"
                >
                  Clear
                </button>
                <VFButton
                  size="sm"
                  onClick={handleAssignHomework}
                  className="h-7 px-3 text-[11px] font-bold rounded-[4px] shadow-xs"
                  leftIcon={<Send className="h-3 w-3" />}
                >
                  {assignStatus === 'Published' ? 'Send' : 'Save Draft'}
                </VFButton>
              </div>
            </div>

            {/* Editable area */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              id="hw-editor"
              data-placeholder={isHindi
                ? 'यहाँ होमवर्क टाइप करें… क्वेश्चंस, निर्देश, या बोर्ड की फ़ोटो पेस्ट करें।'
                : 'Write homework here… questions, page refs, instructions. Paste a board photo directly.'}
              onPaste={handleEditorPaste}
              className={cn(
                'flex-1 min-h-0 overflow-y-auto p-4 text-sm text-foreground leading-relaxed focus:outline-none',
                '[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-muted-foreground [&:empty]:before:pointer-events-none',
                '[&_blockquote]:border-l-2 [&_blockquote]:border-zinc-500 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_blockquote]:italic',
                '[&_h1]:text-lg [&_h1]:font-black [&_h1]:text-foreground [&_h1]:mb-1',
                '[&_h2]:text-base [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mb-1',
                '[&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-zinc-300 [&_h3]:mb-1',
                '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-0.5',
                '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-0.5',
                '[&_img]:max-w-full [&_img]:max-h-80 [&_img]:object-contain [&_img]:rounded-[4px] [&_img]:border [&_img]:border-border/70 [&_img]:mt-2 [&_img]:block'
              )}
            />

            <div className="px-4 py-2 border-t border-border/40 shrink-0 flex items-center gap-2 text-[10px] text-muted-foreground bg-[#111]">
              <span>💡</span>
              <span>Paste a photo of the blackboard directly (Ctrl+V) — it will embed inline. Use Bold for question numbers.</span>
            </div>
          </VFCard>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB 2 — REVIEW: All classes homework table
          ══════════════════════════════════════════ */}
      {activeTab === 'review' && !detailHW && (
        <VFCard className="bg-[#141414] border-border/80 flex-1 min-h-0 flex flex-col" bodyClassName="p-0 flex-1 flex flex-col overflow-hidden">
          <VFTable className="w-full text-xs border-0 rounded-none" containerClassName="border-0 rounded-none flex-1 min-h-0">
            <VFTableHead className="bg-[#1a1a1a] sticky top-0 z-10">
              <VFTableRow>
                <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground w-28 text-center" align="center">Code</VFTableHeaderCell>
                <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground">Homework</VFTableHeaderCell>
                <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground w-24 text-center" align="center">Class</VFTableHeaderCell>
                <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground w-28">Due</VFTableHeaderCell>
                <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground w-40">Submitted</VFTableHeaderCell>
                <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground w-24 text-center" align="center">Status</VFTableHeaderCell>
                <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground w-20 text-center" align="center">Action</VFTableHeaderCell>
              </VFTableRow>
            </VFTableHead>
            <VFTableBody>
              {filteredHomework.length === 0 ? (
                <VFTableRow>
                  <VFTableCell colSpan={7} className="py-12 text-center text-muted-foreground text-xs">
                    No assignments found.
                  </VFTableCell>
                </VFTableRow>
              ) : (
                filteredHomework.map((hw) => {
                  const pct = Math.round((hw.submitted / hw.totalStudents) * 100);
                  return (
                    <VFTableRow key={hw.id} className="hover:bg-[#1a1a1a]/60 transition-colors">
                      <VFTableCell className="py-2.5 px-3 text-center" align="center">
                        <span className="font-mono font-bold text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded-[2px] border border-border/50">
                          {hw.code}
                        </span>
                      </VFTableCell>
                      <VFTableCell className="py-2.5 px-3">
                        <p className="font-bold text-foreground text-xs leading-tight max-w-[200px] sm:max-w-[260px] truncate" title={hw.title}>{hw.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[200px] sm:max-w-[260px] truncate">{hw.subject}</p>
                      </VFTableCell>
                      <VFTableCell className="py-2.5 px-3 text-center" align="center">
                        <span className="font-bold text-xs text-foreground">{hw.class}</span>
                      </VFTableCell>
                      <VFTableCell className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground">
                        {hw.dueDate}
                      </VFTableCell>
                      <VFTableCell className="py-2.5 px-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono font-bold">
                            <span className="text-muted-foreground">{hw.submitted}/{hw.totalStudents}</span>
                            <span className={pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-rose-400'}>
                              {pct}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-[2px] bg-[#111] overflow-hidden border border-border/40">
                            <div
                              className={cn('h-full rounded-[2px]', pct >= 80 ? 'bg-emerald-400' : pct >= 50 ? 'bg-amber-400' : 'bg-rose-400')}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </VFTableCell>
                      <VFTableCell className="py-2.5 px-3 text-center" align="center">
                        <VFBadge
                          variant={hw.status === 'Published' ? 'success' : hw.status === 'Draft' ? 'warning' : 'outline'}
                          className="text-[10px] font-bold"
                        >
                          {hw.status}
                        </VFBadge>
                      </VFTableCell>
                      <VFTableCell className="py-2.5 px-3 text-center" align="center">
                        <VFButton
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 border-border hover:border-zinc-500 rounded-[4px] mx-auto"
                          title={isHindi ? 'असाइनमेंट देखें' : 'View Homework Details'}
                          aria-label={isHindi ? 'असाइनमेंट देखें' : 'View Homework Details'}
                          onClick={() => setDetailHW(hw)}
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        </VFButton>
                      </VFTableCell>
                    </VFTableRow>
                  );
                })
              )}
            </VFTableBody>
          </VFTable>
        </VFCard>
      )}

      {/* ══════════════════════════════════════════
          TAB 2 — DETAIL: Student submission view
          ══════════════════════════════════════════ */}
      {activeTab === 'review' && detailHW && (
        <div className="flex-1 min-h-0 flex flex-col gap-3">
          {/* Summary stats */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {(() => {
              const subs = detailSubmissions;
              const submitted = subs.filter((s) => s.status === 'Submitted').length;
              const late = subs.filter((s) => s.status === 'Late').length;
              const pending = subs.filter((s) => s.status === 'Pending').length;
              const total = detailHW.totalStudents;
              const pct = Math.round(((submitted + late) / total) * 100);
              return (
                <>
                  <div className="flex-1 min-w-[180px] p-3 rounded-[4px] bg-[#141414] border border-border/80 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold">Total Students</p>
                      <p className="text-xl font-black text-foreground font-mono">{total}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground font-semibold">Turn-in Rate</p>
                      <p className={cn('text-xl font-black font-mono', pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-rose-400')}>{pct}%</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-[4px] bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Submitted</p>
                      <p className="text-base font-black text-emerald-400 font-mono">{submitted}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-[4px] bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-400" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Late</p>
                      <p className="text-base font-black text-amber-400 font-mono">{late}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-[4px] bg-rose-500/10 border border-rose-500/30 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-400" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Pending</p>
                      <p className="text-base font-black text-rose-400 font-mono">{pending}</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Student table */}
          <VFCard className="bg-[#141414] border-border/80 flex-1 min-h-0 flex flex-col" bodyClassName="p-0 flex-1 overflow-auto">
            <VFTable className="w-full text-xs border-0 rounded-none" containerClassName="border-0 rounded-none flex-1 min-h-0">
              <VFTableHead className="bg-[#1a1a1a] sticky top-0 z-10">
                <VFTableRow>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground w-16 text-center" align="center">Roll</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground">Student</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground w-44">Submitted At</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-3 text-xs font-bold text-muted-foreground">File</VFTableHeaderCell>
                  <VFTableHeaderCell className="py-2.5 px-4 text-xs font-bold text-muted-foreground w-24 text-center" align="center">Status</VFTableHeaderCell>
                </VFTableRow>
              </VFTableHead>
              <VFTableBody>
                {detailSubmissions.length === 0 ? (
                  <VFTableRow>
                    <VFTableCell colSpan={5} className="py-12 text-center text-muted-foreground text-xs">
                      No submission data available.
                    </VFTableCell>
                  </VFTableRow>
                ) : (
                  detailSubmissions.map((s) => (
                    <VFTableRow key={s.roll} className="hover:bg-[#1a1a1a]/60 whitespace-nowrap">
                      <VFTableCell className="py-2.5 px-3 font-mono font-bold text-muted-foreground text-xs text-center" align="center">{s.roll}</VFTableCell>
                      <VFTableCell className="py-2.5 px-3 font-bold text-foreground text-xs max-w-[180px] truncate" title={s.name}>{s.name}</VFTableCell>
                      <VFTableCell className="py-2.5 px-3 text-xs font-mono text-muted-foreground">
                        {s.status === 'Pending'
                          ? <span className="text-rose-400 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Not submitted</span>
                          : <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-zinc-500" /> {s.submittedAt}</span>
                        }
                      </VFTableCell>
                      <VFTableCell className="py-2.5 px-3 text-xs max-w-[180px] truncate" title={s.file}>
                        {s.file === '—'
                          ? <span className="text-muted-foreground">—</span>
                          : <span className="flex items-center gap-1 text-blue-400 font-mono cursor-pointer hover:underline truncate"><FileText className="h-3 w-3 shrink-0" /> <span className="truncate">{s.file}</span></span>
                        }
                      </VFTableCell>
                      <VFTableCell className="py-2.5 px-4 text-center" align="center">
                        <VFBadge
                          variant={s.status === 'Submitted' ? 'success' : s.status === 'Late' ? 'warning' : 'danger'}
                          className="text-[10px] font-bold"
                        >
                          {s.status}
                        </VFBadge>
                      </VFTableCell>
                    </VFTableRow>
                  ))
                )}
              </VFTableBody>
            </VFTable>
          </VFCard>
        </div>
      )}
    </VFPageContainer>
  );
}
