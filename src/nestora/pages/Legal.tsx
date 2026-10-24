import { usePageMeta } from '../data/hooks';
import { Layout } from '../components/Layout';
import { SectionHeading } from '../components/ui';

const PRIVACY = [
  ['What we collect', 'Enquiry details you submit — name, email address, telephone number, budget guidance and any message — plus the properties you decide to save while browsing.'],
  ['Why we collect it', 'To answer your enquiry, prepare a short list of properties and keep a record of the conversation. Saved properties are held so you can return to them.'],
  ['Where it is stored', 'In this environment, records are held in the browser’s local storage on the device you are using. No third-party analytics, advertising or marketing services are connected.'],
  ['Your choices', 'You can remove saved properties at any time from the Saved Properties page, and you can request deletion of any enquiry by contacting the advisory team.'],
];

const TERMS = [
  ['Demonstration content', 'Properties, advisors and contact details shown in this application are sample records for review. They are not offers, listings or professional credentials.'],
  ['Accuracy', 'Descriptions are provided for demonstration. Any real listing published here should be verified against survey documents, planning records and a physical viewing before purchase.'],
  ['Enquiries', 'Submitting the contact or consultation form records an enquiry in this environment. No automated email or notification service is connected unless one is configured by the operator.'],
  ['Liability', 'The application is provided as-is for demonstration purposes. Independent legal, structural and financial advice should always be obtained before transacting.'],
];

export function Legal({ kind }: { kind: 'privacy' | 'terms' }) {
  const isPrivacy = kind === 'privacy';
  const sections = isPrivacy ? PRIVACY : TERMS;
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';

  usePageMeta({
    title: `${title} — Nestora Homes`,
    description: isPrivacy
      ? 'How Nestora Homes handles enquiry details and saved properties.'
      : 'Terms covering the demonstration content and enquiries in the Nestora Homes application.',
    noindex: true,
  });

  return (
    <Layout>
      <div className="nestora-container flex max-w-3xl flex-col gap-10 py-16 lg:py-20">
        <SectionHeading as="h1" align="left" title={title} />
        <p className="rounded-2xl border border-hairline bg-graphite/50 p-5 text-xs leading-relaxed text-muted">
          Template text. Replace this with your own policy before publishing the site — it describes how this
          particular build handles data and content.
        </p>
        <dl className="flex flex-col gap-8">
          {sections.map(([heading, body]) => (
            <div key={heading} className="flex flex-col gap-3 border-t border-hairline pt-6">
              <dt className="font-display text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-vapor">
                {heading}
              </dt>
              <dd className="text-sm leading-relaxed text-ash">{body}</dd>
            </div>
          ))}
        </dl>
        <p className="text-xs text-muted">Last updated {new Date().toLocaleDateString('en-GB', { dateStyle: 'long' })}.</p>
      </div>
    </Layout>
  );
}
