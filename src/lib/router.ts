import { useEffect, useState, useCallback } from 'react';

export interface RouteState {
  path: string;
  params: Record<string, string>;
  query: URLSearchParams;
}

function parseLocation(): RouteState {
  let pathname = window.location.pathname || '/';
  let search = window.location.search || '';

  // Handle legacy hash URLs gracefully (e.g. /#/admin or /#/collection?category=Trucks)
  if (typeof window !== 'undefined' && window.location.hash && window.location.hash.startsWith('#/')) {
    const legacy = window.location.hash.replace(/^#/, '');
    const [legacyPath, legacySearch] = legacy.split('?');
    pathname = legacyPath || '/';
    search = legacySearch ? `?${legacySearch}` : search;
    try {
      window.history.replaceState(null, '', pathname + search);
    } catch (e) {}
  }

  // Normalize trailing slash (except root '/')
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  const query = new URLSearchParams(search);
  return { path: pathname, params: {}, query };
}

export function useRouter() {
  const [route, setRoute] = useState<RouteState>(() => parseLocation());

  useEffect(() => {
    const onLocationChange = () => setRoute(parseLocation());
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('biks:route_change', onLocationChange);

    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('biks:route_change', onLocationChange);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    const current = window.location.pathname + window.location.search;
    if (to !== current) {
      window.history.pushState(null, '', to);
      window.dispatchEvent(new Event('biks:route_change'));
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return { route, navigate };
}

export function matchRoute(path: string, pattern: string): Record<string, string> | null {
  const pathParts = path.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);
  if (pathParts.length !== patternParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}
