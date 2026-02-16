import { Droplets, Waves, AlertTriangle, Shield } from 'lucide-react';
import { provinces } from '@/lib/floodData';

export function StatsBar() {
  const highRiskCount = provinces.filter((p) => p.riskLevel === 'high' || p.riskLevel === 'critical').length;
  const totalRainfall = Math.round(provinces.reduce((s, p) => s + p.rainfall7Day, 0) / provinces.length);
  const alertCount = provinces.filter((p) => p.alertActive).length;
  const avgRisk = Math.round(provinces.reduce((s, p) => s + p.riskScore, 0) / provinces.length);

  const stats = [
    { icon: <AlertTriangle className="w-4 h-4 text-risk-high" />, label: 'High Risk Regions', value: `${highRiskCount}/${provinces.length}` },
    { icon: <Droplets className="w-4 h-4 text-water" />, label: 'Avg 7-Day Rain', value: `${totalRainfall}mm` },
    { icon: <Waves className="w-4 h-4 text-accent" />, label: 'Active Alerts', value: `${alertCount}` },
    { icon: <Shield className="w-4 h-4 text-primary" />, label: 'Mean Risk Score', value: `${avgRisk}/100` },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="p-4 rounded-xl bg-card border border-border flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/60">{s.icon}</div>
          <div>
            <div className="text-[11px] text-muted-foreground">{s.label}</div>
            <div className="font-mono text-lg font-bold text-foreground">{s.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
