import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ProvinceData } from '@/lib/types';
import { LayerVisibility } from './MapLayersPanel';
import PK_GEO from '@/data/pakistanProvinces.geo.json';
import { DynamicMarker, buildDynamicMarkers } from '@/lib/mapMarkers';

interface LeafletMapProps {
  provinces: ProvinceData[];
  selectedProvince: string | null;
  onProvinceSelect: (id: string) => void;
  layerVisibility?: LayerVisibility;
}

/** geoJSON shapeName -> backend province id */
const GEO_TO_ID: Record<string, string> = {
  Sindh: 'sindh',
  Punjab: 'punjab',
  'Khyber Pakhtunkhwa': 'kpk',
  Balochistan: 'balochistan',
  'Gilgit-Baltistan': 'gb',
  'Azad Kashmir': 'ajk',
  'Islamabad Capital Territory': 'punjab',
};

/** Label anchors, matching the reference layout (label sits over/next to the region) */
const PROVINCE_LABELS: { id: string; text: string; at: [number, number] }[] = [
  { id: 'kpk', text: 'Khyber Pakhtunkhwa', at: [34.9, 71.2] },
  { id: 'gb', text: 'Gilgit-Baltistan', at: [36.1, 75.6] },
  { id: 'ajk', text: 'Azad Jammu & Kashmir', at: [34.0, 74.4] },
  { id: 'punjab', text: 'Punjab', at: [30.7, 72.4] },
  { id: 'sindh', text: 'Sindh', at: [26.0, 68.6] },
  { id: 'balochistan', text: 'Balochistan', at: [28.6, 65.4] },
];

const RIVERS: { name: string; path: [number, number][]; width: number }[] = [
  { name: 'Indus River', path: [[36.8, 75.5], [36.0, 74.5], [35.5, 73.5], [35.0, 72.8], [34.2, 72.0], [33.5, 71.5], [32.5, 71.0], [31.5, 70.5], [30.5, 70.0], [29.5, 69.5], [28.5, 68.5], [27.5, 68.0], [26.5, 67.8], [25.5, 67.5], [24.5, 67.3], [23.8, 67.5]], width: 3 },
  { name: 'Chenab River', path: [[33.5, 75.5], [33.0, 74.8], [32.5, 74.0], [32.0, 73.5], [31.5, 72.5], [31.0, 71.8], [30.5, 71.3], [30.0, 70.8], [29.5, 70.2]], width: 2.5 },
  { name: 'Jhelum River', path: [[34.5, 74.8], [34.0, 74.3], [33.5, 73.8], [33.0, 73.5], [32.5, 73.0], [32.0, 72.5], [31.5, 72.0], [31.0, 71.5]], width: 2 },
  { name: 'Ravi River', path: [[32.5, 75.5], [32.0, 74.8], [31.5, 74.3], [31.0, 73.5], [30.5, 72.8], [30.0, 71.5]], width: 2 },
  { name: 'Sutlej River', path: [[31.0, 75.5], [30.5, 74.5], [30.0, 73.5], [29.5, 72.5], [29.0, 71.5], [28.8, 70.5]], width: 2 },
];

const FLOOD_ZONES: { path: [number, number][]; severity: 'light' | 'moderate' | 'heavy' }[] = [
  { path: [[27.8, 68.2], [27.5, 68.5], [27.0, 68.8], [26.5, 68.5], [26.0, 68.2], [25.8, 68.5], [26.2, 68.8], [26.8, 69.0], [27.3, 68.9], [27.8, 68.6], [27.8, 68.2]], severity: 'heavy' },
  { path: [[30.5, 70.5], [30.2, 70.8], [29.8, 71.0], [29.5, 70.8], [29.3, 70.5], [29.5, 70.2], [29.8, 70.0], [30.2, 70.2], [30.5, 70.5]], severity: 'moderate' },
  { path: [[34.5, 71.8], [34.2, 72.0], [33.8, 72.2], [33.5, 72.0], [33.5, 71.6], [33.8, 71.4], [34.2, 71.5], [34.5, 71.8]], severity: 'light' },
];

