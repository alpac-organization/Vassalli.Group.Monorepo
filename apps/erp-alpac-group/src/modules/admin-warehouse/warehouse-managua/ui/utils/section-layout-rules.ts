import {
  SectionStorageTypeEnum,
  type SectionStorageTypeValue,
} from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import {
  SectionTypeEnum,
  type SectionTypeValue,
} from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";

export interface SectionLayoutRuleInput {
  sectionType: SectionTypeValue;
  storageType: SectionStorageTypeValue;
  isElevated?: boolean;
  positionY?: number;
}

export interface NormalizedSectionLayoutRule {
  sectionType: SectionTypeValue;
  storageType: SectionStorageTypeValue;
  isElevated: boolean;
  positionY: number;
}

export const normalizeSectionLayoutRule = ({
  sectionType,
  storageType,
  isElevated = false,
  positionY = 0,
}: SectionLayoutRuleInput): NormalizedSectionLayoutRule => {
  if (sectionType === SectionTypeEnum.Aisle.textValue) {
    return {
      sectionType,
      storageType: SectionStorageTypeEnum.Empty.textValue,
      isElevated: false,
      positionY: 0,
    };
  }

  const canElevate =
    storageType === SectionStorageTypeEnum.Racks.textValue && isElevated;

  return {
    sectionType,
    storageType,
    isElevated: canElevate,
    positionY: canElevate ? Math.max(0, positionY) : 0,
  };
};
