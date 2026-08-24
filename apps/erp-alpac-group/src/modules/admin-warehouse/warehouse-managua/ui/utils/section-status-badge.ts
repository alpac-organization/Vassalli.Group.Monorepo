import { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import {
  SectionTypeEnum,
  type SectionEnumType,
} from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";

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
