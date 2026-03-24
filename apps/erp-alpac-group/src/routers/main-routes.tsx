import { AuthGuard, PublicGuard } from "./guardians";
import { LoginPage } from "@app/modules/auth/ui/pages/login/login.page";
import { ContainerCopyright } from "@app/shared/layouts/container-copyright/container-copyright";
import { Navigate, type RouteObject } from "react-router-dom";
import { DashboardRoutes } from "./dashboard-routes";

export const MainRoutes: RouteObject[] = [
   {
      path: "/",
      element: <Navigate to="/auth" replace />,
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
            element: <ContainerCopyright />,
            children: [
               {
                  index: true, 
                  element: <Navigate to="dashboard" replace />
               },
               {
                  path: "dashboard",
                  children: DashboardRoutes
               }
            ]
         }
      ]
   },
   {
      path: "*",
      element: <Navigate to="/auth" replace />
   }
];
