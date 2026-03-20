import { LoginPage } from "@app/modules/auth/login/ui/login-page";
import { SelectCompany } from "@app/modules/auth/select-company/ui/select-company";
import { Dashboard } from "@app/modules/dashboard/Dashboard";
import type { RouteObject } from "react-router-dom";

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
