import { useDatabase } from '../data/hooks';
import { Link } from '../router';
import { ArrowRightIcon } from './Icons';
import { ScrollScrubHero } from './ScrollScrubHero';
import { SearchPanel, type SearchCriteria } from './SearchPanel';

/** Scroll-scrubbed cinematic hero; the search foundation panel anchors its lower third. */
export function Hero({ onSearch }: { onSearch: (criteria: SearchCriteria) => void }) {
  const { settings } = useDatabase();

  return (
    <ScrollScrubHero
      desktopSrc="/hero/nestora-hero-720.mp4"
      mobileSrc="/hero/nestora-hero-480.mp4"
      alternativeSrc="/hero/nestora-hero-720.webm"
      poster="/hero/nestora-hero-poster.jpg"
      fallbackSrc={settings.hero_image}
      fallbackAlt={settings.hero_image_alt}
    >
      <div className="nestora-container">
        <div className="max-w-3xl animate-fade-in">
          <p className="mb-5 font-display text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-gold sm:mb-6">
            Private residential collection
          </p>
          <h1 className="font-display text-[2rem] font-bold uppercase leading-[1.05] tracking-[-0.005em] text-vapor sm:text-[2.6rem] lg:text-[2.875rem]">
            <span className="block">Find Your</span>
            <span className="block">Perfect</span>
            <span className="block text-gold">Living Space.</span>
          </h1>

          <span className="gold-divider mt-6 sm:mt-8" aria-hidden="true" />

          <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-ash sm:mt-7">
            Discover exclusive luxury homes and sophisticated properties tailored to your modern lifestyle with Nestora
            Homes.
          </p>

          <Link
            to="/listings"
            className="group mt-6 inline-flex items-center gap-2 font-display text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ash transition-colors hover:text-gold sm:mt-8"
          >
            Explore Properties
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-8 sm:mt-12 lg:mt-16">
          <SearchPanel onSearch={onSearch} />
        </div>
      </div>
    </ScrollScrubHero>
  );
}
