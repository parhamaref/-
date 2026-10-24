import { useState } from 'react';
import { useDatabase } from '../../data/hooks';
import { Button, Field, inputClass } from '../../components/ui';
import { Modal } from '../../components/Modal';
import { deleteAgent, saveAgent, type AgentInput } from '../../data/api';
import type { Agent } from '../../data/types';
import { slugify } from '../../lib/format';
import { EditIcon, PlusIcon, TrashIcon } from '../../components/Icons';

function AgentFormModal({
  agent,
  onClose,
  onSubmit,
}: {
  agent: Agent | null;
  onClose: () => void;
  onSubmit: (values: AgentInput) => Promise<void>;
}) {
  const [values, setValues] = useState<AgentInput>(() => ({
    id: agent?.id,
    name: agent?.name ?? '',
    role: agent?.role ?? '',
    email: agent?.email ?? '',
    phone: agent?.phone ?? '',
    profile_image: agent?.profile_image ?? '',
    biography: agent?.biography ?? '',
    specialties: agent?.specialties ?? [],
    service_areas: agent?.service_areas ?? [],
    published: agent?.published ?? true,
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (patch: Partial<AgentInput>) => setValues((current) => ({ ...current, ...patch }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!values.name.trim()) {
      setError('A name is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit(values);
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'The advisor could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={agent ? `Edit ${agent.name}` : 'New advisor'}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="agent-form" disabled={saving}>
            {saving ? 'Saving…' : 'Save advisor'}
          </Button>
        </>
      }
    >
      <form id="agent-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2" noValidate>
        <Field label="Name" required error={error || undefined}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              value={values.name}
              onChange={(event) => set({ name: event.target.value })}
              className={inputClass}
            />
          )}
        </Field>
        <Field label="Role">
          {({ id }) => (
            <input id={id} value={values.role} onChange={(event) => set({ role: event.target.value })} className={inputClass} />
          )}
        </Field>
        <Field label="Email">
          {({ id }) => (
            <input
              id={id}
              type="email"
              value={values.email}
              onChange={(event) => set({ email: event.target.value })}
              className={inputClass}
            />
          )}
        </Field>
        <Field label="Phone">
          {({ id }) => (
            <input id={id} value={values.phone} onChange={(event) => set({ phone: event.target.value })} className={inputClass} />
          )}
        </Field>
        <div className="sm:col-span-2">
          <Field label="Profile image URL">
            {({ id }) => (
              <input
                id={id}
                value={values.profile_image}
                onChange={(event) => set({ profile_image: event.target.value })}
                className={inputClass}
              />
            )}
          </Field>
        </div>
        <Field label="Specialities" hint="Comma separated">
          {({ id }) => (
            <input
              id={id}
              value={values.specialties.join(', ')}
              onChange={(event) =>
                set({ specialties: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })
              }
              className={inputClass}
            />
          )}
        </Field>
        <Field label="Service areas" hint="Comma separated">
          {({ id }) => (
            <input
              id={id}
              value={values.service_areas.join(', ')}
              onChange={(event) =>
                set({ service_areas: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })
              }
              className={inputClass}
            />
          )}
        </Field>
        <div className="sm:col-span-2">
          <Field label="Biography">
            {({ id }) => (
              <textarea
                id={id}
                rows={4}
                value={values.biography}
                onChange={(event) => set({ biography: event.target.value })}
                className={inputClass}
              />
            )}
          </Field>
        </div>
        <label className="flex items-center gap-3 text-sm text-ash sm:col-span-2">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(event) => set({ published: event.target.checked })}
            className="h-4 w-4 accent-[color:var(--color-gold)]"
          />
          Published on the site
        </label>
      </form>
    </Modal>
  );
}

export function AdminAgents() {
  const database = useDatabase();
  const [editing, setEditing] = useState<Agent | null>(null);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState('');

  const handleDelete = async (agent: Agent) => {
    if (!window.confirm(`Delete ${agent.name}? Any properties assigned to them will become unassigned.`)) return;
    setBusyId(agent.id);
    await deleteAgent(agent.id);
    setBusyId('');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-vapor">
          Advisors ({database.agents.length})
        </h2>
        <Button onClick={() => setCreating(true)}>
          <PlusIcon className="h-4 w-4" />
          New advisor
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-hairline">
        <table className="w-full min-w-[46rem] border-collapse text-sm">
          <caption className="sr-only">Advisor records</caption>
          <thead>
            <tr className="border-b border-hairline bg-graphite/70 text-left font-display text-[0.6rem] uppercase tracking-[0.2em] text-muted">
              <th scope="col" className="px-4 py-3">Advisor</th>
              <th scope="col" className="px-4 py-3">Role</th>
              <th scope="col" className="px-4 py-3">Service areas</th>
              <th scope="col" className="px-4 py-3">Listings</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {database.agents.map((agent) => (
              <tr key={agent.id} className="border-b border-hairline last:border-b-0">
                <td className="px-4 py-4">
                  <p className="text-vapor">{agent.name}</p>
                  <p className="text-xs text-muted">{agent.email}</p>
                </td>
                <td className="px-4 py-4 text-ash">{agent.role}</td>
                <td className="px-4 py-4 text-xs text-muted">{agent.service_areas.join(', ') || '—'}</td>
                <td className="px-4 py-4 text-ash">
                  {database.properties.filter((property) => property.agent_id === agent.id).length}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(agent)}
                      aria-label={`Edit ${agent.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ash transition-colors hover:border-gold/50 hover:text-gold"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(agent)}
                      disabled={busyId === agent.id}
                      aria-label={`Delete ${agent.name}`}
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
        <AgentFormModal
          agent={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSubmit={async (values) => {
            await saveAgent(values, slugify);
          }}
        />
      )}
    </div>
  );
}
