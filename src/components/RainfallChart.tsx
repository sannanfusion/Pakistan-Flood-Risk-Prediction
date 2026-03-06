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
              <stop offset="0%" stopColor="hsl(210, 100%, 45%)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="hsl(210, 100%, 45%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(210, 70%, 55%)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="hsl(210, 70%, 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: 'hsl(215, 14%, 46%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickFormatter={(v) => v.slice(5)}
            axisLine={{ stroke: 'hsl(214, 20%, 90%)' }}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: 'hsl(215, 14%, 46%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            unit="mm"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(0, 0%, 100%)',
              border: '1px solid hsl(214, 20%, 90%)',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'JetBrains Mono',
              color: 'hsl(220, 20%, 10%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          />
          <ReferenceLine y={80} stroke="hsl(0, 72%, 51%)" strokeDasharray="4 4" strokeOpacity={0.5} />
          <Area type="monotone" dataKey="rainfall" stroke="hsl(210, 100%, 45%)" fill="url(#rainfallGrad)" strokeWidth={2} name="Actual" />
          <Area type="monotone" dataKey="predicted" stroke="hsl(210, 70%, 55%)" fill="url(#predictedGrad)" strokeWidth={1.5} strokeDasharray="4 2" name="Predicted" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
