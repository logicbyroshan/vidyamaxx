import * as React from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFDataTable,
  VFButton,
  VFBadge,
  VFDrawer,
  VFSelect,
  VFInput,
} from '@vidyamaxx/ui';
import {
  Award,
  Plus,
  Download,
  Check,
  Printer,
  ShieldCheck,
  User,
  Phone,
  Building,
  FileText,
  ExternalLink,
  CreditCard,
  GraduationCap,
  AlertCircle,
  FileCheck,
  UploadCloud,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/scholarships')({
  component: ScholarshipsPage,
});

export interface ScholarshipRecord {
  id: string;
  studentName: string;
  studentAdmNo: string;
  photoUrl: string;
  class: string;
  schemeName: string;
  category: 'Govt RTE / NSP' | 'Academic Merit' | 'Sports Talent' | 'Sibling / Staff' | 'EWS Aid';
  waiverPercentage: number;
  waiverAmount: number;
  fundingAgency: string;
  disbursalMode: 'Direct Govt DBT Credit' | 'School Trust Endowment' | 'Corporate CSR Grant';
  sanctionRef: string;
  sanctionDate: string;
  status: 'Active Disbursed' | 'Govt Verified' | 'Renewal Pending';
  guardianName: string;
  phone: string;
  notes: string;
  verifiedDocs?: Array<{ name: string; type: string; isUploaded: boolean }>;
}

export interface StudentDirectoryItem {
  admNo: string;
  name: string;
  class: string;
  photoUrl: string;
  rollNo: string;
  guardianName: string;
  phone: string;
  academicScore: number;
  familyIncome: number;
  category: string;
  isRTE: boolean;
  hasSiblingInSchool: boolean;
  sportsAchievement?: string;
}

export const ALL_STUDENTS_DIRECTORY: StudentDirectoryItem[] = [
  {
    admNo: 'ADM-2026-001',
    name: 'Aditya Verma',
    class: 'Class 9-A',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    rollNo: '101',
    guardianName: 'Mr. Ramesh Verma',
    phone: '+91 98765 43210',
    academicScore: 88.5,
    familyIncome: 240000,
    category: 'OBC',
    isRTE: false,
    hasSiblingInSchool: false,
  },
  {
    admNo: 'ADM-2026-002',
    name: 'Priya Sharma',
    class: 'Class 9-A',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    rollNo: '102',
    guardianName: 'Dr. Suresh Sharma',
    phone: '+91 98123 45678',
    academicScore: 99.4,
    familyIncome: 850000,
    category: 'General',
    isRTE: false,
    hasSiblingInSchool: false,
  },
  {
    admNo: 'ADM-2026-003',
    name: 'Rahul Gupta',
    class: 'Class 9-B',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    rollNo: '103',
    guardianName: 'Mr. Sunil Gupta',
    phone: '+91 97654 32109',
    academicScore: 82.0,
    familyIncome: 180000,
    category: 'SC / EWS',
    isRTE: true,
    hasSiblingInSchool: false,
  },
  {
    admNo: 'ADM-2026-004',
    name: 'Kavya Nair',
    class: 'Class 11-Com',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    rollNo: '201',
    guardianName: 'Mr. K. R. Nair',
    phone: '+91 99887 76655',
    academicScore: 84.0,
    familyIncome: 650000,
    category: 'General',
    isRTE: false,
    hasSiblingInSchool: false,
    sportsAchievement: 'National Badminton U-17 Champion',
  },
  {
    admNo: 'ADM-2026-005',
    name: 'Ishaan Malhotra',
    class: 'Class 11-Sci',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    rollNo: '202',
    guardianName: 'Mr. Vivek Malhotra',
    phone: '+91 98234 56789',
    academicScore: 81.2,
    familyIncome: 450000,
    category: 'General',
    isRTE: false,
    hasSiblingInSchool: true,
  },
  {
    admNo: 'ADM-2026-006',
    name: 'Sneha Rao',
    class: 'Class 10-A',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    rollNo: '100',
    guardianName: 'Mrs. Rekha Rao',
    phone: '+91 98345 67890',
    academicScore: 97.5,
    familyIncome: 310000,
    category: 'General',
    isRTE: false,
    hasSiblingInSchool: false,
  },
  {
    admNo: 'ADM-2026-007',
    name: 'Vikram Mehta',
    class: 'Class 12-Com',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    rollNo: '304',
    guardianName: 'Mr. Anoop Mehta',
    phone: '+91 98456 78901',
    academicScore: 83.0,
    familyIncome: 700000,
    category: 'General',
    isRTE: false,
    hasSiblingInSchool: false,
    sportsAchievement: 'State Swimming Gold Medalist',
  },
  {
    admNo: 'ADM-2026-008',
    name: 'Ananya Deshmukh',
    class: 'Class 12-Sci',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    rollNo: '305',
    guardianName: 'Mr. Sanjay Deshmukh',
    phone: '+91 98567 89012',
    academicScore: 96.0,
    familyIncome: 220000,
    category: 'EWS',
    isRTE: false,
    hasSiblingInSchool: false,
  },
];

export interface SchemeTemplate {
  id: string;
  name: string;
  category: ScholarshipRecord['category'];
  waiverPercentage: number;
  waiverAmount: number;
  fundingAgency: string;
  disbursalMode: ScholarshipRecord['disbursalMode'];
  checkEligibility: (student: StudentDirectoryItem) => { isEligible: boolean; reason: string };
  requiredDocs: string[];
}

