import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RISK_COLORS, ProvinceData } from '@/lib/types';
import { Users } from 'lucide-react';

interface Props {
  data: ProvinceData[];
}

export function PopulationAffectedChart({ data }: Props) {
  const chartData = (data || [])
    .map((p) => {
      const affectedPct = (p.riskScore || 0) / 100;
      const affected = Math.round(((p.population || 0) * affectedPct * 0.15) / 1000);

      return {
        name: p.name.length > 10 ? p.name.slice(0, 10) + '…' : p.name,
        fullName: p.name,
        affected,
        population: p.population || 0,
        riskLevel: p.riskLevel,
      };
    })
    .sort((a, b) => b.affected - a.affected);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-muted">
          <Users className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          Population at Risk (×1000)
        </h3>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <XAxis
              type="number"
              tick={{ fontSize: 10 }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11 }}
              tickLine={false}
              width={80}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toLocaleString()}k`, 'At Risk']}
            />
            <Bar dataKey="affected" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={RISK_COLORS[entry.riskLevel]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}