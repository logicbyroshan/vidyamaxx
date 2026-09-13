import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFPageToolbar,
  VFCard,
  VFButton,
  VFBadge,
} from '@vidyamaxx/ui';
import {
  Shield,
  ArrowLeft,
  CheckCircle2,
  Users,
  Sliders,
  Save,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/security')({
  component: SecurityManagementPage,
});

interface RolePermission {
  module: string;
  superAdmin: boolean;
  principal: boolean;
  frontOffice: boolean;
  accountant: boolean;
  parent: boolean;
}

const DEFAULT_PERMISSIONS: RolePermission[] = [
  { module: 'Student Directory & Dossiers', superAdmin: true, principal: true, frontOffice: true, accountant: false, parent: true },
  { module: 'Admissions Intake Pipeline', superAdmin: true, principal: true, frontOffice: true, accountant: false, parent: false },
  { module: 'Daily Attendance & Bio-Logs', superAdmin: true, principal: true, frontOffice: true, accountant: false, parent: true },
  { module: 'Timetable Schedules & Proxy Allocation', superAdmin: true, principal: true, frontOffice: false, accountant: false, parent: true },
  { module: 'Examination Marks & Grade Moderation', superAdmin: true, principal: true, frontOffice: false, accountant: false, parent: true },
  { module: 'Fee Collections & Receipts', superAdmin: true, principal: true, frontOffice: true, accountant: true, parent: true },
  { module: 'Faculty Workload & Appraisal', superAdmin: true, principal: true, frontOffice: false, accountant: true, parent: false },
  { module: 'Institutional Settings & School Branding', superAdmin: true, principal: false, frontOffice: false, accountant: false, parent: false },
];

