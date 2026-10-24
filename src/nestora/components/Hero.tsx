import { useDatabase } from '../data/hooks';
import { Link } from '../router';
import { ArrowRightIcon } from './Icons';
import { SearchPanel, type SearchCriteria } from './SearchPanel';
import { SmartImage } from './SmartImage';

/** Full-bleed cinematic hero; the search foundation panel overlaps its lower edge. */
export function Hero({ onSearch }: { onSearch: (criteria: SearchCriteria) => void }) {
  const { settings } = useDatabase();

  return (
    <section className="relative isolate overflow-hidden pb-24 pt-[8.5rem] sm:pt-[9.5rem] lg:pb-28 lg:pt-[11rem]">
      <SmartImage
        src={settings.hero_image}
        alt={settings.hero_image_alt}
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(7,10,12,0.95)_0%,rgba(7,10,12,0.82)_34%,rgba(7,10,12,0.28)_68%,rgba(7,10,12,0.6)_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-obsidian" />

      <div className="nestora-container">
        <div className="max-w-3xl animate-fade-in">
          <p className="mb-6 font-display text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-gold">
            Private residential collection
          </p>
          <h1 className="font-display text-[2.25rem] font-bold uppercase leading-[1.05] tracking-[-0.005em] text-vapor sm:text-[2.6rem] lg:text-[2.875rem]">
            <span className="block">Find Your</span>
            <span className="block">Perfect</span>
            <span className="block text-gold">Living Space.</span>
          </h1>

          <span className="gold-divider mt-8" aria-hidden="true" />

          <p className="mt-7 max-w-xl text-[0.98rem] leading-relaxed text-ash">
            Discover exclusive luxury homes and sophisticated properties tailored to your modern lifestyle with Nestora
            Homes.
          </p>

          <Link
            to="/listings"
            className="group mt-8 inline-flex items-center gap-2 font-display text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ash transition-colors hover:text-gold"
          >
            Explore Properties
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="nestora-container relative z-20 mt-14 lg:mt-20">
        <SearchPanel onSearch={onSearch} />
      </div>
    </section>
  );
}
