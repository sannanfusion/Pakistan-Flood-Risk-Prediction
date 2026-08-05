import { CloudRain, ArrowRight, Droplets, TrendingUp, Waves } from 'lucide-react';
import { ProvinceData, RISK_LABELS } from '@/lib/types';

interface CurrentRainfallCardProps {
  province: ProvinceData | null;
  onViewMap: () => void;
}

export function CurrentRainfallCard({ province, onViewMap }: CurrentRainfallCardProps) {
  const riskColor =
    province?.riskLevel === 'high'
      ? 'bg-risk-high/15 text-risk-high'
      : province?.riskLevel === 'medium'
      ? 'bg-risk-medium/15 text-risk-medium'
      : 'bg-risk-low/15 text-risk-low';

  const intensity = (mm: number) => (mm >= 80 ? 'Heavy Rain' : mm >= 30 ? 'Moderate Rain' : mm > 0 ? 'Light Rain' : 'No Rain');

  return (
    <section id="rainfall" className="panel p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[13.5px] font-semibold text-foreground">Current Rainfall</h2>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-risk-high/15">
          <span className="w-1.5 h-1.5 rounded-full bg-risk-high animate-pulse" />
          <span className="text-[9px] font-mono font-bold text-risk-high tracking-wider">LIVE</span>
        </span>
      </div>

      {province ? (
        <>
          <div className="flex items-center gap-4">
            <div className="w-[86px] h-[86px] shrink-0 rounded-2xl bg-rain/10 border border-rain/20 flex items-center justify-center">
              <CloudRain className="w-10 h-10 text-rain" />
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-bold text-foreground truncate">{province.name}</div>
              <div className="text-[11px] text-muted-foreground mb-1.5">{intensity(province.rainfall7Day)}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-[30px] font-extrabold text-foreground leading-none font-mono tabular-nums">
                  {province.rainfall7Day}
                </span>
                <span className="text-[13px] text-muted-foreground font-medium">mm</span>
              </div>
              <div className="text-[11px] text-rain font-medium">7-Day Rainfall</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
            <Metric icon={Droplets} label="30-Day" value={`${province.rainfall30Day}mm`} />
            <Metric icon={TrendingUp} label="Predicted" value={`${province.prediction}mm`} />
            <Metric icon={Waves} label="Discharge" value={`${Math.round(province.riverDischarge).toLocaleString()}`} />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${riskColor}`}>
              {RISK_LABELS[province.riskLevel]}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">Score {province.riskScore}/100</span>
          </div>

          <button
            onClick={onViewMap}
            className="mt-4 w-full h-10 rounded-xl border border-primary/30 bg-primary/10 text-primary text-[12.5px] font-semibold flex items-center justify-center gap-2 hover:bg-primary/15 transition-colors"
          >
            View Full Rainfall Map
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <div className="h-[180px] flex items-center justify-center text-[12px] text-muted-foreground">
          Select a region on the map
        </div>
      )}
    </section>
  );
}

function Metric({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/50 border border-border px-2.5 py-2">
      <div className="flex items-center gap-1 text-[9.5px] text-muted-foreground uppercase tracking-wider mb-1">
        <Icon className="w-3 h-3" />
        <span className="truncate">{label}</span>
      </div>
      <div className="text-[12.5px] font-bold text-foreground font-mono tabular-nums truncate">{value}</div>
    </div>
  );
}
