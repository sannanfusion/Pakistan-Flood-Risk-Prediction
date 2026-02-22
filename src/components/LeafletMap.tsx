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
      maxZoom: 10,
    });

    // ESRI World Imagery (free satellite tiles)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri',
    }).addTo(map);

    // Add zoom control to bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add province polygons
    provinces.forEach((province) => {
      const coords = PROVINCE_POLYGONS[province.id];
      if (!coords) return;

      const color = RISK_COLORS[province.riskLevel];
      const polygon = L.polygon(coords, {
        color: color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.25,
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
          html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};box-shadow:0 0 12px ${color};animation:pulse 2s infinite;"></div>`,
          iconSize: [14, 14],
        });
        L.marker([province.coordinates.lat, province.coordinates.lng], { icon: alertIcon }).addTo(map);
      }

      layersRef.current[province.id] = polygon;
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
        polygon.setStyle({ weight: 3, fillOpacity: 0.45, color: 'hsl(187, 72%, 68%)' });
      } else {
        polygon.setStyle({ weight: 2, fillOpacity: 0.25, color });
      }
    });
  }, [selectedProvince, provinces]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full min-h-[400px]" />
      <style>{`
        .map-tooltip {
          background: hsl(222, 44%, 9%) !important;
          border: 1px solid hsl(222, 30%, 18%) !important;
          border-radius: 8px !important;
          color: hsl(210, 40%, 93%) !important;
          padding: 8px 12px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
        }
        .map-tooltip::before {
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
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
