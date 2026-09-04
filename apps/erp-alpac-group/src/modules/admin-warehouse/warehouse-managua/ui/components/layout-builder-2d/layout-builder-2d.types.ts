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

export type ToolMode = "draw" | "pan";

export interface LayoutBuilder2DProps {
  containerWidthMetres: number;
  containerLengthMetres: number;
  existingEntities?: ExistingEntity[];
  entityKind?: LayoutEntityKind;
  draftStorageType?: SectionStorageTypeValue | null;
  showStorageTypeSelector?: boolean;
  storageTypeOptions?: { value: SectionStorageTypeValue; label: string }[];
  onDraftStorageTypeChange?: (value: SectionStorageTypeValue) => void;
  collisionValidator?: CollisionValidator;
  onDrawComplete: (draft: SpatialDraft) => void;
}
