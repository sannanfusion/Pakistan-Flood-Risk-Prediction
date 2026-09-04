import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Skull, Home, CloudRain, ExternalLink, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { RISK_COLORS, ProvinceData } from '@/lib/types';
import { fetchFloodData } from '@/lib/floodData';
import { fetchMonsoonHistory, ProvinceRainHistory, MAJOR_FLOOD_EVENTS } from '@/lib/floodHistory';

const Historical = () => {
  const [history, setHistory] = useState<ProvinceRainHistory[]>([]);
  const [provinces, setProvinces] = useState<ProvinceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProvince, setActiveProvince] = useState<string>('Sindh');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [hist, flood] = await Promise.allSettled([fetchMonsoonHistory(8), fetchFloodData()]);
        if (cancelled) return;
        if (hist.status === 'fulfilled') setHistory(hist.value);
        if (flood.status === 'fulfilled') setProvinces(flood.value.provinces);
        if (hist.status === 'rejected' && flood.status === 'rejected') {
          setError('Failed to load historical data — please retry in a moment');
        } else if (hist.status === 'rejected') {
          setError(null);
        }
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load historical data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[40vh] gap-4">
        <div className="w-10 h-10 border-4 border-primary/25 border-t-primary rounded-full animate-spin" />
        <div className="text-muted-foreground text-sm">Loading observed rainfall records…</div>
      </div>
    );
  }

  if (error) {
    return <div className="py-20 text-center text-sm text-risk-high">{error}</div>;
  }

  const active = history.find((h) => h.province === activeProvince) ?? history[0];
  const chartData = (active?.years ?? []).map((y) => ({
    year: String(y.year),
    rainfall: y.rainfallMm,
    anomaly: Number((y.rainfallMm - (active?.averageMm ?? 0)).toFixed(1)),
  }));

  const ndmaTotals = provinces.reduce(
    (acc, p) => ({ deaths: acc.deaths + (p.deaths || 0), houses: acc.houses + (p.housesDamaged || 0) }),
    { deaths: 0, houses: 0 },
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Flood History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Observed monsoon rainfall (ERA5 reanalysis, Jun–Sep) per province, plus documented flood events with official
          NDMA / OCHA figures
        </p>
      </div>

      {/* Real observed monsoon rainfall */}
      <section className="panel p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rain/10 border border-rain/20">
              <CloudRain className="w-4 h-4 text-rain" />
            </span>
            <div>
              <h2 className="text-[13.5px] font-semibold text-foreground">Observed monsoon rainfall by year</h2>
              <p className="text-[10.5px] font-mono text-muted-foreground">
                {active?.province} · 8-season mean {active?.averageMm}mm · latest {active?.latestMm}mm
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {history.map((h) => (
              <button
                key={h.province}
                onClick={() => setActiveProvince(h.province)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                  h.province === active?.province
                    ? 'bg-primary/15 border-primary/30 text-primary'
                    : 'bg-muted/60 border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {h.province}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
              <XAxis
                dataKey="year"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
                unit="mm"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }} />
              <Bar dataKey="rainfall" name="Monsoon total (mm)" radius={[5, 5, 0, 0]}>
                {chartData.map((d) => (
                  <Cell
                    key={d.year}
                    fill={
                      d.anomaly > (active?.averageMm ?? 0) * 0.4
                        ? 'hsl(var(--risk-high))'
                        : d.anomaly > 0
                          ? 'hsl(var(--risk-medium))'
                          : 'hsl(var(--rain))'
                    }
                    fillOpacity={0.9}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10.5px] text-muted-foreground mt-2 font-mono">
          Source: Open-Meteo ERA5 archive (observed daily precipitation), aggregated Jun 1 – Sep 30
        </p>
      </section>

      {/* Live NDMA impact totals */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Provinces monitored', value: provinces.length.toString(), icon: MapPin },
          { label: 'Reported deaths (NDMA)', value: ndmaTotals.deaths.toLocaleString(), icon: Skull },
          { label: 'Houses damaged (NDMA)', value: ndmaTotals.houses.toLocaleString(), icon: Home },
          { label: 'Documented major events', value: MAJOR_FLOOD_EVENTS.length.toString(), icon: TrendingUp },
        ].map((s) => (
          <div key={s.label} className="panel p-3.5">
            <s.icon className="w-4 h-4 text-primary mb-2" />
            <div className="text-[18px] font-bold font-mono tabular-nums text-foreground">{s.value}</div>
            <div className="text-[10.5px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Documented events */}
      <div className="grid gap-4">
        {[...MAJOR_FLOOD_EVENTS].sort((a, b) => Number(b.id) - Number(a.id)).map((e, i) => (
          <motion.article
            key={e.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="panel p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="text-base font-bold text-foreground">{e.title}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[12.5px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {e.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {e.regions}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {(e.affected / 1e6).toFixed(1)}M affected
                  </span>
                  <span className="flex items-center gap-1 text-risk-high">
                    <Skull className="w-3.5 h-3.5" /> {e.deaths.toLocaleString()} deaths
                  </span>
                  <span className="flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" /> {e.housesDamaged.toLocaleString()} houses
                  </span>
                </div>
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-mono font-bold border shrink-0 h-fit"
                style={{
                  color: RISK_COLORS[e.severity],
                  borderColor: RISK_COLORS[e.severity] + '40',
                  backgroundColor: RISK_COLORS[e.severity] + '14',
                }}
              >
                {e.severity.toUpperCase()}
              </span>
            </div>
            <p className="text-[12.5px] text-muted-foreground leading-relaxed">{e.summary}</p>
            <a
              href={e.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-mono text-primary hover:underline"
            >
              {e.source} <ExternalLink className="w-3 h-3" />
            </a>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default Historical;
