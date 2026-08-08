import { FloodGallery } from '@/components/FloodGallery';
import { Images } from 'lucide-react';

const Gallery = () => (
  <div className="space-y-4">
    <div>
      <h1 className="text-[22px] font-extrabold text-foreground tracking-tight flex items-center gap-2">
        <Images className="w-5 h-5 text-primary" />
        Flood Gallery
      </h1>
      <p className="text-[12.5px] text-muted-foreground mt-0.5">
        Documented photography and satellite imagery of flooding across Pakistan
      </p>
    </div>
    <FloodGallery expanded />
  </div>
);

export default Gallery;
