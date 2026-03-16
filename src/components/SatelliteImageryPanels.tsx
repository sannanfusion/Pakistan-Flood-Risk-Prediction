import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Satellite, Calendar, MapPin, ZoomIn, Layers, X, ExternalLink, RefreshCw } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SatelliteRegion {
  title: string;
  coords: string;
  center: [number, number];
  zoom: number;
  date: string;
  type: string;
  sensor: string;
  resolution: string;
  band: string;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  coverage: string;
  changePercent: string;
  gibsLayer: string;
  gibsDate: string;
  overlayLabel: string;
}

const IMAGERY_DATA: SatelliteRegion[] = [
  {
    title: 'Sindh — Sukkur',
    coords: '27.70°N, 68.86°E',
    center: [27.7, 68.86],
    zoom: 8,
    date: 'Mar 14, 2026',
    type: 'Flood Extent',
    sensor: 'MODIS Terra',
    resolution: '250m',
    band: 'MNDWI',
    riskLevel: 'high',
    description: 'Active inundation detected along Indus River floodplain. MODIS true-color imagery shows water extent changes across approximately 12,500 hectares of agricultural land.',
    coverage: '12.5K ha',
    changePercent: '+34%',
    gibsLayer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    gibsDate: '2024-09-10',
    overlayLabel: 'MODIS True Color',
  },
  {
    title: 'Punjab — Muzaffargarh',
    coords: '30.07°N, 71.19°E',
    center: [30.07, 71.19],
    zoom: 9,
    date: 'Mar 13, 2026',
    type: 'Water Bodies',
    sensor: 'VIIRS SNPP',
    resolution: '375m',
    band: 'NDWI',
    riskLevel: 'high',
    description: 'Expanded water coverage near Chenab-Indus confluence detected via VIIRS. Water level risen 2.3m above normal seasonal average.',
    coverage: '8.2K ha',
    changePercent: '+21%',
    gibsLayer: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    gibsDate: '2024-09-12',
    overlayLabel: 'VIIRS True Color',
  },
  {
    title: 'KPK — Swat Valley',
    coords: '35.22°N, 72.34°E',
    center: [35.22, 72.34],
    zoom: 9,
    date: 'Mar 12, 2026',
    type: 'Terrain / NDVI',
    sensor: 'MODIS Aqua',
    resolution: '250m',
    band: 'NDVI',
    riskLevel: 'medium',
    description: 'Elevated soil moisture in northern valleys. MODIS vegetation index analysis shows stress patterns indicating early-stage waterlogging in low-lying areas.',
    coverage: '3.8K ha',
    changePercent: '+12%',
    gibsLayer: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
    gibsDate: '2024-09-08',
    overlayLabel: 'MODIS Aqua',
  },
  {
    title: 'Balochistan — Lasbela',
    coords: '26.23°N, 66.05°E',
    center: [26.23, 66.05],
    zoom: 8,
    date: 'Mar 11, 2026',
    type: 'NDVI Change',
    sensor: 'MODIS Terra',
    resolution: '250m',
    band: 'False Color',
    riskLevel: 'medium',
    description: 'Vegetation stress indicating waterlogging in coastal plains. MODIS false-color composite reveals abnormal NDVI decrease of 0.15 compared to 5-year average.',
    coverage: '5.1K ha',
    changePercent: '+8%',
    gibsLayer: 'MODIS_Terra_CorrectedReflectance_Bands721',
    gibsDate: '2024-09-10',
    overlayLabel: 'MODIS Bands 7-2-1',
  },
];

const RISK_BADGE_STYLES: Record<string, string> = {
  low: 'bg-risk-low/15 text-risk-low border-risk-low/30',
  medium: 'bg-risk-medium/15 text-risk-medium border-risk-medium/30',
  high: 'bg-risk-high/15 text-risk-high border-risk-high/30',
};

function SatelliteMiniMap({ region, height = 144 }: { region: SatelliteRegion; height?: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: region.center,
      zoom: region.zoom,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false,
      boxZoom: false,
    });

    // NASA GIBS WMTS layer — real satellite imagery
    const gibsUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${region.gibsLayer}/default/${region.gibsDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

    L.tileLayer(gibsUrl, {
      maxZoom: 9,
      tileSize: 256,
      errorTileUrl: '',
    }).addTo(map);

    // Add subtle boundary overlay for context
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 12,
      opacity: 0.5,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [region]);

  return (
    <div
      ref={mapRef}
      style={{ height: `${height}px` }}
      className="w-full"
    />
  );
}

