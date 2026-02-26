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
              <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(187, 72%, 48%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(187, 72%, 48%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickFormatter={(v) => v.slice(5)}
            axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            unit="mm"
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
          <ReferenceLine y={80} stroke="hsl(0, 72%, 55%)" strokeDasharray="4 4" strokeOpacity={0.6} />
          <Area type="monotone" dataKey="rainfall" stroke="hsl(199, 89%, 48%)" fill="url(#rainfallGrad)" strokeWidth={2} name="Actual" />
          <Area type="monotone" dataKey="predicted" stroke="hsl(187, 72%, 48%)" fill="url(#predictedGrad)" strokeWidth={1.5} strokeDasharray="4 2" name="Predicted" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
