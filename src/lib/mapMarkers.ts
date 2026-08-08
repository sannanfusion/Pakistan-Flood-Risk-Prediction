import { ProvinceData } from './types';
import { DistrictRow, scoreToTier } from './riskTiers';

/** Known coordinates for backend district records */
export const KNOWN_DISTRICT_COORDS: Record<string, { lat: number; lng: number; type: 'city' | 'station' }> = {
  Sukkur: { lat: 27.70, lng: 68.86, type: 'station' },
  Larkana: { lat: 27.56, lng: 68.21, type: 'city' },
  Dadu: { lat: 26.73, lng: 67.78, type: 'station' },
  Hyderabad: { lat: 25.39, lng: 68.37, type: 'city' },
  Thatta: { lat: 24.75, lng: 67.92, type: 'city' },
  Karachi: { lat: 24.86, lng: 67.01, type: 'city' },
  Muzaffargarh: { lat: 30.07, lng: 71.19, type: 'station' },
  Rajanpur: { lat: 29.10, lng: 70.33, type: 'station' },
  'D.G. Khan': { lat: 30.05, lng: 70.64, type: 'city' },
  Lahore: { lat: 31.55, lng: 74.35, type: 'city' },
  Multan: { lat: 30.20, lng: 71.47, type: 'city' },
  Faisalabad: { lat: 31.42, lng: 73.08, type: 'city' },
  Rawalpindi: { lat: 33.60, lng: 73.05, type: 'city' },
  Swat: { lat: 35.22, lng: 72.34, type: 'station' },
  Nowshera: { lat: 34.02, lng: 71.97, type: 'city' },
  Charsadda: { lat: 34.15, lng: 71.74, type: 'city' },
  Peshawar: { lat: 34.01, lng: 71.58, type: 'city' },
  Quetta: { lat: 30.18, lng: 67.00, type: 'city' },
  Lasbela: { lat: 26.23, lng: 66.05, type: 'city' },
  Jaffarabad: { lat: 28.52, lng: 68.43, type: 'station' },
  Nasirabad: { lat: 28.10, lng: 68.02, type: 'city' },
  Gilgit: { lat: 35.92, lng: 74.31, type: 'city' },
  Skardu: { lat: 35.30, lng: 75.63, type: 'city' },
  Hunza: { lat: 36.32, lng: 74.65, type: 'city' },
  Muzaffarabad: { lat: 34.37, lng: 73.47, type: 'city' },
  Neelum: { lat: 34.60, lng: 73.90, type: 'city' },
  Mirpur: { lat: 33.15, lng: 73.75, type: 'city' },
};

/** Every notable city in Pakistan — risk inherited from its province score when the
 *  backend has no district-level record for it. */
