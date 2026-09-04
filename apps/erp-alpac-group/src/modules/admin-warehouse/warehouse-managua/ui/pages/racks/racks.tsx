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
import { Button } from "@alpac/design-system";
import type { FormValues as RackFormValues } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/rack-modal/types/rack-modal.types";
import { RackStatusEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import { RackUsageProfileEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";
import type { CreateRacksRequest, RackPlacementCommand } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-racks-req";
import type { PlacementDraft } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d.types";
import {
  isUnavailableStatus,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/rack-modal/utils/rack.utils";
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
import { LAYOUT_FETCH_PAGE_SIZE } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d.constants";

const PAGE_SIZE = 10;
const FALLBACK_SECTION_SIZE_METRES = 50;

export function RacksPage() {
  const { warehouseId = "", sectionId = "" } = useParams<{
    warehouseId: string;
    sectionId: string;
  }>();
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { alertState, handleCloseAlert, handleRequestError, handleRequestSuccess } = useAlertState();
  const [isRackModalOpen, setIsRackModalOpen] = useState(false);
  const [pendingFormValues, setPendingFormValues] = useState<RackFormValues | null>(null);
  const [placementDraft, setPlacementDraft] = useState<PlacementDraft | null>(null);
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
      level_number: 1,
      usage_profile: null,
      status: null,
      page_number: 1,
      page_size: LAYOUT_FETCH_PAGE_SIZE,
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

  const { GetRacks, GetSectionById, CreateRacks } = useWarehouseAdmin({
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
    (spatialDraft: SpatialDraft) => {
      if (!pendingFormValues) return;

      const baseWidth = Number(
        pendingFormValues.levels[0]?.width_metres,
      );
      const baseLength = Number(
        pendingFormValues.levels[0]?.length_metres,
      );
      let accumulatedHeight = 0;

      const placement_racks: RackPlacementCommand[] = pendingFormValues.levels.map(
        (level, index) => {
          const usageProfileOption = Object.values(RackUsageProfileEnum).find(
            (option) => option.value === Number(level.usage_profile),
          );
          const statusOption = Object.values(RackStatusEnum).find(
            (option) => option.value === Number(level.status),
          );
          const heightMetres = Number(level.height_metres);
          const positionY = accumulatedHeight;
          accumulatedHeight += heightMetres;

          return {
            code: pendingFormValues.shelf_code ?? "",
            level_number: Number(level.level_number) || index + 1,
            row_number: 1,
            width_metres: baseWidth,
            length_metres: baseLength,
            height_metres: heightMetres,
            usage_profile: usageProfileOption
              ? usageProfileOption.textValue
              : RackUsageProfileEnum.ActiveFlow.textValue,
            max_pulleys: Number(level.max_pulleys),
            status: statusOption
              ? statusOption.textValue
              : RackStatusEnum.Available.textValue,
            layout_transform_3d_dto: {
              position_x: spatialDraft.position_x,
              position_y: positionY,
              position_z: spatialDraft.position_z,
              rotation_y: spatialDraft.rotation_y ?? 0,
            },
            unavailable_reason: isUnavailableStatus(Number(level.status))
              ? (level.unavailable_reason ?? null)
              : null,
          };
        },
      );

      const payload: CreateRacksRequest = {
        company_id: companyId,
        module_code: moduleCode,
        section_id: sectionId,
        placement_racks,
      };

      CreateRacks.mutate(payload, {
        onSuccess: () => {
          handleRequestSuccess("Racks registrados exitosamente.");
          const firstRack = payload.placement_racks[0];
          if (firstRack?.code) {
            setSessionEntities((current) => [
              ...current,
              buildRackLayoutEntity({
                id: `${firstRack.code}-${current.length}`,
                name: firstRack.code,
                spatialDraft,
              }),
            ]);
          }
          setPendingFormValues(null);
          setPlacementDraft(null);
        },
        onError: (error) => {
          const mappedError = getMappedError(error);
          handleRequestError(mappedError.description);
        }
      });
    },
    [pendingFormValues, companyId, moduleCode, sectionId, CreateRacks, handleRequestSuccess, handleRequestError, getMappedError],
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
      {(GetRacks.isPending || GetSectionById.isPending || CreateRacks.isPending) && (
        <Loader
          title={
            CreateRacks.isPending
              ? "Registrando racks..."
              : "Cargando racks..."
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

      <RacksHeader warehouseId={warehouseId} sectionId={sectionId} />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Acciones</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Registre nuevos racks
            </small>
          </div>
          <Button
            label="Añadir Racks"
            onClick={() => setIsRackModalOpen(true)}
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
              message="El área de esta sección ya está completamente ocupada. No es posible dibujar más bases de racks. Puede apilar niveles sobre un rack existente al crearlo."
            />
          ) : (
            <>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Primero añada los racks y luego ubique la base dentro de la sección
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
                placementDraft={placementDraft}
                isSaving={CreateRacks.isPending}
                onPlacementConfirm={handleRackCreated}
                onPlacementCancel={() => {
                  setPendingFormValues(null);
                  setPlacementDraft(null);
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
        onClose={() => {
          setIsRackModalOpen(false);
        }}
        onSubmit={(formValues) => {
          setPendingFormValues(formValues);
          setPlacementDraft({
            width_metres: Number(formValues.levels[0]?.width_metres ?? 0),
            length_metres: Number(formValues.levels[0]?.length_metres ?? 0),
            rotation_y: 0,
          });
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
