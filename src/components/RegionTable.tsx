import { provinces } from '@/lib/floodData';
import { RISK_LABELS } from '@/lib/types';

export function RegionTable() {
  const sorted = [...provinces].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Region</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Risk</th>
            <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">7d Rain</th>
            <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Discharge</th>
            <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Population</th>
            <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Alert</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => {
            const riskColor =
              p.riskLevel === 'critical' ? 'text-risk-critical' :
              p.riskLevel === 'high' ? 'text-risk-high' :
              p.riskLevel === 'medium' ? 'text-risk-medium' : 'text-risk-low';

            const riskBg =
              p.riskLevel === 'critical' ? 'bg-risk-critical/10' :
              p.riskLevel === 'high' ? 'bg-risk-high/10' :
              p.riskLevel === 'medium' ? 'bg-risk-medium/10' : 'bg-risk-low/10';

            return (
              <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-4 font-medium text-foreground">{p.name}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${riskColor} ${riskBg}`}>
                      {p.riskScore}
                    </span>
                    <span className={`text-xs ${riskColor}`}>{RISK_LABELS[p.riskLevel]}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-mono text-foreground hidden sm:table-cell">{p.rainfall7Day}mm</td>
                <td className="py-3 px-4 text-right font-mono text-foreground hidden md:table-cell">
                  <span className={p.riverDischarge > p.riverDischargeThreshold ? 'text-risk-high' : ''}>
                    {(p.riverDischarge / 1000).toFixed(1)}k
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono text-foreground hidden md:table-cell">{(p.population / 1e6).toFixed(1)}M</td>
                <td className="py-3 px-4 text-center">
                  {p.alertActive ? (
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-risk-high animate-pulse" />
                  ) : (
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-risk-low/40" />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
