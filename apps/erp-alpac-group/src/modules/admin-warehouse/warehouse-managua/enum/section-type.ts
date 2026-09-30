import type { EnumType } from "@app/shared/types/enum.type";

export type SectionEnumType = EnumType & {
  textValue: string;
};

export const SectionTypeEnum = {
  Storage: { value: 1, label: "Almacenamiento", textValue: "Storage" },
  Aisle: { value: 2, label: "Pasillo", textValue: "Aisle" },
} as const satisfies Record<string, SectionEnumType>;

export type SectionTypeEnum =
  (typeof SectionTypeEnum)[keyof typeof SectionTypeEnum];

export const SectionTypeOptions: SectionEnumType[] = Object.values(SectionTypeEnum);

export type SectionTypeValue =
  (typeof SectionTypeEnum)[keyof typeof SectionTypeEnum]["textValue"];
