import { LoginPage } from "@app/modules/auth/login/ui/LoginPage";
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
            element: <LoginPage />,
         },
         {
            path: "dashboard",
            element: <Dashboard />,
         },
      ],
   },
];