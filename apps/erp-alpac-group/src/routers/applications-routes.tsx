import type { RouteObject } from "react-router-dom";
import { ApplicationsPage } from "@app/modules/applications/ui/pages/applications-index/applications.page";
import { ApplicationDetailPage } from "@app/modules/applications/ui/pages/application-detail/application-detail";

export const ApplicationRoutes: RouteObject[] = [
   {
      index: true,
      element: <ApplicationsPage />,
   },
   {
      path: "application-detail",
      element: <ApplicationDetailPage />,
   },
];
