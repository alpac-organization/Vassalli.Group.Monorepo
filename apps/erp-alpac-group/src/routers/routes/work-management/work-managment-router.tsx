import type { RouteObject } from "react-router-dom";
import { CollaboratorProfilePage } from "@app/modules/payroll/ui/pages/collaborator-profile/collaborator-profile-page";
import PermissionsPage from "@app/modules/payroll/ui/pages/permissions/permission-page";

export const WorkManagementRouter: RouteObject[] = [  
  {
    path: "collaborator-profile",
    element: <CollaboratorProfilePage />,
  },
  {
    path: "gestion-permisos",
    element: <PermissionsPage />,
  },
];
