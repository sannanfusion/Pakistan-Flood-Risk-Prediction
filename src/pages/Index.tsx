import { useState, useEffect, useCallback, useMemo } from 'react';
import { LeafletMap } from '@/components/LeafletMap';
import { SatelliteView } from '@/components/SatelliteView';

import { MapLayersPanel, LayerVisibility } from '@/components/MapLayersPanel';
import { RiskTiles } from '@/components/RiskTiles';

import { DistrictAlertsPanel } from '@/components/DistrictAlertsPanel';
import { RiskDistributionChart } from '@/components/RiskDistributionChart';
import { ProvinceRiskBreakdown } from '@/components/ProvinceRiskBreakdown';
import { RecentReportsCard } from '@/components/RecentReportsCard';

import { DataSourcesBar } from '@/components/DataSourcesBar';
import { ProvinceDetail } from '@/components/ProvinceDetail';
import { ModelMetrics } from '@/components/ModelMetrics';
import { RainfallChart } from '@/components/RainfallChart';
import { PopulationAffectedChart } from '@/components/PopulationAffectedChart';
import { fetchFloodData, FloodApiResponse } from '@/lib/floodData';
import { ProvinceData, RainfallDataPoint, Alert } from '@/lib/types';
import { markerDistrictRows } from '@/lib/mapMarkers';
import { AlertTriangle, Satellite, Activity, Hand } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>('sindh');
  const [provinces, setProvinces] = useState<ProvinceData[]>([]);
  const [rainfallTrend, setRainfallTrend] = useState<RainfallDataPoint[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [modelMetricsData, setModelMetricsData] = useState<FloodApiResponse['modelMetrics'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());
  const [satelliteOpen, setSatelliteOpen] = useState(false);


  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
    provinces: true,
    floodZones: true,
    rivers: true,
    cities: true,
    stations: true,
  });

  const selected = provinces.find((p) => p.id === selectedProvince) || null;
  const districts = useMemo(() => markerDistrictRows(provinces), [provinces]);

  const toggleLayer = useCallback((layer: keyof LayerVisibility) => {
    setLayerVisibility((prev) => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // Single API call — all data comes from here
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchFloodData();
        if (cancelled) return;
        setProvinces(data.provinces);
        setRainfallTrend(data.rainfallTrend);
        setAlerts(data.alerts);
        setModelMetricsData(data.modelMetrics);
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to load data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const scrollToMap = () => document.getElementById('risk-map')?.scrollIntoView({ behavior: 'smooth' });

  const selectByRegionName = (region: string) => {
    const match = provinces.find(
      (p) =>
        region.toLowerCase().includes(p.name.toLowerCase()) ||
        (p.districts || []).some((d) => region.toLowerCase().includes(d.name.toLowerCase())),
    );
    if (match) setSelectedProvince(match.id);
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative flex flex-col items-center">
          <div className="relative w-48 h-48 mb-8">
            <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border border-primary/40 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, hsl(var(--primary) / 0.35) 100%)',
                animation: 'spin 2s linear infinite',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Satellite className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-risk-high rounded-full animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="text-center z-10">
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">Pakistan Flood Risk Prediction</h2>
            <p className="text-muted-foreground text-sm font-medium animate-pulse">
              Please wait while we load the dashboard for you
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 px-3 py-1 bg-muted rounded-full border border-border mx-auto w-fit">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Synchronizing NASA &amp; NDMA Streams
              </span>
            </div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }` }} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertTriangle className="w-10 h-10 text-risk-high" />
        <div className="text-foreground font-semibold">Failed to load data</div>
        <div className="text-muted-foreground text-sm">{error}</div>
        <button
          onClick={() => { setLoading(true); setError(null); window.location.reload(); }}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  const lastSync = now.toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      {/* Welcome row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h1 className="text-[18px] sm:text-[22px] font-extrabold text-foreground tracking-tight flex items-center gap-2">
            Welcome to the dashboard
            <Hand className="w-4 h-4 sm:w-5 sm:h-5 text-risk-medium" />
          </h1>
          <p className="text-[11.5px] sm:text-[12.5px] text-muted-foreground mt-0.5">
            Here&apos;s the overview of Pakistan Flood Risk
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <div className="lg:text-right">
            <div className="text-[11.5px] sm:text-[12px] text-muted-foreground">
              {now.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="text-[16px] sm:text-[18px] font-bold text-foreground font-mono tabular-nums">
              {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-primary/10 border border-primary/25">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[11.5px] sm:text-[12px] font-semibold text-primary">Live Updates</span>
          </div>
        </div>

      </div>

      {/* Risk tiles */}
      <RiskTiles districts={districts} />

      {/* Risk map — full width */}
      <motion.section
        id="risk-map"
        initial={{ opacity: 0, scale: 0.995 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative panel p-0 overflow-hidden h-[340px] sm:h-[440px] lg:h-[560px]"
      >
        <div className="absolute inset-0">
          <LeafletMap
            provinces={provinces}
            selectedProvince={selectedProvince}
            onProvinceSelect={setSelectedProvince}
            layerVisibility={layerVisibility}
          />
          <MapLayersPanel layers={layerVisibility} onToggle={toggleLayer} />
          <button
            onClick={() => setSatelliteOpen(true)}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-[1001] flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-card/92 backdrop-blur-md border border-border shadow-lg text-[10px] sm:text-[11px] font-bold text-foreground hover:bg-muted transition-colors"
          >
            <Satellite className="w-3.5 h-3.5 text-primary" />
            <span className="whitespace-nowrap">Satellite View</span>
          </button>
        </div>
      </motion.section>

      {satelliteOpen && (
        <SatelliteView provinces={provinces} onClose={() => setSatelliteOpen(false)} />
      )}



      {/* Flood risk alerts by district (high → medium → low) */}
      <DistrictAlertsPanel districts={districts} onSelectProvince={setSelectedProvince} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <RiskDistributionChart districts={districts} />
        <ProvinceRiskBreakdown districts={districts} onSelectProvince={setSelectedProvince} />
      </div>

      <RecentReportsCard provinces={provinces} />




      {/* Province detail + rainfall analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section id="province-detail" className="panel p-4">
          {selected ? (
            <ProvinceDetail province={selected} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Select a region on the map
            </div>
          )}
        </section>

        <section className="panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-lg bg-muted">
              <Satellite className="w-4 h-4 text-primary" />
            </span>
            <h2 className="text-[13.5px] font-semibold text-foreground">Cumulative Rainfall Analysis</h2>
          </div>
          <p className="text-[10.5px] text-muted-foreground mb-3 font-mono">
            Actual vs predicted · Red line = flood threshold (80mm)
          </p>
          <RainfallChart data={rainfallTrend} />
        </section>
      </div>


      {/* Population + model metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="panel p-4">
          <PopulationAffectedChart data={provinces} />
        </section>
        <section className="panel p-4">
          <ModelMetrics data={modelMetricsData} />
        </section>
      </div>

      <DataSourcesBar precision={modelMetricsData ? modelMetricsData.precision * (modelMetricsData.precision <= 1 ? 100 : 1) : undefined} lastSync={lastSync} />
    </div>
  );
};

export default Index;
