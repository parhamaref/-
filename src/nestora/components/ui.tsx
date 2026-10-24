import { useId, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/format';
import { ArrowRightIcon } from './Icons';

/* ----------------------------------------------------------------------- button */

type Variant = 'gold' | 'outline' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'md' | 'lg';
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  gold: 'bg-gold text-obsidian hover:bg-gold-light border border-gold',
  outline: 'border border-gold/45 text-gold hover:bg-gold/10',
  ghost: 'border border-hairline text-ash hover:text-vapor hover:border-gold/40',
};

export function Button({ variant = 'gold', size = 'md', className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cx(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-display text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-55',
        size === 'lg' ? 'px-7 py-3.5' : 'px-5 py-2.5',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ----------------------------------------------------------------- link button */

export function LinkButton({
  to,
  children,
  variant = 'gold',
  size = 'md',
  className,
  withArrow,
}: {
  to: string;
  children: ReactNode;
  variant?: Variant;
  size?: 'md' | 'lg';
  className?: string;
  withArrow?: boolean;
}) {
  return (
    <a
      href={to}
      className={cx(
        'group inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-display text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300',
        size === 'lg' ? 'px-7 py-3.5' : 'px-5 py-2.5',
        variants[variant],
        className,
      )}
    >
      {children}
      {withArrow && (
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </a>
  );
}

/* -------------------------------------------------------------------- headings */

export function SectionHeading({
  title,
  align = 'center',
  description,
  as: Tag = 'h2',
}: {
  title: string;
  align?: 'center' | 'left';
  description?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <div className={cx('flex flex-col gap-4', align === 'center' ? 'items-center text-center' : 'items-start')}>
      <Tag className="section-title text-balance text-[1.05rem] text-vapor sm:text-[1.25rem]">{title}</Tag>
      <span className="gold-divider" aria-hidden="true" />
      {description && <p className="max-w-2xl text-[0.98rem] text-ash">{description}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------------- fields */

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}

/** Accessible label + error wiring for any control. */
export function Field({ label, error, hint, required, children }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ash">
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-gold-light">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  'min-h-11 w-full rounded-xl border border-hairline bg-graphite/80 px-3.5 py-2.5 text-sm text-vapor placeholder:text-muted focus:border-gold/60 focus:outline-none';

/* ----------------------------------------------------------------------- chips */

export function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove?: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1.5 text-xs text-ash">
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove filter ${label}`}
          className="text-gold transition-colors hover:text-gold-light"
        >
          ×
        </button>
      )}
    </span>
  );
}

export function Badge({ children, tone = 'gold' }: { children: ReactNode; tone?: 'gold' | 'neutral' }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full border px-2.5 py-1 font-display text-[0.6rem] font-semibold uppercase tracking-[0.18em]',
        tone === 'gold'
          ? 'border-gold/40 bg-obsidian/70 text-gold backdrop-blur-sm'
          : 'border-hairline bg-elevated/80 text-ash',
      )}
    >
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------------- states */

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cx(
        'inline-block h-4 w-4 animate-spin rounded-full border-2 border-gold/30 border-t-gold',
        className,
      )}
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-card">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="flex flex-col gap-3 p-5">
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-5 w-1/2 rounded" />
        <div className="skeleton h-3 w-full rounded" />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-hairline bg-card/60 px-6 py-14 text-center">
      <h3 className="section-title text-sm text-vapor">{title}</h3>
      <p className="max-w-md text-sm text-ash">{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-4 rounded-2xl border border-gold/30 bg-card/60 px-6 py-12 text-center">
      <h3 className="section-title text-sm text-vapor">Something went wrong</h3>
      <p className="max-w-md text-sm text-ash">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
