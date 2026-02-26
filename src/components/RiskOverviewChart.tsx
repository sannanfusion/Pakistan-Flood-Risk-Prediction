import { provinces } from '@/lib/floodData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const RISK_BAR_COLORS: Record<string, string> = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
  critical: '#DC2626',
};

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
            tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0B0F14',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '12px',
              fontFamily: 'JetBrains Mono',
              color: '#E5E7EB',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          />
          <Bar dataKey="riskScore" radius={[6, 6, 0, 0]} name="Risk Score">
            {data.map((entry, i) => (
              <Cell key={i} fill={RISK_BAR_COLORS[entry.riskLevel]} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
