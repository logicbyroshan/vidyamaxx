import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFButton,
  VFCard,
  VFDialog,
} from '@vidyamaxx/ui';
import {
  ExternalLink,
  Bus,
  MapPin,
  Navigation,
  Gauge,
  ShieldCheck,
  Phone,
  Radio,
  Users,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';
import { LiveTransportMap, MapBusRoute } from '../components/transport/LiveTransportMap';

export const Route = createFileRoute('/transport')({
  component: TransportOverviewPage,
});

const ACTIVE_FLEET: MapBusRoute[] = [
  {
    id: 'BUS-01',
    busNumber: 'DL-01-AB-4012',
    driverName: 'Ramesh Singh',
    driverPhone: '+91 98112 34567',
    routeCode: 'ROUTE-01',
    routeName: 'North Sector & Model Town Express',
    hindiName: 'नॉर्थ सेक्टर & मॉडल टाउन एक्सप्रेस',
    capacity: '42 Seater (Tata Starbus Ultra)',
    boardedStudents: 38,
    totalStudents: 42,
    currentSpeed: 44,
    nextStop: 'Model Town Metro Gate #2',
    etaNextStop: '08:12 AM (3 mins)',
    fuelLevel: 82,
    status: 'In Transit',
    currentLat: 28.7015,
    currentLng: 77.1990,
    heading: 45,
    color: '#F59E0B',
    stops: [
      { name: 'Ashok Vihar Block C', time: '07:45 AM', count: 12, completed: true, lat: 28.6980, lng: 77.1820 },
      { name: 'Model Town Metro Gate #2', time: '08:05 AM', count: 16, completed: true, lat: 28.7030, lng: 77.1940 },
      { name: 'GTB Nagar Crossing', time: '08:15 AM', count: 10, completed: false, lat: 28.6990, lng: 77.2060 },
      { name: 'Main VidyaMaxx Campus', time: '08:35 AM', count: 0, completed: false, lat: 28.6925, lng: 77.2090 },
    ],
  },
  {
    id: 'BUS-02',
    busNumber: 'DL-01-CD-8891',
    driverName: 'Jaswant Gill',
    driverPhone: '+91 98723 45678',
    routeCode: 'ROUTE-02',
    routeName: 'Civil Lines & University Hub',
    hindiName: 'सिविल लाइन्स & यूनिवर्सिटी हब',
    capacity: '36 Seater (Ashok Leyland)',
    boardedStudents: 34,
    totalStudents: 36,
    currentSpeed: 38,
    nextStop: 'St. Stephen Crossing',
    etaNextStop: '08:15 AM (5 mins)',
    fuelLevel: 68,
    status: 'In Transit',
    currentLat: 28.6875,
    currentLng: 77.2120,
    heading: 90,
    color: '#3B82F6',
    stops: [
      { name: 'Civil Lines Enclave', time: '07:40 AM', count: 14, completed: true, lat: 28.6810, lng: 77.2250 },
      { name: 'St. Stephen Crossing', time: '08:00 AM', count: 12, completed: true, lat: 28.6860, lng: 77.2180 },
      { name: 'Kamla Nagar Market', time: '08:18 AM', count: 8, completed: false, lat: 28.6890, lng: 77.2020 },
      { name: 'Main VidyaMaxx Campus', time: '08:35 AM', count: 0, completed: false, lat: 28.6925, lng: 77.2090 },
    ],
  },
  {
    id: 'BUS-03',
    busNumber: 'DL-01-EF-2234',
    driverName: 'Satish Kumar',
    driverPhone: '+91 99104 56789',
    routeCode: 'ROUTE-03',
    routeName: 'Green Park & Ring Road Enclave',
    hindiName: 'ग्रीन पार्क & रिंग रोड एन्क्लेव',
    capacity: '44 Seater (Eicher Skyline)',
    boardedStudents: 41,
    totalStudents: 44,
    currentSpeed: 0,
    nextStop: 'Green Park Market Stop #4',
    etaNextStop: 'At Stop (Boarding)',
    fuelLevel: 91,
    status: 'At Stop',
    currentLat: 28.6730,
    currentLng: 77.1980,
    heading: 180,
    color: '#10B981',
    stops: [
      { name: 'Hauz Khas Enclave', time: '07:35 AM', count: 18, completed: true, lat: 28.6650, lng: 77.1900 },
      { name: 'Green Park Market Stop #4', time: '07:55 AM', count: 15, completed: false, lat: 28.6730, lng: 77.1980 },
      { name: 'AIIMS Flyover Circle', time: '08:12 AM', count: 8, completed: false, lat: 28.6820, lng: 77.2030 },
      { name: 'Main VidyaMaxx Campus', time: '08:35 AM', count: 0, completed: false, lat: 28.6925, lng: 77.2090 },
    ],
  },
  {
    id: 'BUS-04',
    busNumber: 'DL-01-GH-6710',
    driverName: 'Devendra Pal',
    driverPhone: '+91 98188 90123',
    routeCode: 'ROUTE-04',
    routeName: 'Cantt Railway & Defence Enclave',
    hindiName: 'कैंट रेलवे & डिफेंस एन्क्लेव',
    capacity: '40 Seater (Tata Starbus)',
    boardedStudents: 36,
    totalStudents: 40,
    currentSpeed: 42,
    nextStop: 'Dhaula Kuan Junction',
    etaNextStop: '08:18 AM (6 mins)',
    fuelLevel: 75,
    status: 'In Transit',
    currentLat: 28.6865,
    currentLng: 77.1880,
    heading: 270,
    color: '#8B5CF6',
    stops: [
      { name: 'Delhi Cantt Station Road', time: '07:30 AM', count: 15, completed: true, lat: 28.6800, lng: 77.1700 },
      { name: 'Defence Officers Colony', time: '07:50 AM', count: 14, completed: true, lat: 28.6850, lng: 77.1820 },
      { name: 'Dhaula Kuan Junction', time: '08:10 AM', count: 7, completed: false, lat: 28.6890, lng: 77.1950 },
      { name: 'Main VidyaMaxx Campus', time: '08:35 AM', count: 0, completed: false, lat: 28.6925, lng: 77.2090 },
    ],
  },
];

function TransportOverviewPage() {
  const { addNotification } = useGlobalStore();
  const { lang } = useTranslation();
  const isHindi = lang === 'hi';

  const [selectedRoute, setSelectedRoute] = React.useState<MapBusRoute>(ACTIVE_FLEET[0]);
  const [selectedForModal, setSelectedForModal] = React.useState<MapBusRoute | null>(null);

  const standalonePort = '8010';
  const standaloneUrl = `http://localhost:${standalonePort}`;

  const handleLaunchTransport = (path = '') => {
    const url = `${standaloneUrl}${path}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    addNotification({
      title: isHindi ? 'ट्रांसपोर्ट पोर्टल ओपन हो रहा है' : 'Opening Transport Portal',
      description: isHindi ? 'पोर्ट 8010 पर लाइव टेलीमैटिक्स पोर्टल पर रिडायरेक्ट किया जा रहा है।' : 'Redirecting to live telematics portal on port 8010.',
      type: 'info',
    });
  };

  const totalBoarded = ACTIVE_FLEET.reduce((acc, b) => acc + b.boardedStudents, 0);
  const totalCapacity = ACTIVE_FLEET.reduce((acc, b) => acc + b.totalStudents, 0);

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* ── TOP HEADER & LAUNCH BAR ── */}
      <div className="p-3 sm:p-3.5 rounded-[4px] bg-[#141414] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">
              {isHindi ? 'ट्रांसपोर्ट फ्लीट & लाइव टेलीमैटिक्स' : 'Transport Fleet & Live Telematics'}
            </h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-[#1a1a1a] border border-emerald-500/30 text-emerald-400 text-[10.5px] font-mono font-bold">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span>ALL 4 BUSES ON ROAD · GPS LIVE</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            {isHindi
              ? 'लाइव GPS बस टेलीमैटिक्स, स्टूडेंट RFID बोर्डिंग लॉग्स, रूट मैप और ड्राइवर रोस्टर।'
              : 'Live GPS bus telemetry, real-time student RFID boarding logs, speed governors & safety telemetry.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <VFButton
            size="sm"
            variant="outline"
            onClick={() => handleLaunchTransport('/map')}
            className="rounded-[4px] gap-1.5 text-xs font-bold h-8 cursor-pointer bg-[#141414] hover:border-zinc-700"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isHindi ? 'लाइव मैप ट्रैकिंग' : 'Live Fleet Map'}</span>
          </VFButton>
          <VFButton
            size="sm"
            onClick={() => handleLaunchTransport()}
            className="rounded-[4px] gap-1.5 text-xs font-bold h-8 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isHindi ? 'ट्रांसपोर्ट पोर्टल लॉन्च करें' : 'Open Transport Hub'}</span>
          </VFButton>
        </div>
      </div>

      {/* ── TELEMETRY HUD KPI CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 sm:p-3.5 rounded-[4px] bg-[#141414] border border-border/80 hover:border-zinc-700 transition-colors flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-[4px] bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Bus className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-muted-foreground uppercase">{isHindi ? 'सक्रिय बसें' : 'Active Fleet'}</p>
            <p className="text-base sm:text-lg font-black text-foreground font-mono truncate">4 / 4 on Route</p>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-[4px] bg-[#141414] border border-border/80 hover:border-zinc-700 transition-colors flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-[4px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-muted-foreground uppercase">{isHindi ? 'स्टूडेंट्स बोर्डेड' : 'Boarded RFID'}</p>
            <p className="text-base sm:text-lg font-black text-foreground font-mono truncate">{totalBoarded} / {totalCapacity}</p>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-[4px] bg-[#141414] border border-border/80 hover:border-zinc-700 transition-colors flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-[4px] bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Gauge className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-muted-foreground uppercase">{isHindi ? 'औसत स्पीड' : 'Fleet Speed'}</p>
            <p className="text-base sm:text-lg font-black text-foreground font-mono truncate">41.2 km/h (Safe)</p>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-[4px] bg-[#141414] border border-border/80 hover:border-zinc-700 transition-colors flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-[4px] bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-muted-foreground uppercase">{isHindi ? 'सेफ्टी अपटाइम' : 'Safety Radar'}</p>
            <p className="text-base sm:text-lg font-black text-foreground font-mono truncate">100% (No SOS)</p>
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE: INTERACTIVE LIVE GPS FLEET MAP (LEFT 65%) + ACTIVE ROUTE DETAILS & STOPS (RIGHT 35%) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* ── LEFT: INTERACTIVE GPS MAP COMPONENT (8 cols) ── */}
        <div className="lg:col-span-8 flex flex-col rounded-[4px] border border-border/90 bg-[#080808] shadow-md overflow-hidden">
          
          {/* Map Header Controls & Route Switcher */}
          <div className="p-2.5 px-3.5 bg-[#121212] border-b border-border flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="font-bold text-foreground">Interactive Campus Geo-Fencing Map</span>
              <span className="text-zinc-600">·</span>
              <span className="text-emerald-400 font-bold">GPS Polling Rate: 2.5s</span>
            </div>

            <div className="flex items-center gap-1.5">
              {ACTIVE_FLEET.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedRoute(b)}
                  className={`px-2.5 py-0.5 rounded-[3px] text-[10.5px] font-mono font-bold cursor-pointer transition-colors ${
                    selectedRoute.id === b.id
                      ? 'bg-primary text-white ring-1 ring-white/20'
                      : 'bg-[#1a1a1a] text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {b.routeCode}
                </button>
              ))}
            </div>
          </div>

          {/* Integrated Real Tile Map with School Bus Vector */}
          <LiveTransportMap
            fleet={ACTIVE_FLEET}
            selectedRoute={selectedRoute}
            onSelectRoute={(r) => setSelectedRoute(r)}
            isHindi={isHindi}
          />

          {/* Driver & Telematics Quick Bar */}
          <div className="p-3 bg-[#121212] border-t border-border flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[4px] bg-[#1e1e1e] border border-border flex items-center justify-center font-bold text-primary font-mono text-xs">
                {selectedRoute.driverName.split(' ')[0][0]}{selectedRoute.driverName.split(' ')[1]?.[0] || ''}
              </div>
              <div>
                <p className="font-bold text-foreground text-xs leading-tight">{selectedRoute.driverName}</p>
                <p className="text-[10.5px] font-mono text-muted-foreground">{selectedRoute.driverPhone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${selectedRoute.driverPhone}`}
                className="px-2.5 py-1 rounded-[3px] bg-[#1a1a1a] hover:bg-[#252525] border border-border text-xs font-bold text-foreground flex items-center gap-1 transition-colors"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>{isHindi ? 'ड्राइवर को कॉल करें' : 'Call Driver'}</span>
              </a>
              <VFButton
                size="sm"
                onClick={() => setSelectedForModal(selectedRoute)}
                className="h-7 text-xs font-bold rounded-[3px]"
              >
                {isHindi ? 'रूट डोजियर देखें' : 'View Route Dossier'}
              </VFButton>
            </div>
          </div>
        </div>

        {/* ── RIGHT: ROUTE CHECKPOINTS & STOP TIMELINE (4 cols) ── */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Route Checkpoint Timeline */}
          <VFCard
            title={
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  {isHindi ? 'रूट चेकपॉइंट टाइमलाइन' : 'Live Route Checkpoints'}
                </span>
              </div>
            }
            description={`${selectedRoute.routeCode} · Next: ${selectedRoute.nextStop}`}
            className="rounded-[4px] border-border/90 bg-[#0d0d0d]"
            headerClassName="py-2.5 px-3.5"
            bodyClassName="p-3.5 space-y-3"
          >
            <div className="space-y-3 text-xs">
              {selectedRoute.stops.map((stop, i) => (
                <div key={i} className="flex items-start gap-2.5 relative">
                  {/* Timeline bullet */}
                  <div className="flex flex-col items-center shrink-0 mt-0.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      stop.completed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-600'
                    }`}>
                      {stop.completed ? '✓' : i + 1}
                    </div>
                    {i < selectedRoute.stops.length - 1 && (
                      <div className={`w-0.5 h-6 mt-1 ${stop.completed ? 'bg-emerald-500/40' : 'bg-zinc-800'}`} />
                    )}
                  </div>

                  {/* Stop detail */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-bold text-[11.5px] truncate ${stop.completed ? 'text-zinc-400 line-through' : 'text-foreground'}`}>
                        {stop.name}
                      </p>
                      <span className="font-mono text-[10px] text-muted-foreground">{stop.time}</span>
                    </div>
                    {stop.count > 0 && (
                      <p className="text-[10px] font-mono text-primary mt-0.5">
                        {stop.count} {isHindi ? 'स्टूडेंट्स बोर्डिंग' : 'Students Boarding'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded bg-[#141414] border border-border/80 flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">{isHindi ? 'बोर्डिंग प्रोग्रेस:' : 'Boarding Progress:'}</span>
              <span className="font-bold text-emerald-400">{selectedRoute.boardedStudents} / {selectedRoute.totalStudents} (90%)</span>
            </div>
          </VFCard>

          {/* RTO Safety & Compliance Box */}
          <VFCard
            title={
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-foreground">
                  {isHindi ? 'RTO व्हीकल कंप्लायंस लेजर' : 'RTO Safety & Compliance'}
                </span>
              </div>
            }
            className="rounded-[4px] border-border/90 bg-[#0d0d0d]"
            headerClassName="py-2.5 px-3.5"
            bodyClassName="p-3 space-y-2 text-xs"
          >
            <div className="flex justify-between py-1 border-b border-border/60">
              <span className="text-muted-foreground">Speed Governor:</span>
              <span className="font-bold text-emerald-400 font-mono">Locked 50 km/h</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/60">
              <span className="text-muted-foreground">CCTV In-Cabin:</span>
              <span className="font-bold text-emerald-400 font-mono">Live Recording</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">PUC Emission:</span>
              <span className="font-bold text-foreground font-mono">Valid thru Dec 2026</span>
            </div>
          </VFCard>

        </div>
      </div>

      {/* ── ROUTE DOSSIER MODAL ── */}
      {selectedForModal && (
        <VFDialog
          isOpen={Boolean(selectedForModal)}
          onClose={() => setSelectedForModal(null)}
          title={isHindi ? selectedForModal.hindiName : selectedForModal.routeName}
          description={`${selectedForModal.busNumber} · Driver: ${selectedForModal.driverName}`}
          footerActions={
            <div className="flex items-center justify-end gap-2 w-full">
              <VFButton variant="outline" size="sm" onClick={() => setSelectedForModal(null)}>
                {isHindi ? 'क्लोज़ करें' : 'Close'}
              </VFButton>
              <VFButton
                size="sm"
                onClick={() => handleLaunchTransport(`/route/${selectedForModal.id}`)}
                className="font-bold"
                leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                {isHindi ? 'लाइव मैप पर देखें' : 'View Full Telematics Map'}
              </VFButton>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-[4px] bg-[#141414] border border-border space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground block text-[10px]">DRIVER MOBILE:</span>
                  <span className="font-mono font-bold text-foreground">{selectedForModal.driverPhone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">VEHICLE CAPACITY:</span>
                  <span className="font-mono font-bold text-foreground">{selectedForModal.capacity}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">NEXT CHECKPOINT:</span>
                  <span className="font-bold text-primary">{selectedForModal.nextStop}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">TELEMETRY SPEED:</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedForModal.currentSpeed} km/h (Live GPS)</span>
                </div>
              </div>
            </div>
          </div>
        </VFDialog>
      )}
    </VFPageContainer>
  );
}
