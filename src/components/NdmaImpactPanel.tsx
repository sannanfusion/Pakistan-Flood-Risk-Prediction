import { ShieldAlert, Skull, Home, Users, ExternalLink } from 'lucide-react';
import { ProvinceData, RISK_COLORS, RISK_LABELS } from '@/lib/types';
import { MAJOR_FLOOD_EVENTS } from '@/lib/floodHistory';

interface Props {
  provinces: ProvinceData[];
}

/** Official NDMA reported impact per province, straight from the backend dataset. */
export function NdmaImpactPanel({ provinces }: Props) {
  if (provinces.length === 0) return null;

  const rows = [...provinces].sort((a, b) => b.deaths - a.deaths);
  const totals = rows.reduce(
    (a, p) => ({
      deaths: a.deaths + p.deaths,
      houses: a.houses + p.housesDamaged,
      population: a.population + p.population,
    }),
    { deaths: 0, houses: 0, population: 0 },
  );
  const worstPastEvent = [...MAJOR_FLOOD_EVENTS].sort((a, b) => b.deaths - a.deaths)[0];

  return (
    <section className="panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-risk-high/10 border border-risk-high/20">
            <ShieldAlert className="w-4 h-4 text-risk-high" />
          </span>
          <div>
            <h2 className="text-[13.5px] font-semibold text-foreground">NDMA Reported Impact</h2>
            <p className="text-[10.5px] font-mono text-muted-foreground">
              Official National Disaster Management Authority figures per province
            </p>
          </div>
        </div>
        <a
          href="https://www.ndma.gov.pk/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[10.5px] font-mono text-primary hover:underline"
        >
          ndma.gov.pk <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'Reported deaths', value: totals.deaths.toLocaleString(), icon: Skull },
          { label: 'Houses damaged', value: totals.houses.toLocaleString(), icon: Home },
          { label: 'Population monitored', value: `${(totals.population / 1e6).toFixed(1)}M`, icon: Users },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-muted/50 border border-border p-2.5">
            <s.icon className="w-3.5 h-3.5 text-primary mb-1" />
            <div className="text-[15px] sm:text-[17px] font-bold font-mono tabular-nums text-foreground">{s.value}</div>
            <div className="text-[10px] text-muted-foreground leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full text-left border-collapse min-w-[420px]">
          <thead>
            <tr className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <th className="py-1.5 pr-2 font-semibold">Province</th>
              <th className="py-1.5 px-2 font-semibold text-right">Deaths</th>
              <th className="py-1.5 px-2 font-semibold text-right">Houses</th>
              <th className="py-1.5 px-2 font-semibold text-right">Past floods</th>
              <th className="py-1.5 pl-2 font-semibold text-right">Current risk</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="py-2 pr-2 text-[12px] font-semibold text-foreground">{p.name}</td>
                <td className="py-2 px-2 text-[12px] font-mono tabular-nums text-right text-risk-high">
                  {p.deaths.toLocaleString()}
                </td>
                <td className="py-2 px-2 text-[12px] font-mono tabular-nums text-right text-foreground">
                  {p.housesDamaged.toLocaleString()}
                </td>
                <td className="py-2 px-2 text-[12px] font-mono tabular-nums text-right text-muted-foreground">
                  {p.historicalFloods}
                </td>
                <td className="py-2 pl-2 text-right">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border"
                    style={{
                      color: RISK_COLORS[p.riskLevel],
                      borderColor: `${RISK_COLORS[p.riskLevel]}55`,
                      backgroundColor: `${RISK_COLORS[p.riskLevel]}1f`,
                    }}
                  >
                    {RISK_LABELS[p.riskLevel]} {p.riskScore}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[10.5px] font-mono text-muted-foreground mt-3">
        Worst documented event on record: {worstPastEvent.title} — {worstPastEvent.deaths.toLocaleString()} deaths,{' '}
        {(worstPastEvent.affected / 1e6).toFixed(1)}M affected ({worstPastEvent.source}).
      </p>
    </section>
  );
}
