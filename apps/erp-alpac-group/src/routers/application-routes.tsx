import type { RouteObject } from "react-router-dom";
import { ApplicationsPage } from "@app/modules/applications/ui/pages/applications-index/applications.page";
export const ApplicationRoutes: RouteObject[] = [
   {
      index: true,
      element: <ApplicationsPage />,
   },
];
