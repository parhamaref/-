import { useDatabase } from '../data/hooks';
import { LinkButton } from './ui';
import { SmartImage } from './SmartImage';

/** Shallow cinematic banner with a restrained hover zoom on the photograph. */
export function PortfolioCta() {
  const { settings } = useDatabase();

  return (
    <section aria-labelledby="portfolio-cta" className="pb-20 lg:pb-24">
      <div className="nestora-container">
        <div className="media-zoom relative isolate overflow-hidden rounded-3xl border border-hairline">
          <SmartImage
            src={settings.cta_image}
            alt={settings.cta_image_alt}
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-obsidian/72" />
          <div className="nestora-container flex flex-col gap-8 py-14 lg:flex-row lg:items-center lg:justify-between lg:py-20">
            <div className="max-w-2xl">
              <h2 id="portfolio-cta" className="font-display text-[1.6rem] font-semibold uppercase tracking-[0.06em] text-vapor sm:text-[2rem]">
                Ready to find your dream home?
              </h2>
              <p className="mt-4 text-[0.98rem] text-ash">
                Let us help you discover a place you&apos;ll love to live.
              </p>
            </div>

            <LinkButton to="/listings" size="lg" withArrow className="self-start lg:self-auto">
              See Portfolio
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
