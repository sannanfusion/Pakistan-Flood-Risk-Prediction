import { RainfallDataPoint } from '@/lib/types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface RainfallChartProps {
  data: RainfallDataPoint[];
}

export function RainfallChart({ data }: RainfallChartProps) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="rainfallGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(204, 63%, 28%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(204, 63%, 28%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(210, 60%, 50%)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(210, 60%, 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickFormatter={(v) => v.slice(5)}
            axisLine={{ stroke: 'hsl(214, 18%, 89%)' }}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            unit="mm"
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
          <ReferenceLine y={80} stroke="hsl(0, 72%, 51%)" strokeDasharray="4 4" strokeOpacity={0.5} />
          <Area type="monotone" dataKey="rainfall" stroke="hsl(204, 63%, 28%)" fill="url(#rainfallGrad)" strokeWidth={2} name="Actual" />
          <Area type="monotone" dataKey="predicted" stroke="hsl(210, 60%, 50%)" fill="url(#predictedGrad)" strokeWidth={1.5} strokeDasharray="4 2" name="Predicted" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