const FLOOD_COLORS = {
  light: { fill: 'rgba(96,165,250,0.18)', border: 'rgba(59,130,246,0.45)' },
  moderate: { fill: 'rgba(59,130,246,0.22)', border: 'rgba(37,99,235,0.55)' },
  heavy: { fill: 'rgba(37,99,235,0.26)', border: 'rgba(29,78,216,0.65)' },
};

function getRiskLevel(score: number) {
  if (score >= 71) return 'high';
  if (score >= 41) return 'medium';
  if (score >= 11) return 'low';
  return 'no';
}

function getMarkerColor(score: number) {
  if (score >= 71) return { bg: '#ef4444', hi: '#fca5a5', border: '#7f1d1d', glow: 'rgba(239,68,68,0.22)' };
  if (score >= 41) return { bg: '#f0a323', hi: '#fcd34d', border: '#78350f', glow: 'rgba(240,163,35,0.22)' };
  if (score >= 11) return { bg: '#22c55e', hi: '#86efac', border: '#14532d', glow: 'rgba(34,197,94,0.22)' };
  return { bg: '#7c8794', hi: '#cbd5e1', border: '#334155', glow: 'rgba(124,135,148,0.22)' };
}

/** Province fill: risk score drives the green → amber → red ramp seen in the reference. */
function provinceFill(score: number) {
  if (score >= 71) return '#c02626';
  if (score >= 55) return '#c9821f';
  if (score >= 41) return '#8f9c26';
  if (score >= 11) return '#2b8f55';
  return '#2f7a4f';
}


/** Glossy circular pin, matching the reference markers. */
function createCityMarkerHtml(d: DynamicMarker) {
  const c = getMarkerColor(d.riskScore);
  const size = d.fromDistrict ? 20 : 15;
  const r = size / 2;

  return `<div style="position:relative;width:${size}px;height:${size}px;cursor:pointer;">
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="display:block;filter:drop-shadow(0 2px 5px rgba(0,0,0,0.55));">
      <defs>
        <radialGradient id="g${d.name.replace(/[^a-zA-Z]/g, '')}" cx="35%" cy="28%" r="75%">
          <stop offset="0%" stop-color="${c.hi}"/>
          <stop offset="55%" stop-color="${c.bg}"/>
          <stop offset="100%" stop-color="${c.border}"/>
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10.2" fill="url(#g${d.name.replace(/[^a-zA-Z]/g, '')})" stroke="#ffffff" stroke-width="1.6"/>
      <ellipse cx="9.6" cy="8.4" rx="4" ry="2.6" fill="#ffffff" opacity="0.35"/>
    </svg>
    ${d.riskScore >= 71 ? `<div style="position:absolute;top:${-r * 0.5}px;left:${-r * 0.5}px;width:${size * 1.5}px;height:${size * 1.5}px;border-radius:50%;border:2px solid ${c.bg};opacity:0.5;animation:markerPulse 2s ease-out infinite;"></div>` : ''}
  </div>`;
}

