import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CloudRain, Cloud, Droplets, RefreshCw } from 'lucide-react';
import { CityRain, fetchLiveRainfall } from '@/lib/liveRainfall';

function rainTone(mm: number) {
  if (mm >= 10) return { color: '#3b82f6', label: 'Heavy' };
  if (mm >= 2.5) return { color: '#38bdf8', label: 'Moderate' };
  if (mm > 0) return { color: '#7dd3fc', label: 'Light' };
  return { color: '#64748b', label: 'Dry' };
}

function markerHtml(city: CityRain) {
  const tone = rainTone(city.rainNow);
  const raining = city.rainNow > 0;
  const drops = raining
    ? `<g>
        <rect x="12" y="21" width="2" height="7" rx="1" fill="${tone.color}">
          <animate attributeName="y" values="20;27" dur="1s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0" dur="1s" repeatCount="indefinite"/>
        </rect>
        <rect x="18" y="21" width="2" height="7" rx="1" fill="${tone.color}">
          <animate attributeName="y" values="20;27" dur="1.3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0" dur="1.3s" repeatCount="indefinite"/>
        </rect>
        <rect x="24" y="21" width="2" height="7" rx="1" fill="${tone.color}">
          <animate attributeName="y" values="20;27" dur="0.85s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0" dur="0.85s" repeatCount="indefinite"/>
        </rect>
      </g>`
    : '';

  return `<div style="width:40px;height:44px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.45));">
    <svg width="40" height="44" viewBox="0 0 40 44" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 20a6 6 0 0 1 .6-11.9A9 9 0 0 1 29 9.5a5.5 5.5 0 0 1 .3 10.5z"
        fill="${raining ? '#cbd5e1' : '#94a3b8'}" opacity="${raining ? 0.98 : 0.55}"/>
      ${drops}
    </svg>
  </div>`;
}

