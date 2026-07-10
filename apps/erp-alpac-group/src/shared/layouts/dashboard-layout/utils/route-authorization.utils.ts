import type { SidebarLink } from "../components/Sidebar/types/sidebar.types";

const normalizePath = (path: string): string =>
   path.replace(/^\/+|\/+$/g, "");

export const getDashboardRelativePath = (pathname: string): string => {

   const segments = normalizePath(pathname).split("/").filter(Boolean);

   const dashboardIndex = segments.indexOf("dashboard");

   if (dashboardIndex === -1) return normalizePath(pathname);

   return segments.slice(dashboardIndex + 1).join("/");
};

export const matchesAuthorizedRoute = (pathname: string, link: SidebarLink): boolean => {

   const current = normalizePath(getDashboardRelativePath(pathname));

   const authorized = normalizePath(link.path);

   if (!current || !authorized) return false;

   if (current === authorized) return true;

   return Boolean(link.allowsRubRoutes && current.startsWith(`${authorized}/`));
};

export const isRouteAuthorized = (pathname: string, authorizedItems: SidebarLink[]): boolean => {
   return authorizedItems.some((item) => matchesAuthorizedRoute(pathname, item));
}

