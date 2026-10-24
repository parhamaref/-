import { useState } from 'react';
import { createInquiry, queryProperties, type InquiryInput } from '../data/api';
import { INQUIRY_TYPES, type Inquiry, type InquiryType } from '../data/types';
import { useAsync } from '../data/hooks';
import { Button, Field, inputClass } from './ui';
import { CheckIcon } from './Icons';

interface InquiryFormProps {
  propertyId?: string | null;
  propertyLabel?: string;
  defaultInquiryType?: InquiryType;
  showPropertySelect?: boolean;
  submitLabel?: string;
  compact?: boolean;
}

/** Validated enquiry form. Success is only shown after the record has been written. */
export function InquiryForm({
  propertyId,
  propertyLabel,
  defaultInquiryType = 'General enquiry',
  showPropertySelect = false,
  submitLabel = 'Send enquiry',
  compact = false,
}: InquiryFormProps) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    inquiry_type: defaultInquiryType as InquiryType,
    property_id: propertyId ?? '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState<Inquiry | null>(null);

  const { data: properties } = useAsync(
    () => (showPropertySelect ? queryProperties({ perPage: 50 }) : Promise.resolve(null)),
    [showPropertySelect],
  );

  const set = (patch: Partial<typeof values>) => setValues((current) => ({ ...current, ...patch }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('submitting');
    setFormError('');
    setErrors({});

    const payload: InquiryInput = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      inquiry_type: values.inquiry_type,
      property_id: values.property_id || propertyId || null,
      message: values.message,
    };

    try {
      const inquiry = await createInquiry(payload);
      setSubmitted(inquiry);
      setStatus('success');
      setValues({
        name: '',
        email: '',
        phone: '',
        inquiry_type: defaultInquiryType,
        property_id: propertyId ?? '',
        message: '',
      });
    } catch (error) {
      const fieldErrors = (error as { fields?: Record<string, string> }).fields;
      if (fieldErrors) setErrors(fieldErrors);
      setFormError(error instanceof Error ? error.message : 'Your enquiry could not be sent. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success' && submitted) {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-3 rounded-2xl border border-gold/35 bg-gold/5 p-6 text-sm text-ash"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold">
          <CheckIcon className="h-5 w-5" />
        </span>
        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-vapor">
          Enquiry received
        </h3>
        <p>
          Thank you, {submitted.name.split(' ')[0]}. Your enquiry has been recorded and an advisor will follow up.
          {submitted.property_label ? ` Property: ${submitted.property_label}.` : ''}
        </p>
        <p className="text-xs text-muted">
          Stored in this environment&apos;s local record store — it appears immediately in the content console under
          Inquiries.
        </p>
        <Button variant="outline" onClick={() => setStatus('idle')}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {propertyLabel && (
        <p className="rounded-xl border border-hairline bg-elevated/40 px-4 py-3 text-xs text-ash">
          Enquiring about <span className="text-vapor">{propertyLabel}</span>
        </p>
      )}

      <div className={compact ? 'flex flex-col gap-5' : 'grid grid-cols-1 gap-5 sm:grid-cols-2'}>
        <Field label="Full name" required error={errors.name}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              value={values.name}
              onChange={(event) => set({ name: event.target.value })}
              autoComplete="name"
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Email" required error={errors.email}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              type="email"
              aria-describedby={describedBy}
              aria-invalid={invalid}
              value={values.email}
              onChange={(event) => set({ email: event.target.value })}
              autoComplete="email"
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Phone" error={errors.phone} hint="Optional">
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              type="tel"
              aria-describedby={describedBy}
              aria-invalid={invalid}
              value={values.phone}
              onChange={(event) => set({ phone: event.target.value })}
              autoComplete="tel"
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Enquiry type" required>
          {({ id }) => (
            <select
              id={id}
              value={values.inquiry_type}
              onChange={(event) => set({ inquiry_type: event.target.value as InquiryType })}
              className={inputClass}
            >
              {INQUIRY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      {showPropertySelect && properties && (
        <Field label="Property reference" hint="Optional">
          {({ id }) => (
            <select
              id={id}
              value={values.property_id}
              onChange={(event) => set({ property_id: event.target.value })}
              className={inputClass}
            >
              <option value="">No specific property</option>
              {properties.items.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.title} — {property.location_name}
                </option>
              ))}
            </select>
          )}
        </Field>
      )}

      <Field label="Message" required error={errors.message}>
        {({ id, describedBy, invalid }) => (
          <textarea
            id={id}
            rows={compact ? 3 : 5}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            value={values.message}
            onChange={(event) => set({ message: event.target.value })}
            className={inputClass}
          />
        )}
      </Field>

      {formError && status === 'error' && (
        <p role="alert" className="text-sm text-gold-light">
          {formError}
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === 'submitting'} className="self-start">
        {status === 'submitting' ? 'Sending…' : submitLabel}
      </Button>
    </form>
  );
}
