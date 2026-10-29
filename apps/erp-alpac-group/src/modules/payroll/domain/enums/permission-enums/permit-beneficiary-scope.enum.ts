export const PermitBeneficiaryScopeEnum: Record<
  string,
  { value: number; label: string }
> = {
  None: { value: 0, label: "Ninguno" },
  Own: { value: 1, label: "Propio" },
  FamilyNucleus: { value: 2, label: "Núcleo familiar" },
} as const;

export function getPermitBeneficiaryScopeLabel(apiName: string): string {
  return PermitBeneficiaryScopeEnum[apiName]?.label ?? apiName;
}
