import { useState } from 'react';
import { useDatabase } from '../../data/hooks';
import { restoreDemoContent, saveSettings } from '../../data/api';
import type { SiteSettings } from '../../data/types';
import { Button, Field, inputClass } from '../../components/ui';

export function AdminSettings() {
  const { settings } = useDatabase();
  const [values, setValues] = useState<SiteSettings>(settings);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const set = (patch: Partial<SiteSettings>) => setValues((current) => ({ ...current, ...patch }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('saving');
    try {
      await saveSettings(values);
      setStatus('saved');
      setMessage('Settings saved.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Settings could not be saved.');
    }
  };

  const handleRestore = async () => {
    if (!window.confirm('Restore the demonstration properties, advisors and settings? Enquiries and saved properties are cleared.')) return;
    setStatus('saving');
    await restoreDemoContent();
    setValues(settings);
    setStatus('saved');
    setMessage('Demonstration content restored.');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <h2 className="font-display text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-vapor">
        Site settings
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Brand name">
          {({ id }) => (
            <input id={id} value={values.brand_name} onChange={(event) => set({ brand_name: event.target.value })} className={inputClass} />
          )}
        </Field>
        <Field label="Tagline">
          {({ id }) => (
            <input id={id} value={values.tagline} onChange={(event) => set({ tagline: event.target.value })} className={inputClass} />
          )}
        </Field>
        <Field label="Contact email" hint="Placeholder until a real address is configured">
          {({ id }) => (
            <input id={id} type="email" value={values.contact_email} onChange={(event) => set({ contact_email: event.target.value })} className={inputClass} />
          )}
        </Field>
        <Field label="Contact telephone" hint="Placeholder until a real number is configured">
          {({ id }) => (
            <input id={id} value={values.contact_phone} onChange={(event) => set({ contact_phone: event.target.value })} className={inputClass} />
          )}
        </Field>
        <Field label="Currency" hint="Display currency for prices">
          {({ id }) => (
            <select id={id} value={values.currency} onChange={(event) => set({ currency: event.target.value })} className={inputClass}>
              <option value="USD">USD — US dollar</option>
              <option value="GBP">GBP — pound sterling</option>
              <option value="EUR">EUR — euro</option>
            </select>
          )}
        </Field>
        <Field label="Facebook URL" hint="Leave empty to keep the footer icon inactive">
          {({ id }) => (
            <input id={id} value={values.social_facebook} onChange={(event) => set({ social_facebook: event.target.value })} className={inputClass} />
          )}
        </Field>
        <Field label="Instagram URL">
          {({ id }) => (
            <input id={id} value={values.social_instagram} onChange={(event) => set({ social_instagram: event.target.value })} className={inputClass} />
          )}
        </Field>
        <Field label="LinkedIn URL">
          {({ id }) => (
            <input id={id} value={values.social_linkedin} onChange={(event) => set({ social_linkedin: event.target.value })} className={inputClass} />
          )}
        </Field>
      </div>

      <fieldset className="flex flex-col gap-5">
        <legend className="font-display text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-ash">
          Imagery
        </legend>
        <Field label="Hero image URL">
          {({ id }) => (
            <input id={id} value={values.hero_image} onChange={(event) => set({ hero_image: event.target.value })} className={inputClass} />
          )}
        </Field>
        <Field label="Hero image description" hint="Used as the alternative text">
          {({ id }) => (
            <input id={id} value={values.hero_image_alt} onChange={(event) => set({ hero_image_alt: event.target.value })} className={inputClass} />
          )}
        </Field>
        <Field label="Portfolio banner image URL">
          {({ id }) => (
            <input id={id} value={values.cta_image} onChange={(event) => set({ cta_image: event.target.value })} className={inputClass} />
          )}
        </Field>
        <Field label="Portfolio banner description">
          {({ id }) => (
            <input id={id} value={values.cta_image_alt} onChange={(event) => set({ cta_image_alt: event.target.value })} className={inputClass} />
          )}
        </Field>
        <Field label="About page image URL">
          {({ id }) => (
            <input id={id} value={values.about_image} onChange={(event) => set({ about_image: event.target.value })} className={inputClass} />
          )}
        </Field>
      </fieldset>

      {message && (
        <p role="status" className={status === 'error' ? 'text-sm text-gold-light' : 'text-sm text-ash'}>
          {message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Save settings'}
        </Button>
        <Button type="button" variant="ghost" onClick={handleRestore}>
          Restore demonstration content
        </Button>
      </div>
    </form>
  );
}
