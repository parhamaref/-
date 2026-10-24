import { useEffect, useState } from 'react';
import { Link, useRouter } from '../router';
import { getVisitorId } from '../data/store';
import { useDatabase } from '../data/hooks';
import { cx } from '../lib/format';
import { CloseIcon, HeartIcon, MenuIcon, NestoraMark } from './Icons';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Listings', to: '/listings' },
  { label: 'Agents', to: '/agents' },
  { label: 'Contact', to: '/contact' },
  { label: 'About', to: '/about' },
];

export function Header({ overlay = false }: { overlay?: boolean }) {
  const { pathname } = useRouter();
  const database = useDatabase();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const savedCount = database.favorites.filter((favorite) => favorite.owner_id === getVisitorId()).length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const solid = !overlay || scrolled;

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
        solid ? 'border-b border-hairline bg-obsidian/90 backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <div className="nestora-container flex h-[4.6rem] items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3" aria-label="Nestora Homes — home">
          <NestoraMark className="h-8 w-8 text-gold" />
          <span className="font-display text-[0.95rem] font-semibold uppercase tracking-[0.32em] text-vapor">
            Nestora
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {NAV_ITEMS.map((item) => {
              const active = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    data-active={active}
                    aria-current={active ? 'page' : undefined}
                    className="nav-link font-display text-[0.72rem] font-medium uppercase tracking-[0.22em] text-ash transition-colors hover:text-vapor data-[active=true]:text-vapor"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/saved"
            className="relative hidden h-11 w-11 items-center justify-center rounded-full border border-hairline text-ash transition-colors hover:border-gold/50 hover:text-gold sm:inline-flex"
            aria-label={`Saved properties (${savedCount})`}
          >
            <HeartIcon className="h-[1.15rem] w-[1.15rem]" />
            {savedCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 font-display text-[0.6rem] font-semibold text-obsidian">
                {savedCount}
              </span>
            )}
          </Link>

          <Link
            to="/get-started"
            className="hidden rounded-full border border-gold bg-gold px-5 py-3 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-obsidian transition-colors duration-300 hover:bg-gold-light sm:inline-flex"
          >
            Get Started
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-vapor transition-colors hover:border-gold/50 lg:hidden"
          >
            {menuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="animate-fade-in border-t border-hairline bg-obsidian/97 backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Mobile" className="nestora-container flex flex-col py-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="border-b border-hairline py-4 font-display text-sm uppercase tracking-[0.2em] text-ash transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/saved"
              className="border-b border-hairline py-4 font-display text-sm uppercase tracking-[0.2em] text-ash transition-colors hover:text-gold"
            >
              Saved {savedCount > 0 ? `(${savedCount})` : ''}
            </Link>
            <Link
              to="/get-started"
              className="mt-6 inline-flex items-center justify-center rounded-full border border-gold bg-gold px-6 py-3.5 font-display text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-obsidian"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
