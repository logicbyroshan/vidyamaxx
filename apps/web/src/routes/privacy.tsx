import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFCard,
  VFButton,
  VFBadge,
  VFDialog,
  VFInput,
  VFSelect,
  VFTable,
  VFTableHead,
  VFTableHeaderCell,
  VFTableBody,
  VFTableRow,
  VFTableCell,
  cn,
} from '@vidyafloww/ui';
import {
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
  AlertTriangle,
  Download,
  Plus,
  CheckCircle2,
  Users,
  Activity,
  Database,
  Building,
  ArrowLeft,
  Info,
  Server,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';
import {
  DPDP_CONSENT_PURPOSES,
  RETENTION_POLICY_MATRIX,
  THIRD_PARTY_PROCESSORS,
  DPDP_OFFICER_CONFIG,
  DPDP_NOTICE_VERSION,
  DPDP_NOTICE_EFFECTIVE_DATE,
} from '@vidyafloww/constants';
import {
  ConsentPurposeId,
  DataPrincipalRightType,
  GrievanceCategory,
} from '@vidyafloww/types';
import {
  maskAadhaar,
  maskPhoneNumber,
  maskEmail,
  generateComplianceAuditHash,
} from '@vidyafloww/utils';

export const Route = createFileRoute('/privacy')({
  component: DPDPPrivacyCommandCenterPage,
});

type TabType =
  | 'overview'
  | 'parental-consent'
  | 'consent-studio'
  | 'data-rights'
  | 'grievance-registry'
  | 'privacy-notice'
  | 'retention-matrix'
  | 'breach-response';

function DPDPPrivacyCommandCenterPage() {
  const {
    consents,
    grantConsent,
    withdrawConsent,
    parentalConsents,
    addVerifiableParentalConsent,
    dataSubjectRequests,
    submitDataSubjectRequest,
    updateDSRStatus,
    privacyGrievances,
    submitPrivacyGrievance,
    resolvePrivacyGrievance,
    dataBreaches,
    reportDataBreach,
    privacyMetrics,
    addNotification,
    schoolProfile,
  } = useGlobalStore();

  const { lang } = useTranslation();
  const isHindi = lang === 'hi';

  React.useEffect(() => {
    document.title = (isHindi ? 'डीपी portrait प्राइवेसी कमांड सेंटर' : 'DPDP Privacy & Data Governance Center') + ' – VidyaFloww';
  }, [isHindi]);

  const [activeTab, setActiveTab] = React.useState<TabType>('overview');

  // Dialog States
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = React.useState(false);
  const [selectedWithdrawPurpose, setSelectedWithdrawPurpose] = React.useState<ConsentPurposeId | null>(null);
  const [withdrawReason, setWithdrawReason] = React.useState('');

  const [isAddVpcModalOpen, setIsAddVpcModalOpen] = React.useState(false);
  const [vpcStudentName, setVpcStudentName] = React.useState('');
  const [vpcStudentDob, setVpcStudentDob] = React.useState('2011-08-14');
  const [vpcGuardianName, setVpcGuardianName] = React.useState('');
  const [vpcGuardianRelation, setVpcGuardianRelation] = React.useState<'Father' | 'Mother' | 'Legal Guardian'>('Father');
  const [vpcGuardianPhone, setVpcGuardianPhone] = React.useState('');
  const [vpcGuardianEmail, setVpcGuardianEmail] = React.useState('');
  const [vpcMethod, setVpcMethod] = React.useState<'Aadhaar_OTP' | 'Digital_Sign' | 'Physical_Dossier' | 'Portal_Auth'>('Portal_Auth');

  const [isDsrModalOpen, setIsDsrModalOpen] = React.useState(false);
  const [dsrPrincipalName, setDsrPrincipalName] = React.useState('Dr. Rajesh Sharma');
  const [dsrPrincipalRole, setDsrPrincipalRole] = React.useState<'Student' | 'Parent' | 'Teacher' | 'Staff'>('Parent');
  const [dsrContact, setDsrContact] = React.useState('rajesh.sharma@example.com');
  const [dsrRightType, setDsrRightType] = React.useState<DataPrincipalRightType>('access_summary');
  const [dsrDescription, setDsrDescription] = React.useState('');

  const [isGrievanceModalOpen, setIsGrievanceModalOpen] = React.useState(false);
  const [grvName, setGrvName] = React.useState('');
  const [grvRole, setGrvRole] = React.useState<'Parent' | 'Student' | 'Faculty' | 'Public'>('Parent');
  const [grvEmail, setGrvEmail] = React.useState('');
  const [grvPhone, setGrvPhone] = React.useState('');
  const [grvCategory, setGrvCategory] = React.useState<GrievanceCategory>('Consent Withdrawal Refusal');
  const [grvSubject, setGrvSubject] = React.useState('');
  const [grvDescription, setGrvDescription] = React.useState('');

  const [isDpoContactModalOpen, setIsDpoContactModalOpen] = React.useState(false);

  // Handle Consent Actions
  const handleOpenWithdraw = (purposeId: ConsentPurposeId) => {
    setSelectedWithdrawPurpose(purposeId);
    setWithdrawReason('');
    setIsWithdrawModalOpen(true);
  };

  const handleConfirmWithdraw = () => {
    if (selectedWithdrawPurpose) {
      withdrawConsent(selectedWithdrawPurpose, withdrawReason || 'Data Principal opt-out via portal');
      addNotification({
        title: 'Consent Revoked',
        description: `Consent withdrawn for purpose [${selectedWithdrawPurpose}]. Downstream processors notified.`,
        type: 'warning',
      });
      setIsWithdrawModalOpen(false);
      setSelectedWithdrawPurpose(null);
    }
  };

  const handleGrantConsent = (purposeId: ConsentPurposeId) => {
    grantConsent(purposeId);
    addNotification({
      title: 'Consent Granted',
      description: `Purpose-specific consent granted under Notice v${DPDP_NOTICE_VERSION}.`,
      type: 'success',
    });
  };

  // Handle VPC Submission
  const handleSubmitVpc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vpcStudentName || !vpcGuardianName || !vpcGuardianPhone || !vpcGuardianEmail) {
      addNotification({
        title: 'Validation Error',
        description: 'Please fill in all mandatory guardian and student fields.',
        type: 'error',
      });
      return;
    }

    addVerifiableParentalConsent({
      studentId: `STU-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentName: vpcStudentName,
      studentDob: vpcStudentDob,
      isMinor: true,
      guardianName: vpcGuardianName,
      guardianRelationship: vpcGuardianRelation,
      guardianPhone: vpcGuardianPhone,
      guardianEmail: vpcGuardianEmail,
      verificationMethod: vpcMethod,
      verificationStatus: 'Verified',
      prohibitTrackingAffirmed: true,
      prohibitTargetedAdsAffirmed: true,
    });

    addNotification({
      title: 'Verifiable Parental Consent Logged',
      description: `Consent verified and bound to minor student [${vpcStudentName}].`,
      type: 'success',
    });

    setIsAddVpcModalOpen(false);
    setVpcStudentName('');
    setVpcGuardianName('');
    setVpcGuardianPhone('');
    setVpcGuardianEmail('');
  };

  // Handle DSR Submission
  const handleSubmitDsr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dsrPrincipalName || !dsrContact || !dsrDescription) {
      addNotification({
        title: 'Validation Error',
        description: 'Please provide requester contact and request description.',
        type: 'error',
      });
      return;
    }

    submitDataSubjectRequest({
      principalId: `PRIN-${Math.floor(1000 + Math.random() * 9000)}`,
      principalName: dsrPrincipalName,
      principalRole: dsrPrincipalRole,
      requesterContact: dsrContact,
      rightType: dsrRightType,
      description: dsrDescription,
    });

    addNotification({
      title: 'Data Subject Request Registered',
      description: `DSR submitted. Assigned to DPO under 30-day statutory SLA.`,
      type: 'success',
    });

    setIsDsrModalOpen(false);
    setDsrDescription('');
  };

  // Handle Grievance Submission
  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grvName || !grvEmail || !grvPhone || !grvSubject || !grvDescription) {
      addNotification({
        title: 'Validation Error',
        description: 'Please complete all required grievance fields.',
        type: 'error',
      });
      return;
    }

    submitPrivacyGrievance({
      complainantName: grvName,
      complainantRole: grvRole,
      complainantEmail: grvEmail,
      complainantPhone: grvPhone,
      category: grvCategory,
      subject: grvSubject,
      description: grvDescription,
      priority: 'Medium',
    });

    addNotification({
      title: 'Privacy Grievance Registered',
      description: `Ticket created. DPO notified. Statutory SLA <= 90 days active.`,
      type: 'success',
    });

    setIsGrievanceModalOpen(false);
    setGrvName('');
    setGrvEmail('');
    setGrvPhone('');
    setGrvSubject('');
    setGrvDescription('');
  };

  // Export electronic summary dossier for student / parent
  const handleDownloadDossier = (studentName: string) => {
    const mockDossier = {
      complianceStandard: 'Digital Personal Data Protection Act, 2023 (DPDP Act) & DPDP Rules, 2025',
      exportTimestamp: new Date().toISOString(),
      institution: schoolProfile.name,
      sovereignHosting: 'AWS Sovereign India Region (Mumbai ap-south-1)',
      dataPrincipal: studentName,
      status: 'Enrolled Active Minor Student',
      aadhaarMasked: maskAadhaar('987654321098'),
      parentGuardian: 'Dr. Rajesh Sharma (Verified Father)',
      contactPhoneMasked: maskPhoneNumber('+91 98101 23456'),
      contactEmailMasked: maskEmail('rajesh.sharma@example.com'),
      purposesGranted: Object.entries(consents)
        .filter(([_, v]) => v.status === 'granted')
        .map(([k]) => k),
      thirdPartiesWithAccess: THIRD_PARTY_PROCESSORS.map((p) => p.serviceName),
      statutoryRetentionBasis: 'CBSE Bye-Laws / RTE Act / DPDP Rules 2025',
      cryptographicAuditSeal: generateComplianceAuditHash({ student: studentName }),
    };

    const blob = new Blob([JSON.stringify(mockDossier, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DPDP-Dossier-Summary-${studentName.replace(/\s+/g, '-')}-2026.json`;
    a.click();
    URL.revokeObjectURL(url);

    addNotification({
      title: 'Personal Data Dossier Exported',
      description: `Structured summary downloaded with SHA-256 compliance seal and masked Aadhaar.`,
      type: 'success',
    });
  };

  return (
    <VFPageContainer className="space-y-4 w-full">
      {/* 1. Header Toolbar Box */}
      <div className="p-3 rounded-[4px] bg-[#0d0d0d] border border-border/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <Link to="/settings">
            <VFButton size="sm" variant="outline" className="h-8 px-2 border-border/80 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              {isHindi ? 'सेटिंग्स' : 'Settings'}
            </VFButton>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h1 className="text-base font-semibold text-foreground tracking-tight">
                {isHindi ? 'डिजिटल पर्सनल डेटा प्रोटेक्शन (DPDP) कमांड सेंटर' : 'DPDP Act, 2023 & DPDP Rules, 2025 Sovereign Privacy Center'}
              </h1>
              <VFBadge variant="outline" className="bg-emerald-950/40 text-emerald-400 border-emerald-800/60 text-[11px] font-mono">
                Active • Data Fiduciary
              </VFBadge>
            </div>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              {isHindi
                ? 'भारतीय संप्रभु डेटा सुरक्षा अनुपालन • धारा 9 नाबालिग सहमति • धारा 11-14 डेटा अधिकार • धारा 13 शिकायत निवारण'
                : 'Sovereign Indian Data Protection • Section 9 Minor Safeguards • Sections 11–14 Data Rights • Section 13 Grievance Redressal'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <VFButton
            size="sm"
            variant="outline"
            onClick={() => setIsDpoContactModalOpen(true)}
            className="h-8 border-border/80 text-xs gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            {isHindi ? 'डीपीओ संपर्क' : 'DPO Contact'}
          </VFButton>
          <VFButton
            size="sm"
            onClick={() => handleDownloadDossier('Institution-Overview')}
            className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            {isHindi ? 'प्रमाणपत्र डाउनलोड' : 'Sovereign Audit Seal'}
          </VFButton>
        </div>
      </div>

      {/* 2. Top High-Density Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="p-3 rounded-[4px] bg-[#111111] border border-border/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-[11px]">
            <span>Principals Protected</span>
            <Users className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-foreground mt-1 font-mono">
            {privacyMetrics.totalPrincipalsProtected.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Students, Parents & Faculty</span>
        </div>

        <div className="p-3 rounded-[4px] bg-[#111111] border border-border/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-[11px]">
            <span>Minor VPC Rate</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
            {privacyMetrics.minorVpcComplianceRate}%
          </div>
          <span className="text-[10px] text-muted-foreground">Sec. 9 Parental Consent</span>
        </div>

        <div className="p-3 rounded-[4px] bg-[#111111] border border-border/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-[11px]">
            <span>Data Residency</span>
            <Database className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-sm font-bold text-indigo-400 mt-1">
            AWS Mumbai (ap-south-1)
          </div>
          <span className="text-[10px] text-muted-foreground">100% India Sovereign</span>
        </div>

        <div className="p-3 rounded-[4px] bg-[#111111] border border-border/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-[11px]">
            <span>Open DSR Requests</span>
            <FileText className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 mt-1 font-mono">
            {dataSubjectRequests.filter((d) => d.status !== 'Completed').length}
          </div>
          <span className="text-[10px] text-muted-foreground">&lt; 48hr SLA Turnaround</span>
        </div>

        <div className="p-3 rounded-[4px] bg-[#111111] border border-border/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-[11px]">
            <span>Privacy Grievances</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400 mt-1 font-mono">
            {privacyGrievances.filter((g) => g.status !== 'Resolved').length}
          </div>
          <span className="text-[10px] text-muted-foreground">SLA Target: &lt; 7 Days (Max 90d)</span>
        </div>

        <div className="p-3 rounded-[4px] bg-[#111111] border border-border/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-[11px]">
            <span>Encryption Standard</span>
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 mt-1">
            AES-256 + TLS 1.3
          </div>
          <span className="text-[10px] text-muted-foreground">Zero Plaintext Storage</span>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-border/80 pb-0 overflow-x-auto text-xs font-medium">
        {[
          { key: 'overview', label: isHindi ? 'अनुपालन अवलोकन' : 'DPDP Overview' },
          { key: 'parental-consent', label: isHindi ? 'नाबालिग अभिभावक सहमति (Sec 9)' : 'Verifiable Parental Consent (Sec 9)' },
          { key: 'consent-studio', label: isHindi ? 'सहमति प्रबंधन (Sec 6)' : 'Consent Studio (Sec 6)' },
          { key: 'data-rights', label: isHindi ? 'डेटा अधिकार केंद्र (Sec 11-14)' : 'Data Principal Rights Hub' },
          { key: 'grievance-registry', label: isHindi ? 'शिकायत निवारण (Sec 13)' : 'Grievance Redressal (Sec 13)' },
          { key: 'privacy-notice', label: isHindi ? 'पारदर्शिता नोटिस (Sec 5)' : 'Privacy Notice (Sec 5)' },
          { key: 'retention-matrix', label: isHindi ? 'डेटा प्रतिधारण अनुसूची' : 'Retention Schedule' },
          { key: 'breach-response', label: isHindi ? 'उल्लंघन प्रतिक्रिया कंसोल' : 'Breach Response' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabType)}
            className={cn(
              'px-3.5 py-2.5 rounded-t-md border-b-2 transition-colors whitespace-nowrap',
              activeTab === tab.key
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20 font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-neutral-900/40'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Tab 1: OVERVIEW & ARCHITECTURE */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Role Classification */}
            <VFCard className="p-4 bg-[#111111] border-border/80 space-y-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-foreground">Institutional DPDP Role Assessment</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Under the Digital Personal Data Protection Act, 2023, VidyaFloww operates under a dual governance framework:
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                  <div className="font-semibold text-foreground flex items-center justify-between">
                    <span>1. Data Fiduciary (School Trust)</span>
                    <VFBadge variant="outline" className="text-[10px] text-blue-400 border-blue-900">Primary Role</VFBadge>
                  </div>
                  <p className="text-muted-foreground text-[11px] mt-1">
                    Determines purpose and means for student admissions, K-12 grading, fee receipts, and faculty payroll.
                  </p>
                </div>
                <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                  <div className="font-semibold text-foreground flex items-center justify-between">
                    <span>2. Data Processor (SaaS Engine)</span>
                    <VFBadge variant="outline" className="text-[10px] text-indigo-400 border-indigo-900">Platform Layer</VFBadge>
                  </div>
                  <p className="text-muted-foreground text-[11px] mt-1">
                    Processes telemetry, automated SMS alerts, and encrypted cloud backups solely under signed Institutional Data Processing Agreements (DPA).
                  </p>
                </div>
              </div>
            </VFCard>

            {/* Middle: Sovereign Infrastructure & Security */}
            <VFCard className="p-4 bg-[#111111] border-border/80 space-y-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-foreground">Sovereign Data Storage & Security</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-muted-foreground">Primary Hosting Region:</span>
                  <span className="font-mono text-foreground font-medium">AWS Mumbai (ap-south-1)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-muted-foreground">Cross-Border Data Outflow:</span>
                  <span className="text-emerald-400 font-medium">0% (Zero Offshore Storage)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-muted-foreground">Aadhaar Redaction Filter:</span>
                  <span className="text-emerald-400 font-medium">Enforced at View & Export</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800">
                  <span className="text-muted-foreground">Sensitive Health & Psycho Records:</span>
                  <span className="text-indigo-400 font-medium">Object-Level RBAC Gated</span>
                </div>
              </div>
            </VFCard>

            {/* Right: Significant Data Fiduciary (SDF) Readiness */}
            <VFCard className="p-4 bg-[#111111] border-border/80 space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-foreground">SDF Readiness & Governance</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Large multi-campus networks processing high volumes of children&apos;s biometric and GPS telemetry are structured for Significant Data Fiduciary (SDF) compliance:
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Resident Indian Data Protection Officer (DPO)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Periodic Data Protection Impact Assessments (DPIA)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Automated Cryptographic Audit Trail Logs</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Mandatory Board Breach Reporting Protocol</span>
                </div>
              </div>
            </VFCard>
          </div>

          {/* Third Party Processors Directory */}
          <VFCard className="p-4 bg-[#111111] border-border/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Authorized Third-Party Data Processors</h3>
                <p className="text-xs text-muted-foreground">
                  Section 8(2): Institutions engage only vetted Data Processors under contractual Data Processing Agreements (DPA).
                </p>
              </div>
              <VFBadge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-900">
                4 Authorized Vendors
              </VFBadge>
            </div>

            <div className="overflow-x-auto">
              <VFTable>
                <VFTableHead>
                  <VFTableRow>
                    <VFTableHeaderCell className="text-xs">Processor / Vendor</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Service Role</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Data Shared</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Hosting Location</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Encryption</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">DPA Status</VFTableHeaderCell>
                  </VFTableRow>
                </VFTableHead>
                <VFTableBody>
                  {THIRD_PARTY_PROCESSORS.map((proc) => (
                    <VFTableRow key={proc.id}>
                      <VFTableCell className="text-xs font-medium text-foreground">
                        <div>{proc.serviceName}</div>
                        <div className="text-[11px] text-muted-foreground">{proc.vendorName}</div>
                      </VFTableCell>
                      <VFTableCell className="text-xs text-muted-foreground">{proc.role}</VFTableCell>
                      <VFTableCell className="text-xs text-muted-foreground">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {proc.personalDataTransferred.map((f, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px]">
                              {f}
                            </span>
                          ))}
                        </div>
                      </VFTableCell>
                      <VFTableCell className="text-xs text-foreground font-mono">{proc.dataHostingLocation}</VFTableCell>
                      <VFTableCell className="text-xs text-muted-foreground">{proc.encryptionStandard}</VFTableCell>
                      <VFTableCell className="text-xs">
                        <VFBadge variant="outline" className="bg-emerald-950/40 text-emerald-400 border-emerald-800/60 text-[10px]">
                          Signed & Enforced
                        </VFBadge>
                      </VFTableCell>
                    </VFTableRow>
                  ))}
                </VFTableBody>
              </VFTable>
            </div>
          </VFCard>
        </div>
      )}

      {/* 5. Tab 2: SECTION 9 VERIFIABLE PARENTAL CONSENT */}
      {activeTab === 'parental-consent' && (
        <div className="space-y-4">
          <VFCard className="p-4 bg-[#111111] border-border/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Section 9: Processing of Personal Data of Children (Minors under 18 Years)
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Before processing any personal data of a minor student, verifiable consent of the parent or lawful guardian is mandatory.
                </p>
              </div>

              <VFButton
                size="sm"
                onClick={() => setIsAddVpcModalOpen(true)}
                className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                {isHindi ? 'नई अभिभावक सहमति जोड़ें' : 'Log Verifiable Parental Consent'}
              </VFButton>
            </div>

            {/* Statutory Guarantees Alert */}
            <div className="p-3 rounded bg-emerald-950/20 border border-emerald-900/60 text-xs text-emerald-300 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Statutory Prohibitions Guaranteed under Section 9(2) & 9(3):
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-emerald-300/90 pl-1 text-[11px]">
                <li>Zero behavioral tracking or biometric profiling of children for commercial purposes.</li>
                <li>Zero targeted advertising directed at students or minor accounts.</li>
                <li>Zero processing of personal data that could cause detrimental effect on student physical or psychological well-being.</li>
              </ul>
            </div>

            {/* VPC Records Table */}
            <div className="overflow-x-auto pt-2">
              <VFTable>
                <VFTableHead>
                  <VFTableRow>
                    <VFTableHeaderCell className="text-xs">Student (Minor)</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">DOB & Age</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Parent / Legal Guardian</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Verification Method</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Consent Timestamp</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Tokenized Proof</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Status</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Actions</VFTableHeaderCell>
                  </VFTableRow>
                </VFTableHead>
                <VFTableBody>
                  {parentalConsents.map((vpc) => (
                    <VFTableRow key={vpc.id}>
                      <VFTableCell className="text-xs font-semibold text-foreground">
                        {vpc.studentName}
                        <div className="text-[10px] font-mono text-muted-foreground">{vpc.studentId}</div>
                      </VFTableCell>
                      <VFTableCell className="text-xs text-muted-foreground font-mono">
                        {vpc.studentDob} (Minor)
                      </VFTableCell>
                      <VFTableCell className="text-xs text-foreground">
                        <div>{vpc.guardianName} ({vpc.guardianRelationship})</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{maskPhoneNumber(vpc.guardianPhone)}</div>
                      </VFTableCell>
                      <VFTableCell className="text-xs">
                        <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-blue-400">
                          {vpc.verificationMethod}
                        </span>
                      </VFTableCell>
                      <VFTableCell className="text-xs text-muted-foreground font-mono">{vpc.consentGrantedAt}</VFTableCell>
                      <VFTableCell className="text-xs font-mono text-muted-foreground text-[10px]">
                        {vpc.tokenizedProofId}
                      </VFTableCell>
                      <VFTableCell className="text-xs">
                        <VFBadge
                          variant="outline"
                          className={cn(
                            'text-[10px]',
                            vpc.verificationStatus === 'Verified'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                              : 'bg-amber-950/40 text-amber-400 border-amber-800/60'
                          )}
                        >
                          {vpc.verificationStatus}
                        </VFBadge>
                      </VFTableCell>
                      <VFTableCell className="text-xs">
                        <VFButton
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadDossier(vpc.studentName)}
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                        >
                          <Download className="w-3 h-3" />
                          Dossier
                        </VFButton>
                      </VFTableCell>
                    </VFTableRow>
                  ))}
                </VFTableBody>
              </VFTable>
            </div>
          </VFCard>
        </div>
      )}

      {/* 6. Tab 3: SECTION 6 PURPOSE-SPECIFIC CONSENT STUDIO */}
      {activeTab === 'consent-studio' && (
        <div className="space-y-4">
          <VFCard className="p-4 bg-[#111111] border-border/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Section 6: Granular Purpose Limitation & Real-Time Revocation Studio
                </h3>
                <p className="text-xs text-muted-foreground">
                  Consent must be voluntary, specific, informed, and unambiguous. Data Principals can withdraw consent at any time.
                </p>
              </div>
              <VFBadge variant="outline" className="text-xs font-mono text-blue-400 border-blue-900">
                Notice Version: {DPDP_NOTICE_VERSION}
              </VFBadge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {DPDP_CONSENT_PURPOSES.map((purpose) => {
                const state = consents[purpose.id];
                const isGranted = state?.status === 'granted';

                return (
                  <div
                    key={purpose.id}
                    className={cn(
                      'p-3.5 rounded-[4px] border transition-all flex flex-col justify-between space-y-2.5',
                      isGranted
                        ? 'bg-neutral-900/60 border-emerald-900/40'
                        : 'bg-neutral-950/80 border-neutral-800 opacity-80'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-foreground">
                            {isHindi ? purpose.nameHi : purpose.name}
                          </h4>
                          {purpose.isEssential && (
                            <VFBadge variant="outline" className="text-[10px] text-amber-400 border-amber-900/80">
                              Essential / Statutory
                            </VFBadge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                          {isHindi ? purpose.descriptionHi : purpose.description}
                        </p>
                      </div>

                      <VFBadge
                        variant="outline"
                        className={cn(
                          'text-[10px] shrink-0 font-mono',
                          isGranted
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                            : 'bg-rose-950/40 text-rose-400 border-rose-800/60'
                        )}
                      >
                        {isGranted ? 'Active / Granted' : 'Withdrawn / Opted Out'}
                      </VFBadge>
                    </div>

                    {/* Data Categories Covered */}
                    <div className="space-y-1">
                      <div className="text-[10px] text-muted-foreground font-medium">Data Categories Covered:</div>
                      <div className="flex flex-wrap gap-1">
                        {purpose.dataCategories.map((cat, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[10px] text-neutral-300">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Downstream sync info & actions */}
                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px]">
                      <div className="text-muted-foreground">
                        {isGranted ? (
                          <span className="text-emerald-400/80">Granted: {state.grantedAt}</span>
                        ) : (
                          <span className="text-rose-400/80">Withdrawn: {state?.withdrawnAt || 'Recent'}</span>
                        )}
                      </div>

                      <div>
                        {isGranted ? (
                          <VFButton
                            size="sm"
                            variant="danger"
                            onClick={() => handleOpenWithdraw(purpose.id)}
                            className="h-7 text-xs px-2.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/50"
                          >
                            Withdraw Consent
                          </VFButton>
                        ) : (
                          <VFButton
                            size="sm"
                            onClick={() => handleGrantConsent(purpose.id)}
                            className="h-7 text-xs px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white"
                          >
                            Grant Consent
                          </VFButton>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </VFCard>
        </div>
      )}

      {/* 7. Tab 4: SECTIONS 11-14 DATA PRINCIPAL RIGHTS HUB */}
      {activeTab === 'data-rights' && (
        <div className="space-y-4">
          <VFCard className="p-4 bg-[#111111] border-border/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Data Principal Rights Hub (DPDP Act Sections 11, 12, 14)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Right to Access Summary, Right to Correction/Updating, Right to Erasure, and Right to Nominate.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <VFButton
                  size="sm"
                  onClick={() => setIsDsrModalOpen(true)}
                  className="h-8 bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isHindi ? 'नया डेटा अधिकार अनुरोध' : 'File Data Subject Request (DSR)'}
                </VFButton>
              </div>
            </div>

            {/* DSR Table */}
            <div className="overflow-x-auto pt-1">
              <VFTable>
                <VFTableHead>
                  <VFTableRow>
                    <VFTableHeaderCell className="text-xs">Request Number</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Data Principal</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Right Exercised</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Description</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">SLA Due Date</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Status</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Assigned DPO</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Actions</VFTableHeaderCell>
                  </VFTableRow>
                </VFTableHead>
                <VFTableBody>
                  {dataSubjectRequests.map((dsr) => (
                    <VFTableRow key={dsr.id}>
                      <VFTableCell className="text-xs font-mono text-blue-400 font-semibold">
                        {dsr.requestNumber}
                      </VFTableCell>
                      <VFTableCell className="text-xs text-foreground">
                        <div>{dsr.principalName}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{dsr.requesterContact}</div>
                      </VFTableCell>
                      <VFTableCell className="text-xs">
                        <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-purple-400">
                          {dsr.rightType.replace('_', ' ').toUpperCase()}
                        </span>
                      </VFTableCell>
                      <VFTableCell className="text-xs text-muted-foreground max-w-xs truncate">
                        {dsr.description}
                      </VFTableCell>
                      <VFTableCell className="text-xs font-mono text-muted-foreground">
                        {dsr.slaDeadline}
                      </VFTableCell>
                      <VFTableCell className="text-xs">
                        <VFBadge
                          variant="outline"
                          className={cn(
                            'text-[10px]',
                            dsr.status === 'Completed'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                              : 'bg-amber-950/40 text-amber-400 border-amber-800/60'
                          )}
                        >
                          {dsr.status}
                        </VFBadge>
                      </VFTableCell>
                      <VFTableCell className="text-xs text-muted-foreground">{dsr.assignedOfficer}</VFTableCell>
                      <VFTableCell className="text-xs">
                        {dsr.status !== 'Completed' ? (
                          <VFButton
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              updateDSRStatus(dsr.id, 'Completed', 'Processed and sealed under DPO review.');
                              addNotification({
                                title: 'DSR Marked Completed',
                                description: `Request ${dsr.requestNumber} resolved.`,
                                type: 'success',
                              });
                            }}
                            className="h-7 text-xs px-2 border-emerald-800 text-emerald-400 hover:bg-emerald-950/40"
                          >
                            Mark Resolved
                          </VFButton>
                        ) : (
                          <VFButton
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadDossier(dsr.principalName)}
                            className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Summary
                          </VFButton>
                        )}
                      </VFTableCell>
                    </VFTableRow>
                  ))}
                </VFTableBody>
              </VFTable>
            </div>
          </VFCard>
        </div>
      )}

      {/* 8. Tab 5: SECTION 13 PRIVACY GRIEVANCE REDRESSAL REGISTRY */}
      {activeTab === 'grievance-registry' && (
        <div className="space-y-4">
          <VFCard className="p-4 bg-[#111111] border-border/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Section 13 & DPDP Rules, 2025: Privacy Grievance Redressal Registry
                </h3>
                <p className="text-xs text-muted-foreground">
                  Statutory resolution period not exceeding 90 days. Institutional target SLA &le; 7 days.
                </p>
              </div>

              <VFButton
                size="sm"
                onClick={() => setIsGrievanceModalOpen(true)}
                className="h-8 bg-rose-600 hover:bg-rose-500 text-white text-xs gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {isHindi ? 'नई प्राइवेसी शिकायत दर्ज करें' : 'Lodge Privacy Grievance'}
              </VFButton>
            </div>

            {/* Board Escalation Note */}
            <div className="p-3 rounded bg-blue-950/20 border border-blue-900/60 text-xs text-blue-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-blue-200">Statutory Escalation to Data Protection Board of India (DPBI):</span> If not satisfied with the institutional resolution or if no response is received within statutory timelines, Data Principals may escalate directly to the Board at <a href={DPDP_OFFICER_CONFIG.dpbiPortalUrl} target="_blank" rel="noreferrer" className="underline text-blue-400 font-mono">dpb.gov.in</a>.
              </div>
            </div>

            {/* Grievance Table */}
            <div className="overflow-x-auto pt-1">
              <VFTable>
                <VFTableHead>
                  <VFTableRow>
                    <VFTableHeaderCell className="text-xs">Ticket #</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Complainant</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Category</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Subject</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Lodged Date</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Statutory SLA (Max 90d)</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Status</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Action</VFTableHeaderCell>
                  </VFTableRow>
                </VFTableHead>
                <VFTableBody>
                  {privacyGrievances.map((grv) => (
                    <VFTableRow key={grv.id}>
                      <VFTableCell className="text-xs font-mono text-rose-400 font-semibold">
                        {grv.ticketNumber}
                      </VFTableCell>
                      <VFTableCell className="text-xs text-foreground">
                        <div>{grv.complainantName} ({grv.complainantRole})</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{maskPhoneNumber(grv.complainantPhone)}</div>
                      </VFTableCell>
                      <VFTableCell className="text-xs text-muted-foreground">{grv.category}</VFTableCell>
                      <VFTableCell className="text-xs text-foreground max-w-xs truncate">{grv.subject}</VFTableCell>
                      <VFTableCell className="text-xs font-mono text-muted-foreground">{grv.lodgedDate}</VFTableCell>
                      <VFTableCell className="text-xs font-mono text-amber-400/90">{grv.statutorySlaDeadline}</VFTableCell>
                      <VFTableCell className="text-xs">
                        <VFBadge
                          variant="outline"
                          className={cn(
                            'text-[10px]',
                            grv.status === 'Resolved'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                              : 'bg-rose-950/40 text-rose-400 border-rose-800/60'
                          )}
                        >
                          {grv.status}
                        </VFBadge>
                      </VFTableCell>
                      <VFTableCell className="text-xs">
                        {grv.status !== 'Resolved' ? (
                          <VFButton
                            size="sm"
                            onClick={() => {
                              resolvePrivacyGrievance(grv.id, 'Investigation completed by DPO; corrective measures deployed.');
                              addNotification({
                                title: 'Grievance Resolved',
                                description: `Ticket ${grv.ticketNumber} marked resolved.`,
                                type: 'success',
                              });
                            }}
                            className="h-7 text-xs px-2 bg-emerald-600 hover:bg-emerald-500 text-white"
                          >
                            Resolve Ticket
                          </VFButton>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-mono">Resolved</span>
                        )}
                      </VFTableCell>
                    </VFTableRow>
                  ))}
                </VFTableBody>
              </VFTable>
            </div>
          </VFCard>
        </div>
      )}

      {/* 9. Tab 6: SECTION 5 PRIVACY NOTICE */}
      {activeTab === 'privacy-notice' && (
        <div className="space-y-4">
          <VFCard className="p-5 bg-[#111111] border-border/80 space-y-4 max-w-4xl mx-auto">
            <div className="border-b border-neutral-800 pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">
                  {isHindi ? 'डिजिटल पर्सनल डेटा संरक्षण सूचना' : 'Digital Personal Data Protection Transparency Notice'}
                </h2>
                <VFBadge variant="outline" className="text-xs font-mono text-blue-400 border-blue-900">
                  Version: {DPDP_NOTICE_VERSION} • Effective: {DPDP_NOTICE_EFFECTIVE_DATE}
                </VFBadge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Issued in compliance with Section 5 of the DPDP Act, 2023 and DPDP Rules, 2025.
              </p>
            </div>

            <div className="space-y-3.5 text-xs text-neutral-300 leading-relaxed">
              <section className="space-y-1">
                <h4 className="font-semibold text-foreground text-sm">1. Identity of the Data Fiduciary</h4>
                <p>
                  <strong>{schoolProfile.name}</strong> (referred to as the &quot;Institution&quot; or &quot;Data Fiduciary&quot;) determines the purposes and means of processing personal data of students, parents, guardians, faculty, and administrative personnel across its campuses.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-semibold text-foreground text-sm">2. Itemised Personal Data Collected &amp; Specific Purposes</h4>
                <p>
                  We collect and process personal data exclusively for specified, lawful educational purposes:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {DPDP_CONSENT_PURPOSES.map((p) => (
                    <div key={p.id} className="p-2.5 rounded bg-neutral-900 border border-neutral-800 space-y-1">
                      <div className="font-semibold text-emerald-400">{isHindi ? p.nameHi : p.name}</div>
                      <div className="text-[11px] text-muted-foreground">{p.description}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">Retention: {p.retentionPeriod}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-1">
                <h4 className="font-semibold text-foreground text-sm">3. Special Safeguards for Children (Minors under 18 Years)</h4>
                <p>
                  Under Section 9 of the DPDP Act, 2023, personal data of students is processed only after obtaining Verifiable Parental Consent. We strictly prohibit behavioral tracking, targeted advertising, or any automated profiling detrimental to children.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-semibold text-foreground text-sm">4. Data Principal Rights</h4>
                <p>
                  Data Principals (or parents acting on behalf of minor students) have the statutory right to:
                </p>
                <ul className="list-disc list-inside space-y-0.5 pl-1 text-muted-foreground">
                  <li><strong>Access Summary:</strong> Obtain an electronic summary of personal data held and third-party processors.</li>
                  <li><strong>Correction &amp; Updating:</strong> Correct inaccurate or obsolete records.</li>
                  <li><strong>Erasure:</strong> Request deletion of non-statutory records (CBSE archives preserved under legal obligation).</li>
                  <li><strong>Grievance Redressal:</strong> Submit grievances to the designated DPO resolved within 90 days.</li>
                  <li><strong>Nomination:</strong> Nominate an individual to exercise rights in case of death or incapacity.</li>
                </ul>
              </section>

              <section className="space-y-1 pt-2 border-t border-neutral-800">
                <h4 className="font-semibold text-foreground text-sm">5. Contact Information of Data Protection Officer</h4>
                <div className="p-3 rounded bg-neutral-900 border border-neutral-800 text-xs space-y-1 font-mono">
                  <div><strong>Officer:</strong> {DPDP_OFFICER_CONFIG.name}</div>
                  <div><strong>Title:</strong> {DPDP_OFFICER_CONFIG.title}</div>
                  <div><strong>Email:</strong> {DPDP_OFFICER_CONFIG.email} | <strong>Phone:</strong> {DPDP_OFFICER_CONFIG.phone}</div>
                  <div><strong>Address:</strong> {DPDP_OFFICER_CONFIG.address}</div>
                </div>
              </section>
            </div>
          </VFCard>
        </div>
      )}

      {/* 10. Tab 7: RETENTION SCHEDULE MATRIX */}
      {activeTab === 'retention-matrix' && (
        <div className="space-y-4">
          <VFCard className="p-4 bg-[#111111] border-border/80 space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Institutional Data Retention &amp; Deletion Schedule Matrix
              </h3>
              <p className="text-xs text-muted-foreground">
                Section 8(7): Personal data must be erased once the specified purpose is fulfilled or consent is withdrawn, unless statutory retention is mandated by law.
              </p>
            </div>

            <div className="overflow-x-auto">
              <VFTable>
                <VFTableHead>
                  <VFTableRow>
                    <VFTableHeaderCell className="text-xs">Category</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Applicable Data Fields</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Statutory Legal Basis</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Retention Duration</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Deletion Method</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Statutory Preservation</VFTableHeaderCell>
                  </VFTableRow>
                </VFTableHead>
                <VFTableBody>
                  {RETENTION_POLICY_MATRIX.map((ret) => (
                    <VFTableRow key={ret.id}>
                      <VFTableCell className="text-xs font-semibold text-foreground">
                        {ret.dataCategory}
                      </VFTableCell>
                      <VFTableCell className="text-xs text-muted-foreground">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {ret.applicableDataFields.map((f, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px]">
                              {f}
                            </span>
                          ))}
                        </div>
                      </VFTableCell>
                      <VFTableCell className="text-xs text-muted-foreground">{ret.statutoryBasis}</VFTableCell>
                      <VFTableCell className="text-xs text-foreground font-mono font-medium">{ret.retentionPeriod}</VFTableCell>
                      <VFTableCell className="text-xs">
                        <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-indigo-400">
                          {ret.deletionMethod}
                        </span>
                      </VFTableCell>
                      <VFTableCell className="text-xs">
                        {ret.cbseStatutoryPreservation ? (
                          <VFBadge variant="outline" className="bg-amber-950/40 text-amber-400 border-amber-800/60 text-[10px]">
                            CBSE / Tax Preserved
                          </VFBadge>
                        ) : (
                          <VFBadge variant="outline" className="bg-emerald-950/40 text-emerald-400 border-emerald-800/60 text-[10px]">
                            Auto-Purged on Expiry
                          </VFBadge>
                        )}
                      </VFTableCell>
                    </VFTableRow>
                  ))}
                </VFTableBody>
              </VFTable>
            </div>
          </VFCard>
        </div>
      )}

      {/* 11. Tab 8: SECTION 8(6) BREACH RESPONSE */}
      {activeTab === 'breach-response' && (
        <div className="space-y-4">
          <VFCard className="p-4 bg-[#111111] border-border/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Section 8(6): Personal Data Breach Incident Response &amp; Board Notification
                </h3>
                <p className="text-xs text-muted-foreground">
                  Mandatory protocol to notify the Data Protection Board of India (DPBI) and affected Data Principals upon any confirmed breach.
                </p>
              </div>

              <VFButton
                size="sm"
                onClick={() => {
                  reportDataBreach({
                    title: 'Simulated Boundary Defense Drill',
                    severity: 'Low',
                    categoriesAffected: ['Network Gateway Log Telemetry'],
                    estimatedAffectedPrincipals: 0,
                    boardNotificationRequired: false,
                    boardNotificationStatus: 'Not Required',
                    principalNotificationStatus: 'Not Required',
                    containmentMeasures: 'Simulated perimeter probe instantly blocked by AWS WAF.',
                    remediationPlan: 'Audit log integrity verified.',
                  });
                  addNotification({
                    title: 'Security Drill Logged',
                    description: 'Simulated incident response executed cleanly.',
                    type: 'info',
                  });
                }}
                className="h-8 bg-neutral-800 hover:bg-neutral-700 text-foreground border border-neutral-700 text-xs gap-1.5"
              >
                <Activity className="w-3.5 h-3.5" />
                Run Incident Response Drill
              </VFButton>
            </div>

            {/* Incidents Table */}
            <div className="overflow-x-auto pt-1">
              <VFTable>
                <VFTableHead>
                  <VFTableRow>
                    <VFTableHeaderCell className="text-xs">Incident Ref</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Title &amp; Scope</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Severity</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Detected At</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Status</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">DPBI Board Notice</VFTableHeaderCell>
                    <VFTableHeaderCell className="text-xs">Containment Actions</VFTableHeaderCell>
                  </VFTableRow>
                </VFTableHead>
                <VFTableBody>
                  {dataBreaches.map((inc) => (
                    <VFTableRow key={inc.id}>
                      <VFTableCell className="text-xs font-mono text-foreground font-semibold">
                        {inc.incidentRef}
                      </VFTableCell>
                      <VFTableCell className="text-xs text-foreground font-medium">
                        <div>{inc.title}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          Affected: {inc.estimatedAffectedPrincipals} Principals
                        </div>
                      </VFTableCell>
                      <VFTableCell className="text-xs">
                        <VFBadge
                          variant="outline"
                          className={cn(
                            'text-[10px]',
                            inc.severity === 'Critical'
                              ? 'bg-rose-950/40 text-rose-400 border-rose-800/60'
                              : 'bg-neutral-900 text-neutral-300 border-neutral-800'
                          )}
                        >
                          {inc.severity}
                        </VFBadge>
                      </VFTableCell>
                      <VFTableCell className="text-xs font-mono text-muted-foreground">{inc.detectedAt}</VFTableCell>
                      <VFTableCell className="text-xs">
                        <VFBadge variant="outline" className="bg-emerald-950/40 text-emerald-400 border-emerald-800/60 text-[10px]">
                          {inc.status}
                        </VFBadge>
                      </VFTableCell>
                      <VFTableCell className="text-xs font-mono text-muted-foreground">{inc.boardNotificationStatus}</VFTableCell>
                      <VFTableCell className="text-xs text-muted-foreground max-w-xs truncate">
                        {inc.containmentMeasures}
                      </VFTableCell>
                    </VFTableRow>
                  ))}
                </VFTableBody>
              </VFTable>
            </div>
          </VFCard>
        </div>
      )}

      {/* ─── MODALS ─── */}

      {/* 1. Consent Withdrawal Modal */}
      <VFDialog
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Withdraw Purpose-Specific Consent"
        description="Section 6(4): Data Principals have the right to withdraw consent at any time as easily as giving consent."
      >
        <div className="space-y-3.5 text-xs text-neutral-300">
          <p>
            Withdrawing consent for purpose <span className="font-mono text-emerald-400 font-semibold">[{selectedWithdrawPurpose}]</span> will immediately stop non-essential processing and notify dependent processors (e.g. SMS/WhatsApp gateways).
          </p>
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Reason for Revocation (Optional):</label>
            <VFInput
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              placeholder="e.g. No longer require WhatsApp circular broadcasts"
              className="text-xs"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <VFButton size="sm" variant="ghost" onClick={() => setIsWithdrawModalOpen(false)} className="text-xs">
              Cancel
            </VFButton>
            <VFButton size="sm" variant="danger" onClick={handleConfirmWithdraw} className="text-xs bg-rose-600 hover:bg-rose-500">
              Confirm Revocation
            </VFButton>
          </div>
        </div>
      </VFDialog>

      {/* 2. Add Verifiable Parental Consent Modal */}
      <VFDialog
        isOpen={isAddVpcModalOpen}
        onClose={() => setIsAddVpcModalOpen(false)}
        title="Log Verifiable Parental Consent (Section 9)"
        description="Record validated parental consent for minor students under the DPDP Act 2023."
      >
        <form onSubmit={handleSubmitVpc} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-foreground">Minor Student Full Name *</label>
              <VFInput
                value={vpcStudentName}
                onChange={(e) => setVpcStudentName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="text-xs"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Date of Birth *</label>
              <VFInput
                type="date"
                value={vpcStudentDob}
                onChange={(e) => setVpcStudentDob(e.target.value)}
                className="text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-foreground">Parent / Legal Guardian Name *</label>
              <VFInput
                value={vpcGuardianName}
                onChange={(e) => setVpcGuardianName(e.target.value)}
                placeholder="e.g. Dr. Rajesh Sharma"
                className="text-xs"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Relationship *</label>
              <VFSelect
                value={vpcGuardianRelation}
                onChange={(e) => setVpcGuardianRelation(e.target.value as any)}
                options={[
                  { label: 'Father', value: 'Father' },
                  { label: 'Mother', value: 'Mother' },
                  { label: 'Legal Guardian', value: 'Legal Guardian' },
                ]}
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-foreground">Guardian Phone *</label>
              <VFInput
                value={vpcGuardianPhone}
                onChange={(e) => setVpcGuardianPhone(e.target.value)}
                placeholder="+91 98101 23456"
                className="text-xs"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Guardian Email *</label>
              <VFInput
                type="email"
                value={vpcGuardianEmail}
                onChange={(e) => setVpcGuardianEmail(e.target.value)}
                placeholder="guardian@example.com"
                className="text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground">Verification Method</label>
            <VFSelect
              value={vpcMethod}
              onChange={(e) => setVpcMethod(e.target.value as any)}
              options={[
                { label: 'Authenticated Parent Portal Session (Portal_Auth)', value: 'Portal_Auth' },
                { label: 'Aadhaar OTP Sandbox Verification (Aadhaar_OTP)', value: 'Aadhaar_OTP' },
                { label: 'Digital Signature Token (Digital_Sign)', value: 'Digital_Sign' },
                { label: 'Physical Signed Admission Dossier (Physical_Dossier)', value: 'Physical_Dossier' },
              ]}
              className="text-xs"
            />
          </div>

          <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-900/60 text-[11px] text-emerald-300">
            ✓ By submitting, the institution affirms zero commercial profiling and zero targeted ads for this minor.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <VFButton type="button" size="sm" variant="ghost" onClick={() => setIsAddVpcModalOpen(false)} className="text-xs">
              Cancel
            </VFButton>
            <VFButton type="submit" size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white">
              Log Verified Consent
            </VFButton>
          </div>
        </form>
      </VFDialog>

      {/* 3. File DSR Request Modal */}
      <VFDialog
        isOpen={isDsrModalOpen}
        onClose={() => setIsDsrModalOpen(false)}
        title="Submit Data Subject Request (DSR)"
        description="Exercise statutory rights under DPDP Act Sections 11, 12, and 14."
      >
        <form onSubmit={handleSubmitDsr} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-foreground">Requester Full Name *</label>
              <VFInput
                value={dsrPrincipalName}
                onChange={(e) => setDsrPrincipalName(e.target.value)}
                placeholder="Full Name"
                className="text-xs"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Role *</label>
              <VFSelect
                value={dsrPrincipalRole}
                onChange={(e) => setDsrPrincipalRole(e.target.value as any)}
                options={[
                  { label: 'Parent / Guardian', value: 'Parent' },
                  { label: 'Student', value: 'Student' },
                  { label: 'Teacher / Faculty', value: 'Teacher' },
                  { label: 'Support Staff', value: 'Staff' },
                ]}
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-foreground">Contact Email / Phone *</label>
              <VFInput
                value={dsrContact}
                onChange={(e) => setDsrContact(e.target.value)}
                placeholder="email@example.com"
                className="text-xs"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Right Type *</label>
              <VFSelect
                value={dsrRightType}
                onChange={(e) => setDsrRightType(e.target.value as any)}
                options={[
                  { label: 'Right to Access Summary (Sec 11)', value: 'access_summary' },
                  { label: 'Right to Correction (Sec 12)', value: 'correction' },
                  { label: 'Right to Updating & Completion (Sec 12)', value: 'updating' },
                  { label: 'Right to Erasure / Deletion (Sec 12)', value: 'erasure' },
                  { label: 'Right to Nominate (Sec 14)', value: 'nomination' },
                ]}
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground">Request Details &amp; Justification *</label>
            <VFInput
              value={dsrDescription}
              onChange={(e) => setDsrDescription(e.target.value)}
              placeholder="Provide specific details of personal data, fields, or corrections required"
              className="text-xs"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <VFButton type="button" size="sm" variant="ghost" onClick={() => setIsDsrModalOpen(false)} className="text-xs">
              Cancel
            </VFButton>
            <VFButton type="submit" size="sm" className="text-xs bg-blue-600 hover:bg-blue-500 text-white">
              Submit Request
            </VFButton>
          </div>
        </form>
      </VFDialog>

      {/* 4. File Grievance Modal */}
      <VFDialog
        isOpen={isGrievanceModalOpen}
        onClose={() => setIsGrievanceModalOpen(false)}
        title="Lodge Privacy Grievance (Section 13)"
        description="Formal redressal of personal data protection grievances with statutory SLA tracking."
      >
        <form onSubmit={handleSubmitGrievance} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-foreground">Complainant Full Name *</label>
              <VFInput
                value={grvName}
                onChange={(e) => setGrvName(e.target.value)}
                placeholder="Full Name"
                className="text-xs"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Complainant Role *</label>
              <VFSelect
                value={grvRole}
                onChange={(e) => setGrvRole(e.target.value as any)}
                options={[
                  { label: 'Parent / Guardian', value: 'Parent' },
                  { label: 'Student', value: 'Student' },
                  { label: 'Faculty', value: 'Faculty' },
                  { label: 'General Public', value: 'Public' },
                ]}
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-foreground">Contact Email *</label>
              <VFInput
                type="email"
                value={grvEmail}
                onChange={(e) => setGrvEmail(e.target.value)}
                placeholder="email@example.com"
                className="text-xs"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Contact Phone *</label>
              <VFInput
                value={grvPhone}
                onChange={(e) => setGrvPhone(e.target.value)}
                placeholder="+91 98111 22334"
                className="text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground">Grievance Category *</label>
            <VFSelect
              value={grvCategory}
              onChange={(e) => setGrvCategory(e.target.value as any)}
              options={[
                { label: 'Consent Withdrawal Refusal', value: 'Consent Withdrawal Refusal' },
                { label: 'Unauthorised Personal Data Processing', value: 'Unauthorised Personal Data Processing' },
                { label: 'Data Inaccuracy & Correction Delay', value: 'Data Inaccuracy & Correction Delay' },
                { label: 'Erasure Request Default', value: 'Erasure Request Default' },
                { label: 'Minor Data Safeguards Concern', value: 'Minor Data Safeguards' },
                { label: 'Biometric / Telemetry Tracking Concern', value: 'Biometric / Telemetry Tracking Concern' },
                { label: 'Security / Breach Concern', value: 'Security / Breach Concern' },
              ]}
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground">Subject *</label>
            <VFInput
              value={grvSubject}
              onChange={(e) => setGrvSubject(e.target.value)}
              placeholder="Brief summary of grievance"
              className="text-xs"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground">Detailed Description *</label>
            <VFInput
              value={grvDescription}
              onChange={(e) => setGrvDescription(e.target.value)}
              placeholder="Provide complete facts, dates, and evidence"
              className="text-xs"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <VFButton type="button" size="sm" variant="ghost" onClick={() => setIsGrievanceModalOpen(false)} className="text-xs">
              Cancel
            </VFButton>
            <VFButton type="submit" size="sm" className="text-xs bg-rose-600 hover:bg-rose-500 text-white">
              File Official Grievance
            </VFButton>
          </div>
        </form>
      </VFDialog>

      {/* 5. DPO Contact Card Modal */}
      <VFDialog
        isOpen={isDpoContactModalOpen}
        onClose={() => setIsDpoContactModalOpen(false)}
        title="Designated Data Protection Officer (DPO)"
        description="Official privacy & grievance contact designated under the DPDP Act, 2023 & DPDP Rules, 2025."
      >
        <div className="space-y-3 text-xs text-neutral-300">
          <div className="p-3 rounded bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm font-bold text-foreground">{DPDP_OFFICER_CONFIG.name}</div>
                <div className="text-[11px] text-muted-foreground">{DPDP_OFFICER_CONFIG.title}</div>
              </div>
            </div>
            <div className="pt-2 border-t border-neutral-800 space-y-1 font-mono text-[11px]">
              <div><strong>Email:</strong> <a href={`mailto:${DPDP_OFFICER_CONFIG.email}`} className="text-blue-400 underline">{DPDP_OFFICER_CONFIG.email}</a></div>
              <div><strong>Phone:</strong> {DPDP_OFFICER_CONFIG.phone}</div>
              <div><strong>Organization:</strong> {DPDP_OFFICER_CONFIG.organization}</div>
              <div><strong>Address:</strong> {DPDP_OFFICER_CONFIG.address}</div>
              <div><strong>Jurisdiction:</strong> {DPDP_OFFICER_CONFIG.jurisdiction}</div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-blue-950/20 border border-blue-900/60 text-[11px] text-blue-300">
            Statutory Redressal Ceiling: 90 Days • Institutional SLA Target: 7 Days
          </div>

          <div className="flex items-center justify-end pt-1">
            <VFButton size="sm" onClick={() => setIsDpoContactModalOpen(false)} className="text-xs">
              Close
            </VFButton>
          </div>
        </div>
      </VFDialog>
    </VFPageContainer>
  );
}
