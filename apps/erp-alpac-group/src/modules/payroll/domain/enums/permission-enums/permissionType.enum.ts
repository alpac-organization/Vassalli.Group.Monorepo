export const PermissionTypeEnum: Record<
   string,
   { value: number; label: string }
> = {
   VACATION: { value: 1, label: "Vacaciones" },
   MEDICAL_APPOINTMENT: { value: 2, label: "Cita médica" },
   DONATED_VACATION: { value: 7, label: "Vacaciones donadas" },
   VACATION_PAY: { value: 8, label: "Pago de vacaciones" }
   // COMPENSATORY_TIME: { value: 3, label: "Tiempo compensatorio" },
   // SPECIAL_LEAVE: { value: 6, label: "Permiso especial" },
} as const;
