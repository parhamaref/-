import { useDatabase, usePageMeta } from '../data/hooks';
import { Layout } from '../components/Layout';
import { InquiryForm } from '../components/InquiryForm';
import { SectionHeading } from '../components/ui';
import { MailIcon, PhoneIcon } from '../components/Icons';

export function Contact() {
  const { settings } = useDatabase();

  usePageMeta({
    title: 'Contact — Nestora Homes',
    description:
      'Contact the Nestora Homes advisory team about a property, a private viewing or a general enquiry. Enquiries are stored and reviewed by our advisors.',
  });

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="nestora-container grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="flex flex-col gap-8">
            <SectionHeading
              as="h1"
              align="left"
              title="Contact"
              description="Tell us what you are looking for. Enquiries are recorded and reviewed by an advisor."
            />

            <dl className="flex flex-col gap-5 text-sm text-ash">
              {settings.contact_email && (
                <div className="flex items-start gap-3">
                  <MailIcon className="mt-0.5 h-5 w-5 text-gold" />
                  <div>
                    <dt className="font-display text-[0.66rem] uppercase tracking-[0.2em] text-muted">Email</dt>
                    <dd>
                      <a href={`mailto:${settings.contact_email}`} className="transition-colors hover:text-gold">
                        {settings.contact_email}
                      </a>
                    </dd>
                  </div>
                </div>
              )}
              {settings.contact_phone && (
                <div className="flex items-start gap-3">
                  <PhoneIcon className="mt-0.5 h-5 w-5 text-gold" />
                  <div>
                    <dt className="font-display text-[0.66rem] uppercase tracking-[0.2em] text-muted">Telephone</dt>
                    <dd>{settings.contact_phone}</dd>
                  </div>
                </div>
              )}
            </dl>

            <p className="rounded-2xl border border-hairline bg-graphite/50 p-5 text-xs leading-relaxed text-muted">
              Contact details shown above are editable placeholders. Update them in the content console under Settings —
              no real telephone number, office address or social profile is invented by this application.
            </p>
          </div>

          <div className="rounded-3xl border border-hairline bg-card/60 p-6 sm:p-8">
            <InquiryForm showPropertySelect submitLabel="Send enquiry" />
          </div>
        </div>
      </section>
    </Layout>
  );
}
