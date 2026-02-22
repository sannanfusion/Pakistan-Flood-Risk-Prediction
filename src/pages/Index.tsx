import { useState, useEffect } from 'react';
import { LeafletMap } from '@/components/LeafletMap';
import { ProvinceDetail } from '@/components/ProvinceDetail';
import { AlertsPanel } from '@/components/AlertsPanel';
import { RainfallChart } from '@/components/RainfallChart';
import { ModelMetrics } from '@/components/ModelMetrics';
import { RiskOverviewChart } from '@/components/RiskOverviewChart';
import { LiveIndicator } from '@/components/LiveIndicator';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { provinces, rainfallTrend, alerts } from '@/lib/floodData';
import { Droplets, Waves, AlertTriangle, Shield, MapPin, Satellite } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>('sindh');
  const selected = provinces.find((p) => p.id === selectedProvince) || null;

  const highRiskCount = provinces.filter((p) => p.riskLevel === 'high' || p.riskLevel === 'critical').length;
  const totalRainfall = Math.round(provinces.reduce((s, p) => s + p.rainfall7Day, 0) / provinces.length);
  const alertCount = provinces.filter((p) => p.alertActive).length;
  const avgRisk = Math.round(provinces.reduce((s, p) => s + p.riskScore, 0) / provinces.length);

  // Real-time simulation
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
    { icon: <AlertTriangle className="w-4 h-4 text-risk-high" />, label: 'High Risk Regions', value: highRiskCount, suffix: `/${provinces.length}` },
    { icon: <Droplets className="w-4 h-4 text-water" />, label: 'Avg 7-Day Rain', value: simRainfall, suffix: 'mm' },
    { icon: <Waves className="w-4 h-4 text-accent" />, label: 'Active Alerts', value: alertCount, suffix: '' },
    { icon: <Shield className="w-4 h-4 text-primary" />, label: 'Mean Risk Score', value: simRisk, suffix: '/100' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Flood Risk Dashboard
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            NASA IMERG + NDMA · Real-time prediction system
          </p>
        </div>
        <LiveIndicator />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-4 rounded-xl bg-card border border-border flex items-center gap-3 hover:border-primary/20 transition-colors"
          >
            <div className="p-2 rounded-lg bg-secondary/60">{s.icon}</div>
            <div>
              <div className="text-[11px] text-muted-foreground">{s.label}</div>
              <AnimatedCounter value={s.value} suffix={s.suffix} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 rounded-xl bg-card border border-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Satellite Risk Map</h2>
          </div>
          <LeafletMap
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
        </motion.div>

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
    </div>
  );
};

export default Index;
