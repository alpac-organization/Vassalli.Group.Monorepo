import type { RouteObject } from "react-router-dom";
import { HomePage } from "@app/modules/dashboard/ui/pages/home/home.page";
import { ContainerCopyright } from "@app/shared/layouts/container-copyright/container-copyright";
import { DashboardLayout } from "@app/shared/layouts/dashboard-layout/dashboard-layout";
import { PayrollRoutes } from "@app/routers/payroll-routes";
import { WorkManagementRoutes } from "@app/routers/work-management-routes";
import { ApplicationRoutes } from "./application-routes";

//Llamar su store de secciones aqui

export const DashboardRoutes: RouteObject[] = [
   {
      element: <ContainerCopyright />,
      children: [
         {
            index: true,
            element: <HomePage />,
         },
      ],
   },
   {
      element: <DashboardLayout />,
      children: [
         {
            path: "payroll",
            children: PayrollRoutes,
         },
         {
            path: "work-management",
            children: WorkManagementRoutes,
         },
         {
            path: "applications",
            children: ApplicationRoutes,
         },
      ],
   },
];
