import { Satellite, Radio, Database } from 'lucide-react';

type SourceType = 'nasa' | 'ndma' | 'wapda';

const SOURCES: Record<SourceType, { label: string; icon: React.ReactNode; color: string; lastUpdate: string }> = {
  nasa: {
    label: 'NASA IMERG',
    icon: <Satellite className="w-3 h-3" />,
    color: '#3B82F6',
    lastUpdate: '2 min ago',
  },
  ndma: {
    label: 'NDMA',
    icon: <Radio className="w-3 h-3" />,
    color: '#F59E0B',
    lastUpdate: '15 min ago',
  },
  wapda: {
    label: 'WAPDA',
    icon: <Database className="w-3 h-3" />,
    color: '#10B981',
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
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono border backdrop-blur-sm"
            style={{
              borderColor: s.color + '30',
              backgroundColor: s.color + '10',
              color: s.color,
            }}
          >
            {s.icon}
            <span className="font-semibold">{s.label}</span>
            <span style={{ opacity: 0.5 }}>· {s.lastUpdate}</span>
          </div>
        );
      })}
    </div>
  );
}
