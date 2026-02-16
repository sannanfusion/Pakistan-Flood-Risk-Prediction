import { useState } from 'react';
import { PakistanMap } from '@/components/PakistanMap';
import { ProvinceDetail } from '@/components/ProvinceDetail';
import { AlertsPanel } from '@/components/AlertsPanel';
import { RainfallChart } from '@/components/RainfallChart';
import { ModelMetrics } from '@/components/ModelMetrics';
import { RiskOverviewChart } from '@/components/RiskOverviewChart';
import { StatsBar } from '@/components/StatsBar';
import { provinces, rainfallTrend, alerts } from '@/lib/floodData';
import { Satellite, MapPin } from 'lucide-react';

const Index = () => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>('sindh');
  const selected = provinces.find((p) => p.id === selectedProvince) || null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 glow-primary">
              <Satellite className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                Pakistan Flood Risk Intelligence
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                NASA IMERG + NDMA · Real-time prediction system
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-risk-low animate-pulse" />
            <span className="text-xs text-muted-foreground font-mono">Live · Feb 16, 2026</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Stats */}
        <StatsBar />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map */}
          <div className="lg:col-span-5 rounded-xl bg-card border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Regional Risk Map</h2>
            </div>
            <PakistanMap
              provinces={provinces}
              selectedProvince={selectedProvince}
              onProvinceSelect={setSelectedProvince}
            />
            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-3 text-[10px]">
              {(['low', 'medium', 'high', 'critical'] as const).map((level) => (
                <div key={level} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full risk-indicator-${level}`} />
                  <span className="text-muted-foreground capitalize">{level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Province Detail */}
          <div className="lg:col-span-3 rounded-xl bg-card border border-border p-5">
            {selected ? (
              <ProvinceDetail province={selected} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Select a region on the map
              </div>
            )}
          </div>

          {/* Alerts */}
          <div className="lg:col-span-4 rounded-xl bg-card border border-border p-5">
            <AlertsPanel alerts={alerts} />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-xl bg-card border border-border p-5">
            <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Satellite className="w-4 h-4 text-water" /> 30-Day Rainfall Trend
            </h2>
            <p className="text-[10px] text-muted-foreground mb-2 font-mono">
              Actual vs predicted · Red line = flood threshold (80mm)
            </p>
            <RainfallChart data={rainfallTrend} />
          </div>

          <div className="lg:col-span-4 rounded-xl bg-card border border-border p-5">
            <h2 className="text-sm font-bold text-foreground mb-3">Provincial Risk Comparison</h2>
            <RiskOverviewChart />
          </div>

          <div className="lg:col-span-3 rounded-xl bg-card border border-border p-5">
            <ModelMetrics />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-[10px] text-muted-foreground font-mono py-4 border-t border-border">
          Data: NASA GPM/IMERG · NDMA Pakistan · WAPDA River Discharge · Model: Random Forest (v2.4)
        </footer>
      </main>
    </div>
  );
};

export default Index;
