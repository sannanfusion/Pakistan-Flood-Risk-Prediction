import { Satellite, Radio, Database } from 'lucide-react';

type SourceType = 'nasa' | 'ndma' | 'wapda';

const SOURCES: Record<SourceType, { label: string; icon: React.ReactNode; lastUpdate: string }> = {
  nasa: {
    label: 'NASA IMERG',
    icon: <Satellite className="w-3 h-3" />,
    lastUpdate: '2 min ago',
  },
  ndma: {
    label: 'NDMA',
    icon: <Radio className="w-3 h-3" />,
    lastUpdate: '15 min ago',
  },
  wapda: {
    label: 'WAPDA',
    icon: <Database className="w-3 h-3" />,
    lastUpdate: '8 min ago',
  },
};

interface DataSourceBadgeProps {
  sources: SourceType[];
}

export function DataSourceBadge({ sources }: DataSourceBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {sources.map((src) => {
        const s = SOURCES[src];
        return (
          <div
            key={src}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono border border-border bg-muted"
          >
            <span className="text-primary">{s.icon}</span>
            <span className="font-semibold text-foreground">{s.label}</span>
            <span className="text-muted-foreground">· {s.lastUpdate}</span>
          </div>
        );
      })}
    </div>
  );
}
