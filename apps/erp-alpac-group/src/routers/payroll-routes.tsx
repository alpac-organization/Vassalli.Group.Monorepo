import type { RouteObject } from "react-router-dom";
import { CollaboratorPage } from "@app/modules/payroll/ui/pages/collaborator-index/collaborator.page";
import { CollaboratorProfilePage } from "@app/modules/payroll/ui/pages/collaborator-profile/collaborator-profile-page";
import { Navigate } from "react-router-dom";

export const PayrollRoutes: RouteObject[] = [
   {
      index: true,
      element: <Navigate to="collaborators" replace />
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
];
