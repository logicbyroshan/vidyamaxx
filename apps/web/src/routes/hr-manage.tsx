import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFButton,
  VFBadge,
  VFCard,
  VFDialog,
} from '@vidyamaxx/ui';
import {
  ExternalLink,
  Fingerprint,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/hr-manage')({
  component: HRManageOverviewPage,
});

interface StaffMember {
  id: string;
  name: string;
  department: 'Teaching Faculty' | 'Administrative' | 'Transport & Fleet' | 'Security & Housekeeping';
  designation: string;
  shift: string;
  dutyStatus: 'On-Duty' | 'On Leave' | 'Off-Shift';
  avatar: string;
  phone: string;
  punchTime: string;
  workloadHours: number;
}

const STAFF_ROSTER: StaffMember[] = [
  {
    id: 'EMP-T-101',
    name: 'Dr. Alok Verma',
    department: 'Teaching Faculty',
    designation: 'Senior PGT Mathematics & HOD',
    shift: '07:45 AM – 03:00 PM',
    dutyStatus: 'On-Duty',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98111 22334',
    punchTime: '07:42 AM (RFID In)',
    workloadHours: 24,
  },
  {
    id: 'EMP-T-102',
    name: 'Prof. Sunita Rao',
    department: 'Teaching Faculty',
    designation: 'PGT Physics',
    shift: '07:45 AM – 03:00 PM',
    dutyStatus: 'On-Duty',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98222 33445',
    punchTime: '07:48 AM (Biometric In)',
    workloadHours: 22,
  },
  {
    id: 'EMP-A-201',
    name: 'Vikram Joshi',
    department: 'Administrative',
    designation: 'Accounts Officer & Bursar',
    shift: '08:30 AM – 05:00 PM',
    dutyStatus: 'On-Duty',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98333 44556',
    punchTime: '08:24 AM (RFID In)',
    workloadHours: 40,
  },
  {
    id: 'EMP-TR-301',
    name: 'Ramesh Singh',
    department: 'Transport & Fleet',
    designation: 'Senior Bus Captain (Route #01)',
    shift: '06:30 AM – 04:30 PM',
    dutyStatus: 'On-Duty',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98112 34567',
    punchTime: '06:22 AM (Biometric In)',
    workloadHours: 35,
  },
  {
    id: 'EMP-T-105',
    name: 'Meera Iyer',
    department: 'Teaching Faculty',
    designation: 'TGT Computer Science',
    shift: '07:45 AM – 03:00 PM',
    dutyStatus: 'On Leave',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98444 55667',
    punchTime: 'Medical Leave Approved',
    workloadHours: 0,
  },
];

const RECENT_PUNCHES = [
  { name: 'Dr. Alok Verma', type: 'IN', time: '07:42:15 AM', mode: 'RFID Smart Card', status: 'On-Time' },
  { name: 'Prof. Sunita Rao', type: 'IN', time: '07:48:02 AM', mode: 'Biometric Fingerprint', status: 'On-Time' },
  { name: 'Vikram Joshi', type: 'IN', time: '08:24:45 AM', mode: 'RFID Smart Card', status: 'On-Time' },
  { name: 'Kavita Menon', type: 'IN', time: '08:52:10 AM', mode: 'Facial Recognition', status: 'Late (+22m)' },
];

