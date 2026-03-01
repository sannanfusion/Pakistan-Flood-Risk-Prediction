import { motion } from 'framer-motion';
import { Satellite, Calendar, MapPin } from 'lucide-react';

const IMAGERY_DATA = [
  {
    title: 'Sindh — Sukkur',
    date: 'Feb 14, 2026',
    type: 'Flood Extent',
    gradient: 'from-blue-400 via-blue-600 to-blue-900',
    overlay: 'rgba(30, 64, 175, 0.3)',
    riskLevel: 'critical' as const,
    description: 'Active inundation detected along Indus River floodplain',
  },
  {
    title: 'Punjab — Muzaffargarh',
    date: 'Feb 13, 2026',
    type: 'Water Bodies',
    gradient: 'from-teal-400 via-cyan-600 to-blue-800',
    overlay: 'rgba(13, 148, 136, 0.3)',
    riskLevel: 'high' as const,
    description: 'Expanded water coverage near Chenab-Indus confluence',
  },
  {
    title: 'KPK — Swat Valley',
    date: 'Feb 12, 2026',
    type: 'Terrain Analysis',
    gradient: 'from-emerald-500 via-green-700 to-emerald-900',
    overlay: 'rgba(5, 150, 105, 0.3)',
    riskLevel: 'medium' as const,
    description: 'Elevated soil moisture in northern valleys',
  },
  {
    title: 'Balochistan — Lasbela',
    date: 'Feb 11, 2026',
    type: 'NDVI Change',
    gradient: 'from-amber-400 via-orange-600 to-red-800',
    overlay: 'rgba(217, 119, 6, 0.3)',
    riskLevel: 'medium' as const,
    description: 'Vegetation stress indicating waterlogging',
  },
];

const RISK_BADGE_STYLES = {
  low: 'bg-risk-low/15 text-risk-low',
  medium: 'bg-risk-medium/15 text-risk-medium',
  high: 'bg-risk-high/15 text-risk-high',
  critical: 'bg-risk-critical/15 text-risk-critical',
};

export function SatelliteImageryPanels() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg" style={{ background: 'hsl(204, 63%, 28%, 0.1)' }}>
          <Satellite className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Satellite Imagery Analysis</h3>
        <span className="text-[10px] font-mono text-muted-foreground ml-auto">NASA MODIS / Sentinel-2</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {IMAGERY_DATA.map((img, i) => (
          <motion.div
            key={img.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="group rounded-xl border border-border overflow-hidden bg-card hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            {/* Simulated satellite image */}
            <div className={`relative h-28 bg-gradient-to-br ${img.gradient} overflow-hidden`}>
              {/* Grid overlay to simulate satellite imagery */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(${img.overlay} 1px, transparent 1px),
                  linear-gradient(90deg, ${img.overlay} 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }} />
              {/* Simulated features */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-3 left-4 w-16 h-8 rounded-full bg-white/20 blur-sm" />
                <div className="absolute bottom-4 right-3 w-12 h-12 rounded-full bg-white/15 blur-md" />
                <div className="absolute top-1/2 left-1/3 w-20 h-1 bg-white/30 rotate-12" />
              </div>
              {/* Type badge */}
              <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm rounded-md px-2 py-0.5">
                <span className="text-[9px] font-mono text-white uppercase tracking-wider">{img.type}</span>
              </div>
              {/* Zoom on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">View Details</span>
              </div>
            </div>

            <div className="p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[11px] font-semibold text-foreground truncate">{img.title}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-mono">{img.date}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase ml-auto ${RISK_BADGE_STYLES[img.riskLevel]}`}>
                  {img.riskLevel}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{img.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
