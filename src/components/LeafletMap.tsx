import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ProvinceData, RISK_COLORS } from '@/lib/types';

interface LeafletMapProps {
  provinces: ProvinceData[];
  selectedProvince: string | null;
  onProvinceSelect: (id: string) => void;
}

// Approximate polygon coordinates for each province
const PROVINCE_POLYGONS: Record<string, [number, number][]> = {
  sindh: [
    [28.5, 66.5], [27.5, 67.0], [26.0, 67.5], [24.5, 67.0],
    [23.8, 67.5], [24.0, 68.5], [24.8, 69.5], [25.5, 70.0],
    [27.0, 70.5], [28.0, 69.5], [28.5, 68.5], [28.5, 66.5],
  ],
  punjab: [
    [33.5, 70.5], [33.0, 71.5], [32.0, 71.0], [31.0, 70.5],
    [30.0, 70.0], [29.0, 70.5], [28.5, 69.5], [28.5, 71.0],
    [29.5, 72.0], [30.5, 72.5], [31.5, 73.5], [32.5, 74.5],
    [33.5, 74.0], [34.0, 73.0], [33.5, 71.5], [33.5, 70.5],
  ],
  kpk: [
    [36.0, 71.0], [35.5, 71.5], [35.0, 71.0], [34.5, 71.5],
    [34.0, 72.0], [33.5, 71.5], [33.5, 70.5], [34.0, 70.0],
    [34.5, 70.5], [35.0, 70.0], [35.5, 70.5], [36.0, 71.0],
  ],
  balochistan: [
    [32.0, 66.5], [31.0, 66.0], [30.0, 66.5], [29.0, 66.0],
    [28.0, 63.0], [27.0, 62.5], [26.0, 63.0], [25.5, 64.0],
    [25.0, 65.0], [25.5, 66.5], [26.5, 67.0], [27.5, 67.0],
    [28.5, 66.5], [29.5, 67.0], [30.5, 67.5], [31.0, 67.0],
    [31.5, 67.0], [32.0, 66.5],
  ],
  gb: [
    [37.0, 74.5], [36.5, 75.0], [36.0, 76.0], [35.5, 76.5],
    [35.0, 76.0], [35.0, 75.0], [35.5, 74.5], [36.0, 74.0],
    [36.5, 74.0], [37.0, 74.5],
  ],
  ajk: [
    [35.0, 73.5], [34.5, 74.0], [34.0, 74.5], [33.5, 74.0],
    [33.5, 73.5], [34.0, 73.0], [34.5, 73.0], [35.0, 73.5],
  ],
};

// Major rivers of Pakistan
const RIVERS: { name: string; path: [number, number][] }[] = [
  {
    name: 'Indus River',
    path: [
      [36.8, 75.5], [36.0, 74.5], [35.5, 73.5], [35.0, 72.8],
      [34.2, 72.0], [33.5, 71.5], [32.5, 71.0], [31.5, 70.5],
      [30.5, 70.0], [29.5, 69.5], [28.5, 68.5], [27.5, 68.0],
      [26.5, 67.8], [25.5, 67.5], [24.5, 67.3], [23.8, 67.5],
    ],
  },
  {
    name: 'Chenab River',
    path: [
      [33.5, 75.5], [33.0, 74.8], [32.5, 74.0], [32.0, 73.5],
      [31.5, 72.5], [31.0, 71.8], [30.5, 71.3], [30.0, 70.8],
      [29.5, 70.2],
    ],
  },
  {
    name: 'Jhelum River',
    path: [
      [34.5, 74.8], [34.0, 74.3], [33.5, 73.8], [33.0, 73.5],
      [32.5, 73.0], [32.0, 72.5], [31.5, 72.0], [31.0, 71.5],
    ],
  },
  {
    name: 'Ravi River',
    path: [
      [32.5, 75.5], [32.0, 74.8], [31.5, 74.3], [31.0, 73.5],
      [30.5, 72.8], [30.0, 71.5],
    ],
  },
  {
    name: 'Sutlej River',
    path: [
      [31.0, 75.5], [30.5, 74.5], [30.0, 73.5], [29.5, 72.5],
      [29.0, 71.5], [28.8, 70.5],
    ],
  },
];

