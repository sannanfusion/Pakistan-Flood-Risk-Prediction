import { provinces } from '@/lib/floodData';
import { RISK_COLORS } from '@/lib/types';
import { FileText, Download, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risk Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Provincial risk assessment summaries
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors border border-primary/20">
          <Download className="w-4 h-4" /> Export All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {provinces.map((province, i) => (
          <motion.div
            key={province.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 rounded-xl bg-card border border-border hover:border-primary/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/60">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{province.name}</h3>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Last updated: Feb 16, 2026
                  </p>
                </div>
              </div>
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border"
                style={{
                  color: RISK_COLORS[province.riskLevel],
                  borderColor: RISK_COLORS[province.riskLevel] + '40',
                  backgroundColor: RISK_COLORS[province.riskLevel] + '15',
                }}
              >
                {province.riskScore}%
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center p-2 rounded bg-secondary/30">
                <div className="text-[10px] text-muted-foreground mb-0.5">7d Rain</div>
                <div className="font-mono text-xs font-bold text-foreground">{province.rainfall7Day}mm</div>
              </div>
              <div className="text-center p-2 rounded bg-secondary/30">
                <div className="text-[10px] text-muted-foreground mb-0.5">Discharge</div>
                <div className="font-mono text-xs font-bold text-foreground">{(province.riverDischarge / 1000).toFixed(1)}k</div>
              </div>
              <div className="text-center p-2 rounded bg-secondary/30">
                <div className="text-[10px] text-muted-foreground mb-0.5">Population</div>
                <div className="font-mono text-xs font-bold text-foreground">{(province.population / 1e6).toFixed(1)}M</div>
              </div>
            </div>

            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${province.riskScore}%`,
                  backgroundColor: RISK_COLORS[province.riskLevel],
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
