import type { EnumType } from "@app/shared/types/enum.type";
import type { SectionEnumType } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";

export const SectionStorageTypeEnum = {  
  Racks: { value: 1, label: "Racks", textValue: "Racks" },
  Lots: { value: 2, label: "Tramos", textValue: "Lots" },
  Pallets: { value: 3, label: "Polines", textValue: "Pallets" },
  None: { value: 4, label: "Ninguno", textValue: "None" },
} as const satisfies Record<string, SectionEnumType>;

export type SectionStorageTypeEnum =
  (typeof SectionStorageTypeEnum)[keyof typeof SectionStorageTypeEnum];

export const SectionStorageTypeOptions: EnumType[] = Object.values(
  SectionStorageTypeEnum,
);

export type SectionStorageTypeValue =
  (typeof SectionStorageTypeEnum)[keyof typeof SectionStorageTypeEnum]["textValue"];