// District/city markers with risk predictions
const DISTRICT_MARKERS: { name: string; lat: number; lng: number; riskScore: number; provinceId: string }[] = [
  // Sindh
  { name: 'Sukkur', lat: 27.7, lng: 68.86, riskScore: 91, provinceId: 'sindh' },
  { name: 'Larkana', lat: 27.56, lng: 68.21, riskScore: 85, provinceId: 'sindh' },
  { name: 'Hyderabad', lat: 25.39, lng: 68.37, riskScore: 65, provinceId: 'sindh' },
  { name: 'Karachi', lat: 24.86, lng: 67.01, riskScore: 45, provinceId: 'sindh' },
  { name: 'Thatta', lat: 24.75, lng: 67.92, riskScore: 72, provinceId: 'sindh' },
  { name: 'Dadu', lat: 26.73, lng: 67.78, riskScore: 78, provinceId: 'sindh' },
  // Punjab
  { name: 'Lahore', lat: 31.55, lng: 74.35, riskScore: 45, provinceId: 'punjab' },
  { name: 'Multan', lat: 30.2, lng: 71.47, riskScore: 62, provinceId: 'punjab' },
  { name: 'Muzaffargarh', lat: 30.07, lng: 71.19, riskScore: 88, provinceId: 'punjab' },
  { name: 'Rajanpur', lat: 29.1, lng: 70.33, riskScore: 84, provinceId: 'punjab' },
  { name: 'D.G. Khan', lat: 30.05, lng: 70.64, riskScore: 79, provinceId: 'punjab' },
  { name: 'Faisalabad', lat: 31.42, lng: 73.08, riskScore: 38, provinceId: 'punjab' },
  { name: 'Rawalpindi', lat: 33.6, lng: 73.05, riskScore: 42, provinceId: 'punjab' },
  // KPK
  { name: 'Peshawar', lat: 34.01, lng: 71.58, riskScore: 42, provinceId: 'kpk' },
  { name: 'Swat', lat: 35.22, lng: 72.34, riskScore: 72, provinceId: 'kpk' },
  { name: 'Nowshera', lat: 34.02, lng: 71.97, riskScore: 65, provinceId: 'kpk' },
  { name: 'Charsadda', lat: 34.15, lng: 71.74, riskScore: 60, provinceId: 'kpk' },
  // Balochistan
  { name: 'Quetta', lat: 30.18, lng: 67.0, riskScore: 30, provinceId: 'balochistan' },
  { name: 'Lasbela', lat: 26.23, lng: 66.05, riskScore: 68, provinceId: 'balochistan' },
  { name: 'Jaffarabad', lat: 28.52, lng: 68.43, riskScore: 63, provinceId: 'balochistan' },
  // GB
  { name: 'Gilgit', lat: 35.92, lng: 74.31, riskScore: 38, provinceId: 'gb' },
  { name: 'Skardu', lat: 35.3, lng: 75.63, riskScore: 32, provinceId: 'gb' },
  { name: 'Hunza', lat: 36.32, lng: 74.65, riskScore: 28, provinceId: 'gb' },
  // AJK
  { name: 'Muzaffarabad', lat: 34.37, lng: 73.47, riskScore: 55, provinceId: 'ajk' },
  { name: 'Mirpur', lat: 33.15, lng: 73.75, riskScore: 38, provinceId: 'ajk' },
];

