import { ProvinceData, RISK_COLORS } from '@/lib/types';

interface PakistanMapProps {
  provinces: ProvinceData[];
  selectedProvince: string | null;
  onProvinceSelect: (id: string) => void;
}

// Simplified SVG paths for Pakistan provinces
const PROVINCE_PATHS: Record<string, string> = {
  balochistan: 'M 60 200 L 40 250 L 50 320 L 90 360 L 140 370 L 180 340 L 200 280 L 190 230 L 170 200 L 140 180 L 100 185 Z',
  sindh: 'M 180 340 L 200 280 L 190 230 L 220 210 L 240 250 L 250 310 L 240 360 L 210 380 L 180 370 Z',
  punjab: 'M 170 200 L 190 230 L 220 210 L 240 250 L 260 220 L 280 170 L 270 130 L 240 110 L 210 120 L 190 150 L 175 175 Z',
  kpk: 'M 190 150 L 210 120 L 240 110 L 250 80 L 230 55 L 200 50 L 175 70 L 165 100 L 175 130 Z',
  gb: 'M 230 55 L 250 80 L 280 70 L 310 40 L 300 20 L 270 15 L 245 25 L 235 40 Z',
  ajk: 'M 240 110 L 270 130 L 290 110 L 280 80 L 260 85 L 250 80 L 245 95 Z',
};

const PROVINCE_LABEL_POS: Record<string, { x: number; y: number }> = {
  balochistan: { x: 115, y: 280 },
  sindh: { x: 215, y: 310 },
  punjab: { x: 225, y: 175 },
  kpk: { x: 195, y: 95 },
  gb: { x: 270, y: 40 },
  ajk: { x: 268, y: 105 },
};

export function PakistanMap({ provinces, selectedProvince, onProvinceSelect }: PakistanMapProps) {
  const getProvinceData = (id: string) => provinces.find((p) => p.id === id);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="20 0 310 400" className="w-full h-full max-h-[500px]" style={{ filter: 'drop-shadow(0 0 20px hsl(187 72% 48% / 0.1))' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {provinces.map((p) => (
            <radialGradient key={`grad-${p.id}`} id={`grad-${p.id}`}>
              <stop offset="0%" stopColor={RISK_COLORS[p.riskLevel]} stopOpacity="0.6" />
              <stop offset="100%" stopColor={RISK_COLORS[p.riskLevel]} stopOpacity="0.25" />
            </radialGradient>
          ))}
        </defs>

        {/* Province shapes */}
        {Object.entries(PROVINCE_PATHS).map(([id, path]) => {
          const data = getProvinceData(id);
          if (!data) return null;
          const isSelected = selectedProvince === id;

          return (
            <g key={id} onClick={() => onProvinceSelect(id)} className="cursor-pointer">
              <path
                d={path}
                fill={`url(#grad-${id})`}
                stroke={isSelected ? 'hsl(187, 72%, 48%)' : RISK_COLORS[data.riskLevel]}
                strokeWidth={isSelected ? 2.5 : 1.2}
                className="transition-all duration-300 hover:brightness-125"
                filter={isSelected ? 'url(#glow)' : undefined}
              />
              {/* Alert pulse */}
              {data.alertActive && (
                <circle
                  cx={PROVINCE_LABEL_POS[id].x}
                  cy={PROVINCE_LABEL_POS[id].y - 18}
                  r="4"
                  fill={RISK_COLORS[data.riskLevel]}
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })}

        {/* Labels */}
        {Object.entries(PROVINCE_LABEL_POS).map(([id, pos]) => {
          const data = getProvinceData(id);
          if (!data) return null;
          return (
            <g key={`label-${id}`} onClick={() => onProvinceSelect(id)} className="cursor-pointer">
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                fill="hsl(210, 40%, 93%)"
                fontSize="8"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
                className="pointer-events-none select-none"
              >
                {data.name.length > 12 ? data.name.slice(0, 10) + '…' : data.name}
              </text>
              <text
                x={pos.x}
                y={pos.y + 12}
                textAnchor="middle"
                fill={RISK_COLORS[data.riskLevel]}
                fontSize="7"
                fontWeight="700"
                fontFamily="JetBrains Mono, monospace"
                className="pointer-events-none select-none"
              >
                {data.riskScore}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
