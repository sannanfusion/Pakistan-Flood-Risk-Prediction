/**
 * nasaGibs.ts — NASA GIBS (Global Imagery Browse Services) helpers
 * ===============================================================
 * Real NASA satellite imagery, served straight from
 * gibs.earthdata.nasa.gov. No API key, no mock imagery.
 *
 * Layers used:
 *  - MODIS_Terra_CorrectedReflectance_TrueColor  (daily true colour, 250m)
 *  - VIIRS_SNPP_CorrectedReflectance_TrueColor   (daily true colour, 375m)
 *  - IMERG_Precipitation_Rate                    (GPM IMERG rain rate)
 */

export type GibsLayerId =
  | 'MODIS_Terra_CorrectedReflectance_TrueColor'
  | 'VIIRS_SNPP_CorrectedReflectance_TrueColor'
  | 'IMERG_Precipitation_Rate';

export interface GibsLayerMeta {
  id: GibsLayerId;
  label: string;
  sensor: string;
  resolution: string;
  format: 'image/jpeg' | 'image/png';
  transparent: boolean;
}

export const GIBS_LAYERS: Record<'trueColor' | 'viirs' | 'precip', GibsLayerMeta> = {
  trueColor: {
    id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    label: 'True Colour',
    sensor: 'MODIS Terra',
    resolution: '250 m',
    format: 'image/jpeg',
    transparent: false,
  },
  viirs: {
    id: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    label: 'VIIRS True Colour',
    sensor: 'VIIRS Suomi-NPP',
    resolution: '375 m',
    format: 'image/jpeg',
    transparent: false,
  },
  precip: {
    id: 'IMERG_Precipitation_Rate',
    label: 'Rain Rate',
    sensor: 'GPM IMERG',
    resolution: '10 km',
    format: 'image/png',
    transparent: true,
  },
};

const WMS = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi';

/** [west, south, east, north] */
export type Bbox = [number, number, number, number];

/** Latest date GIBS reliably has imagery for (previous UTC day). */
export function latestImageryDate(offsetDays = 1): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

export function gibsImageUrl(opts: {
  layer: GibsLayerMeta;
  bbox: Bbox;
  date: string;
  width?: number;
  height?: number;
}): string {
  const { layer, bbox, date, width = 640, height = 480 } = opts;
  const params = new URLSearchParams({
    SERVICE: 'WMS',
    VERSION: '1.1.1',
    REQUEST: 'GetMap',
    LAYERS: layer.id,
    SRS: 'EPSG:4326',
    BBOX: bbox.join(','),
    WIDTH: String(width),
    HEIGHT: String(height),
    FORMAT: layer.format,
    TIME: date,
  });
  if (layer.transparent) params.set('TRANSPARENT', 'true');
  return `${WMS}?${params.toString()}`;
}

/** Square-ish bbox around a province centre point (degrees). */
export function bboxAround(lat: number, lng: number, halfSpan = 1.6): Bbox {
  return [
    Number((lng - halfSpan).toFixed(3)),
    Number((lat - halfSpan * 0.8).toFixed(3)),
    Number((lng + halfSpan).toFixed(3)),
    Number((lat + halfSpan * 0.8).toFixed(3)),
  ];
}

export const WORLDVIEW_BASE = 'https://worldview.earthdata.nasa.gov/';

export function worldviewLink(lat: number, lng: number, date: string, layerId: GibsLayerId) {
  const bbox = bboxAround(lat, lng, 3);
  return `${WORLDVIEW_BASE}?v=${bbox.join(',')}&t=${date}&l=${layerId},Coastlines_15m`;
}
