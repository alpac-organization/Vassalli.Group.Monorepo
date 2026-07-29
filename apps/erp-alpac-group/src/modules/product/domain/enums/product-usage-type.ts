import type { EnumType } from "@app/shared/types/enum.type";

export const ProductUsageEnum: Record<string, EnumType> = {
   Insumo: { value: 1, label: "Insumo" },
   OperationalUse: { value: 2, label: "Uso  Operacional" },
} as const;

export type ProductUsageEnum = (typeof ProductUsageEnum)[keyof typeof ProductUsageEnum];

export const ProductUsageOptions: EnumType[] = Object.values(ProductUsageEnum);