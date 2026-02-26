import { useState, useEffect } from 'react';
import { LeafletMap } from '@/components/LeafletMap';
import { ProvinceDetail } from '@/components/ProvinceDetail';
import { AlertsPanel } from '@/components/AlertsPanel';
import { RainfallChart } from '@/components/RainfallChart';
import { ModelMetrics } from '@/components/ModelMetrics';
import { RiskOverviewChart } from '@/components/RiskOverviewChart';
import { LiveIndicator } from '@/components/LiveIndicator';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { DashboardCard } from '@/components/DashboardCard';
import { StatCard } from '@/components/StatCard';
import { SectionHeader } from '@/components/SectionHeader';
import { RegionTable } from '@/components/RegionTable';
import { provinces, rainfallTrend, alerts } from '@/lib/floodData';
import { Droplets, Waves, AlertTriangle, Shield, Satellite, BarChart3, TableProperties } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>('sindh');
  const selected = provinces.find((p) => p.id === selectedProvince) || null;

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

  return (
    <div className="space-y-6 relative -m-6">
      <AnimatedBackground />

      {/* Hero Map Section */}
      <section className="relative z-10">
        {/* Header overlay on map */}
        <div className="absolute top-0 left-0 right-0 z-[500] p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-b from-background/90 via-background/50 to-transparent pointer-events-none">
          <div className="pointer-events-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Flood Risk Dashboard
            </h1>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <p className="text-xs text-muted-foreground font-mono">
                Pakistan Real-time Prediction System
              </p>
              <DataSourceBadge sources={['nasa', 'ndma', 'wapda']} />
            </div>
          </div>
          <div className="pointer-events-auto">
            <LiveIndicator />
          </div>
        </div>

        {/* Full-width map */}
        <div className="w-full h-[50vh] sm:h-[55vh] lg:h-[60vh]">
          <LeafletMap
            provinces={provinces}
            selectedProvince={selectedProvince}
            onProvinceSelect={setSelectedProvince}
          />
        </div>

        {/* Province detail overlay - floats on map on desktop */}
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block absolute bottom-4 right-4 z-[500] w-[340px]"
          >
            <DashboardCard className="max-h-[380px] overflow-y-auto scrollbar-thin">
              <ProvinceDetail province={selected} />
            </DashboardCard>
          </motion.div>
        )}
      </section>

      {/* Content area with padding */}
      <div className="px-4 sm:px-6 space-y-6 relative z-10">

        {/* Province detail on mobile/tablet - below map */}
        {selected && (
          <motion.div
            key={`mobile-${selected.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden"
          >
            <DashboardCard>
              <ProvinceDetail province={selected} />
            </DashboardCard>
          </motion.div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={<AlertTriangle className="w-5 h-5" />}
            label="High Risk Regions"
            value={highRiskCount}
            suffix={`/${provinces.length}`}
            index={0}
            trend="up"
          />
          <StatCard
            icon={<Droplets className="w-5 h-5" />}
            label="Avg 7-Day Rainfall"
            value={simRainfall}
            suffix="mm"
            index={1}
            trend="up"
          />
          <StatCard
            icon={<Waves className="w-5 h-5" />}
            label="Active Alerts"
            value={alertCount}
            suffix=""
            index={2}
          />
          <StatCard
            icon={<Shield className="w-5 h-5" />}
            label="Mean Risk Score"
            value={simRisk}
            suffix="/100"
            index={3}
            trend="stable"
          />
        </div>

        {/* Main Analytics Row: Chart (8 cols) + Alerts (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8"
          >
            <DashboardCard>
              <SectionHeader
                icon={<Satellite className="w-5 h-5 text-water" />}
                title="30-Day Rainfall Trend"
                badge={<DataSourceBadge sources={['nasa', 'wapda']} />}
              />
              <p className="text-xs text-muted-foreground mb-3 font-mono">
                Actual vs predicted · Red line = flood threshold (80mm)
              </p>
              <RainfallChart data={rainfallTrend} />
            </DashboardCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-4"
          >
            <DashboardCard className="h-full">
              <AlertsPanel alerts={alerts} />
            </DashboardCard>
          </motion.div>
        </div>

        {/* Secondary Row: Risk Chart + Model Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-5"
          >
            <DashboardCard>
              <SectionHeader
                icon={<BarChart3 className="w-5 h-5 text-primary" />}
                title="Provincial Risk Comparison"
                badge={<DataSourceBadge sources={['ndma']} />}
              />
              <RiskOverviewChart />
            </DashboardCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="lg:col-span-3"
          >
            <DashboardCard>
              <ModelMetrics />
            </DashboardCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-4"
          >
            <DashboardCard>
              <SectionHeader
                icon={<TableProperties className="w-5 h-5 text-primary" />}
                title="Region Overview"
              />
              <RegionTable />
            </DashboardCard>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="text-center text-[10px] text-muted-foreground font-mono py-6 border-t border-border/50">
          Data: NASA GPM/IMERG · NDMA Pakistan · WAPDA River Discharge · Model: Random Forest (v2.4)
        </footer>
      </div>
    </div>
  );
};

export default Index;
