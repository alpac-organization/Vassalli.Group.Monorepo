import type { SidebarLink } from "../components/Sidebar/types/sidebar.types";
import { useUserStore } from "@app/shared/stores/useUserStore";

const normalizePath = (path: string): string =>
   path.replace(/^\/+|\/+$/g, "");

export const getDashboardRelativePath = (pathname: string): string => {

   const segments = normalizePath(pathname).split("/").filter(Boolean);

   const companyAlias = useUserStore.getState().companyAlias?.toLowerCase() ?? "";

   const aliasIndex = segments.findIndex(
      (segment) => segment.toLowerCase() === companyAlias,
   );

   if (aliasIndex === -1) return normalizePath(pathname);

   return segments.slice(aliasIndex + 2).join("/");
};

export const matchesAuthorizedRoute = (pathname: string, link: SidebarLink): boolean => {

   const moduleBasePath = useUserStore.getState().moduleBasePath?.toLowerCase() ?? "";

   const current = normalizePath(getDashboardRelativePath(pathname));

   const authorized = normalizePath(moduleBasePath ? `${moduleBasePath}/${link.path}` : link.path);   

   if (!current || !authorized) return false;

   if (current === authorized) return true;

   return Boolean(link.allowsRubRoutes && current.startsWith(`${authorized}/`));
};

export const isRouteAuthorized = (pathname: string, authorizedItems: SidebarLink[]): boolean => {
   return authorizedItems.some((item) => matchesAuthorizedRoute(pathname, item));
}

