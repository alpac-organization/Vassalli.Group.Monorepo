import type { ExistingEntity } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d.types";
import type { SpatialDraft } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d.types";
import type { SectionStorageTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import type { SectionResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-res";
import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-byId";
import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { RackListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-res";
import type { LayoutTransform3DDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/layout-transform-3d";
import { resolveSectionStorageType } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/section-status-badge";

interface BuildSectionEntityParams {
  id: string;
  name: string;
  spatialDraft: SpatialDraft;
  storageType: SectionStorageTypeValue;
}

export const buildSectionLayoutEntity = ({
  id,
  name,
  spatialDraft,
  storageType,
}: BuildSectionEntityParams): ExistingEntity => ({
  id,
  name,
  kind: "section",
  storage_type: storageType,
  position_x: spatialDraft.position_x,
  position_y: spatialDraft.position_y,
  position_z: spatialDraft.position_z,
  width_metres: spatialDraft.width_metres,
  length_metres: spatialDraft.length_metres,
});

interface BuildLotEntityParams {
  id: string;
  name: string;
  spatialDraft: SpatialDraft;
}

export const buildLotLayoutEntity = ({
  id,
  name,
  spatialDraft,
}: BuildLotEntityParams): ExistingEntity => ({
  id,
  name,
  kind: "lot",
  position_x: spatialDraft.position_x,
  position_y: spatialDraft.position_y,
  position_z: spatialDraft.position_z,
  width_metres: spatialDraft.width_metres,
  length_metres: spatialDraft.length_metres,
});

interface BuildRackEntityParams {
  id: string;
  name: string;
  spatialDraft: SpatialDraft;
}

export const buildRackLayoutEntity = ({
  id,
  name,
  spatialDraft,
}: BuildRackEntityParams): ExistingEntity => ({
  id,
  name,
  kind: "rack",
  position_x: spatialDraft.position_x,
  position_y: spatialDraft.position_y,
  position_z: spatialDraft.position_z,
  width_metres: spatialDraft.width_metres,
  length_metres: spatialDraft.length_metres,
});

type SpatialSource = {
  width_metres?: number | string | null;
  length_metres?: number | string | null;
  position_x?: number | string | null;
  position_y?: number | string | null;
  position_z?: number | string | null;
  rotation_y?: number | string | null;
  transform?: LayoutTransform3DDto | Record<string, unknown> | null;
  layout_transform_3d?: LayoutTransform3DDto | Record<string, unknown> | null;
  layout_transform_3d_dto?: LayoutTransform3DDto | Record<string, unknown> | null;
  layoutTransform3D?: LayoutTransform3DDto | Record<string, unknown> | null;
  layoutTransform3dDto?: LayoutTransform3DDto | Record<string, unknown> | null;
};

const toFiniteNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeTransform = (raw: unknown): LayoutTransform3DDto | null => {
  if (!raw || typeof raw !== "object") return null;

  const candidate = raw as Record<string, unknown>;
  const positionX =
    toFiniteNumber(candidate.position_x) ??
    toFiniteNumber(candidate.positionX);
  const positionZ =
    toFiniteNumber(candidate.position_z) ??
    toFiniteNumber(candidate.positionZ);

  if (positionX === null || positionZ === null) return null;

  return {
    position_x: positionX,
    position_y:
      toFiniteNumber(candidate.position_y) ??
      toFiniteNumber(candidate.positionY) ??
      0,
    position_z: positionZ,
    rotation_y:
      toFiniteNumber(candidate.rotation_y) ??
      toFiniteNumber(candidate.rotationY) ??
      0,
  };
};

const resolveTransform = (
  source: SpatialSource,
): LayoutTransform3DDto | null =>
  normalizeTransform(source.transform) ??
  normalizeTransform(source.layout_transform_3d) ??
  normalizeTransform(source.layout_transform_3d_dto) ??
  normalizeTransform(source.layoutTransform3D) ??
  normalizeTransform(source.layoutTransform3dDto) ??
  normalizeTransform({
    position_x: source.position_x,
    position_y: source.position_y,
    position_z: source.position_z,
    rotation_y: source.rotation_y,
  });

const hasSpatialLayout = (
  widthMetres?: number | string | null,
  lengthMetres?: number | string | null,
  layout?: LayoutTransform3DDto | null,
) => {
  const width = toFiniteNumber(widthMetres);
  const length = toFiniteNumber(lengthMetres);

  return (
    width != null &&
    length != null &&
    width > 0 &&
    length > 0 &&
    layout != null
  );
};

const getFootprintDimensions = (
  widthMetres: number,
  lengthMetres: number,
  rotationY = 0,
) => {
  const normalizedRotation = ((rotationY % 180) + 180) % 180;
  const isQuarterTurn = Math.abs(normalizedRotation - 90) < 0.001;

  return isQuarterTurn
    ? { width_metres: lengthMetres, length_metres: widthMetres }
    : { width_metres: widthMetres, length_metres: lengthMetres };
};

export const sectionHasSpatialLayout = (section: SpatialSource) =>
  hasSpatialLayout(
    section.width_metres,
    section.length_metres,
    resolveTransform(section),
  );

export const mapSectionResponseToLayoutEntity = (
  section: SectionResponse | SectionDto,
): ExistingEntity | null => {
  const transform = resolveTransform(section);
  const widthMetres = toFiniteNumber(section.width_metres);
  const lengthMetres = toFiniteNumber(section.length_metres);

  if (!hasSpatialLayout(widthMetres, lengthMetres, transform) || !transform) {
    return null;
  }

  const storageType = resolveSectionStorageType(section.storage_type ?? "");
  const dimensions = getFootprintDimensions(
    widthMetres!,
    lengthMetres!,
    transform.rotation_y,
  );

  return {
    id: section.section_id,
    name: section.section_code ?? section.section_name ?? "Sección",
    kind: "section",
    storage_type: storageType?.textValue as ExistingEntity["storage_type"],
    position_x: transform.position_x,
    position_y: transform.position_y,
    position_z: transform.position_z,
    ...dimensions,
  };
};

export const mapLotResponseToLayoutEntity = (
  lot: LotListItemResponse,
): ExistingEntity | null => {
  const transform = resolveTransform(lot);
  const widthMetres = toFiniteNumber(lot.width_metres);
  const lengthMetres = toFiniteNumber(lot.length_metres);

  if (!hasSpatialLayout(widthMetres, lengthMetres, transform) || !transform) {
    return null;
  }
  const dimensions = getFootprintDimensions(
    widthMetres!,
    lengthMetres!,
    transform.rotation_y,
  );

  return {
    id: lot.lot_id,
    name: lot.code ?? "Tramo",
    kind: "lot",
    position_x: transform.position_x,
    position_y: transform.position_y,
    position_z: transform.position_z,
    ...dimensions,
  };
};

export const mapRackResponseToLayoutEntity = (
  rack: RackListItemResponse,
): ExistingEntity | null => {
  const transform = resolveTransform(rack);
  const widthMetres = toFiniteNumber(rack.width_metres);
  const lengthMetres = toFiniteNumber(rack.length_metres);

  if (!hasSpatialLayout(widthMetres, lengthMetres, transform) || !transform) {
    return null;
  }
  const dimensions = getFootprintDimensions(
    widthMetres!,
    lengthMetres!,
    transform.rotation_y,
  );

  return {
    id: rack.rack_id,
    name: rack.code,
    kind: "rack",
    position_x: transform.position_x,
    position_y: transform.position_y,
    position_z: transform.position_z,
    ...dimensions,
  };
};

export const mapSectionsToLayoutEntities = (
  sections: Array<SectionResponse | SectionDto>,
): ExistingEntity[] =>
  sections
    .map(mapSectionResponseToLayoutEntity)
    .filter((entity): entity is ExistingEntity => entity != null);

export const mapLotsToLayoutEntities = (
  lots: LotListItemResponse[],
): ExistingEntity[] =>
  lots
    .map(mapLotResponseToLayoutEntity)
    .filter((entity): entity is ExistingEntity => entity != null);

export const mapRacksToLayoutEntities = (
  racks: RackListItemResponse[],
): ExistingEntity[] =>
  racks
    .map(mapRackResponseToLayoutEntity)
    .filter((entity): entity is ExistingEntity => entity != null);
