export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ProvinceData {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  rainfall7Day: number; // mm
  rainfall30Day: number; // mm
  riverDischarge: number; // cumecs
  riverDischargeThreshold: number;
  population: number;
  historicalFloods: number; // count since 2010
  lastFloodDate: string;
  alertActive: boolean;
  districts: DistrictRisk[];
  coordinates: { lat: number; lng: number };
}

export interface DistrictRisk {
  name: string;
  riskScore: number;
  riskLevel: RiskLevel;
}

export interface RainfallDataPoint {
  date: string;
  rainfall: number;
  predicted: number;
  threshold: number;
}

export interface FloodEvent {
  id: string;
  date: string;
  region: string;
  severity: RiskLevel;
  description: string;
  affectedPopulation: number;
}

export interface Alert {
  id: string;
  region: string;
  level: RiskLevel;
  message: string;
  timestamp: string;
  isNew: boolean;
}

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: 'hsl(152, 69%, 42%)',
  medium: 'hsl(38, 92%, 55%)',
  high: 'hsl(0, 72%, 55%)',
  critical: 'hsl(0, 85%, 40%)',
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
  critical: 'Critical',
};
