export function isValueMissing(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "number") return Number.isNaN(value);
  return String(value).trim() === "";
}

export const missingDataInInputClassName =
  "text-red-600! dark:text-red-400! not-italic! font-normal! text-[14px]! sm:text-[15px]! leading-snug! tracking-tight!";
