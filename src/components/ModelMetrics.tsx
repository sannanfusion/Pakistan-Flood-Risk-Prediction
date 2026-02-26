import { modelMetrics } from '@/lib/floodData';
import { Brain, Database, Layers, Clock } from 'lucide-react';

export function ModelMetrics() {
  const m = modelMetrics;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Model Performance</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <MetricBadge label="Accuracy" value={`${(m.accuracy * 100).toFixed(1)}%`} />
        <MetricBadge label="Precision" value={`${(m.precision * 100).toFixed(1)}%`} />
        <MetricBadge label="Recall" value={`${(m.recall * 100).toFixed(1)}%`} />
        <MetricBadge label="F1 Score" value={`${(m.f1Score * 100).toFixed(1)}%`} />
      </div>

      <div className="flex items-center justify-center">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke="#22D3EE"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${m.rocAuc * 251.3} 251.3`}
              style={{ filter: 'drop-shadow(0 0 4px #22D3EE)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-lg font-bold text-accent">{(m.rocAuc * 100).toFixed(0)}%</span>
            <span className="text-[9px] text-muted-foreground">ROC-AUC</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 text-[11px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Database className="w-3 h-3" /> <span className="font-mono">{(m.dataPoints / 1000).toFixed(0)}k</span> data points
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Layers className="w-3 h-3" /> <span className="font-mono">{m.features}</span> features
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-3 h-3" /> Trained <span className="font-mono">{m.lastTrained}</span>
        </div>
      </div>
    </div>
  );
}

function MetricBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 rounded-xl bg-secondary/40 text-center border border-border/30">
      <div className="text-[10px] text-muted-foreground mb-0.5">{label}</div>
      <div className="font-mono text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}
