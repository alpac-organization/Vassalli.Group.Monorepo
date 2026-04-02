import type { RouteObject } from "react-router-dom";
import { CollaboratorProfilePage } from "@app/modules/payroll/ui/pages/collaborator-profile/collaborator-profile-page";
export const WorkManagementRoutes: RouteObject[] = [
  {
    index: true,
    element: <CollaboratorProfilePage />,
  },
  {
    path: "collaborator-profile",
    element: <CollaboratorProfilePage />,
  },
];
