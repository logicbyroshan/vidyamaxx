import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFButton,
  VFCard,
  VFBadge,
  VFDialog,
  VFInput,
  VFStatCard,
} from '@vidyafloww/ui';
import {
  Building,
  Plus,
  Building2,
  Trash2,
  Check,
  Edit2,
  X,
  MapPin,
  Upload,
  Shield,
  ShieldCheck,
  Terminal,
  Lock,
  UserCheck,
  Users,
  CreditCard,
  GraduationCap,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/settings')({
  component: SchoolAdministrationPage,
});

interface CampusRecord {
  code: string;
  name: string;
  city: string;
  board: string;
  session: string;
  students: number;
  principal: string;
  status: 'Active Primary' | 'Active Branch';
  coverUrl: string;
  logoUrl?: string;
}

const INITIAL_CAMPUSES: CampusRecord[] = [
  {
    code: 'CMP-01',
    name: 'VidyaFloww International Academy (Main Campus)',
    city: 'New Delhi, India',
    board: 'CBSE Affiliation #1630982',
    session: '2026-2027',
    students: 1248,
    principal: 'Dr. Rajesh Sharma',
    status: 'Active Primary',
    coverUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80',
  },
  {
    code: 'CMP-02',
    name: 'VidyaFloww International Academy (North Branch)',
    city: 'Gurugram, Haryana',
    board: 'CBSE / IB World',
    session: '2026-2027',
    students: 840,
    principal: 'Ms. Pooja Rao',
    status: 'Active Branch',
    coverUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
  },
  {
    code: 'CMP-03',
    name: 'VidyaFloww International Academy (South Campus)',
    city: 'Noida, Uttar Pradesh',
    board: 'CBSE Affiliation #1630990',
    session: '2026-2027',
    students: 363,
    principal: 'Mr. Deepak Mishra',
    status: 'Active Branch',
    coverUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&auto=format&fit=crop&q=80',
  },
];

