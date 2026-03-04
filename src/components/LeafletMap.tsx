import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ProvinceData, RISK_COLORS } from '@/lib/types';
import { LayerVisibility } from './MapLayersPanel';

interface LeafletMapProps {
  provinces: ProvinceData[];
  selectedProvince: string | null;
  onProvinceSelect: (id: string) => void;
  layerVisibility: LayerVisibility;
}

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

// Flood extent zones (simulated inundation areas along rivers)
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

function getCityMarkerColor(score: number) {
  if (score >= 80) return 'hsl(0, 84%, 40%)';
  if (score >= 60) return 'hsl(0, 72%, 51%)';
  if (score >= 40) return 'hsl(45, 93%, 47%)';
  return 'hsl(142, 71%, 45%)';
}

const FLOOD_COLORS = {
  light: { fill: 'hsl(199, 80%, 70%)', border: 'hsl(199, 60%, 50%)' },
  moderate: { fill: 'hsl(204, 70%, 55%)', border: 'hsl(204, 63%, 40%)' },
  heavy: { fill: 'hsl(220, 80%, 45%)', border: 'hsl(220, 70%, 35%)' },
};

export function LeafletMap({ provinces, selectedProvince, onProvinceSelect, layerVisibility }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const provinceLayersRef = useRef<L.LayerGroup | null>(null);
  const floodLayersRef = useRef<L.LayerGroup | null>(null);
  const riverLayersRef = useRef<L.LayerGroup | null>(null);
  const cityLayersRef = useRef<L.LayerGroup | null>(null);
  const stationLayersRef = useRef<L.LayerGroup | null>(null);
  const provincePolygonsRef = useRef<Record<string, L.Polygon>>({});

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

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri',
    });
    const lightLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© CartoDB',
    });
    const labelLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
      attribution: '© CartoDB',
    });

    lightLayer.addTo(map);
    L.control.layers({ 'Street Map': lightLayer, 'Satellite': satelliteLayer }, { 'Labels': labelLayer }, { position: 'topright' }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Create layer groups
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

    // Flood extent zones
    FLOOD_ZONES.forEach((zone) => {
      const colors = FLOOD_COLORS[zone.severity];
      L.polygon(zone.path, {
        color: colors.border, weight: 1.5, fillColor: colors.fill, fillOpacity: 0.35,
        dashArray: zone.severity === 'light' ? '4 4' : undefined,
      }).addTo(floodGroup).bindTooltip(
        `<div style="font-size:11px;padding:2px 6px;"><strong>Flood Extent</strong><br/>Severity: <span style="text-transform:capitalize;font-weight:600;">${zone.severity}</span></div>`,
        { sticky: true }
      );
    });

    // Rivers
    RIVERS.forEach((river) => {
      L.polyline(river.path, {
        color: 'hsl(204, 80%, 45%)', weight: river.width, opacity: 0.6,
        lineCap: 'round', lineJoin: 'round',
      }).addTo(riverGroup).bindTooltip(`<div style="font-size:11px;padding:2px 6px;">🌊 ${river.name}</div>`, { sticky: true, direction: 'top' });
    });

    // Province polygons
    provinces.forEach((province) => {
      const coords = PROVINCE_POLYGONS[province.id];
      if (!coords) return;
      const color = RISK_COLORS[province.riskLevel];
      const polygon = L.polygon(coords, {
        color, weight: 2, fillColor: color, fillOpacity: 0.12,
      }).addTo(provinceGroup);

      polygon.bindTooltip(
        `<div style="font-size:12px;text-align:center;padding:4px 8px;">
          <strong style="font-size:13px;">${province.name}</strong><br/>
          <span style="color:${color};font-weight:700;font-size:16px;">${province.riskScore}%</span> risk<br/>
          <span style="font-size:10px;color:#666;">Rain (7d): ${province.rainfall7Day}mm</span><br/>
          <span style="font-size:10px;color:#666;">Pop: ${(province.population / 1e6).toFixed(1)}M</span>
        </div>`,
        { sticky: true, direction: 'top' }
      );
      polygon.on('click', () => onProvinceSelect(province.id));

      if (province.alertActive) {
        const alertIcon = L.divIcon({
          className: 'alert-pulse-marker',
          html: `<div style="position:relative;">
            <div style="width:18px;height:18px;border-radius:50%;background:${color};opacity:0.9;box-shadow:0 0 12px ${color};"></div>
            <div style="position:absolute;inset:-6px;border-radius:50%;border:2px solid ${color};opacity:0.4;animation:pulse 2s infinite;"></div>
          </div>`,
          iconSize: [18, 18],
        });
        L.marker([province.coordinates.lat, province.coordinates.lng], { icon: alertIcon }).addTo(provinceGroup);
      }

      provincePolygonsRef.current[province.id] = polygon;
    });

    // District markers — separated into city & station groups
    DISTRICT_MARKERS.forEach((district) => {
      const color = getCityMarkerColor(district.riskScore);
      const riskLevel = getRiskLevel(district.riskScore);
      const isStation = district.type === 'station';
      const size = district.riskScore >= 80 ? 14 : district.riskScore >= 60 ? 11 : 8;

      const markerHtml = isStation
        ? `<div style="width:${size}px;height:${size}px;border-radius:2px;transform:rotate(45deg);background:${color};border:2px solid white;box-shadow:0 1px 8px rgba(0,0,0,0.3);"></div>`
        : `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 8px rgba(0,0,0,0.3);"></div>`;

      const icon = L.divIcon({
        className: 'city-marker',
        html: markerHtml,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([district.lat, district.lng], { icon });
      marker.bindTooltip(
        `<div style="font-size:11px;text-align:center;min-width:130px;padding:6px 8px;border-left:3px solid ${color};border-radius:6px;">
          <strong>${district.name}</strong> ${isStation ? '📡' : '🏙️'}<br/>
          Risk: <span style="color:${color};font-weight:700;font-size:15px;">${district.riskScore}%</span><br/>
          <span style="text-transform:uppercase;font-size:9px;color:${color};font-weight:600;letter-spacing:0.5px;">${riskLevel}</span>
        </div>`,
        { direction: 'top', offset: [0, -4] }
      );
      marker.on('click', () => onProvinceSelect(district.provinceId));

      if (isStation) {
        marker.addTo(stationGroup);
      } else {
        marker.addTo(cityGroup);
      }
    });

    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  // Layer visibility toggling
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

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
    Object.entries(provincePolygonsRef.current).forEach(([id, polygon]) => {
      const province = provinces.find(p => p.id === id);
      if (!province) return;
      const color = RISK_COLORS[province.riskLevel];
      if (id === selectedProvince) {
        polygon.setStyle({ weight: 3, fillOpacity: 0.25, color: 'hsl(204, 63%, 28%)' });
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyToBounds(polygon.getBounds(), { padding: [40, 40], maxZoom: 7, duration: 0.8 });
        }
      } else {
        polygon.setStyle({ weight: 2, fillOpacity: 0.12, color });
      }
    });
  }, [selectedProvince, provinces]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-xl overflow-hidden border border-border">
      <div ref={mapRef} className="w-full h-full min-h-[380px]" />

      {/* Scale bar */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-card/90 rounded-lg border border-border px-3 py-1.5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="w-16 h-0.5 bg-foreground/50 relative">
              <div className="absolute -left-0.5 -top-1 w-0.5 h-2.5 bg-foreground/50" />
              <div className="absolute -right-0.5 -top-1 w-0.5 h-2.5 bg-foreground/50" />
              <div className="absolute left-1/2 -translate-x-1/2 -top-0.5 w-0.5 h-1.5 bg-foreground/30" />
            </div>
            <span className="text-[8px] font-mono text-muted-foreground mt-0.5">0 ——— 200 km</span>
          </div>
        </div>
      </div>

      {/* Map stats overlay */}
      <div className="absolute bottom-3 right-16 z-[1000] bg-card/90 rounded-lg border border-border px-3 py-2 shadow-sm">
        <div className="text-[9px] font-mono text-muted-foreground space-y-0.5">
          <div>Lat: 30.38° N · Lng: 69.35° E</div>
          <div>Source: NASA GPM/IMERG · MODIS</div>
        </div>
      </div>

      <style>{`
        .leaflet-control-zoom a {
          background: white !important;
          color: hsl(210, 29%, 24%) !important;
          border-color: hsl(214, 18%, 89%) !important;
          border-radius: 8px !important;
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          font-size: 16px !important;
        }
        .leaflet-control-zoom a:hover {
          background: hsl(210, 14%, 95%) !important;
        }
        .leaflet-control-zoom {
          border-radius: 10px !important;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
          border: 1px solid hsl(214, 18%, 89%) !important;
        }
        .leaflet-control-layers {
          border-radius: 10px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
          border: 1px solid hsl(214, 18%, 89%) !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 11px !important;
        }
        .leaflet-control-layers-toggle {
          width: 32px !important;
          height: 32px !important;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0; transform: scale(2); }
        }
      `}</style>
    </div>
  );
}
