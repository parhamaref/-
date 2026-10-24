import { ChevronDownIcon } from './Icons';
import { cx } from '../lib/format';

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  srOnlyLabel?: boolean;
}

/** Labelled native select used across the listing filters and sort controls. */
export function FilterSelect({ id, label, value, options, onChange, srOnlyLabel }: FilterSelectProps) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className={cx(
          'mb-2 font-display text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-muted',
          srOnlyLabel && 'sr-only',
        )}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cx(
            'w-full appearance-none rounded-xl border border-hairline bg-graphite/80 text-sm text-vapor transition-colors focus:border-gold/60 focus:outline-none',
            srOnlyLabel ? 'min-h-10 pl-3.5 pr-9' : 'min-h-11 pl-3.5 pr-9',
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </div>
    </div>
  );
}
