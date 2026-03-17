import { Login } from "@app/modules/auth/login/login";
import { Dashboard } from "@app/modules/dashboard/dashboard";
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
            element: <Login />,
         },
         {
            path: "dashboard",
            element: <Dashboard />,
         },
      ],
   },
];