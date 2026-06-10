import ControlVacationsPage from "@app/modules/payroll/ui/pages/control-vacations/control-vacations";
import { CollaboratorPage } from "@app/modules/payroll/ui/pages/collaborator-index/collaborator.page";
import { CollaboratorProfilePage } from "@app/modules/payroll/ui/pages/collaborator-profile/collaborator-profile-page";
import { PayrollPage } from "@app/modules/payroll/ui/pages/nomina/payroll-page";
import { PayrollPeriodsHistoryPage } from "@app/modules/payroll/ui/pages/periods-payroll/Payroll-periods-history";
import { ApplicationsPage } from "@app/modules/applications/ui/pages/applications-index/applications.page";
import { PayrollClosedHistoryPage } from "@app/modules/payroll/ui/pages/payroll-closed-history/payroll-closed-history";
import type { RouteObject } from "react-router-dom";
import { ActiveDeductionsPage } from "@app/modules/payroll/ui/pages/active-deduction-index/active-deduction.page";

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
    children: [
      {
        index: true,
        element: <PayrollPeriodsHistoryPage />,
      },
      {
        path: ":payroll_id",
        element: <PayrollClosedHistoryPage />,
      },
    ],
  },
  {
    path: "applications",
    element: <ApplicationsPage />,
  },
  {
    path: "active-deductions",
    element: <ActiveDeductionsPage/>
  }
];
