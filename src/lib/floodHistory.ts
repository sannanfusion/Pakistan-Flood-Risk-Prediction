/**
 * floodHistory.ts — real historical data for Pakistan floods
 * ==========================================================
 * 1. Observed monsoon rainfall per province, fetched live from the
 *    Open-Meteo ERA5 Archive API (real reanalysis observations, no mock).
 * 2. Documented major flood events with official NDMA / UN OCHA figures.
 */

export interface MonsoonYear {
  year: number;
  /** Observed rainfall total (mm) for Jun 1 – Sep 30 */
  rainfallMm: number;
}

export interface ProvinceRainHistory {
  province: string;
  lat: number;
  lng: number;
  years: MonsoonYear[];
  /** mean of all observed monsoon totals */
  averageMm: number;
  /** most recent monsoon total */
  latestMm: number;
}

const PROVINCE_POINTS = [
  { province: 'Sindh', lat: 26.0, lng: 68.5 },
  { province: 'Punjab', lat: 31.0, lng: 72.5 },
  { province: 'Khyber Pakhtunkhwa', lat: 34.2, lng: 71.9 },
  { province: 'Balochistan', lat: 29.0, lng: 66.5 },
  { province: 'Gilgit-Baltistan', lat: 35.9, lng: 74.5 },
  { province: 'Azad Kashmir', lat: 34.2, lng: 73.6 },
];

/**
 * Fetch observed monsoon (Jun–Sep) rainfall totals per province for the
 * last `years` monsoon seasons from the Open-Meteo ERA5 archive.
 */
export async function fetchMonsoonHistory(years = 8): Promise<ProvinceRainHistory[]> {
  const thisYear = new Date().getFullYear();
  const monsoonEnded = new Date().getMonth() >= 9; // Oct onwards
  const lastYear = monsoonEnded ? thisYear : thisYear - 1;
  const firstYear = lastYear - (years - 1);

  const cacheKey = `pfrp-monsoon-${firstYear}-${lastYear}`;
  const cached = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(cacheKey) : null;
  if (cached) {
    try {
      return JSON.parse(cached) as ProvinceRainHistory[];
    } catch {
      /* ignore corrupt cache */
    }
  }

  // One batched request for all province points (avoids API rate limits).
  const lat = PROVINCE_POINTS.map((p) => p.lat).join(',');
  const lng = PROVINCE_POINTS.map((p) => p.lng).join(',');
  const url =
    `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}` +
    `&start_date=${firstYear}-06-01&end_date=${lastYear}-09-30` +
    `&daily=precipitation_sum&timezone=Asia%2FKarachi`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Archive API error: ${res.status}`);
  const json = await res.json();
  const list = Array.isArray(json) ? json : [json];

  const results = PROVINCE_POINTS.map((p, idx) => {
    const d = list[idx] ?? {};
    const dates: string[] = d.daily?.time ?? [];
    const values: number[] = d.daily?.precipitation_sum ?? [];

    const totals = new Map<number, number>();
    dates.forEach((date, i) => {
      const [y, m] = date.split('-').map(Number);
      if (m >= 6 && m <= 9) totals.set(y, (totals.get(y) ?? 0) + Math.max(0, values[i] ?? 0));
    });

    const yearRows: MonsoonYear[] = [...totals.entries()]
      .map(([year, mm]) => ({ year, rainfallMm: Number(mm.toFixed(1)) }))
      .sort((a, b) => a.year - b.year);

    const avg = yearRows.length ? yearRows.reduce((s, r) => s + r.rainfallMm, 0) / yearRows.length : 0;

    return {
      ...p,
      years: yearRows,
      averageMm: Number(avg.toFixed(1)),
      latestMm: yearRows.length ? yearRows[yearRows.length - 1].rainfallMm : 0,
    };
  });

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(results));
  } catch {
    /* storage full / unavailable */
  }

  return results;
}

export interface MajorFloodEvent {
  id: string;
  title: string;
  period: string;
  regions: string;
  deaths: number;
  affected: number;
  housesDamaged: number;
  severity: 'high' | 'medium' | 'low';
  summary: string;
  source: string;
  sourceUrl: string;
}

/** Documented events with official reported figures (NDMA / UN OCHA / PMD). */
export const MAJOR_FLOOD_EVENTS: MajorFloodEvent[] = [
  {
    id: '2022',
    title: '2022 Pakistan floods',
    period: 'Jun – Oct 2022',
    regions: 'Sindh, Balochistan, South Punjab, KPK',
    deaths: 1739,
    affected: 33000000,
    housesDamaged: 2100000,
    severity: 'high',
    summary:
      'Record monsoon rainfall — nationally about 190% above the 30-year average, Sindh about 466% above normal — submerged roughly one-third of the country and caused an estimated US$30 billion in damage and loss.',
    source: 'NDMA / UN OCHA situation reports',
    sourceUrl: 'https://www.ndma.gov.pk/',
  },
  {
    id: '2010',
    title: '2010 Indus River floods',
    period: 'Jul – Sep 2010',
    regions: 'KPK, Punjab, Sindh, Balochistan',
    deaths: 1985,
    affected: 20000000,
    housesDamaged: 1900000,
    severity: 'high',
    summary:
      'Exceptional monsoon rain over the upper Indus catchment produced a flood wave that travelled the full length of the river, inundating about 20% of Pakistan’s land area.',
    source: 'NDMA annual report 2010',
    sourceUrl: 'https://www.ndma.gov.pk/',
  },
  {
    id: '2011',
    title: '2011 Sindh floods',
    period: 'Aug – Sep 2011',
    regions: 'Sindh, eastern Balochistan',
    deaths: 516,
    affected: 5400000,
    housesDamaged: 1500000,
    severity: 'high',
    summary:
      'Heavy, persistent late-monsoon rainfall over lower Sindh flooded 22 districts and destroyed large areas of standing cotton, rice and sugarcane crops.',
    source: 'NDMA / OCHA',
    sourceUrl: 'https://www.ndma.gov.pk/',
  },
  {
    id: '2014',
    title: '2014 Chenab & Jhelum floods',
    period: 'Sep 2014',
    regions: 'Punjab, Azad Kashmir',
    deaths: 367,
    affected: 2530000,
    housesDamaged: 129880,
    severity: 'medium',
    summary:
      'Intense rainfall over the Chenab and Jhelum catchments produced very high flood peaks at Marala and Head Trimmu, affecting central and southern Punjab.',
    source: 'NDMA',
    sourceUrl: 'https://www.ndma.gov.pk/',
  },
  {
    id: '2020',
    title: '2020 urban & riverine floods',
    period: 'Jul – Aug 2020',
    regions: 'Karachi, Sindh, eastern Balochistan',
    deaths: 410,
    affected: 500000,
    housesDamaged: 50000,
    severity: 'medium',
    summary:
      'Karachi recorded its wettest August on record (about 484 mm), overwhelming urban drainage while riverine flooding hit interior Sindh and Balochistan.',
    source: 'PMD / NDMA',
    sourceUrl: 'https://www.pmd.gov.pk/',
  },
  {
    id: '2025',
    title: '2025 monsoon floods',
    period: 'Jun – Sep 2025',
    regions: 'Punjab, KPK, Gilgit-Baltistan, Azad Kashmir',
    deaths: 1000,
    affected: 4200000,
    housesDamaged: 100000,
    severity: 'high',
    summary:
      'Cloudbursts and glacial-lake outburst events in the north combined with record Ravi, Chenab and Sutlej inflows to flood large parts of central Punjab.',
    source: 'NDMA daily situation reports 2025',
    sourceUrl: 'https://www.ndma.gov.pk/',
  },
];
