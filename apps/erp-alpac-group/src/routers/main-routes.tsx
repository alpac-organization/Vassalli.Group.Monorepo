import { AuthGuard, PublicGuard } from "./guardians";
import { LoginPage } from "@app/modules/auth/ui/pages/login/login.page";

import type { RouteObject } from "react-router-dom";

export const MainRoutes: RouteObject[] = [
   {
      path: "/",
      element: <h3>HomePage o Loading</h3>,
   },
   {
      element: <PublicGuard />,
      children: [
         {
            path: "auth",
            element: <LoginPage />
         }
      ]
   },
   {
      path: ":alias_company",
      element: <AuthGuard />,
      children: [
         {
            path: "dashboard/"
         }
      ]
   }
];
