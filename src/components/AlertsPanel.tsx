import { Alert as AlertType, RISK_LABELS } from '@/lib/types';
import { AlertTriangle, Bell } from 'lucide-react';

interface AlertsPanelProps {
  alerts?: AlertType[]; // 👈 IMPORTANT (optional bana diya)
}

export function AlertsPanel({ alerts = [] }: AlertsPanelProps) { // 👈 default empty array
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Bell className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Active Alerts</h3>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-risk-high/10 text-risk-high text-[10px] font-mono font-bold">
          {(alerts || []).filter((a) => a.isNew).length} NEW
        </span>
      </div>

      <div className="space-y-2.5 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
        {(alerts || []).map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}

function AlertCard({ alert }: { alert: AlertType }) {
  const bgClass =
    alert.level === 'high' ? 'bg-risk-high/5 border-risk-high/20' :
    alert.level === 'medium' ? 'bg-risk-medium/5 border-risk-medium/15' : 'bg-risk-low/5 border-risk-low/15';

  const barColor =
    alert.level === 'high' ? 'bg-risk-high' :
    alert.level === 'medium' ? 'bg-risk-medium' : 'bg-risk-low';

  const iconColor =
    alert.level === 'high' ? 'text-risk-high' :
    alert.level === 'medium' ? 'text-risk-medium' : 'text-risk-low';

  const time = new Date(alert.timestamp);
  const hoursAgo = Math.round((Date.now() - time.getTime()) / 3600000);

  return (
    <div className={`relative overflow-hidden p-3.5 rounded-xl border ${bgClass} cursor-pointer hover:shadow-sm transition-all duration-200 ${alert.isNew ? 'ring-1 ring-primary/15' : ''}`}>
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${barColor} rounded-l-xl`} />

      <div className="flex items-start gap-2.5 pl-2">
        <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-foreground truncate">{alert.region}</span>
            {alert.isNew && (
              <span className="px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground text-[9px] font-mono font-bold">
                NEW
              </span>
            )}
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {alert.message}
          </p>

          <div className="flex items-center gap-3 mt-2">
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md ${
              alert.level === 'high' ? 'bg-risk-high/10 text-risk-high' :
              alert.level === 'medium' ? 'bg-risk-medium/10 text-risk-medium' :
              'bg-risk-low/10 text-risk-low'
            }`}>
              {RISK_LABELS[alert.level]}
            </span>

            <span className="text-[10px] text-muted-foreground font-mono">
              {hoursAgo}h ago
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}