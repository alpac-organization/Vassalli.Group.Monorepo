import type { RouteObject } from "react-router-dom";
import { CollaboratorPage } from "@app/modules/payroll/ui/pages/collaborator-index/collaborator.page";
import { CollaboratorProfilePage } from "@app/modules/payroll/ui/pages/collaborator-profile/collaborator-profile-page";
import ControlVacationsPage from "@app/modules/payroll/ui/pages/control-vacations/control-vacations";
import { PayrollPage } from "@app/modules/payroll/ui/pages/nomina/payroll-page";
export const PayrollRoutes: RouteObject[] = [
  {
    index: true,
    element: <CollaboratorPage />,
  },
  {
    path: "collaborators",
    element: <CollaboratorPage />,
    children: [
      {
        // path: ":identification_number/collaborator-profile",
        path: "collaborator-profile",
        element: <CollaboratorProfilePage />,
      },
    ],
  },
  {
    path: "control-vacations",
    element: <ControlVacationsPage />,
  },
  {
    path: "gestion-nomina",
    element: <PayrollPage />,
  },
];
