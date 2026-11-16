import * as React from 'react';
import {
  Plus,
  Minus,
  Navigation,
  Layers,
  Crosshair,
  Gauge,
  Fuel,
} from 'lucide-react';

export interface BusStop {
  name: string;
  time: string;
  count: number;
  completed: boolean;
  lat: number;
  lng: number;
}

export interface MapBusRoute {
  id: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  routeCode: string;
  routeName: string;
  hindiName: string;
  capacity: string;
  boardedStudents: number;
  totalStudents: number;
  currentSpeed: number;
  nextStop: string;
  etaNextStop: string;
  fuelLevel: number;
  status: 'In Transit' | 'At Stop' | 'Completed';
  currentLat: number;
  currentLng: number;
  heading: number;
  color: string;
  stops: BusStop[];
}

// VidyaFloww Central Campus Landmark Coordinates
export const CAMPUS_COORDS = {
  lat: 28.6925,
  lng: 77.2090,
  name: 'VidyaFloww Central Campus',
};

// Tile Providers
const TILE_PROVIDERS = {
  dark: {
    name: 'Dark Matter',
    url: (z: number, x: number, y: number) =>
      `https://a.basemaps.cartocdn.com/rastertiles/dark_all/${z}/${x}/${y}.png`,
    bg: '#090d16',
    attribution: '© OpenStreetMap · © CARTO',
  },
  osm: {
    name: 'OpenStreetMap',
    url: (z: number, x: number, y: number) =>
      `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
    bg: '#e5e7eb',
    attribution: '© OpenStreetMap contributors',
  },
  voyager: {
    name: 'Clean Street',
    url: (z: number, x: number, y: number) =>
      `https://a.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}.png`,
    bg: '#f3f4f6',
    attribution: '© OpenStreetMap · © CARTO',
  },
};

// Web Mercator Projections
function latLngToWorld(lat: number, lng: number, zoom: number) {
  const siny = Math.sin((lat * Math.PI) / 180);
  const clampedSiny = Math.min(Math.max(siny, -0.9999), 0.9999);
  const scale = 256 * Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * scale;
  const y = (0.5 - Math.log((1 + clampedSiny) / (1 - clampedSiny)) / (4 * Math.PI)) * scale;
  return { x, y };
}

interface LiveTransportMapProps {
  fleet: MapBusRoute[];
  selectedRoute: MapBusRoute;
  onSelectRoute: (route: MapBusRoute) => void;
  isHindi?: boolean;
}

