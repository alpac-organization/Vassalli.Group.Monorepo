import type { EnumType } from "@app/shared/types/enum.type";
export const PermitBeneficiaryScopeEnum: Record<string, EnumType> = {
   None: { value: 0, label: "Ninguno" },
   Own: { value: 1, label: "Propio" },
   FamilyNucleus: { value: 2, label: "Núcleo familiar" },
} as const;

export type PermitBeneficiaryScopeEnum = keyof typeof PermitBeneficiaryScopeEnum;