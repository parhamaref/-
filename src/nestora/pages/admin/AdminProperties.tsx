import { useState } from 'react';
import { useDatabase } from '../../data/hooks';
import { Button, Field, inputClass } from '../../components/ui';
import { Modal } from '../../components/Modal';
import { deleteProperty, saveProperty, setPropertyFlags, type PropertyInput } from '../../data/api';
import { LISTING_STATUSES, PROPERTY_TYPES, type Property } from '../../data/types';
import { cx, formatDate, formatPrice, slugify } from '../../lib/format';
import { EditIcon, PlusIcon, StarIcon, TrashIcon } from '../../components/Icons';

interface PropertyFormProps {
  property: Property | null;
  agentOptions: Array<{ value: string; label: string }>;
  onClose: () => void;
  onSubmit: (values: PropertyInput) => Promise<void>;
}

export function PropertyFormModal({ property, agentOptions, onClose, onSubmit }: PropertyFormProps) {
  const [values, setValues] = useState<PropertyInput>(() => ({
    id: property?.id,
    title: property?.title ?? '',
    description: property?.description ?? '',
    property_type: property?.property_type ?? 'Luxury Villa',
    listing_status: property?.listing_status ?? 'for-sale',
    price: property?.price ?? 1_000_000,
    location_name: property?.location_name ?? '',
    city: property?.city ?? '',
    region: property?.region ?? '',
    country: property?.country ?? '',
    address: property?.address ?? '',
    bedrooms: property?.bedrooms ?? 4,
    bathrooms: property?.bathrooms ?? 3,
    area_sqft: property?.area_sqft ?? 3_000,
    lot_area_sqft: property?.lot_area_sqft ?? null,
    year_built: property?.year_built ?? null,
    featured: property?.featured ?? false,
    published: property?.published ?? true,
    main_image: property?.main_image ?? '',
    gallery_images: property?.gallery_images ?? [],
    amenities: property?.amenities ?? [],
    features: property?.features ?? [],
    agent_id: property?.agent_id ?? null,
    slug: property?.slug,
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (patch: Partial<PropertyInput>) => setValues((current) => ({ ...current, ...patch }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!values.title.trim()) {
      setError('A property title is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit(values);
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'The property could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      wide
      title={property ? `Edit ${property.title}` : 'New property'}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="property-form" disabled={saving}>
            {saving ? 'Saving…' : property ? 'Save changes' : 'Create property'}
          </Button>
        </>
      }
    >
      <form id="property-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2" noValidate>
        <div className="sm:col-span-2">
          <Field label="Title" required error={error || undefined}>
            {({ id, describedBy, invalid }) => (
              <input
                id={id}
                aria-describedby={describedBy}
                aria-invalid={invalid}
                value={values.title}
                onChange={(event) => {
                  const title = event.target.value;
                  set({ title, slug: property ? values.slug : slugify(title) });
                }}
                className={inputClass}
              />
            )}
          </Field>
        </div>

        <Field label="Slug" hint="Used in the property URL">
          {({ id }) => (
            <input
              id={id}
              value={values.slug ?? ''}
              onChange={(event) => set({ slug: slugify(event.target.value) })}
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Price (USD)" required>
          {({ id }) => (
            <input
              id={id}
              type="number"
              min={0}
              step={10_000}
              value={values.price}
              onChange={(event) => set({ price: Number(event.target.value) })}
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Property type">
          {({ id }) => (
            <select
              id={id}
              value={values.property_type}
              onChange={(event) => set({ property_type: event.target.value as Property['property_type'] })}
              className={inputClass}
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label="Listing status">
          {({ id }) => (
            <select
              id={id}
              value={values.listing_status}
              onChange={(event) => set({ listing_status: event.target.value as Property['listing_status'] })}
              className={inputClass}
            >
              {LISTING_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status === 'for-sale' ? 'For sale' : 'For rent'}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label="Location name" required>
          {({ id }) => (
            <input
              id={id}
              value={values.location_name}
              onChange={(event) => set({ location_name: event.target.value })}
              className={inputClass}
            />
          )}
        </Field>

        <Field label="City">
          {({ id }) => (
            <input id={id} value={values.city} onChange={(event) => set({ city: event.target.value })} className={inputClass} />
          )}
        </Field>

        <Field label="Region / state">
          {({ id }) => (
            <input
              id={id}
              value={values.region}
              onChange={(event) => set({ region: event.target.value })}
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Country">
          {({ id }) => (
            <input
              id={id}
              value={values.country}
              onChange={(event) => set({ country: event.target.value })}
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Private address" hint="Not shown publicly">
          {({ id }) => (
            <input
              id={id}
              value={values.address}
              onChange={(event) => set({ address: event.target.value })}
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Bedrooms">
          {({ id }) => (
            <input
              id={id}
              type="number"
              min={0}
              value={values.bedrooms}
              onChange={(event) => set({ bedrooms: Number(event.target.value) })}
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Bathrooms">
          {({ id }) => (
            <input
              id={id}
              type="number"
              min={0}
              value={values.bathrooms}
              onChange={(event) => set({ bathrooms: Number(event.target.value) })}
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Floor area (sq ft)">
          {({ id }) => (
            <input
              id={id}
              type="number"
              min={0}
              step={50}
              value={values.area_sqft}
              onChange={(event) => set({ area_sqft: Number(event.target.value) })}
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Lot area (sq ft)">
          {({ id }) => (
            <input
              id={id}
              type="number"
              min={0}
              step={50}
              value={values.lot_area_sqft ?? ''}
              onChange={(event) => set({ lot_area_sqft: event.target.value ? Number(event.target.value) : null })}
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Year built">
          {({ id }) => (
            <input
              id={id}
              type="number"
              min={1500}
              max={2100}
              value={values.year_built ?? ''}
              onChange={(event) => set({ year_built: event.target.value ? Number(event.target.value) : null })}
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Assigned advisor">
          {({ id }) => (
            <select
              id={id}
              value={values.agent_id ?? ''}
              onChange={(event) => set({ agent_id: event.target.value || null })}
              className={inputClass}
            >
              <option value="">Unassigned</option>
              {agentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </Field>

        <div className="sm:col-span-2">
          <Field label="Main image URL" required>
            {({ id }) => (
              <input
                id={id}
                value={values.main_image}
                onChange={(event) => set({ main_image: event.target.value })}
                className={inputClass}
              />
            )}
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Gallery image URLs" hint="One URL per line">
            {({ id }) => (
              <textarea
                id={id}
                rows={3}
                value={values.gallery_images.join('\n')}
                onChange={(event) =>
                  set({
                    gallery_images: event.target.value
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean),
                  })
                }
                className={inputClass}
              />
            )}
          </Field>
        </div>

        <Field label="Amenities" hint="Comma separated">
          {({ id }) => (
            <input
              id={id}
              value={values.amenities.join(', ')}
              onChange={(event) =>
                set({ amenities: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })
              }
              className={inputClass}
            />
          )}
        </Field>

        <Field label="Key features" hint="Comma separated">
          {({ id }) => (
            <input
              id={id}
              value={values.features.join(', ')}
              onChange={(event) =>
                set({ features: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })
              }
              className={inputClass}
            />
          )}
        </Field>

        <div className="sm:col-span-2">
          <Field label="Description" required>
            {({ id }) => (
              <textarea
                id={id}
                rows={5}
                value={values.description}
                onChange={(event) => set({ description: event.target.value })}
                className={inputClass}
              />
            )}
          </Field>
        </div>

        <label className="flex items-center gap-3 text-sm text-ash">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(event) => set({ published: event.target.checked })}
            className="h-4 w-4 accent-[color:var(--color-gold)]"
          />
          Published
        </label>
        <label className="flex items-center gap-3 text-sm text-ash">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(event) => set({ featured: event.target.checked })}
            className="h-4 w-4 accent-[color:var(--color-gold)]"
          />
          Featured on the homepage
        </label>
      </form>
    </Modal>
  );
}

export function AdminProperties() {
  const database = useDatabase();
  const [editing, setEditing] = useState<Property | null>(null);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState('');
  const agentOptions = database.agents.map((agent) => ({ value: agent.id, label: agent.name }));

  const handleDelete = async (property: Property) => {
    if (!window.confirm(`Delete “${property.title}”? This removes it from listings and from saved properties.`)) return;
    setBusyId(property.id);
    await deleteProperty(property.id);
    setBusyId('');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-vapor">
          Properties ({database.properties.length})
        </h2>
        <Button onClick={() => setCreating(true)}>
          <PlusIcon className="h-4 w-4" />
          New property
        </Button>
      </div>

      <p className="rounded-2xl border border-hairline bg-graphite/50 p-4 text-xs text-muted">
        Sample records supplied with the application. Unpublished properties never appear on the public site.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-hairline">
        <table className="w-full min-w-[54rem] border-collapse text-sm">
          <caption className="sr-only">Property records</caption>
          <thead>
            <tr className="border-b border-hairline bg-graphite/70 text-left font-display text-[0.6rem] uppercase tracking-[0.2em] text-muted">
              <th scope="col" className="px-4 py-3">Property</th>
              <th scope="col" className="px-4 py-3">Location</th>
              <th scope="col" className="px-4 py-3">Price</th>
              <th scope="col" className="px-4 py-3">State</th>
              <th scope="col" className="px-4 py-3">Updated</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {database.properties.map((property) => (
              <tr key={property.id} className="border-b border-hairline last:border-b-0">
                <td className="px-4 py-4">
                  <p className="text-vapor">{property.title}</p>
                  <p className="text-xs text-muted">
                    {property.property_type} · {property.bedrooms} bd · {property.bathrooms} ba
                  </p>
                </td>
                <td className="px-4 py-4 text-ash">{property.location_name}</td>
                <td className="px-4 py-4 text-gold">{formatPrice(property.price, property.currency)}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      aria-pressed={property.published}
                      onClick={() => setPropertyFlags(property.id, { published: !property.published })}
                      className={cx(
                        'rounded-full border px-3 py-1 text-[0.66rem] uppercase tracking-[0.14em] transition-colors',
                        property.published
                          ? 'border-gold/40 text-gold'
                          : 'border-hairline text-muted hover:border-gold/40 hover:text-gold',
                      )}
                    >
                      {property.published ? 'Published' : 'Draft'}
                    </button>
                    <button
                      type="button"
                      aria-pressed={property.featured}
                      aria-label={property.featured ? 'Remove from featured' : 'Mark as featured'}
                      onClick={() => setPropertyFlags(property.id, { featured: !property.featured })}
                      className={cx(
                        'inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors',
                        property.featured ? 'border-gold/50 text-gold' : 'border-hairline text-muted hover:text-gold',
                      )}
                    >
                      <StarIcon filled={property.featured} className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4 text-xs text-muted">{formatDate(property.updated_at)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(property)}
                      aria-label={`Edit ${property.title}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ash transition-colors hover:border-gold/50 hover:text-gold"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(property)}
                      disabled={busyId === property.id}
                      aria-label={`Delete ${property.title}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ash transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <PropertyFormModal
          property={editing}
          agentOptions={agentOptions}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSubmit={async (values) => {
            await saveProperty(values, slugify);
          }}
        />
      )}
    </div>
  );
}
