export const PermitFamilyRelationshipEnum: Record<
  string,
  { value: number; label: string }
> = {
  None: { value: 0, label: "Ninguno" },
  Spouse: { value: 1, label: "Cónyuge" },
  Child: { value: 2, label: "Hijo(a)" },
  Parent: { value: 3, label: "Padre(a)" },
  Sibling: { value: 4, label: "Hermano(a)" },
} as const;

export function getPermitFamilyRelationshipLabel(apiName: string): string {
  return PermitFamilyRelationshipEnum[apiName]?.label ?? apiName;
}
