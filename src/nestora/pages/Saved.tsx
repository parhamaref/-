import { listFavoriteProperties } from '../data/api';
import { useAsync, useDatabase, useFavorites, usePageMeta } from '../data/hooks';
import { Layout } from '../components/Layout';
import { PropertyCard } from '../components/PropertyCard';
import { EmptyState, LinkButton, PropertyCardSkeleton, SectionHeading } from '../components/ui';

export function Saved() {
  const database = useDatabase();
  const { isSaved, toggle } = useFavorites();
  const { data, loading, error, reload } = useAsync(() => listFavoriteProperties(), [database.favorites.length]);

  usePageMeta({
    title: 'Saved properties — Nestora Homes',
    description: 'Your saved Nestora Homes properties, held against this browser while you browse the collection.',
    noindex: true,
  });

  const savedCount = data?.length ?? 0;

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="nestora-container flex flex-col gap-12">
          <SectionHeading
            as="h1"
            align="left"
            title="Saved Properties"
            description="Properties you have marked while browsing. Saving is held against this browser — no account is required."
          />

          {error ? (
            <EmptyState title="Saved properties unavailable" description={error} action={<LinkButton to="/listings" variant="outline">Back to listings</LinkButton>} />
          ) : loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map((index) => (
                <PropertyCardSkeleton key={index} />
              ))}
            </div>
          ) : savedCount === 0 ? (
            <EmptyState
              title="Nothing saved yet"
              description="Tap the heart on any property card to keep it here for later."
              action={<LinkButton to="/listings">Browse listings</LinkButton>}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {data?.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  saved={isSaved(property.id)}
                  onToggleSaved={async (id) => {
                    await toggle(id);
                    reload();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
