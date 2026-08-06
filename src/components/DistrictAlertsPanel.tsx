import { useMemo, useState } from 'react';
import { AlertTriangle, Bell, ShieldCheck } from 'lucide-react';
import { DistrictRow, RiskTier, TIER_META } from '@/lib/riskTiers';

interface DistrictAlertsPanelProps {
  districts: DistrictRow[];
  onSelectProvince?: (id: string) => void;
}

const TIER_ORDER: RiskTier[] = ['high', 'medium', 'low'];

const tierStyles: Record<RiskTier, { text: string; bg: string; bar: string; border: string }> = {
  high: { text: 'text-risk-high', bg: 'bg-risk-high/12', bar: 'bg-risk-high', border: 'border-risk-high/25' },
  medium: { text: 'text-risk-medium', bg: 'bg-risk-medium/12', bar: 'bg-risk-medium', border: 'border-risk-medium/25' },
  low: { text: 'text-risk-low', bg: 'bg-risk-low/12', bar: 'bg-risk-low', border: 'border-risk-low/25' },
  none: { text: 'text-risk-none', bg: 'bg-muted/40', bar: 'bg-risk-none', border: 'border-border' },
};

const advice: Record<RiskTier, string> = {
  high: 'Immediate flood risk — evacuation readiness and river monitoring advised',
  medium: 'Elevated flood risk — monitor rainfall and drainage capacity',
  low: 'Low flood risk — routine monitoring only',
  none: 'No significant risk detected',
};

export function DistrictAlertsPanel({ districts, onSelectProvince }: DistrictAlertsPanelProps) {
  const [showAll, setShowAll] = useState(false);

  const ranked = useMemo(
    () =>
      districts
        .filter((d) => d.tier !== 'none')
        .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier) || b.riskScore - a.riskScore),
    [districts],
  );

  const visible = showAll ? ranked : ranked.slice(0, 8);
  const highCount = ranked.filter((d) => d.tier === 'high').length;

  return (
    <section id="alerts" className="panel p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-risk-high/12">
            <Bell className="w-4 h-4 text-risk-high" />
          </span>
          <div>
            <h2 className="text-[13.5px] font-semibold text-foreground">Flood Risk Alerts by District</h2>
            <p className="text-[10.5px] text-muted-foreground font-mono">
              Ordered high → medium → low · {ranked.length} districts at risk
              {highCount > 0 ? ` · ${highCount} critical` : ''}
            </p>
          </div>
        </div>
        {ranked.length > 8 && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-[11px] font-semibold text-primary hover:underline shrink-0"
          >
            {showAll ? 'Show Less' : 'View All'}
          </button>
        )}
      </div>

      {ranked.length === 0 ? (
        <div className="py-10 flex flex-col items-center gap-2 text-muted-foreground">
          <ShieldCheck className="w-6 h-6 text-risk-low" />
          <span className="text-[12px]">No districts currently at flood risk</span>
        </div>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 ${showAll ? 'max-h-[420px] overflow-y-auto scrollbar-thin pr-1' : ''}`}>
          {visible.map((d) => {
            const s = tierStyles[d.tier];
            return (
              <button
                key={`${d.provinceId}-${d.name}`}
                onClick={() => onSelectProvince?.(d.provinceId)}
                className={`relative overflow-hidden text-left flex items-start gap-2.5 p-3 rounded-xl bg-muted/30 border ${s.border} hover:border-primary/35 transition-colors`}
              >
                <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${s.bar}`} />
                <span className={`ml-1 p-1.5 rounded-lg ${s.bg} shrink-0`}>
                  <AlertTriangle className={`w-3.5 h-3.5 ${s.text}`} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-[12.5px] font-semibold text-foreground truncate">{d.name}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-mono font-bold uppercase ${s.bg} ${s.text}`}>
                      {TIER_META[d.tier].label}
                    </span>
                  </span>
                  <span className="block text-[10.5px] text-muted-foreground truncate">{d.provinceName}</span>
                  <span className="block text-[10px] text-muted-foreground mt-1 line-clamp-2">{advice[d.tier]}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className={`block text-[17px] font-extrabold font-mono leading-none ${s.text}`}>{d.riskScore}</span>
                  <span className="block text-[9px] font-mono text-muted-foreground">/100</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
