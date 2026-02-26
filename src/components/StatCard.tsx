import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/AnimatedCounter';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  index?: number;
  trend?: 'up' | 'down' | 'stable';
}

export function StatCard({ icon, label, value, suffix = '', index = 0, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="rounded-2xl glass-card p-5 flex items-start gap-4 group"
    >
      <div className="p-2.5 rounded-xl bg-secondary/70 text-muted-foreground group-hover:text-primary transition-colors shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm text-muted-foreground mb-1 truncate">{label}</div>
        <AnimatedCounter value={value} suffix={suffix} />
        {trend && (
          <div className={`text-[10px] font-mono mt-1 ${trend === 'up' ? 'text-risk-high' : trend === 'down' ? 'text-risk-low' : 'text-muted-foreground'}`}>
            {trend === 'up' ? '↑ Rising' : trend === 'down' ? '↓ Declining' : '→ Stable'}
          </div>
        )}
      </div>
    </motion.div>
  );
}
