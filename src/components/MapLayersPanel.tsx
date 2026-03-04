import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Layers, Droplets, MapPin, Radio, Triangle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LayerVisibility {
  provinces: boolean;
  floodZones: boolean;
  rivers: boolean;
  cities: boolean;
  stations: boolean;
}

interface MapLayersPanelProps {
  layers: LayerVisibility;
  onToggle: (layer: keyof LayerVisibility) => void;
}

interface LayerRowProps {
  label: string;
  icon: React.ReactNode;
  color: string;
  active: boolean;
  onToggle: () => void;
  description?: string;
}

function LayerRow({ label, icon, color, active, onToggle }: LayerRowProps) {
  return (
    <div
      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-200 select-none ${
        active
          ? 'bg-card border border-border'
          : 'bg-transparent border border-transparent opacity-50 hover:opacity-75'
      }`}
      onClick={onToggle}
    >
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: active ? color : 'hsl(var(--muted-foreground))' }}
      />
      <div className={`shrink-0 ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
        {icon}
      </div>
      <span className={`flex-1 text-[10px] font-medium truncate ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
        {label}
      </span>
      <Switch
        checked={active}
        onCheckedChange={onToggle}
        className="shrink-0 scale-75 data-[state=checked]:bg-primary"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export function MapLayersPanel({ layers, onToggle }: MapLayersPanelProps) {
  const [collapsed, setCollapsed] = useState(true);

  const layerConfig = [
    { key: 'provinces' as const, label: 'Provinces', icon: <Triangle className="w-3 h-3" />, color: 'hsl(204, 63%, 28%)' },
    { key: 'floodZones' as const, label: 'Flood Zones', icon: <Droplets className="w-3 h-3" />, color: 'hsl(220, 80%, 45%)' },
    { key: 'rivers' as const, label: 'Rivers', icon: <Droplets className="w-3 h-3" />, color: 'hsl(204, 80%, 45%)' },
    { key: 'cities' as const, label: 'Cities', icon: <MapPin className="w-3 h-3" />, color: 'hsl(142, 71%, 45%)' },
    { key: 'stations' as const, label: 'Stations', icon: <Radio className="w-3 h-3" />, color: 'hsl(0, 72%, 51%)' },
  ];

  const activeCount = Object.values(layers).filter(Boolean).length;

  return (
    <div className="absolute top-3 left-3 z-[1000] w-[180px]">
      <div
        className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 bg-card/95 backdrop-blur-sm border border-border shadow-lg cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
        style={{ borderBottom: collapsed ? undefined : 'none', borderRadius: collapsed ? '10px' : '10px 10px 0 0' }}
      >
        <div className="flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-primary" />
          <span className="text-[9px] font-bold text-foreground uppercase tracking-wider">Layers</span>
          <span className="text-[8px] font-mono text-muted-foreground bg-muted rounded-full px-1 py-0.5">
            {activeCount}/{layerConfig.length}
          </span>
        </div>
        {collapsed ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronUp className="w-3 h-3 text-muted-foreground" />}
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden bg-card/95 backdrop-blur-sm rounded-b-[10px] border border-t-0 border-border shadow-lg"
          >
            <div className="p-1.5 space-y-0.5">
              {layerConfig.map((layer) => (
                <LayerRow
                  key={layer.key}
                  label={layer.label}
                  icon={layer.icon}
                  color={layer.color}
                  active={layers[layer.key]}
                  onToggle={() => onToggle(layer.key)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
