import { motion } from 'framer-motion';
import { Bell, Database, Globe, Shield, Sliders } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure data sources, alert thresholds, and display preferences
        </p>
      </div>

      {[
        { icon: Globe, title: 'Data Sources', desc: 'NASA IMERG, NDMA, WAPDA feeds', status: 'Connected' },
        { icon: Bell, title: 'Alert Thresholds', desc: 'Configure risk score triggers', status: '3 Active' },
        { icon: Database, title: 'Data Retention', desc: 'Historical data storage period', status: '365 days' },
        { icon: Shield, title: 'Model Config', desc: 'Random Forest v2.4 parameters', status: 'Optimized' },
        { icon: Sliders, title: 'Display', desc: 'Map layers, chart preferences', status: 'Default' },
      ].map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between hover:shadow-md transition-shadow duration-300 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-muted">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {item.status}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default SettingsPage;