export function LiveRainfallMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const groupRef = useRef<L.LayerGroup | null>(null);
  const [cities, setCities] = useState<CityRain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updated, setUpdated] = useState<Date | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchLiveRainfall();
      setCities(data);
      setUpdated(new Date());
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load rainfall');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, {
      center: [30.2, 69.5],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      minZoom: 4,
      maxZoom: 9,
      zoomSnap: 0.25,
    });
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 16, maxNativeZoom: 12, attribution: '&copy; Esri' },
    ).addTo(map);
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 16, maxNativeZoom: 12, opacity: 0.85 },
    ).addTo(map);
    map.fitBounds([[23.5, 60.5], [37.3, 78.0]], { padding: [16, 16] });
    groupRef.current = L.layerGroup().addTo(map);
    mapInstance.current = map;
    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const group = groupRef.current;
    if (!group || cities.length === 0) return;
    group.clearLayers();

    cities.forEach((city) => {
      const tone = rainTone(city.rainNow);

      if (city.rainNow > 0) {
        L.circle([city.lat, city.lng], {
          radius: 30000 + city.rainNow * 6000,
          color: tone.color,
          weight: 1,
          fillColor: tone.color,
          fillOpacity: 0.16,
          opacity: 0.45,
        }).addTo(group);
      }

      L.marker([city.lat, city.lng], {
        icon: L.divIcon({ className: 'rain-marker', html: markerHtml(city), iconSize: [40, 44], iconAnchor: [20, 34] }),
      })
        .addTo(group)
        .bindTooltip(
          `<div style="font-family:Inter,sans-serif;min-width:130px;padding:9px 11px;background:#0f1a22;border-radius:12px;border:1px solid rgba(255,255,255,0.08);border-left:3px solid ${tone.color};box-shadow:0 10px 28px rgba(0,0,0,0.55);">
            <div style="font-size:12px;font-weight:700;color:#f1f7fa;">${city.name}</div>
            <div style="font-size:9.5px;color:#93a4b1;margin-bottom:5px;">${city.province}</div>
            <div style="font-size:19px;font-weight:800;color:${tone.color};line-height:1;">${city.rainNow}<span style="font-size:9px;color:#93a4b1;font-weight:600;"> mm/h</span></div>
            <div style="font-size:9.5px;color:#93a4b1;margin-top:5px;">Today ${city.rainToday}mm · ${city.cloudCover}% cloud · ${city.temperature}°C</div>
          </div>`,
          { direction: 'top', className: 'clean-tooltip', offset: [0, -6] },
        );
    });
  }, [cities]);

  const ranked = useMemo(
    () => [...cities].sort((a, b) => b.rainToday - a.rainToday || b.rainNow - a.rainNow).slice(0, 8),
    [cities],
  );
  const rainingCount = cities.filter((c) => c.isRaining).length;

  return (
    <section id="rainfall" className="panel p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="p-1.5 rounded-lg bg-rain/10 border border-rain/20">
            <CloudRain className="w-4 h-4 text-rain" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[13.5px] font-semibold text-foreground truncate">Current Rainfall — Live Across Pakistan</h2>
            <p className="text-[10.5px] text-muted-foreground font-mono truncate">
              {loading && cities.length === 0
                ? 'Fetching live observations…'
                : `${rainingCount} of ${cities.length} cities receiving rain${updated ? ` · updated ${updated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}`}
            </p>
          </div>
        </div>
        <button
          onClick={load}
          aria-label="Refresh live rainfall"
          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error ? (
        <div className="h-[300px] flex items-center justify-center text-[12px] text-risk-high">{error}</div>
      ) : (
        <>
          <div className="relative h-[340px] rounded-2xl overflow-hidden border border-border">
            <div ref={mapRef} className="w-full h-full" />
            <div className="absolute bottom-3 left-3 z-[500] bg-card/92 backdrop-blur-md rounded-xl border border-border px-3 py-2">
              <div className="text-[10px] font-semibold text-foreground mb-1.5">Rain Intensity</div>
              <div className="flex flex-col gap-1">
                {[
                  { l: 'Heavy (≥10 mm/h)', c: '#3b82f6' },
                  { l: 'Moderate (2.5–10)', c: '#38bdf8' },
                  { l: 'Light (0–2.5)', c: '#7dd3fc' },
                  { l: 'Dry / cloudy', c: '#64748b' },
                ].map((i) => (
                  <div key={i.l} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: i.c }} />
                    <span className="text-[9.5px] text-muted-foreground whitespace-nowrap">{i.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-3.5 h-3.5 text-rain" />
              <h3 className="text-[12px] font-semibold text-foreground">Cities With Most Rain Today</h3>
            </div>
            <div className="space-y-1.5">
              {ranked.map((c, i) => {
                const tone = rainTone(c.rainNow);
                const max = ranked[0]?.rainToday || 1;
                return (
                  <div key={c.name} className="flex items-center gap-3 px-2.5 py-2 rounded-xl bg-muted/40 border border-border">
                    <span className="text-[10px] font-mono text-muted-foreground w-4">{i + 1}</span>
                    {c.rainNow > 0 ? (
                      <CloudRain className="w-4 h-4 shrink-0" style={{ color: tone.color }} />
                    ) : (
                      <Cloud className="w-4 h-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-semibold text-foreground truncate">{c.name}</span>
                      <span className="block text-[10px] text-muted-foreground truncate">{c.province}</span>
                    </span>
                    <span className="hidden sm:block w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${Math.min(100, (c.rainToday / max) * 100)}%`, background: tone.color }}
                      />
                    </span>
                    <span className="text-right shrink-0">
                      <span className="block text-[12.5px] font-bold font-mono tabular-nums text-foreground">{c.rainToday}mm</span>
                      <span className="block text-[9.5px] font-mono text-muted-foreground">{tone.label.toLowerCase()} · now {c.rainNow}</span>
                    </span>
                  </div>
                );
              })}
              {!loading && ranked.length === 0 && (
                <div className="py-6 text-center text-[12px] text-muted-foreground">No rainfall observations available</div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
