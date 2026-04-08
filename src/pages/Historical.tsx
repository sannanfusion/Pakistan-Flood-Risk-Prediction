import { RISK_COLORS, ProvinceData, RiskLevel } from '@/lib/types';
import { Calendar, Users, MapPin, Skull, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchFloodData } from '@/lib/floodData';

interface FloodEventFromAPI {
  id: string;
  region: string;
  description: string;
  date: string;
  affectedPopulation: number;
  severity: RiskLevel;
  deaths: number;
  housesDamaged: number;
}

/**
 * Derive historical-style flood events from the live province data.
 * Each province with a lastFloodDate becomes a "historical event",
 * enriched with real NDMA stats (deaths, houses damaged).
 */
function deriveFloodEvents(provinces: ProvinceData[]): FloodEventFromAPI[] {
  return provinces
    .filter((p) => p.lastFloodDate)
    .map((p) => ({
      id: p.id,
      region: p.name,
      description: getFloodDescription(p),
      date: p.lastFloodDate,
      affectedPopulation: Math.round(p.population * (p.riskScore / 100) * 0.15),
      severity: p.riskLevel,
      deaths: p.deaths,
      housesDamaged: p.housesDamaged,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getFloodDescription(p: ProvinceData): string {
  if (p.riskLevel === 'high') return `Severe flooding — ${p.rainfall7Day}mm rainfall in 7 days, river discharge at ${(p.riverDischarge / 1000).toFixed(1)}k cumecs`;
  if (p.riskLevel === 'medium') return `Moderate flood risk with ${p.rainfall7Day}mm rainfall, elevated river levels`;
  return `Normal conditions — ${p.rainfall7Day}mm rainfall, low risk`;
}

const Historical = () => {
  const [events, setEvents] = useState<FloodEventFromAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchFloodData();
        if (!cancelled) setEvents(deriveFloodEvents(data.provinces));
      } catch (err) {
        console.error('Historical fetch error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[40vh] gap-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <div className="text-muted-foreground text-sm">Loading historical data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Historical Flood Events</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Analysis of past flood events across Pakistan — powered by NDMA & NASA data
        </p>
      </div>

      <div className="grid gap-4">
        {events.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-20">
            No historical data available
          </div>
        ) : (
          events.map((event, i) => (
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
                      <Users className="w-3.5 h-3.5" />{' '}
                      {(event.affectedPopulation / 1e6).toFixed(1)}M affected
                    </span>
                    {event.deaths > 0 && (
                      <span className="flex items-center gap-1 text-risk-high">
                        <Skull className="w-3.5 h-3.5" /> {event.deaths} deaths
                      </span>
                    )}
                    {event.housesDamaged > 0 && (
                      <span className="flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" /> {event.housesDamaged.toLocaleString()} houses
                      </span>
                    )}
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
                  animate={{
                    width: `${Math.min((event.affectedPopulation / 15000000) * 100, 100)}%`,
                  }}
                  transition={{ delay: i * 0.08 + 0.3, duration: 0.8 }}
                />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Historical;