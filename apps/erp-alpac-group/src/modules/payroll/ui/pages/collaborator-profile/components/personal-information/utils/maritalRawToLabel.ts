import { MaritalStatusEnum } from "@app/core/enums/marital-status.enum";
import { MaritalApiAliases } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/types/personal-information.variants";

export function maritalRawToLabel(raw: string | undefined): string | null {
  if (raw === undefined) return null;
  const t = String(raw).trim();
  if (t === "") return null;
  console.log(t);
  const aliasKey = MaritalApiAliases[t];
  if (aliasKey) return MaritalStatusEnum[aliasKey].label;

  const byEnumKey = MaritalStatusEnum[t as keyof typeof MaritalStatusEnum];
  if (byEnumKey && "label" in byEnumKey) return byEnumKey.label;

  const n = Number(t);
  if (!Number.isNaN(n)) {
    const entry = Object.values(MaritalStatusEnum).find((e) => e.value === n);
    if (entry) return entry.label;
  }

  return t;
}
