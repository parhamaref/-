import { useMemo, useState } from 'react';
import { listLocations, queryProperties } from '../data/api';
import {
  PRICE_MAX,
  PRICE_MIN,
  PROPERTY_TYPES,
  SORT_OPTIONS,
  type PropertyFilters,
  type SortKey,
} from '../data/types';
import { useAsync, useFavorites, useJsonLd, usePageMeta } from '../data/hooks';
import { useRouter } from '../router';
import { cx } from '../lib/format';
import { Layout } from '../components/Layout';
import { FilterSelect } from '../components/FilterSelect';
import { PriceRangeSlider } from '../components/PriceRangeSlider';
import { PropertyCard } from '../components/PropertyCard';
import { Button, Chip, EmptyState, ErrorState, PropertyCardSkeleton, SectionHeading } from '../components/ui';
import { GridIcon, ListIcon } from '../components/Icons';

const PER_PAGE = 9;

interface ParsedFilters {
  q: string;
  location: string;
  type: string;
  status: string;
  min: number;
  max: number;
  beds: number;
  baths: number;
  area: number;
  sort: SortKey;
  page: number;
  view: 'grid' | 'list';
}

function parseFilters(query: URLSearchParams): ParsedFilters {
  const numeric = (key: string, fallback: number) => {
    const raw = query.get(key);
    const value = raw === null ? NaN : Number(raw);
    return Number.isFinite(value) ? value : fallback;
  };

  const sort = (query.get('sort') ?? 'featured') as SortKey;

  return {
    q: query.get('q') ?? '',
    location: query.get('location') ?? '',
    type: query.get('type') ?? 'All Properties',
    status: query.get('status') ?? '',
    min: numeric('min', PRICE_MIN),
    max: numeric('max', PRICE_MAX),
    beds: numeric('beds', 0),
    baths: numeric('baths', 0),
    area: numeric('area', 0),
    sort: SORT_OPTIONS.some((option) => option.value === sort) ? sort : 'featured',
    page: numeric('page', 1),
    view: query.get('view') === 'list' ? 'list' : 'grid',
  };
}

