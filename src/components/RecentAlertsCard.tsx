import { useState } from 'react';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';
import { Alert as AlertType, RISK_LABELS } from '@/lib/types';

interface RecentAlertsCardProps {
  alerts?: AlertType[];
  onSelectRegion?: (region: string) => void;
}

const levelStyles = {
  high: { text: 'text-risk-high', bg: 'bg-risk-high/15', bar: 'bg-risk-high' },
  medium: { text: 'text-risk-medium', bg: 'bg-risk-medium/15', bar: 'bg-risk-medium' },
  low: { text: 'text-risk-low', bg: 'bg-risk-low/15', bar: 'bg-risk-low' },
} as const;

function formatTime(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function RecentAlertsCard({ alerts = [], onSelectRegion }: RecentAlertsCardProps) {
  const [showAll, setShowAll] = useState(false);
  const [active, setActive] = useState<AlertType | null>(null);
  const visible = showAll ? alerts : alerts.slice(0, 3);

  return (
    <section id="alerts" className="panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[13.5px] font-semibold text-foreground">Recent Alerts</h2>
        <button
          onClick={() => setShowAll((v) => !v)}
          className="text-[11px] font-semibold text-primary hover:underline"
        >
          {showAll ? 'Show Less' : 'View All'}
        </button>
      </div>

      <div className={`space-y-2 ${showAll ? 'max-h-[320px] overflow-y-auto scrollbar-thin pr-1' : ''}`}>
        {visible.length === 0 && (
          <div className="py-8 text-center text-[12px] text-muted-foreground">No active alerts</div>
        )}
        {visible.map((alert) => {
          const s = levelStyles[alert.level] ?? levelStyles.low;
          return (
            <button
              key={alert.id}
              onClick={() => {
                setActive(alert);
                onSelectRegion?.(alert.region);
              }}
              className="w-full text-left relative overflow-hidden flex items-start gap-2.5 p-2.5 rounded-xl bg-muted/40 border border-border hover:border-primary/30 transition-colors group"
            >
              <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${s.bar}`} />
              <span className={`ml-1 p-1.5 rounded-lg ${s.bg} shrink-0`}>
                <AlertTriangle className={`w-3.5 h-3.5 ${s.text}`} />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block text-[12.5px] font-semibold ${s.text} truncate`}>
                  {RISK_LABELS[alert.level].replace('Risk', 'Flood Risk')}
                </span>
                <span className="block text-[11px] text-muted-foreground truncate">{alert.region}</span>
              </span>
              <span className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[10px] font-mono text-muted-foreground">{formatTime(alert.timestamp)}</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail overlay */}
      {active && (
        <div
          className="fixed inset-0 z-[2000] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="panel w-full max-w-md p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <span className={`p-2 rounded-xl ${(levelStyles[active.level] ?? levelStyles.low).bg}`}>
                  <AlertTriangle className={`w-4 h-4 ${(levelStyles[active.level] ?? levelStyles.low).text}`} />
                </span>
                <div>
                  <div className="text-[14px] font-bold text-foreground">{active.region}</div>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    {new Date(active.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActive(null)}
                aria-label="Close alert details"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[12.5px] text-muted-foreground leading-relaxed">{active.message}</p>
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                  (levelStyles[active.level] ?? levelStyles.low).bg
                } ${(levelStyles[active.level] ?? levelStyles.low).text}`}
              >
                {RISK_LABELS[active.level]}
              </span>
              {active.isNew && (
                <span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary text-[10px] font-mono font-bold">
                  NEW
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
