import { ProvinceData, RISK_LABELS } from '@/lib/types';
import { Droplets, Waves, Users, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

interface ProvinceDetailProps {
  province: ProvinceData;
}

export function ProvinceDetail({ province }: ProvinceDetailProps) {
  const riskColorClass =
    province.riskLevel === 'critical' ? 'text-risk-critical' :
    province.riskLevel === 'high' ? 'text-risk-high' :
    province.riskLevel === 'medium' ? 'text-risk-medium' : 'text-risk-low';

  const riskBgClass =
    province.riskLevel === 'critical' ? 'bg-risk-critical/10 border-risk-critical/30' :
    province.riskLevel === 'high' ? 'bg-risk-high/10 border-risk-high/30' :
    province.riskLevel === 'medium' ? 'bg-risk-medium/10 border-risk-medium/30' : 'bg-risk-low/10 border-risk-low/30';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">{province.name}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${riskBgClass} ${riskColorClass}`}>
          {RISK_LABELS[province.riskLevel]}
        </span>
      </div>

      {/* Risk Score Bar */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Risk Score</span>
          <span className={`font-mono font-bold ${riskColorClass}`}>{province.riskScore}/100</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              province.riskLevel === 'critical' ? 'bg-risk-critical' :
              province.riskLevel === 'high' ? 'bg-risk-high' :
              province.riskLevel === 'medium' ? 'bg-risk-medium' : 'bg-risk-low'
            }`}
            style={{ width: `${province.riskScore}%` }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard icon={<Droplets className="w-4 h-4 text-water" />} label="7-Day Rain" value={`${province.rainfall7Day}mm`} />
        <MetricCard icon={<Droplets className="w-4 h-4 text-rain" />} label="30-Day Rain" value={`${province.rainfall30Day}mm`} />
        <MetricCard
          icon={<Waves className="w-4 h-4 text-river" />}
          label="River Discharge"
          value={`${(province.riverDischarge / 1000).toFixed(1)}k`}
          alert={province.riverDischarge > province.riverDischargeThreshold}
        />
        <MetricCard icon={<Users className="w-4 h-4 text-primary" />} label="Population" value={`${(province.population / 1e6).toFixed(1)}M`} />
        <MetricCard icon={<AlertTriangle className="w-4 h-4 text-accent" />} label="Past Floods" value={`${province.historicalFloods}`} />
        <MetricCard icon={<Calendar className="w-4 h-4 text-muted-foreground" />} label="Last Flood" value={province.lastFloodDate.slice(0, 7)} />
      </div>

      {/* Districts */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> District Breakdown
        </h4>
        <div className="space-y-2">
          {province.districts.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{d.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      d.riskLevel === 'critical' ? 'bg-risk-critical' :
                      d.riskLevel === 'high' ? 'bg-risk-high' :
                      d.riskLevel === 'medium' ? 'bg-risk-medium' : 'bg-risk-low'
                    }`}
                    style={{ width: `${d.riskScore}%` }}
                  />
                </div>
                <span className="font-mono text-xs w-8 text-right text-foreground">{d.riskScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, alert }: { icon: React.ReactNode; label: string; value: string; alert?: boolean }) {
  return (
    <div className={`p-3 rounded-lg bg-secondary/50 border transition-colors ${alert ? 'border-risk-high/40' : 'border-transparent'}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
      <div className={`font-mono text-sm font-bold ${alert ? 'text-risk-high' : 'text-foreground'}`}>
        {value} {alert && <span className="text-[10px]">⚠</span>}
      </div>
    </div>
  );
}
