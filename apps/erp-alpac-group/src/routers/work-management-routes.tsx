import type { RouteObject } from "react-router-dom";
import { CollaboratorProfilePage } from "@app/modules/payroll/ui/pages/collaborator-profile/collaborator-profile-page";
import VacationPage from "@app/modules/vacations/ui/pages/vacation-index/permission-page";
export const WorkManagementRoutes: RouteObject[] = [
  {
    index: true,
    element: <CollaboratorProfilePage />,
  },
  {
    path: "collaborator-profile",
    element: <CollaboratorProfilePage />,
  },
  {
    path: "gestion-vacations",
    element: <VacationPage />,
  },
];
