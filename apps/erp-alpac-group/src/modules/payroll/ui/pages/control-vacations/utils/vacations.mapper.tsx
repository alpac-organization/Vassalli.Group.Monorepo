import { Badges } from "@alpac/design-system";
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

export function PermitTypeBadge({ type }: { type: VacationControlPermitType | string }) {
  const label = permitTypeLabel(type);
  
  let color = "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"; // color default
  
  if (type === "Vacation") {
    color = "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
  } else if (type === "DonatedVacations") {
    color = "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
  }

  return <Badges label={label} color={color} />;
}
