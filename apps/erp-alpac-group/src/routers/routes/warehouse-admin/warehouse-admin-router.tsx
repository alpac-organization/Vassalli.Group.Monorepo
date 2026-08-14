import type { RouteObject } from "react-router-dom";
import { ManageSectionPage } from "@app/modules/warehouse/ui/warehouse-admin/pages/manage-section/manage-section.page";

export const WarehouseAdminRouter: RouteObject[] = [
  {
    path: "management",
    element: <ManageSectionPage />,
  },
];
