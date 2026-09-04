import type { SectionStorageTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import {
  entityToNormalizedRect,
  rectsIntersect,
} from "../layout-builder-2d.utils";
import type { CollisionValidator } from "../layout-builder-2d.types";

const allowsVerticalStacking = (
  draftStorageType: SectionStorageTypeValue,
  existingStorageType: SectionStorageTypeValue,
) => {
  const isRacksOverLots =
    draftStorageType === SectionStorageTypeEnum.Racks.textValue &&
    existingStorageType === SectionStorageTypeEnum.Lots.textValue;

  const isLotsUnderRacks =
    draftStorageType === SectionStorageTypeEnum.Lots.textValue &&
    existingStorageType === SectionStorageTypeEnum.Racks.textValue;

  return isRacksOverLots || isLotsUnderRacks;
};

export const createSectionCollisionValidator = (
  draftStorageType: SectionStorageTypeValue | null,
): CollisionValidator => {
  return (draft, existing) => {
    for (const entity of existing) {
      if (!rectsIntersect(draft, entityToNormalizedRect(entity))) {
        continue;
      }

      if (
        draftStorageType &&
        entity.storage_type &&
        allowsVerticalStacking(draftStorageType, entity.storage_type)
      ) {
        continue;
      }

      return false;
    }

    return true;
  };
};
