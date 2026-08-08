import { Images, ExternalLink } from 'lucide-react';

interface Photo {
  url: string;
  title: string;
  place: string;
  year: string;
  credit: string;
}

/** Real, public-domain / freely licensed photographs of floods in Pakistan (Wikimedia Commons). */
const PHOTOS: Photo[] = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Devastating_floods_in_Pakistan.jpg/960px-Devastating_floods_in_Pakistan.jpg',
    title: 'Devastating floods across the Indus basin',
    place: 'Sindh & South Punjab',
    year: '2022',
    credit: 'ESA / Copernicus',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/U.S._Marines_Provide_Food_to_Flood_Victims_in_the_Sindh_Province_DVIDS328643.jpg/960px-U.S._Marines_Provide_Food_to_Flood_Victims_in_the_Sindh_Province_DVIDS328643.jpg',
    title: 'Relief distribution to flood victims',
    place: 'Sindh Province',
    year: '2010',
    credit: 'Public domain',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Clearing_the_remains_of_a_flood-destroyed_house_%285366968631%29.jpg/960px-Clearing_the_remains_of_a_flood-destroyed_house_%285366968631%29.jpg',
    title: 'Clearing the remains of a destroyed house',
    place: 'Sindh',
    year: '2010',
    credit: 'DFID',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Deadly_Flooding_in_Pakistan_%28MODIS_2022-08-30%29.jpg/960px-Deadly_Flooding_in_Pakistan_%28MODIS_2022-08-30%29.jpg',
    title: 'Inundation captured by MODIS',
    place: 'Indus River corridor',
    year: 'Aug 2022',
    credit: 'NASA MODIS',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/A_man_stands_in_front_of_where_his_house_used_to_be%2C_Sindh%2C_December_2010_%285331018354%29.jpg/960px-A_man_stands_in_front_of_where_his_house_used_to_be%2C_Sindh%2C_December_2010_%285331018354%29.jpg',
    title: 'A man where his house used to stand',
    place: 'Sindh',
    year: 'Dec 2010',
    credit: 'DFID',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/A_Pakistani_man_stands_outside_a_UK-funded_temporary_shelter_after_flooding_in_Sindh_%288379288705%29.jpg/960px-A_Pakistani_man_stands_outside_a_UK-funded_temporary_shelter_after_flooding_in_Sindh_%288379288705%29.jpg',
    title: 'Temporary shelter after the floods',
    place: 'Sindh',
    year: '2012',
    credit: 'DFID',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Devastating_Floods_in_Pakistan_%28MODIS_2025-09-03%29.jpg/960px-Devastating_Floods_in_Pakistan_%28MODIS_2025-09-03%29.jpg',
    title: 'Monsoon flooding from orbit',
    place: 'Punjab',
    year: 'Sep 2025',
    credit: 'NASA MODIS',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Flooding_from_Heavy_Rains_in_Western_Pakistan_%28MODIS_2022-07-11%29.jpg/960px-Flooding_from_Heavy_Rains_in_Western_Pakistan_%28MODIS_2022-07-11%29.jpg',
    title: 'Flooding from heavy monsoon rains',
    place: 'Balochistan',
    year: 'Jul 2022',
    credit: 'NASA MODIS',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Pakistan_Flood_2010_%284923822384%29.jpg/960px-Pakistan_Flood_2010_%284923822384%29.jpg',
    title: 'Villages submerged by the super flood',
    place: 'Punjab',
    year: '2010',
    credit: 'DFID',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Pakistan_Floods_2010_-_Aerial_view.jpg/960px-Pakistan_Floods_2010_-_Aerial_view.jpg',
    title: 'Aerial view of the flooded plains',
    place: 'Indus Valley',
    year: '2010',
    credit: 'Public domain',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Flooding_in_Pakistan_%28MODIS_2010-08-11%29.jpg/960px-Flooding_in_Pakistan_%28MODIS_2010-08-11%29.jpg',
    title: 'Indus overflow seen from space',
    place: 'Sindh',
    year: 'Aug 2010',
    credit: 'NASA MODIS',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Pakistan_flood_relief_efforts_%284962411692%29.jpg/960px-Pakistan_flood_relief_efforts_%284962411692%29.jpg',
    title: 'Helicopter relief operations',
    place: 'Khyber Pakhtunkhwa',
    year: '2010',
    credit: 'Public domain',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Flood_affected_people_in_Pakistan_%284942014042%29.jpg/960px-Flood_affected_people_in_Pakistan_%284942014042%29.jpg',
    title: 'Displaced families awaiting aid',
    place: 'Punjab',
    year: '2010',
    credit: 'Public domain',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Flooding_in_Southern_Pakistan_%28MODIS_2011-09-13%29.jpg/960px-Flooding_in_Southern_Pakistan_%28MODIS_2011-09-13%29.jpg',
    title: 'Southern Pakistan under water',
    place: 'Lower Sindh',
    year: 'Sep 2011',
    credit: 'NASA MODIS',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Pakistan_floods_2010_-_temporary_camp.jpg/960px-Pakistan_floods_2010_-_temporary_camp.jpg',
    title: 'Temporary relief camp',
    place: 'Sindh',
    year: '2010',
    credit: 'Public domain',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Flooding_along_the_Indus_River%2C_Pakistan_%28MODIS_2022-09-01%29.jpg/960px-Flooding_along_the_Indus_River%2C_Pakistan_%28MODIS_2022-09-01%29.jpg',
    title: 'A new lake formed along the Indus',
    place: 'Sindh / Balochistan border',
    year: 'Sep 2022',
    credit: 'NASA MODIS',
  },
];

interface FloodGalleryProps {
  /** show all photos in a taller grid (gallery page) */
  expanded?: boolean;
}

export function FloodGallery({ expanded = false }: FloodGalleryProps) {
  const photos = expanded ? PHOTOS : PHOTOS.slice(0, 8);

  return (
    <section id="imagery" className="panel p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-muted">
            <Images className="w-4 h-4 text-primary" />
          </span>
          <div>
            <h2 className="text-[13.5px] font-semibold text-foreground">Gallery — Floods in Pakistan</h2>
            <p className="text-[10.5px] text-muted-foreground font-mono">
              {photos.length} documented photographs &amp; satellite images
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
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
            <figcaption className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-background via-background/85 to-transparent">
              <div className="text-[11px] font-semibold text-foreground leading-tight line-clamp-2">{p.title}</div>
              <div className="flex items-center gap-1.5 mt-1 text-[9.5px] font-mono text-muted-foreground">
                <span className="truncate">{p.place}</span>
                <span>·</span>
                <span>{p.year}</span>
              </div>
            </figcaption>
            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-background/80 border border-border text-[8.5px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              {p.credit}
            </span>
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
