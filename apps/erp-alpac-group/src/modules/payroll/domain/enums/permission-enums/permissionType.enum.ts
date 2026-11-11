export const PermissionTypeEnum: Record<
  string,
  { value: number; label: string }
> = {
  VACATION: { value: 1, label: "Vacaciones" },
  MEDICAL_APPOINTMENT: { value: 2, label: "Cita médica" },
  DONATED_VACATION: { value: 7, label: "Vacaciones donadas" },
  VACATION_PAY: { value: 8, label: "Pago de vacaciones" },
  JUDICIAL_APPOINTMENT: { value: 9, label: "Cita judicial" },
  MARRIAGE_LEAVE: { value: 10, label: "Permiso de matrimonio" },
  BIRTH_LEAVE: { value: 11, label: "Permiso de nacimiento" },
  BEREAVEMENT_LEAVE: { value: 12, label: "Permiso de fallecimiento" },
} as const;

export const PermissionTypeByApiName: Record<
  string,
  { value: number; label: string }
> = {
  Vacation: PermissionTypeEnum.VACATION,
  MedicalAppointment: PermissionTypeEnum.MEDICAL_APPOINTMENT,
  DonatedVacations: PermissionTypeEnum.DONATED_VACATION,
  VacationPay: PermissionTypeEnum.VACATION_PAY,
  JudicialAppointment: PermissionTypeEnum.JUDICIAL_APPOINTMENT,
  MarriageLeave: PermissionTypeEnum.MARRIAGE_LEAVE,
  BirthLeave: PermissionTypeEnum.BIRTH_LEAVE,
  BereavementLeave: PermissionTypeEnum.BEREAVEMENT_LEAVE,
} as const;

export function getPermissionTypeLabel(apiName: string): string {
  return PermissionTypeByApiName[apiName]?.label ?? apiName;
}
