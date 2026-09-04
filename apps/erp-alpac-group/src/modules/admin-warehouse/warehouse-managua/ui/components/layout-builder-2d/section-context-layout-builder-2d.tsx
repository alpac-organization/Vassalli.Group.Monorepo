import { useMemo } from "react";
import { Alert } from "@alpac/design-system";
import type { GetWarehouseByIdRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouse-by-id.req";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useWarehouseLayoutSections } from "../../hooks/useWarehouseLayoutSections";
import { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import {
  LayoutBuilder2D,
  type LayoutBuilder2DProps,
} from "./layout-builder-2d";

interface Props
  extends Omit<
    LayoutBuilder2DProps,
    "containerWidthMetres" | "containerLengthMetres" | "warehouseContext"
  > {
  companyId: string;
  moduleCode: string;
  warehouseId: string;
  sectionId: string;
  sectionWidthMetres: number;
  sectionLengthMetres: number;
}

export function SectionContextLayoutBuilder2D({
  companyId,
  moduleCode,
  warehouseId,
  sectionId,
  sectionWidthMetres,
  sectionLengthMetres,
  ...builderProps
}: Props) {
  const getWarehouseByIdPayload = useMemo<GetWarehouseByIdRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
    }),
    [companyId, moduleCode, warehouseId],
  );
  const { GetWarehouseById } = useWarehouse({ getWarehouseByIdPayload });
  const sectionsQuery = useWarehouseLayoutSections({
    companyId,
    moduleCode,
    warehouseId,
  });
  const selectedSection = sectionsQuery.entities.find(
    (section) => section.id === sectionId,
  );
  const visibleStorageType =
    builderProps.entityKind === "lot"
      ? SectionStorageTypeEnum.Lots.textValue
      : builderProps.entityKind === "rack"
        ? SectionStorageTypeEnum.Racks.textValue
        : null;
  const visibleSections = sectionsQuery.entities.filter(
    (section) =>
      section.id === sectionId ||
      !visibleStorageType ||
      section.storage_type === visibleStorageType,
  );
  const warehouseWidth = GetWarehouseById.data?.details.width_metres;
  const warehouseLength = GetWarehouseById.data?.details.length_metres;
  const hasContext =
    Boolean(selectedSection) &&
    Number(warehouseWidth) > 0 &&
    Number(warehouseLength) > 0;

  if (
    !GetWarehouseById.isPending &&
    !sectionsQuery.isPending &&
    !hasContext
  ) {
    return (
      <Alert
        type="warning"
        title="Plano global no disponible"
        message="La sección no tiene una transformación espacial válida. No es seguro ubicar elementos hasta configurar su posición en el almacén."
      />
    );
  }

  return (
    <LayoutBuilder2D
      {...builderProps}
      containerWidthMetres={sectionWidthMetres}
      containerLengthMetres={sectionLengthMetres}
      warehouseContext={
        hasContext && selectedSection
          ? {
              warehouseWidthMetres: Number(warehouseWidth),
              warehouseLengthMetres: Number(warehouseLength),
              sections: visibleSections,
              selectedSectionId: sectionId,
              selectedSectionTransform: {
                position_x: selectedSection.position_x,
                position_y: selectedSection.position_y ?? 0,
                position_z: selectedSection.position_z,
                rotation_y: selectedSection.rotation_y ?? 0,
              },
            }
          : undefined
      }
    />
  );
}
