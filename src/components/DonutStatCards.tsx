import { motion } from 'framer-motion';
import { ProvinceData } from '@/lib/types';

interface DonutProps {
  value: number;
  max: number;
  label: string;
  sublabel: string;
  color: string;
  size?: number;
}

function DonutStat({ value, max, label, sublabel, color, size = 80 }: DonutProps) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const dashOffset = circumference - pct * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="5" />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-sm font-bold text-foreground">
            {Math.round(pct * 100)}%
          </span>
        </div>
      </div>

      <div className="text-center">
        <div className="text-xs font-semibold text-foreground">{label}</div>
        <div className="text-[10px] text-muted-foreground font-mono">{sublabel}</div>
      </div>
    </div>
  );
}

interface Props {
  data: ProvinceData[];
}

export function DonutStatCards({ data }: Props) {
  const safeData = data || [];

  const totalPop = safeData.reduce((s, p) => s + (p.population || 0), 0);

  const affectedPop = safeData.reduce(
    (s, p) => s + (p.population || 0) * ((p.riskScore || 0) / 100) * 0.15,
    0
  );

  const avgDischarge =
    safeData.length > 0
      ? safeData.reduce(
          (s, p) =>
            s +
            ((p.riverDischarge || 0) /
              (p.riverDischargeThreshold || 1)),
          0
        ) / safeData.length
      : 0;

  const avgRainfall =
    safeData.length > 0
      ? safeData.reduce((s, p) => s + (p.rainfall7Day || 0), 0) /
        safeData.length
      : 0;

  const highRiskDistricts = safeData.reduce(
    (s, p) =>
      s + (p.districts?.filter((d) => d.riskLevel === 'high').length || 0),
    0
  );

  const totalDistricts = safeData.reduce(
    (s, p) => s + (p.districts?.length || 0),
    0
  );

  const stats = [
    {
      value: affectedPop,
      max: totalPop || 1,
      label: 'Population Affected',
      sublabel: `${(affectedPop / 1e6).toFixed(1)}M of ${(totalPop / 1e6).toFixed(0)}M`,
      color: 'hsl(0, 72%, 51%)',
    },
    {
      value: avgDischarge * 100,
      max: 100,
      label: 'River Capacity',
      sublabel: `${Math.round(avgDischarge * 100)}% threshold`,
      color: 'hsl(45, 93%, 47%)',
    },
    {
      value: avgRainfall,
      max: 200,
      label: 'Avg Rainfall',
      sublabel: `${Math.round(avgRainfall)}mm / 7 days`,
      color: 'hsl(204, 63%, 28%)',
    },
    {
      value: highRiskDistricts,
      max: totalDistricts || 1,
      label: 'High Risk Districts',
      sublabel: `${highRiskDistricts} of ${totalDistricts}`,
      color: 'hsl(0, 72%, 51%)',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + i * 0.08 }}
          className="flex justify-center"
        >
          <DonutStat {...s} />
        </motion.div>
      ))}
    </div>
  );
}