export const ALL_CITIES: { name: string; provinceId: string; lat: number; lng: number }[] = [
  { name: 'Karachi', provinceId: 'sindh', lat: 24.86, lng: 67.01 },
  { name: 'Hyderabad', provinceId: 'sindh', lat: 25.39, lng: 68.37 },
  { name: 'Sukkur', provinceId: 'sindh', lat: 27.70, lng: 68.86 },
  { name: 'Larkana', provinceId: 'sindh', lat: 27.56, lng: 68.21 },
  { name: 'Nawabshah', provinceId: 'sindh', lat: 26.24, lng: 68.41 },
  { name: 'Mirpur Khas', provinceId: 'sindh', lat: 25.53, lng: 69.01 },
  { name: 'Shikarpur', provinceId: 'sindh', lat: 27.96, lng: 68.64 },
  { name: 'Jacobabad', provinceId: 'sindh', lat: 28.28, lng: 68.44 },
  { name: 'Badin', provinceId: 'sindh', lat: 24.66, lng: 68.84 },
  { name: 'Thatta', provinceId: 'sindh', lat: 24.75, lng: 67.92 },
  { name: 'Dadu', provinceId: 'sindh', lat: 26.73, lng: 67.78 },
  { name: 'Lahore', provinceId: 'punjab', lat: 31.55, lng: 74.35 },
  { name: 'Faisalabad', provinceId: 'punjab', lat: 31.42, lng: 73.08 },
  { name: 'Rawalpindi', provinceId: 'punjab', lat: 33.60, lng: 73.05 },
  { name: 'Islamabad', provinceId: 'punjab', lat: 33.68, lng: 73.05 },
  { name: 'Multan', provinceId: 'punjab', lat: 30.20, lng: 71.47 },
  { name: 'Gujranwala', provinceId: 'punjab', lat: 32.16, lng: 74.19 },
  { name: 'Sialkot', provinceId: 'punjab', lat: 32.49, lng: 74.53 },
  { name: 'Sargodha', provinceId: 'punjab', lat: 32.08, lng: 72.67 },
  { name: 'Bahawalpur', provinceId: 'punjab', lat: 29.40, lng: 71.68 },
  { name: 'Sahiwal', provinceId: 'punjab', lat: 30.66, lng: 73.11 },
  { name: 'Jhelum', provinceId: 'punjab', lat: 32.93, lng: 73.73 },
  { name: 'Rahim Yar Khan', provinceId: 'punjab', lat: 28.42, lng: 70.30 },
  { name: 'D.G. Khan', provinceId: 'punjab', lat: 30.05, lng: 70.64 },
  { name: 'Muzaffargarh', provinceId: 'punjab', lat: 30.07, lng: 71.19 },
  { name: 'Rajanpur', provinceId: 'punjab', lat: 29.10, lng: 70.33 },
  { name: 'Peshawar', provinceId: 'kpk', lat: 34.01, lng: 71.58 },
  { name: 'Mardan', provinceId: 'kpk', lat: 34.20, lng: 72.05 },
  { name: 'Abbottabad', provinceId: 'kpk', lat: 34.15, lng: 73.22 },
  { name: 'Mingora (Swat)', provinceId: 'kpk', lat: 34.78, lng: 72.36 },
  { name: 'Kohat', provinceId: 'kpk', lat: 33.58, lng: 71.44 },
  { name: 'Dera Ismail Khan', provinceId: 'kpk', lat: 31.83, lng: 70.90 },
  { name: 'Chitral', provinceId: 'kpk', lat: 35.85, lng: 71.79 },
  { name: 'Nowshera', provinceId: 'kpk', lat: 34.02, lng: 71.97 },
  { name: 'Charsadda', provinceId: 'kpk', lat: 34.15, lng: 71.74 },
  { name: 'Quetta', provinceId: 'balochistan', lat: 30.18, lng: 67.00 },
  { name: 'Gwadar', provinceId: 'balochistan', lat: 25.13, lng: 62.33 },
  { name: 'Turbat', provinceId: 'balochistan', lat: 26.00, lng: 63.04 },
  { name: 'Khuzdar', provinceId: 'balochistan', lat: 27.81, lng: 66.61 },
  { name: 'Sibi', provinceId: 'balochistan', lat: 29.55, lng: 67.88 },
  { name: 'Zhob', provinceId: 'balochistan', lat: 31.34, lng: 69.45 },
  { name: 'Chaman', provinceId: 'balochistan', lat: 30.92, lng: 66.45 },
  { name: 'Lasbela', provinceId: 'balochistan', lat: 26.23, lng: 66.05 },
  { name: 'Jaffarabad', provinceId: 'balochistan', lat: 28.52, lng: 68.43 },
  { name: 'Gilgit', provinceId: 'gb', lat: 35.92, lng: 74.31 },
  { name: 'Skardu', provinceId: 'gb', lat: 35.30, lng: 75.63 },
  { name: 'Hunza', provinceId: 'gb', lat: 36.32, lng: 74.65 },
  { name: 'Chilas', provinceId: 'gb', lat: 35.42, lng: 74.10 },
  { name: 'Muzaffarabad', provinceId: 'ajk', lat: 34.37, lng: 73.47 },
  { name: 'Mirpur', provinceId: 'ajk', lat: 33.15, lng: 73.75 },
  { name: 'Rawalakot', provinceId: 'ajk', lat: 33.86, lng: 73.76 },
];

export interface DynamicMarker {
  name: string;
  lat: number;
  lng: number;
  riskScore: number;
  provinceId: string;
  provinceName: string;
  type: 'city' | 'station';
  /** true when the score comes from a backend district record */
  fromDistrict: boolean;
}

/** Backend districts first (exact scores), then every remaining city using its province score.
 *  This is the SINGLE source of truth for both the map markers and every dashboard section. */
export function buildDynamicMarkers(provinces: ProvinceData[]): DynamicMarker[] {
  const markers: DynamicMarker[] = [];
  const used = new Set<string>();

  provinces.forEach((province) => {
    const districts = province.districts || [];
    const baseLat = province.coordinates?.lat ?? 30;
    const baseLng = province.coordinates?.lng ?? 70;

    districts.forEach((district, idx) => {
      const known = KNOWN_DISTRICT_COORDS[district.name];
      const angle = (idx / Math.max(districts.length, 1)) * 2 * Math.PI;
      markers.push({
        name: district.name,
        lat: known ? known.lat : baseLat + Math.cos(angle) * 0.6,
        lng: known ? known.lng : baseLng + Math.sin(angle) * 0.6,
        riskScore: Math.max(0, Math.min(100, district.riskScore ?? 0)),
        provinceId: province.id,
        provinceName: province.name,
        type: known ? known.type : 'city',
        fromDistrict: true,
      });
      used.add(district.name.toLowerCase());
    });
  });

  ALL_CITIES.forEach((city) => {
    if (used.has(city.name.toLowerCase())) return;
    const province = provinces.find((p) => p.id === city.provinceId);
    if (!province) return;
    used.add(city.name.toLowerCase());
    markers.push({
      name: city.name,
      lat: city.lat,
      lng: city.lng,
      riskScore: Math.max(0, Math.min(100, province.riskScore ?? 0)),
      provinceId: province.id,
      provinceName: province.name,
      type: 'city',
      fromDistrict: false,
    });
  });

  return markers;
}

/** Marker set → district rows, so tiles / charts / alerts always match the map exactly. */
export function markerDistrictRows(provinces: ProvinceData[]): DistrictRow[] {
  return buildDynamicMarkers(provinces).map((m) => ({
    name: m.name,
    riskScore: m.riskScore,
    riskLevel: m.riskScore >= 71 ? 'high' : m.riskScore >= 41 ? 'medium' : 'low',
    tier: scoreToTier(m.riskScore),
    provinceId: m.provinceId,
    provinceName: m.provinceName,
  }));
}
