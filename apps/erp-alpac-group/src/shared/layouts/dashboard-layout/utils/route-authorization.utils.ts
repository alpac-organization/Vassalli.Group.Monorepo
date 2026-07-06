const normalizePath = (path: string): string =>
   path.replace(/^\/+|\/+$/g, "");

/**
 * Extrae la ruta relativa a `dashboard` desde el pathname completo.
 * Ej: `/alpac/dashboard/warehouse-corinto/scale` → `warehouse-corinto/scale`
 */
export const getDashboardRelativePath = (pathname: string): string => {
   const segments = normalizePath(pathname).split("/").filter(Boolean);
   const dashboardIndex = segments.indexOf("dashboard");

   if (dashboardIndex === -1) return normalizePath(pathname);

   return segments.slice(dashboardIndex + 1).join("/");
};

/**
 * Comprueba si la ruta actual coincide exactamente con una ruta autorizada.
 * Evita falsos positivos de `includes` (ej. `warehouse` dentro de `warehouse-corinto`).
 */
export const matchesAuthorizedRoute = (
   pathname: string,
   authorizedPath: string,
): boolean => {
   const current = normalizePath(getDashboardRelativePath(pathname));
   const authorized = normalizePath(authorizedPath);

   return Boolean(current && authorized && current === authorized);
};

export const isRouteAuthorized = (
   pathname: string,
   authorizedPaths: string[],
): boolean =>
   authorizedPaths.some((path) => matchesAuthorizedRoute(pathname, path));