function HRManageOverviewPage() {
  const { addNotification } = useGlobalStore();
  const { lang } = useTranslation();
  const isHindi = lang === 'hi';

  const [selectedDept, setSelectedDept] = React.useState<string>('All');
  const [selectedStaff, setSelectedStaff] = React.useState<StaffMember | null>(null);
  const [currentTime, setCurrentTime] = React.useState<string>(new Date().toLocaleTimeString());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const standalonePort = '8014';
  const standaloneUrl = `http://localhost:${standalonePort}`;

  const handleLaunchHR = (path = '') => {
    const url = `${standaloneUrl}${path}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    addNotification({
      title: isHindi ? 'एचआर पोर्टल ओपन हो रहा है' : 'Opening HR Portal',
      description: isHindi ? 'पोर्ट 8014 पर फैकल्टी रोस्टर व पेरोल पोर्टल पर रिडायरेक्ट किया जा रहा है।' : 'Redirecting to HR portal on port 8014.',
      type: 'info',
    });
  };

  const handleSimulatePunch = () => {
    addNotification({
      title: isHindi ? 'बायोमेट्रिक पंच सफल' : 'Biometric RFID Punch Recorded',
      description: isHindi ? `RFID पंच सफलतापूर्वक दर्ज हुआ: ${currentTime}` : `Live terminal attendance registered at ${currentTime}.`,
      type: 'success',
    });
  };

  const filteredStaff = selectedDept === 'All'
    ? STAFF_ROSTER
    : STAFF_ROSTER.filter((s) => s.department === selectedDept);

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* ── TOP HEADER & LAUNCH BAR ── */}
      <div className="p-3 sm:p-3.5 rounded-[4px] bg-[#141414] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">
              {isHindi ? 'एचआर प्रबंधन & स्टाफ रोस्टर' : 'HR Operations & Faculty Staff Roster'}
            </h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-[#1a1a1a] border border-emerald-500/30 text-emerald-400 text-[10.5px] font-mono font-bold">
              <Fingerprint className="w-3 h-3 text-emerald-400" />
              <span>BIOMETRIC TERMINAL ONLINE</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            {isHindi
              ? 'फैकल्टी अटेंडेंस, बायोमेट्रिक RFID टाइम-क्लॉक, पेरोल वेतन लेजर और स्टाफ लीव मैनेजमेंट।'
              : 'Faculty attendance, real-time biometric RFID time-clock terminal, shift roster & payroll processing.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <VFButton
            size="sm"
            variant="outline"
            onClick={handleSimulatePunch}
            className="rounded-[4px] gap-1.5 text-xs font-bold h-8 cursor-pointer bg-[#141414] hover:border-zinc-700"
          >
            <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isHindi ? 'RFID पंच सिम्युलेट करें' : 'Test RFID Punch'}</span>
          </VFButton>
          <VFButton
            size="sm"
            onClick={() => handleLaunchHR()}
            className="rounded-[4px] gap-1.5 text-xs font-bold h-8 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isHindi ? 'एचआर पोर्टल खोलें' : 'Open HR Portal'}</span>
          </VFButton>
        </div>
      </div>

      {/* ── DEPARTMENT FILTER TABS ── */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border/80 pb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {['All', 'Teaching Faculty', 'Administrative', 'Transport & Fleet'].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1 rounded-[3px] text-xs font-bold transition-all cursor-pointer ${
                selectedDept === dept
                  ? 'bg-[#242424] text-foreground font-bold shadow-xs border border-border/80'
                  : 'bg-[#141414] text-muted-foreground font-semibold hover:text-foreground hover:bg-[#1a1a1a] border border-border/60'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-muted-foreground">
          {filteredStaff.length} {isHindi ? 'कर्मचारी सूचीबद्ध' : 'Staff Members'}
        </span>
      </div>

      {/* ── MAIN WORKSPACE: STAFF ROSTER (LEFT 65%) + LIVE BIOMETRIC TERMINAL (RIGHT 35%) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* ── LEFT: STAFF DIRECTORY ROSTER (8 cols) ── */}
        <div className="lg:col-span-8 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredStaff.map((staff) => (
              <div
                key={staff.id}
                onClick={() => setSelectedStaff(staff)}
                className="p-3.5 rounded-[4px] border border-border/80 bg-[#121212] hover:bg-[#161616] hover:border-zinc-700 transition-all cursor-pointer flex flex-col justify-between group shadow-xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className="w-11 h-11 rounded-[4px] object-cover border border-border/80 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-400 font-bold">{staff.id}</span>
                      <VFBadge
                        variant={staff.dutyStatus === 'On-Duty' ? 'success' : staff.dutyStatus === 'On Leave' ? 'warning' : 'secondary'}
                        className="text-[9.5px]"
                      >
                        {staff.dutyStatus}
                      </VFBadge>
                    </div>
                    <h3 className="text-xs font-bold text-foreground transition-colors truncate">
                      {staff.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground truncate">{staff.designation}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 text-[10.5px] font-mono flex items-center justify-between text-muted-foreground">
                  <span>{staff.shift.split('–')[0].trim()} In</span>
                  <span className="text-emerald-400 font-bold">{staff.punchTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: LIVE BIOMETRIC TERMINAL & CLOCK (4 cols) ── */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Live Terminal Clock */}
          <div className="p-4 rounded-[4px] bg-[#0c1424] border border-blue-500/30 text-center space-y-1.5 shadow-md">
            <p className="text-[10.5px] font-mono font-bold text-blue-400 uppercase tracking-widest">
              CAMPUS BIOMETRIC CLOCK
            </p>
            <p className="text-2xl sm:text-3xl font-black font-mono text-white tracking-widest">
              {currentTime}
            </p>
            <p className="text-[10px] font-mono text-blue-300/80">
              Terminal ID: RFID-GATE-MAIN · Latency: 4ms
            </p>
          </div>

          {/* Live Punch Activity Feed */}
          <VFCard
            title={
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-foreground">
                  {isHindi ? 'लाइव बायोमेट्रिक पंच लॉग्स' : 'Live RFID Punch Feed'}
                </span>
              </div>
            }
            description="Real-time terminal scan feed"
            className="rounded-[4px] border-border/90 bg-[#0d0d0d]"
            headerClassName="py-2.5 px-3.5"
            bodyClassName="p-0"
          >
            <div className="divide-y divide-border/60 text-xs">
              {RECENT_PUNCHES.map((p, i) => (
                <div key={i} className="p-3 space-y-1 hover:bg-[#121212] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-[11.5px]">{p.name}</span>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {p.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10.5px] font-mono text-muted-foreground">
                    <span>{p.mode}</span>
                    <span className="text-foreground">{p.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 border-t border-border/80 bg-[#101010]">
              <button
                onClick={() => handleLaunchHR('/punches')}
                className="w-full py-1.5 rounded-[3px] bg-[#1a1a1a] hover:bg-[#222] border border-border text-center text-xs font-bold text-primary transition-colors cursor-pointer"
              >
                {isHindi ? 'पूरा पंच इतिहास देखें ↗' : 'View Full Punch Audit Logs ↗'}
              </button>
            </div>
          </VFCard>

        </div>
      </div>

      {/* ── STAFF DOSSIER MODAL ── */}
      {selectedStaff && (
        <VFDialog
          isOpen={Boolean(selectedStaff)}
          onClose={() => setSelectedStaff(null)}
          title={`Faculty Profile: ${selectedStaff.name}`}
          description={`${selectedStaff.designation} · ${selectedStaff.department}`}
          footerActions={
            <div className="flex items-center justify-end gap-2 w-full">
              <VFButton variant="outline" size="sm" onClick={() => setSelectedStaff(null)}>
                {isHindi ? 'क्लोज़ करें' : 'Close'}
              </VFButton>
              <VFButton
                size="sm"
                onClick={() => {
                  setSelectedStaff(null);
                  handleLaunchHR(`/staff/${selectedStaff.id}`);
                }}
                className="font-bold"
              >
                {isHindi ? 'एचआर डॉसियर देखें' : 'View Full HR Dossier'}
              </VFButton>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-[4px] bg-[#141414] border border-border flex items-center gap-3">
              <img src={selectedStaff.avatar} alt="Staff" className="w-12 h-12 rounded-[4px] object-cover border border-border" />
              <div>
                <h3 className="font-bold text-sm text-foreground">{selectedStaff.name}</h3>
                <p className="text-muted-foreground text-[11px]">{selectedStaff.designation}</p>
                <p className="text-primary font-mono text-[10.5px]">{selectedStaff.phone}</p>
              </div>
            </div>

            <div className="p-3 rounded-[4px] bg-[#141414] border border-border space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Official Shift:</span>
                <span className="font-mono text-foreground">{selectedStaff.shift}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Today's Punch Status:</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedStaff.punchTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weekly Teaching Workload:</span>
                <span className="font-mono text-foreground font-bold">{selectedStaff.workloadHours} Hours/wk</span>
              </div>
            </div>
          </div>
        </VFDialog>
      )}
    </VFPageContainer>
  );
}
