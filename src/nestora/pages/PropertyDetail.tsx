import { useEffect, useRef, useState } from 'react';
import {
  getPropertyBySlug,
  listRelatedProperties,
  listFavoriteIds,
  toggleFavorite,
} from '../data/api';
import { useAsync, useDatabase, useJsonLd, usePageMeta } from '../data/hooks';
import { Link, useRouter } from '../router';
import { cx, formatArea, formatNumber, formatPrice } from '../lib/format';
import { Layout } from '../components/Layout';
import { InquiryForm } from '../components/InquiryForm';
import { PropertyCard } from '../components/PropertyCard';
import { SmartImage } from '../components/SmartImage';
import { Badge, Button, ErrorState, PropertyCardSkeleton, SectionHeading } from '../components/ui';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  AreaIcon,
  BathIcon,
  BedIcon,
  CheckIcon,
  CloseIcon,
  HeartIcon,
  MailIcon,
  PinIcon,
  ShareIcon,
} from '../components/Icons';
import { NotFound } from './NotFound';

function Lightbox({
  images,
  index,
  title,
  onClose,
  onNavigate,
}: {
  images: string[];
  index: number;
  title: string;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNavigate((index + 1) % images.length);
      if (event.key === 'ArrowLeft') onNavigate((index - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [images.length, index, onClose, onNavigate]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — image ${index + 1} of ${images.length}`}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-obsidian/96 p-4"
    >
      <div className="flex w-full max-w-6xl items-center justify-between pb-4">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-ash">
          {index + 1} / {images.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-vapor transition-colors hover:border-gold/50 hover:text-gold"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <SmartImage
        src={images[index]}
        alt={`${title} — view ${index + 1}`}
        priority
        className="max-h-[75vh] w-full max-w-6xl rounded-2xl object-contain"
      />

      <div className="flex items-center gap-4 pt-6">
        <Button variant="ghost" onClick={() => onNavigate((index - 1 + images.length) % images.length)}>
          <ArrowLeftIcon className="h-4 w-4" />
          Previous
        </Button>
        <Button variant="ghost" onClick={() => onNavigate((index + 1) % images.length)}>
          Next
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function PropertyDetail({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const database = useDatabase();
  const { data: property, loading, error, reload } = useAsync(() => getPropertyBySlug(slug), [slug]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  const { data: related } = useAsync(
    () => (property ? listRelatedProperties(property, 3) : Promise.resolve([])),
    [property?.id],
  );

  useEffect(() => {
    let active = true;
    listFavoriteIds().then((ids) => {
      if (active && property) setSaved(ids.includes(property.id));
    });
    return () => {
      active = false;
    };
  }, [property, database.favorites.length]);

  usePageMeta({
    title: property ? `${property.title}, ${property.location_name} — Nestora Homes` : 'Property — Nestora Homes',
    description:
      property?.description?.slice(0, 155) ??
      'Property details from the Nestora Homes luxury residential collection.',
    image: property?.main_image,
  });

  useJsonLd(
    'property',
    property
      ? {
          '@context': 'https://schema.org',
          '@type': 'Residence',
          name: property.title,
          description: property.description,
          url: `${window.location.origin}/property/${property.slug}`,
          image: property.main_image,
          numberOfRooms: property.bedrooms,
          floorSize: { '@type': 'QuantitativeValue', value: property.area_sqft, unitCode: 'FTK' },
          address: {
            '@type': 'PostalAddress',
            addressLocality: property.city,
            addressRegion: property.region,
            addressCountry: property.country,
          },
          offers: {
            '@type': 'Offer',
            price: property.price,
            priceCurrency: property.currency,
            availability:
              property.listing_status === 'for-sale'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/ForRent',
          },
        }
      : null,
  );

  if (loading) {
    return (
      <Layout>
        <div className="nestora-container flex flex-col gap-8 py-16">
          <div className="skeleton h-[22rem] w-full rounded-3xl" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="nestora-container py-24">
          <ErrorState message={error} onRetry={reload} />
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <NotFound
          title="Property not found"
          description="That property is no longer in the collection. Browse the current listings to see what is available."
        />
      </Layout>
    );
  }

  const agent = database.agents.find((candidate) => candidate.id === property.agent_id);
  const images = property.gallery_images.length ? property.gallery_images : [property.main_image];
  const priceLabel =
    property.listing_status === 'for-rent'
      ? `${formatPrice(property.price, property.currency)} / month`
      : formatPrice(property.price, property.currency);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${property.title} — Nestora Homes`, url });
        setShareStatus('Shared');
      } else {
        await navigator.clipboard.writeText(url);
        setShareStatus('Link copied');
      }
    } catch {
      setShareStatus('Could not share — copy the address bar link instead.');
    }
  };

  const handleToggleSaved = async () => {
    const result = await toggleFavorite(property.id);
    setSaved(result.saved);
  };

  const specs = [
    { label: 'Bedrooms', value: property.bedrooms, Icon: BedIcon },
    { label: 'Bathrooms', value: property.bathrooms, Icon: BathIcon },
    { label: 'Floor area', value: formatNumber(property.area_sqft), Icon: AreaIcon },
    { label: 'Lot area', value: property.lot_area_sqft ? formatNumber(property.lot_area_sqft) : '—', Icon: AreaIcon },
  ];

  return (
    <Layout>
      <div className="nestora-container py-10 lg:py-14">
        <button
          type="button"
          onClick={() => navigate('/listings')}
          className="mb-8 inline-flex items-center gap-2 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ash transition-colors hover:text-gold"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to listings
        </button>

        {/* Gallery */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="media-zoom group relative overflow-hidden rounded-2xl border border-hairline"
            aria-label="Open image gallery"
          >
            <SmartImage
              src={images[0]}
              alt={`${property.title} — principal view`}
              priority
              className="aspect-[16/10] w-full object-cover"
            />
          </button>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            {images.slice(1, 3).map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setLightboxIndex(index + 1)}
                className="media-zoom overflow-hidden rounded-2xl border border-hairline"
                aria-label={`Open image ${index + 2} of ${images.length}`}
              >
                <SmartImage
                  src={image}
                  alt={`${property.title} — view ${index + 2}`}
                  className="aspect-[4/3] w-full object-cover lg:aspect-[16/9]"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="font-display text-[0.68rem] uppercase tracking-[0.2em] text-ash transition-colors hover:text-gold"
          >
            View all {images.length} photographs
          </button>
        </div>

        {/* Header */}
        <div className="mt-10 flex flex-col gap-8 border-b border-hairline pb-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{property.listing_status === 'for-rent' ? 'For Rent' : 'For Sale'}</Badge>
              <Badge tone="neutral">{property.property_type}</Badge>
              {property.featured && <Badge>Featured</Badge>}
            </div>
            <h1 className="font-display text-[1.9rem] font-semibold uppercase tracking-[0.05em] text-vapor sm:text-[2.3rem]">
              {property.title}
            </h1>
            <p className="flex items-center gap-2 text-sm text-ash">
              <PinIcon className="h-4 w-4 text-gold" />
              {property.location_name}, {property.region}
              {property.year_built ? ` · Built ${property.year_built}` : ''}
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <p className="font-display text-[1.6rem] font-semibold tracking-[0.02em] text-gold">{priceLabel}</p>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleToggleSaved}
                aria-pressed={saved}
                className={cx(saved && 'border-gold/50 text-gold')}
              >
                <HeartIcon filled={saved} className="h-4 w-4" />
                {saved ? 'Saved' : 'Save'}
              </Button>
              <Button variant="ghost" onClick={handleShare}>
                <ShareIcon className="h-4 w-4" />
                Share
              </Button>
            </div>
            {shareStatus && (
              <p role="status" className="text-xs text-muted">
                {shareStatus}
              </p>
            )}
          </div>
        </div>

        {/* Specs monolith */}
        <dl className="grid grid-cols-2 gap-8 border-b border-hairline py-8 sm:grid-cols-4">
          {specs.map(({ label, value, Icon }) => (
            <div key={label} className="flex items-center gap-4">
              <Icon className="h-6 w-6 text-gold/80" />
              <div>
                <dd className="font-display text-[1.5rem] font-light tracking-tight text-vapor">{value}</dd>
                <dt className="font-display text-[0.62rem] uppercase tracking-[0.22em] text-muted">{label}</dt>
              </div>
            </div>
          ))}
        </dl>

        {/* Body */}
        <div className="grid grid-cols-1 gap-14 py-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-12">
            <section className="flex flex-col gap-4">
              <h2 className="section-title text-[0.95rem] text-vapor">Description</h2>
              <span className="gold-divider" aria-hidden="true" />
              <p className="text-[0.98rem] leading-relaxed text-ash">{property.description}</p>
            </section>

            {property.features.length > 0 && (
              <section className="flex flex-col gap-4">
                <h2 className="section-title text-[0.95rem] text-vapor">Key features</h2>
                <span className="gold-divider" aria-hidden="true" />
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {property.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-ash">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {property.amenities.length > 0 && (
              <section className="flex flex-col gap-4">
                <h2 className="section-title text-[0.95rem] text-vapor">Amenities</h2>
                <span className="gold-divider" aria-hidden="true" />
                <ul className="flex flex-wrap gap-3">
                  {property.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="rounded-full border border-hairline bg-elevated/50 px-4 py-2 text-xs text-ash"
                    >
                      {amenity}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="flex flex-col gap-4">
              <h2 className="section-title text-[0.95rem] text-vapor">Specifications</h2>
              <span className="gold-divider" aria-hidden="true" />
              <dl className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
                {[
                  ['Property type', property.property_type],
                  ['Status', property.listing_status === 'for-rent' ? 'For rent' : 'For sale'],
                  ['Bedrooms', String(property.bedrooms)],
                  ['Bathrooms', String(property.bathrooms)],
                  ['Floor area', formatArea(property.area_sqft)],
                  ['Lot area', property.lot_area_sqft ? formatArea(property.lot_area_sqft) : '—'],
                  ['Year built', property.year_built ? String(property.year_built) : '—'],
                  ['Reference', property.slug.toUpperCase()],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-6 border-b border-hairline py-2">
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted">{label}</dt>
                    <dd className="text-sm text-vapor">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="section-title text-[0.95rem] text-vapor">Location</h2>
              <span className="gold-divider" aria-hidden="true" />
              <p className="text-sm text-ash">
                {property.location_name}, {property.region}, {property.country}
              </p>
              <div className="rounded-2xl border border-hairline bg-graphite/50 p-6 text-xs leading-relaxed text-muted">
                Street-level address is withheld until a viewing is arranged. No map provider is connected to this
                environment yet — add a maps integration to display the property pin here.
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            {agent && (
              <div className="rounded-2xl border border-hairline bg-card/70 p-6">
                <div className="flex items-center gap-4">
                  <SmartImage
                    src={agent.profile_image}
                    alt={agent.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-vapor">
                      {agent.name}
                    </p>
                    <p className="text-xs text-ash">{agent.role}</p>
                    <Link
                      to={`/agents/${agent.slug}`}
                      className="mt-1 inline-block text-xs text-gold transition-colors hover:text-gold-light"
                    >
                      View profile
                    </Link>
                  </div>
                </div>
                {agent.email && (
                  <p className="mt-4 flex items-center gap-2 text-xs text-muted">
                    <MailIcon className="h-4 w-4" />
                    {agent.email}
                  </p>
                )}
              </div>
            )}

            <div className="rounded-2xl border border-hairline bg-card/70 p-6">
              <h2 className="section-title mb-5 text-[0.85rem] text-vapor">Enquire about this property</h2>
              <InquiryForm
                propertyId={property.id}
                propertyLabel={`${property.title} — ${property.location_name}`}
                defaultInquiryType="Property enquiry"
                submitLabel="Request a viewing"
                compact
              />
            </div>
          </aside>
        </div>

        {/* Related */}
        {related && related.length > 0 && (
          <section className="flex flex-col gap-10 border-t border-hairline pt-14">
            <SectionHeading title="Related properties" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          title={property.title}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </Layout>
  );
}
