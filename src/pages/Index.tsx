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
import { SatelliteImageryPanels } from '@/components/SatelliteImageryPanels';
import { LiveIndicator } from '@/components/LiveIndicator';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { provinces, rainfallTrend, alerts } from '@/lib/floodData';
import { Droplets, Waves, AlertTriangle, Shield, MapPin, Satellite, BarChart3, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const DashCard = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Index = () => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>('sindh');
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

  const highRiskCount = provinces.filter((p) => p.riskLevel === 'high' || p.riskLevel === 'critical').length;
  const totalRainfall = Math.round(provinces.reduce((s, p) => s + p.rainfall7Day, 0) / provinces.length);
  const alertCount = provinces.filter((p) => p.alertActive).length;
  const avgRisk = Math.round(provinces.reduce((s, p) => s + p.riskScore, 0) / provinces.length);

  const [simRainfall, setSimRainfall] = useState(totalRainfall);
  const [simRisk, setSimRisk] = useState(avgRisk);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimRainfall(totalRainfall + Math.round((Math.random() - 0.5) * 6));
      setSimRisk(avgRisk + Math.round((Math.random() - 0.5) * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, [totalRainfall, avgRisk]);

  const stats = [
    { icon: <AlertTriangle className="w-4 h-4 text-risk-high" />, label: 'High Risk Regions', value: highRiskCount, suffix: `/${provinces.length}`, trend: '+1' },
    { icon: <Droplets className="w-4 h-4 text-primary" />, label: 'Avg 7-Day Rain', value: simRainfall, suffix: 'mm', trend: '+12%' },
    { icon: <Waves className="w-4 h-4 text-risk-medium" />, label: 'Active Alerts', value: alertCount, suffix: '', trend: '—' },
    { icon: <Shield className="w-4 h-4 text-primary" />, label: 'Mean Risk Score', value: simRisk, suffix: '/100', trend: '+3' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Pakistan Flood Risk Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Real-time satellite-based prediction system</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <DataSourceBadge sources={['nasa', 'ndma', 'wapda']} />
          </div>
        </div>
        <LiveIndicator />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <DashCard className="p-5 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-primary/8">{s.icon}</div>
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
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DashCard className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Risk Overview Summary</h2>
            </div>
            <DataSourceBadge sources={['nasa', 'ndma', 'wapda']} />
          </div>
          <DonutStatCards />
        </DashCard>
      </motion.div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
      >
        <DashCard className="p-6 h-[500px] lg:h-[650px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Satellite Risk Map — Flood Extent & Monitoring Stations</h2>
            </div>
            <DataSourceBadge sources={['nasa']} />
          </div>
          <div className="relative h-[calc(100%-44px)]">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5"
        >
          <DashCard className="p-6 h-full">
            {selected ? (
              <ProvinceDetail province={selected} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Select a region on the map
              </div>
            )}
          </DashCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-7"
        >
          <DashCard className="p-6 h-full">
            <AlertsPanel alerts={alerts} />
          </DashCard>
        </motion.div>
      </div>

      {/* Satellite Imagery Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
      >
        <DashCard className="p-6">
          <SatelliteImageryPanels />
        </DashCard>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-5"
        >
          <DashCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Satellite className="w-4 h-4 text-primary" />
                </div>
                30-Day Rainfall Trend
              </h2>
              <DataSourceBadge sources={['nasa', 'wapda']} />
            </div>
            <p className="text-[10px] text-muted-foreground mb-3 font-mono">
              Actual vs predicted · Red line = flood threshold (80mm)
            </p>
            <RainfallChart data={rainfallTrend} />
          </DashCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-4"
        >
          <DashCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-risk-high/10">
                  <BarChart3 className="w-4 h-4 text-risk-high" />
                </div>
                Population at Risk
              </h2>
              <DataSourceBadge sources={['ndma']} />
            </div>
            <PopulationAffectedChart />
          </DashCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3"
        >
          <DashCard className="p-6">
            <ModelMetrics />
          </DashCard>
        </motion.div>
      </div>

      {/* Provincial Risk + Rainfall Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <DashCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-risk-medium/10">
                  <AlertTriangle className="w-4 h-4 text-risk-medium" />
                </div>
                Provincial Risk Comparison
              </h2>
              <DataSourceBadge sources={['ndma']} />
            </div>
            <RiskOverviewChart />
          </DashCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <DashCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
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
      <footer className="text-center text-[10px] text-muted-foreground font-mono py-8 mt-6 border-t border-border">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: 'hsl(210, 60%, 50%)' }} />
            NASA GPM/IMERG
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: 'hsl(152, 60%, 40%)' }} />
            NDMA Pakistan
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: 'hsl(38, 90%, 50%)' }} />
            WAPDA River Discharge
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: 'hsl(280, 60%, 50%)' }} />
            Sentinel-2 / MODIS
          </span>
          <span>· Model: Random Forest (v2.4)</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
