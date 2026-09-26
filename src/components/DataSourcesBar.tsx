interface DataSourcesBarProps {
  precision?: number;
  lastSync?: string;
}

const SOURCES = [
  { name: 'NDMA (2010–2026)', color: 'hsl(var(--risk-low))' },
  { name: 'NASA POWER API', color: 'hsl(var(--primary))' },
  { name: 'AI ML Regressor (R² 97.2%)', color: 'hsl(var(--emerald-400, 150 80% 50%))' },
  { name: 'PMD Weather', color: 'hsl(var(--rain))' },
  { name: 'WAPDA River', color: 'hsl(var(--water))' },
];

export function DataSourcesBar({ precision, lastSync }: DataSourcesBarProps) {
  return (
    <footer className="panel px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-3">
      <span className="text-[12px] font-semibold text-muted-foreground">Connected System Sources</span>

      {SOURCES.map((s) => (
        <span key={s.name} className="flex items-center gap-1.5">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold font-mono"
            style={{ background: `${s.color.replace(')', ' / 0.15)')}`, color: s.color, border: `1px solid ${s.color.replace(')', ' / 0.4)')}` }}
          >
            {s.name.slice(0, 2)}
          </span>
          <span className="text-[12px] font-medium text-foreground">{s.name}</span>
        </span>
      ))}

      <span className="flex-1" />

      <span className="flex items-center gap-2 text-[11.5px] text-muted-foreground font-mono">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Live Sync: {lastSync ?? 'Real-Time'}
      </span>

      {typeof precision === 'number' && (
        <span className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/25 text-[11.5px] font-mono font-semibold text-primary">
          ML Precision: {precision.toFixed(1)}%
        </span>
      )}
    </footer>
  );
}
