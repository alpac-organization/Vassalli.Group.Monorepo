// import { Badges } from "@alpac/design-system";
// import type { VacationControlPermitType } from "@app/modules/payroll/domain/ApiContract/Responses/control-vacation-responses/get-control-vacations-response";

// const vacationsMapper: Record<VacationControlPermitType, string> = {
//    Vacation: "Vacaciones",
//    DonatedVacations: "Vacaciones donadas",
// };

// function permitTypeLabel(
//    type: VacationControlPermitType | string,
// ): string {
//    if (type in vacationsMapper) {
//       return vacationsMapper[type as VacationControlPermitType];
//    }
//    return typeof type === "string" && type.length > 0 ? type : "—";
// }

// const VACATION_BADGE_COLOR =
//    "bg-amber-200 text-amber-900 dark:bg-yellow-500/20 dark:text-yellow-200";
// const DONATED_BADGE_COLOR =
//    "bg-red-500 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";

// const BADGE_LAYOUT_CLASS = "whitespace-nowrap shrink-0 !py-1.5 leading-snug";

// export function PermitTypeBadge({
//    type,
// }: {
//    type: VacationControlPermitType | string;
// }) {
//    const label = permitTypeLabel(type);

//    let color =
//       "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
//    if (type === "Vacation") {
//       color = VACATION_BADGE_COLOR;
//    } else if (type === "DonatedVacations") {
//       color = DONATED_BADGE_COLOR;
//    }

//    return <Badges label={label} color={color} className={BADGE_LAYOUT_CLASS} />;
// }
