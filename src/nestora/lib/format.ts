export function formatPrice(value: number, currency = 'USD', options?: { compact?: boolean }) {
  if (!Number.isFinite(value)) return '—';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
    notation: options?.compact && value >= 1_000_000 ? 'compact' : 'standard',
  });
  return formatter.format(value);
}

export function formatPriceLabel(value: number, currency = 'USD') {
  if (value >= 5_000_000) return `${formatPrice(value, currency, { compact: true })}+`;
  return formatPrice(value, currency);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatArea(value: number | null | undefined) {
  if (!value) return '—';
  return `${formatNumber(value)} sq ft`;
}

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}
