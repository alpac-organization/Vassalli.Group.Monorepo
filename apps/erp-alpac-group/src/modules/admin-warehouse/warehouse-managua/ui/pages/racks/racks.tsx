import { m } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, AnimatedAlertWrapper } from "@alpac/design-system";
import { useParams } from "react-router-dom";
import { RacksHeader } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-header/racks-header";
import { RacksFiltersBar } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-filters/racks-filters";
import { RacksTable } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-table/racks-table";
import { RackModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/rack-modal/rack-modal";
import { RackDetailModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/rack-detail-modal/rack-detail-modal";
import { LayoutBuilder2D, type ExistingEntity, type SpatialDraft } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d";
import {
  buildRackLayoutEntity,
  mapRacksToLayoutEntities,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/utils/layout-entity.mapper";
import {
  EMPTY_RACK_FILTERS,
  type RackFilters,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/types/racks.types";
import { useWarehouseAdmin } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useWarehouseAdmin";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { RackListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-res";
import type { GetRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-racks";
import type { GetSectionByIdRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-section-ById";
import { filtersToGetRacksParams } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/filter-racks";

const PAGE_SIZE = 10;
const LAYOUT_PAGE_SIZE = 10;
const FALLBACK_SECTION_SIZE_METRES = 50;

export function RacksPage() {
  const { warehouseId = "", sectionId = "" } = useParams<{
    warehouseId: string;
    sectionId: string;
  }>();
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { alertState, handleCloseAlert, handleRequestError } = useAlertState();
  const [isRackModalOpen, setIsRackModalOpen] = useState(false);
  const [spatialDraft, setSpatialDraft] = useState<SpatialDraft | null>(null);
  const [sessionEntities, setSessionEntities] = useState<ExistingEntity[]>([]);
  const [selectedRack, setSelectedRack] = useState<RackListItemResponse | null>(
    null,
  );
  const [isPositionsModalOpen, setIsPositionsModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<RackFilters>(EMPTY_RACK_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const getRacksPayload = useMemo<GetRacksRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      section_id: sectionId,
      ...filtersToGetRacksParams(appliedFilters),
      page_number: currentPage,
      page_size: PAGE_SIZE,
    }),
    [companyId, moduleCode, sectionId, appliedFilters, currentPage],
  );

  const getLayoutRacksPayload = useMemo<GetRacksRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      section_id: sectionId,
      level_number: null,
      usage_profile: null,
      status: null,
      page_number: 1,
      page_size: LAYOUT_PAGE_SIZE,
    }),
    [companyId, moduleCode, sectionId],
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

  const { GetRacks, GetSectionById } = useWarehouseAdmin({
    getRacksPayload,
    getSectionByIdPayload,
  });

  const { GetRacks: GetLayoutRacks } = useWarehouseAdmin({
    getRacksPayload: getLayoutRacksPayload,
  });

  const racksData = GetRacks.data?.data ?? [];
  const totalRecords = GetRacks.data?.total ?? 0;

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
    const fromApi = mapRacksToLayoutEntities(GetLayoutRacks.data?.data ?? []);
    const apiNames = new Set(fromApi.map((entity) => entity.name));
    const pendingSession = sessionEntities.filter(
      (entity) => !apiNames.has(entity.name),
    );
    return [...fromApi, ...pendingSession];
  }, [GetLayoutRacks.data?.data, sessionEntities]);

  useEffect(() => {
    if (!GetRacks.isError || !GetRacks.error) return;
    const mappedError = getMappedError(GetRacks.error as ApiErrorResponse);
    handleRequestError(mappedError.description);
  }, [GetRacks.isError, GetRacks.error, getMappedError, handleRequestError]);

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

  const handleApplyFilters = useCallback((filters: RackFilters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_RACK_FILTERS);
    setCurrentPage(1);
  }, []);

  const handleRackCreated = useCallback(
    (code: string) => {
      if (!spatialDraft) {
        return;
      }

      setSessionEntities((current) => [
        ...current,
        buildRackLayoutEntity({
          id: `${code}-${current.length}`,
          name: code,
          spatialDraft,
        }),
      ]);
    },
    [spatialDraft],
  );

  const handleViewPositions = useCallback((rack: RackListItemResponse) => {
    setSelectedRack(rack);
    setIsPositionsModalOpen(true);
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
      {(GetRacks.isPending || GetSectionById.isPending) && (
        <Loader title="Cargando racks..." />
      )}

      <AnimatedAlertWrapper open={alertState?.open ?? false}>
        <Alert
          type={alertState?.type ?? "info"}
          title={alertState?.title}
          message={alertState?.message ?? ""}
          onClose={handleCloseAlert}
        />
      </AnimatedAlertWrapper>

      <RacksHeader warehouseId={warehouseId} sectionId={sectionId} />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Acciones</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Registre nuevos racks
            </small>
          </div>
        </div>

        <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
          {isSectionFull ? (
            <Alert
              type="warning"
              title="Sección sin espacio disponible"
              message="El área de esta sección ya está completamente ocupada. No es posible dibujar más bases de racks. Puede apilar niveles sobre un rack existente al crearlo."
            />
          ) : (
            <>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Dibuje la base del rack dentro de la sección
                {sectionLabel ? ` (${sectionLabel})` : ""}. El plano usa el
                tamaño real de la sección ({sectionWidthMetres.toFixed(1)}m ×{" "}
                {sectionLengthMetres.toFixed(1)}m). Los niveles adicionales se
                apilan verticalmente sobre esa base.
              </p>
              <LayoutBuilder2D
                containerWidthMetres={sectionWidthMetres}
                containerLengthMetres={sectionLengthMetres}
                entityKind="rack"
                existingEntities={layoutEntities}
                onDrawComplete={(draft) => {
                  setSpatialDraft(draft);
                  setIsRackModalOpen(true);
                }}
              />
            </>
          )}
        </div>
      </div>

      <RacksFiltersBar
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <RacksTable
        data={racksData}
        currentPage={currentPage}
        totalRecords={totalRecords}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        onViewPositions={handleViewPositions}
        isFetching={GetRacks.isFetching}
      />

      <RackModal
        isOpen={isRackModalOpen}
        sectionId={sectionId}
        spatialDraft={spatialDraft}
        onClose={() => {
          setIsRackModalOpen(false);
          setSpatialDraft(null);
        }}
        onSubmit={(payload) => {
          const firstRack = payload.placement_racks[0];
          if (firstRack?.code) {
            handleRackCreated(firstRack.code);
          }
        }}
      />

      <RackDetailModal
        isOpen={isPositionsModalOpen}
        rack={selectedRack}
        onClose={() => {
          setIsPositionsModalOpen(false);
          setSelectedRack(null);
        }}
      />
    </m.div>
  );
}