export const SCHEME_TEMPLATES: SchemeTemplate[] = [
  {
    id: 'merit-100',
    name: 'Institutional Academic Board Merit Excellence (100% Free-ship)',
    category: 'Academic Merit',
    waiverPercentage: 100,
    waiverAmount: 42000,
    fundingAgency: 'VidyaMaxx Education Foundation Endowment',
    disbursalMode: 'School Trust Endowment',
    checkEligibility: (s) =>
      s.academicScore >= 95
        ? { isEligible: true, reason: `Academic score ${s.academicScore}% meets 95%+ merit threshold` }
        : { isEligible: false, reason: `Academic score ${s.academicScore}% is below 95% cutoff` },
    requiredDocs: ['Previous Year Official CBSE Marksheet', 'Principal Recommendation Letter'],
  },
  {
    id: 'nsp-govt',
    name: 'National Means-cum-Merit Scholarship (NSP Scheme)',
    category: 'Govt RTE / NSP',
    waiverPercentage: 50,
    waiverAmount: 21000,
    fundingAgency: 'Ministry of Education (Govt. of India)',
    disbursalMode: 'Direct Govt DBT Credit',
    checkEligibility: (s) =>
      s.familyIncome <= 350000
        ? { isEligible: true, reason: `Annual income ₹${s.familyIncome.toLocaleString('en-IN')} is within ₹3.5L ceiling` }
        : { isEligible: false, reason: `Annual income ₹${s.familyIncome.toLocaleString('en-IN')} exceeds ₹3.5L ceiling` },
    requiredDocs: ['Parent Income Certificate (Revenue Dept)', 'NSP Portal Verification Acknowledgment'],
  },
  {
    id: 'sports-talent',
    name: 'National & State Sports Talent Free-ship Concession',
    category: 'Sports Talent',
    waiverPercentage: 75,
    waiverAmount: 36000,
    fundingAgency: 'Sports Authority of India (SAI) & Institutional Trust',
    disbursalMode: 'Corporate CSR Grant',
    checkEligibility: (s) =>
      s.sportsAchievement
        ? { isEligible: true, reason: `Recognized achievement: ${s.sportsAchievement}` }
        : { isEligible: false, reason: 'No registered State/National sports tournament medal' },
    requiredDocs: ['State/National Sports Certificate', 'Physical Education Director Endorsement'],
  },
  {
    id: 'sibling-relief',
    name: 'Sibling Concession Grant (Elder Sibling in School)',
    category: 'Sibling / Staff',
    waiverPercentage: 25,
    waiverAmount: 13000,
    fundingAgency: 'VidyaMaxx Institutional Parent Relief Scheme',
    disbursalMode: 'School Trust Endowment',
    checkEligibility: (s) =>
      s.hasSiblingInSchool
        ? { isEligible: true, reason: 'Second child currently enrolled in school' }
        : { isEligible: false, reason: 'No active elder sibling found on roll' },
    requiredDocs: ['Sibling Admission Record Copy', 'Parent Declaration Letter'],
  },
  {
    id: 'ews-aid',
    name: 'EWS & Disadvantaged Group Financial Relief Aid',
    category: 'EWS Aid',
    waiverPercentage: 50,
    waiverAmount: 21000,
    fundingAgency: 'Directorate of Social Welfare & School Trust',
    disbursalMode: 'School Trust Endowment',
    checkEligibility: (s) =>
      s.category.includes('EWS') || s.isRTE || s.familyIncome <= 250000
        ? { isEligible: true, reason: 'Meets EWS / Social Welfare income & category criteria' }
        : { isEligible: false, reason: 'Does not fall under EWS reservation quota' },
    requiredDocs: ['Government EWS Certificate', 'BPL / Income Affidavit by Magistrate'],
  },
];

const INITIAL_SCHOLARSHIPS: ScholarshipRecord[] = [
  {
    id: '1',
    studentName: 'Aditya Verma',
    studentAdmNo: 'ADM-2026-001',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    class: 'Class 9-A',
    schemeName: 'National Means-cum-Merit Scholarship (NSP Scheme)',
    category: 'Govt RTE / NSP',
    waiverPercentage: 50,
    waiverAmount: 21000,
    fundingAgency: 'Ministry of Education (Govt. of India)',
    disbursalMode: 'Direct Govt DBT Credit',
    sanctionRef: 'NSP-2026-HR-991823',
    sanctionDate: '15 Apr 2026',
    status: 'Active Disbursed',
    guardianName: 'Mr. Ramesh Verma',
    phone: '+91 98765 43210',
    notes: 'Govt central portal DBT scholarship reimbursed directly to institution nodal account.',
    verifiedDocs: [
      { name: 'Parent Income Certificate (Revenue Dept)', type: 'Income Certificate', isUploaded: true },
      { name: 'NSP Portal Verification Acknowledgment', type: 'Govt Portal Letter', isUploaded: true },
    ],
  },
  {
    id: '2',
    studentName: 'Priya Sharma',
    studentAdmNo: 'ADM-2026-002',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    class: 'Class 9-A',
    schemeName: 'Institutional Academic Board Merit Excellence (100% Free-ship)',
    category: 'Academic Merit',
    waiverPercentage: 100,
    waiverAmount: 42000,
    fundingAgency: 'VidyaMaxx Education Foundation Endowment',
    disbursalMode: 'School Trust Endowment',
    sanctionRef: 'VFEF-MERIT-2026-01',
    sanctionDate: '01 Apr 2026',
    status: 'Active Disbursed',
    guardianName: 'Dr. Suresh Sharma',
    phone: '+91 98123 45678',
    notes: 'Awarded for scoring 99.4% in CBSE Class 8 State Examinations. 100% tuition waived.',
    verifiedDocs: [
      { name: 'Previous Year Official CBSE Marksheet', type: 'Marksheet', isUploaded: true },
      { name: 'Principal Recommendation Letter', type: 'Endorsement', isUploaded: true },
    ],
  },
  {
    id: '3',
    studentName: 'Rahul Gupta',
    studentAdmNo: 'ADM-2026-003',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    class: 'Class 9-B',
    schemeName: 'RTE Section 134-A State Education Free-ship Quota',
    category: 'Govt RTE / NSP',
    waiverPercentage: 100,
    waiverAmount: 42000,
    fundingAgency: 'Directorate of School Education (Govt. of NCT)',
    disbursalMode: 'Direct Govt DBT Credit',
    sanctionRef: 'DEL-RTE-134A-88410',
    sanctionDate: '10 May 2026',
    status: 'Govt Verified',
    guardianName: 'Mr. Sunil Gupta',
    phone: '+91 97654 32109',
    notes: 'RTE admission allotment with full tuition & lab fee reimbursement from state treasury.',
    verifiedDocs: [
      { name: 'Government RTE Allotment Letter', type: 'Allotment Letter', isUploaded: true },
      { name: 'Income & Caste Affidavit', type: 'Affidavit', isUploaded: true },
    ],
  },
  {
    id: '4',
    studentName: 'Kavya Nair',
    studentAdmNo: 'ADM-2026-004',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    class: 'Class 11-Com',
    schemeName: 'National Athletics Gold Medalist Sports Free-ship',
    category: 'Sports Talent',
    waiverPercentage: 75,
    waiverAmount: 36000,
    fundingAgency: 'Sports Authority of India (SAI) & Institutional Trust',
    disbursalMode: 'Corporate CSR Grant',
    sanctionRef: 'SAI-CSR-SPORTS-2026-44',
    sanctionDate: '20 Jun 2026',
    status: 'Active Disbursed',
    guardianName: 'Mr. K. R. Nair',
    phone: '+91 99887 76655',
    notes: 'National Badminton U-17 Champion. 75% fee grant with special coaching allowance.',
    verifiedDocs: [
      { name: 'State/National Sports Certificate', type: 'Sports Certificate', isUploaded: true },
      { name: 'Physical Education Director Endorsement', type: 'Endorsement', isUploaded: true },
    ],
  },
];

