import { recentFloodEvents } from '@/lib/floodData';
import { RISK_COLORS } from '@/lib/types';
import { Calendar, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Historical = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Historical Flood Events</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Analysis of Past Flood events across Pakistan since 2010
        </p>
      </div>

      <div className="grid gap-4">
        {recentFloodEvents.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">{event.description}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {event.region}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {(event.affectedPopulation / 1e6).toFixed(1)}M affected
                  </span>
                </div>
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-mono font-bold border shrink-0"
                style={{
                  color: RISK_COLORS[event.severity],
                  borderColor: RISK_COLORS[event.severity] + '30',
                  backgroundColor: RISK_COLORS[event.severity] + '10',
                }}
              >
                {event.severity.toUpperCase()}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: RISK_COLORS[event.severity] }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((event.affectedPopulation / 15000000) * 100, 100)}%` }}
                transition={{ delay: i * 0.08 + 0.3, duration: 0.8 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Historical;
