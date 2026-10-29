
import type { EnumType } from "@app/shared/types/enum.type";
export const PermitFamilyRelationshipEnum: Record<string, EnumType> = {
   None: { value: 0, label: "Ninguno" },
   Spouse: { value: 1, label: "Cónyuge" },
   Child: { value: 2, label: "Hijo(a)" },
   Parent: { value: 3, label: "Padre(a)" },
   Sibling: { value: 4, label: "Hermano(a)" },
} as const;

export type PermitFamilyRelationshipEnum = keyof typeof PermitFamilyRelationshipEnum;