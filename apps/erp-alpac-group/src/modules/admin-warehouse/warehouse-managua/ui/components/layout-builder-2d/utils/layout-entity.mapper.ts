import type { ExistingEntity } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d.types";
import type { SpatialDraft } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d.types";
import type { SectionStorageTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import type { SectionResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-res";
import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { RackListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-res";
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
  position_z: spatialDraft.position_z,
  width_metres: spatialDraft.width_metres,
  length_metres: spatialDraft.length_metres,
});

const hasSpatialLayout = (
  widthMetres?: number | null,
  lengthMetres?: number | null,
  layout?: { position_x: number; position_z: number } | null,
) =>
  typeof widthMetres === "number" &&
  typeof lengthMetres === "number" &&
  widthMetres > 0 &&
  lengthMetres > 0 &&
  layout != null &&
  typeof layout.position_x === "number" &&
  typeof layout.position_z === "number";

export const mapSectionResponseToLayoutEntity = (
  section: SectionResponse,
): ExistingEntity | null => {
  if (
    !hasSpatialLayout(
      section.width_metres,
      section.length_metres,
      section.transform,
    )
  ) {
    return null;
  }

  const storageType = resolveSectionStorageType(section.storage_type ?? "");

  return {
    id: section.section_id,
    name: section.section_code ?? section.section_name ?? "Sección",
    kind: "section",
    storage_type: storageType?.textValue,
    position_x: section.transform!.position_x,
    position_z: section.transform!.position_z,
    width_metres: section.width_metres!,
    length_metres: section.length_metres!,
  };
};

export const mapLotResponseToLayoutEntity = (
  lot: LotListItemResponse,
): ExistingEntity | null => {
  if (!hasSpatialLayout(lot.width_metres, lot.length_metres, lot.transform)) {
    return null;
  }

  return {
    id: lot.lot_id,
    name: lot.code ?? "Tramo",
    kind: "lot",
    position_x: lot.transform!.position_x,
    position_z: lot.transform!.position_z,
    width_metres: lot.width_metres,
    length_metres: lot.length_metres,
  };
};

export const mapRackResponseToLayoutEntity = (
  rack: RackListItemResponse,
): ExistingEntity | null => {
  if (
    !hasSpatialLayout(
      rack.width_metres,
      rack.length_metres,
      rack.transform,
    )
  ) {
    return null;
  }

  return {
    id: rack.rack_id,
    name: rack.code,
    kind: "rack",
    position_x: rack.transform!.position_x,
    position_z: rack.transform!.position_z,
    width_metres: rack.width_metres!,
    length_metres: rack.length_metres!,
  };
};

export const mapSectionsToLayoutEntities = (
  sections: SectionResponse[],
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
