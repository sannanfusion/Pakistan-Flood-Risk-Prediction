import { motion } from 'framer-motion';
import { LayoutGrid, BarChart3, Activity, ShieldCheck, CircleDot } from 'lucide-react';
import { DistrictRow, tierCounts } from '@/lib/riskTiers';
import { AnimatedCounter } from '@/components/AnimatedCounter';

interface RiskTilesProps {
  districts: DistrictRow[];
}

export function RiskTiles({ districts }: RiskTilesProps) {
  const counts = tierCounts(districts);

  const tiles = [
    {
      label: 'Total Districts',
      sub: 'Monitoring',
      value: districts.length,
      icon: LayoutGrid,
      accent: 'text-primary',
      ring: 'border-border',
      surface: 'bg-card',
      iconBg: 'bg-primary/12',
      title: 'text-foreground',
    },
    {
      label: 'High Risk',
      sub: 'Districts',
      value: counts.high,
      icon: BarChart3,
      accent: 'text-risk-high',
      ring: 'border-risk-high/30',
      surface: 'bg-risk-high/[0.08]',
      iconBg: 'bg-risk-high/15',
      title: 'text-risk-high',
    },
    {
      label: 'Medium Risk',
      sub: 'Districts',
      value: counts.medium,
      icon: Activity,
      accent: 'text-risk-medium',
      ring: 'border-risk-medium/30',
      surface: 'bg-risk-medium/[0.08]',
      iconBg: 'bg-risk-medium/15',
      title: 'text-risk-medium',
    },
    {
      label: 'Low Risk',
      sub: 'Districts',
      value: counts.low,
      icon: ShieldCheck,
      accent: 'text-risk-low',
      ring: 'border-risk-low/30',
      surface: 'bg-risk-low/[0.08]',
      iconBg: 'bg-risk-low/15',
      title: 'text-risk-low',
    },
    {
      label: 'No Risk',
      sub: 'Districts',
      value: counts.none,
      icon: CircleDot,
      accent: 'text-muted-foreground',
      ring: 'border-border',
      surface: 'bg-card',
      iconBg: 'bg-muted',
      title: 'text-muted-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
      {tiles.map((t, i) => (
        <motion.div
          key={t.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`rounded-2xl border ${t.ring} ${t.surface} p-4 flex items-start justify-between gap-2 hover:-translate-y-0.5 transition-transform duration-300`}
        >
          <div className="min-w-0">
            <div className={`text-[12.5px] font-semibold ${t.title} truncate`}>{t.label}</div>
            <div className="mt-1.5 text-[26px] font-extrabold text-foreground leading-none">
              <AnimatedCounter value={t.value} />
            </div>
            <div className="mt-1.5 text-[11px] text-muted-foreground">{t.sub}</div>
          </div>
          <div className={`p-2 rounded-xl ${t.iconBg} shrink-0`}>
            <t.icon className={`w-4 h-4 ${t.accent}`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
