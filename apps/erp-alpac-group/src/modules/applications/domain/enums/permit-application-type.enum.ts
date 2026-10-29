import type { EnumType } from "@app/shared/types/enum.type";

export const PermitApplicationTypeEnum: Record<string, EnumType> = {
   Vacation: { value: 1, label: "Vacaciones" },
   MedicalAppointment: { value: 2, label: "Cita médica" },
   DonatedVacations: { value: 7, label: "Vacaciones donadas" },
   VacationPay: { value: 8, label: "Pago de vacaciones" },
   JudicialAppointment: { value: 9, label: "Cita judicial" },
   MarriageLeave: { value: 10, label: "Permiso de matrimonio" },
   BirthLeave: { value: 11, label: "Permiso de nacimiento" },
   BereavementLeave: { value: 12, label: "Permiso de fallecimiento" },
} as const;

export type PermitApplicationTypeEnum = keyof typeof PermitApplicationTypeEnum;

export const PermitApplicationTypeOptions: EnumType[] = Object.values(PermitApplicationTypeEnum);