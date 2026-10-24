import { listAgents } from '../data/api';
import { useAsync, usePageMeta } from '../data/hooks';
import { Link } from '../router';
import { Layout } from '../components/Layout';
import { SmartImage } from '../components/SmartImage';
import { ArrowRightIcon, MailIcon } from '../components/Icons';
import { EmptyState, ErrorState, SectionHeading, Spinner } from '../components/ui';

export function Agents() {
  const { data: agents, loading, error, reload } = useAsync(() => listAgents(), []);

  usePageMeta({
    title: 'Agents — Nestora Homes',
    description:
      'Meet the Nestora Homes advisors: coastal estates, international sales, waterfront residences, penthouses and townhouses.',
  });

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="nestora-container flex flex-col gap-12">
          <SectionHeading
            as="h1"
            align="left"
            title="Our Advisors"
            description="A small team of specialists, each with a defined area of expertise. Profiles below are sample records stored locally for review."
          />

          {error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : loading ? (
            <div className="flex items-center gap-3 text-sm text-ash">
              <Spinner /> Loading advisors…
            </div>
          ) : agents && agents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {agents.map((agent) => (
                <article
                  key={agent.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-card transition-colors duration-500 hover:border-gold/45"
                >
                  <SmartImage
                    src={agent.profile_image}
                    alt={agent.name}
                    className="aspect-[5/4] w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div>
                      <h2 className="font-display text-[1rem] font-semibold uppercase tracking-[0.14em] text-vapor">
                        {agent.name}
                      </h2>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-gold">{agent.role}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-ash">{agent.biography}</p>
                    <ul className="flex flex-wrap gap-2">
                      {agent.specialties.map((specialty) => (
                        <li
                          key={specialty}
                          className="rounded-full border border-hairline px-3 py-1 text-[0.68rem] text-muted"
                        >
                          {specialty}
                        </li>
                      ))}
                    </ul>
                    <p className="flex items-center gap-2 text-xs text-muted">
                      <MailIcon className="h-4 w-4" />
                      {agent.email}
                    </p>
                    <div className="mt-auto flex items-center gap-5 pt-2">
                      <Link
                        to={`/agents/${agent.slug}`}
                        className="group/link inline-flex items-center gap-2 font-display text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-light"
                      >
                        View profile
                        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                      <Link
                        to="/contact"
                        className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ash transition-colors hover:text-gold"
                      >
                        Contact
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No advisors published"
              description="Advisor profiles will appear here once they are published in the content console."
            />
          )}
        </div>
      </section>
    </Layout>
  );
}
