import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { getSnapshot, subscribe } from './store';
import { listFavoriteIds, toggleFavorite } from './api';
import type { Database } from './types';

/** Reactive read of the local record store. */
export function useDatabase(): Database {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Runs an async loader and tracks loading/error state, ignoring stale resolutions. */
export function useAsync<T>(loader: () => Promise<T>, deps: unknown[]): AsyncState<T> & { reload: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const [nonce, setNonce] = useState(0);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    let active = true;
    setState((previous) => ({ ...previous, loading: true, error: null }));
    loaderRef
      .current()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Something went wrong.',
          });
        }
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  return { ...state, reload: useCallback(() => setNonce((value) => value + 1), []) };
}

/** Guest favourites: stored against an anonymous visitor id (no account system here). */
export function useFavorites() {
  const database = useDatabase();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    listFavoriteIds().then((value) => {
      if (active) setIds(value);
    });
    return () => {
      active = false;
    };
  }, [database.favorites.length]);

  const savedSet = useMemo(() => new Set(ids), [ids]);

  const toggle = useCallback(async (propertyId: string) => {
    const result = await toggleFavorite(propertyId);
    setIds((current) =>
      result.saved ? [...current, propertyId] : current.filter((id) => id !== propertyId),
    );
    return result.saved;
  }, []);

  return { ids, savedSet, isSaved: (id: string) => savedSet.has(id), toggle, count: ids.length };
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export interface PageMeta {
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
}

/** Per-route document title, description, canonical URL and social metadata. */
export function usePageMeta({ title, description, image, noindex }: PageMeta) {
  useEffect(() => {
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    if (image) {
      upsertMeta('property', 'og:image', image);
    }

    const href = `${window.location.origin}${window.location.pathname}`;
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = href;
  }, [title, description, image, noindex]);
}

/** Adds/replaces a JSON-LD block (used for property structured data). */
export function useJsonLd(id: string, data: unknown | null) {
  useEffect(() => {
    const scriptId = `nestora-jsonld-${id}`;
    document.getElementById(scriptId)?.remove();
    if (!data) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [id, data]);
}

/** Reveal-on-scroll: returns a ref plus the class name to apply. */
export function useReveal<T extends HTMLElement>(options?: { threshold?: number }) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: options?.threshold ?? 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [options?.threshold]);

  return { ref, className: visible ? 'reveal-in' : 'reveal-init' };
}
