import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ProvinceData } from '@/lib/types';
import { RISK_COLORS } from '@/lib/types';

interface ProvinceWiseDonutProps {
  provinces: ProvinceData[];
  selectedProvince: string | null;
  onSelect: (id: string) => void;
}

export function ProvinceWiseDonut({ provinces, selectedProvince, onSelect }: ProvinceWiseDonutProps) {
  const totalPop = provinces.reduce((s, p) => s + p.population, 0) || 1;

  const data = provinces.map((p) => ({
    id: p.id,
    name: p.name,
    value: Math.round((p.population / totalPop) * 100),
    color: RISK_COLORS[p.riskLevel],
  }));

  return (
    <section id="province-wise" className="panel p-4 h-full">
      <h2 className="text-[13.5px] font-semibold text-foreground mb-3">Province Wise Risk</h2>

      <div className="flex items-center gap-3">
        <div className="relative w-[168px] h-[168px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={2}
                stroke="none"
                onClick={(entry: any) => entry?.id && onSelect(entry.id)}
              >
                {data.map((d) => (
                  <Cell
                    key={d.id}
                    fill={d.color}
                    opacity={!selectedProvince || selectedProvince === d.id ? 1 : 0.45}
                    className="cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 10,
                  fontSize: 11,
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(v: number, n: string) => [`${v}% of population`, n]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[12.5px] font-bold text-foreground">Risk</span>
            <span className="text-[12.5px] font-bold text-foreground">Overview</span>
          </div>
        </div>

        <ul className="flex-1 space-y-1.5 min-w-0">
          {data.map((d) => (
            <li key={d.id}>
              <button
                onClick={() => onSelect(d.id)}
                className={`w-full flex items-center gap-2 px-1.5 py-1 rounded-lg transition-colors ${
                  selectedProvince === d.id ? 'bg-muted/70' : 'hover:bg-muted/40'
                }`}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="text-[12px] text-foreground truncate flex-1 text-left">{d.name}</span>
                <span className="text-[12px] font-mono font-semibold text-muted-foreground tabular-nums">{d.value}%</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