export function Listings() {
  const { query, setQuery } = useRouter();
  const filters = useMemo(() => parseFilters(query), [query]);
  const { isSaved, toggle } = useFavorites();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { data: locationOptions } = useAsync(() => listLocations(), []);
  const locations = locationOptions ?? [];

  const apiFilters: PropertyFilters = {
    q: filters.q,
    location: filters.location || undefined,
    type: filters.type === 'All Properties' ? undefined : filters.type,
    status: filters.status || undefined,
    minPrice: filters.min > PRICE_MIN ? filters.min : undefined,
    maxPrice: filters.max < PRICE_MAX ? filters.max : undefined,
    beds: filters.beds || undefined,
    baths: filters.baths || undefined,
    minArea: filters.area || undefined,
    sort: filters.sort,
    page: filters.page,
    perPage: PER_PAGE,
  };

  const { data, loading, error, reload } = useAsync(() => queryProperties(apiFilters), [query.toString()]);

  usePageMeta({
    title: 'Listings — Nestora Homes',
    description:
      'Browse the Nestora Homes collection of luxury villas, penthouses, waterfront residences and estates, filtered by location, price and specification.',
  });

  useJsonLd(
    'listings',
    data && data.items.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Nestora Homes listings',
          itemListElement: data.items.map((property, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${window.location.origin}/property/${property.slug}`,
            name: property.title,
          })),
        }
      : null,
  );

  const update = (patch: Record<string, string | number | undefined>) =>
    setQuery({ ...patch, page: patch.page ?? undefined }, { keepScroll: true });

  const activeChips = [
    filters.q && { key: 'q', label: `“${filters.q}”` },
    filters.location && { key: 'location', label: filters.location },
    filters.type !== 'All Properties' && { key: 'type', label: filters.type },
    filters.status && { key: 'status', label: filters.status === 'for-rent' ? 'For rent' : 'For sale' },
    filters.min > PRICE_MIN && { key: 'min', label: `From ${filters.min.toLocaleString()}` },
    filters.max < PRICE_MAX && { key: 'max', label: `Up to ${filters.max.toLocaleString()}` },
    filters.beds > 0 && { key: 'beds', label: `${filters.beds}+ beds` },
    filters.baths > 0 && { key: 'baths', label: `${filters.baths}+ baths` },
    filters.area > 0 && { key: 'area', label: `${filters.area.toLocaleString()}+ sq ft` },
  ].filter(Boolean) as Array<{ key: string; label: string }>;

  const clearAll = () =>
    setQuery(
      {
        q: undefined,
        location: undefined,
        type: undefined,
        status: undefined,
        min: undefined,
        max: undefined,
        beds: undefined,
        baths: undefined,
        area: undefined,
        page: undefined,
      },
      { keepScroll: true },
    );

  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;
  const currentPage = data?.page ?? 1;

  return (
    <Layout>
      <div className="pb-24 pt-14 lg:pt-16">
        <div className="nestora-container flex flex-col gap-10">
          <SectionHeading
            as="h1"
            align="left"
            title="Explore Properties"
            description="Every listing below is drawn from the live property collection — filter by location, type, price and specification."
          />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[19rem_1fr] lg:gap-12">
            {/* Filter rail */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="flex items-center justify-between gap-4 lg:hidden">
                <Button
                  variant="ghost"
                  onClick={() => setFiltersOpen((open) => !open)}
                  aria-expanded={filtersOpen}
                  aria-controls="filter-rail"
                >
                  {filtersOpen ? 'Hide filters' : 'Filters'}
                  {activeChips.length > 0 && <span className="text-gold">({activeChips.length})</span>}
                </Button>
                {(filters.q || activeChips.length > 0) && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="font-display text-[0.68rem] uppercase tracking-[0.18em] text-muted transition-colors hover:text-gold"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div
                id="filter-rail"
                className={cx(
                  'mt-6 flex-col gap-7 rounded-2xl border border-hairline bg-graphite/50 p-6 lg:mt-0 lg:flex',
                  filtersOpen ? 'flex' : 'hidden',
                )}
              >
                <div>
                  <label
                    htmlFor="filter-search"
                    className="mb-2 block font-display text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-muted"
                  >
                    Search
                  </label>
                  <input
                    id="filter-search"
                    type="search"
                    value={filters.q}
                    onChange={(event) => update({ q: event.target.value || undefined })}
                    placeholder="Title, city, keyword"
                    className="min-h-11 w-full rounded-xl border border-hairline bg-graphite/80 px-3.5 text-sm text-vapor placeholder:text-muted focus:border-gold/60 focus:outline-none"
                  />
                </div>

                <FilterSelect
                  id="filter-location"
                  label="Location"
                  value={filters.location}
                  onChange={(value) => update({ location: value || undefined })}
                  options={[{ value: '', label: 'Any location' }, ...locations.map((l) => ({ value: l, label: l }))]}
                />

                <FilterSelect
                  id="filter-type"
                  label="Property type"
                  value={filters.type}
                  onChange={(value) => update({ type: value === 'All Properties' ? undefined : value })}
                  options={[
                    { value: 'All Properties', label: 'All properties' },
                    ...PROPERTY_TYPES.map((type) => ({ value: type, label: type })),
                  ]}
                />

                <FilterSelect
                  id="filter-status"
                  label="Status"
                  value={filters.status}
                  onChange={(value) => update({ status: value || undefined })}
                  options={[
                    { value: '', label: 'For sale and rent' },
                    { value: 'for-sale', label: 'For sale' },
                    { value: 'for-rent', label: 'For rent' },
                  ]}
                />

                <div>
                  <p className="mb-2 font-display text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-muted">
                    Price range
                  </p>
                  <PriceRangeSlider
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    valueMin={filters.min}
                    valueMax={filters.max}
                    onChange={(min, max) =>
                      update({
                        min: min > PRICE_MIN ? min : undefined,
                        max: max < PRICE_MAX ? max : undefined,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FilterSelect
                    id="filter-beds"
                    label="Bedrooms"
                    value={String(filters.beds)}
                    onChange={(value) => update({ beds: value === '0' ? undefined : value })}
                    options={[
                      { value: '0', label: 'Any' },
                      ...[1, 2, 3, 4, 5, 6].map((count) => ({ value: String(count), label: `${count}+` })),
                    ]}
                  />
                  <FilterSelect
                    id="filter-baths"
                    label="Bathrooms"
                    value={String(filters.baths)}
                    onChange={(value) => update({ baths: value === '0' ? undefined : value })}
                    options={[
                      { value: '0', label: 'Any' },
                      ...[1, 2, 3, 4, 5, 6].map((count) => ({ value: String(count), label: `${count}+` })),
                    ]}
                  />
                </div>

                <div>
                  <label
                    htmlFor="filter-area"
                    className="mb-2 block font-display text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-muted"
                  >
                    Minimum area (sq ft)
                  </label>
                  <input
                    id="filter-area"
                    type="number"
                    min={0}
                    step={500}
                    value={filters.area || ''}
                    onChange={(event) => update({ area: event.target.value || undefined })}
                    placeholder="Any"
                    className="min-h-11 w-full rounded-xl border border-hairline bg-graphite/80 px-3.5 text-sm text-vapor placeholder:text-muted focus:border-gold/60 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={clearAll}
                  className="hidden self-start font-display text-[0.68rem] uppercase tracking-[0.18em] text-muted transition-colors hover:text-gold lg:block"
                >
                  Clear all filters
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-5">
                <p aria-live="polite" className="text-sm text-ash">
                  {loading ? 'Searching…' : `${total} ${total === 1 ? 'property' : 'properties'}`}
                  {activeChips.length > 0 && !loading ? ' matching your filters' : ''}
                </p>

                <div className="flex items-center gap-4">
                  <FilterSelect
                    id="filter-sort"
                    label="Sort"
                    srOnlyLabel
                    value={filters.sort}
                    onChange={(value) => update({ sort: value })}
                    options={SORT_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
                  />

                  <div
                    className="flex items-center gap-1 rounded-full border border-hairline p-1"
                    role="group"
                    aria-label="View mode"
                  >
                    {[
                      { mode: 'grid' as const, label: 'Grid view', Icon: GridIcon },
                      { mode: 'list' as const, label: 'List view', Icon: ListIcon },
                    ].map(({ mode, label, Icon }) => (
                      <button
                        key={mode}
                        type="button"
                        aria-label={label}
                        aria-pressed={filters.view === mode}
                        onClick={() => update({ view: mode })}
                        className={cx(
                          'inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                          filters.view === mode ? 'bg-gold/15 text-gold' : 'text-muted hover:text-vapor',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {activeChips.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  {activeChips.map((chip) => (
                    <Chip key={chip.key} label={chip.label} onRemove={() => update({ [chip.key]: undefined })} />
                  ))}
                  <button
                    type="button"
                    onClick={clearAll}
                    className="font-display text-[0.66rem] uppercase tracking-[0.18em] text-muted transition-colors hover:text-gold"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {error ? (
                <ErrorState message={error} onRetry={reload} />
              ) : loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <PropertyCardSkeleton key={index} />
                  ))}
                </div>
              ) : data && data.items.length > 0 ? (
                <div
                  className={cx(
                    'grid gap-6',
                    filters.view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1',
                  )}
                >
                  {data.items.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      layout={filters.view}
                      saved={isSaved(property.id)}
                      onToggleSaved={toggle}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No properties match those filters"
                  description="Try widening the price range, removing a specification filter, or searching a different location."
                  action={
                    <Button variant="outline" onClick={clearAll}>
                      Clear all filters
                    </Button>
                  }
                />
              )}

              {!loading && !error && pages > 1 && (
                <nav aria-label="Pagination" className="flex items-center justify-center gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => update({ page: Math.max(currentPage - 1, 1) })}
                    disabled={currentPage === 1}
                    className="inline-flex h-10 items-center rounded-full border border-hairline px-4 font-display text-[0.68rem] uppercase tracking-[0.18em] text-ash transition-colors hover:border-gold/50 hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pages }).map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => update({ page })}
                        aria-current={page === currentPage ? 'page' : undefined}
                        className={cx(
                          'inline-flex h-10 w-10 items-center justify-center rounded-full border font-display text-xs transition-colors',
                          page === currentPage
                            ? 'border-gold bg-gold/15 text-gold'
                            : 'border-hairline text-ash hover:border-gold/50 hover:text-gold',
                        )}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => update({ page: Math.min(currentPage + 1, pages) })}
                    disabled={currentPage === pages}
                    className="inline-flex h-10 items-center rounded-full border border-hairline px-4 font-display text-[0.68rem] uppercase tracking-[0.18em] text-ash transition-colors hover:border-gold/50 hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
