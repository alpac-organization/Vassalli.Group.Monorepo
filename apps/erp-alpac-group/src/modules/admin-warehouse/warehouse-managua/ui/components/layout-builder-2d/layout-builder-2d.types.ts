import type { LayoutTransform3DDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/layout-transform-3d";
import type { SectionStorageTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import type { SectionTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";

export interface SpatialDraft extends LayoutTransform3DDto {
  width_metres: number;
  length_metres: number;
}

export type LayoutEntityKind = "section" | "lot" | "rack";

export interface ExistingEntity {
  id: string;
  position_x: number;
  position_y?: number;
  position_z: number;
  width_metres: number;
  length_metres: number;
  name?: string;
  kind?: LayoutEntityKind;
  storage_type?: SectionStorageTypeValue;
  section_type?: SectionTypeValue;
}

export interface PixelRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NormalizedRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CollisionContext {
  draftStorageType?: SectionStorageTypeValue | null;
  draftKind?: LayoutEntityKind;
  draftPositionY?: number;
}

export type CollisionValidator = (
  draft: NormalizedRect,
  existing: ExistingEntity[],
  context: CollisionContext,
) => boolean;

export interface PendingDraft {
  draft: SpatialDraft;
  screenPosition: { x: number; y: number };
}

export interface PlacementDraft {
  width_metres: number;
  length_metres: number;
  position_y?: number;
  rotation_y?: number;
}

export type ToolMode = "pan" | "place";

export interface LayoutBuilder2DProps {
  containerWidthMetres: number;
  containerLengthMetres: number;
  existingEntities?: ExistingEntity[];
  entityKind?: LayoutEntityKind;
  draftStorageType?: SectionStorageTypeValue | null;
  collisionValidator?: CollisionValidator;
  placementDraft?: PlacementDraft | null;
  isSaving?: boolean;
  onPlacementConfirm: (draft: SpatialDraft) => void;
  onPlacementCancel?: () => void;
}