function createTooltipHtml(d: DynamicMarker) {
  const c = getMarkerColor(d.riskScore);
  const riskLabel = getRiskLevel(d.riskScore);

  return `<div style="
    font-family:'Inter',system-ui,sans-serif;
    min-width:140px;padding:10px 12px;
    background:#0f1a22;border-radius:12px;
    box-shadow:0 10px 30px rgba(0,0,0,0.55);
    border:1px solid rgba(255,255,255,0.08);
    border-left:4px solid ${c.bg};
  ">
    <div style="font-size:12px;font-weight:700;color:#f1f7fa;margin-bottom:6px;">${d.name}</div>
    <div style="display:flex;align-items:baseline;gap:4px;margin-bottom:4px;">
      <span style="font-size:22px;font-weight:800;color:${c.bg};line-height:1;">${d.riskScore}</span>
      <span style="font-size:10px;color:#93a4b1;font-weight:500;">/ 100</span>
    </div>
    <div style="display:inline-block;font-size:9px;font-weight:700;color:${c.bg};background:${c.glow};padding:2px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px;">${riskLabel} RISK</div>
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
  const provinceShapesRef = useRef<Record<string, L.Path[]>>({});

  // Base map — Pakistan only, no basemap tiles so no other country is drawn
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [30.3, 69.5],
      zoom: 5,
      zoomSnap: 0.25,
      zoomControl: false,
      attributionControl: false,
      minZoom: 4,
      maxZoom: 11,
      maxBounds: [[18, 55], [43, 84]],
      maxBoundsViscosity: 0.9,
    });

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

    FLOOD_ZONES.forEach((zone) => {
      const colors = FLOOD_COLORS[zone.severity];
      L.polygon(zone.path, {
        color: colors.border,
        weight: 1.2,
        fillColor: colors.fill,
        fillOpacity: 0.55,
        dashArray: zone.severity === 'light' ? '6 4' : undefined,
      }).addTo(floodGroup);
    });

    RIVERS.forEach((river) => {
      L.polyline(river.path, {
        color: '#93c5fd', weight: river.width, opacity: 0.55, lineCap: 'round', lineJoin: 'round',
      }).addTo(riverGroup).bindTooltip(
        `<div style="font-family:'Inter',sans-serif;font-size:11px;padding:6px 10px;background:#0f1a22;color:#e8f1f5;border-radius:8px;border:1px solid rgba(255,255,255,0.08);">💧 ${river.name}</div>`,
        { sticky: true, direction: 'top', className: 'clean-tooltip' },
      );
    });

    map.fitBounds([[23.6, 60.8], [37.1, 77.9]], { padding: [10, 10] });

    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  // Province shapes + markers, rebuilt from live API data
  useEffect(() => {
    const provinceGroup = provinceLayersRef.current;
    const cityGroup = cityLayersRef.current;
    const stationGroup = stationLayersRef.current;
    if (!provinceGroup || !cityGroup || !stationGroup || provinces.length === 0) return;

    provinceGroup.clearLayers();
    cityGroup.clearLayers();
    stationGroup.clearLayers();
    provinceShapesRef.current = {};

    const geo = L.geoJSON(PK_GEO as GeoJSON.GeoJsonObject, {
      style: (feature) => {
        const id = GEO_TO_ID[(feature?.properties as { name: string } | undefined)?.name ?? ''] ?? '';
        const province = provinces.find((p) => p.id === id);
        const score = province?.riskScore ?? 0;
        return {
          color: '#ffffff',
          weight: 1.4,
          opacity: 0.9,
          fillColor: provinceFill(score),
          fillOpacity: 0.9,
        };
      },
      onEachFeature: (feature, layer) => {
        const id = GEO_TO_ID[(feature.properties as { name: string }).name] ?? '';
        const province = provinces.find((p) => p.id === id);
        if (!province) return;
        const path = layer as L.Path;
        (provinceShapesRef.current[id] ||= []).push(path);

        layer.bindTooltip(
          `<div style="font-family:'Inter',sans-serif;padding:10px 14px;background:#0f1a22;border-radius:12px;border:1px solid rgba(255,255,255,0.08);box-shadow:0 12px 30px rgba(0,0,0,0.55);min-width:140px;">
            <div style="font-size:13px;font-weight:800;color:#f1f7fa;margin-bottom:6px;">${province.name}</div>
            <div style="font-size:24px;font-weight:900;color:#f1f7fa;line-height:1;">${province.riskScore}<span style="font-size:10px;color:#93a4b1;font-weight:600;">/100</span></div>
            <div style="font-size:10px;color:#93a4b1;margin-top:6px;">${province.rainfall7Day}mm rain · ${(province.population / 1e6).toFixed(1)}M people</div>
          </div>`,
          { sticky: true, className: 'clean-tooltip' },
        );
        layer.on('click', () => onProvinceSelect(province.id));
      },
    });

    // soft outer glow / country outline so the full national boundary always reads clearly
    L.geoJSON(PK_GEO as GeoJSON.GeoJsonObject, {
      style: { color: '#7dd3fc', weight: 6, opacity: 0.18, fill: false },
      interactive: false,
    }).addTo(provinceGroup);

    geo.addTo(provinceGroup);

    // Frame the whole country from the actual geometry so nothing is cropped
    const map = mapInstanceRef.current;
    const bounds = geo.getBounds();
    if (map && bounds.isValid()) {
      map.setMaxBounds(bounds.pad(0.8));
      map.invalidateSize();
      map.fitBounds(bounds, { padding: [12, 12] });
    }

    // Province name labels
    PROVINCE_LABELS.forEach((label) => {
      if (!provinces.some((p) => p.id === label.id)) return;
      const icon = L.divIcon({
        className: 'province-label-marker',
        html: `<div style="font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:#ffffff;text-shadow:0 2px 6px rgba(0,0,0,0.85);white-space:nowrap;pointer-events:none;transform:translate(-50%,-50%);">${label.text}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });
      L.marker(label.at, { icon, interactive: false }).addTo(provinceGroup);
    });

    // Risk markers — same tier logic as before
    buildDynamicMarkers(provinces).forEach((district) => {
      const size = district.fromDistrict ? 20 : 15;
      const icon = L.divIcon({
        className: 'district-marker',
        html: createCityMarkerHtml(district),
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([district.lat, district.lng], { icon });
      marker.bindTooltip(createTooltipHtml(district), {
        direction: 'top', offset: [0, -8], className: 'clean-tooltip',
      });
      marker.on('click', () => onProvinceSelect(district.provinceId));

      if (district.type === 'station') marker.addTo(stationGroup);
      else marker.addTo(cityGroup);
    });
  }, [provinces, onProvinceSelect]);

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
    Object.entries(provinceShapesRef.current).forEach(([id, paths]) => {
      paths.forEach((path) => {
        path.setStyle(
          id === selectedProvince
            ? { weight: 2.6, opacity: 1, fillOpacity: 1 }
            : { weight: 1.4, opacity: 0.9, fillOpacity: 0.9 },
        );
      });
    });
  }, [selectedProvince, provinces]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden border border-border">
      <div
        ref={mapRef}
        className="w-full h-full min-h-[380px]"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 40%, #0d1c26 0%, #08131b 45%, #050c12 100%)',
        }}
      />

      {/* Flood Risk Level legend */}
      <div className="absolute top-3 left-3 z-[1000] bg-card/92 backdrop-blur-md rounded-xl border border-border px-3.5 py-3 shadow-lg">
        <div className="text-[11.5px] font-semibold text-foreground mb-2">Flood Risk Level</div>
        <div className="flex flex-col gap-1.5">
          {[
            { label: 'High Risk (71-100)', color: '#ef4444' },
            { label: 'Medium Risk (41-70)', color: '#f0a323' },
            { label: 'Low Risk (11-40)', color: '#22c55e' },
            { label: 'No Risk (0-10)', color: '#7c8794' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/70" style={{ background: item.color }} />
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Source badge */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-card/92 backdrop-blur-md rounded-xl border border-border px-3 py-1.5">
        <div className="text-[9.5px] font-mono text-muted-foreground">NASA GPM/IMERG · NDMA · WAPDA</div>
      </div>

      <style>{`
        .leaflet-container { background: transparent !important; }
        .leaflet-control-zoom a {
          background: hsl(var(--card)) !important;
          color: hsl(var(--foreground)) !important;
          border-color: hsl(var(--border)) !important;
          width: 32px !important; height: 32px !important; line-height: 32px !important;
          font-size: 15px !important; font-weight: 300 !important;
        }
        .leaflet-control-zoom a:hover { background: hsl(var(--muted)) !important; }
        .leaflet-control-zoom {
          border-radius: 10px !important; overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5) !important;
          border: 1px solid hsl(var(--border)) !important;
        }
        .clean-tooltip, .dark-tooltip {
          background: transparent !important; border: none !important;
          box-shadow: none !important; padding: 0 !important;
        }
        .clean-tooltip::before, .dark-tooltip::before { display: none !important; }
        .district-marker { transition: transform 0.15s ease; }
        .district-marker:hover { transform: scale(1.25); z-index: 900 !important; }
        @keyframes markerPulse {
          0% { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0; transform: scale(2.2); }
        }
      `}</style>
    </div>
  );
}
