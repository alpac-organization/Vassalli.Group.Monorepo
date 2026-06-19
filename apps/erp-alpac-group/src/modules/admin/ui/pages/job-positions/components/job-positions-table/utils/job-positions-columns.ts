import type { GetJobPositionsResponse } from "@app/modules/admin/domain/ApiContract/responses/job-positions/get-positions-response";

export type JobPositionColumnDef = {
  key: string;
  label: string;
  render: (item: GetJobPositionsResponse) => string;
};

export const jobPositionColumns: JobPositionColumnDef[] = [
  {
    key: "job_position_name",
    label: "Nombre del Puesto",
    render: (item) => item.job_position_name,
  },
  {
    key: "description",
    label: "Descripción",
    render: (item) => item.description ?? "—",
  },
];
