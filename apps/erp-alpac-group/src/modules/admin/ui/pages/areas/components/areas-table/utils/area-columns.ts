import type { GetAreasResponse } from "@app/modules/admin/domain/ApiContract/responses/areas/get-areas.response";

export type AreaColumnDef = {
  key: string;
  label: string;
  render: (item: GetAreasResponse) => string;
};

export const areaColumns: AreaColumnDef[] = [
  {
    key: "work_area_name",
    label: "Nombre del Área",
    render: (item) => item.work_area_name,
  },
  {
    key: "descripcion",
    label: "Descripción",
    render: (item) => item.descripcion ?? "—",
  },
];