function SecurityManagementPage() {
  const { addNotification } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';
  React.useEffect(() => { document.title = (isHindi ? 'सिक्योरिटी & रोल्स' : 'Security & Roles') + ' – VidyaMaxx'; }, [isHindi]);

  // Permission Matrix State
  const [permissions, setPermissions] = React.useState<RolePermission[]>(DEFAULT_PERMISSIONS);

  // Security Policies State
  const [twoFactorEnforced, setTwoFactorEnforced] = React.useState(true);
  const [sessionTimeout, setSessionTimeout] = React.useState(30);
  const [whitelistSubnet, setWhitelistSubnet] = React.useState('103.21.244.0/24');
  const [isEditingPolicies, setIsEditingPolicies] = React.useState(false);

  const handleTogglePermission = (moduleIndex: number, roleKey: keyof Omit<RolePermission, 'module'>) => {
    setPermissions((prev) => {
      const next = [...prev];
      next[moduleIndex] = {
        ...next[moduleIndex],
        [roleKey]: !next[moduleIndex][roleKey],
      };
      return next;
    });
    addNotification({
      title: 'Permission Modified',
      description: `Updated module access for role [${roleKey}].`,
      type: 'info',
    });
  };

  const handleSaveMatrix = () => {
    addNotification({
      title: 'Permission Matrix Saved',
      description: 'Institutional access control matrix updated across all portal gateways.',
      type: 'success',
    });
  };

  const handleSavePolicies = () => {
    setIsEditingPolicies(false);
    addNotification({
      title: 'Security Policies Saved',
      description: 'Network perimeter parameters and timeout policies applied.',
      type: 'success',
    });
  };

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* 1. Sleek Header Toolbar Box */}
      <VFPageToolbar>
        {/* Left: Back to Settings + Title */}
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

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#141414] border border-border/80 text-xs font-mono font-bold text-foreground">
            <Shield className="h-3.5 w-3.5 text-rose-400" />
            <span>{isHindi ? 'सिक्योरिटी & रोल्स' : 'Security & Roles'}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <VFButton
            size="sm"
            onClick={handleSaveMatrix}
            className="h-8 px-3.5 text-xs font-bold rounded-[4px] shadow-xs"
            leftIcon={<Save className="h-3.5 w-3.5" />}
          >
            {t('action.saveChanges')}
          </VFButton>
        </div>
      </VFPageToolbar>

      {/* 3. Role-Based Module Permission Matrix */}
      <VFCard
        title={
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-[4px] bg-primary/15 text-primary flex items-center justify-center shrink-0 border border-primary/30">
              <Users className="h-3.5 w-3.5" />
            </div>
            <span>{isHindi ? 'एंटरप्राइज मॉड्यूल ऑथराइजेशन मैट्रिक्स' : 'Enterprise Module Authorization Matrix'}</span>
          </div>
        }
        description={isHindi ? 'मॉड्यूल एक्सेस टॉगल करने के लिए किसी भी सेल पर क्लिक करें। टीचर परमिशन्स सीधे स्कूल प्रिंसिपल द्वारा मैनेज की जाती हैं।' : 'Click any cell to toggle module capabilities. Faculty permissions are managed directly by the School Principal.'}
        className="bg-[#0d0d0d] border-border/90"
        bodyClassName="p-0 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full min-w-full"
      >
        <table className="w-full min-w-full text-xs text-left border-collapse table-auto">
          <thead>
            <tr className="border-b border-border/80 bg-[#141414] text-muted-foreground font-extrabold uppercase tracking-wider text-[10px] whitespace-nowrap">
              <th className="py-2.5 px-3">{isHindi ? 'ERP मॉड्यूल्स' : 'Core Portal Module'}</th>
              <th className="py-2.5 px-3 text-center">
                {isHindi ? 'सुपर एडमिन' : 'Super Admin'}
                <span className="block text-[9px] text-muted-foreground font-normal lowercase">{isHindi ? '(फुल रूट एक्सेस)' : '(full root)'}</span>
              </th>
              <th className="py-2.5 px-3 text-center">
                {isHindi ? 'स्कूल प्रिंसिपल' : 'School Principal'}
                <span className="block text-[9px] text-primary font-bold lowercase">{isHindi ? '(फैकल्टी गवर्नेंस)' : '(faculty governance)'}</span>
              </th>
              <th className="py-2.5 px-3 text-center">
                {isHindi ? 'फ्रंट ऑफिस' : 'Front Office'}
                <span className="block text-[9px] text-amber-400/80 font-normal lowercase">{isHindi ? '(एडमिशन & रिकॉर्ड्स)' : '(intake & records)'}</span>
              </th>
              <th className="py-2.5 px-3 text-center">
                {isHindi ? 'अकाउंटेंट' : 'Accountant'}
                <span className="block text-[9px] text-purple-400/80 font-normal lowercase">{isHindi ? '(फाइनेंस & फीस)' : '(finance & fees)'}</span>
              </th>
              <th className="py-2.5 px-3 text-center">
                {isHindi ? 'पैरेंट & स्टूडेंट' : 'Parent & Student'}
                <span className="block text-[9px] text-blue-400/80 font-normal lowercase">{isHindi ? '(पोर्टल एक्सेस)' : '(self-service)'}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {permissions.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#141414]/60 transition-colors whitespace-nowrap">
                <td className="py-2.5 px-3 font-bold text-foreground">{row.module}</td>
                
                {/* Super Admin */}
                <td className="py-3.5 px-3 text-center">
                  <button
                    type="button"
                    disabled
                    className="h-5 w-5 rounded-[3px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 inline-flex items-center justify-center cursor-not-allowed mx-auto"
                    title="Super Admin has immutable full root privileges"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </button>
                </td>

                {/* Principal */}
                <td className="py-3.5 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleTogglePermission(idx, 'principal')}
                    className={`h-5 w-5 rounded-[3px] border inline-flex items-center justify-center cursor-pointer transition-colors mx-auto ${
                      row.principal
                        ? 'bg-primary/20 text-primary border-primary/40'
                        : 'bg-[#141414] text-muted-foreground/40 border-border/60 hover:border-border'
                    }`}
                  >
                    {row.principal && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </button>
                </td>

                {/* Front Office */}
                <td className="py-3.5 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleTogglePermission(idx, 'frontOffice')}
                    className={`h-5 w-5 rounded-[3px] border inline-flex items-center justify-center cursor-pointer transition-colors mx-auto ${
                      row.frontOffice
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-[#141414] text-muted-foreground/40 border-border/60 hover:border-border'
                    }`}
                  >
                    {row.frontOffice && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </button>
                </td>

                {/* Accountant */}
                <td className="py-3.5 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleTogglePermission(idx, 'accountant')}
                    className={`h-5 w-5 rounded-[3px] border inline-flex items-center justify-center cursor-pointer transition-colors mx-auto ${
                      row.accountant
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                        : 'bg-[#141414] text-muted-foreground/40 border-border/60 hover:border-border'
                    }`}
                  >
                    {row.accountant && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </button>
                </td>

                {/* Parent Portal */}
                <td className="py-3.5 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleTogglePermission(idx, 'parent')}
                    className={`h-5 w-5 rounded-[3px] border inline-flex items-center justify-center cursor-pointer transition-colors mx-auto ${
                      row.parent
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        : 'bg-[#141414] text-muted-foreground/40 border-border/60 hover:border-border'
                    }`}
                  >
                    {row.parent && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </VFCard>

      {/* 4. Network Perimeter & Session Governance */}
      <VFCard
        title={
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-[4px] bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
              <Sliders className="h-3.5 w-3.5" />
            </div>
            <span>Network Perimeter & Session Governance</span>
          </div>
        }
        description="Enforce two-factor authentication, customize session auto-timeout, and configure IP CIDR whitelist."
        actions={
          <VFButton
            size="sm"
            variant="outline"
            onClick={() => {
              if (isEditingPolicies) {
                handleSavePolicies();
              } else {
                setIsEditingPolicies(true);
              }
            }}
            className="h-8 px-3 text-xs rounded-[4px]"
          >
            {isEditingPolicies ? 'Save Parameters' : 'Edit Security Parameters'}
          </VFButton>
        }
        className="bg-[#0d0d0d] border-border/90"
        bodyClassName="p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 2FA Policy */}
          <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">Two-Factor Authentication (2FA)</label>
              <VFBadge variant="success" className="text-[10px] font-bold">Active</VFBadge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Mandatory for Super Administrators, Department Heads, and Bursar Accounts on new device logins.
            </p>
            {isEditingPolicies && (
              <div className="pt-2 flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoFactorEnforced}
                    onChange={(e) => setTwoFactorEnforced(e.target.checked)}
                    className="rounded-[2px] border-border bg-[#141414] text-primary"
                  />
                  Enforce 2FA globally
                </label>
              </div>
            )}
          </div>

          {/* Inactivity Auto-Logout */}
          <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">Inactivity Session Timeout</label>
              <span className="font-mono font-bold text-primary text-xs">{sessionTimeout} Minutes</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Automatically terminates idle browser sessions to prevent unauthorized physical terminal access.
            </p>
            {isEditingPolicies && (
              <div className="pt-1">
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#141414] rounded-[2px] appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
                  <span>5m</span>
                  <span>30m</span>
                  <span>60m</span>
                  <span>120m</span>
                </div>
              </div>
            )}
          </div>

          {/* IP Whitelisting Subnet */}
          <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">Campus IP Whitelist Subnet</label>
              <VFBadge variant="outline" className="text-[10px] font-mono">Restricted</VFBadge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Restricts financial fee disbursement and master grade publishing to registered institutional static IPs.
            </p>
            {isEditingPolicies ? (
              <input
                type="text"
                value={whitelistSubnet}
                onChange={(e) => setWhitelistSubnet(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-border rounded-[4px] bg-[#141414] text-foreground font-mono"
              />
            ) : (
              <code className="px-2.5 py-1 rounded-[3px] bg-[#141414] border border-border/60 text-foreground font-mono text-xs block">
                {whitelistSubnet}
              </code>
            )}
          </div>
        </div>
      </VFCard>
    </VFPageContainer>
  );
}
