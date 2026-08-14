import type { RouteObject } from "react-router-dom";
import { ManageSectionPage } from "@app/modules/warehouse/ui/warehouse-admin/pages/manage-section/manage-section.page";
import { ManageSectionsPage } from "@app/modules/warehouse/ui/warehouse-admin/pages/manage-sections/manage-sections.page";
import { ManageLotsPage } from "@app/modules/warehouse/ui/warehouse-admin/pages/manage-lots/manage-lots.page";
import { ManageRacksPage } from "@app/modules/warehouse/ui/warehouse-admin/pages/manage-racks/manage-racks.page";

export const WarehouseAdminRouter: RouteObject[] = [
  {
    path: "management",
    element: <ManageSectionPage />,
  },
  {
    path: "management/sections/:warehouseId",
    element: <ManageSectionsPage />,
  },
  {
    path: "management/sections/:warehouseId/lots/:sectionId",
    element: <ManageLotsPage />,
  },
  {
    path: "management/sections/:warehouseId/racks/:sectionId",
    element: <ManageRacksPage />,
  },
];