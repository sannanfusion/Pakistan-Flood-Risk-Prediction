import { Satellite, Radio, Database } from 'lucide-react';

type SourceType = 'nasa' | 'ndma' | 'wapda';

const SOURCES: Record<SourceType, { label: string; icon: React.ReactNode; lastUpdate: string; bgClass: string; textClass: string; iconClass: string }> = {
  nasa: {
    label: 'NASA IMERG',
    icon: <Satellite className="w-3 h-3" />,
    lastUpdate: '2 min ago',
    bgClass: 'bg-blue-50 border-blue-200',
    textClass: 'text-blue-700',
    iconClass: 'text-blue-500',
  },
  ndma: {
    label: 'NDMA',
    icon: <Radio className="w-3 h-3" />,
    lastUpdate: '15 min ago',
    bgClass: 'bg-emerald-50 border-emerald-200',
    textClass: 'text-emerald-700',
    iconClass: 'text-emerald-500',
  },
  wapda: {
    label: 'WAPDA',
    icon: <Database className="w-3 h-3" />,
    lastUpdate: '8 min ago',
    bgClass: 'bg-amber-50 border-amber-200',
    textClass: 'text-amber-700',
    iconClass: 'text-amber-500',
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
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono border ${s.bgClass}`}
          >
            <span className={s.iconClass}>{s.icon}</span>
            <span className={`font-semibold ${s.textClass}`}>{s.label}</span>
            <span className={`opacity-60 ${s.textClass}`}>· {s.lastUpdate}</span>
          </div>
        );
      })}
    </div>
  );
}
