import { useState } from 'react';
import { Link, useRouter } from '../../router';
import { useDatabase, usePageMeta } from '../../data/hooks';
import { Layout } from '../../components/Layout';
import { Button, Field, inputClass } from '../../components/ui';
import { cx } from '../../lib/format';
import { AdminDashboard } from './AdminDashboard';
import { AdminProperties } from './AdminProperties';
import { AdminAgents } from './AdminAgents';
import { AdminInquiries } from './AdminInquiries';
import { AdminSettings } from './AdminSettings';

export type AdminSection = 'dashboard' | 'properties' | 'agents' | 'inquiries' | 'settings';

/**
 * Development-only gate. This repository has no backend service, so there is no
 * server-side authorization to enforce — the passphrase keeps casual visitors out
 * of the console in this build and must be replaced by real authentication when a
 * backend is added.
 */
const ADMIN_PASSPHRASE = 'nestora-admin';
const SESSION_KEY = 'nestora.admin.session';

const SECTIONS: Array<{ id: AdminSection; label: string; to: string }> = [
  { id: 'dashboard', label: 'Dashboard', to: '/admin' },
  { id: 'properties', label: 'Properties', to: '/admin/properties' },
  { id: 'agents', label: 'Agents', to: '/admin/agents' },
  { id: 'inquiries', label: 'Inquiries', to: '/admin/inquiries' },
  { id: 'settings', label: 'Settings', to: '/admin/settings' },
];

export function Admin({ section }: { section: AdminSection }) {
  const { settings } = useDatabase();
  const { navigate } = useRouter();
  const [authorised, setAuthorised] = useState(() => {
    try {
      return window.sessionStorage.getItem(SESSION_KEY) === 'granted';
    } catch {
      return false;
    }
  });
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');

  usePageMeta({
    title: 'Content console — Nestora Homes',
    description: 'Administration console for the Nestora Homes demonstration application.',
    noindex: true,
  });

  const signIn = (event: React.FormEvent) => {
    event.preventDefault();
    if (passphrase.trim() === ADMIN_PASSPHRASE) {
      try {
        window.sessionStorage.setItem(SESSION_KEY, 'granted');
      } catch {
        // sessionStorage unavailable — the console stays open for this page view only
      }
      setAuthorised(true);
      setError('');
      return;
    }
    setError('That passphrase is not recognised.');
  };

  if (!authorised) {
    return (
      <Layout>
        <div className="nestora-container flex max-w-lg flex-col gap-6 py-24">
          <h1 className="font-display text-[1.5rem] font-semibold uppercase tracking-[0.08em] text-vapor">
            Content console
          </h1>
          <span className="gold-divider" aria-hidden="true" />
          <p className="text-sm text-ash">
            Restricted area. Records in this build are stored in the browser, so this gate is a convenience rather than
            real authorization — replace it with server-side authentication when a backend is connected.
          </p>
          <form onSubmit={signIn} className="flex flex-col gap-5">
            <Field label="Passphrase" error={error || undefined} hint="Development passphrase: nestora-admin">
              {({ id, describedBy, invalid }) => (
                <input
                  id={id}
                  type="password"
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  value={passphrase}
                  onChange={(event) => setPassphrase(event.target.value)}
                  className={inputClass}
                  autoComplete="off"
                />
              )}
            </Field>
            <Button type="submit" className="self-start">
              Enter console
            </Button>
          </form>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="nestora-container flex flex-col gap-8 py-14">
        <div className="flex flex-col gap-4 border-b border-hairline pb-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-[1.5rem] font-semibold uppercase tracking-[0.08em] text-vapor">
                {settings.brand_name} console
              </h1>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted">
                Sample records for review. All content is stored in this browser — no server, email or payment service
                is connected in this build.
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                try {
                  window.sessionStorage.removeItem(SESSION_KEY);
                } catch {
                  // ignore
                }
                navigate('/');
              }}
            >
              Exit console
            </Button>
          </div>

          <nav aria-label="Console sections">
            <ul className="flex flex-wrap items-center gap-2">
              {SECTIONS.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    aria-current={section === item.id ? 'page' : undefined}
                    className={cx(
                      'inline-flex min-h-10 items-center rounded-full border px-4 font-display text-[0.66rem] font-semibold uppercase tracking-[0.18em] transition-colors',
                      section === item.id
                        ? 'border-gold bg-gold/12 text-gold'
                        : 'border-hairline text-ash hover:border-gold/40 hover:text-gold',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {section === 'dashboard' && <AdminDashboard />}
        {section === 'properties' && <AdminProperties />}
        {section === 'agents' && <AdminAgents />}
        {section === 'inquiries' && <AdminInquiries />}
        {section === 'settings' && <AdminSettings />}
      </div>
    </Layout>
  );
}
