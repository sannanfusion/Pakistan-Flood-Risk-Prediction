import { useState, useEffect, useCallback } from 'react';
import { Images, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
  url: string;
  title: string;
  place: string;
  year: string;
  credit: string;
}

/** Real, freely licensed photographs of floods in Pakistan (Wikimedia Commons). */
const PHOTOS: Photo[] = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/2022_Pakistan_Floods_-_August_27%2C_2021_vs._August_27%2C_2022_in_Sindh.jpg/1280px-2022_Pakistan_Floods_-_August_27%2C_2021_vs._August_27%2C_2022_in_Sindh.jpg',
    title: "2022 Pakistan Floods - August 27, 2021 vs. August 27, 2022 in Sindh",
    place: 'Sindh',
    year: '2022',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Deadly_Flooding_in_Pakistan_%28MODIS_2022-08-30%29.jpg/1280px-Deadly_Flooding_in_Pakistan_%28MODIS_2022-08-30%29.jpg',
    title: "Deadly Flooding in Pakistan (MODIS 2022-08-30)",
    place: 'Pakistan',
    year: '2022',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Devastating_floods_in_Pakistan.jpg/1280px-Devastating_floods_in_Pakistan.jpg',
    title: "Devastating floods in Pakistan",
    place: 'Pakistan',
    year: '—',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Disastrous_floods_continue_to_affect_Pakistan.jpg/1280px-Disastrous_floods_continue_to_affect_Pakistan.jpg',
    title: "Disastrous floods continue to affect Pakistan",
    place: 'Pakistan',
    year: '—',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Flood_in_Pakistan_2022.png/1280px-Flood_in_Pakistan_2022.png',
    title: "Flood in Pakistan 2022",
    place: 'Pakistan',
    year: '2022',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Flood_in_Sindh_2022.jpg',
    title: "Flood in Sindh 2022",
    place: 'Sindh',
    year: '2022',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Flooding_from_Heavy_Rains_in_Western_Pakistan_%28MODIS_2022-07-11%29.jpg/1280px-Flooding_from_Heavy_Rains_in_Western_Pakistan_%28MODIS_2022-07-11%29.jpg',
    title: "Flooding from Heavy Rains in Western Pakistan (MODIS 2022-07-11)",
    place: 'Pakistan',
    year: '2022',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Flooding_in_Pakistan_%28MODIS_2022-08-24%29.jpg/1280px-Flooding_in_Pakistan_%28MODIS_2022-08-24%29.jpg',
    title: "Flooding in Pakistan (MODIS 2022-08-24)",
    place: 'Pakistan',
    year: '2022',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Floods_continue_to_affect_Pakistan.jpg/1280px-Floods_continue_to_affect_Pakistan.jpg',
    title: "Floods continue to affect Pakistan",
    place: 'Pakistan',
    year: '—',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Floods_still_affecting_large_areas_of_Pakistan.jpg/1280px-Floods_still_affecting_large_areas_of_Pakistan.jpg',
    title: "Floods still affecting large areas of Pakistan",
    place: 'Pakistan',
    year: '—',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Glacial_lake_outburst_flood_at_Pakistan%E2%80%99s_Shishpar_glacier.jpg/1280px-Glacial_lake_outburst_flood_at_Pakistan%E2%80%99s_Shishpar_glacier.jpg',
    title: "Glacial lake outburst flood at Pakistan\u2019s Shishpar glacier",
    place: 'Pakistan',
    year: '—',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Monsoon_Rains_Flood_Pakistan_%28154781_-_50909_lrg%29.jpg/1280px-Monsoon_Rains_Flood_Pakistan_%28154781_-_50909_lrg%29.jpg',
    title: "Monsoon Rains Flood Pakistan (154781 - 50909 lrg)",
    place: 'Pakistan',
    year: '—',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Pakistan_Floods_%28MODIS_2022-09-23%29.jpg/1280px-Pakistan_Floods_%28MODIS_2022-09-23%29.jpg',
    title: "Pakistan Floods (MODIS 2022-09-23)",
    place: 'Pakistan',
    year: '2022',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pakistan_inundated_ESA24429104.jpeg/1280px-Pakistan_inundated_ESA24429104.jpeg',
    title: "Pakistan inundated ESA24429104",
    place: 'Pakistan',
    year: '—',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/A_Pakistani_man_stands_outside_a_UK-funded_temporary_shelter_after_flooding_in_Sindh_%288379288705%29.jpg/1280px-A_Pakistani_man_stands_outside_a_UK-funded_temporary_shelter_after_flooding_in_Sindh_%288379288705%29.jpg',
    title: "A Pakistani man stands outside a UK-funded temporary shelter after flooding in Sindh",
    place: 'Sindh',
    year: '—',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/A_child_stands_amongst_the_remains_of_buildings_destroyed_by_the_floods_in_Sindh_province%2C_Pakistan._%285330433865%29.jpg/1280px-A_child_stands_amongst_the_remains_of_buildings_destroyed_by_the_floods_in_Sindh_province%2C_Pakistan._%285330433865%29.jpg',
    title: "A child stands amongst the remains of buildings destroyed by the floods in Sindh province,",
    place: 'Sindh',
    year: '—',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/A_young_girl_stands_outside_a_house_undergoing_flood-proofing_work_in_Sindh%2C_Pakistan%2C_April_2012_%288406169194%29.jpg/1280px-A_young_girl_stands_outside_a_house_undergoing_flood-proofing_work_in_Sindh%2C_Pakistan%2C_April_2012_%288406169194%29.jpg',
    title: "A young girl stands outside a house undergoing flood-proofing work in Sindh, Pakistan, Apr",
    place: 'Sindh',
    year: '2012',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Children_at_a_water_pump%2C_Sindh%2C_Pakistan%2C_April_2012_%288405077511%29.jpg/1280px-Children_at_a_water_pump%2C_Sindh%2C_Pakistan%2C_April_2012_%288405077511%29.jpg',
    title: "Children at a water pump, Sindh, Pakistan, April 2012",
    place: 'Sindh',
    year: '2012',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Damages_in_the_flood-affected_areas_in_Sindh_province_after_a_monsoon_season_in_Pakistan.jpg/1280px-Damages_in_the_flood-affected_areas_in_Sindh_province_after_a_monsoon_season_in_Pakistan.jpg',
    title: "Damages in the flood-affected areas in Sindh province after a monsoon season in Pakistan",
    place: 'Sindh',
    year: '—',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Flood_in_Alipur%2C_Pakistan_2010.jpg',
    title: "Flood in Alipur, Pakistan 2010",
    place: 'Alipur',
    year: '2010',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Flood_in_Alipur%2C_Pakistan_2010_1.jpg',
    title: "Flood in Alipur, Pakistan 2010 1",
    place: 'Alipur',
    year: '2010',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Flood_in_Alipur%2C_Pakistan_2010_3.jpg',
    title: "Flood in Alipur, Pakistan 2010 3",
    place: 'Alipur',
    year: '2010',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flooded_Sindh_Province_%28924%29.jpg/1280px-Flooded_Sindh_Province_%28924%29.jpg',
    title: "Flooded Sindh Province",
    place: 'Sindh',
    year: '—',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Pakistan_2010_Floods.jpg/1280px-Pakistan_2010_Floods.jpg',
    title: "Pakistan 2010 Floods",
    place: 'Pakistan',
    year: '2010',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Trees_cocooned_in_spiders_webs_after_flooding_in_Sindh%2C_Pakistan_%285571181942%29.jpg/1280px-Trees_cocooned_in_spiders_webs_after_flooding_in_Sindh%2C_Pakistan_%285571181942%29.jpg',
    title: "Trees cocooned in spiders webs after flooding in Sindh, Pakistan",
    place: 'Sindh',
    year: '1942',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/U.S._Marines_Augment_Pakistan_Flood_Relief_Efforts_in_Sindh_Province_DVIDS329543.jpg',
    title: "U.S. Marines Augment Pakistan Flood Relief Efforts in Sindh Province",
    place: 'Sindh',
    year: '—',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/US_helping_Pakistanis_during_the_2010_floods-2.jpg/1280px-US_helping_Pakistanis_during_the_2010_floods-2.jpg',
    title: "US helping Pakistanis during the 2010 floods-2",
    place: 'Pakistan',
    year: '2010',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/US_helping_Pakistanis_during_the_2010_floods-3.jpg/1280px-US_helping_Pakistanis_during_the_2010_floods-3.jpg',
    title: "US helping Pakistanis during the 2010 floods-3",
    place: 'Pakistan',
    year: '2010',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/US_helping_Pakistanis_during_the_2010_floods.jpg/1280px-US_helping_Pakistanis_during_the_2010_floods.jpg',
    title: "US helping Pakistanis during the 2010 floods",
    place: 'Pakistan',
    year: '2010',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Flood_Relief_Operations%2C_Pakistan_DVIDS318529.jpg/1280px-Flood_Relief_Operations%2C_Pakistan_DVIDS318529.jpg',
    title: "Flood Relief Operations, Pakistan",
    place: 'Pakistan',
    year: '—',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flood_Relief_Operations%2C_Pakistan_DVIDS318538.jpg/1280px-Flood_Relief_Operations%2C_Pakistan_DVIDS318538.jpg',
    title: "Flood Relief Operations, Pakistan",
    place: 'Pakistan',
    year: '—',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Pakistan_Flood_Relief_DVIDS317582.jpg/1280px-Pakistan_Flood_Relief_DVIDS317582.jpg',
    title: "Pakistan Flood Relief",
    place: 'Pakistan',
    year: '—',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Pakistan_Humanitarian_Aid_Flood_Relief_DVIDS319323.jpg/1280px-Pakistan_Humanitarian_Aid_Flood_Relief_DVIDS319323.jpg',
    title: "Pakistan Humanitarian Aid Flood Relief",
    place: 'Pakistan',
    year: '1932',
    credit: 'Wikimedia Commons',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Pakistan_Humanitarian_Aid_Flood_Relief_DVIDS319330.jpg/1280px-Pakistan_Humanitarian_Aid_Flood_Relief_DVIDS319330.jpg',
    title: "Pakistan Humanitarian Aid Flood Relief",
    place: 'Pakistan',
    year: '1933',
    credit: 'Wikimedia Commons',
  },
];

