import type { RouteObject } from "react-router-dom";
import { UsuarioPage } from "@app/modules/admin/ui/pages/usuarios/usuarioPage";
import { CostCentersPage } from "@app/modules/admin/ui/pages/cost-centers/cost-centers";
import { AreasPage } from "@app/modules/admin/ui/pages/areas/areas";
export const AdminRoutes: RouteObject[] = [
  {
    index: true,
    element: <UsuarioPage />,
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
    path: "users",
    element: <UsuarioPage />,
  },
];
