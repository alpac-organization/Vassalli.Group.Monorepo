import { LoginPage } from "@app/modules/auth/login/ui/login-page";
import { SelectCompany } from "@app/modules/auth/select-company/ui/select-company";
import Dashboard from "@app/modules/dashboard/DashboardComponent";
import { AuthGuard } from "@app/shared/guards/auth-guard";
import { CompanyGuard } from "@app/shared/guards/router-guard";
import type { RouteObject } from "react-router-dom";

// configuration of the routes from system
export const MainRoutes: RouteObject[] = [
   {
      path: "/",
      element: <SelectCompany />,
   },
   {
      path: ":company_id/",
      element: <CompanyGuard />,

      children: [
         {
            path: "auth",
            element: <LoginPage />,
         },
         {
            element: <AuthGuard />,
            children: [
               {
                  path: "dashboard",
                  element: <Dashboard />,
               }
            ]
         },
      ],
   },
];
