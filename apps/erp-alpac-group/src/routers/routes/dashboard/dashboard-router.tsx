import { HomePage } from "@app/modules/dashboard/ui/pages/home/home.page";
import { ContainerCopyright } from "@app/shared/layouts/container-copyright/container-copyright";
import { DashboardLayout } from "@app/shared/layouts/dashboard-layout/dashboard-layout";
import type { RouteObject } from "react-router-dom";
import { PayrollRouter } from "@app/routers/routes/payroll/payroll-router";
import { WorkManagementRouter } from "@app/routers/routes/work-management/work-managment-router";
import { ApplicationRouter } from "@app/routers/routes/application/application-router";
import { WarehouseCorintoRouter } from "@app/routers/routes/warehouse/corinto/corinto-router";
import { WarehouseManaguaRouter } from "@app/routers/routes/warehouse/managua/managua-router";
import { AdminRouter } from "@app/routers/routes/admin/admin-router";
import { ProcurementRouter } from "@app/routers/routes/procurement/procurement-router";

export const DashboardRouter: RouteObject[] = [
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
        children: PayrollRouter,
      },
      {
        path: "work-management",
        children: WorkManagementRouter,
      },
      {
        path: "applications",
        children: ApplicationRouter,
      },
      {
        path: "warehouse-corinto",
        children: WarehouseCorintoRouter,
      },
      {
        path: "warehouse-mga",
        children: WarehouseManaguaRouter,
      },
      {
        path: "administration",
        children: AdminRouter,
      },
      {
        path: "procurement",
        children: ProcurementRouter,
      },
    ],
  },
];
