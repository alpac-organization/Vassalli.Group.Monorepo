import type { Option } from "@alpac/design-system";

export const VACATION_STATUS_FILTER_OPTIONS: Option[] = [
  { label: "Todos los estados", value: "all" },
  { label: "Pendiente", value: "Pending" },
  { label: "Aprobado", value: "Approved" },
  { label: "Rechazado", value: "Rejected" },
  { label: "Cancelado", value: "Cancelled" },
];
