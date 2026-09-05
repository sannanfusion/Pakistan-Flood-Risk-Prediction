import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Satellite, ExternalLink, CloudRain, MapPin } from 'lucide-react';
import { ProvinceData, RISK_COLORS, RISK_LABELS } from '@/lib/types';
import {
  GIBS_LAYERS,
  bboxAround,
  gibsImageUrl,
  latestImageryDate,
  worldviewLink,
} from '@/lib/nasaGibs';

interface Props {
  provinces: ProvinceData[];
}

const DAY_OPTIONS = [1, 2, 3];

/**
 * Real NASA satellite imagery (GIBS) for every monitored province,
 * annotated with the live risk figures coming from the backend model.
 */
export function NasaImageryPanel({ provinces }: Props) {
  const [dayOffset, setDayOffset] = useState(1);
  const [showRain, setShowRain] = useState(true);

  const date = useMemo(() => latestImageryDate(dayOffset), [dayOffset]);
  const cards = [...provinces].sort((a, b) => b.riskScore - a.riskScore).slice(0, 6);

  if (cards.length === 0) return null;

  return (
    <section className="panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <Satellite className="w-4 h-4 text-primary" />
          </span>
          <div>
            <h2 className="text-[13.5px] font-semibold text-foreground">NASA Satellite Imagery</h2>
            <p className="text-[10.5px] font-mono text-muted-foreground">
              GIBS · MODIS Terra true colour {showRain ? '+ GPM IMERG rain rate' : ''} · {date}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setShowRain((v) => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
              showRain
                ? 'bg-rain/15 border-rain/35 text-rain'
                : 'bg-muted/60 border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" /> Rain overlay
          </button>
          {DAY_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDayOffset(d)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold border transition-colors ${
                d === dayOffset
                  ? 'bg-primary/15 border-primary/30 text-primary'
                  : 'bg-muted/60 border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {d === 1 ? 'Latest' : `-${d}d`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((p, i) => {
          const bbox = bboxAround(p.coordinates.lat, p.coordinates.lng);
          const base = gibsImageUrl({ layer: GIBS_LAYERS.trueColor, bbox, date, width: 640, height: 480 });
          const rain = gibsImageUrl({ layer: GIBS_LAYERS.precip, bbox, date, width: 640, height: 480 });
          const color = RISK_COLORS[p.riskLevel];

          return (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <div className="relative h-36 sm:h-40 bg-muted">
                <img
                  src={base}
                  alt={`NASA MODIS true colour imagery of ${p.name} on ${date}`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {showRain && (
                  <img
                    src={rain}
                    alt={`GPM IMERG precipitation rate over ${p.name} on ${date}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none"
                  />
                )}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/55 backdrop-blur-sm text-[9px] font-mono text-white">
                  {p.coordinates.lat.toFixed(2)}°N {p.coordinates.lng.toFixed(2)}°E
                </span>
                <span
                  className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold border backdrop-blur-sm"
                  style={{ color, borderColor: `${color}60`, backgroundColor: `${color}26` }}
                >
                  {RISK_LABELS[p.riskLevel]}
                </span>
              </div>

              <div className="p-3 space-y-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[12.5px] font-semibold text-foreground truncate">{p.name}</span>
                  <span className="ml-auto text-[11px] font-mono font-bold text-foreground tabular-nums">
                    {p.riskScore}/100
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {[
                    { label: '7-day rain', value: `${p.rainfall7Day.toFixed(1)}mm` },
                    { label: '30-day rain', value: `${p.rainfall30Day.toFixed(0)}mm` },
                    { label: 'Discharge', value: `${Math.round(p.riverDischarge).toLocaleString()}` },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg bg-muted/50 border border-border px-1 py-1.5">
                      <div className="text-[11px] font-mono font-bold text-foreground tabular-nums">{s.value}</div>
                      <div className="text-[9px] text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
                <a
                  href={worldviewLink(p.coordinates.lat, p.coordinates.lng, date, GIBS_LAYERS.trueColor.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10.5px] font-mono text-primary hover:underline"
                >
                  Open in NASA Worldview <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.article>
          );
        })}
      </div>

      <p className="text-[10.5px] font-mono text-muted-foreground mt-3">
        Source: NASA GIBS WMS (MODIS Terra corrected reflectance, GPM IMERG precipitation rate). Risk figures from the
        prediction model trained on NDMA and observed rainfall records.
      </p>
    </section>
  );
}
