import { useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { DistrictRow, TIER_META, RiskTier } from '@/lib/riskTiers';

interface Props {
  districts: DistrictRow[];
  onSelectProvince?: (id: string) => void;
}

const TIERS: RiskTier[] = ['high', 'medium', 'low', 'none'];

/** Province rollup computed from the exact same markers drawn on the risk map. */
export function ProvinceRiskBreakdown({ districts, onSelectProvince }: Props) {
  const rows = useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string; total: number; avg: number; counts: Record<RiskTier, number> }
    >();

    districts.forEach((d) => {
      const entry =
        map.get(d.provinceId) ??
        { id: d.provinceId, name: d.provinceName, total: 0, avg: 0, counts: { high: 0, medium: 0, low: 0, none: 0 } };
      entry.total += 1;
      entry.avg += d.riskScore;
      entry.counts[d.tier] += 1;
      map.set(d.provinceId, entry);
    });

    return [...map.values()]
      .map((r) => ({ ...r, avg: r.total ? Math.round(r.avg / r.total) : 0 }))
      .sort((a, b) => b.avg - a.avg);
  }, [districts]);

  return (
    <section className="panel p-3 sm:p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1.5 rounded-lg bg-muted">
          <MapPin className="w-4 h-4 text-primary" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[13.5px] font-semibold text-foreground truncate">Province Risk — from map markers</h2>
          <p className="text-[10.5px] text-muted-foreground font-mono">
            Average marker score &amp; tier split per region
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="py-8 text-center text-[12px] text-muted-foreground">No map data available</div>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelectProvince?.(r.id)}
              className="w-full text-left p-2.5 rounded-xl bg-muted/35 border border-border hover:border-primary/35 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12.5px] font-semibold text-foreground truncate">{r.name}</span>
                <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                  {r.total} pts · avg <span className="text-foreground font-bold">{r.avg}</span>
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full overflow-hidden flex bg-border/60">
                {TIERS.map((t) =>
                  r.counts[t] > 0 ? (
                    <span
                      key={t}
                      style={{ width: `${(r.counts[t] / r.total) * 100}%`, background: TIER_META[t].color }}
                    />
                  ) : null,
                )}
              </div>

              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                {TIERS.filter((t) => r.counts[t] > 0).map((t) => (
                  <span key={t} className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: TIER_META[t].color }} />
                    {TIER_META[t].label.replace(' Risk', '')} {r.counts[t]}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
