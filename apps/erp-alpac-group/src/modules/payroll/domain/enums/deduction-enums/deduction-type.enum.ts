import type { EnumType } from "@app/shared/types/enum.type";

export const DeductionTypeEnum: Record<string, EnumType> = {
  Loans: { value: 1, label: "Préstamo" },
  LateArrivals: { value: 3, label: "Llegadas tardes" },
  Sanction: { value: 5, label: "Sanción" },
  Purisima: { value: 6, label: "Purísima" },  
  JudicialGarnishment: { value: 8, label: "Embargo judicial" },
  ChildSupportGarnishment: { value: 9, label: "Embargo de pensión alimenticia" },
} as const;

export type DeductionTypeEnum =
  (typeof DeductionTypeEnum)[keyof typeof DeductionTypeEnum];

export const DeductionTypeOptions = Object.values(DeductionTypeEnum);

export function getDeductionTypeLabel(type: string | number): string {
  if (typeof type === "string") {
    const byKey = DeductionTypeEnum[type];
    if (byKey) return byKey.label;
  }

  const numericValue = typeof type === "number" ? type : Number(type);
  if (!Number.isNaN(numericValue)) {
    const byValue = DeductionTypeOptions.find(
      (item) => item.value === numericValue,
    );
    if (byValue) return byValue.label;
  }

  return "Desconocido";
}
