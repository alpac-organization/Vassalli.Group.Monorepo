import { HomePage } from "@app/modules/dashboard/ui/pages/home/home.page";
import { DashboardLayout } from "@app/shared/layouts";
import type { RouteObject } from "react-router-dom";
import { PayrollRoutes } from "./payroll-routes";
import { ContainerCopyright } from "@app/shared/layouts/container-copyright/container-copyright";

//Llamar su store de secciones aqui

export const DashboardRoutes: RouteObject[] = [
  {
    element: <ContainerCopyright />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ]
  },
  {
    path: "payroll",
    element: <DashboardLayout />,
    children: PayrollRoutes
  }
]