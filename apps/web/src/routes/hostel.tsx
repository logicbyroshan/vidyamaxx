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
  Bed,
  UtensilsCrossed,
  ShieldCheck,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/hostel')({
  component: HostelOverviewPage,
});

interface RoomBed {
  roomNo: string;
  bedId: string;
  residentName: string | null;
  residentRoll: string | null;
  avatar: string | null;
  status: 'Occupied' | 'Vacant' | 'Maintenance';
}

const WINGS = [
  { id: 'aravali', name: 'Aravali Wing (Boys Dormitory)', hindiName: 'अरावली विंग (बॉयज हॉस्टल)', floors: 3, totalRooms: 24, occupied: 68, capacity: 72 },
  { id: 'nilgiri', name: 'Nilgiri Wing (Girls Dormitory)', hindiName: 'नीलगिरी विंग (गर्ल्स हॉस्टल)', floors: 3, totalRooms: 20, occupied: 56, capacity: 60 },
  { id: 'shivalik', name: 'Shivalik Wing (Senior Block)', hindiName: 'शिवालिक विंग (सीनियर ब्लॉक)', floors: 2, totalRooms: 16, occupied: 30, capacity: 32 },
];

const SAMPLE_FLOOR_BEDS: RoomBed[] = [
  { roomNo: 'Room 101', bedId: '101-A', residentName: 'Aarav Sharma', residentRoll: '10-A · #18', avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80', status: 'Occupied' },
  { roomNo: 'Room 101', bedId: '101-B', residentName: 'Rohan Deshmukh', residentRoll: '9-B · #31', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', status: 'Occupied' },
  { roomNo: 'Room 101', bedId: '101-C', residentName: null, residentRoll: null, avatar: null, status: 'Vacant' },
  { roomNo: 'Room 102', bedId: '102-A', residentName: 'Amit Patel', residentRoll: '8-A · #29', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', status: 'Occupied' },
  { roomNo: 'Room 102', bedId: '102-B', residentName: 'Vikramaditya Roy', residentRoll: '10-B · #22', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Occupied' },
  { roomNo: 'Room 102', bedId: '102-C', residentName: null, residentRoll: null, avatar: null, status: 'Maintenance' },
  { roomNo: 'Room 103', bedId: '103-A', residentName: 'Aditya Verma', residentRoll: '10-A · #09', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Occupied' },
  { roomNo: 'Room 103', bedId: '103-B', residentName: null, residentRoll: null, avatar: null, status: 'Vacant' },
  { roomNo: 'Room 103', bedId: '103-C', residentName: 'Arjun Rao', residentRoll: '8-B · #24', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', status: 'Occupied' },
];

const MESS_MENU_TODAY = [
  { meal: 'Breakfast', time: '07:30 – 08:30 AM', items: 'Aloo Pyaaz Paratha, Fresh Curd, Mixed Pickle, Sprouts & Masala Chai', type: 'Pure Veg', calories: '540 kcal' },
  { meal: 'Lunch', time: '12:30 – 02:00 PM', items: 'Shahi Paneer, Dal Tadka, Jeera Rice, Tandoori Roti, Green Salad & Gulab Jamun', type: 'Pure Veg', calories: '780 kcal' },
  { meal: 'Evening Snacks', time: '05:00 – 06:00 PM', items: 'Crispy Veg Samosa, Mint Chutney & Filter Coffee / Milk', type: 'Pure Veg', calories: '320 kcal' },
  { meal: 'Dinner', time: '08:00 – 09:30 PM', items: 'Rajma Masala, Steamed Basmati Rice, Chapati, Boondi Raita & Seasonal Fruit', type: 'Pure Veg', calories: '690 kcal' },
];

const GATE_OUTPASSES = [
  {
    passId: 'PASS-2026-901',
    student: 'Aarav Sharma (Room 101-A)',
    destination: 'Weekend Home Visit (Green Park)',
    departure: 'Today, 04:30 PM',
    expectedReturn: 'Sunday, 07:00 PM',
    status: 'Approved by Parent (OTP Verified)',
    wardenStatus: 'Active',
  },
  {
    passId: 'PASS-2026-902',
    student: 'Rohan Deshmukh (Room 101-B)',
    destination: 'Dental Appointment (Civil Hospital)',
    departure: 'Today, 02:00 PM',
    expectedReturn: 'Today, 05:30 PM',
    status: 'Medical Verified',
    wardenStatus: 'Departed',
  },
  {
    passId: 'PASS-2026-903',
    student: 'Priya Patel (Nilgiri Wing 204)',
    destination: 'Coaching Classes (South Ext)',
    departure: 'Tomorrow, 06:00 AM',
    expectedReturn: 'Tomorrow, 09:30 AM',
    status: 'Standing Pass',
    wardenStatus: 'Scheduled',
  },
];

function HostelOverviewPage() {
  const { addNotification } = useGlobalStore();
  const { lang } = useTranslation();
  const isHindi = lang === 'hi';

  const [activeWing, setActiveWing] = React.useState<string>('aravali');
  const [selectedFloor, setSelectedFloor] = React.useState<number>(1);
  const [selectedBed, setSelectedBed] = React.useState<RoomBed | null>(null);

  const standalonePort = '8013';
  const standaloneUrl = `http://localhost:${standalonePort}`;

  const handleLaunchHostel = (path = '') => {
    const url = `${standaloneUrl}${path}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    addNotification({
      title: isHindi ? 'हॉस्टल पोर्टल ओपन हो रहा है' : 'Opening Hostel Portal',
      description: isHindi ? 'पोर्ट 8013 पर रेसिडेंशियल मैनेजमेंट पर रिडायरेक्ट किया जा रहा है।' : 'Redirecting to residential portal on port 8013.',
      type: 'info',
    });
  };

  const currentWingData = WINGS.find((w) => w.id === activeWing) || WINGS[0];

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* ── TOP HEADER & LAUNCH BAR ── */}
      <div className="p-3 sm:p-3.5 rounded-[4px] bg-[#141414] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">
              {isHindi ? 'छात्रावास प्रबंधन & मेस ऑपरेशंस' : 'Hostel Management & Residential Life'}
            </h1>
            <VFBadge variant="outline" className="text-[10.5px] font-mono font-bold bg-[#1a1a1a] text-emerald-400 border-emerald-500/30">
              Occupancy: 94.2% · Port: {standalonePort}
            </VFBadge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            {isHindi
              ? 'डोरमेट्री बेड आवंटन, फ्लोर मैप, दैनिक मेस मेनू और डिजिटल गेट आउटपास ट्रैकिंग।'
              : 'Interactive floor bed allocation, dormitory occupancy radar, daily mess nutrition & digital gate outpass.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <VFButton
            size="sm"
            variant="outline"
            onClick={() => handleLaunchHostel('/outpass')}
            className="rounded-[4px] gap-1.5 text-xs font-bold h-8 cursor-pointer bg-[#141414] hover:border-zinc-700"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isHindi ? 'गेट आउटपास स्कैनर' : 'Gate Outpass Scanner'}</span>
          </VFButton>
          <VFButton
            size="sm"
            onClick={() => handleLaunchHostel()}
            className="rounded-[4px] gap-1.5 text-xs font-bold h-8 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isHindi ? 'हॉस्टल पोर्टल खोलें' : 'Open Hostel Hub'}</span>
          </VFButton>
        </div>
      </div>

      {/* ── WING SELECTOR CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {WINGS.map((wing) => {
          const isSelected = activeWing === wing.id;
          return (
            <button
              key={wing.id}
              onClick={() => setActiveWing(wing.id)}
              className={`p-3.5 rounded-[4px] border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'bg-[#1c1c1c] border-zinc-500 shadow-xs'
                  : 'bg-[#141414] border-border/80 hover:bg-[#181818] hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className={`text-xs font-extrabold ${isSelected ? 'text-foreground' : 'text-foreground/90'}`}>
                  {isHindi ? wing.hindiName : wing.name}
                </span>
                <span className="text-[10.5px] font-mono font-bold text-emerald-400">
                  {wing.occupied} / {wing.capacity} Beds
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#1e1e1e] rounded-[2px] h-1.5 overflow-hidden mt-2">
                <div
                  className="bg-emerald-500 h-full rounded-[2px]"
                  style={{ width: `${(wing.occupied / wing.capacity) * 100}%` }}
                />
              </div>

              <div className="mt-2 text-[10.5px] font-mono text-muted-foreground flex justify-between">
                <span>{wing.floors} Floors · {wing.totalRooms} Rooms</span>
                <span className="text-muted-foreground group-hover:text-foreground font-bold transition-colors">Floorplan ↗</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── MAIN WORKSPACE: FLOOR BED GRID (LEFT 65%) + MESS MENU & OUTPASSES (RIGHT 35%) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* ── LEFT: INTERACTIVE FLOOR BED GRID (8 cols) ── */}
        <div className="lg:col-span-8 flex flex-col rounded-[4px] border border-border/80 bg-[#121212] shadow-xs overflow-hidden">
          
          {/* Floor Bar & Legend */}
          <div className="p-3 bg-[#141414] border-b border-border flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground font-mono">Floor Level:</span>
              {[1, 2, 3].map((fl) => (
                <button
                  key={fl}
                  onClick={() => setSelectedFloor(fl)}
                  className={`px-2.5 py-1 rounded-[3px] text-xs font-mono font-bold cursor-pointer transition-colors ${
                    selectedFloor === fl ? 'bg-[#242424] text-foreground border border-border/80' : 'bg-[#181818] text-muted-foreground hover:text-foreground hover:bg-[#202020]'
                  }`}
                >
                  Floor {fl}
                </button>
              ))}
            </div>

            {/* Bed Status Legend */}
            <div className="flex items-center gap-3 font-mono text-[10.5px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-[2px] bg-emerald-500" /> Occupied
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-2 h-2 rounded-[2px] bg-blue-500" /> Vacant
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-[2px] bg-amber-500" /> Maintenance
              </span>
            </div>
          </div>

          {/* Interactive Room Bed Matrix */}
          <div className="p-4 sm:p-5 bg-[#0a0a0a] space-y-4 min-h-[380px]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {['Room 101', 'Room 102', 'Room 103'].map((roomName) => {
                const roomBeds = SAMPLE_FLOOR_BEDS.filter((b) => b.roomNo === roomName);
                return (
                  <div
                    key={roomName}
                    className="p-3 rounded-[4px] border border-border/80 bg-[#121212] space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                      <span className="font-extrabold text-xs text-foreground font-mono">{roomName}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">3-Seater</span>
                    </div>

                    <div className="space-y-2">
                      {roomBeds.map((bed) => (
                        <div
                          key={bed.bedId}
                          onClick={() => bed.status === 'Occupied' && setSelectedBed(bed)}
                          className={`p-2 rounded-[3px] border flex items-center justify-between gap-2 transition-all ${
                            bed.status === 'Occupied'
                              ? 'bg-[#161e16] border-emerald-500/30 hover:border-emerald-400 cursor-pointer'
                              : bed.status === 'Vacant'
                              ? 'bg-[#0f172a] border-blue-500/30'
                              : 'bg-[#1c1917] border-amber-500/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {bed.avatar ? (
                              <img src={bed.avatar} alt="Resident" className="w-6 h-6 rounded-full object-cover shrink-0 border border-emerald-500/40" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                                <Bed className="w-3 h-3 text-muted-foreground" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-foreground truncate leading-tight">
                                {bed.residentName || (bed.status === 'Vacant' ? 'Vacant Bed' : 'Under Maintenance')}
                              </p>
                              <span className="text-[9.5px] font-mono text-muted-foreground">
                                {bed.residentRoll || bed.bedId}
                              </span>
                            </div>
                          </div>

                          <VFBadge
                            variant={bed.status === 'Occupied' ? 'success' : bed.status === 'Vacant' ? 'primary' : 'warning'}
                            className="text-[9px] font-mono"
                          >
                            {bed.bedId.split('-')[1]}
                          </VFBadge>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT: MESS DINING SCHEDULE & GATE OUTPASS (4 cols) ── */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Today's Mess Menu Card */}
          <VFCard
            title={
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-foreground">
                  {isHindi ? 'आज का मेस मेनू' : 'Today’s Mess Dining Menu'}
                </span>
              </div>
            }
            description="Pure Vegetarian · Nutrition Checked"
            className="rounded-[4px] border-border/90 bg-[#0d0d0d]"
            headerClassName="py-2.5 px-3.5"
            bodyClassName="p-0"
          >
            <div className="divide-y divide-border/60 text-xs">
              {MESS_MENU_TODAY.map((m, idx) => (
                <div key={idx} className="p-3 space-y-1 hover:bg-[#121212] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-foreground text-[11.5px]">{m.meal}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{m.time}</span>
                  </div>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">{m.items}</p>
                  <div className="flex items-center justify-between text-[9.5px] font-mono text-zinc-500 pt-0.5">
                    <span>{m.type}</span>
                    <span className="text-amber-400 font-bold">{m.calories}</span>
                  </div>
                </div>
              ))}
            </div>
          </VFCard>

          {/* Active Gate Outpass Verification */}
          <VFCard
            title={
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  {isHindi ? 'सक्रिय गेट आउटपास' : 'Active Gate Outpasses'}
                </span>
              </div>
            }
            className="rounded-[4px] border-border/90 bg-[#0d0d0d]"
            headerClassName="py-2.5 px-3.5"
            bodyClassName="p-0"
          >
            <div className="divide-y divide-border/60 text-xs">
              {GATE_OUTPASSES.map((pass) => (
                <div key={pass.passId} className="p-3 space-y-1 hover:bg-[#121212] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-primary text-[10.5px]">{pass.passId}</span>
                    <VFBadge variant={pass.wardenStatus === 'Departed' ? 'warning' : 'success'} className="text-[9.5px]">
                      {pass.wardenStatus}
                    </VFBadge>
                  </div>
                  <p className="font-bold text-foreground text-[11.5px]">{pass.student}</p>
                  <p className="text-muted-foreground text-[10.5px]">{pass.destination}</p>
                  <p className="text-[9.5px] font-mono text-emerald-400">{pass.status}</p>
                </div>
              ))}
            </div>
          </VFCard>

        </div>
      </div>

      {/* ── RESIDENT DETAIL MODAL ── */}
      {selectedBed && (
        <VFDialog
          isOpen={Boolean(selectedBed)}
          onClose={() => setSelectedBed(null)}
          title={`Resident Profile: ${selectedBed.residentName}`}
          description={`Bed Slot: ${selectedBed.bedId} · ${currentWingData.name}`}
          footerActions={
            <div className="flex items-center justify-end gap-2 w-full">
              <VFButton variant="outline" size="sm" onClick={() => setSelectedBed(null)}>
                {isHindi ? 'क्लोज़ करें' : 'Close'}
              </VFButton>
              <VFButton
                size="sm"
                onClick={() => {
                  setSelectedBed(null);
                  handleLaunchHostel(`/student/${selectedBed.bedId}`);
                }}
                className="font-bold"
              >
                {isHindi ? 'हॉस्टल डॉसियर देखें' : 'View Full Dossier'}
              </VFButton>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-[4px] bg-[#141414] border border-border flex items-center gap-3">
              <img src={selectedBed.avatar || ''} alt="Student" className="w-12 h-12 rounded-[4px] object-cover border border-border/80 shadow-xs" />
              <div>
                <h3 className="font-extrabold text-sm text-foreground">{selectedBed.residentName}</h3>
                <p className="text-muted-foreground font-mono text-[11px]">{selectedBed.residentRoll}</p>
                <span className="text-emerald-400 font-mono text-[10px] font-bold">Curfew: In Campus (Night Check OK)</span>
              </div>
            </div>
          </div>
        </VFDialog>
      )}
    </VFPageContainer>
  );
}
