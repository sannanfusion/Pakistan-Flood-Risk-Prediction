import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ProvinceData, RISK_COLORS } from '@/lib/types';
import { LayerVisibility } from './MapLayersPanel';

interface LeafletMapProps {
  provinces: ProvinceData[];
  selectedProvince: string | null;
  onProvinceSelect: (id: string) => void;
  layerVisibility?: LayerVisibility;
}

const PROVINCE_CIRCLES: Record<string, { center: [number, number]; radius: number }> = {
  sindh: { center: [26.2, 68.0], radius: 180000 },
  punjab: { center: [31.2, 72.0], radius: 200000 },
  kpk: { center: [34.5, 71.2], radius: 100000 },
  balochistan: { center: [28.5, 65.5], radius: 250000 },
  gb: { center: [35.8, 75.0], radius: 80000 },
  ajk: { center: [34.2, 73.8], radius: 50000 },
};

const FLOOD_ZONES: { path: [number, number][]; severity: 'light' | 'moderate' | 'heavy' }[] = [
  { path: [[27.8, 68.2], [27.5, 68.5], [27.0, 68.8], [26.5, 68.5], [26.0, 68.2], [25.8, 68.5], [26.2, 68.8], [26.8, 69.0], [27.3, 68.9], [27.8, 68.6], [27.8, 68.2]], severity: 'heavy' },
  { path: [[30.5, 70.5], [30.2, 70.8], [29.8, 71.0], [29.5, 70.8], [29.3, 70.5], [29.5, 70.2], [29.8, 70.0], [30.2, 70.2], [30.5, 70.5]], severity: 'moderate' },
  { path: [[34.5, 71.8], [34.2, 72.0], [33.8, 72.2], [33.5, 72.0], [33.5, 71.6], [33.8, 71.4], [34.2, 71.5], [34.5, 71.8]], severity: 'light' },
];

const RIVERS: { name: string; path: [number, number][]; width: number }[] = [
  { name: 'Indus River', path: [[36.8, 75.5], [36.0, 74.5], [35.5, 73.5], [35.0, 72.8], [34.2, 72.0], [33.5, 71.5], [32.5, 71.0], [31.5, 70.5], [30.5, 70.0], [29.5, 69.5], [28.5, 68.5], [27.5, 68.0], [26.5, 67.8], [25.5, 67.5], [24.5, 67.3], [23.8, 67.5]], width: 3 },
  { name: 'Chenab River', path: [[33.5, 75.5], [33.0, 74.8], [32.5, 74.0], [32.0, 73.5], [31.5, 72.5], [31.0, 71.8], [30.5, 71.3], [30.0, 70.8], [29.5, 70.2]], width: 2.5 },
  { name: 'Jhelum River', path: [[34.5, 74.8], [34.0, 74.3], [33.5, 73.8], [33.0, 73.5], [32.5, 73.0], [32.0, 72.5], [31.5, 72.0], [31.0, 71.5]], width: 2 },
  { name: 'Ravi River', path: [[32.5, 75.5], [32.0, 74.8], [31.5, 74.3], [31.0, 73.5], [30.5, 72.8], [30.0, 71.5]], width: 2 },
  { name: 'Sutlej River', path: [[31.0, 75.5], [30.5, 74.5], [30.0, 73.5], [29.5, 72.5], [29.0, 71.5], [28.8, 70.5]], width: 2 },
];

