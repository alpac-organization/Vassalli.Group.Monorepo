import type { EnumType } from "@app/shared/types/enum.type";

export type SectionEnumType = EnumType & {
  textValue: string;
};

export const SectionTypeEnum = {
  Storage: { value: 1, label: "Almacenamiento", textValue: "Storage" },
  Aisle: { value: 2, label: "Pasillo", textValue: "Aisle" },
  Abandoned: { value: 3, label: "Abandonado", textValue: "Abandoned" },
} as const satisfies Record<string, SectionEnumType>;

export type SectionTypeEnum =
  (typeof SectionTypeEnum)[keyof typeof SectionTypeEnum];

export const SectionTypeOptions: EnumType[] = Object.values(SectionTypeEnum);

export type SectionTypeValue =
  (typeof SectionTypeEnum)[keyof typeof SectionTypeEnum]["textValue"];
