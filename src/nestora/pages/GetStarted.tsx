import { useEffect, useState } from 'react';
import { createInquiry, listLocations, validateInquiry } from '../data/api';
import { CONTACT_METHODS, PRICE_MAX, PRICE_MIN, PROPERTY_TYPES, TIMELINE_OPTIONS } from '../data/types';
import { usePageMeta } from '../data/hooks';
import { cx, formatPriceLabel } from '../lib/format';
import { Link } from '../router';
import { Layout } from '../components/Layout';
import { PriceRangeSlider } from '../components/PriceRangeSlider';
import { Button, Field, LinkButton, SectionHeading, inputClass } from '../components/ui';
import { CheckIcon } from '../components/Icons';

const STEP_TITLES = ['About you', 'Your search', 'Timeline'];

export function GetStarted() {
  const [step, setStep] = useState(0);
  const [locations, setLocations] = useState<string[]>([]);
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_contact: 'Email' as (typeof CONTACT_METHODS)[number],
    preferred_location: '',
    property_type: 'All Properties',
    budget_min: PRICE_MIN,
    budget_max: PRICE_MAX,
    purchase_timeline: TIMELINE_OPTIONS[2] as string,
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  usePageMeta({
    title: 'Get started — Nestora Homes consultation',
    description:
      'Request a private consultation: tell Nestora Homes what you are looking for and an advisor will prepare a short list.',
  });

  useEffect(() => {
    let active = true;
    listLocations().then((value) => {
      if (active) setLocations(value);
    });
    return () => {
      active = false;
    };
  }, []);

  const set = (patch: Partial<typeof values>) => setValues((current) => ({ ...current, ...patch }));

  const validateStep = (index: number) => {
    const all = validateInquiry({
      name: values.name,
      email: values.email,
      phone: values.phone,
      inquiry_type: 'Consultation request',
      budget_min: values.budget_min,
      budget_max: values.budget_max,
    });
    if (index === 0) {
      const stepErrors: Record<string, string> = {};
      if (all.name) stepErrors.name = all.name;
      if (all.email) stepErrors.email = all.email;
      if (all.phone) stepErrors.phone = all.phone;
      setErrors(stepErrors);
      return Object.keys(stepErrors).length === 0;
    }
    setErrors({});
    return true;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(current + 1, STEP_TITLES.length - 1));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateStep(2)) return;
    setStatus('submitting');
    setFormError('');
    try {
      await createInquiry({
        name: values.name,
        email: values.email,
        phone: values.phone,
        inquiry_type: 'Consultation request',
        preferred_location: values.preferred_location,
        property_type: values.property_type === 'All Properties' ? '' : values.property_type,
        budget_min: values.budget_min,
        budget_max: values.budget_max,
        purchase_timeline: values.purchase_timeline,
        preferred_contact: values.preferred_contact,
        message: values.message,
      });
      setStatus('success');
    } catch (error) {
      const fieldErrors = (error as { fields?: Record<string, string> }).fields;
      if (fieldErrors) setErrors(fieldErrors);
      setFormError(error instanceof Error ? error.message : 'Your request could not be submitted. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <Layout>
        <div className="nestora-container flex max-w-3xl flex-col gap-6 py-24">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
            <CheckIcon className="h-6 w-6" />
          </span>
          <SectionHeading as="h1" align="left" title="Consultation request received" />
          <p className="text-sm leading-relaxed text-ash">
            Thank you, {values.name.split(' ')[0]}. An advisor will contact you by{' '}
            {values.preferred_contact.toLowerCase()} with a short list
            {values.preferred_location ? ` in ${values.preferred_location}` : ''} between{' '}
            {formatPriceLabel(values.budget_min)} and {formatPriceLabel(values.budget_max)}.
          </p>
          <p className="text-xs text-muted">
            Your request is held in this environment&apos;s local record store and is visible in the content console
            under Inquiries.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <LinkButton to="/listings">Browse listings</LinkButton>
            <Link
              to="/"
              className="inline-flex min-h-11 items-center font-display text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ash transition-colors hover:text-gold"
            >
              Back home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="nestora-container grid grid-cols-1 gap-14 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-20">
        <div className="flex flex-col gap-6">
          <SectionHeading
            as="h1"
            align="left"
            title="Get Started"
            description="A short conversation is usually enough for us to narrow the collection down to a handful of residences."
          />
          <ol className="flex flex-col gap-4 pt-4">
            {STEP_TITLES.map((title, index) => (
              <li
                key={title}
                aria-current={index === step ? 'step' : undefined}
                className={cx(
                  'flex items-center gap-4 border-l pl-4 py-1',
                  index === step ? 'border-gold' : 'border-hairline',
                )}
              >
                <span
                  className={cx(
                    'font-display text-[0.7rem] uppercase tracking-[0.2em]',
                    index === step ? 'text-gold' : index < step ? 'text-ash' : 'text-muted',
                  )}
                >
                  0{index + 1}
                </span>
                <span className={cx('text-sm', index === step ? 'text-vapor' : 'text-ash')}>{title}</span>
              </li>
            ))}
          </ol>
          <p className="rounded-2xl border border-hairline bg-graphite/50 p-5 text-xs leading-relaxed text-muted">
            We only ask for what we need. Nothing is shared with third parties, and no marketing list is involved.
          </p>
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-hairline bg-card/60 p-6 sm:p-8" noValidate>
          <fieldset className="flex flex-col gap-6">
            <legend className="font-display text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-vapor">
              Step {step + 1} of {STEP_TITLES.length} — {STEP_TITLES[step]}
            </legend>

            {step === 0 && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Full name" required error={errors.name}>
                    {({ id, describedBy, invalid }) => (
                      <input
                        id={id}
                        aria-describedby={describedBy}
                        aria-invalid={invalid}
                        autoComplete="name"
                        value={values.name}
                        onChange={(event) => set({ name: event.target.value })}
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
                        autoComplete="email"
                        value={values.email}
                        onChange={(event) => set({ email: event.target.value })}
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
                        autoComplete="tel"
                        value={values.phone}
                        onChange={(event) => set({ phone: event.target.value })}
                        className={inputClass}
                      />
                    )}
                  </Field>
                </div>

                <fieldset className="flex flex-col gap-3">
                  <legend className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ash">
                    Preferred contact method
                  </legend>
                  <div className="flex flex-wrap gap-3">
                    {CONTACT_METHODS.map((method) => (
                      <label
                        key={method}
                        className={cx(
                          'inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-sm transition-colors',
                          values.preferred_contact === method
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-hairline text-ash hover:border-gold/40',
                        )}
                      >
                        <input
                          type="radio"
                          name="preferred_contact"
                          value={method}
                          checked={values.preferred_contact === method}
                          onChange={() => set({ preferred_contact: method })}
                          className="sr-only"
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Preferred location">
                    {({ id }) => (
                      <select
                        id={id}
                        value={values.preferred_location}
                        onChange={(event) => set({ preferred_location: event.target.value })}
                        className={inputClass}
                      >
                        <option value="">Any location</option>
                        {locations.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                  <Field label="Property type">
                    {({ id }) => (
                      <select
                        id={id}
                        value={values.property_type}
                        onChange={(event) => set({ property_type: event.target.value })}
                        className={inputClass}
                      >
                        <option value="All Properties">All properties</option>
                        {PROPERTY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-hairline bg-graphite/50 p-5">
                  <p className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ash">
                    Budget range
                  </p>
                  <PriceRangeSlider
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    valueMin={values.budget_min}
                    valueMax={values.budget_max}
                    onChange={(budget_min, budget_max) => set({ budget_min, budget_max })}
                  />
                  {errors.budget_max && <p className="text-xs text-gold-light">{errors.budget_max}</p>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-5">
                <Field label="Purchase timeline">
                  {({ id }) => (
                    <select
                      id={id}
                      value={values.purchase_timeline}
                      onChange={(event) => set({ purchase_timeline: event.target.value })}
                      className={inputClass}
                    >
                      {TIMELINE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
                <Field label="Anything else we should know" hint="Optional">
                  {({ id }) => (
                    <textarea
                      id={id}
                      rows={4}
                      value={values.message}
                      onChange={(event) => set({ message: event.target.value })}
                      className={inputClass}
                    />
                  )}
                </Field>
              </div>
            )}

            {formError && status === 'error' && (
              <p role="alert" className="text-sm text-gold-light">
                {formError}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              {step > 0 && (
                <Button type="button" variant="ghost" onClick={() => setStep((current) => current - 1)}>
                  Back
                </Button>
              )}
              {step < STEP_TITLES.length - 1 ? (
                <Button type="button" onClick={next}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" size="lg" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Submitting…' : 'Request consultation'}
                </Button>
              )}
            </div>
          </fieldset>
        </form>
      </div>
    </Layout>
  );
}
