import { Alert as AlertType, RISK_LABELS } from '@/lib/types';
import { AlertTriangle, Bell } from 'lucide-react';

interface AlertsPanelProps {
  alerts: AlertType[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Bell className="w-4 h-4 text-risk-medium" />
        <h3 className="text-sm font-semibold text-foreground">Active Alerts</h3>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-risk-high/15 text-risk-high text-[10px] font-mono font-bold">
          {alerts.filter((a) => a.isNew).length} NEW
        </span>
      </div>
      <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-thin pr-1">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}

function AlertCard({ alert }: { alert: AlertType }) {
  const borderColor =
    alert.level === 'critical' ? 'border-l-risk-critical' :
    alert.level === 'high' ? 'border-l-risk-high' :
    alert.level === 'medium' ? 'border-l-risk-medium' : 'border-l-risk-low';

  const iconColor =
    alert.level === 'critical' ? 'text-risk-critical' :
    alert.level === 'high' ? 'text-risk-high' :
    alert.level === 'medium' ? 'text-risk-medium' : 'text-risk-low';

  const time = new Date(alert.timestamp);
  const hoursAgo = Math.round((Date.now() - time.getTime()) / 3600000);

  return (
    <div className={`p-3 rounded-xl bg-secondary/30 border-l-[3px] ${borderColor} ${alert.isNew ? 'ring-1 ring-primary/15' : ''} transition-colors hover:bg-secondary/50`}>
      <div className="flex items-start gap-2">
        <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${iconColor}`} />
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-medium text-foreground truncate">{alert.region}</span>
            {alert.isNew && <span className="px-1.5 py-0.5 rounded-md bg-primary/15 text-primary text-[9px] font-mono font-bold">NEW</span>}
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">{alert.message}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-[10px] font-mono font-semibold ${iconColor}`}>{RISK_LABELS[alert.level]}</span>
            <span className="text-[10px] text-muted-foreground">· {hoursAgo}h ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
