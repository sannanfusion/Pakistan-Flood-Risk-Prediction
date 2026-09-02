import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ProvinceData } from '@/lib/types';
import { buildDynamicMarkers } from '@/lib/mapMarkers';
import { X, Waves, Satellite, Map as MapIcon, Loader2, Route, Home } from 'lucide-react';

interface SatelliteViewProps {
  provinces: ProvinceData[];
  onClose: () => void;
}

/** Major river corridors — flood water follows these paths downstream. */
const FLOOD_CORRIDORS: { name: string; path: [number, number][] }[] = [
  { name: 'Indus main stem', path: [[35.5, 73.5], [34.2, 72.0], [33.5, 71.5], [32.5, 71.0], [31.5, 70.5], [30.5, 70.0], [29.5, 69.5], [28.5, 68.5], [27.5, 68.0], [26.5, 67.8], [25.5, 67.5], [24.5, 67.3]] },
  { name: 'Chenab corridor', path: [[33.0, 74.8], [32.5, 74.0], [32.0, 73.5], [31.5, 72.5], [31.0, 71.8], [30.5, 71.3], [30.0, 70.8], [29.5, 70.2]] },
  { name: 'Jhelum corridor', path: [[34.0, 74.3], [33.5, 73.8], [33.0, 73.5], [32.5, 73.0], [32.0, 72.5], [31.5, 72.0], [31.0, 71.5]] },
  { name: 'Kabul–Swat corridor', path: [[35.2, 72.3], [34.6, 72.0], [34.15, 71.74], [34.02, 71.97], [33.9, 72.4], [33.6, 72.6]] },
];

function riskColor(score: number) {
  if (score >= 71) return '#ef4444';
  if (score >= 41) return '#f0a323';
  if (score >= 11) return '#22c55e';
  return '#94a3b8';
}

