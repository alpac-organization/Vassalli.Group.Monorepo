import { PermitApplicationStatusEnum } from "@app/modules/applications/domain/enums/permit-application-status.enum";

export function statusBadgeColor(status: PermitApplicationStatusEnum): string {
   switch (status) {
      case "Approved":
         return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";
      case "Pending":
         return "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200";
      case "Rejected":
         return "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200";
      case "Cancelled":
         return "bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-200"
      default:
         return "bg-slate-100 text-slate-800";
   }
}
