import type { EnumType } from "@app/shared/types/enum.type";

export const PermitApplicationTypeEnum: Record<string, EnumType> = {
   Vacation: { value: 1, label: "Vacaciones" },
   MedicalAppointment: { value: 2, label: "Cita médica" },
   DonatedVacations: { value: 7, label: "Vacaciones donadas" },
   // CompensatoryTime: { value: 3, label: "Tiempo compensatorio" }, 
   // SpecialLeave: { value: 6, label: "Permiso especial" },
} as const;

export type PermitApplicationTypeEnum = keyof typeof PermitApplicationTypeEnum;

export const PermitApplicationTypeOptions: EnumType[] = Object.values(PermitApplicationTypeEnum);