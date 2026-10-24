import { ArrowLeftIcon, SearchIcon } from '../components/Icons';
import { Link } from '../router';

export function NotFound({
  title = 'Page not found',
  description = 'The page you were looking for is no longer here. Try the listings, or head back to the homepage.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="nestora-container flex flex-col items-start gap-6 py-28">
      <h1 className="font-display text-[2rem] font-semibold uppercase tracking-[0.08em] text-vapor">{title}</h1>
      <span className="gold-divider" aria-hidden="true" />
      <p className="max-w-xl text-sm text-ash">{description}</p>
      <div className="flex flex-wrap items-center gap-4">
        <Link
          to="/listings"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold bg-gold px-6 font-display text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-obsidian transition-colors hover:bg-gold-light"
        >
          <SearchIcon className="h-4 w-4" />
          Browse listings
        </Link>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-hairline px-6 font-display text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ash transition-colors hover:border-gold/50 hover:text-gold"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back home
        </Link>
      </div>
    </div>
  );
}
