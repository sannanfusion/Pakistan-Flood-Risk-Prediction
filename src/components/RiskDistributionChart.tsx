import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, CartesianGrid, Tooltip, LabelList } from 'recharts';
import { DistrictRow, tierCounts, TIER_META, RiskTier } from '@/lib/riskTiers';

interface RiskDistributionChartProps {
  districts: DistrictRow[];
}

const TIERS: RiskTier[] = ['high', 'medium', 'low', 'none'];

export function RiskDistributionChart({ districts }: RiskDistributionChartProps) {
  const counts = tierCounts(districts);
  const total = districts.length;

  const data = TIERS.map((tier) => ({
    tier,
    name: TIER_META[tier].label.replace(' Risk', ''),
    range: TIER_META[tier].range,
    value: counts[tier],
    pct: total ? Math.round((counts[tier] / total) * 100) : 0,
    color: TIER_META[tier].color,
  }));

  return (
    <section className="panel p-3 sm:p-4 h-full">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h2 className="text-[13.5px] font-semibold text-foreground truncate">Risk Level Distribution</h2>
          <p className="text-[10.5px] text-muted-foreground font-mono">
            Live from map markers · {total} locations
          </p>
        </div>
        <span className="shrink-0 px-2.5 py-1 rounded-lg bg-muted border border-border text-[11px] font-mono text-muted-foreground">
          {total} total
        </span>
      </div>

      {total === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-[12px] text-muted-foreground">
          No district data available
        </div>
      ) : (
        <>
          <div className="h-[200px] sm:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 22, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10.5 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                  width={38}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted) / 0.4)' }}
                  contentStyle={{
                    background: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 10,
                    fontSize: 11,
                    color: 'hsl(var(--foreground))',
                  }}
                  formatter={(v: number, _n, entry: { payload?: { pct: number } }) => [
                    `${v} districts (${entry?.payload?.pct ?? 0}%)`,
                    'Count',
                  ]}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={54} minPointSize={2}>
                  <LabelList
                    dataKey="value"
                    position="top"
                    style={{ fill: 'hsl(var(--foreground))', fontSize: 11, fontWeight: 700 }}
                  />
                  {data.map((d) => (
                    <Cell key={d.tier} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* legend / breakdown — always readable even when a bar is zero */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {data.map((d) => (
              <div
                key={d.tier}
                className="rounded-xl border border-border bg-muted/40 px-2.5 py-2 flex items-center gap-2"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/40"
                  style={{ background: d.color }}
                />
                <div className="min-w-0">
                  <div className="text-[10.5px] text-muted-foreground truncate">
                    {d.name} <span className="font-mono">({d.range})</span>
                  </div>
                  <div className="text-[12.5px] font-bold text-foreground font-mono">
                    {d.value} <span className="text-[10px] text-muted-foreground">· {d.pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
