import { formatDate as formatDateFromShared } from "@app/shared/utils/string.utils";
import { formatSpanishDateTime } from "@app/shared/utils/date.utils";

export function formatNumber(value: number) {
   return new Intl.NumberFormat("es-NI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export function formatDate(value: string) {
   return formatDateFromShared(value) || "—";
}

export function formatGeneratedAt(value: string) {
   const [date, time] = value.split("T");
   return formatSpanishDateTime(date, time);
}
