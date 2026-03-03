import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Satellite, Calendar, MapPin, ZoomIn, Layers, X, ExternalLink } from 'lucide-react';
import satelliteSindh from '@/assets/satellite-sindh-sukkur.jpg';
import satellitePunjab from '@/assets/satellite-punjab-muzaffargarh.jpg';
import satelliteKPK from '@/assets/satellite-kpk-swat.jpg';
import satelliteBalochistan from '@/assets/satellite-balochistan-lasbela.jpg';

const IMAGERY_DATA = [
  {
    title: 'Sindh — Sukkur',
    coords: '27.70°N, 68.86°E',
    date: 'Feb 14, 2026',
    type: 'Flood Extent',
    sensor: 'Sentinel-2 MSI',
    resolution: '10m',
    band: 'MNDWI',
    image: satelliteSindh,
    riskLevel: 'critical' as const,
    description: 'Active inundation detected along Indus River floodplain. Flood waters covering approximately 12,500 hectares of agricultural land.',
    coverage: '12.5K ha',
    changePercent: '+34%',
  },
  {
    title: 'Punjab — Muzaffargarh',
    coords: '30.07°N, 71.19°E',
    date: 'Feb 13, 2026',
    type: 'Water Bodies',
    sensor: 'MODIS Terra',
    resolution: '250m',
    band: 'NDWI',
    image: satellitePunjab,
    riskLevel: 'high' as const,
    description: 'Expanded water coverage near Chenab-Indus confluence. Water level risen 2.3m above normal seasonal average.',
    coverage: '8.2K ha',
    changePercent: '+21%',
  },
  {
    title: 'KPK — Swat Valley',
    coords: '35.22°N, 72.34°E',
    date: 'Feb 12, 2026',
    type: 'Terrain / NDVI',
    sensor: 'Landsat-9 OLI',
    resolution: '30m',
    band: 'NDVI',
    image: satelliteKPK,
    riskLevel: 'medium' as const,
    description: 'Elevated soil moisture in northern valleys. Vegetation stress patterns indicate early-stage waterlogging in low-lying areas.',
    coverage: '3.8K ha',
    changePercent: '+12%',
  },
  {
    title: 'Balochistan — Lasbela',
    coords: '26.23°N, 66.05°E',
    date: 'Feb 11, 2026',
    type: 'NDVI Change',
    sensor: 'Sentinel-2 MSI',
    resolution: '10m',
    band: 'False Color',
    image: satelliteBalochistan,
    riskLevel: 'medium' as const,
    description: 'Vegetation stress indicating waterlogging in coastal plains. Abnormal NDVI decrease of 0.15 compared to 5-year average.',
    coverage: '5.1K ha',
    changePercent: '+8%',
  },
];

const RISK_BADGE_STYLES: Record<string, string> = {
  low: 'bg-risk-low/15 text-risk-low border-risk-low/30',
  medium: 'bg-risk-medium/15 text-risk-medium border-risk-medium/30',
  high: 'bg-risk-high/15 text-risk-high border-risk-high/30',
  critical: 'bg-risk-critical/15 text-risk-critical border-risk-critical/30',
};

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
            <p className="text-[10px] text-muted-foreground">Multi-spectral remote sensing data</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-muted-foreground px-2 py-1 rounded-md bg-muted border border-border">
            NASA MODIS · Sentinel-2 · Landsat-9
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
            {/* Satellite image */}
            <div className="relative h-36 overflow-hidden">
              <img src={img.image} alt={`${img.title} satellite imagery`} className="w-full h-full object-cover" />
              {/* Coordinate grid overlay */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px',
              }} />
              
              {/* Type & sensor badge */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <div className="bg-black/50 backdrop-blur-sm rounded-md px-2 py-0.5">
                  <span className="text-[8px] font-mono text-white uppercase tracking-wider">{img.type}</span>
                </div>
                <div className="bg-black/40 backdrop-blur-sm rounded-md px-2 py-0.5">
                  <span className="text-[7px] font-mono text-white/80">{img.sensor}</span>
                </div>
              </div>

              {/* Resolution badge */}
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-md px-2 py-0.5">
                <span className="text-[8px] font-mono text-white">{img.resolution}</span>
              </div>

              {/* Coverage change */}
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded-md px-2 py-0.5">
                <span className="text-[9px] font-mono text-white font-semibold">{img.coverage}</span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
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
                    <div className="relative h-56 overflow-hidden">
                      <img src={img.image} alt={`${img.title} satellite imagery`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{
                        backgroundImage: `
                          linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
                        `,
                        backgroundSize: '30px 30px',
                      }} />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                          <span className="text-[10px] font-mono text-white uppercase tracking-wider">{img.type}</span>
                        </div>
                        <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1">
                          <span className="text-[10px] font-mono text-white/80">{img.sensor} · {img.band}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedIndex(null)}
                        className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-1.5 text-white hover:bg-black/70 transition-colors"
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
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Resolution', value: img.resolution },
                          { label: 'Coverage', value: img.coverage },
                          { label: 'Change', value: img.changePercent },
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
                          <span className="font-mono">Band: {img.band}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
                          <ExternalLink className="w-3 h-3" />
                          <span className="font-mono">View in GIS Portal</span>
                        </div>
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
