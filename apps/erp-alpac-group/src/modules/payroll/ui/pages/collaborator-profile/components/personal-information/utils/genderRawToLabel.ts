/** Convierte valor del API al label usando `GenderEnum del core` y alias del backend. */
import { GenderEnum } from "@app/core/enums/gender.enum";
import { GenderApiAliases } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/types/personal-information.variants";
export function genderRawToLabel(raw: string | undefined): string | null {
  if (raw === undefined) return null;
  const genderRaw = String(raw).trim();

  if (genderRaw === "") return null;

  const aliasGender = GenderApiAliases[genderRaw];
  if (aliasGender) return GenderEnum[aliasGender].label;

  return genderRaw;
}
