import type { RouteObject } from "react-router-dom";
import { ErrorBoundary } from "./error-boundary";

export function withErrorElement(routes: RouteObject[]): RouteObject[] {
   return routes.map(route => {

      return {
         ...route,
         errorElement: route.errorElement ?? <ErrorBoundary />
      }
   });
}