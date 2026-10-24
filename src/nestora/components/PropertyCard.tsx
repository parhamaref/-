import { Link } from '../router';
import type { Property } from '../data/types';
import { cx, formatArea, formatPrice } from '../lib/format';
import { AreaIcon, BathIcon, BedIcon, HeartIcon, PinIcon } from './Icons';
import { Badge } from './ui';
import { SmartImage } from './SmartImage';

interface PropertyCardProps {
  property: Property;
  saved?: boolean;
  onToggleSaved?: (propertyId: string) => void;
  layout?: 'grid' | 'list';
  priority?: boolean;
}

export function PropertyCard({ property, saved, onToggleSaved, layout = 'grid', priority }: PropertyCardProps) {
  const statusLabel = property.listing_status === 'for-rent' ? 'For Rent' : 'For Sale';
  const priceLabel =
    property.listing_status === 'for-rent'
      ? `${formatPrice(property.price, property.currency)} / month`
      : formatPrice(property.price, property.currency);

  return (
    <article
      className={cx(
        'group relative isolate overflow-hidden rounded-2xl border border-hairline bg-card transition-colors duration-500 hover:border-gold/45',
        layout === 'list' && 'sm:flex sm:items-stretch',
      )}
    >
      {/* Stretched link keeps the whole card clickable without nesting interactive elements */}
      <Link
        to={`/property/${property.slug}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-offset-4"
        aria-label={`View ${property.title} in ${property.location_name} — ${priceLabel}`}
      />

      <div
        className={cx(
          'media-zoom relative overflow-hidden',
          layout === 'list' ? 'sm:w-2/5 sm:shrink-0' : '',
        )}
      >
        <SmartImage
          src={property.main_image}
          alt={`${property.title}, ${property.location_name}`}
          priority={priority}
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
          className={cx('h-full w-full object-cover', layout === 'list' ? 'aspect-[4/3]' : 'aspect-[4/3]')}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/55 via-transparent to-transparent" />
        <div className="absolute right-4 top-4 z-20">
          <Badge>{statusLabel}</Badge>
        </div>
        {onToggleSaved && (
          <button
            type="button"
            onClick={() => onToggleSaved(property.id)}
            aria-pressed={Boolean(saved)}
            aria-label={saved ? `Remove ${property.title} from saved` : `Save ${property.title}`}
            className={cx(
              'absolute left-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-colors duration-300',
              saved
                ? 'border-gold/60 bg-obsidian/70 text-gold'
                : 'border-hairline bg-obsidian/55 text-ash hover:border-gold/50 hover:text-gold',
            )}
          >
            <HeartIcon filled={saved} className="h-[1.05rem] w-[1.05rem]" />
          </button>
        )}
      </div>

      <div className={cx('relative z-10 flex flex-col gap-4 p-5', layout === 'list' && 'sm:flex-1 sm:justify-center')}>
        <div className="flex flex-col gap-1.5">
          <h3 className="font-display text-[1.02rem] font-semibold uppercase tracking-[0.14em] text-vapor transition-colors group-hover:text-gold-light">
            {property.title}
          </h3>
          <p className="flex items-center gap-1.5 text-xs text-ash">
            <PinIcon className="h-3.5 w-3.5 text-gold" />
            {property.location_name}
          </p>
        </div>

        <p className="font-display text-[1.15rem] font-semibold tracking-[0.04em] text-gold">{priceLabel}</p>

        <div className="h-px w-full bg-hairline" />

        <dl className="flex items-center gap-5 text-xs text-ash">
          <div className="flex items-center gap-2">
            <BedIcon className="h-4 w-4 text-gold/80" />
            <dt className="sr-only">Bedrooms</dt>
            <dd>{property.bedrooms} Beds</dd>
          </div>
          <div className="flex items-center gap-2">
            <BathIcon className="h-4 w-4 text-gold/80" />
            <dt className="sr-only">Bathrooms</dt>
            <dd>{property.bathrooms} Baths</dd>
          </div>
          <div className="flex items-center gap-2">
            <AreaIcon className="h-4 w-4 text-gold/80" />
            <dt className="sr-only">Floor area</dt>
            <dd>{formatArea(property.area_sqft)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
