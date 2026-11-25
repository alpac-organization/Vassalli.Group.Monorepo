export type ReferenceTypeEnum = "None" | "FT" | "BL" | "RQ";

export interface ReferenceTypeEnumValues {
   value: number;
   label: string;
   shortLabel: string;
   badgeColor: string;
}

export const ReferenceType: Record<ReferenceTypeEnum, ReferenceTypeEnumValues> = {
   None: {
      value: 1,
      label: "Sin documento",
      shortLabel: "—",
      badgeColor:
         "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
   },
   FT: {
      value: 2,
      label: "Factura",
      shortLabel: "Factura",
      badgeColor:
         "bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800",
   },
   BL: {
      value: 3,
      label: "Boleta de combustible",
      shortLabel: "Boleta combustible",
      badgeColor:
         "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
   },
   RQ: {
      value: 4,
      label: "Requisición",
      shortLabel: "Requisición",
      badgeColor:
         "bg-violet-100 text-violet-800 border border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
   },
} as const;

export function resolveReferenceTypeMeta(
   rawValue?: ReferenceTypeEnum | number | string | null,
): ReferenceTypeEnumValues | null {
   if (rawValue === null || rawValue === undefined || rawValue === "") {
      return null;
   }

   if (typeof rawValue === "number") {
      const matchedByValue = Object.values(ReferenceType).find(
         (entry) => entry.value === rawValue,
      );
      return matchedByValue && matchedByValue.value !== ReferenceType.None.value
         ? matchedByValue
         : null;
   }

   const normalized = String(rawValue).trim().toUpperCase();
   if (normalized === "FT") return ReferenceType.FT;
   if (normalized === "BL") return ReferenceType.BL;
   if (normalized === "RQ") return ReferenceType.RQ;
   if (normalized === "NONE") return null;

   const numeric = Number(normalized);
   if (!Number.isNaN(numeric)) {
      return resolveReferenceTypeMeta(numeric);
   }

   return null;
}
