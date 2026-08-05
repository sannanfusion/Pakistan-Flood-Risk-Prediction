import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, CartesianGrid, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { DistrictRow, tierCounts, TIER_META } from '@/lib/riskTiers';

interface RiskDistributionChartProps {
  districts: DistrictRow[];
}

export function RiskDistributionChart({ districts }: RiskDistributionChartProps) {
  const [range, setRange] = useState<'This Week' | 'This Month'>('This Week');
  const counts = tierCounts(districts);

  const data = (['high', 'medium', 'low', 'none'] as const).map((tier) => ({
    name: TIER_META[tier].label,
    value: counts[tier],
    color: TIER_META[tier].color,
  }));

  return (
    <section className="panel p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[13.5px] font-semibold text-foreground">Risk Level Distribution</h2>
        <button
          onClick={() => setRange((r) => (r === 'This Week' ? 'This Month' : 'This Week'))}
          className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-muted/70 border border-border text-[11px] font-medium text-foreground"
        >
          {range}
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>

      <div className="h-[210px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 18, right: 6, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10.5 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
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
              formatter={(v: number) => [`${v} districts`, 'Count']}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={48} label={{ position: 'top', fill: 'hsl(var(--foreground))', fontSize: 11, fontWeight: 700 }}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