const DISTRICT_MARKERS: { name: string; lat: number; lng: number; riskScore: number; provinceId: string; type: 'city' | 'station' }[] = [
  { name: 'Sukkur', lat: 27.7, lng: 68.86, riskScore: 91, provinceId: 'sindh', type: 'station' },
  { name: 'Larkana', lat: 27.56, lng: 68.21, riskScore: 85, provinceId: 'sindh', type: 'city' },
  { name: 'Hyderabad', lat: 25.39, lng: 68.37, riskScore: 65, provinceId: 'sindh', type: 'city' },
  { name: 'Karachi', lat: 24.86, lng: 67.01, riskScore: 45, provinceId: 'sindh', type: 'city' },
  { name: 'Thatta', lat: 24.75, lng: 67.92, riskScore: 72, provinceId: 'sindh', type: 'city' },
  { name: 'Dadu', lat: 26.73, lng: 67.78, riskScore: 78, provinceId: 'sindh', type: 'station' },
  { name: 'Lahore', lat: 31.55, lng: 74.35, riskScore: 45, provinceId: 'punjab', type: 'city' },
  { name: 'Multan', lat: 30.2, lng: 71.47, riskScore: 62, provinceId: 'punjab', type: 'city' },
  { name: 'Muzaffargarh', lat: 30.07, lng: 71.19, riskScore: 88, provinceId: 'punjab', type: 'station' },
  { name: 'Rajanpur', lat: 29.1, lng: 70.33, riskScore: 84, provinceId: 'punjab', type: 'station' },
  { name: 'D.G. Khan', lat: 30.05, lng: 70.64, riskScore: 79, provinceId: 'punjab', type: 'city' },
  { name: 'Faisalabad', lat: 31.42, lng: 73.08, riskScore: 38, provinceId: 'punjab', type: 'city' },
  { name: 'Rawalpindi', lat: 33.6, lng: 73.05, riskScore: 42, provinceId: 'punjab', type: 'city' },
  { name: 'Peshawar', lat: 34.01, lng: 71.58, riskScore: 42, provinceId: 'kpk', type: 'city' },
  { name: 'Swat', lat: 35.22, lng: 72.34, riskScore: 72, provinceId: 'kpk', type: 'station' },
  { name: 'Nowshera', lat: 34.02, lng: 71.97, riskScore: 65, provinceId: 'kpk', type: 'city' },
  { name: 'Charsadda', lat: 34.15, lng: 71.74, riskScore: 60, provinceId: 'kpk', type: 'city' },
  { name: 'Quetta', lat: 30.18, lng: 67.0, riskScore: 30, provinceId: 'balochistan', type: 'city' },
  { name: 'Lasbela', lat: 26.23, lng: 66.05, riskScore: 68, provinceId: 'balochistan', type: 'city' },
  { name: 'Jaffarabad', lat: 28.52, lng: 68.43, riskScore: 63, provinceId: 'balochistan', type: 'station' },
  { name: 'Gilgit', lat: 35.92, lng: 74.31, riskScore: 38, provinceId: 'gb', type: 'city' },
  { name: 'Skardu', lat: 35.3, lng: 75.63, riskScore: 32, provinceId: 'gb', type: 'city' },
  { name: 'Hunza', lat: 36.32, lng: 74.65, riskScore: 28, provinceId: 'gb', type: 'city' },
  { name: 'Muzaffarabad', lat: 34.37, lng: 73.47, riskScore: 55, provinceId: 'ajk', type: 'city' },
  { name: 'Mirpur', lat: 33.15, lng: 73.75, riskScore: 38, provinceId: 'ajk', type: 'city' },
];

