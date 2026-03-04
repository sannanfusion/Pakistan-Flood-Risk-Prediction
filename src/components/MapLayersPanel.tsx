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

function LayerRow({ label, icon, color, active, onToggle, description }: LayerRowProps) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 select-none ${
        active
          ? 'bg-card border border-border shadow-sm'
          : 'bg-transparent border border-transparent opacity-60 hover:opacity-80'
      }`}
      onClick={onToggle}
    >
      {/* Color indicator dot */}
      <div
        className="w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300"
        style={{
          background: active ? color : 'hsl(var(--muted-foreground))',
          boxShadow: active ? `0 0 6px ${color}40` : 'none',
        }}
      />

      {/* Icon */}
      <div
        className={`shrink-0 transition-colors duration-200 ${
          active ? 'text-foreground' : 'text-muted-foreground'
        }`}
      >
        {icon}
      </div>

      {/* Label + description */}
      <div className="flex-1 min-w-0">
        <span
          className={`text-[11px] font-semibold transition-colors duration-200 ${
            active ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          {label}
        </span>
        {description && (
          <span className="block text-[9px] text-muted-foreground leading-tight mt-0.5">
            {description}
          </span>
        )}
      </div>

      {/* Toggle */}
      <Switch
        checked={active}
        onCheckedChange={onToggle}
        className="shrink-0 scale-[0.85] data-[state=checked]:bg-primary"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export function MapLayersPanel({ layers, onToggle }: MapLayersPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const layerConfig: { key: keyof LayerVisibility; label: string; icon: React.ReactNode; color: string; description: string }[] = [
    {
      key: 'provinces',
      label: 'Province Boundaries',
      icon: <Triangle className="w-3.5 h-3.5" />,
      color: 'hsl(204, 63%, 28%)',
      description: 'Risk-colored region polygons',
    },
    {
      key: 'floodZones',
      label: 'Flood Extent Zones',
      icon: <Droplets className="w-3.5 h-3.5" />,
      color: 'hsl(220, 80%, 45%)',
      description: 'Active inundation areas',
    },
    {
      key: 'rivers',
      label: 'Major Rivers',
      icon: <Droplets className="w-3.5 h-3.5" />,
      color: 'hsl(204, 80%, 45%)',
      description: 'Indus, Chenab, Jhelum, Ravi, Sutlej',
    },
    {
      key: 'cities',
      label: 'City Markers',
      icon: <MapPin className="w-3.5 h-3.5" />,
      color: 'hsl(142, 71%, 45%)',
      description: 'Urban centers with risk data',
    },
    {
      key: 'stations',
      label: 'Monitoring Stations',
      icon: <Radio className="w-3.5 h-3.5" />,
      color: 'hsl(0, 72%, 51%)',
      description: 'Flood gauges & sensors',
    },
  ];

  const activeCount = Object.values(layers).filter(Boolean).length;

  return (
    <div className="absolute top-3 left-3 z-[1000] w-[210px]">
      {/* Header */}
      <div
        className="flex items-center justify-between gap-2 px-3 py-2 bg-card/95 backdrop-blur-sm rounded-t-xl border border-border shadow-lg cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
        style={{ borderBottom: collapsed ? undefined : 'none', borderRadius: collapsed ? '12px' : undefined }}
      >
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Layers</span>
          <span className="text-[9px] font-mono text-muted-foreground bg-muted rounded-full px-1.5 py-0.5">
            {activeCount}/{layerConfig.length}
          </span>
        </div>
        {collapsed ? (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </div>

      {/* Body */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-card/95 backdrop-blur-sm rounded-b-xl border border-t-0 border-border shadow-lg"
          >
            <div className="p-2 space-y-1">
              {layerConfig.map((layer) => (
                <LayerRow
                  key={layer.key}
                  label={layer.label}
                  icon={layer.icon}
                  color={layer.color}
                  active={layers[layer.key]}
                  onToggle={() => onToggle(layer.key)}
                  description={layer.description}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
