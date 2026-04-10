/** Convierte valor del API al label usando `GenderEnum del core` y alias del backend. */
import { GenderEnum } from "@app/core/enums/gender.enum";
export function genderRawToLabel(raw: string | null): string | null {
  if (raw === null || raw === "") return null;
  return GenderEnum[raw as keyof typeof GenderEnum].label;
}
