/**
 * floodData.ts — API Service Layer
 * =================================
 * Single source of truth for all backend data.
 * No hardcoded/mock data remains.
 */

import { ProvinceData, RainfallDataPoint, Alert } from './types';

const API_BASE = 'http://localhost:5000';

export interface FloodApiResponse {
  provinces: ProvinceData[];
  alerts: Alert[];
  rainfallTrend: RainfallDataPoint[];
  modelMetrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
    lastTrained: string;
    dataPoints: number;
    features: number;
  };
}

/**
 * Fetch all flood data from the backend — single call, no duplicates.
 * Every component should use data from this response.
 */
export async function fetchFloodData(): Promise<FloodApiResponse> {
  const res = await fetch(`${API_BASE}/api/all`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();

  // Sanitize provinces — clamp negatives, fill missing fields
  const provinces: ProvinceData[] = (data.provinces || []).map((p: any) => ({
    id:                      p.id || '',
    name:                    p.name || 'Unknown',
    riskLevel:               (['low', 'medium', 'high'].includes(p.riskLevel) ? p.riskLevel : 'low') as ProvinceData['riskLevel'],
    riskScore:               Math.max(0, Math.min(100, p.riskScore ?? 0)),
    rainfall7Day:            Math.max(0, p.rainfall7Day ?? 0),
    rainfall30Day:           Math.max(0, p.rainfall30Day ?? 0),
    prediction:              Math.max(0, p.prediction ?? 0),
    riverDischarge:          Math.max(0, p.riverDischarge ?? 0),
    riverDischargeThreshold: Math.max(1, p.riverDischargeThreshold ?? 1),
    population:              Math.max(0, p.population ?? 0),
    historicalFloods:        Math.max(0, p.historicalFloods ?? 0),
    lastFloodDate:           p.lastFloodDate || '',
    alertActive:             !!p.alertActive,
    coordinates:             p.coordinates || { lat: 30, lng: 70 },
    districts:               (p.districts || []).map((d: any) => ({
      name:      d.name || '',
      riskScore: Math.max(0, Math.min(100, d.riskScore ?? 0)),
      riskLevel: (['low', 'medium', 'high'].includes(d.riskLevel) ? d.riskLevel : 'low') as 'low' | 'medium' | 'high',
    })),
    deaths:                  Math.max(0, p.deaths ?? 0),
    housesDamaged:           Math.max(0, p.housesDamaged ?? 0),
  }));

  // Sanitize alerts
  const alerts: Alert[] = (data.alerts || []).map((a: any) => ({
    id:         a.id || String(Math.random()),
    region:     a.region || 'Unknown',
    level:      (['low', 'medium', 'high'].includes(a.level) ? a.level : 'medium') as Alert['level'],
    message:    a.message || '',
    timestamp:  a.timestamp || new Date().toISOString(),
    isNew:      !!a.isNew,
  }));

  // Sanitize rainfall trend
  const rainfallTrend: RainfallDataPoint[] = (data.rainfallTrend || []).map((r: any) => ({
    date:      r.date || '',
    rainfall:  Math.max(0, r.rainfall ?? 0),
    predicted: Math.max(0, r.predicted ?? 0),
    threshold: r.threshold ?? 80,
  }));

  // Model metrics (pass through with defaults)
  const modelMetrics = {
    accuracy:    data.modelMetrics?.accuracy    ?? 0,
    precision:   data.modelMetrics?.precision   ?? 0,
    recall:      data.modelMetrics?.recall      ?? 0,
    f1Score:     data.modelMetrics?.f1Score     ?? 0,
    rocAuc:      data.modelMetrics?.rocAuc      ?? 0,
    lastTrained: data.modelMetrics?.lastTrained ?? 'N/A',
    dataPoints:  data.modelMetrics?.dataPoints  ?? 0,
    features:    data.modelMetrics?.features    ?? 0,
  };

  return { provinces, alerts, rainfallTrend, modelMetrics };
}
