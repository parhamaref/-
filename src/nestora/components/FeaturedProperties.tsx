import { listFeaturedProperties } from '../data/api';
import { useAsync, useFavorites } from '../data/hooks';
import { Link } from '../router';
import { ArrowRightIcon } from './Icons';
import { PropertyCard } from './PropertyCard';
import { Reveal } from './Reveal';
import { EmptyState, ErrorState, PropertyCardSkeleton, SectionHeading } from './ui';

export function FeaturedProperties() {
  const { data, loading, error, reload } = useAsync(() => listFeaturedProperties(4), []);
  const { isSaved, toggle } = useFavorites();

  return (
    <section aria-labelledby="featured-properties" className="py-20 lg:py-24">
      <div className="nestora-container flex flex-col gap-12">
        <Reveal>
          <SectionHeading title="Featured Properties" description="A curated selection from the current collection." />
        </Reveal>

        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {data.map((property, index) => (
              <Reveal key={property.id} delay={index * 90}>
                <PropertyCard
                  property={property}
                  saved={isSaved(property.id)}
                  onToggleSaved={toggle}
                  priority={index < 2}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No featured properties yet"
            description="Mark properties as featured in the content console and they will appear here."
          />
        )}

        <div className="flex justify-center">
          <Link
            to="/listings"
            className="group inline-flex items-center gap-2 font-display text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ash transition-colors hover:text-gold"
          >
            View all listings
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
