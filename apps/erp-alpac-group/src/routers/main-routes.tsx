import { Login } from "@app/modules/auth/login/login";
import { SelectCompany } from "@app/modules/auth/select-company/select-company";
import { Dashboard } from "@app/modules/dashboard/dashboard";
import type { RouteObject } from "react-router-dom";

//Configuraciones de rutas del sistema.
export const MainRoutes: RouteObject[] = [
   {
      path: "/",
      element: <SelectCompany />,
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