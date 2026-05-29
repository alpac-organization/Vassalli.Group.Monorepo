import ControlVacationsPage from "@app/modules/payroll/ui/pages/control-vacations/control-vacations";
import { CollaboratorPage } from "@app/modules/payroll/ui/pages/collaborator-index/collaborator.page";
import { CollaboratorProfilePage } from "@app/modules/payroll/ui/pages/collaborator-profile/collaborator-profile-page";
import { PayrollPage } from "@app/modules/payroll/ui/pages/nomina/payroll-page";
import { PayrollPeriodsHistoryPage } from "@app/modules/payroll/ui/pages/periods-payroll/Payroll-periods-history";
import { ApplicationsPage } from "@app/modules/applications/ui/pages/applications-index/applications.page";

import type { RouteObject } from "react-router-dom";

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
  {
    path: "historial-periodos-nomina",
    element: <PayrollPeriodsHistoryPage />,
  },
  {
    path: "applications",
    element: <ApplicationsPage />,
  },
];