function SchoolAdministrationPage() {
  const {
    schoolProfile,
    updateSchoolProfile,
    addNotification,
    language,
  } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi' || language === 'hi';

  React.useEffect(() => {
    document.title = t('nav.settings') + ' – VidyaFloww';
  }, [t]);

  // Branding Edit Mode state
  const [isEditingBranding, setIsEditingBranding] = React.useState(false);

  // Local form state for school branding
  const [formData, setFormData] = React.useState({
    name: schoolProfile.name,
    shortCode: schoolProfile.shortCode,
    tagline: schoolProfile.tagline,
    affiliation: schoolProfile.affiliation,
    city: schoolProfile.city,
    customLogoUrl: schoolProfile.customLogoUrl || '',
    establishedYear: '1994',
    academicLevel: 'K-12 Senior Secondary',
    principalName: 'Dr. Rajesh Sharma, Ph.D.',
  });

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Campus master data state
  const [campuses, setCampuses] = React.useState<CampusRecord[]>(INITIAL_CAMPUSES);
  const [isAddCampusModalOpen, setIsAddCampusModalOpen] = React.useState(false);
  const [editingCampus, setEditingCampus] = React.useState<CampusRecord | null>(null);
  const [newCampus, setNewCampus] = React.useState<Partial<CampusRecord>>({
    code: `CMP-0${campuses.length + 1}`,
    name: '',
    city: '',
    board: 'CBSE Affiliation',
    session: '2026-2027',
    students: 250,
    principal: '',
    status: 'Active Branch',
    coverUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80',
  });

  // Sync state if store updates
  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: schoolProfile.name,
      shortCode: schoolProfile.shortCode,
      tagline: schoolProfile.tagline,
      affiliation: schoolProfile.affiliation,
      city: schoolProfile.city,
      customLogoUrl: schoolProfile.customLogoUrl || '',
    }));
  }, [schoolProfile]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          customLogoUrl: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranding = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSchoolProfile({
      name: formData.name.trim() || 'VidyaFloww International Academy',
      shortCode: formData.shortCode.trim(),
      tagline: formData.tagline.trim(),
      affiliation: formData.affiliation.trim(),
      city: formData.city.trim(),
      customLogoUrl: formData.customLogoUrl,
      logoType: formData.customLogoUrl ? 'custom_image' : 'preset',
    });
    setIsEditingBranding(false);
    addNotification({
      title: isHindi ? 'स्कूल प्रोफाइल अपडेटेड' : 'School Profile Updated',
      description: `Updated profile details for "${formData.name}".`,
      type: 'success',
    });
  };

  const handleCancelBrandingEdit = () => {
    setFormData({
      name: schoolProfile.name,
      shortCode: schoolProfile.shortCode,
      tagline: schoolProfile.tagline,
      affiliation: schoolProfile.affiliation,
      city: schoolProfile.city,
      customLogoUrl: schoolProfile.customLogoUrl || '',
      establishedYear: '1994',
      academicLevel: 'K-12 Senior Secondary',
      principalName: 'Dr. Rajesh Sharma, Ph.D.',
    });
    setIsEditingBranding(false);
  };

  const handleAddCampus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampus.name || !newCampus.city) return;

    if (editingCampus) {
      setCampuses((prev) =>
        prev.map((c) =>
          c.code === editingCampus.code
            ? {
                ...c,
                name: newCampus.name || c.name,
                city: newCampus.city || c.city,
                board: newCampus.board || c.board,
                principal: newCampus.principal || c.principal,
                students: Number(newCampus.students) || c.students,
                coverUrl: newCampus.coverUrl || c.coverUrl,
                status: (newCampus.status as any) || c.status,
              }
            : c
        )
      );
      addNotification({
        title: isHindi ? 'ब्रांच अपडेट हुई' : 'Branch Updated',
        description: `Updated branch details for "${newCampus.name}".`,
        type: 'success',
      });
    } else {
      const added: CampusRecord = {
        code: newCampus.code || `CMP-0${campuses.length + 1}`,
        name: newCampus.name,
        city: newCampus.city,
        board: newCampus.board || 'CBSE Affiliation',
        session: newCampus.session || '2026-2027',
        students: Number(newCampus.students) || 200,
        principal: newCampus.principal || 'Branch Principal',
        status: (newCampus.status as any) || 'Active Branch',
        coverUrl: newCampus.coverUrl || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80',
      };
      setCampuses((prev) => [...prev, added]);
      addNotification({
        title: isHindi ? 'न्यू ब्रांच ऐड हुई' : 'Branch Added',
        description: `Campus branch "${newCampus.name}" successfully added.`,
        type: 'success',
      });
    }

    setIsAddCampusModalOpen(false);
    setEditingCampus(null);
    setNewCampus({
      code: `CMP-0${campuses.length + 2}`,
      name: '',
      city: '',
      board: 'CBSE Affiliation',
      session: '2026-2027',
      students: 250,
      principal: '',
      status: 'Active Branch',
      coverUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80',
    });
  };

  const handleDeleteCampus = (code: string) => {
    setCampuses((prev) => prev.filter((c) => c.code !== code));
    addNotification({
      title: isHindi ? 'ब्रांच डिलीट हुई' : 'Branch Removed',
      description: `Campus branch [${code}] removed.`,
      type: 'warning',
    });
  };

  return (
    <VFPageContainer className="space-y-4 w-full">
      {/* Role-Based Access Control (RBAC) & Governance Stat Cards Bar */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-rose-400" />
              <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wide">
                {isHindi ? 'रोल-बेस्ड एक्सेस कंट्रोल (RBAC) & गवर्नेंस' : 'Role-Based Access Control (RBAC) & Governance'}
              </h2>
              <VFBadge variant="outline" className="text-[10px] font-bold font-mono">
                {isHindi ? '5 एक्टिव टियर्स' : '5 Active Tiers'}
              </VFBadge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isHindi
                ? 'इंस्टीट्यूशनल अथॉरिटी लेवल्स, यूज़र रोल्स और ऑडिट ट्रेल्स'
                : 'Configured user roles, authorization hierarchy, and tamper-evident audit trails'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <Link to="/privacy">
              <VFButton
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs font-bold rounded-[4px] border-emerald-800/80 text-emerald-400 hover:bg-emerald-950/40"
                leftIcon={<ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />}
              >
                {isHindi ? 'प्राइवेसी & DPDP ↗' : 'Privacy & DPDP ↗'}
              </VFButton>
            </Link>
            <Link to="/audit">
              <VFButton
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs font-bold rounded-[4px]"
                leftIcon={<Terminal className="h-3.5 w-3.5 text-emerald-400" />}
              >
                {isHindi ? 'लाइव ऑडिट लॉग्स ↗' : 'Audit Logs ↗'}
              </VFButton>
            </Link>
            <Link to="/security">
              <VFButton
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs font-bold rounded-[4px]"
                leftIcon={<Shield className="h-3.5 w-3.5 text-rose-400" />}
              >
                {isHindi ? 'सिक्योरिटी & रोल्स ↗' : 'Security & Roles ↗'}
              </VFButton>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          <VFStatCard
            title={isHindi ? 'सुपर एडमिन' : 'Super Administrator'}
            value="2 Accounts"
            icon={<Shield className="h-5 w-5 text-rose-400" />}
            trend="up"
            trendLabel="Full Root"
            description={isHindi ? 'रूट डेटाबेस, लाइसेंस और API क्रेडेंशियल्स' : 'Root database, license keys & API'}
            accentColor="rose"
            className="rounded-[4px]"
          />
          <VFStatCard
            title={isHindi ? 'स्कूल प्रिंसिपल' : 'School Principal'}
            value="2 Accounts"
            icon={<UserCheck className="h-5 w-5 text-primary" />}
            trend="up"
            trendLabel="Executive"
            description={isHindi ? 'फैकल्टी वर्कलोड, एडमिशन और एग्जाम सुपरविजन' : 'Faculty workload & admissions'}
            accentColor="primary"
            className="rounded-[4px]"
          />
          <VFStatCard
            title={isHindi ? 'फ्रंट ऑफिस / रजिस्ट्रार' : 'Front Office / Registrar'}
            value="6 Accounts"
            icon={<Users className="h-5 w-5 text-amber-400" />}
            trend="neutral"
            trendLabel="Operations"
            description={isHindi ? 'एडमिशन रजिस्ट्रेशन, रसीदें और TC डॉक्यूमेंट्स' : 'Admissions, receipts & TC generation'}
            accentColor="amber"
            className="rounded-[4px]"
          />
          <VFStatCard
            title={isHindi ? 'अकाउंटेंट / कोषाध्यक्ष' : 'Accountant / Bursar'}
            value="3 Accounts"
            icon={<CreditCard className="h-5 w-5 text-emerald-400" />}
            trend="up"
            trendLabel="Finance"
            description={isHindi ? 'फीस रजिस्टर, रिफंड्स और बैंक रिकॉन्सिलेशन' : 'Fee registers & bank reconciliations'}
            accentColor="emerald"
            className="rounded-[4px]"
          />
          <VFStatCard
            title={isHindi ? 'पैरेंट & स्टूडेंट पोर्टल' : 'Parent & Student Portal'}
            value="2,450+"
            icon={<GraduationCap className="h-5 w-5 text-purple-400" />}
            trend="up"
            trendLabel="Self-Service"
            description={isHindi ? 'स्टूडेंट प्रोफाइल्स, टाइमटेबल और ऑनलाइन फीस' : 'Dossiers, timetable & online fees'}
            accentColor="purple"
            className="rounded-[4px]"
          />
        </div>
      </div>

      {/* 1. School Profile & Identity Card */}
      <VFCard
        title={
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span>{isHindi ? 'स्कूल प्रोफाइल' : 'School Profile'}</span>
          </div>
        }
        description={
          isHindi
            ? 'स्कूल नेम, एफिलिएशन, सिटी और ऑफिशियल आइडेंटिटी'
            : 'Institution legal name, board affiliation, city, and identity details'
        }
        actions={
          isEditingBranding ? (
            <div className="flex items-center gap-2">
              <VFButton
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCancelBrandingEdit}
                className="h-8 px-3 text-xs bg-[#141414] hover:bg-[#222222] border-border text-foreground rounded-[4px]"
                leftIcon={<X className="h-3.5 w-3.5" />}
              >
                {t('action.cancel')}
              </VFButton>
              <VFButton
                type="button"
                size="sm"
                onClick={() => handleSaveBranding()}
                className="h-8 px-3.5 text-xs font-bold rounded-[4px]"
                leftIcon={<Check className="h-3.5 w-3.5" />}
              >
                {t('action.saveChanges')}
              </VFButton>
            </div>
          ) : (
            <VFButton
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsEditingBranding(true)}
              className="h-8 px-3 text-xs font-bold bg-[#141414] hover:bg-[#222222] border-border text-foreground rounded-[4px]"
              leftIcon={<Edit2 className="h-3.5 w-3.5 text-primary" />}
            >
              {isHindi ? 'प्रोफाइल एडिट करें' : 'Edit Profile'}
            </VFButton>
          )
        }
        className="bg-[#0d0d0d] border-border/90"
        bodyClassName="p-4"
      >
        <form onSubmit={handleSaveBranding} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* School Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {isHindi ? 'स्कूल नेम *' : 'School Name *'}
              </label>
              <input
                type="text"
                required
                disabled={!isEditingBranding}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 text-xs border rounded-[4px] font-semibold h-8 transition-colors ${
                  isEditingBranding
                    ? 'border-border bg-[#1a1a1a] text-foreground focus:ring-1 focus:ring-primary/40'
                    : 'border-border/60 bg-[#171717] text-foreground cursor-not-allowed opacity-90'
                }`}
              />
            </div>

            {/* Board Affiliation */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {isHindi ? 'एफिलिएशन कोड' : 'Affiliation Code'}
              </label>
              <input
                type="text"
                disabled={!isEditingBranding}
                value={formData.affiliation}
                onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                className={`w-full px-3 py-2 text-xs border rounded-[4px] font-semibold h-8 transition-colors ${
                  isEditingBranding
                    ? 'border-border bg-[#1a1a1a] text-foreground focus:ring-1 focus:ring-primary/40'
                    : 'border-border/60 bg-[#171717] text-foreground cursor-not-allowed opacity-90'
                }`}
              />
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {isHindi ? 'सिटी / स्टेट' : 'City / Region'}
              </label>
              <input
                type="text"
                disabled={!isEditingBranding}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={`w-full px-3 py-2 text-xs border rounded-[4px] font-semibold h-8 transition-colors ${
                  isEditingBranding
                    ? 'border-border bg-[#1a1a1a] text-foreground focus:ring-1 focus:ring-primary/40'
                    : 'border-border/60 bg-[#171717] text-foreground cursor-not-allowed opacity-90'
                }`}
              />
            </div>

            {/* Principal Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {isHindi ? 'प्रिंसिपल इन-चार्ज' : 'Principal In-Charge'}
              </label>
              <input
                type="text"
                disabled={!isEditingBranding}
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                className={`w-full px-3 py-2 text-xs border rounded-[4px] font-semibold h-8 transition-colors ${
                  isEditingBranding
                    ? 'border-border bg-[#1a1a1a] text-foreground focus:ring-1 focus:ring-primary/40'
                    : 'border-border/60 bg-[#171717] text-foreground cursor-not-allowed opacity-90'
                }`}
              />
            </div>

            {/* Tagline */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {isHindi ? 'स्कूल मोटो / टैगलाइन' : 'School Motto / Tagline'}
              </label>
              <input
                type="text"
                disabled={!isEditingBranding}
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className={`w-full px-3 py-2 text-xs border rounded-[4px] font-semibold h-8 transition-colors ${
                  isEditingBranding
                    ? 'border-border bg-[#1a1a1a] text-foreground focus:ring-1 focus:ring-primary/40'
                    : 'border-border/60 bg-[#171717] text-foreground cursor-not-allowed opacity-90'
                }`}
              />
            </div>

            {/* Short Code */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {isHindi ? 'शॉर्ट कोड' : 'Short Identifier'}
              </label>
              <input
                type="text"
                disabled={!isEditingBranding}
                value={formData.shortCode}
                onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
                className={`w-full px-3 py-2 text-xs border rounded-[4px] font-semibold h-8 transition-colors ${
                  isEditingBranding
                    ? 'border-border bg-[#1a1a1a] text-foreground focus:ring-1 focus:ring-primary/40'
                    : 'border-border/60 bg-[#171717] text-foreground cursor-not-allowed opacity-90'
                }`}
              />
            </div>
          </div>

          {/* School Logo Section */}
          {isEditingBranding && (
            <div className="pt-2 border-t border-[#202020] flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <VFButton
                type="button"
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs rounded-[4px]"
                leftIcon={<Upload className="h-3.5 w-3.5" />}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Logo Image
              </VFButton>
              {formData.customLogoUrl && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="h-3 w-3" /> Logo uploaded
                </span>
              )}
            </div>
          )}
        </form>
      </VFCard>

      {/* 2. Campus Branch Master Directory Card */}
      <VFCard
        title={
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-blue-400" />
            <span>{isHindi ? 'कैंपस ब्रांचेस' : 'Campus Branches'}</span>
            <VFBadge variant="outline" className="text-xs font-mono font-bold bg-[#1a1a1a] text-foreground">
              {campuses.length} {isHindi ? 'लोकेशन्स' : 'Locations'}
            </VFBadge>
          </div>
        }
        description={
          isHindi
            ? 'कैंपस ब्रांचेस, लोकेशन, स्टूडेंट्स काउंट और ब्रांच हेड का मैनेजमेंट'
            : 'Manage campus locations, student enrollment, and branch heads'
        }
        actions={
          <VFButton
            size="sm"
            className="h-8 px-3 text-xs font-bold rounded-[4px]"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => {
              setEditingCampus(null);
              setNewCampus({
                code: `CMP-0${campuses.length + 1}`,
                name: '',
                city: '',
                board: 'CBSE Affiliation',
                session: '2026-2027',
                students: 250,
                principal: '',
                status: 'Active Branch',
                coverUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80',
              });
              setIsAddCampusModalOpen(true);
            }}
          >
            {isHindi ? 'न्यू कैंपस ब्रांच ऐड करें' : 'Add Campus Branch'}
          </VFButton>
        }
        className="bg-[#0d0d0d] border-border/90"
        bodyClassName="p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {campuses.map((branch) => (
            <div
              key={branch.code}
              className="rounded-[4px] bg-[#141414] border border-border/80 overflow-hidden flex flex-col justify-between hover:border-border transition-colors group shadow-xs"
            >
              {/* Branch Cover Header with Top Actions */}
              <div className="relative h-48 w-full bg-[#1c1c1c] overflow-hidden">
                <img
                  src={branch.coverUrl}
                  alt={branch.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] bg-black/70 text-white border border-white/10 backdrop-blur-xs">
                    {branch.code}
                  </span>
                  <VFBadge
                    variant={branch.status === 'Active Primary' ? 'success' : 'outline'}
                    className="text-[10px] font-bold backdrop-blur-xs"
                  >
                    {branch.status}
                  </VFBadge>
                </div>

                {/* Top Action Buttons (Edit & Delete on top where image is) */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCampus(branch);
                      setNewCampus(branch);
                      setIsAddCampusModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-[3px] text-[11px] font-bold bg-black/75 hover:bg-black/95 text-white border border-white/20 backdrop-blur-xs transition-colors cursor-pointer shadow-xs"
                    title={isHindi ? 'ब्रांच एडिट करें' : 'Edit Branch'}
                  >
                    <Edit2 className="h-3 w-3 text-primary" />
                    <span>{isHindi ? 'एडिट करें' : 'Edit'}</span>
                  </button>
                  {branch.status !== 'Active Primary' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCampus(branch.code)}
                      className="p-1 rounded-[3px] bg-black/75 hover:bg-rose-600/90 text-white/80 hover:text-white border border-white/20 backdrop-blur-xs transition-colors cursor-pointer shadow-xs"
                      title={isHindi ? 'ब्रांच डिलीट करें' : 'Delete Branch'}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Branch Information */}
              <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-foreground text-sm line-clamp-1">{branch.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-primary shrink-0" /> {branch.city}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#202020]">
                  <div className="p-2 rounded-[3px] bg-[#181818] border border-[#242424]">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      {isHindi ? 'स्टूडेंट्स' : 'Students'}
                    </span>
                    <span className="font-mono font-extrabold text-foreground">{branch.students}</span>
                  </div>
                  <div className="p-2 rounded-[3px] bg-[#181818] border border-[#242424]">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      {isHindi ? 'प्रिंसिपल' : 'Principal'}
                    </span>
                    <span className="font-bold text-foreground truncate block">{branch.principal}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </VFCard>



      {/* 4. Add / Edit Campus Modal */}
      <VFDialog
        isOpen={isAddCampusModalOpen}
        onClose={() => setIsAddCampusModalOpen(false)}
        title={editingCampus ? 'Edit Campus Branch' : 'Add New Campus Branch'}
        description="Configure campus details, location, and branch leadership."
        className="max-w-md rounded-[4px]"
        footerActions={
          <div className="flex items-center justify-end gap-2 w-full">
            <VFButton
              variant="outline"
              size="sm"
              className="rounded-[4px]"
              onClick={() => setIsAddCampusModalOpen(false)}
            >
              Cancel
            </VFButton>
            <VFButton
              size="sm"
              className="rounded-[4px]"
              onClick={handleAddCampus}
            >
              {editingCampus ? 'Save Changes' : 'Register Branch'}
            </VFButton>
          </div>
        }
      >
        <form onSubmit={handleAddCampus} className="space-y-3.5 py-2 text-xs">
          <VFInput
            label="Campus / Branch Name *"
            value={newCampus.name || ''}
            onChange={(e) => setNewCampus({ ...newCampus, name: e.target.value })}
            placeholder="e.g. VidyaFloww International (East Wing)"
            className="rounded-[4px]"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <VFInput
              label="City / Location *"
              value={newCampus.city || ''}
              onChange={(e) => setNewCampus({ ...newCampus, city: e.target.value })}
              placeholder="e.g. Noida, UP"
              className="rounded-[4px]"
              required
            />
            <VFInput
              label="Branch Code"
              value={newCampus.code || ''}
              onChange={(e) => setNewCampus({ ...newCampus, code: e.target.value })}
              placeholder="CMP-04"
              className="rounded-[4px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <VFInput
              label="Principal In-Charge"
              value={newCampus.principal || ''}
              onChange={(e) => setNewCampus({ ...newCampus, principal: e.target.value })}
              placeholder="e.g. Mr. Anil Verma"
              className="rounded-[4px]"
            />
            <VFInput
              label="Total Enrolled Students"
              type="number"
              value={String(newCampus.students || '')}
              onChange={(e) => setNewCampus({ ...newCampus, students: Number(e.target.value) })}
              placeholder="350"
              className="rounded-[4px]"
            />
          </div>
          <VFInput
            label="Cover Photo URL"
            value={newCampus.coverUrl || ''}
            onChange={(e) => setNewCampus({ ...newCampus, coverUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="rounded-[4px]"
          />
        </form>
      </VFDialog>
    </VFPageContainer>
  );
}
