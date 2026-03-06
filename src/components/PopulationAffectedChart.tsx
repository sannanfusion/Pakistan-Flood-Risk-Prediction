import { provinces } from '@/lib/floodData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RISK_COLORS } from '@/lib/types';
import { Users } from 'lucide-react';

export function PopulationAffectedChart() {
  const data = provinces
    .map((p) => {
      const affectedPct = p.riskScore / 100;
      const affected = Math.round((p.population * affectedPct * 0.15) / 1000);
      return {
        name: p.name.length > 10 ? p.name.slice(0, 10) + '…' : p.name,
        fullName: p.name,
        affected,
        population: p.population,
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
        <h3 className="text-sm font-semibold text-foreground">Population at Risk (×1000)</h3>
      </div>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <XAxis
              type="number"
              tick={{ fill: 'hsl(215, 14%, 46%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: 'hsl(214, 20%, 90%)' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: 'hsl(215, 14%, 46%)', fontSize: 11, fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(214, 20%, 90%)',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'Inter',
                color: 'hsl(220, 20%, 10%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                padding: '8px 12px',
              }}
              formatter={(value: number) => [`${value.toLocaleString()}k`, 'At Risk']}
            />
            <Bar dataKey="affected" radius={[0, 4, 4, 0]} name="Population at Risk" barSize={18}>
              {data.map((entry, i) => (
                <Cell key={i} fill={RISK_COLORS[entry.riskLevel]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
