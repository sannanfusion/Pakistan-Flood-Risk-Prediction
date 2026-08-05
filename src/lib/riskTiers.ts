import { ProvinceData, RiskLevel } from './types';

export type RiskTier = 'high' | 'medium' | 'low' | 'none';

export const TIER_META: Record<RiskTier, { label: string; range: string; color: string; token: string }> = {
  high:   { label: 'High Risk',   range: '71-100', color: 'hsl(var(--risk-high))',   token: 'risk-high' },
  medium: { label: 'Medium Risk', range: '41-70',  color: 'hsl(var(--risk-medium))', token: 'risk-medium' },
  low:    { label: 'Low Risk',    range: '11-40',  color: 'hsl(var(--risk-low))',    token: 'risk-low' },
  none:   { label: 'No Risk',     range: '0-10',   color: 'hsl(var(--risk-none))',   token: 'risk-none' },
};

/** Score → tier, matching the legend ranges shown on the risk map. */
export function scoreToTier(score: number): RiskTier {
  if (score >= 71) return 'high';
  if (score >= 41) return 'medium';
  if (score >= 11) return 'low';
  return 'none';
}

export interface DistrictRow {
  name: string;
  riskScore: number;
  riskLevel: RiskLevel;
  tier: RiskTier;
  provinceId: string;
  provinceName: string;
}

/** Flatten every district from the API payload — single source of truth for tile counts. */
export function flattenDistricts(provinces: ProvinceData[]): DistrictRow[] {
  return provinces.flatMap((p) =>
    (p.districts || []).map((d) => ({
      name: d.name,
      riskScore: d.riskScore,
      riskLevel: d.riskLevel,
      tier: scoreToTier(d.riskScore),
      provinceId: p.id,
      provinceName: p.name,
    })),
  );
}

export function tierCounts(districts: DistrictRow[]): Record<RiskTier, number> {
  return districts.reduce(
    (acc, d) => {
      acc[d.tier] += 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0, none: 0 } as Record<RiskTier, number>,
  );
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
