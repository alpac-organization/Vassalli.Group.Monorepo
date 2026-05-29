import type { RouteObject } from "react-router-dom";
import { UsuarioPage } from "@app/modules/admin/ui/pages/usuarios/usuarioPage";
import { CatalogoPage } from "@app/modules/admin/ui/pages/catalogos/catalogo";
export const AdminRoutes: RouteObject[] = [
  {
    index: true,
    element: <UsuarioPage />,
  },
  {
    path: "catalogos",
    element: <CatalogoPage />,
  },
  {
    path: "users",
    element: <UsuarioPage />,
  },
];
