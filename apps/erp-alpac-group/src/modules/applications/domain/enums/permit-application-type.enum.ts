import type { EnumType } from "@app/shared/types/enum.type";

export const PermitApplicationTypeEnum: Record<string, EnumType> = {
   Vacation: { value: 1, label: "Vacaciones" },
   MedicalAppointment: { value: 2, label: "Cita médica" },
   CompensatoryTime: { value: 3, label: "Tiempo compensatorio" },
   PaidLeave: { value: 4, label: "Permiso con goce" },
   UnpaidLeave: { value: 5, label: "Permiso sin goce" },
   SpecialLeave: { value: 6, label: "Permiso especial" },
   DonatedVacations: { value: 7, label: "Vacaciones donadas" },
} as const;

export type PermitApplicationTypeEnum = keyof typeof PermitApplicationTypeEnum;

export const PermitApplicationTypeOptions: EnumType[] = Object.values(PermitApplicationTypeEnum);