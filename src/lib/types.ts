export type RiskLevel = 'low' | 'medium' | 'high';

export interface ProvinceData {
  id: string;
  name: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;

  rainfall7Day: number;
  prediction?: number;

  deaths?: number;
  housesDamaged?: number;

  // ✅ ADD THIS LINE
  alertActive?: boolean;

  // optional fields
  rainfall30Day?: number;
  riverDischarge?: number;
  riverDischargeThreshold?: number;
  population?: number;
  historicalFloods?: number;
  lastFloodDate?: string;

  districts?: {
    name: string;
    riskLevel: 'low' | 'medium' | 'high';
    riskScore: number;
  }[];
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
  low: 'hsl(142, 71%, 45%)',
  medium: 'hsl(45, 93%, 47%)',
  high: 'hsl(0, 72%, 51%)',
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
};
