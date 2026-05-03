import { useState, useEffect, useCallback } from 'react';
import { LeafletMap } from '@/components/LeafletMap';
import { MapLayersPanel, LayerVisibility } from '@/components/MapLayersPanel';
import { ProvinceDetail } from '@/components/ProvinceDetail';
import { AlertsPanel } from '@/components/AlertsPanel';
import { RainfallChart } from '@/components/RainfallChart';
import { ModelMetrics } from '@/components/ModelMetrics';
import { RiskOverviewChart } from '@/components/RiskOverviewChart';
import { PopulationAffectedChart } from '@/components/PopulationAffectedChart';
import { DonutStatCards } from '@/components/DonutStatCards';
import { LiveIndicator } from '@/components/LiveIndicator';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { fetchFloodData, FloodApiResponse } from '@/lib/floodData';
import { ProvinceData, RainfallDataPoint, Alert } from '@/lib/types';
import { Droplets, Waves, AlertTriangle, Shield, MapPin, Satellite, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const DashCard = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Index = () => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>('sindh');
  const [provinces, setProvinces] = useState<ProvinceData[]>([]);
  const [rainfallTrend, setRainfallTrend] = useState<RainfallDataPoint[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [modelMetricsData, setModelMetricsData] = useState<FloodApiResponse['modelMetrics'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
    provinces: true,
    floodZones: true,
    rivers: true,
    cities: true,
    stations: true,
  });

  const selected = provinces.find((p) => p.id === selectedProvince) || null;

  const toggleLayer = useCallback((layer: keyof LayerVisibility) => {
    setLayerVisibility((prev) => ({ ...prev, [layer]: !prev[layer] }));
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
        console.log('✅ API data loaded:', data);
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to load data');
        console.error('❌ API error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Stats (computed from live data)
  const highRiskCount = provinces.filter((p) => p.riskLevel === 'high').length;
  const totalRainfall = provinces.length > 0
    ? Math.round(provinces.reduce((s, p) => s + p.rainfall7Day, 0) / provinces.length)
    : 0;
  const alertCount = provinces.filter((p) => p.alertActive).length;
  const avgRisk = provinces.length > 0
    ? Math.round(provinces.reduce((s, p) => s + p.riskScore, 0) / provinces.length)
    : 0;

  // Subtle live fluctuation
  const [simRainfall, setSimRainfall] = useState(0);
  const [simRisk, setSimRisk] = useState(0);

  useEffect(() => {
    setSimRainfall(totalRainfall);
    setSimRisk(avgRisk);
    const interval = setInterval(() => {
      setSimRainfall(totalRainfall + Math.round((Math.random() - 0.5) * 6));
      setSimRisk(avgRisk + Math.round((Math.random() - 0.5) * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, [totalRainfall, avgRisk]);

  const stats = [
    { icon: <AlertTriangle className="w-4 h-4 text-risk-high" />, label: 'High Risk Regions', value: highRiskCount, suffix: `/${provinces.length}`, trend: highRiskCount > 0 ? `+${highRiskCount}` : '—' },
    { icon: <Droplets className="w-4 h-4 text-primary" />, label: 'Avg 7-Day Rain', value: simRainfall, suffix: 'mm', trend: totalRainfall > 80 ? '⚠' : '—' },
    { icon: <Waves className="w-4 h-4 text-risk-medium" />, label: 'Active Alerts', value: alertCount, suffix: '', trend: '—' },
    { icon: <Shield className="w-4 h-4 text-primary" />, label: 'Mean Risk Score', value: simRisk, suffix: '/100', trend: avgRisk > 50 ? '↑' : '—' },
  ];

  // Loading state
  // Loading state (Upgraded Satellite Scanning UI)
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden">
        {/* Subtle Background Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: `linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)`,
            backgroundSize: '40px 40px' 
          }} 
        />

        <div className="relative flex flex-col items-center">
          {/* Radar Scanner Animation */}
          <div className="relative w-48 h-48 mb-8">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
            
            {/* Pulsing Circles */}
            <div className="absolute inset-0 border border-primary/40 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            
            {/* The Scanner Sweep */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, rgba(59, 130, 246, 0.4) 100%)',
                animation: 'spin 2s linear infinite'
              }}
            />

            {/* Central Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Satellite className="w-10 h-10 text-primary animate-pulse" />
            </div>

            {/* Scanning Dots (Simulating Data Points) */}
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-risk-high rounded-full animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* Text Content */}
          <div className="text-center z-10">
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">
              Pakistan Flood Risk Prediction
            </h2>
            <div className="flex flex-col items-center gap-1">
              <p className="text-muted-foreground text-sm font-medium animate-pulse">
                Please wait while we load the dashboard for you
              </p>
              <div className="flex items-center gap-2 mt-4 px-3 py-1 bg-muted rounded-full border border-border">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Synchronizing NASA & NDMA Streams
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CSS for the sweep animation */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}} />
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
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Pakistan Flood Risk Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Real-time satellite-based prediction system</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <DataSourceBadge sources={['nasa', 'ndma', 'wapda']} />
          </div>
        </div>
        <LiveIndicator />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <DashCard className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">{s.icon}</div>
              <div className="min-w-0">
                <div className="text-[11px] text-muted-foreground font-medium">{s.label}</div>
                <div className="flex items-baseline gap-2">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                  <span className="text-[10px] font-mono text-risk-low font-semibold">{s.trend}</span>
                </div>
              </div>
            </DashCard>
          </motion.div>
        ))}
      </div>

      {/* Donut Statistics Overview */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <DashCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-muted">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Risk Overview Summary</h2>
            </div>
            <DataSourceBadge sources={['nasa', 'ndma', 'wapda']} />
          </div>
          <DonutStatCards data={provinces} />
        </DashCard>
      </motion.div>

      {/* Map */}
      <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
        <DashCard className="p-5 h-[500px] lg:h-[620px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-muted">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Satellite Risk Map — Flood Extent & Monitoring</h2>
            </div>
            <DataSourceBadge sources={['nasa']} />
          </div>
          <div className="relative h-[calc(100%-40px)]">
            <LeafletMap
              provinces={provinces}
              selectedProvince={selectedProvince}
              onProvinceSelect={setSelectedProvince}
              layerVisibility={layerVisibility}
            />
            <MapLayersPanel layers={layerVisibility} onToggle={toggleLayer} />
          </div>
        </DashCard>
      </motion.div>

      {/* Province + Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-5">
          <DashCard className="p-5 h-full">
            {selected ? (
              <ProvinceDetail province={selected} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Select a region on the map
              </div>
            )}
          </DashCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="lg:col-span-7">
          <DashCard className="p-5 h-full">
            <AlertsPanel alerts={alerts} />
          </DashCard>
        </motion.div>
      </div>

      {/* Charts Row (FIXED ALIGNMENT) */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35 }}
  >
    <DashCard className="p-5 h-full">
      <PopulationAffectedChart data={provinces} />
    </DashCard>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
  >
    <DashCard className="p-5 h-full">
      <ModelMetrics data={modelMetricsData} />
    </DashCard>
  </motion.div>

</div>

      {/* Provincial Risk Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <DashCard className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-muted">
                  <AlertTriangle className="w-4 h-4 text-risk-medium" />
                </div>
                Provincial Risk Comparison
              </h2>
              <DataSourceBadge sources={['ndma']} />
            </div>
            <RiskOverviewChart data={provinces} />
          </DashCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <DashCard className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-muted">
                  <Satellite className="w-4 h-4 text-primary" />
                </div>
                Cumulative Rainfall Analysis
              </h2>
              <DataSourceBadge sources={['nasa', 'wapda']} />
            </div>
            <p className="text-[10px] text-muted-foreground mb-3 font-mono">
              Actual vs predicted · Red line = flood threshold (80mm)
            </p>
            <RainfallChart data={rainfallTrend} />
          </DashCard>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[10px] text-muted-foreground font-mono py-6 mt-4 border-t border-border">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block bg-primary" />
            NASA GPM/IMERG
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block bg-risk-low" />
            NDMA Pakistan
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block bg-risk-medium" />
            WAPDA River Discharge
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block bg-risk-high" />
            Sentinel-2 / MODIS
          </span>
          <span>· Model: Random Forest (v2.4)</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;