import type { VacationControlPermitType } from "@app/modules/payroll/domain/ApiContract/Responses/get-control-vacations-response";

export const vacationsMapper: Record<VacationControlPermitType, string> = {
  Vacation: "Vacaciones",
  DonatedVacations: "Vacaciones donadas",
};

export function permitTypeLabel(type: VacationControlPermitType | string): string {
  if (type in vacationsMapper) {
    return vacationsMapper[type as VacationControlPermitType];
  }
  return typeof type === "string" && type.length > 0 ? type : "—";
}
