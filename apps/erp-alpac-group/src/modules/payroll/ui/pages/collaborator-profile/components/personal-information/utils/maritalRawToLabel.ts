import { MaritalStatusEnum } from "@app/core/enums/marital-status.enum";
import { MaritalApiAliases } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/types/personal-information.variants";

export function maritalRawToLabel(raw: string | null): string | null {
  if (raw === null || raw === "") return null;
  const t = String(raw).trim();

  const aliasKey = MaritalApiAliases[t];
  if (aliasKey) return MaritalStatusEnum[aliasKey].label;

  return t;
}
