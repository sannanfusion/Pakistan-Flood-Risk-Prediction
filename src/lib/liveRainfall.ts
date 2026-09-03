/**
 * liveRainfall.ts — real-time rainfall for Pakistani cities (Open-Meteo, no key required)
 * Returns live precipitation for major cities so the dashboard can show
 * where it is actually raining right now.
 */

export interface CityRain {
  name: string;
  province: string;
  lat: number;
  lng: number;
  /** mm in the current hour */
  rainNow: number;
  /** mm accumulated today */
  rainToday: number;
  /** mm over the last 24h forecast window */
  rain24h: number;
  cloudCover: number;
  temperature: number;
  isRaining: boolean;
}

export const PK_CITIES: { name: string; province: string; lat: number; lng: number }[] = [
  { name: 'Karachi', province: 'Sindh', lat: 24.86, lng: 67.01 },
  { name: 'Hyderabad', province: 'Sindh', lat: 25.39, lng: 68.37 },
  { name: 'Sukkur', province: 'Sindh', lat: 27.70, lng: 68.86 },
  { name: 'Lahore', province: 'Punjab', lat: 31.55, lng: 74.35 },
  { name: 'Multan', province: 'Punjab', lat: 30.20, lng: 71.47 },
  { name: 'Faisalabad', province: 'Punjab', lat: 31.42, lng: 73.08 },
  { name: 'Rawalpindi', province: 'Punjab', lat: 33.60, lng: 73.05 },
  { name: 'Islamabad', province: 'Capital', lat: 33.68, lng: 73.05 },
  { name: 'Peshawar', province: 'KPK', lat: 34.01, lng: 71.58 },
  { name: 'Swat', province: 'KPK', lat: 35.22, lng: 72.34 },
  { name: 'Quetta', province: 'Balochistan', lat: 30.18, lng: 67.00 },
  { name: 'Gwadar', province: 'Balochistan', lat: 25.13, lng: 62.33 },
  { name: 'Gilgit', province: 'Gilgit-Baltistan', lat: 35.92, lng: 74.31 },
  { name: 'Skardu', province: 'Gilgit-Baltistan', lat: 35.30, lng: 75.63 },
  { name: 'Muzaffarabad', province: 'Azad Kashmir', lat: 34.37, lng: 73.47 },
  { name: 'Mirpur', province: 'Azad Kashmir', lat: 33.15, lng: 73.75 },
  { name: 'Larkana', province: 'Sindh', lat: 27.56, lng: 68.21 },
  { name: 'Mirpur Khas', province: 'Sindh', lat: 25.53, lng: 69.01 },
  { name: 'Bahawalpur', province: 'Punjab', lat: 29.40, lng: 71.68 },
  { name: 'Sialkot', province: 'Punjab', lat: 32.49, lng: 74.53 },
  { name: 'Sargodha', province: 'Punjab', lat: 32.08, lng: 72.67 },
  { name: 'D.G. Khan', province: 'Punjab', lat: 30.05, lng: 70.64 },
  { name: 'Abbottabad', province: 'KPK', lat: 34.15, lng: 73.22 },
  { name: 'Mardan', province: 'KPK', lat: 34.20, lng: 72.05 },
  { name: 'Chitral', province: 'KPK', lat: 35.85, lng: 71.79 },
  { name: 'Sibi', province: 'Balochistan', lat: 29.55, lng: 67.88 },
  { name: 'Turbat', province: 'Balochistan', lat: 26.00, lng: 63.04 },
];

export async function fetchLiveRainfall(): Promise<CityRain[]> {
  const lat = PK_CITIES.map((c) => c.lat).join(',');
  const lng = PK_CITIES.map((c) => c.lng).join(',');

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=precipitation,rain,cloud_cover,temperature_2m` +
    `&hourly=precipitation&past_days=1&forecast_days=1&timezone=Asia%2FKarachi`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Rainfall API error: ${res.status}`);
  const json = await res.json();
  const list = Array.isArray(json) ? json : [json];

  return PK_CITIES.map((city, i) => {
    const d = list[i] ?? {};
    const rainNow = Math.max(0, d.current?.precipitation ?? 0);

    // Observed-only accumulation: sum hourly values up to the current local hour.
    const times: string[] = d.hourly?.time ?? [];
    const hourly: number[] = d.hourly?.precipitation ?? [];
    const currentTime: string = d.current?.time ?? '';
    const nowIdx = currentTime ? times.indexOf(currentTime.slice(0, 13) + ':00') : -1;
    const endIdx = nowIdx >= 0 ? nowIdx : times.length - 1;
    const today = currentTime.slice(0, 10);

    let rainToday = 0;
    let rain24h = 0;
    for (let h = 0; h <= endIdx; h++) {
      const v = Math.max(0, hourly[h] ?? 0);
      if (times[h]?.slice(0, 10) === today) rainToday += v;
      if (endIdx - h < 24) rain24h += v;
    }

    return {
      ...city,
      rainNow: Number(rainNow.toFixed(2)),
      rainToday: Number(rainToday.toFixed(1)),
      rain24h: Number(rain24h.toFixed(1)),
      cloudCover: Math.round(d.current?.cloud_cover ?? 0),
      temperature: Math.round(d.current?.temperature_2m ?? 0),
      isRaining: rainNow > 0,
    };
  });
}
