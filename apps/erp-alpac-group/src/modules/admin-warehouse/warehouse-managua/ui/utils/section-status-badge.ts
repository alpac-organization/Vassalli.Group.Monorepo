import { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import { SectionTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";

export const getSectionTypeLabel = (value: string | null) => {
  if (!value) return "-";
  return (
    Object.values(SectionTypeEnum).find((option) => option.textValue === value)
      ?.label ?? value
  );
};

export const getSectionStorageTypeLabel = (value: string | null) => {
  if (!value) return "-";
  return (
    Object.values(SectionStorageTypeEnum).find(
      (option) => option.textValue === value,
    )?.label ?? value
  );
};
