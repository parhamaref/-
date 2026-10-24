import { useEffect, useMemo, useRef, useState } from 'react';
import { PRICE_MAX, PRICE_MIN, PROPERTY_TYPES } from '../data/types';
import { cx } from '../lib/format';
import { ChevronDownIcon, PinIcon, SearchIcon } from './Icons';
import { PriceRangeSlider } from './PriceRangeSlider';
import { Button } from './ui';

export interface SearchCriteria {
  location: string;
  type: string;
  minPrice: number;
  maxPrice: number;
}

export const DEFAULT_SEARCH: SearchCriteria = {
  location: '',
  type: 'All Properties',
  minPrice: PRICE_MIN,
  maxPrice: PRICE_MAX,
};

function LocationCombobox({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(
    () => options.filter((option) => option.toLowerCase().includes(query.trim().toLowerCase())),
    [options, query],
  );

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const select = (next: string) => {
    onChange(next);
    setQuery('');
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor="search-location"
        className="mb-2 block font-display text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-muted"
      >
        Location
      </label>
      <div className="relative">
        <PinIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
        <input
          id="search-location"
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="search-location-options"
          aria-autocomplete="list"
          autoComplete="off"
          placeholder="Any location"
          value={open ? query : value || ''}
          onFocus={() => {
            setOpen(true);
            setQuery('');
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((index) => Math.min(index + 1, filtered.length));
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActiveIndex((index) => Math.max(index - 1, 0));
            } else if (event.key === 'Enter' && open) {
              event.preventDefault();
              // Enter chooses the first match for what was typed, or clears the filter.
              if (query.trim() && filtered.length > 0) select(filtered[0]);
              else select('');
            } else if (event.key === 'Escape') {
              setOpen(false);
            }
          }}
          className="min-h-12 w-full rounded-xl border border-hairline bg-graphite/70 pl-10 pr-9 text-sm text-vapor placeholder:text-muted focus:border-gold/60 focus:outline-none"
        />
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={() => select('')}
              aria-label="Reset location"
              className="text-xs text-muted transition-colors hover:text-gold"
            >
              Reset
            </button>
          )}
          <ChevronDownIcon className={cx('h-4 w-4 text-muted transition-transform', open && 'rotate-180')} />
        </div>
      </div>

      {open && (
        <ul
          id="search-location-options"
          role="listbox"
          aria-label="Locations"
          className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-hairline bg-graphite shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)]"
        >
          {[{ label: 'Any location', value: '' }, ...filtered.map((option) => ({ label: option, value: option }))].map(
            (option, index) => (
              <li
                key={option.value || 'any'}
                role="option"
                aria-selected={value === option.value}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <button
                  type="button"
                  onClick={() => select(option.value)}
                  className={cx(
                    'w-full px-4 py-3 text-left text-sm transition-colors',
                    index === activeIndex ? 'bg-elevated text-vapor' : 'text-ash hover:bg-elevated hover:text-vapor',
                    value === option.value && 'text-gold',
                  )}
                >
                  {option.label}
                </button>
              </li>
            ),
          )}
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-sm text-muted">No locations match that search.</li>
          )}
        </ul>
      )}
    </div>
  );
}

interface SearchPanelProps {
  initial?: Partial<SearchCriteria>;
  onSearch: (criteria: SearchCriteria) => void;
  className?: string;
}

/** The floating search foundation that anchors the hero. */
export function SearchPanel({ initial, onSearch, className }: SearchPanelProps) {
  const [criteria, setCriteria] = useState<SearchCriteria>({ ...DEFAULT_SEARCH, ...initial });
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    import('../data/api').then(({ listLocations }) =>
      listLocations().then((value) => {
        if (active) setLocations(value);
      }),
    );
    return () => {
      active = false;
    };
  }, []);

  return (
    <form
      className={cx('surface-glass rounded-2xl p-4 sm:p-5', className)}
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(criteria);
      }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-[1.05fr_1fr_1.5fr_auto] lg:items-end lg:gap-6">
        <LocationCombobox
          value={criteria.location}
          options={locations}
          onChange={(location) => setCriteria((current) => ({ ...current, location }))}
        />

        <div>
          <label
            htmlFor="search-type"
            className="mb-2 block font-display text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-muted"
          >
            Property Type
          </label>
          <div className="relative">
            <select
              id="search-type"
              value={criteria.type}
              onChange={(event) => setCriteria((current) => ({ ...current, type: event.target.value }))}
              className="min-h-12 w-full appearance-none rounded-xl border border-hairline bg-graphite/70 px-3.5 pr-9 text-sm text-vapor focus:border-gold/60 focus:outline-none"
            >
              <option value="All Properties">All Properties</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <p className="mb-2 font-display text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-muted">
            Price Range
          </p>
          <div className="rounded-xl border border-hairline bg-graphite/70 px-3.5 py-2.5">
            <PriceRangeSlider
              min={PRICE_MIN}
              max={PRICE_MAX}
              valueMin={criteria.minPrice}
              valueMax={criteria.maxPrice}
              onChange={(minPrice, maxPrice) => setCriteria((current) => ({ ...current, minPrice, maxPrice }))}
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full lg:w-auto">
          <SearchIcon className="h-4 w-4" />
          Search
        </Button>
      </div>
    </form>
  );
}
