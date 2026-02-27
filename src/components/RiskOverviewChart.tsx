import { provinces } from '@/lib/floodData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RISK_COLORS } from '@/lib/types';

export function RiskOverviewChart() {
  const data = provinces.map((p) => ({
    name: p.name.length > 8 ? p.name.slice(0, 8) + '…' : p.name,
    riskScore: p.riskScore,
    riskLevel: p.riskLevel,
  })).sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: 'hsl(214, 18%, 89%)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid hsl(214, 18%, 89%)',
              borderRadius: '12px',
              fontSize: '12px',
              fontFamily: 'JetBrains Mono',
              color: 'hsl(210, 29%, 24%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          />
          <Bar dataKey="riskScore" radius={[6, 6, 0, 0]} name="Risk Score">
            {data.map((entry, i) => (
              <Cell key={i} fill={RISK_COLORS[entry.riskLevel]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
