import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Group, Rect } from "react-konva";
import { SaveIcon } from "lucide-react";
import { Button } from "@alpac/design-system";
import { LegendItem } from "@app/shared/components/legend-item/legend-item";
import { LotShape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lot-shape/lot-shape";
import { LotShapeMenu } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lot-shape/components/lot-shape-menu/lot-shape-menu";
import { WarehouseShape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape";
import { createMockGaleron } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-shape/galeron-shape.types";
import { PIXELS_PER_METER } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/warehouse-config";
import { RACK_STATUS_LEGEND } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";
import { useLot } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useLot";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";

import type {
  EditMode,
  LotCoordinate,
  LotSize,
  LotViewerProps,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lot-viewer/lot-viewer.types";
import type { LotDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { LotMenuState } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lot-shape/components/lot-shape-menu/lot-shape-menu.types";
import type { UpdateLotCoordinatesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/update-lot-coordinates-req";

const round2 = (value: number) => Math.round(value * 100) / 100;

const hasNumericChange = (
  current: number | null | undefined,
  next: number,
): boolean => {
  if (current == null) return true;
  return round2(current) !== round2(next);
};

export const LotViewer = ({
  className,
  warehouse,
  lots = [],
  selectedLot,
  onSelectLot,
  sectionCode,
  sectionWidth = 0,
  sectionLength = 0,
  sectionPositionX = 0,
  sectionPositionY = 0,
  sectionIsActive = true,
}: LotViewerProps) => {
  const { warehouseId = "", sectionId = "" } = useParams<{
    warehouseId: string;
    sectionId: string;
  }>();
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const {
    handleRequestError,
    handleRequestSuccess,
    AlertComponent,
  } = useAlertState();
  const { RegisterLotCoordinates, UpdateLotCoordinates } = useLot();

  const [editMode, setEditMode] = useState<EditMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<LotCoordinate>({});
  const [sizes, setSizes] = useState<LotSize>({});
  const [menu, setMenu] = useState<LotMenuState | null>(null);
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    null,
  );
  const [internalSelectedCode, setInternalSelectedCode] = useState<
    string | null
  >(null);

  const activeSelectedId = selectedLot?.id ?? internalSelectedId;
  const activeSelectedCode = selectedLot?.code ?? internalSelectedCode;
  const resolvedWarehouseId = warehouse?.warehouse_id ?? warehouseId;

  const width = warehouse?.width ?? 0;
  const length = warehouse?.length ?? 0;
  const margins = {
    top: warehouse?.margin_top ?? 0,
    bottom: warehouse?.margin_bottom ?? 0,
    left: warehouse?.margin_left ?? 0,
    right: warehouse?.margin_right ?? 0,
  };

  const hasSectionDimensions = sectionWidth > 0 && sectionLength > 0;
  const isVerticalSection = sectionLength >= sectionWidth;

  const getCoordinates = (id: string, index: number, lot: LotDto) => {
    if (coordinates[id]) return coordinates[id];

    const spacing = isVerticalSection ? (lot.length || 0) : (lot.width || 0);
    return isVerticalSection
      ? { x: 0, y: index * spacing }
      : { x: index * spacing, y: 0 };
  };

  const getSize = (id: string, lot: LotDto) =>
    sizes[id] ?? {
      width: lot.width || 0,
      length: lot.length || 0,
    };

  const resetEditState = (lotId?: string | null) => {
    setEditMode(null);
    setEditingId(null);

    if (!lotId) return;

    setCoordinates((prev) => {
      const { [lotId]: _, ...rest } = prev;
      return rest;
    });
    setSizes((prev) => {
      const { [lotId]: _, ...rest } = prev;
      return rest;
    });
  };

  const hasPendingLayoutEdit = editMode === "edit" && editingId != null;

  const notifyPendingLayoutEdit = () => {
    handleRequestError(
      "Guarde o cancele los cambios del tramo actual antes de editar otro.",
    );
  };

  const handleContextMenu = (next: LotMenuState) => {
    if (hasPendingLayoutEdit && editingId !== next.lot.id) {
      notifyPendingLayoutEdit();
      return;
    }

    setInternalSelectedId(next.lot.id);
    setInternalSelectedCode(next.lot.code);
    onSelectLot?.(next.lot);
    setMenu(next);
  };

  const handleEdit = (lot: LotDto) => {
    if (hasPendingLayoutEdit && editingId !== lot.id) {
      notifyPendingLayoutEdit();
      return;
    }

    setEditingId(lot.id);
    setEditMode("edit");
    setInternalSelectedId(lot.id);
    setInternalSelectedCode(lot.code);
  };

  const handleSelect = (lot: LotDto) => {
    if (hasPendingLayoutEdit && editingId !== lot.id) {
      notifyPendingLayoutEdit();
      return;
    }

    setInternalSelectedId(lot.id);
    setInternalSelectedCode(lot.code);
    onSelectLot?.(lot);

    if (!hasPendingLayoutEdit) {
      setEditMode(null);
    }
  };

  const handleUpdateLotLayout = () => {
    if (
      !editingId ||
      !companyId ||
      !moduleCode ||
      !resolvedWarehouseId ||
      !sectionId
    )
      return;

    const lot = lots.find((item) => item.id === editingId);
    if (!lot) return;

    const nextCoordinate = coordinates[editingId];

    const nextX = nextCoordinate?.x ?? lot.position_x ?? 0;
    const nextY = nextCoordinate?.y ?? lot.position_y ?? 0;
    const nextZ = lot.position_z ?? 0;
    const nextRotation = lot.rotation_y ?? 0;

    const hasCoordinateChanges =
      nextCoordinate != null &&
      (hasNumericChange(lot.position_x, nextCoordinate.x) ||
        hasNumericChange(lot.position_y, nextCoordinate.y));

    if (!hasCoordinateChanges) {
      resetEditState(editingId);
      return;
    }

    const hasExistingCoordinates =
      lot.position_x != null && lot.position_y != null;

    const payload: UpdateLotCoordinatesRequest = {
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: resolvedWarehouseId,
      section_id: sectionId,
      lot_id: editingId,
      position_x: round2(nextX),
      position_y: round2(nextY),
      position_z: round2(nextZ),
      rotation_y: round2(nextRotation),
    };

    const mutation = hasExistingCoordinates
      ? UpdateLotCoordinates
      : RegisterLotCoordinates;

    mutation.mutate(payload, {
      onSuccess() {
        handleRequestSuccess("Layout del tramo actualizado exitosamente.");
        resetEditState(editingId);
      },
      onError(error) {
        const mappedError = getMappedError(error);
        handleRequestError(mappedError.description);
      },
    });
  };

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [menu]);

  useEffect(() => {
    if (editMode == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        resetEditState(editingId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editMode, editingId]);

  const isSaving =
    RegisterLotCoordinates.isPending || UpdateLotCoordinates.isPending;

  return (
    <section
      className={`w-full rounded-lg gap-3 p-6 overflow-visible border border-slate-600 hover:border-neutral-600 bg-white dark:bg-[#272b34] ${className ?? ""}`}
    >
      {AlertComponent}

      <div className="flex lg:justify-between items-center mb-4 flex-wrap">
        <div>
          <h4 className="font-bold m-0! p-0!">Plano de la bodega</h4>
          <span className="text-sm text-gray-400 m-0! p-0!">
            Sección: {sectionCode ?? "—"} · Tramo: {activeSelectedCode ?? "—"}
          </span>
        </div>
        {editMode === "edit" && (
          <Button
            type="button"
            size="giant"
            label="Guardar cambios"
            icon={<SaveIcon size={20} />}
            className="w-full! lg:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={handleUpdateLotLayout}
            disabled={isSaving}
            isLoading={isSaving}
          />
        )}
      </div>

      <WarehouseShape
        width={width}
        length={length}
        galerons={
          width > 0 && length > 0 ? [createMockGaleron(width, length)] : []
        }
        draggable={editMode == null}
        marginTop={margins.top}
        marginBottom={margins.bottom}
        marginLeft={margins.left}
        marginRight={margins.right}
      >
        {hasSectionDimensions && (
          <Group
            x={sectionPositionX * PIXELS_PER_METER}
            y={sectionPositionY * PIXELS_PER_METER}
          >
            <Rect
              width={sectionWidth * PIXELS_PER_METER}
              height={sectionLength * PIXELS_PER_METER}
              fill={
                sectionIsActive
                  ? "rgba(56, 189, 248, 0.06)"
                  : "rgba(245, 158, 11, 0.08)"
              }
              stroke={sectionIsActive ? "#38bdf8" : "#f59e0b"}
              strokeWidth={1}
              cornerRadius={1}
            />

            {lots.map((lot, index) => {
              const coordinate = coordinates[lot.id];
              const size = sizes[lot.id];
              const fallbackCoordinate = getCoordinates(lot.id, index, lot);
              const fallbackSize = getSize(lot.id, lot);

              return (
                <LotShape
                  key={lot.id}
                  lot={lot}
                  x={coordinate?.x ?? lot.position_x ?? fallbackCoordinate.x}
                  y={coordinate?.y ?? lot.position_y ?? fallbackCoordinate.y}
                  width={size?.width ?? lot.width ?? fallbackSize.width}
                  length={size?.length ?? lot.length ?? fallbackSize.length}
                  rotation={lot.rotation_y ?? 0}
                  selected={activeSelectedId === lot.id}
                  draggable={editMode === "edit" && editingId === lot.id}
                  resizable={editMode === "edit" && editingId === lot.id}
                  onSelect={handleSelect}
                  onContextMenu={handleContextMenu}
                  onCoordinateChange={(id, nextX, nextY) =>
                    setCoordinates((prev) => ({
                      ...prev,
                      [id]: { x: nextX, y: nextY },
                    }))
                  }
                  onResizeChange={(id, nextWidth, nextLength) =>
                    setSizes((prev) => ({
                      ...prev,
                      [id]: { width: nextWidth, length: nextLength },
                    }))
                  }
                />
              );
            })}
          </Group>
        )}
      </WarehouseShape>

      <LotShapeMenu menu={menu} setMenu={setMenu} onEdit={handleEdit} />

      <div className="flex gap-x-4 gap-y-1 items-center justify-between mt-2 flex-wrap">
        <div className="flex gap-x-4 gap-y-1 items-center flex-wrap">
          {RACK_STATUS_LEGEND.map((item) => (
            <LegendItem key={item.text} text={item.text} color={item.color} />
          ))}
        </div>
      </div>
    </section>
  );
};
