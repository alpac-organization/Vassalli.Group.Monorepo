import { HomePage } from "@app/modules/dashboard/ui/pages/home/home.page";
import type { RouteObject } from "react-router-dom";

export const DashboardRoutes: RouteObject [] = [
    {
        index: true,
        element: <HomePage />,
    },
    {
      element:  <h2>Tu layout aqui</h2>,
      children: []
    }
] 