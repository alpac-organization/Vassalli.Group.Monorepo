import { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import { SectionTypeEnum, type SectionEnumType, type SectionTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";

export const SectionTypeColor = {
  [SectionTypeEnum.Aisle.textValue]: "#3e6dff",
  [SectionTypeEnum.Storage.textValue]: "#03b573",
} as const satisfies Record<SectionTypeValue, string>;

export const SectionTypeBorderColor = {
  [SectionTypeEnum.Aisle.textValue]: "#83b4ff",
  [SectionTypeEnum.Storage.textValue]: "#04ffa2",
} as const satisfies Record<SectionTypeValue, string>;

export const SectionLegends = [
  { text: SectionTypeEnum.Aisle.label, color: SectionTypeColor["Aisle"] },
  { text: SectionTypeEnum.Storage.label, color: SectionTypeColor["Storage"] },
] as const;

function resolveSectionEnum(
  options: readonly SectionEnumType[],
  value: string | number,
): SectionEnumType | undefined {
  if (value == null || value === "") return undefined;

  const asString = String(value);
  const asNumber = typeof value === "number" ? value : Number(value);

  return options.find(
    (option) =>
      option.textValue === asString ||
      option.value === asNumber ||
      String(option.value) === asString,
  );
}

export const getSectionTypeLabel = (value: string | number | null) => {
  if (value == null || value === "") return "-";
  return (
    resolveSectionEnum(Object.values(SectionTypeEnum), value)?.label ??
    String(value)
  );
};

export const getSectionStorageTypeLabel = (value: string | number | null) => {
  if (value == null || value === "") return "-";
  return (
    resolveSectionEnum(Object.values(SectionStorageTypeEnum), value)?.label ??
    String(value)
  );
};

export const resolveSectionType = (value: string | number) =>
  resolveSectionEnum(Object.values(SectionTypeEnum), value ?? "");

export const resolveSectionStorageType = (value: string | number) =>
  resolveSectionEnum(Object.values(SectionStorageTypeEnum), value ?? "");
