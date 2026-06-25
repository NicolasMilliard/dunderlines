export const appRoutes = {
  home: {
    href: import.meta.env.BASE_URL,
  },
  credits: {
    href: `${import.meta.env.BASE_URL}credits`,
  },
} as const;

export type AppRouteId = keyof typeof appRoutes;

export function getRouteIdFromPathname(pathname: string): AppRouteId {
  const basePath = import.meta.env.BASE_URL;
  const routePath = pathname
    .replace(new RegExp(`^${escapeRegExp(basePath)}`), '')
    .replace(/^\/+/, '')
    .replace(/\/$/, '');

  return routePath === 'credits' ? 'credits' : 'home';
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