interface FloodGalleryProps {
  /** show every photo (gallery page) instead of a short preview */
  expanded?: boolean;
}

function Carousel({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + photos.length) % photos.length),
    [photos.length],
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [go, paused]);

  const current = photos[index];

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-border bg-muted/40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[16/10] sm:aspect-[16/8]">
        {photos.map((p, i) => (
          <img
            key={p.url}
            src={p.url}
            alt={`${p.title} — ${p.place}, ${p.year}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 bg-gradient-to-t from-background via-background/80 to-transparent">
          <div className="text-[13px] sm:text-[16px] font-bold text-foreground leading-tight line-clamp-2">
            {current.title}
          </div>
          <div className="flex items-center gap-2 mt-1 text-[10px] sm:text-[11px] font-mono text-muted-foreground">
            <span className="truncate">{current.place}</span>
            <span>·</span>
            <span>{current.year}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline truncate">{current.credit}</span>
          </div>
        </div>

        <button
          aria-label="Previous photo"
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/70 border border-border text-foreground hover:bg-background transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          aria-label="Next photo"
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/70 border border-border text-foreground hover:bg-background transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-background/75 border border-border text-[9.5px] font-mono text-muted-foreground">
          {index + 1} / {photos.length}
        </div>
      </div>

      {/* thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto scrollbar-thin p-2 bg-card">
        {photos.map((p, i) => (
          <button
            key={p.url}
            onClick={() => setIndex(i)}
            aria-label={`Show ${p.title}`}
            className={`shrink-0 w-16 h-11 sm:w-20 sm:h-14 rounded-lg overflow-hidden border transition-all ${
              i === index ? 'border-primary ring-1 ring-primary' : 'border-border opacity-60 hover:opacity-100'
            }`}
          >
            <img src={p.url} alt="" loading="lazy" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function FloodGallery({ expanded = false }: FloodGalleryProps) {
  const photos = expanded ? PHOTOS : PHOTOS.slice(0, 8);

  return (
    <section id="imagery" className="panel p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="p-1.5 rounded-lg bg-muted shrink-0">
            <Images className="w-4 h-4 text-primary" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[13.5px] font-semibold text-foreground truncate">Gallery — Floods in Pakistan</h2>
            <p className="text-[10.5px] text-muted-foreground font-mono">
              {photos.length} documented photographs &amp; satellite images
            </p>
          </div>
        </div>
      </div>

      <Carousel photos={photos} />

      <h3 className="mt-5 mb-2 text-[12.5px] font-semibold text-foreground">All photographs</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
        {photos.map((p) => (
          <figure
            key={p.url}
            className="group relative rounded-2xl overflow-hidden border border-border bg-muted/40 aspect-[4/3]"
          >
            <img
              src={p.url}
              alt={`${p.title} — ${p.place}, ${p.year}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5 bg-gradient-to-t from-background via-background/85 to-transparent">
              <div className="text-[10.5px] sm:text-[11px] font-semibold text-foreground leading-tight line-clamp-2">{p.title}</div>
              <div className="flex items-center gap-1.5 mt-1 text-[9px] sm:text-[9.5px] font-mono text-muted-foreground">
                <span className="truncate">{p.place}</span>
                <span>·</span>
                <span>{p.year}</span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <a
        href="https://commons.wikimedia.org/wiki/Category:Floods_in_Pakistan"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:underline"
      >
        Full archive <ExternalLink className="w-3 h-3" />
      </a>
    </section>
  );
}
