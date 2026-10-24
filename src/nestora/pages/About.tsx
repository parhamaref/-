import { useDatabase, useJsonLd, usePageMeta } from '../data/hooks';
import { Link } from '../router';
import { Layout } from '../components/Layout';
import { SectionHeading, LinkButton, Button } from '../components/ui';
import { SmartImage } from '../components/SmartImage';
import { ArrowRightIcon, CheckIcon } from '../components/Icons';

const PRINCIPLES = [
  {
    title: 'Selected, not listed',
    body: 'Every property is reviewed against construction quality, site orientation and long-term value before it reaches the collection.',
  },
  {
    title: 'Advised, not sold',
    body: 'Advisors work on a small number of mandates at a time so each client receives considered, unhurried guidance.',
  },
  {
    title: 'Quiet by default',
    body: 'Discretion is standard: off-market introductions, private viewings and documentation handled without publicity.',
  },
];

export function About() {
  const { settings } = useDatabase();

  usePageMeta({
    title: 'About — Nestora Homes',
    description:
      'Nestora Homes is a luxury residential advisory: architectural selection, market analysis and discreet representation for private clients.',
  });

  useJsonLd('about', {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Nestora Homes',
    url: `${window.location.origin}/about`,
  });

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="nestora-container grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-6">
            <SectionHeading
              as="h1"
              align="left"
              title="About Nestora Homes"
              description="A residential advisory for collectors of architecture."
            />
            <p className="text-[0.98rem] leading-relaxed text-ash">
              Nestora Homes began with a simple idea: that a house should be considered the way a work of architecture is
              considered — for its light, its proportion, its materials and the way it sits in the landscape. We advise
              private clients on the acquisition and sale of significant residences across seven cities, working with
              architects, owners and estate managers who expect their representation to be as considered as their
              buildings.
            </p>
            <p className="text-[0.98rem] leading-relaxed text-ash">
              Our collection is deliberately compact. Each property is photographed at the blue hour, documented
              properly and presented without exaggeration. What we publish is what a client will find on site.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <LinkButton to="/listings" withArrow>
                Browse the collection
              </LinkButton>
              <Link
                to="/contact"
                className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ash transition-colors hover:text-gold"
              >
                Speak to an advisor
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-hairline">
            <SmartImage
              src={settings.about_image}
              alt="Warmly lit contemporary living space with architectural detailing"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-24">
        <div className="nestora-container grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="flex flex-col gap-5">
            <h2 className="section-title text-[1rem] text-vapor">Our approach</h2>
            <span className="gold-divider" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-ash">
              We describe ourselves as curators rather than agents. The work is research-led: planning history, build
              quality, comparable sales and the daily reality of living in a place all inform the advice we give.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <li key={principle.title} className="flex flex-col gap-3 border-t border-hairline pt-6">
                <CheckIcon className="h-5 w-5 text-gold" />
                <h3 className="font-display text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-vapor">
                  {principle.title}
                </h3>
                <p className="text-sm leading-relaxed text-ash">{principle.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-24">
        <div className="nestora-container">
          <div className="flex flex-col items-start gap-6 rounded-3xl border border-hairline bg-graphite/70 p-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-[1.3rem] font-semibold uppercase tracking-[0.06em] text-vapor">
                Ready when you are
              </h2>
              <p className="mt-3 max-w-xl text-sm text-ash">
                Tell us what you are looking for and we will put together a short list — including residences that are
                not publicly advertised.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <LinkButton to="/get-started" size="lg">
                Get started
              </LinkButton>
              <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Back to top
                <ArrowRightIcon className="h-4 w-4 -rotate-90" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