function getRiskLevel(score: number) {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function getMarkerColor(score: number) {
  if (score >= 80) return { bg: '#dc2626', border: '#991b1b', glow: 'rgba(220,38,38,0.4)' };
  if (score >= 60) return { bg: '#ea580c', border: '#c2410c', glow: 'rgba(234,88,12,0.3)' };
  if (score >= 40) return { bg: '#eab308', border: '#a16207', glow: 'rgba(234,179,8,0.3)' };
  return { bg: '#16a34a', border: '#15803d', glow: 'rgba(22,163,74,0.3)' };
}

const FLOOD_COLORS = {
  light: { fill: 'rgba(96,165,250,0.2)', border: 'rgba(59,130,246,0.5)' },
  moderate: { fill: 'rgba(59,130,246,0.25)', border: 'rgba(37,99,235,0.6)' },
  heavy: { fill: 'rgba(37,99,235,0.3)', border: 'rgba(29,78,216,0.7)' },
};

function createCityMarkerHtml(district: typeof DISTRICT_MARKERS[0]) {
  const colors = getMarkerColor(district.riskScore);
  const isStation = district.type === 'station';

  return `<div style="
    position:relative;
    width:28px;height:40px;
    cursor:pointer;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  ">
    <svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="${colors.bg}"/>
      <path d="M14 1C6.82 1 1 6.82 1 14c0 9.94 13 24.5 13 24.5S27 23.94 27 14C27 6.82 21.18 1 14 1z" fill="${colors.bg}" stroke="white" stroke-width="1.5"/>
      <circle cx="14" cy="13" r="5.5" fill="white" opacity="0.95"/>
      ${isStation 
        ? `<rect x="10.5" y="9.5" width="7" height="7" rx="1.5" fill="${colors.bg}" transform="rotate(45 14 13)"/>`
        : `<circle cx="14" cy="13" r="3.5" fill="${colors.bg}"/>`
      }
    </svg>
    ${district.riskScore >= 80 ? `<div style="
      position:absolute;top:-4px;left:-4px;
      width:36px;height:36px;
      border-radius:50%;
      border:2px solid ${colors.bg};
      opacity:0.5;
      animation: markerPulse 2s ease-out infinite;
    "></div>` : ''}
  </div>`;
}

function createTooltipHtml(district: typeof DISTRICT_MARKERS[0]) {
  const colors = getMarkerColor(district.riskScore);
  const riskLabel = getRiskLevel(district.riskScore);
  const icon = district.type === 'station' ? '📡' : '🏙️';

  return `<div style="
    font-family:'Inter',system-ui,sans-serif;
    min-width:140px;padding:10px 12px;
    background:white;border-radius:10px;
    box-shadow:0 4px 20px rgba(0,0,0,0.12);
    border:1px solid #e5e7eb;
    border-left:4px solid ${colors.bg};
  ">
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
      <span style="font-size:13px;">${icon}</span>
      <span style="font-size:12px;font-weight:700;color:#1a1a2e;">${district.name}</span>
    </div>
    <div style="display:flex;align-items:baseline;gap:4px;margin-bottom:4px;">
      <span style="font-size:22px;font-weight:800;color:${colors.bg};line-height:1;">${district.riskScore}</span>
      <span style="font-size:10px;color:#6b7280;font-weight:500;">/ 100</span>
    </div>
    <div style="
      display:inline-block;
      font-size:9px;font-weight:700;
      color:${colors.bg};
      background:${colors.glow};
      padding:2px 8px;border-radius:4px;
      text-transform:uppercase;letter-spacing:0.5px;
    ">${riskLabel} RISK</div>
  </div>`;
}

export function LeafletMap({ provinces, selectedProvince, onProvinceSelect, layerVisibility }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const provinceLayersRef = useRef<L.LayerGroup | null>(null);
  const floodLayersRef = useRef<L.LayerGroup | null>(null);
  const riverLayersRef = useRef<L.LayerGroup | null>(null);
  const cityLayersRef = useRef<L.LayerGroup | null>(null);
  const stationLayersRef = useRef<L.LayerGroup | null>(null);
  const provincePolygonsRef = useRef<Record<string, L.Circle>>({});

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [30.3, 69.5],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
      minZoom: 4,
      maxZoom: 12,
    });

    // OpenStreetMap style (Google Maps-like)
    const osmMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    });

    const voyagerMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
      attribution: '© CartoDB Voyager',
      subdomains: 'abcd',
      maxZoom: 19,
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri',
    });

    // Default to OSM (Google Maps-like)
    osmMap.addTo(map);

    L.control.layers(
      { 'Street': osmMap, 'Voyager': voyagerMap, 'Satellite': satelliteLayer },
      {},
      { position: 'topright' }
    ).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const provinceGroup = L.layerGroup().addTo(map);
    const floodGroup = L.layerGroup().addTo(map);
    const riverGroup = L.layerGroup().addTo(map);
    const cityGroup = L.layerGroup().addTo(map);
    const stationGroup = L.layerGroup().addTo(map);

    provinceLayersRef.current = provinceGroup;
    floodLayersRef.current = floodGroup;
    riverLayersRef.current = riverGroup;
    cityLayersRef.current = cityGroup;
    stationLayersRef.current = stationGroup;

    // Flood zones
    FLOOD_ZONES.forEach((zone) => {
      const colors = FLOOD_COLORS[zone.severity];
      L.polygon(zone.path, {
        color: colors.border, weight: 1.5, fillColor: colors.fill, fillOpacity: 0.5,
        dashArray: zone.severity === 'light' ? '6 4' : undefined,
      }).addTo(floodGroup).bindTooltip(
        `<div style="font-family:'Inter',sans-serif;font-size:11px;padding:4px 8px;background:white;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.1);border:1px solid #e5e7eb;">
          <strong>Flood Extent</strong><br/>
          <span style="text-transform:capitalize;font-weight:600;color:#2563eb;">${zone.severity}</span> severity
        </div>`,
        { sticky: true }
      );
    });

    // Rivers
    RIVERS.forEach((river) => {
      // River shadow
      L.polyline(river.path, {
        color: 'rgba(37,99,235,0.15)', weight: river.width + 4, opacity: 1,
        lineCap: 'round', lineJoin: 'round',
      }).addTo(riverGroup);
      // River line
      L.polyline(river.path, {
        color: '#3b82f6', weight: river.width, opacity: 0.7,
        lineCap: 'round', lineJoin: 'round',
      }).addTo(riverGroup).bindTooltip(
        `<div style="font-family:'Inter',sans-serif;font-size:11px;padding:4px 8px;background:white;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.1);border:1px solid #e5e7eb;">
          💧 ${river.name}
        </div>`,
        { sticky: true, direction: 'top' }
      );
    });

    // Province circles — soft, elegant zones
    provinces.forEach((province) => {
      const circleData = PROVINCE_CIRCLES[province.id];
      if (!circleData) return;
      const color = RISK_COLORS[province.riskLevel];

      const circle = L.circle(circleData.center, {
        radius: circleData.radius,
        color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.08,
        opacity: 0.5,
        dashArray: '8 4',
      }).addTo(provinceGroup);

      circle.bindTooltip(
        `<div style="
          font-family:'Inter',sans-serif;
          text-align:center;padding:12px 16px;
          background:white;border-radius:12px;
          box-shadow:0 4px 20px rgba(0,0,0,0.12);
          border:1px solid #e5e7eb;
          min-width:150px;
        ">
          <div style="font-size:14px;font-weight:800;color:#1a1a2e;margin-bottom:8px;">${province.name}</div>
          <div style="font-size:28px;font-weight:900;color:${color};line-height:1;margin-bottom:4px;">${province.riskScore}%</div>
          <div style="font-size:10px;color:#6b7280;margin-bottom:8px;">Risk Score</div>
          <div style="display:flex;justify-content:space-between;gap:12px;font-size:10px;color:#6b7280;">
            <div><span style="font-weight:600;color:#1a1a2e;">${province.rainfall7Day}</span>mm rain</div>
            <div><span style="font-weight:600;color:#1a1a2e;">${(province.population / 1e6).toFixed(1)}M</span> pop</div>
          </div>
        </div>`,
        { sticky: true, direction: 'top' }
      );
      circle.on('click', () => onProvinceSelect(province.id));

      // Province label
      const labelIcon = L.divIcon({
        className: 'province-label-marker',
        html: `<div style="
          font-family:'Inter',sans-serif;
          font-size:11px;font-weight:700;
          color:#1a1a2e;
          background:rgba(255,255,255,0.85);
          padding:2px 8px;border-radius:6px;
          white-space:nowrap;pointer-events:none;
          box-shadow:0 1px 4px rgba(0,0,0,0.08);
          border:1px solid rgba(0,0,0,0.06);
        ">${province.name}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });
      L.marker(circleData.center, { icon: labelIcon, interactive: false }).addTo(provinceGroup);

      provincePolygonsRef.current[province.id] = circle;
    });

    // District markers
    DISTRICT_MARKERS.forEach((district) => {
      const icon = L.divIcon({
        className: 'district-marker',
        html: createCityMarkerHtml(district),
        iconSize: [28, 40],
        iconAnchor: [14, 40],
      });

      const marker = L.marker([district.lat, district.lng], { icon });
      marker.bindTooltip(createTooltipHtml(district), {
        direction: 'top', offset: [0, -8], className: 'clean-tooltip',
      });
      marker.on('click', () => onProvinceSelect(district.provinceId));

      if (district.type === 'station') {
        marker.addTo(stationGroup);
      } else {
        marker.addTo(cityGroup);
      }
    });

    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  // Layer visibility
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layerVisibility) return;
    const toggle = (group: L.LayerGroup | null, visible: boolean) => {
      if (!group) return;
      if (visible && !map.hasLayer(group)) map.addLayer(group);
      if (!visible && map.hasLayer(group)) map.removeLayer(group);
    };
    toggle(provinceLayersRef.current, layerVisibility.provinces);
    toggle(floodLayersRef.current, layerVisibility.floodZones);
    toggle(riverLayersRef.current, layerVisibility.rivers);
    toggle(cityLayersRef.current, layerVisibility.cities);
    toggle(stationLayersRef.current, layerVisibility.stations);
  }, [layerVisibility]);

  // Selected province highlight
  useEffect(() => {
    Object.entries(provincePolygonsRef.current).forEach(([id, circle]) => {
      const province = provinces.find(p => p.id === id);
      if (!province) return;
      const color = RISK_COLORS[province.riskLevel];
      if (id === selectedProvince) {
        circle.setStyle({ weight: 3, fillOpacity: 0.18, opacity: 0.8, dashArray: undefined });
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo(circle.getLatLng(), 6, { duration: 0.8 });
        }
      } else {
        circle.setStyle({ weight: 2, fillOpacity: 0.08, color, opacity: 0.5, dashArray: '8 4' });
      }
    });
  }, [selectedProvince, provinces]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-xl overflow-hidden border border-border shadow-sm">
      <div ref={mapRef} className="w-full h-full min-h-[380px]" />

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg border border-border px-3 py-2 shadow-sm">
        <div className="text-[9px] font-semibold text-foreground uppercase tracking-wider mb-1.5">Risk Level</div>
        <div className="flex flex-col gap-1">
          {[
            { label: 'Critical', color: '#991b1b' },
            { label: 'High', color: '#dc2626' },
            { label: 'Medium', color: '#eab308' },
            { label: 'Low', color: '#16a34a' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
              <span className="text-[9px] text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-1.5 pt-1.5 border-t border-border flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm border border-muted-foreground/30 bg-muted" style={{ transform: 'rotate(45deg)' }} />
          <span className="text-[9px] text-muted-foreground">Station</span>
          <div className="w-2.5 h-2.5 rounded-full border border-muted-foreground/30 bg-muted ml-1" />
          <span className="text-[9px] text-muted-foreground">City</span>
        </div>
      </div>

      {/* Coordinates */}
      <div className="absolute bottom-3 right-16 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg border border-border px-3 py-1.5 shadow-sm">
        <div className="text-[9px] font-mono text-muted-foreground">
          NASA GPM/IMERG · MODIS
        </div>
      </div>

      <style>{`
        .leaflet-control-zoom a {
          background: white !important;
          color: #1a1a2e !important;
          border-color: #e5e7eb !important;
          border-radius: 8px !important;
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          font-size: 16px !important;
          font-weight: 300 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f9fafb !important;
        }
        .leaflet-control-zoom {
          border-radius: 10px !important;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
          border: 1px solid #e5e7eb !important;
        }
        .leaflet-control-layers {
          border-radius: 10px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
          border: 1px solid #e5e7eb !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 11px !important;
        }
        .leaflet-control-layers-toggle {
          width: 32px !important;
          height: 32px !important;
        }
        .clean-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .clean-tooltip::before {
          display: none !important;
        }
        .district-marker:hover > div > div:first-child {
          transform: scale(1.15);
          box-shadow: 0 0 0 2px rgba(59,130,246,0.3), 0 4px 12px rgba(0,0,0,0.2);
        }
        @keyframes markerPulse {
          0% { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0; transform: scale(2.2); }
        }
      `}</style>
    </div>
  );
}
