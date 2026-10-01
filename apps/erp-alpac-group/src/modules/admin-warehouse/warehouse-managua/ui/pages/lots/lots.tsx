import { m } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@alpac/design-system";
import { Rows3 } from "lucide-react";
import { useParams } from "react-router-dom";
import { LotsHeader } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-header/lots-header";
import { LotsFiltersBar } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-filters/lots-filters";
import { LotsTable } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-table/lots-table";
import { LotViewer } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lot-viewer/lot-viewer";
import type { LotViewerLot } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lot-viewer/lot-viewer.types";
import type { LotPosition } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lot-shape/lot-shape.types";
import { LotModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-modal/lot-modal";
import { LotDetailModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-detail-modal/lot-detail-modal";
import {
  EMPTY_LOT_FILTERS,
  type LotFilters,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/types/lots.types";
import { filtersToGetLotsParams } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/utils/filter-lots";
import { useWarehouseAdmin } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useWarehouseAdmin";
import { useLotCapacitiesMap } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useLotCapacitiesMap";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { GetLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-req";

const PAGE_SIZE = 10;

export function TramosPage() {
  const { warehouseId = "", sectionId = "" } = useParams<{
    warehouseId: string;
    sectionId: string;
  }>();
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { AlertComponent, handleRequestError, handleRequestSuccess } =
    useAlertState();
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<LotFilters>(EMPTY_LOT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  /** Coordenadas editadas en el canvas, pendientes de persistir. */
  const [draftPositions, setDraftPositions] = useState<
    Record<string, LotPosition>
  >({});

  const getLotsPayload = useMemo<GetLotsRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
      section_id: sectionId,
      ...filtersToGetLotsParams(appliedFilters),
      page_number: currentPage,
      page_size: PAGE_SIZE,
    }),
    [companyId, moduleCode, warehouseId, sectionId, appliedFilters, currentPage],
  );

  const getLotDetailPayload = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      section_id: sectionId,
      lot_id: selectedLotId ?? "",
    }),
    [companyId, moduleCode, sectionId, selectedLotId],
  );

  // Layout completo para el canvas 2D: forma de la seccion + todos sus tramos.
  const getLotLayoutPayload = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
      section_id: sectionId,
    }),
    [companyId, moduleCode, warehouseId, sectionId],
  );

  const {
    GetLots,
    GetLotById,
    GetLotLayout,
    RegisterLotCoordinates,
    UpdateLotCoordinates,
  } = useWarehouseAdmin({
    getLotsPayload,
    getLotDetailPayload,
    getLotLayoutPayload,
  });

  const tramosData = useMemo(() => GetLots.data?.data ?? [], [GetLots.data]);
  const totalRecords = GetLots.data?.total ?? 0;

  const { capacitiesByLotId, isAnyLoading: capacitiesLoading } =
    useLotCapacitiesMap({
      warehouseId,
      sectionId,
      lots: tramosData,
    });

  const coordinatesLoading = GetLotLayout.isFetching;

  // El layout trae la forma real de la seccion y todos sus tramos.
  const sectionWidth = GetLotLayout.data?.section_width ?? 0;
  const sectionLength = GetLotLayout.data?.section_length ?? 0;
  const sectionCode = GetLotLayout.data?.section_code ?? null;
  const sectionPositionX = GetLotLayout.data?.section_position_x ?? 0;
  const sectionPositionY = GetLotLayout.data?.section_position_y ?? 0;
  const sectionIsActive = GetLotLayout.data?.section_is_active ?? true;

  useEffect(() => {
    if (!GetLots.isError || !GetLots.error) return;
    const mappedError = getMappedError(GetLots.error as ApiErrorResponse);
    handleRequestError(mappedError.description);
  }, [GetLots.isError, GetLots.error, getMappedError, handleRequestError]);

  // Los borradores son locales a la vista actual: se limpian al cambiar de
  // pagina, filtros o seccion, por eso se resetean en los handlers y no en un efecto.
  const handleApplyFilters = useCallback((filters: LotFilters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    setDraftPositions({});
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_LOT_FILTERS);
    setCurrentPage(1);
    setDraftPositions({});
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setDraftPositions({});
  }, []);

  const handleViewDetail = useCallback((lot: LotListItemResponse) => {
    setSelectedLotId(lot.id);
    setIsDetailModalOpen(true);
  }, []);

  /** Al seleccionar en el canvas solo se marca el tramo, sin abrir el detalle. */
  const handleSelectLotInCanvas = useCallback((lot: LotListItemResponse) => {
    setSelectedLotId((prev) => (prev === lot.id ? null : lot.id));
  }, []);

  const viewerLots = useMemo<LotViewerLot[]>(
    () =>
      (GetLotLayout.data?.lots ?? []).map((lotItem) => {
        // La tabla conserva su fan-out de capacidades; el layout trae las suyas.
        const capacity = capacitiesByLotId[lotItem.lot_id];

        const savedPosition: LotPosition | null = lotItem.has_coordinates
          ? {
              positionX: lotItem.position_x,
              positionY: lotItem.position_y,
              positionZ: lotItem.position_z,
              rotationY: lotItem.rotation_y,
            }
          : null;

        return {
          lot: {
            id: lotItem.lot_id,
            code: lotItem.code,
            status: lotItem.status,
            allows_stacking: lotItem.allows_stacking,
            unavailable_reason: null,
            status_changed_at: null,
          },
          width: capacity?.width ?? lotItem.width,
          length: capacity?.length ?? lotItem.length,
          savedPosition,
          draftPosition: draftPositions[lotItem.lot_id] ?? null,
        };
      }),
    [GetLotLayout.data?.lots, capacitiesByLotId, draftPositions],
  );

  const handlePositionChange = useCallback(
    (lotId: string, position: LotPosition) => {
      setDraftPositions((prev) => ({ ...prev, [lotId]: position }));
    },
    [],
  );

  const handleRotateLot = useCallback(
    (lotId: string) => {
      setDraftPositions((prev) => {
        const current =
          prev[lotId] ??
          viewerLots.find((entry) => entry.lot.id === lotId)
            ?.savedPosition ?? {
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            rotationY: 0,
          };

        const rotationY = (current.rotationY + 90) % 360;

        return {
          ...prev,
          [lotId]: { ...current, rotationY },
        };
      });
    },
    [viewerLots],
  );

  const handleDiscardPositions = useCallback(() => {
    setDraftPositions({});
  }, []);

  const isSavingPositions =
    RegisterLotCoordinates.isPending || UpdateLotCoordinates.isPending;

  const handleSavePositions = useCallback(async () => {
    const pendingEntries = Object.entries(draftPositions);
    if (pendingEntries.length === 0) return;

    try {
      await Promise.all(
        pendingEntries.map(([lotId, position]) => {
          const isExistingCoord = Boolean(
            GetLotLayout.data?.lots.find(
              (l) => l.lot_id === lotId && l.has_coordinates,
            ),
          );

          const payload = {
            company_id: companyId,
            module_code: moduleCode,
            warehouse_id: warehouseId,
            section_id: sectionId,
            lot_id: lotId,
            position_x: position.positionX,
            position_y: position.positionY,
            position_z: position.positionZ ?? 0,
            rotation_y: position.rotationY ?? 0,
          };

          return isExistingCoord
            ? UpdateLotCoordinates.mutateAsync(payload)
            : RegisterLotCoordinates.mutateAsync(payload);
        }),
      );

      setDraftPositions({});
      handleRequestSuccess(
        pendingEntries.length === 1
          ? "Coordenadas del tramo guardadas correctamente."
          : `Coordenadas de ${pendingEntries.length} tramos guardadas correctamente.`,
      );
    } catch (error) {
      const mappedError = getMappedError(error as ApiErrorResponse);
      handleRequestError(mappedError.description);
    }
  }, [
    companyId,
    moduleCode,
    warehouseId,
    sectionId,
    draftPositions,
    GetLotLayout.data?.lots,
    RegisterLotCoordinates,
    UpdateLotCoordinates,
    getMappedError,
    handleRequestError,
    handleRequestSuccess,
  ]);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 min-w-0 w-full"
    >
      {GetLots.isPending && <Loader title="Cargando tramos..." />}

      {AlertComponent}

      <LotsHeader warehouseId={warehouseId} sectionId={sectionId} />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Acciones</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Registre nuevos tramos
            </small>
          </div>
        </div>

        <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
          <Button
            type="button"
            size="giant"
            label="Registrar Nuevos Tramos"
            icon={<Rows3 size={20} />}
            className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={() => setIsLotModalOpen(true)}
          />
        </div>
      </div>

      <LotsFiltersBar
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <div className="grid grid-cols-1 gap-4 min-w-0 w-full lg:grid-cols-[3fr_2fr] lg:min-h-[calc(100vh-330px)]">
        <div className="flex h-full min-h-[100px] w-full min-w-0 flex-col lg:max-h-[calc(100vh-330px)]">
          <LotsTable
            data={tramosData}
            currentPage={currentPage}
            totalRecords={totalRecords}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
            onViewDetail={handleViewDetail}
            isFetching={GetLots.isFetching}
            capacitiesByLotId={capacitiesByLotId}
            capacitiesLoading={capacitiesLoading}
          />
        </div>

        <LotViewer
          className="min-h-[420px] min-w-0 overflow-y-auto"
          lots={viewerLots}
          sectionWidth={sectionWidth}
          sectionLength={sectionLength}
          sectionCode={sectionCode}
          sectionPositionX={sectionPositionX}
          sectionPositionY={sectionPositionY}
          sectionIsActive={sectionIsActive}
          selectedLotId={selectedLotId}
          isLoading={GetLotLayout.isPending || coordinatesLoading}
          isSaving={isSavingPositions}
          hasPendingChanges={Object.keys(draftPositions).length > 0}
          onSelectLot={handleSelectLotInCanvas}
          onPositionChange={handlePositionChange}
          onRotateLot={handleRotateLot}
          onSave={handleSavePositions}
          onDiscard={handleDiscardPositions}
        />
      </div>

      <LotModal
        isOpen={isLotModalOpen}
        warehouseId={warehouseId}
        sectionId={sectionId}
        onClose={() => setIsLotModalOpen(false)}
      />

      <LotDetailModal
        isOpen={isDetailModalOpen}
        lot={GetLotById.data ?? null}
        isLoading={GetLotById.isPending}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLotId(null);
        }}
      />
    </m.div>
  );
}
