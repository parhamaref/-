import { seedDatabase } from './seed';
import type { Database } from './types';

/**
 * Persistence layer.
 *
 * This repository ships as a client-only Vite application: there is no server, no
 * database and no authenticated API. Nestora therefore keeps its records in a single
 * JSON document in the browser's localStorage and exposes them through the async
 * module in `api.ts`, which mirrors the shape a real backend would have (list, detail,
 * create, update, delete). Swapping the store for a server is a matter of replacing
 * the functions in `api.ts`.
 */

const STORAGE_KEY = 'nestora.db.v1';

const listeners = new Set<() => void>();

function isDatabase(value: unknown): value is Database {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Database>;
  return (
    candidate.version === 1 &&
    Array.isArray(candidate.properties) &&
    Array.isArray(candidate.agents) &&
    Array.isArray(candidate.inquiries) &&
    Array.isArray(candidate.favorites) &&
    Boolean(candidate.settings)
  );
}

function read(): Database {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (isDatabase(parsed)) return parsed;
    }
  } catch {
    // Corrupt or unavailable storage — fall back to a fresh seeded document.
  }
  const fresh = seedDatabase();
  persist(fresh);
  return fresh;
}

function persist(database: Database) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  } catch {
    // Storage disabled (private mode / quota) — the session stays in memory only.
  }
}

let current: Database = read();

export function getSnapshot(): Database {
  return current;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit() {
  listeners.forEach((listener) => listener());
}

/** Applies a change to the stored document and notifies subscribers. */
export function commit(updater: (database: Database) => Database) {
  current = updater(current);
  persist(current);
  emit();
}

export function resetDatabase() {
  current = seedDatabase();
  persist(current);
  emit();
}

export function createId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

/** Anonymous visitor id used for guest favourites (there is no account system here). */
export function getVisitorId(): string {
  const key = 'nestora.visitor.v1';
  try {
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const created = createId('visitor');
    window.localStorage.setItem(key, created);
    return created;
  } catch {
    return 'visitor-local';
  }
}