function ExpandedSatelliteMap({ region }: { region: SatelliteRegion }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: region.center,
      zoom: region.zoom + 1,
      zoomControl: true,
      attributionControl: false,
      minZoom: 5,
      maxZoom: 9,
    });

    const gibsUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${region.gibsLayer}/default/${region.gibsDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

    L.tileLayer(gibsUrl, {
      maxZoom: 9,
      tileSize: 256,
    }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 12,
      opacity: 0.6,
    }).addTo(map);

    // Center marker
    L.circleMarker(region.center, {
      radius: 6,
      color: '#ef4444',
      weight: 2,
      fillColor: '#ef4444',
      fillOpacity: 0.3,
    }).addTo(map).bindTooltip(region.title, { permanent: true, direction: 'top', className: 'clean-tooltip-sat' });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [region]);

  return (
    <>
      <div ref={mapRef} className="w-full h-56" />
      <style>{`
        .clean-tooltip-sat {
          background: rgba(0,0,0,0.7) !important;
          border: none !important;
          color: white !important;
          font-size: 11px !important;
          font-family: 'Inter', sans-serif !important;
          font-weight: 600 !important;
          padding: 4px 8px !important;
          border-radius: 6px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        }
        .clean-tooltip-sat::before { display: none !important; }
      `}</style>
    </>
  );
}

export function SatelliteImageryPanels() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Satellite className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Satellite Imagery Analysis</h3>
            <p className="text-[10px] text-muted-foreground">Live NASA GIBS multi-spectral remote sensing data</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-muted-foreground px-2 py-1 rounded-md bg-muted border border-border flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3" />
            NASA GIBS · MODIS · VIIRS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {IMAGERY_DATA.map((img, i) => (
          <motion.div
            key={img.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="group rounded-xl border border-border overflow-hidden bg-card hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => setExpandedIndex(i)}
          >
            {/* Live satellite mini-map */}
            <div className="relative h-36 overflow-hidden">
              <SatelliteMiniMap region={img} />

              {/* Coordinate grid overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px',
              }} />

              {/* Type & sensor badge */}
              <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5">
                  <span className="text-[8px] font-mono text-white uppercase tracking-wider">{img.type}</span>
                </div>
                <div className="bg-black/50 backdrop-blur-sm rounded-md px-2 py-0.5">
                  <span className="text-[7px] font-mono text-white/80">{img.overlayLabel}</span>
                </div>
              </div>

              {/* Resolution badge */}
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5 pointer-events-none">
                <span className="text-[8px] font-mono text-white">{img.resolution}</span>
              </div>

              {/* Coverage */}
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5 pointer-events-none">
                <span className="text-[9px] font-mono text-white font-semibold">{img.coverage}</span>
              </div>

              {/* Live indicator */}
              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5 flex items-center gap-1 pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[7px] font-mono text-white/80">GIBS</span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-lg px-3 py-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-foreground" />
                  <span className="text-xs font-medium text-foreground">View Details</span>
                </div>
              </div>
            </div>

            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="text-[11px] font-semibold text-foreground truncate">{img.title}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-mono">{img.date}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase ml-auto border ${RISK_BADGE_STYLES[img.riskLevel]}`}>
                  {img.riskLevel}
                </span>
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground">
                <span>{img.coords}</span>
                <span className="text-risk-high font-semibold">{img.changePercent}</span>
              </div>

              <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{img.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded detail modal */}
      <AnimatePresence>
        {expandedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setExpandedIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl border border-border shadow-2xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const img = IMAGERY_DATA[expandedIndex];
                return (
                  <>
                    <div className="relative overflow-hidden">
                      <ExpandedSatelliteMap region={img} />
                      <div className="absolute inset-0 pointer-events-none" style={{
                        backgroundImage: `
                          linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
                        `,
                        backgroundSize: '30px 30px',
                      }} />
                      <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
                        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
                          <span className="text-[10px] font-mono text-white uppercase tracking-wider">{img.type}</span>
                        </div>
                        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                          <span className="text-[10px] font-mono text-white/80">{img.sensor} · {img.band}</span>
                        </div>
                        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-mono text-white/80">NASA GIBS Live</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedIndex(null)}
                        className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-1.5 text-white hover:bg-black/70 transition-colors z-[1000]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold text-foreground">{img.title}</h3>
                          <p className="text-xs text-muted-foreground font-mono">{img.coords} · {img.date}</p>
                        </div>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase border ${RISK_BADGE_STYLES[img.riskLevel]}`}>
                          {img.riskLevel}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{img.description}</p>
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { label: 'Resolution', value: img.resolution },
                          { label: 'Coverage', value: img.coverage },
                          { label: 'Change', value: img.changePercent },
                          { label: 'Source', value: 'NASA GIBS' },
                        ].map((stat) => (
                          <div key={stat.label} className="bg-muted rounded-xl p-3 text-center">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                            <div className="text-sm font-bold font-mono text-foreground mt-0.5">{stat.value}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Layers className="w-3 h-3" />
                          <span className="font-mono">Layer: {img.overlayLabel} · {img.gibsDate}</span>
                        </div>
                        <a
                          href={`https://worldview.earthdata.nasa.gov/?l=${img.gibsLayer}&t=${img.gibsDate}&v=${img.center[1] - 2},${img.center[0] - 2},${img.center[1] + 2},${img.center[0] + 2}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] text-primary hover:underline ml-auto"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="font-mono">Open in NASA Worldview</span>
                        </a>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
