export const PermissionTypeEnum: Record<
  string,
  { value: number; label: string }
> = {
  VACATION: { value: 1, label: "Vacaciones" },
  MEDICAL_APPOINTMENT: { value: 2, label: "Cita médica" },
  COMPENSATORY_TIME: { value: 3, label: "Tiempo compensatorio" },
  PAID_LEAVE: { value: 4, label: "Permiso con goce" },
  UNPAID_LEAVE: { value: 5, label: "Permiso sin goce" },
  SPECIAL_LEAVE: { value: 6, label: "Permiso especial" },
} as const;
