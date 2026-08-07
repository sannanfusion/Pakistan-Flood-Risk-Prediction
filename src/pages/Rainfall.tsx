import { LiveRainfallMap } from '@/components/LiveRainfallMap';
import { CloudRain } from 'lucide-react';

const Rainfall = () => (
  <div className="space-y-4">
    <div>
      <h1 className="text-[22px] font-extrabold text-foreground tracking-tight flex items-center gap-2">
        <CloudRain className="w-5 h-5 text-rain" />
        Current Rainfall
      </h1>
      <p className="text-[12.5px] text-muted-foreground mt-0.5">
        Live precipitation observations across Pakistan — clouds and rain shown where it is raining right now
      </p>
    </div>
    <LiveRainfallMap />
  </div>
);

export default Rainfall;
