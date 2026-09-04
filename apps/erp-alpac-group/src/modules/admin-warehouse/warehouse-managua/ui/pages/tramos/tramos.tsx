import { m } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, AnimatedAlertWrapper } from "@alpac/design-system";
import { useParams } from "react-router-dom";
import { TramosHeader } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/components/tramos-header/tramos-header";
import { TramosFiltersBar } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/components/tramos-filters/tramos-filters";
import { TramosTable } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/components/tramos-table/tramos-table";
import { LotModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/lot-modal/lot-modal";
import { LotDetailModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/lot-detail-modal/lot-detail-modal";
import { LayoutBuilder2D, type ExistingEntity, type SpatialDraft } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d";
import { Button } from "@alpac/design-system";
import type { FormValues as LotFormValues } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/lot-modal/types/lot-modal.types";
import { RackStatusEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import type { PlacementDraft } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d.types";
import {
  isUnavailableStatus,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/lot-modal/utils/lots.utils";
import type {
  CreateLotsRequest,
  LotPlacementCommand,
} from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";
import {
  buildLotLayoutEntity,
  mapLotsToLayoutEntities,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/utils/layout-entity.mapper";
import {
  EMPTY_TRAMO_FILTERS,
  type TramoFilters,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/types/tramos.types";
import { filtersToGetLotsParams } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/utils/filter-tramos";
import { useWarehouseAdmin } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useWarehouseAdmin";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { GetLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-req";
import type { GetSectionByIdRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-section-ById";
import { LAYOUT_FETCH_PAGE_SIZE } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d.constants";

const PAGE_SIZE = 10;
const FALLBACK_SECTION_SIZE_METRES = 50;

export function TramosPage() {
  const { warehouseId = "", sectionId = "" } = useParams<{
    warehouseId: string;
    sectionId: string;
  }>();
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { alertState, handleCloseAlert, handleRequestError, handleRequestSuccess } = useAlertState();
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [pendingFormValues, setPendingFormValues] = useState<LotFormValues | null>(null);
  const [placementDraft, setPlacementDraft] = useState<PlacementDraft | null>(null);
  const [sessionEntities, setSessionEntities] = useState<ExistingEntity[]>([]);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<TramoFilters>(EMPTY_TRAMO_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const getLotsPayload = useMemo<GetLotsRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      section_id: sectionId,
      ...filtersToGetLotsParams(appliedFilters),
      page_number: currentPage,
      page_size: PAGE_SIZE,
    }),
    [companyId, moduleCode, sectionId, appliedFilters, currentPage],
  );

  const getLayoutLotsPayload = useMemo<GetLotsRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      section_id: sectionId,
      page_number: 1,
      page_size: LAYOUT_FETCH_PAGE_SIZE,
    }),
    [companyId, moduleCode, sectionId],
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

  const getSectionByIdPayload = useMemo<GetSectionByIdRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
      section_id: sectionId,
    }),
    [companyId, moduleCode, warehouseId, sectionId],
  );

  const { GetLots, GetLotById, GetSectionById, CreateLots } = useWarehouseAdmin({
    getLotsPayload,
    getLotDetailPayload,
    getSectionByIdPayload,
  });

  const { GetLots: GetLayoutLots } = useWarehouseAdmin({
    getLotsPayload: getLayoutLotsPayload,
  });

  const tramosData = GetLots.data?.data ?? [];
  const totalRecords = GetLots.data?.total ?? 0;

  const sectionWidthMetres =
    GetSectionById.data?.width_metres && GetSectionById.data.width_metres > 0
      ? GetSectionById.data.width_metres
      : FALLBACK_SECTION_SIZE_METRES;

  const sectionLengthMetres =
    GetSectionById.data?.length_metres && GetSectionById.data.length_metres > 0
      ? GetSectionById.data.length_metres
      : FALLBACK_SECTION_SIZE_METRES;

  const sectionTotalArea = GetSectionById.data?.total_area_m2 ?? 0;
  const sectionUsedArea = GetSectionById.data?.used_area_m2 ?? 0;
  const isSectionFull =
    sectionTotalArea > 0 && sectionUsedArea >= sectionTotalArea;

  const layoutEntities = useMemo(() => {
    const fromApi = mapLotsToLayoutEntities(GetLayoutLots.data?.data ?? []);
    const apiNames = new Set(fromApi.map((entity) => entity.name));
    const pendingSession = sessionEntities.filter(
      (entity) => !apiNames.has(entity.name),
    );
    return [...fromApi, ...pendingSession];
  }, [GetLayoutLots.data?.data, sessionEntities]);

  useEffect(() => {
    if (!GetLots.isError || !GetLots.error) return;
    const mappedError = getMappedError(GetLots.error as ApiErrorResponse);
    handleRequestError(mappedError.description);
  }, [GetLots.isError, GetLots.error, getMappedError, handleRequestError]);

  useEffect(() => {
    if (!GetSectionById.isError || !GetSectionById.error) return;
    const mappedError = getMappedError(
      GetSectionById.error as ApiErrorResponse,
    );
    handleRequestError(
      mappedError.description || "Error al cargar la sección",
    );
  }, [
    GetSectionById.isError,
    GetSectionById.error,
    getMappedError,
    handleRequestError,
  ]);

  const handleApplyFilters = useCallback((filters: TramoFilters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_TRAMO_FILTERS);
    setCurrentPage(1);
  }, []);

  const handleLotCreated = useCallback(
    (spatialDraft: SpatialDraft) => {
      if (!pendingFormValues) return;

      const statusOption = Object.values(RackStatusEnum).find(
        (option) => option.value === Number(pendingFormValues.status),
      );
      const status = statusOption
        ? statusOption.textValue
        : RackStatusEnum.Available.textValue;

      const placement: LotPlacementCommand = {
        code: pendingFormValues.code.trim(),
        width_metres: Number(pendingFormValues.width_metres),
        length_metres: Number(pendingFormValues.length_metres),
        nominal_rows: Number(pendingFormValues.nominal_rows),
        nominal_columns: Number(pendingFormValues.nominal_columns),
        allows_stacking: pendingFormValues.allows_stacking,
        status,
        layout_transform_3d_dto: {
          position_x: spatialDraft.position_x,
          position_y: 0,
          position_z: spatialDraft.position_z,
          rotation_y: spatialDraft.rotation_y ?? 0,
        },
        unavailable_reason: isUnavailableStatus(Number(pendingFormValues.status))
          ? (pendingFormValues.unavailable_reason ?? null)
          : null,
      };

      const payload: CreateLotsRequest = {
        company_id: companyId,
        module_code: moduleCode,
        section_id: sectionId,
        placements_lots: [placement],
      };

      CreateLots.mutate(payload, {
        onSuccess: () => {
          handleRequestSuccess("Tramo registrado exitosamente.");
          setSessionEntities((current) => [
            ...current,
            buildLotLayoutEntity({
              id: `session-${placement.code}-${current.length}`,
              name: placement.code,
              spatialDraft,
            }),
          ]);
          setPendingFormValues(null);
          setPlacementDraft(null);
        },
        onError: (error) => {
          const mappedError = getMappedError(error);
          handleRequestError(mappedError.description);
        }
      });
    },
    [pendingFormValues, companyId, moduleCode, sectionId, CreateLots, handleRequestSuccess, handleRequestError, getMappedError],
  );

  const handleViewDetail = useCallback((lot: LotListItemResponse) => {
    setSelectedLotId(lot.lot_id);
    setIsDetailModalOpen(true);
  }, []);

  const sectionLabel =
    GetSectionById.data?.section_code ??
    GetSectionById.data?.section_name ??
    null;

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
      {(GetLots.isPending || GetSectionById.isPending || CreateLots.isPending) && (
        <Loader
          title={
            CreateLots.isPending
              ? "Registrando tramos..."
              : "Cargando tramos..."
          }
        />
      )}

      <AnimatedAlertWrapper open={alertState?.open ?? false}>
        <Alert
          type={alertState?.type ?? "info"}
          title={alertState?.title}
          message={alertState?.message ?? ""}
          onClose={handleCloseAlert}
        />
      </AnimatedAlertWrapper>

      <TramosHeader warehouseId={warehouseId} sectionId={sectionId} />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Acciones</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Registre nuevos tramos
            </small>
          </div>
          <Button
            label="Añadir Tramo"
            onClick={() => setIsLotModalOpen(true)}
            disabled={isSectionFull}
            size="small"
            className="bg-alpac-primary-500 hover:bg-alpac-primary-600 text-white rounded-md px-4 py-2"
          />
        </div>

        <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
          {isSectionFull ? (
            <Alert
              type="warning"
              title="Sección sin espacio disponible"
              message="El área de esta sección ya está completamente ocupada por otros tramos. No es posible registrar más tramos."
            />
          ) : (
            <>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                Primero añada el tramo y luego ubíquelo dentro de la sección
                {sectionLabel ? ` (${sectionLabel})` : ""}. El plano usa el
                tamaño real de la sección ({sectionWidthMetres.toFixed(1)}m ×{" "}
                {sectionLengthMetres.toFixed(1)}m).
              </p>
              <LayoutBuilder2D
                containerWidthMetres={sectionWidthMetres}
                containerLengthMetres={sectionLengthMetres}
                entityKind="lot"
                existingEntities={layoutEntities}
                placementDraft={placementDraft}
                isSaving={CreateLots.isPending}
                onPlacementConfirm={handleLotCreated}
                onPlacementCancel={() => {
                  setPendingFormValues(null);
                  setPlacementDraft(null);
                }}
              />
            </>
          )}
        </div>
      </div>

      <TramosFiltersBar
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <TramosTable
        data={tramosData}
        currentPage={currentPage}
        totalRecords={totalRecords}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        onViewDetail={handleViewDetail}
        isFetching={GetLots.isFetching}
      />

      <LotModal
        isOpen={isLotModalOpen}
        onClose={() => {
          setIsLotModalOpen(false);
        }}
        onSubmit={(formValues) => {
          setPendingFormValues(formValues);
          setPlacementDraft({
            width_metres: Number(formValues.width_metres ?? 0),
            length_metres: Number(formValues.length_metres ?? 0),
            rotation_y: 0,
          });
        }}
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
