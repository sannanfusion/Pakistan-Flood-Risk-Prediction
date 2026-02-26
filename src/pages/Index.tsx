import { useState, useEffect } from 'react';
import { LeafletMap } from '@/components/LeafletMap';
import { ProvinceDetail } from '@/components/ProvinceDetail';
import { AlertsPanel } from '@/components/AlertsPanel';
import { RainfallChart } from '@/components/RainfallChart';
import { ModelMetrics } from '@/components/ModelMetrics';
import { RiskOverviewChart } from '@/components/RiskOverviewChart';
import { LiveIndicator } from '@/components/LiveIndicator';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { provinces, rainfallTrend, alerts } from '@/lib/floodData';
import { Droplets, Waves, AlertTriangle, Shield, MapPin, Satellite } from 'lucide-react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`rounded-xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-lg shadow-black/20 ${className}`}
    {...props}
  >
    {children}
  </div>
);

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
    <div className="space-y-6 relative">
      <AnimatedBackground />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Flood Risk Dashboard
          </h1>
          <div className="flex items-center gap-3 mt-1.5">
            <p className="text-xs text-muted-foreground font-mono">
              Real-time prediction system
            </p>
            <DataSourceBadge sources={['nasa', 'ndma', 'wapda']} />
          </div>
        </div>
        <LiveIndicator />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <GlassCard className="p-4 flex items-center gap-3 hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5">
              <div className="p-2 rounded-lg bg-secondary/60 backdrop-blur-sm">{s.icon}</div>
              <div>
                <div className="text-[11px] text-muted-foreground">{s.label}</div>
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5"
        >
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">Satellite Risk Map</h2>
              </div>
              <DataSourceBadge sources={['nasa']} />
            </div>
            <LeafletMap
              provinces={provinces}
              selectedProvince={selectedProvince}
              onProvinceSelect={setSelectedProvince}
            />
          </GlassCard>
        </motion.div>

        {/* Province Detail */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          <GlassCard className="p-5 h-full">
            {selected ? (
              <ProvinceDetail province={selected} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Select a region on the map
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-4"
        >
          <GlassCard className="p-5 h-full">
            <AlertsPanel alerts={alerts} />
          </GlassCard>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-5"
        >
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Satellite className="w-4 h-4 text-water" /> 30-Day Rainfall Trend
              </h2>
              <DataSourceBadge sources={['nasa', 'wapda']} />
            </div>
            <p className="text-[10px] text-muted-foreground mb-2 font-mono">
              Actual vs predicted · Red line = flood threshold (80mm)
            </p>
            <RainfallChart data={rainfallTrend} />
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-4"
        >
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-foreground">Provincial Risk Comparison</h2>
              <DataSourceBadge sources={['ndma']} />
            </div>
            <RiskOverviewChart />
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-3"
        >
          <GlassCard className="p-5">
            <ModelMetrics />
          </GlassCard>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[10px] text-muted-foreground font-mono py-4 border-t border-border/50 relative z-10">
        Data: NASA GPM/IMERG · NDMA Pakistan · WAPDA River Discharge · Model: Random Forest (v2.4)
      </footer>
    </div>
  );
};

export default Index;
