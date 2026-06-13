import type { RouteObject } from "react-router-dom";
import { UsuarioPage } from "@app/modules/admin/ui/pages/usuarios/usuarioPage";
import { CostCentersPage } from "@app/modules/admin/ui/pages/cost-centers/cost-centers";
import { AreasPage } from "@app/modules/admin/ui/pages/areas/areas";
import { JobPositionsPage } from "@app/modules/admin/ui/pages/job-positions/job-positions";
export const AdminRoutes: RouteObject[] = [
  {
    index: true,
    element: <CostCentersPage />,
  },
  {
    path: "cost-centers",
    element: <CostCentersPage />,
  },
  {
    path: "areas",
    element: <AreasPage />,
  },
  {
    path: "job-positions",
    element: <JobPositionsPage />,
  },
  {
    path: "users",
    element: <UsuarioPage />,
  },
];
