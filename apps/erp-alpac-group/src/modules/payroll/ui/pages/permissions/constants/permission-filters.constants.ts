import type { Option } from "@alpac/design-system";
import type { PermissionType } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";

export const VACATION_STATUS_FILTER_OPTIONS: Option[] = [
   { label: "Todos los estados", value: "all" },
   { label: "Pendiente", value: "Pending" },
   { label: "Aprobado", value: "Approved" },
   { label: "Rechazado", value: "Rejected" },
   { label: "Cancelado", value: "Cancelled" },
];

type PermissionTypeEntry = {
   value: PermissionType;
   label: string;
};
const PERMISSION_TYPE_ENTRIES: Array<PermissionTypeEntry> = [
   { value: "Vacation", label: "Vacaciones" },
   { value: "MedicalAppointment", label: "Cita médica" },
   { value: "DonatedVacations", label: "Donación de vacaciones" },
   // { value: "CompensatoryTime", label: "Tiempo compensatorio" },
   // { value: "SpecialLeave", label: "Permiso especial" },
];

export const PERMISSION_TYPE_LABEL: Record<PermissionType, string> =
   Object.fromEntries(
      PERMISSION_TYPE_ENTRIES.map(({ value, label }) => [value, label]),
   ) as Record<PermissionType, string>;

export const PERMISSION_TYPE_OPTIONS: Option[] = PERMISSION_TYPE_ENTRIES;

export const PERMISSION_TYPE_FILTER_OPTIONS: Option[] = [
   { label: "Todos los tipos", value: "all" },
   ...PERMISSION_TYPE_ENTRIES,
];
