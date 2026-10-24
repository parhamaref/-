import { useDatabase } from '../../data/hooks';
import { formatDate } from '../../lib/format';
import { Link } from '../../router';

export function AdminDashboard() {
  const database = useDatabase();

  const stats = [
    { label: 'Properties', value: database.properties.length },
    { label: 'Published', value: database.properties.filter((property) => property.published).length },
    { label: 'Featured', value: database.properties.filter((property) => property.featured).length },
    { label: 'Advisors', value: database.agents.length },
    { label: 'Enquiries', value: database.inquiries.length },
    { label: 'New enquiries', value: database.inquiries.filter((inquiry) => inquiry.status === 'new').length },
  ];

  const recent = database.inquiries.slice(0, 5);

  return (
    <div className="flex flex-col gap-10">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <li key={stat.label} className="rounded-2xl border border-hairline bg-card/70 p-5">
            <p className="font-display text-[1.75rem] font-light text-vapor">{stat.value}</p>
            <p className="mt-1 font-display text-[0.6rem] uppercase tracking-[0.2em] text-muted">{stat.label}</p>
          </li>
        ))}
      </ul>

      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-vapor">
            Recent enquiries
          </h2>
          <Link
            to="/admin/inquiries"
            className="font-display text-[0.66rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-gold"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="rounded-2xl border border-hairline bg-card/50 p-6 text-sm text-ash">
            No enquiries yet. Submissions from the contact form, property pages and the consultation flow appear here
            immediately.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-[color:var(--color-hairline)] rounded-2xl border border-hairline bg-card/50">
            {recent.map((inquiry) => (
              <li key={inquiry.id} className="flex flex-wrap items-center justify-between gap-3 p-5 text-sm">
                <div>
                  <p className="text-vapor">{inquiry.name}</p>
                  <p className="text-xs text-muted">
                    {inquiry.inquiry_type}
                    {inquiry.property_label ? ` · ${inquiry.property_label}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-muted">{formatDate(inquiry.created_at)}</span>
                  <span className="rounded-full border border-gold/30 px-3 py-1 text-gold">{inquiry.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