function ScholarshipsPage() {
  const navigate = useNavigate();
  const { addNotification } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  React.useEffect(() => { document.title = t('page.scholarships') + ' \u2013 VidyaMaxx'; }, [t]);
  const [scholarships, setScholarships] = React.useState<ScholarshipRecord[]>(INITIAL_SCHOLARSHIPS);
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [selectedRecordIndex, setSelectedRecordIndex] = React.useState<number | null>(null);

  // Drawers
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = React.useState<boolean>(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = React.useState<boolean>(false);

  // Application & Award Drawer Form State
  const [selectedStudentAdm, setSelectedStudentAdm] = React.useState<string>('ADM-2026-005');
  const [selectedSchemeId, setSelectedSchemeId] = React.useState<string>('sibling-relief');
  const [customSchemeName, setCustomSchemeName] = React.useState<string>('');
  const [customCategory, setCustomCategory] = React.useState<ScholarshipRecord['category']>('Sibling / Staff');
  const [customWaiverPct, setCustomWaiverPct] = React.useState<string>('25');
  const [customFundingAgency, setCustomFundingAgency] = React.useState<string>('VidyaMaxx Institutional Parent Relief Scheme');
  const [customDisbursalMode, setCustomDisbursalMode] = React.useState<ScholarshipRecord['disbursalMode']>('School Trust Endowment');
  const [customSanctionRef, setCustomSanctionRef] = React.useState<string>('SCH-SIB-2026-08');
  const [auditRemarks, setAuditRemarks] = React.useState<string>('Parent declaration verified against institutional records.');

  // Document checklist state in Add Drawer
  const [uploadedDocs, setUploadedDocs] = React.useState<Record<string, boolean>>({
    doc_0: true,
    doc_1: true,
  });

  // Selected student object from directory
  const currentStudentObj = React.useMemo(() => {
    return ALL_STUDENTS_DIRECTORY.find((s) => s.admNo === selectedStudentAdm) || ALL_STUDENTS_DIRECTORY[4];
  }, [selectedStudentAdm]);

  // Check if selected student already has an active grant
  const studentActiveGrant = React.useMemo(() => {
    return scholarships.find(
      (s) =>
        s.studentAdmNo.toLowerCase() === selectedStudentAdm.toLowerCase() ||
        s.studentAdmNo.replace('-00', '-084').toLowerCase() === selectedStudentAdm.toLowerCase()
    );
  }, [scholarships, selectedStudentAdm]);

  // Handle selecting a scheme template
  const handleSelectSchemeTemplate = (template: SchemeTemplate) => {
    setSelectedSchemeId(template.id);
    setCustomSchemeName(template.name);
    setCustomCategory(template.category);
    setCustomWaiverPct(String(template.waiverPercentage));
    setCustomFundingAgency(template.fundingAgency);
    setCustomDisbursalMode(template.disbursalMode);
    setCustomSanctionRef(`SCH-${template.id.toUpperCase()}-${Date.now().toString().slice(-4)}`);
  };

  // Synchronize scheme fields when student or scheme template changes
  React.useEffect(() => {
    const template = SCHEME_TEMPLATES.find((t) => t.id === selectedSchemeId);
    if (template) {
      setCustomSchemeName(template.name);
      setCustomCategory(template.category);
      setCustomWaiverPct(String(template.waiverPercentage));
      setCustomFundingAgency(template.fundingAgency);
      setCustomDisbursalMode(template.disbursalMode);
      setCustomSanctionRef(`SCH-${template.id.toUpperCase()}-${Date.now().toString().slice(-4)}`);
    }
  }, [selectedSchemeId]);

  // Deep-link URL parameter auto-open handler (e.g. /scholarships?student=ADM-2026-001 or ?action=apply&scheme=merit-100)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const studentQuery = urlParams.get('student') || urlParams.get('search') || urlParams.get('name');
    const schemeQuery = urlParams.get('scheme');
    const isApplyMode = urlParams.get('apply') === 'true' || urlParams.get('action') === 'apply';

    if (studentQuery) {
      const q = studentQuery.toLowerCase().trim();
      const matchedIdx = scholarships.findIndex(
        (s) =>
          s.studentAdmNo.toLowerCase() === q ||
          s.studentAdmNo.replace('-00', '-084').toLowerCase() === q ||
          s.studentAdmNo.replace('-084', '-00').toLowerCase() === q ||
          s.studentName.toLowerCase().includes(q)
      );

      if (matchedIdx >= 0 && !isApplyMode) {
        setSelectedRecordIndex(matchedIdx);
        setIsDetailsDrawerOpen(true);
      } else if (isApplyMode) {
        // Find matching student in directory
        const dirStudent = ALL_STUDENTS_DIRECTORY.find(
          (s) =>
            s.admNo.toLowerCase() === q ||
            s.admNo.replace('-00', '-084').toLowerCase() === q ||
            s.name.toLowerCase().includes(q)
        );
        if (dirStudent) {
          setSelectedStudentAdm(dirStudent.admNo);
        }
        if (schemeQuery) {
          const matchedScheme = SCHEME_TEMPLATES.find((t) => t.id === schemeQuery);
          if (matchedScheme) {
            handleSelectSchemeTemplate(matchedScheme);
          }
        }
        setIsAddDrawerOpen(true);
      }
    }
  }, [scholarships]);

  const filteredScholarships = React.useMemo(() => {
    return scholarships.filter((s) => {
      if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
      return true;
    });
  }, [scholarships, categoryFilter]);

  const activeRecord =
    selectedRecordIndex !== null && selectedRecordIndex >= 0 && selectedRecordIndex < scholarships.length
      ? scholarships[selectedRecordIndex]
      : null;

  const openDossier = (record: ScholarshipRecord) => {
    const idx = scholarships.findIndex((s) => s.id === record.id);
    setSelectedRecordIndex(idx >= 0 ? idx : 0);
    setIsDetailsDrawerOpen(true);
  };

  const handleSaveAward = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customSchemeName.trim()) {
      alert('Please select or enter the Scholarship Scheme Name.');
      return;
    }

    // Rule: Maximum 1 scholarship per student
    if (studentActiveGrant) {
      addNotification({
        title: 'Single Scholarship Rule Violation',
        description: `Cannot award multiple scholarships: ${currentStudentObj.name} (${selectedStudentAdm}) already holds an active grant ('${studentActiveGrant.schemeName}'). Maximum 1 grant permitted per student.`,
        type: 'error',
      });
      return;
    }

    const pct = Number(customWaiverPct) || 50;
    const estimatedWaiver = Math.round((42000 * pct) / 100);

    const newRecord: ScholarshipRecord = {
      id: String(Date.now()),
      studentName: currentStudentObj.name,
      studentAdmNo: currentStudentObj.admNo,
      photoUrl: currentStudentObj.photoUrl,
      class: currentStudentObj.class,
      schemeName: customSchemeName.trim(),
      category: customCategory,
      waiverPercentage: pct,
      waiverAmount: estimatedWaiver,
      fundingAgency: customFundingAgency.trim() || 'VidyaMaxx Institutional Parent Relief Scheme',
      disbursalMode: customDisbursalMode,
      sanctionRef: customSanctionRef.trim() || `SCH-${Date.now().toString().slice(-6)}`,
      sanctionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Active Disbursed',
      guardianName: currentStudentObj.guardianName,
      phone: currentStudentObj.phone,
      notes: auditRemarks || `Institutional grant sanctioned on ${new Date().toLocaleDateString('en-GB')} with ${pct}% tuition concession.`,
      verifiedDocs: [
        { name: 'Parent Income Certificate / Declaration', type: 'Income Record', isUploaded: true },
        { name: 'Marksheet / Academic Verification', type: 'Academic Record', isUploaded: true },
      ],
    };

    setScholarships([newRecord, ...scholarships]);
    setIsAddDrawerOpen(false);

    addNotification({
      title: 'Scholarship Awarded & Disbursed',
      description: `Successfully sanctioned '${customSchemeName}' for ${currentStudentObj.name} (${currentStudentObj.admNo}).`,
      type: 'success',
    });
  };

  const columns = [
    {
      header: isHindi ? 'स्टूडेंट & एडमिशन नं.' : 'Student & Adm No',
      accessorKey: 'studentName',
      cell: (r: ScholarshipRecord) => (
        <div className="flex items-center gap-3">
          <div className="relative overflow-hidden rounded-[4px] border border-border/80 shadow-xs w-10 h-[50px] shrink-0 bg-muted flex items-center justify-center">
            <img
              src={r.photoUrl}
              alt={r.studentName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-bold text-foreground text-xs block">{r.studentName}</span>
            <span className="text-[11px] font-mono text-zinc-400 font-semibold">{r.studentAdmNo}</span>
          </div>
        </div>
      ),
    },
    {
      header: t('col.class'),
      accessorKey: 'class',
      cell: (r: ScholarshipRecord) => (
        <VFBadge variant="outline" className="text-[11px] font-mono font-bold rounded-[4px] bg-[#181818] border-border">
          {r.class}
        </VFBadge>
      ),
    },
    {
      header: isHindi ? 'सैंक्शन स्कीम & कैटेगरी' : 'Sanctioned Scheme & Category',
      accessorKey: 'schemeName',
      cell: (r: ScholarshipRecord) => (
        <div className="max-w-[280px]">
          <span className="font-bold text-foreground text-xs block truncate" title={r.schemeName}>
            {r.schemeName}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <VFBadge variant="primary" className="text-[10px] font-bold rounded-[4px]">
              {r.category}
            </VFBadge>
            <span className="text-[10px] font-mono text-zinc-400 truncate">{r.sanctionRef}</span>
          </div>
        </div>
      ),
    },
    {
      header: isHindi ? 'फीस वेवर' : 'Waiver Concession',
      accessorKey: 'waiverAmount',
      cell: (r: ScholarshipRecord) => (
        <div>
          <span className="font-mono font-black text-emerald-400 text-xs block">
            ₹{r.waiverAmount.toLocaleString('en-IN')} / AY
          </span>
          <span className="text-[10px] text-zinc-400 font-semibold">{r.waiverPercentage}% {isHindi ? 'ट्यूशन फीस वेवर' : 'Tuition Waiver'}</span>
        </div>
      ),
    },
    {
      header: isHindi ? 'फंडिंग एजेंसी' : 'Funded By',
      accessorKey: 'disbursalMode',
      cell: (r: ScholarshipRecord) => (
        <div>
          <p className="text-xs font-bold text-foreground truncate max-w-[190px]" title={r.fundingAgency}>
            {r.fundingAgency}
          </p>
          <span className="text-[10px] font-mono text-zinc-400 font-medium">{r.disbursalMode}</span>
        </div>
      ),
    },
    {
      header: t('col.status'),
      accessorKey: 'status',
      cell: (r: ScholarshipRecord) => (
        <VFBadge variant={r.status === 'Active Disbursed' ? 'success' : 'warning'} className="rounded-[4px]">
          {r.status === 'Active Disbursed' ? (isHindi ? 'एक्टिव डिसबर्स्ड' : r.status) : r.status === 'Govt Verified' ? (isHindi ? 'गवर्नमेंट वेरिफाइड' : r.status) : (isHindi ? 'रिन्यूअल पेंडिंग' : r.status)}
        </VFBadge>
      ),
    },
    {
      header: t('col.action'),
      accessorKey: 'action',
      cell: (r: ScholarshipRecord) => (
        <VFButton
          size="icon"
          variant="outline"
          className="h-7 w-7 bg-[#1a1a1a] hover:bg-[#242424] border-border hover:border-zinc-500 text-foreground shadow-xs rounded-[4px]"
          title={isHindi ? 'डोजियर देखें' : 'View Dossier'}
          aria-label={isHindi ? 'डोजियर देखें' : 'View Dossier'}
          onClick={() => openDossier(r)}
        >
          <Award className="h-3.5 w-3.5 text-amber-400" />
        </VFButton>
      ),
    },
  ];

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* Master Grants Table */}
      <VFDataTable
        columns={columns}
        data={filteredScholarships}
        filterPlaceholder={t('scholarship.findStudent')}
        rightActions={
          <div className="flex items-center gap-2">
            <VFSelect
              size="sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(String(e.target.value))}
              options={[
                { value: 'all', label: `${t('action.all')} (${scholarships.length})` },
                { value: 'Govt RTE / NSP', label: `Govt RTE / NSP (${scholarships.filter((s) => s.category === 'Govt RTE / NSP').length})` },
                { value: 'Academic Merit', label: `Academic Merit (${scholarships.filter((s) => s.category === 'Academic Merit').length})` },
                { value: 'Sports Talent', label: `Sports Quota (${scholarships.filter((s) => s.category === 'Sports Talent').length})` },
                { value: 'Sibling / Staff', label: `Sibling / Staff (${scholarships.filter((s) => s.category === 'Sibling / Staff').length})` },
              ]}
              className="w-52 text-xs bg-[#181818] border-border rounded-[4px]"
            />
            <VFButton
              variant="outline"
              size="sm"
              className="rounded-[4px]"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={() => addNotification({ title: 'Exporting Grants', description: 'Scholarship grant directory exported as CSV.', type: 'success' })}
            >
              {t('action.export')}
            </VFButton>
            <VFButton
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-[4px]"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsAddDrawerOpen(true)}
            >
              {t('action.add') + ' ' + t('nav.scholarships')}
            </VFButton>
          </div>
        }
      />

      {/* ============================================================ */}
      {/* 1. AWARD / SANCTION SCHOLARSHIP APPLICATION DRAWER           */}
      {/* ============================================================ */}
      <VFDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        hideHeader={true}
        title="{t('page.scholarships')}"
        className="w-[960px] max-w-[96vw] sm:max-w-4xl lg:max-w-5xl rounded-none sm:rounded-l-md"
        bodyClassName="p-0 flex flex-col h-full bg-[#111111]"
        footerActions={
          <div className="flex items-center justify-between w-full gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">
                Institutional Policy: <strong>1 scholarship per student</strong>.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <VFButton variant="outline" size="sm" onClick={() => setIsAddDrawerOpen(false)} className="rounded-[4px]">
                Cancel
              </VFButton>
              <VFButton
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-[4px]"
                leftIcon={<Check className="h-4 w-4" />}
                disabled={!!studentActiveGrant}
                onClick={(e) => handleSaveAward(e)}
              >
                Sanction & Award Scholarship
              </VFButton>
            </div>
          </div>
        }
      >
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar p-5 space-y-5">
          {/* Header Banner */}
          <div className="p-4 rounded-[4px] bg-[#141414] border border-border/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-[4px] bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground tracking-tight">
                  {t('page.scholarships')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sanction government DBT grants, academic free-ships, or institutional parent relief.
                </p>
              </div>
            </div>
            <VFBadge variant="outline" className="text-xs font-mono font-bold bg-[#181818] border-border">
              AY 2026–2027
            </VFBadge>
          </div>

          {/* Step 1: Select Student & Live Eligibility Inspector */}
          <div className="p-4 rounded-[4px] bg-[#141414] border border-border/80 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <h4 className="font-extrabold text-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>Step 1: Select Student & Inspect Scheme Eligibility</span>
              </h4>
              <span className="text-[11px] text-muted-foreground font-mono">Live Eligibility Check</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground text-xs">Choose Student *</label>
                <VFSelect
                  value={selectedStudentAdm}
                  onChange={(e) => setSelectedStudentAdm(String(e.target.value))}
                  options={ALL_STUDENTS_DIRECTORY.map((s) => {
                    const existing = scholarships.find(
                      (sch) => sch.studentAdmNo.toLowerCase() === s.admNo.toLowerCase()
                    );
                    return {
                      label: `${s.name} (${s.admNo}) · ${s.class} ${existing ? `[Already Holds: ${existing.category}]` : '[Eligible]'}`,
                      value: s.admNo,
                    };
                  })}
                  className="bg-[#1a1a1a] border-border h-9 text-xs font-semibold rounded-[4px]"
                />
              </div>

              {/* Student Summary Mini Card */}
              <div className="p-3 rounded-[4px] bg-[#181818] border border-border/70 flex items-center gap-3">
                <img
                  src={currentStudentObj.photoUrl}
                  alt={currentStudentObj.name}
                  className="h-11 w-11 rounded-[4px] object-cover border border-border shrink-0"
                />
                <div className="min-w-0 flex-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground truncate">{currentStudentObj.name}</span>
                    <span className="font-mono text-zinc-400 text-[10px]">{currentStudentObj.admNo}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {currentStudentObj.class} · Academic Score: <strong>{currentStudentObj.academicScore}%</strong> · Income: <strong>₹{currentStudentObj.familyIncome.toLocaleString('en-IN')}/yr</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* SINGLE SCHOLARSHIP LIMIT RULE ALERT BANNER */}
            {studentActiveGrant ? (
              <div className="p-3.5 rounded-[4px] bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Single Scholarship Limit Rule: Student Already Holds Active Grant</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  <strong>{currentStudentObj.name} ({currentStudentObj.admNo})</strong> is currently sanctioned under{' '}
                  <strong className="text-foreground">{studentActiveGrant.schemeName}</strong> (Ref: {studentActiveGrant.sanctionRef}). Under institutional policy, a student cannot receive multiple concurrent scholarship waivers.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <VFButton
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs font-bold rounded-[4px] bg-[#1a1a1a] hover:bg-[#222222]"
                    onClick={() => {
                      openDossier(studentActiveGrant);
                      setIsAddDrawerOpen(false);
                    }}
                  >
                    View Active Grant Record ↗
                  </VFButton>
                </div>
              </div>
            ) : (
              /* LIVE ELIGIBLE SCHEMES LIST FOR SELECTED STUDENT */
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-zinc-300 block">
                  Applicable Schemes for {currentStudentObj.name}:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SCHEME_TEMPLATES.map((tpl) => {
                    const elig = tpl.checkEligibility(currentStudentObj);
                    const isSelected = selectedSchemeId === tpl.id;

                    return (
                      <div
                        key={tpl.id}
                        onClick={() => elig.isEligible && handleSelectSchemeTemplate(tpl)}
                        className={`p-3 rounded-[4px] border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary/10 border-primary shadow-xs ring-1 ring-primary/40'
                            : elig.isEligible
                            ? 'bg-[#181818] border-border/70 hover:border-zinc-500'
                            : 'bg-[#141414] border-border/40 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="font-bold text-foreground block text-xs">{tpl.name}</span>
                            <span className="text-[10px] text-muted-foreground block">{tpl.category}</span>
                          </div>
                          <span className="font-mono font-black text-emerald-400 text-xs shrink-0">
                            ₹{tpl.waiverAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2 pt-1 border-t border-border/50">
                          <span className="text-[10px] text-zinc-400 truncate">{elig.reason}</span>
                          {elig.isEligible ? (
                            <VFBadge variant={isSelected ? 'success' : 'primary'} className="text-[10px] font-bold rounded-[4px] shrink-0">
                              {isSelected ? 'Selected' : 'Eligible'}
                            </VFBadge>
                          ) : (
                            <VFBadge variant="danger" className="text-[10px] font-bold rounded-[4px] shrink-0">
                              Not Eligible
                            </VFBadge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Grant Terms & Concession Configuration */}
          <div className="p-4 rounded-[4px] bg-[#141414] border border-border/80 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <h4 className="font-extrabold text-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Step 2: Grant Terms & Financial Concession Details</span>
              </h4>
              <span className="font-mono text-emerald-400 font-bold">
                {customWaiverPct}% Concession (₹{Math.round((42000 * Number(customWaiverPct || 50)) / 100).toLocaleString('en-IN')})
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Scholarship Scheme Official Title *</label>
              <VFInput
                placeholder="e.g. Institutional Academic Board Merit Excellence (100% Free-ship)"
                value={customSchemeName}
                onChange={(e) => setCustomSchemeName(e.target.value)}
                disabled={!!studentActiveGrant}
                className="bg-[#1a1a1a] border-border h-9 text-xs font-semibold rounded-[4px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-foreground">Grant Category *</label>
                <VFSelect
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  disabled={!!studentActiveGrant}
                  options={[
                    { label: 'Academic Board Merit', value: 'Academic Merit' },
                    { label: 'Govt RTE / NSP Grant', value: 'Govt RTE / NSP' },
                    { label: 'Sports & Talent Quota', value: 'Sports Talent' },
                    { label: 'Sibling / Staff Concession', value: 'Sibling / Staff' },
                    { label: 'EWS & Social Welfare Aid', value: 'EWS Aid' },
                  ]}
                  className="bg-[#1a1a1a] border-border h-9 text-xs rounded-[4px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Fee Waiver Percentage (%) *</label>
                <VFSelect
                  value={customWaiverPct}
                  onChange={(e) => setCustomWaiverPct(String(e.target.value))}
                  disabled={!!studentActiveGrant}
                  options={[
                    { label: '25% Tuition Fee Waiver (₹10,500)', value: '25' },
                    { label: '50% Half Fee Waiver (₹21,000)', value: '50' },
                    { label: '75% Concession (₹31,500)', value: '75' },
                    { label: '100% Full Free-ship (₹42,000)', value: '100' },
                  ]}
                  className="bg-[#1a1a1a] border-border h-9 text-xs font-semibold rounded-[4px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Disbursal Channel *</label>
                <VFSelect
                  value={customDisbursalMode}
                  onChange={(e) => setCustomDisbursalMode(e.target.value as any)}
                  disabled={!!studentActiveGrant}
                  options={[
                    { label: 'School Trust Endowment', value: 'School Trust Endowment' },
                    { label: 'Direct Govt DBT Credit', value: 'Direct Govt DBT Credit' },
                    { label: 'Corporate CSR Grant', value: 'Corporate CSR Grant' },
                  ]}
                  className="bg-[#1a1a1a] border-border h-9 text-xs rounded-[4px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-foreground">Sanction Reference ID *</label>
                <VFInput
                  placeholder="e.g. NSP-2026-HR-998811"
                  value={customSanctionRef}
                  onChange={(e) => setCustomSanctionRef(e.target.value)}
                  disabled={!!studentActiveGrant}
                  className="bg-[#1a1a1a] border-border h-9 text-xs font-mono rounded-[4px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Funding Agency / Trust Endowment</label>
                <VFInput
                  placeholder="e.g. Ministry of Education / Foundation Trust"
                  value={customFundingAgency}
                  onChange={(e) => setCustomFundingAgency(e.target.value)}
                  disabled={!!studentActiveGrant}
                  className="bg-[#1a1a1a] border-border h-9 text-xs rounded-[4px]"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Required Verification Documents Checklist */}
          <div className="p-4 rounded-[4px] bg-[#141414] border border-border/80 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <h4 className="font-extrabold text-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-emerald-400" />
                <span>Step 3: Verification & Compliance Documentation Uploads</span>
              </h4>
              <span className="text-[10px] text-muted-foreground">Attached with Grant Dossier</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-[4px] bg-[#181818] border border-border/70 flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-foreground block text-xs">Parent Income Proof / Certificate</span>
                  <span className="text-[10px] text-muted-foreground">Revenue Dept / ITR Acknowledgment</span>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedDocs((p) => ({ ...p, doc_0: !p.doc_0 }))}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    uploadedDocs.doc_0
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-[#222222] text-zinc-400 border border-border'
                  }`}
                >
                  {uploadedDocs.doc_0 ? <CheckCircle2 className="h-3 w-3" /> : <UploadCloud className="h-3 w-3" />}
                  {uploadedDocs.doc_0 ? 'Verified' : 'Upload'}
                </button>
              </div>

              <div className="p-2.5 rounded-[4px] bg-[#181818] border border-border/70 flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-foreground block text-xs">Academic Merit / Category Certificate</span>
                  <span className="text-[10px] text-muted-foreground">Previous Marksheet / RTE / Sports Proof</span>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedDocs((p) => ({ ...p, doc_1: !p.doc_1 }))}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    uploadedDocs.doc_1
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-[#222222] text-zinc-400 border border-border'
                  }`}
                >
                  {uploadedDocs.doc_1 ? <CheckCircle2 className="h-3 w-3" /> : <UploadCloud className="h-3 w-3" />}
                  {uploadedDocs.doc_1 ? 'Verified' : 'Upload'}
                </button>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <label className="font-bold text-foreground">Comptroller & Financial Audit Remarks</label>
              <VFInput
                placeholder="e.g. Verified against state merit list and revenue department certificate."
                value={auditRemarks}
                onChange={(e) => setAuditRemarks(e.target.value)}
                disabled={!!studentActiveGrant}
                className="bg-[#1a1a1a] border-border h-9 text-xs rounded-[4px]"
              />
            </div>
          </div>

          {/* Financial Impact Overview Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/70">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Assessed Annual Fee</span>
              <span className="text-lg font-black text-foreground font-mono mt-0.5 block">₹ 42,000</span>
            </div>
            <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/70">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Sanctioned Relief</span>
              <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">
                - ₹{Math.round((42000 * Number(customWaiverPct || 50)) / 100).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/70">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Net Due by Guardian</span>
              <span className="text-lg font-black text-foreground font-mono mt-0.5 block">
                ₹{(42000 - Math.round((42000 * Number(customWaiverPct || 50)) / 100)).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </VFDrawer>

      {/* ============================================================ */}
      {/* 2. SCHOLARSHIP DETAILS DOSSIER DRAWER                        */}
      {/* ============================================================ */}
      <VFDrawer
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        hideHeader={true}
        title={activeRecord ? `${activeRecord.studentName} - Scholarship` : 'Scholarship Details'}
        className="w-[960px] max-w-[96vw] sm:max-w-4xl lg:max-w-5xl rounded-none sm:rounded-l-md"
        bodyClassName="p-0 flex flex-col h-full bg-[#111111]"
        footerActions={
          <div className="flex items-center justify-between w-full gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <VFButton
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-[4px]"
                leftIcon={<GraduationCap className="h-3.5 w-3.5" />}
                rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
                onClick={() => {
                  navigate({ to: '/students' });
                  window.location.href = `/students?student=${encodeURIComponent(activeRecord?.studentAdmNo || '')}&tab=scholarship`;
                }}
              >
                View Student Profile
              </VFButton>
              <VFButton
                variant="outline"
                size="sm"
                className="bg-[#1a1a1a] hover:bg-[#222222] border-border text-foreground font-bold rounded-[4px]"
                leftIcon={<CreditCard className="h-3.5 w-3.5" />}
                rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
                onClick={() => {
                  navigate({ to: '/fees' });
                  window.location.href = `/fees?student=${encodeURIComponent(activeRecord?.studentAdmNo || '')}`;
                }}
              >
                View in Fees
              </VFButton>
              <VFButton
                variant="outline"
                size="sm"
                className="bg-[#1a1a1a] hover:bg-[#222222] border-border text-foreground rounded-[4px]"
                leftIcon={<Printer className="h-3.5 w-3.5" />}
                onClick={() => addNotification({ title: 'Sanction Order Downloaded', description: `Sanction order PDF downloaded for ${activeRecord?.sanctionRef}.`, type: 'info' })}
              >
                Print Order
              </VFButton>
            </div>
            <VFButton variant="outline" size="sm" className="rounded-[4px]" onClick={() => setIsDetailsDrawerOpen(false)}>
              Close
            </VFButton>
          </div>
        }
      >
        {activeRecord && (
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar p-5 space-y-4">
            {/* Header Identity Banner */}
            <div className="p-4 rounded-[4px] bg-[#141414] border border-border/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
                <div
                  className="relative overflow-hidden rounded-[4px] border border-border/90 shadow-sm w-24 sm:w-28 bg-muted flex items-center justify-center shrink-0"
                  style={{ aspectRatio: '19.5 / 25' }}
                >
                  <img
                    src={activeRecord.photoUrl}
                    alt={activeRecord.studentName}
                    style={{ aspectRatio: '19.5 / 25' }}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-[2px] bg-emerald-500 border-2 border-[#141414] ring-2 ring-emerald-500/20" title="Active Grantee" />
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-extrabold text-foreground tracking-tight">{activeRecord.studentName}</h3>
                    <VFBadge variant="outline" className="font-mono text-zinc-300 font-bold text-[11px] bg-[#1a1a1a] border-border rounded-[4px]">
                      {activeRecord.studentAdmNo}
                    </VFBadge>
                    <VFBadge variant="primary" className="text-[10px] font-bold rounded-[4px]">
                      {activeRecord.category}
                    </VFBadge>
                    <VFBadge variant="success" className="rounded-[4px]">
                      {activeRecord.status}
                    </VFBadge>
                  </div>

                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 truncate">
                    <Award className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span className="text-foreground font-semibold truncate">{activeRecord.schemeName}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-400">{activeRecord.class}</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <User className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">Guardian: <strong className="text-foreground font-semibold">{activeRecord.guardianName}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span>Contact: <strong className="font-mono text-foreground">{activeRecord.phone}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Building className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">Funded By: <strong className="text-foreground font-semibold">{activeRecord.fundingAgency}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span>Sanction Ref: <strong className="font-mono text-foreground">{activeRecord.sanctionRef}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] bg-[#181818] border border-border/80 flex flex-col justify-center text-right shrink-0 min-w-[200px] shadow-xs">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Fee Discount</span>
                <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5 block">
                  ₹{activeRecord.waiverAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-muted-foreground font-semibold mt-0.5">{activeRecord.waiverPercentage}% Concession</span>
              </div>
            </div>

            {/* Scheme Details Card */}
            <div className="p-4 rounded-[4px] bg-[#141414] border border-border/80 space-y-3 text-xs">
              <h4 className="font-extrabold text-foreground uppercase tracking-wider text-xs pb-2 border-b border-border/60 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Scholarship Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-muted-foreground font-semibold block text-[11px]">Scheme Name</span>
                  <span className="font-bold text-foreground text-sm block">{activeRecord.schemeName}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-semibold block text-[11px]">Category</span>
                  <span className="font-bold text-foreground block">{activeRecord.category}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-semibold block text-[11px]">Sanction Number</span>
                  <span className="font-mono font-bold text-primary block">{activeRecord.sanctionRef}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-semibold block text-[11px]">Sanction Date</span>
                  <span className="font-medium text-foreground block">{activeRecord.sanctionDate}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-semibold block text-[11px]">Funding Agency</span>
                  <span className="font-semibold text-foreground block">{activeRecord.fundingAgency}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-semibold block text-[11px]">Disbursal Channel</span>
                  <span className="font-mono text-zinc-300 block">{activeRecord.disbursalMode}</span>
                </div>
              </div>

              {/* Compliance Documents */}
              {activeRecord.verifiedDocs && activeRecord.verifiedDocs.length > 0 && (
                <div className="p-3 rounded-[4px] bg-[#181818] border border-border/70 space-y-2 mt-2">
                  <span className="text-[11px] font-bold text-zinc-300 block">Verified Compliance Documents on Record:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeRecord.verifiedDocs.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded bg-[#1f1f1f] border border-border/50 text-[11px]">
                        <span className="font-medium text-foreground truncate">{doc.name}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold shrink-0 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-[4px] bg-[#1a1a1a] border border-border/60 space-y-1 mt-2">
                <span className="text-[11px] font-bold text-zinc-300 block">Registrar & Comptroller Audit Remarks:</span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">{activeRecord.notes}</p>
              </div>
            </div>
          </div>
        )}
      </VFDrawer>
    </VFPageContainer>
  );
}
