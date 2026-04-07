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
import Reports from '@/pages/Reports'; // ✅ ADD THIS
import { LiveIndicator } from '@/components/LiveIndicator';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { Droplets, Waves, AlertTriangle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProvinceData } from '@/lib/types';

const DashCard = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition ${className}`} {...props}>
    {children}
  </div>
);

const Index = () => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>('sindh');

  const [provinces, setProvinces] = useState<ProvinceData[]>([]);
  const [rainfallTrend, setRainfallTrend] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // STATS
  const highRiskCount = provinces.filter((p) => p.riskLevel === 'high').length;

  const totalRainfall =
    provinces.length > 0
      ? Math.round(provinces.reduce((s, p) => s + (p.rainfall7Day || 0), 0) / provinces.length)
      : 0;

  const alertCount = provinces.filter((p) => p.alertActive).length;

  const avgRisk =
    provinces.length > 0
      ? Math.round(provinces.reduce((s, p) => s + (p.riskScore || 0), 0) / provinces.length)
      : 0;

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

  // API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/all');
        const data = await res.json();

        console.log("API DATA:", data);

        setProvinces(data.provinces || []);
        setRainfallTrend(data.rainfallTrend || []);
        setAlerts(data.alerts || []);
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      icon: <AlertTriangle className="w-4 h-4 text-risk-high" />,
      label: 'High Risk Regions',
      value: highRiskCount,
      suffix: `/${provinces.length}`,
    },
    {
      icon: <Droplets className="w-4 h-4 text-primary" />,
      label: 'Avg 7-Day Rain',
      value: simRainfall,
      suffix: 'mm',
    },
    {
      icon: <Waves className="w-4 h-4 text-risk-medium" />,
      label: 'Active Alerts',
      value: alertCount,
      suffix: '',
    },
    {
      icon: <Shield className="w-4 h-4 text-primary" />,
      label: 'Mean Risk Score',
      value: simRisk,
      suffix: '/100',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        Loading NDMA Data...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Pakistan Flood Risk Dashboard</h1>
          <DataSourceBadge sources={['nasa', 'ndma', 'wapda']} />
        </div>
        <LiveIndicator />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <DashCard className="p-4 flex gap-3">
              <div className="p-2 bg-muted rounded">{s.icon}</div>
              <div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
            </DashCard>
          </motion.div>
        ))}
      </div>

      {/* MAP */}
      <DashCard className="p-5 h-[500px]">
        <LeafletMap
          provinces={provinces}
          selectedProvince={selectedProvince}
          onProvinceSelect={setSelectedProvince}
          layerVisibility={layerVisibility}
        />
        <MapLayersPanel layers={layerVisibility} onToggle={toggleLayer} />
      </DashCard>

      {/* DETAILS */}
      <div className="grid lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <DashCard className="p-5">
            {selected ? <ProvinceDetail province={selected} /> : <div>Select region</div>}
          </DashCard>
        </div>

        <div className="lg:col-span-7">
          <DashCard className="p-5">
            <AlertsPanel alerts={alerts} />
          </DashCard>
        </div>
      </div>

      {/* CHARTS */}
      <DashCard className="p-5">
        <RainfallChart data={rainfallTrend} />
      </DashCard>

      <DashCard className="p-5">
        <RiskOverviewChart data={provinces} />
      </DashCard>

      <DashCard className="p-5">
        <PopulationAffectedChart data={provinces} />
      </DashCard>

      <DashCard className="p-5">
        <DonutStatCards data={provinces} />
      </DashCard>

      <DashCard className="p-5">
        <ModelMetrics />
      </DashCard>

      {/* ✅ REPORTS (FINAL FIX) */}
      <DashCard className="p-5">
        <Reports />
      </DashCard>

    </div>
  );
};

export default Index;