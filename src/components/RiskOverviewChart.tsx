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
            tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(222, 44%, 9%)',
              border: '1px solid hsl(222, 30%, 18%)',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'JetBrains Mono',
              color: 'hsl(210, 40%, 93%)',
            }}
          />
          <Bar dataKey="riskScore" radius={[4, 4, 0, 0]} name="Risk Score">
            {data.map((entry, i) => (
              <Cell key={i} fill={RISK_COLORS[entry.riskLevel]} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
