import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RISK_COLORS } from '@/lib/types';

interface Props {
  data: any[];
}

export function RiskOverviewChart({ data }: Props) {

  // ✅ safety (important)
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
        No data available
      </div>
    );
  }

  const chartData = data
    .map((p) => ({
      name: p.name.length > 8 ? p.name.slice(0, 8) + '…' : p.name,
      riskScore: p.riskScore || 0,
      riskLevel: p.riskLevel,
    }))
    .sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          
          <XAxis
            dataKey="name"
            tick={{ fill: 'hsl(215, 14%, 46%)', fontSize: 10 }}
            axisLine={{ stroke: 'hsl(214, 20%, 90%)' }}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: 'hsl(215, 14%, 46%)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />

          <Bar dataKey="riskScore" radius={[4, 4, 0, 0]} name="Risk Score">
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={RISK_COLORS[entry.riskLevel] || '#8884d8'}
                fillOpacity={0.85}
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}