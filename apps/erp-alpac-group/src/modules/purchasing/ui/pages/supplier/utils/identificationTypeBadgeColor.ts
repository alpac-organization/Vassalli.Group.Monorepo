export function getIdentificationTypeBadgeColor(identificationType: string): string {
   switch (identificationType) {
      case "Ruc":
         return "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200";

      case "Cedula":
         return "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200"

      default:
         return "bg-slate-100 text-slate-800";
   }
}