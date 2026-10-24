import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';

/**
 * Minimal history-API router (no external dependency).
 * The dev server serves index.html for unknown paths, so deep links work.
 */

type Location = { pathname: string; search: string; hash: string };

type NavigateOptions = { replace?: boolean; keepScroll?: boolean };

type RouterValue = {
  pathname: string;
  search: string;
  params: Record<string, string>;
  navigate: (to: string, options?: NavigateOptions) => void;
  query: URLSearchParams;
  setQuery: (next: Record<string, string | number | undefined>, options?: NavigateOptions) => void;
};

const RouterContext = createContext<RouterValue | null>(null);

function readLocation(): Location {
  if (typeof window === 'undefined') return { pathname: '/', search: '', hash: '' };
  return {
    pathname: window.location.pathname || '/',
    search: window.location.search || '',
    hash: window.location.hash || '',
  };
}

export function RouterProvider({
  children,
  params,
}: {
  children: ReactNode;
  params?: Record<string, string>;
}) {
  const [location, setLocation] = useState<Location>(readLocation);

  useEffect(() => {
    const onPopState = () => setLocation(readLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to: string, options?: NavigateOptions) => {
    const url = new URL(to, window.location.origin);
    const same =
      url.pathname === window.location.pathname &&
      url.search === window.location.search &&
      url.hash === window.location.hash;

    if (!same) {
      if (options?.replace) {
        window.history.replaceState({}, '', url.toString());
      } else {
        window.history.pushState({}, '', url.toString());
      }
      setLocation(readLocation());
    }

    if (url.hash && !options?.keepScroll) {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(url.hash.slice(1));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }
    if (!options?.keepScroll && !same) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  const value = useMemo<RouterValue>(() => {
    const query = new URLSearchParams(location.search);
    return {
      pathname: location.pathname,
      search: location.search,
      params: params ?? {},
      navigate,
      query,
      setQuery: (next, options) => {
        const merged = new URLSearchParams(location.search);
        Object.entries(next).forEach(([key, raw]) => {
          if (raw === undefined || raw === '' || raw === null) merged.delete(key);
          else merged.set(key, String(raw));
        });
        const search = merged.toString();
        navigate(`${location.pathname}${search ? `?${search}` : ''}`, options);
      },
    };
  }, [location.pathname, location.search, navigate, params]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterValue {
  const value = useContext(RouterContext);
  if (!value) throw new Error('useRouter must be used inside <RouterProvider>');
  return value;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/** Internal navigation link — renders a real <a href> so it is focusable, copyable and openable in a new tab. */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      rest.target === '_blank'
    ) {
      return;
    }
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

/** Matches `/property/:slug` style patterns against a pathname. */
export function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const patternPart = patternParts[index];
    const pathPart = pathParts[index];
    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = decodeURIComponent(pathPart);
    } else if (patternPart !== pathPart) {
      return null;
    }
  }
  return params;
}
