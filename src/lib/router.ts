import { useEffect, useState, useCallback } from 'react';

export interface RouteState {
  path: string;
  params: Record<string, string>;
  query: URLSearchParams;
}

function parseHash(): RouteState {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  const [path, queryString] = hash.split('?');
  const query = new URLSearchParams(queryString || '');
  return { path, params: {}, query };
}

export function useRouter() {
  const [route, setRoute] = useState<RouteState>(parseHash());

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
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
