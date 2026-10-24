import { getAgentBySlug, listPropertiesByAgent } from '../data/api';
import { useAsync, usePageMeta } from '../data/hooks';
import { Link } from '../router';
import { Layout } from '../components/Layout';
import { InquiryForm } from '../components/InquiryForm';
import { PropertyCard } from '../components/PropertyCard';
import { SmartImage } from '../components/SmartImage';
import { ArrowLeftIcon, MailIcon, PhoneIcon } from '../components/Icons';
import { ErrorState, SectionHeading, Spinner } from '../components/ui';
import { NotFound } from './NotFound';

export function AgentDetail({ slug }: { slug: string }) {
  const { data: agent, loading, error, reload } = useAsync(() => getAgentBySlug(slug), [slug]);
  const { data: listings } = useAsync(
    () => (agent ? listPropertiesByAgent(agent.id) : Promise.resolve([])),
    [agent?.id],
  );

  usePageMeta({
    title: agent ? `${agent.name} — Nestora Homes` : 'Advisor — Nestora Homes',
    description: agent?.biography ?? 'Advisor profile from the Nestora Homes residential advisory team.',
    image: agent?.profile_image,
  });

  if (loading) {
    return (
      <Layout>
        <div className="nestora-container flex items-center gap-3 py-24 text-sm text-ash">
          <Spinner /> Loading profile…
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="nestora-container py-24">
          <ErrorState message={error} onRetry={reload} />
        </div>
      </Layout>
    );
  }

  if (!agent) {
    return (
      <Layout>
        <NotFound title="Advisor not found" description="That profile is not published. Browse the advisory team instead." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="nestora-container py-12 lg:py-16">
        <Link
          to="/agents"
          className="mb-10 inline-flex items-center gap-2 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ash transition-colors hover:text-gold"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          All advisors
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-3xl border border-hairline">
              <SmartImage
                src={agent.profile_image}
                alt={agent.name}
                priority
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <dl className="flex flex-col gap-4 text-sm text-ash">
              <div className="flex items-center gap-3">
                <MailIcon className="h-4 w-4 text-gold" />
                <dt className="sr-only">Email</dt>
                <dd>
                  <a href={`mailto:${agent.email}`} className="transition-colors hover:text-gold">
                    {agent.email}
                  </a>
                </dd>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-4 w-4 text-gold" />
                <dt className="sr-only">Telephone</dt>
                <dd>{agent.phone}</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <p className="font-display text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-gold">
                {agent.role}
              </p>
              <h1 className="font-display text-[2rem] font-semibold uppercase tracking-[0.05em] text-vapor">
                {agent.name}
              </h1>
              <span className="gold-divider" aria-hidden="true" />
              <p className="text-[0.98rem] leading-relaxed text-ash">{agent.biography}</p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <h2 className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-vapor">
                  Expertise
                </h2>
                <ul className="flex flex-col gap-2 text-sm text-ash">
                  {agent.specialties.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-vapor">
                  Service areas
                </h2>
                <ul className="flex flex-col gap-2 text-sm text-ash">
                  {agent.service_areas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-hairline bg-card/60 p-6">
              <h2 className="section-title mb-5 text-[0.85rem] text-vapor">Send an enquiry</h2>
              <InquiryForm
                defaultInquiryType="Consultation request"
                submitLabel="Send to advisor"
                compact
              />
            </div>
          </div>
        </div>

        {listings && listings.length > 0 && (
          <section className="mt-20 flex flex-col gap-10 border-t border-hairline pt-14">
            <SectionHeading title={`${agent.name.split(' ')[0]}’s listings`} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