export function SatelliteView({ provinces, onClose }: SatelliteViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const floodGroupRef = useRef<L.LayerGroup | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);
  const [floodFlow, setFloodFlow] = useState(true);
  const [labels, setLabels] = useState(true);
  const [roads, setRoads] = useState(false);
  const [buildings, setBuildings] = useState(false);
  const labelLayerRef = useRef<L.TileLayer | null>(null);
  const roadLayerRef = useRef<L.TileLayer | null>(null);
  const buildingLayerRef = useRef<L.TileLayer | null>(null);
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(6);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [30.3, 69.5],
      zoom: 6,
      minZoom: 4,
      maxZoom: 22,
      zoomSnap: 0.5,
      wheelPxPerZoomLevel: 90,
      zoomControl: false,
      attributionControl: true,
    });

    // High-resolution satellite imagery — resolves cities, villages and individual rooftops.
    // maxNativeZoom 19 with maxZoom 22 lets Leaflet upscale tiles for street/house-level inspection.
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 22, maxNativeZoom: 19, detectRetina: true, attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics' },
    ).addTo(map);

    // Place / road labels on top of imagery for clarity
    const labelLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
      { maxZoom: 22, maxNativeZoom: 20, opacity: 0.95, attribution: '&copy; OpenStreetMap, &copy; CARTO' },
    ).addTo(map);
    labelLayerRef.current = labelLayer;

    // Road & track network (village tracks, lanes, highways) from Esri reference layer
    roadLayerRef.current = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 22, maxNativeZoom: 19, opacity: 0.9, attribution: 'Transportation &copy; Esri' },
    );

    // Building footprints / house outlines from OSM raster
    buildingLayerRef.current = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 22, maxNativeZoom: 19, opacity: 0.45, className: 'osm-buildings', attribution: '&copy; OpenStreetMap contributors' },
    );

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map);
    map.on('zoomend', () => setZoom(map.getZoom()));

    const floodGroup = L.layerGroup().addTo(map);
    const markerGroup = L.layerGroup().addTo(map);
    floodGroupRef.current = floodGroup;
    markerGroupRef.current = markerGroup;

    const small = map.getSize().x < 640;
    map.fitBounds([[23.6, 60.8], [37.1, 77.9]], { padding: small ? [4, 4] : [20, 20] });
    map.whenReady(() => setReady(true));
    mapRef.current = map;

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Markers from the exact same source as the dashboard map
  useEffect(() => {
    const group = markerGroupRef.current;
    if (!group || provinces.length === 0) return;
    group.clearLayers();

    buildDynamicMarkers(provinces).forEach((d) => {
      const color = riskColor(d.riskScore);
      const size = d.fromDistrict ? 18 : 13;
      const icon = L.divIcon({
        className: 'sat-marker',
        html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:radial-gradient(circle at 35% 28%, #ffffff88, ${color});border:1.6px solid #fff;box-shadow:0 0 0 2px ${color}55, 0 2px 6px rgba(0,0,0,.6);"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
      L.marker([d.lat, d.lng], { icon })
        .addTo(group)
        .bindTooltip(
          `<div style="font-family:Inter,sans-serif;padding:8px 10px;background:#0f1a22;color:#f1f7fa;border-radius:10px;border:1px solid rgba(255,255,255,.1);font-size:11px;">
            <b>${d.name}</b><br/><span style="color:${color};font-weight:800;font-size:15px;">${d.riskScore}</span><span style="color:#93a4b1;">/100</span>
          </div>`,
          { direction: 'top', offset: [0, -8], className: 'clean-tooltip' },
        );
    });
  }, [provinces]);

  // Flood flow / expected inundation overlay
  useEffect(() => {
    const group = floodGroupRef.current;
    if (!group) return;
    group.clearLayers();
    if (!floodFlow || provinces.length === 0) return;

    FLOOD_CORRIDORS.forEach((c) => {
      L.polyline(c.path, { color: '#1d4ed8', weight: 16, opacity: 0.18, lineCap: 'round' }).addTo(group);
      L.polyline(c.path, { color: '#60a5fa', weight: 4, opacity: 0.9, lineCap: 'round', className: 'flood-flow-line' })
        .addTo(group)
        .bindTooltip(`<div style="font-family:Inter,sans-serif;font-size:11px;padding:6px 10px;background:#0f1a22;color:#e8f1f5;border-radius:8px;">Expected flood flow · ${c.name}</div>`, {
          sticky: true, className: 'clean-tooltip',
        });
    });

    // Expected inundation footprints around at-risk locations
    buildDynamicMarkers(provinces)
      .filter((d) => d.riskScore >= 41)
      .forEach((d) => {
        const high = d.riskScore >= 71;
        L.circle([d.lat, d.lng], {
          radius: (high ? 32000 : 18000) * (d.riskScore / 100 + 0.5),
          color: high ? '#1d4ed8' : '#3b82f6',
          weight: 1.2,
          fillColor: high ? '#1d4ed8' : '#3b82f6',
          fillOpacity: high ? 0.26 : 0.15,
          dashArray: high ? undefined : '5 4',
        })
          .addTo(group)
          .bindTooltip(
            `<div style="font-family:Inter,sans-serif;font-size:11px;padding:6px 10px;background:#0f1a22;color:#e8f1f5;border-radius:8px;">${d.name} — ${high ? 'high' : 'moderate'} inundation expected</div>`,
            { sticky: true, className: 'clean-tooltip' },
          );
      });
  }, [floodFlow, provinces]);

  // Toggle overlay tile layers
  useEffect(() => {
    const map = mapRef.current;
    const pairs: [boolean, L.TileLayer | null][] = [
      [labels, labelLayerRef.current],
      [roads, roadLayerRef.current],
      [buildings, buildingLayerRef.current],
    ];
    if (!map) return;
    pairs.forEach(([on, layer]) => {
      if (!layer) return;
      if (on && !map.hasLayer(layer)) map.addLayer(layer);
      if (!on && map.hasLayer(layer)) map.removeLayer(layer);
    });
    // keep labels drawn above the other overlays
    if (labels && labelLayerRef.current) labelLayerRef.current.bringToFront();
  }, [labels, roads, buildings]);

  return (
    <div className="fixed inset-0 z-[3000] bg-background">
      <div ref={containerRef} className="absolute inset-0" />

      {!ready && (
        <div className="absolute inset-0 z-[10] flex items-center justify-center bg-background/80">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {/* Header controls */}
      <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 z-[1000] flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-lg">
          <Satellite className="w-4 h-4 text-primary shrink-0" />
          <span className="text-[11px] sm:text-[12px] font-bold text-foreground whitespace-nowrap">Satellite View</span>
        </div>

        <button
          onClick={() => setFloodFlow((v) => !v)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] sm:text-[12px] font-semibold shadow-lg transition-colors ${
            floodFlow
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card/95 backdrop-blur-md text-foreground border-border'
          }`}
        >
          <Waves className="w-4 h-4" />
          <span className="whitespace-nowrap">Flood Flow</span>
        </button>

        <button
          onClick={() => setLabels((v) => !v)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] sm:text-[12px] font-semibold shadow-lg transition-colors ${
            labels
              ? 'bg-primary/15 text-primary border-primary/40'
              : 'bg-card/95 backdrop-blur-md text-muted-foreground border-border'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span className="whitespace-nowrap">Labels</span>
        </button>

        <button
          onClick={() => setRoads((v) => !v)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] sm:text-[12px] font-semibold shadow-lg transition-colors ${
            roads
              ? 'bg-primary/15 text-primary border-primary/40'
              : 'bg-card/95 backdrop-blur-md text-muted-foreground border-border'
          }`}
        >
          <Route className="w-4 h-4" />
          <span className="whitespace-nowrap">Roads</span>
        </button>

        <button
          onClick={() => setBuildings((v) => !v)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] sm:text-[12px] font-semibold shadow-lg transition-colors ${
            buildings
              ? 'bg-primary/15 text-primary border-primary/40'
              : 'bg-card/95 backdrop-blur-md text-muted-foreground border-border'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="whitespace-nowrap">Houses</span>
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-lg">
          <span className="text-[10.5px] font-mono font-bold text-primary">z{zoom.toFixed(1)}</span>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {zoom >= 17 ? 'house level' : zoom >= 13 ? 'village / town' : 'regional'}
          </span>
        </div>

        <button
          onClick={onClose}
          className="ml-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-card/95 backdrop-blur-md border border-border text-[11px] sm:text-[12px] font-semibold text-foreground shadow-lg"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Exit</span>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-16 left-2 sm:bottom-20 sm:left-3 z-[1000] bg-card/95 backdrop-blur-md rounded-xl border border-border px-2.5 py-2 shadow-lg max-w-[46vw]">
        <div className="text-[10px] sm:text-[11px] font-semibold text-foreground mb-1.5">
          {floodFlow ? 'Flood Flow & Risk' : 'Risk Markers'}
        </div>
        <div className="flex flex-col gap-1">
          {[
            { label: 'High risk', color: '#ef4444' },
            { label: 'Medium risk', color: '#f0a323' },
            { label: 'Low risk', color: '#22c55e' },
          ].map((i) => (
            <div key={i.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-white/70 shrink-0" style={{ background: i.color }} />
              <span className="text-[9.5px] sm:text-[10.5px] text-muted-foreground whitespace-nowrap">{i.label}</span>
            </div>
          ))}
          {floodFlow && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-[3px] rounded-full shrink-0" style={{ background: '#60a5fa' }} />
                <span className="text-[9.5px] sm:text-[10.5px] text-muted-foreground whitespace-nowrap">Flow path</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: 'rgba(29,78,216,0.4)', border: '1px solid #1d4ed8' }} />
                <span className="text-[9.5px] sm:text-[10.5px] text-muted-foreground whitespace-nowrap">Expected inundation</span>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .flood-flow-line { stroke-dasharray: 14 10; animation: floodDash 1.6s linear infinite; }
        @keyframes floodDash { to { stroke-dashoffset: -24; } }
        .sat-marker { transition: transform .15s ease; }
        .sat-marker:hover { transform: scale(1.25); z-index: 900 !important; }
        .clean-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        .clean-tooltip::before { display: none !important; }
      `}</style>
    </div>
  );
}
