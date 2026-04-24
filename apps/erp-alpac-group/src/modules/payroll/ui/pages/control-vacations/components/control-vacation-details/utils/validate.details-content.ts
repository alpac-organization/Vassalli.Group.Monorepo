import { formatDateToSpanishWords, formatTime } from "@app/shared/utils/string.utils";

export const EM_DASH = "—";

function hasText(value: string | null | undefined): boolean {
   return typeof value === "string" && value.trim().length > 0;
}

export function dashOrText(value: string | null | undefined): string {
   return hasText(value) ? value!.trim() : EM_DASH;
}


export function formatDateOrDash(iso?: string | null): string {
   if (!iso?.trim()) return EM_DASH;
   const datePart = iso.includes("T") ? iso.split("T")[0]! : iso.trim();
   const formatted = formatDateToSpanishWords(datePart ?? undefined);
   return formatted.trim() ? formatted : EM_DASH;
}
export function formatTimeOrDash(time?: string | null): string {
   if (!hasText(time)) return dashOrText(time);
   const formatted = formatTime(time!.trim());
   if (formatted === "--:-- --") return EM_DASH;
   return formatted;
}