export function LiveTransportMap({
  fleet,
  selectedRoute,
  onSelectRoute,
}: LiveTransportMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = React.useState<number>(14);
  const [mapCenter, setMapCenter] = React.useState<{ lat: number; lng: number }>({
    lat: selectedRoute.currentLat,
    lng: selectedRoute.currentLng,
  });
  const [panOffset, setPanOffset] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tileMode, setTileMode] = React.useState<'dark' | 'osm' | 'voyager'>('dark');
  const [showLayerMenu, setShowLayerMenu] = React.useState(false);
  const [containerSize, setContainerSize] = React.useState<{ width: number; height: number }>({
    width: 800,
    height: 480,
  });

  // Simulated live GPS coordinate micro-movements
  const [liveFleet, setLiveFleet] = React.useState<MapBusRoute[]>(fleet);

  React.useEffect(() => {
    setLiveFleet(fleet);
  }, [fleet]);

  // Live GPS simulation loop
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveFleet((prev) =>
        prev.map((b) => {
          if (b.status === 'At Stop') {
            return {
              ...b,
              currentSpeed: 0,
            };
          }
          // Slight jitter/movement towards campus
          const dLat = (CAMPUS_COORDS.lat - b.currentLat) * 0.015;
          const dLng = (CAMPUS_COORDS.lng - b.currentLng) * 0.015;
          const speedJitter = Math.floor(Math.random() * 5) - 2;
          const nextSpeed = Math.max(28, Math.min(52, b.currentSpeed + speedJitter));

          return {
            ...b,
            currentLat: b.currentLat + dLat * (0.05 + Math.random() * 0.05),
            currentLng: b.currentLng + dLng * (0.05 + Math.random() * 0.05),
            currentSpeed: nextSpeed,
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Update container size on resize
  React.useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerSize({ width: clientWidth, height: clientHeight });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, [data-interactive="true"]')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 16));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 11));
  };

  const handleRecenterCampus = () => {
    setMapCenter(CAMPUS_COORDS);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleFocusBus = (bus: MapBusRoute) => {
    onSelectRoute(bus);
    setMapCenter({ lat: bus.currentLat, lng: bus.currentLng });
    setPanOffset({ x: 0, y: 0 });
  };

  // Convert GPS (lat, lng) to pixel coords relative to container
  const centerWorld = latLngToWorld(mapCenter.lat, mapCenter.lng, zoom);
  const halfW = containerSize.width / 2;
  const halfH = containerSize.height / 2;

  const getScreenCoords = (lat: number, lng: number) => {
    const point = latLngToWorld(lat, lng, zoom);
    return {
      x: halfW + (point.x - centerWorld.x) + panOffset.x,
      y: halfH + (point.y - centerWorld.y) + panOffset.y,
    };
  };

  // Tile rendering calculation
  const currentTileProvider = TILE_PROVIDERS[tileMode];
  const tileZ = Math.floor(zoom);
  const numTiles = Math.pow(2, tileZ);

  const minX = Math.floor((centerWorld.x - halfW - panOffset.x) / 256);
  const maxX = Math.floor((centerWorld.x + halfW - panOffset.x) / 256);
  const minY = Math.floor((centerWorld.y - halfH - panOffset.y) / 256);
  const maxY = Math.floor((centerWorld.y + halfH - panOffset.y) / 256);

  const tiles = [];
  for (let tx = minX; tx <= maxX; tx++) {
    for (let ty = minY; ty <= maxY; ty++) {
      if (ty >= 0 && ty < numTiles) {
        const wrappedX = ((tx % numTiles) + numTiles) % numTiles;
        const posX = tx * 256 - centerWorld.x + halfW + panOffset.x;
        const posY = ty * 256 - centerWorld.y + halfH + panOffset.y;
        tiles.push({
          key: `${tileZ}-${wrappedX}-${ty}-${tx}`,
          url: currentTileProvider.url(tileZ, wrappedX, ty),
          x: posX,
          y: posY,
        });
      }
    }
  }

  const campusScreen = getScreenCoords(CAMPUS_COORDS.lat, CAMPUS_COORDS.lng);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full aspect-video min-h-[420px] select-none overflow-hidden cursor-${
        isDragging ? 'grabbing' : 'grab'
      }`}
      style={{ backgroundColor: currentTileProvider.bg }}
    >
      {/* ── MAP TILES LAYER ── */}
      <div className="absolute inset-0 pointer-events-none">
        {tiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.url}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              position: 'absolute',
              left: `${tile.x}px`,
              top: `${tile.y}px`,
              width: '256px',
              height: '256px',
            }}
            className={tileMode === 'dark' ? 'brightness-95 contrast-105' : ''}
          />
        ))}
      </div>

      {/* ── ROUTE POLYLINES & STOP PINS (SVG OVERLAY) ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Draw Polylines for each route */}
        {liveFleet.map((route) => {
          const isSelected = selectedRoute.id === route.id;
          const points = route.stops.map((s) => getScreenCoords(s.lat, s.lng));
          // add bus position and campus
          const busPos = getScreenCoords(route.currentLat, route.currentLng);
          const allPoints = [...points, busPos, campusScreen];
          const pathD = allPoints.reduce((acc, pt, idx) => {
            return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
          }, '');

          return (
            <g key={`path-${route.id}`}>
              {/* Outer glow stroke */}
              <path
                d={pathD}
                fill="none"
                stroke={route.color}
                strokeWidth={isSelected ? '6' : '3'}
                strokeOpacity={isSelected ? '0.4' : '0.2'}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Core dashed telemetry line */}
              <path
                d={pathD}
                fill="none"
                stroke={isSelected ? '#FBBF24' : route.color}
                strokeWidth={isSelected ? '2.5' : '1.5'}
                strokeDasharray={isSelected ? '6,4' : '4,4'}
                strokeOpacity={isSelected ? '0.95' : '0.6'}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}

        {/* Draw Stop Checkpoint Pins */}
        {selectedRoute.stops.map((stop, idx) => {
          const pt = getScreenCoords(stop.lat, stop.lng);
          return (
            <g key={`stop-${idx}`} transform={`translate(${pt.x}, ${pt.y})`}>
              <circle
                r="7"
                fill={stop.completed ? '#10B981' : '#18181B'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              <text
                textAnchor="middle"
                dy="3.5"
                fill="#FFFFFF"
                fontSize="8.5"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {idx + 1}
              </text>
            </g>
          );
        })}
      </svg>

      {/* ── CENTRAL VIDYAFLOWW CAMPUS LANDMARK ── */}
      <div
        style={{
          position: 'absolute',
          left: `${campusScreen.x}px`,
          top: `${campusScreen.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
        className="z-20 pointer-events-none flex flex-col items-center"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-white shadow-lg animate-pulse">
            <Navigation className="w-4 h-4 text-amber-400 fill-amber-400/30" />
          </div>
          <span className="absolute -inset-1 rounded-full border border-amber-400/50 animate-ping pointer-events-none" />
        </div>
        <div className="mt-1 px-2 py-0.5 rounded-[3px] bg-black/90 border border-amber-400/60 shadow-xl flex items-center gap-1 text-[9.5px] font-mono font-bold text-amber-300 whitespace-nowrap">
          <span>🏫</span>
          <span>VIDYAFLOWW CAMPUS</span>
        </div>
      </div>

      {/* ── SCHOOL BUS VECTORS WITH FLOATING BUS NUMBER BADGES ── */}
      {liveFleet.map((bus) => {
        const isSelected = selectedRoute.id === bus.id;
        const busScreen = getScreenCoords(bus.currentLat, bus.currentLng);

        return (
          <div
            key={bus.id}
            data-interactive="true"
            onClick={() => handleFocusBus(bus)}
            style={{
              position: 'absolute',
              left: `${busScreen.x}px`,
              top: `${busScreen.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className="z-30 cursor-pointer group flex flex-col items-center select-none"
          >
            {/* ── FLOATING BUS NUMBER BADGE (PROMINENT ON TOP) ── */}
            <div
              className={`flex flex-col items-center transition-all duration-200 ${
                isSelected ? 'scale-110 -translate-y-1' : 'group-hover:scale-105'
              }`}
            >
              <div
                className={`px-2 py-0.5 rounded-[3px] border shadow-2xl flex items-center gap-1.5 font-mono text-[10px] font-black whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-amber-400 text-black border-amber-200 ring-2 ring-amber-400/50'
                    : 'bg-[#0f141c]/95 text-amber-300 border-amber-500/50 group-hover:border-amber-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="tracking-wider">{bus.routeCode}</span>
                <span className="text-zinc-400">·</span>
                <span>{bus.busNumber.split('-').slice(2).join('-')}</span>
                <span className="text-[8.5px] opacity-80 px-1 py-0.2 rounded bg-black/40 text-emerald-400 font-bold ml-0.5">
                  {bus.currentSpeed} km/h
                </span>
              </div>

              {/* Downward triangle pointing to bus roof */}
              <div
                className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] -mt-[0.5px] ${
                  isSelected ? 'border-t-amber-400' : 'border-t-[#0f141c]'
                }`}
              />
            </div>

            {/* ── FREE HIGH-DETAIL SCHOOL BUS SVG VECTOR ── */}
            <div className="relative mt-0.5">
              {/* Pulsing Radar Ring */}
              {isSelected && (
                <div className="absolute -inset-2 rounded-full border-2 border-amber-400/60 animate-ping pointer-events-none" />
              )}

              {/* Realistic Yellow School Bus Vector SVG */}
              <svg
                width={isSelected ? '48' : '42'}
                height={isSelected ? '28' : '24'}
                viewBox="0 0 64 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] transition-transform duration-200"
              >
                {/* Bus Body Main Chassis */}
                <path
                  d="M4 10C4 8.89543 4.89543 8 6 8H54C56.2091 8 58 9.79086 58 12V24C58 25.1046 57.1046 26 56 26H4C2.89543 26 2 25.1046 2 24V12C2 10.8954 2.89543 10 4 10Z"
                  fill="#F59E0B"
                  stroke="#B45309"
                  strokeWidth="1.5"
                />

                {/* Roof Curve / Cap */}
                <path
                  d="M5 8C5 6.89543 5.89543 6 7 6H53C54.1046 6 55 6.89543 55 8V9H5V8Z"
                  fill="#FBBF24"
                />

                {/* Front Windshield Slope (Right Side) */}
                <path
                  d="M48 9H54.5C56 9 57.2 10 57.5 11.5L59 18H48V9Z"
                  fill="#60A5FA"
                  fillOpacity="0.85"
                  stroke="#1E3A8A"
                  strokeWidth="0.75"
                />

                {/* Side Passenger Windows */}
                <g fill="#93C5FD" fillOpacity="0.8" stroke="#1E3A8A" strokeWidth="0.5">
                  <rect x="6" y="10" width="7" height="8" rx="1" />
                  <rect x="15" y="10" width="7" height="8" rx="1" />
                  <rect x="24" y="10" width="7" height="8" rx="1" />
                  <rect x="33" y="10" width="7" height="8" rx="1" />
                  <rect x="42" y="10" width="5" height="8" rx="1" />
                </g>

                {/* Black Side Impact Safety Rails */}
                <line x1="2" y1="20" x2="58" y2="20" stroke="#18181B" strokeWidth="1.8" />
                <line x1="2" y1="23" x2="58" y2="23" stroke="#18181B" strokeWidth="1" />

                {/* "SCHOOL BUS" text emblem */}
                <text
                  x="25"
                  y="22.2"
                  fill="#18181B"
                  fontSize="3"
                  fontWeight="900"
                  fontFamily="sans-serif"
                  letterSpacing="0.4"
                >
                  SCHOOL BUS
                </text>

                {/* Headlights & Tail Lights */}
                <rect x="58" y="21" width="2" height="3" rx="0.5" fill="#FEF08A" />
                <rect x="1" y="21" width="1.5" height="3" rx="0.5" fill="#EF4444" />

                {/* Front & Rear Heavy Wheels */}
                {/* Rear Wheel */}
                <circle cx="14" cy="27" r="5" fill="#18181B" stroke="#52525B" strokeWidth="1" />
                <circle cx="14" cy="27" r="2.2" fill="#A1A1AA" />
                
                {/* Front Wheel */}
                <circle cx="48" cy="27" r="5" fill="#18181B" stroke="#52525B" strokeWidth="1" />
                <circle cx="48" cy="27" r="2.2" fill="#A1A1AA" />

                {/* Top Flashing Warning Lights */}
                <circle cx="8" cy="5.5" r="1.5" fill="#EF4444" className="animate-pulse" />
                <circle cx="12" cy="5.5" r="1.5" fill="#F59E0B" />
                <circle cx="48" cy="5.5" r="1.5" fill="#F59E0B" />
                <circle cx="52" cy="5.5" r="1.5" fill="#EF4444" className="animate-pulse" />
              </svg>
            </div>
          </div>
        );
      })}

      {/* ── TOP-LEFT FLOATING TELEMETRY HUD ── */}
      <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5 pointer-events-none">
        <div className="p-2 px-3 rounded-[3px] bg-[#0c1017]/90 backdrop-blur-md border border-white/15 shadow-xl text-xs font-mono flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              {selectedRoute.routeCode}
            </span>
          </div>
          <span className="text-zinc-600">|</span>
          <div className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
            <Gauge className="w-3.5 h-3.5" />
            <span>{selectedRoute.currentSpeed} km/h</span>
          </div>
          <span className="text-zinc-600">|</span>
          <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
            <Fuel className="w-3.5 h-3.5" />
            <span>{selectedRoute.fuelLevel}% Fuel</span>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded-[3px] bg-black/80 backdrop-blur-sm border border-white/10 text-[10px] font-mono text-zinc-400">
          <span>GPS: {selectedRoute.currentLat.toFixed(4)}° N, {selectedRoute.currentLng.toFixed(4)}° E</span>
          <span className="text-zinc-600 mx-1">·</span>
          <span>Next: <strong className="text-zinc-200">{selectedRoute.nextStop}</strong></span>
        </div>
      </div>

      {/* ── TOP-RIGHT MAP CONTROLS ── */}
      <div className="absolute top-3 right-3 z-30 flex flex-col items-end gap-2" data-interactive="true">
        {/* Layer Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="p-2 rounded-[3px] bg-[#121212]/90 hover:bg-[#1f1f1f] text-zinc-300 hover:text-white border border-border shadow-lg flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer transition-colors"
            title="Change Map Style"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10.5px]">{currentTileProvider.name}</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 top-9 w-36 rounded-[3px] bg-[#141414] border border-border/90 shadow-2xl p-1 z-40 space-y-0.5">
              {(Object.keys(TILE_PROVIDERS) as Array<'dark' | 'osm' | 'voyager'>).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setTileMode(mode);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-[2px] text-[11px] font-mono font-bold cursor-pointer transition-colors flex items-center justify-between ${
                    tileMode === mode
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-zinc-300 hover:bg-[#202020]'
                  }`}
                >
                  <span>{TILE_PROVIDERS[mode].name}</span>
                  {tileMode === mode && <span className="text-amber-400">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Zoom & Recenter Controls */}
        <div className="flex flex-col bg-[#121212]/90 border border-border rounded-[3px] shadow-lg overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-[#222222] text-zinc-300 hover:text-white border-b border-border/60 cursor-pointer transition-colors"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-[#222222] text-zinc-300 hover:text-white border-b border-border/60 cursor-pointer transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRecenterCampus}
            className="p-2 hover:bg-[#222222] text-zinc-300 hover:text-white cursor-pointer transition-colors"
            title="Recenter on VidyaFloww Campus"
          >
            <Crosshair className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* ── BOTTOM-LEFT ATTRIBUTION & RADAR STATUS ── */}
      <div className="absolute bottom-2 left-3 z-30 flex items-center gap-2 pointer-events-none text-[9.5px] font-mono text-zinc-500">
        <div className="px-2 py-0.5 rounded-[2px] bg-black/75 border border-white/10 text-emerald-400 flex items-center gap-1 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>GPS POLLING 2.5s</span>
        </div>
        <span className="bg-black/60 px-1.5 py-0.5 rounded text-zinc-400">
          {currentTileProvider.attribution}
        </span>
      </div>
    </div>
  );
}
