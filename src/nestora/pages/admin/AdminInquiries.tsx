import { useState } from 'react';
import { useDatabase } from '../../data/hooks';
import { updateInquiryStatus } from '../../data/api';
import { INQUIRY_STATUSES, type InquiryStatus } from '../../data/types';
import { formatDate } from '../../lib/format';
import { EmptyState } from '../../components/ui';

export function AdminInquiries() {
  const database = useDatabase();
  const [busyId, setBusyId] = useState('');

  const handleStatus = async (id: string, status: InquiryStatus) => {
    setBusyId(id);
    await updateInquiryStatus(id, status);
    setBusyId('');
  };

  if (database.inquiries.length === 0) {
    return (
      <EmptyState
        title="No enquiries yet"
        description="Submissions from the contact form, property pages and the consultation flow are written here as soon as they are received."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-vapor">
        Enquiries ({database.inquiries.length})
      </h2>

      <p className="rounded-2xl border border-hairline bg-graphite/50 p-4 text-xs text-muted">
        Enquiry records contain customer contact details. They are held in this browser only and are never exposed on
        the public pages of the site.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-hairline">
        <table className="w-full min-w-[56rem] border-collapse text-sm">
          <caption className="sr-only">Enquiry records</caption>
          <thead>
            <tr className="border-b border-hairline bg-graphite/70 text-left font-display text-[0.6rem] uppercase tracking-[0.2em] text-muted">
              <th scope="col" className="px-4 py-3">Contact</th>
              <th scope="col" className="px-4 py-3">Enquiry</th>
              <th scope="col" className="px-4 py-3">Message</th>
              <th scope="col" className="px-4 py-3">Received</th>
              <th scope="col" className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {database.inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="border-b border-hairline last:border-b-0 align-top">
                <td className="px-4 py-4">
                  <p className="text-vapor">{inquiry.name}</p>
                  <p className="text-xs text-muted">{inquiry.email}</p>
                  {inquiry.phone && <p className="text-xs text-muted">{inquiry.phone}</p>}
                </td>
                <td className="px-4 py-4 text-ash">
                  <p>{inquiry.inquiry_type}</p>
                  {inquiry.property_label && <p className="text-xs text-muted">{inquiry.property_label}</p>}
                  {inquiry.purchase_timeline && <p className="text-xs text-muted">{inquiry.purchase_timeline}</p>}
                </td>
                <td className="max-w-[22rem] px-4 py-4 text-xs leading-relaxed text-ash">
                  {inquiry.message || '—'}
                </td>
                <td className="px-4 py-4 text-xs text-muted">{formatDate(inquiry.created_at)}</td>
                <td className="px-4 py-4">
                  <label className="sr-only" htmlFor={`status-${inquiry.id}`}>
                    Status for {inquiry.name}
                  </label>
                  <select
                    id={`status-${inquiry.id}`}
                    value={inquiry.status}
                    disabled={busyId === inquiry.id}
                    onChange={(event) => handleStatus(inquiry.id, event.target.value as InquiryStatus)}
                    className="min-h-10 rounded-xl border border-hairline bg-graphite/80 px-3 text-xs text-vapor focus:border-gold/60 focus:outline-none"
                  >
                    {INQUIRY_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
