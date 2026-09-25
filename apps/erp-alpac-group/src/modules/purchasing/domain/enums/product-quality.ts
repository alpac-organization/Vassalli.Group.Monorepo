import type { EnumType } from "@app/shared/types/enum.type";
export type ProductQualityEnumType = EnumType & {
  textValue: string;
}
export const ProductQualityEnum = {
  Excellent: { value : 1, label:"Excelente", textValue: "Excellent"},
  Good: { value : 2, label:"Buena", textValue: "Good"},
  Regular: { value : 3, label:"Regular", textValue: "Regular"},
  Poor: { value : 4, label:"Mala", textValue: "Poor"},
  Damaged: { value : 5, label:"Dañado", textValue: "Damaged"},
} as const satisfies Record<string,ProductQualityEnumType>

export type ProductQualityEnum = (typeof ProductQualityEnum)[keyof typeof ProductQualityEnum];
export type ProductQualityType = ProductQualityEnum["textValue"];

export const ProductQualityOptions = Object.values(ProductQualityEnum);
