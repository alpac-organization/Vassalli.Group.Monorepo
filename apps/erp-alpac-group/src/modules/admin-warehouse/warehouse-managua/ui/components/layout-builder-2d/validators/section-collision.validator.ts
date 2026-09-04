import type { SectionStorageTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import {
  entityToNormalizedRect,
  rectsIntersect,
} from "../layout-builder-2d.utils";
import type {
  CollisionValidator,
  ExistingEntity,
  NormalizedRect,
} from "../layout-builder-2d.types";

/** Snap/float tolerance so a rack that sits on a lot is not rejected by 1px edges. */
const CONTAINMENT_EPSILON_PX = 2;

const isGroundLotSection = (entity: ExistingEntity) =>
  entity.storage_type === SectionStorageTypeEnum.Lots.textValue &&
  (entity.position_y ?? 0) <= 0;

const isElevatedEntity = (entity: ExistingEntity) =>
  (entity.position_y ?? 0) > 0;

const containsRect = (container: NormalizedRect, child: NormalizedRect) =>
  child.x >= container.x - CONTAINMENT_EPSILON_PX &&
  child.y >= container.y - CONTAINMENT_EPSILON_PX &&
  child.x + child.width <= container.x + container.width + CONTAINMENT_EPSILON_PX &&
  child.y + child.height <=
    container.y + container.height + CONTAINMENT_EPSILON_PX;

/**
 * Floor sections cannot overlap each other.
 * Elevated rack sections may sit on top of a ground Lots section (must fit inside it)
 * and may share footprint with other elevated rack sections (different Y / stacking).
 */
export const createSectionCollisionValidator = (
  draftStorageType: SectionStorageTypeValue | null,
): CollisionValidator => {
  return (draft, existing, context) => {
    const storageType = context.draftStorageType ?? draftStorageType;
    const draftPositionY = context.draftPositionY ?? 0;
    const isElevatedRackSection =
      storageType === SectionStorageTypeEnum.Racks.textValue &&
      draftPositionY > 0;

    if (
      draftPositionY > 0 &&
      (storageType !== SectionStorageTypeEnum.Racks.textValue ||
        context.draftKind !== "section")
    ) {
      return false;
    }

    let hasSupportingLotSection = false;

    for (const entity of existing) {
      const entityRect = entityToNormalizedRect(entity);
      if (!rectsIntersect(draft, entityRect)) {
        continue;
      }

      if (isElevatedRackSection) {
        // Elevated racks may only overlap at a distinct base height.
        if (isElevatedEntity(entity)) {
          if (Math.abs((entity.position_y ?? 0) - draftPositionY) > 0.001) {
            continue;
          }
          return false;
        }

        // Must rest fully inside a ground-level Lots section.
        if (isGroundLotSection(entity) && containsRect(entityRect, draft)) {
          hasSupportingLotSection = true;
          continue;
        }

        // Overlap with aisles / ground non-lot sections is not allowed.
        return false;
      }

      // Ground-level draft: may sit under an elevated rack (different height),
      // but never overlap another ground footprint.
      if (isElevatedEntity(entity)) {
        continue;
      }

      return false;
    }

    if (isElevatedRackSection && !hasSupportingLotSection) {
      return false;
    }

    return true;
  };
};
