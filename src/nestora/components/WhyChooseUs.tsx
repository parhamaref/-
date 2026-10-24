import { ChartIcon, HandshakeIcon, LayersIcon, ShieldIcon } from './Icons';
import { Reveal } from './Reveal';
import { SectionHeading } from './ui';

const FEATURES = [
  {
    title: 'Premium Listings',
    description: 'Curated exclusive luxury homes and sophisticated properties.',
    Icon: LayersIcon,
  },
  {
    title: 'Expert Guidance',
    description: 'Expert, local knowledge and personalized guidance.',
    Icon: HandshakeIcon,
  },
  {
    title: 'Market Analytics',
    description: 'Data-driven insights for smarter real estate decisions.',
    Icon: ChartIcon,
  },
  {
    title: 'Secure Transactions',
    description: 'Secure and transparent processes for a worry-free experience.',
    Icon: ShieldIcon,
  },
];

export function WhyChooseUs() {
  return (
    <section aria-labelledby="why-choose-us" className="pb-20 lg:pb-24">
      <div className="nestora-container">
        <Reveal>
          <div className="rounded-3xl border border-hairline bg-graphite/70 px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <SectionHeading title="Why Choose Us" />

            <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {FEATURES.map(({ title, description, Icon }, index) => (
                <div
                  key={title}
                  className={[
                    'flex flex-col items-center gap-4 px-2 text-center lg:px-8',
                    index > 0 ? 'lg:border-l lg:border-hairline' : '',
                    index % 2 === 1 ? 'sm:border-l sm:border-hairline lg:border-l' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/25 bg-gold/5 text-gold">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display text-[0.82rem] font-semibold uppercase tracking-[0.2em] text-vapor">
                    {title}
                  </h3>
                  <p className="max-w-[15rem] text-sm leading-relaxed text-ash">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