function getRiskLevel(score: number) {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function getCityMarkerColor(score: number) {
  if (score >= 80) return 'hsl(0, 85%, 40%)';
  if (score >= 60) return 'hsl(0, 72%, 55%)';
  if (score >= 40) return 'hsl(38, 92%, 55%)';
  return 'hsl(152, 69%, 42%)';
}

export function LeafletMap({ provinces, selectedProvince, onProvinceSelect }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<Record<string, L.Polygon>>({});

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

    // ESRI World Imagery (free satellite tiles)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri',
    }).addTo(map);

    // Semi-transparent dark overlay for better contrast
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      opacity: 0.3,
    }).addTo(map);

    // Labels on top
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
      opacity: 0.6,
    }).addTo(map);

    // Add zoom control to bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Draw rivers first (below provinces)
    RIVERS.forEach((river) => {
      const polyline = L.polyline(river.path, {
        color: 'hsl(199, 89%, 55%)',
        weight: 2.5,
        opacity: 0.6,
        dashArray: '8 4',
        className: 'river-line',
      }).addTo(map);

      polyline.bindTooltip(
        `<div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; padding: 2px 6px;">
          🌊 ${river.name}
        </div>`,
        { sticky: true, className: 'river-tooltip', direction: 'top' }
      );
    });

    // Add province polygons
    provinces.forEach((province) => {
      const coords = PROVINCE_POLYGONS[province.id];
      if (!coords) return;

      const color = RISK_COLORS[province.riskLevel];
      const polygon = L.polygon(coords, {
        color: color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.2,
        className: 'province-polygon',
      }).addTo(map);

      // Tooltip
      polygon.bindTooltip(
        `<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; text-align: center;">
          <strong style="font-size: 12px;">${province.name}</strong><br/>
          Risk: <span style="color:${color}; font-weight: 700;">${province.riskScore}%</span><br/>
          Rain (7d): ${province.rainfall7Day}mm
        </div>`,
        { sticky: true, className: 'map-tooltip', direction: 'top' }
      );

      polygon.on('click', () => onProvinceSelect(province.id));

      // Alert marker
      if (province.alertActive) {
        const alertIcon = L.divIcon({
          className: 'alert-pulse-marker',
          html: `<div style="width:18px;height:18px;border-radius:50%;background:${color};box-shadow:0 0 16px ${color}, 0 0 32px ${color}40;animation:pulse 2s infinite;"></div>`,
          iconSize: [18, 18],
        });
        L.marker([province.coordinates.lat, province.coordinates.lng], { icon: alertIcon }).addTo(map);
      }

      layersRef.current[province.id] = polygon;
    });

    // Add district/city markers
    DISTRICT_MARKERS.forEach((district) => {
      const color = getCityMarkerColor(district.riskScore);
      const riskLevel = getRiskLevel(district.riskScore);
      const size = district.riskScore >= 80 ? 10 : district.riskScore >= 60 ? 8 : 6;

      const icon = L.divIcon({
        className: 'city-marker',
        html: `
          <div style="position:relative;width:${size}px;height:${size}px;">
            <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:1.5px solid rgba(255,255,255,0.6);box-shadow:0 0 8px ${color}80;"></div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([district.lat, district.lng], { icon }).addTo(map);

      marker.bindTooltip(
        `<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; text-align: center; min-width: 120px;">
          <strong style="font-size: 12px;">${district.name}</strong><br/>
          <span style="font-size: 10px; opacity: 0.7;">City Prediction</span><br/>
          Risk: <span style="color:${color}; font-weight: 700;">${district.riskScore}%</span><br/>
          Level: <span style="color:${color}; text-transform: uppercase; font-size: 10px;">${riskLevel}</span>
        </div>`,
        { className: 'map-tooltip', direction: 'top', offset: [0, -4] }
      );

      marker.on('click', () => onProvinceSelect(district.provinceId));
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle selection changes
  useEffect(() => {
    Object.entries(layersRef.current).forEach(([id, polygon]) => {
      const province = provinces.find(p => p.id === id);
      if (!province) return;
      const color = RISK_COLORS[province.riskLevel];
      
      if (id === selectedProvince) {
        polygon.setStyle({ weight: 3, fillOpacity: 0.4, color: 'hsl(187, 72%, 68%)' });
        if (mapInstanceRef.current) {
          const bounds = polygon.getBounds();
          mapInstanceRef.current.flyToBounds(bounds, { padding: [40, 40], maxZoom: 7, duration: 0.8 });
        }
      } else {
        polygon.setStyle({ weight: 2, fillOpacity: 0.2, color });
      }
    });
  }, [selectedProvince, provinces]);

  return (
    <div className="relative w-full h-full min-h-[320px] overflow-hidden">
      <div ref={mapRef} className="w-full h-full min-h-[320px]" />
      {/* Map overlay legend */}
      <div className="absolute top-3 left-3 z-[1000] bg-card/80 backdrop-blur-md rounded-lg border border-border/50 p-2.5 space-y-1.5">
        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Layers</div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-0.5 rounded" style={{ background: 'hsl(199, 89%, 55%)', opacity: 0.6 }} />
          <span className="text-[10px] text-muted-foreground">Rivers</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full border border-white/60" style={{ background: 'hsl(0, 72%, 55%)' }} />
          <span className="text-[10px] text-muted-foreground">Cities</span>
        </div>
        {(['low', 'medium', 'high', 'critical'] as const).map((level) => (
          <div key={level} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm risk-indicator-${level}`} style={{ opacity: 0.6 }} />
            <span className="text-[10px] text-muted-foreground capitalize">{level}</span>
          </div>
        ))}
      </div>
      <style>{`
        .map-tooltip, .river-tooltip {
          background: hsl(222, 44%, 9%) !important;
          border: 1px solid hsl(222, 30%, 18%) !important;
          border-radius: 8px !important;
          color: hsl(210, 40%, 93%) !important;
          padding: 8px 12px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
        }
        .map-tooltip::before, .river-tooltip::before {
          border-top-color: hsl(222, 30%, 18%) !important;
        }
        .leaflet-control-zoom a {
          background: hsl(222, 44%, 9%) !important;
          color: hsl(210, 40%, 93%) !important;
          border-color: hsl(222, 30%, 18%) !important;
        }
        .leaflet-control-zoom a:hover {
          background: hsl(222, 30%, 16%) !important;
        }
        .river-line {
          filter: drop-shadow(0 0 4px hsl(199, 89%, 55%));
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
