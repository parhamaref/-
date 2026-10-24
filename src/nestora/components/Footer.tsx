import { Link } from '../router';
import { useDatabase } from '../data/hooks';
import { FacebookIcon, InstagramIcon, LinkedinIcon, MailIcon, NestoraMark, PhoneIcon } from './Icons';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Listings', to: '/listings' },
  { label: 'Agents', to: '/agents' },
  { label: 'Contact', to: '/contact' },
  { label: 'About', to: '/about' },
];

export function Footer() {
  const { settings } = useDatabase();

  const socials = [
    { label: 'Facebook', href: settings.social_facebook, Icon: FacebookIcon },
    { label: 'Instagram', href: settings.social_instagram, Icon: InstagramIcon },
    { label: 'LinkedIn', href: settings.social_linkedin, Icon: LinkedinIcon },
  ];

  return (
    <footer className="border-t border-hairline bg-obsidian">
      <div className="nestora-container flex flex-col gap-8 py-12">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label="Nestora Homes — home">
            <NestoraMark className="h-7 w-7 text-gold" />
            <span className="font-display text-[0.85rem] font-semibold uppercase tracking-[0.3em] text-vapor">
              {settings.brand_name}
            </span>
          </Link>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="font-display text-[0.7rem] font-medium uppercase tracking-[0.2em] text-ash transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex items-center gap-3">
            {socials.map(({ label, href, Icon }) =>
              href ? (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-ash transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    <Icon className="h-[1.05rem] w-[1.05rem]" />
                  </a>
                </li>
              ) : (
                <li key={label}>
                  <span
                    title={`${label} — add a profile URL in the admin settings`}
                    aria-label={`${label} (no profile URL configured yet)`}
                    className="inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full border border-hairline text-muted/70"
                  >
                    <Icon className="h-[1.05rem] w-[1.05rem]" />
                  </span>
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="hairline-t flex flex-col gap-4 border-t border-hairline pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-2">
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <MailIcon className="h-4 w-4" />
                  {settings.contact_email}
                </a>
              )}
            </span>
            {settings.contact_phone && (
              <span className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                {settings.contact_phone}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/privacy" className="transition-colors hover:text-gold">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-gold">
              Terms of Service
            </Link>
            <span>© {new Date().getFullYear()} {settings.brand_name}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
