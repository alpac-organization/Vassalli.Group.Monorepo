import type { RouteObject } from "react-router-dom";
import { CollaboratorPage } from "@app/modules/payroll/ui/pages/collaborator-index/collaborator.page";
import { CollaboratorProfilePage } from "@app/modules/payroll/ui/pages/collaborator-profile/collaborator-profile-page";
export const PayrollRoutes: RouteObject[] = [
  {
    index: true,
    element: <CollaboratorPage />,
  },
  {
    path: "collaborators",
    element: <CollaboratorPage />,

    // children: [
    // ],
  },
  {
    path: "collaborator-profile",
    element: <CollaboratorProfilePage />,
  },
];
