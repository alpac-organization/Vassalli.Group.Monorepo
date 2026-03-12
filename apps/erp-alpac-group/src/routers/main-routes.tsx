import { Dashboard } from "@alpac/modules/dashboard/dashboard";
import type { RouteObject } from "react-router-dom";

//Configuraciones de rutas del sistema.
export const MainRoutes: RouteObject[] = [
   {
      path: "/",
      element: <h2>Selecciona tu empresa (Catálogo)</h2>,
   },
   {
      path: ":company_id/",
      children: [
         {
            path: "auth",
            element: <h3>Componente de login para esta empresa</h3>,
         },
         {
            path:     "dashboard",
            element:  <Dashboard />,
         },
      ],
   },
];