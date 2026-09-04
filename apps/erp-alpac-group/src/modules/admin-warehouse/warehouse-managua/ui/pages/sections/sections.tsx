import { m } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, AnimatedAlertWrapper } from "@alpac/design-system";
import { useNavigate, useParams } from "react-router-dom";
import { SectionsHeader } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-header/sections-header";
import { SectionsFiltersBar } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-filters/sections-filters";
import { SectionsTable } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-table/sections-table";
import { SectionModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-modal/section-modal";
import {
  LayoutBuilder2D,
  type ExistingEntity,
  type SpatialDraft,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d";
import {
  buildSectionLayoutEntity,
  mapSectionsToLayoutEntities,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/utils/layout-entity.mapper";
import { createSectionCollisionValidator } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/validators/section-collision.validator";
import { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import type { SectionStorageTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import {
  EMPTY_SECTION_FILTERS,
  type SectionFilters,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-filters/types/sections-filters.types";
import { filtersToGetSectionsParams } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/utils/filter-sections";
import { useWarehouseAdmin } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useWarehouseAdmin";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { SectionResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-res";
import type { GetSectionsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-sections-req";
import type { GetWarehouseByIdRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouse-by-id.req";

const PAGE_SIZE = 10;
const LAYOUT_PAGE_SIZE = 10;
const FALLBACK_WAREHOUSE_SIZE_METRES = 50;

export function SectionsPage() {
  const { warehouseId = "" } = useParams<{ warehouseId: string }>();
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { alertState, handleCloseAlert, handleRequestError } = useAlertState();
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [spatialDraft, setSpatialDraft] = useState<SpatialDraft | null>(null);
  const [sessionEntities, setSessionEntities] = useState<ExistingEntity[]>([]);
  const [draftStorageType, setDraftStorageType] = useState<SectionStorageTypeValue>(
    SectionStorageTypeEnum.Lots.textValue,
  );
  const [appliedFilters, setAppliedFilters] = useState<SectionFilters>(
    EMPTY_SECTION_FILTERS,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const getSectionsPayload = useMemo<GetSectionsRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
      ...filtersToGetSectionsParams(appliedFilters),
      page_number: currentPage,
      page_size: PAGE_SIZE,
    }),
    [companyId, moduleCode, warehouseId, appliedFilters, currentPage],
  );

  const getLayoutSectionsPayload = useMemo<GetSectionsRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
      page_number: 1,
      page_size: LAYOUT_PAGE_SIZE,
    }),
    [companyId, moduleCode, warehouseId],
  );

  const getWarehouseByIdPayload = useMemo<GetWarehouseByIdRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
    }),
    [companyId, moduleCode, warehouseId],
  );

  const { GetSections } = useWarehouseAdmin({ getSectionsPayload });
  const { GetSections: GetLayoutSections } = useWarehouseAdmin({
    getSectionsPayload: getLayoutSectionsPayload,
  });
  const { GetWarehouseById } = useWarehouse({ getWarehouseByIdPayload });

  const sectionsData = GetSections.data?.data ?? [];
  const totalRecords = GetSections.data?.total ?? 0;

  const warehouseWidthMetres =
    GetWarehouseById.data?.details?.width_metres &&
    GetWarehouseById.data.details.width_metres > 0
      ? GetWarehouseById.data.details.width_metres
      : FALLBACK_WAREHOUSE_SIZE_METRES;

  const warehouseLengthMetres =
    GetWarehouseById.data?.details?.length_metres &&
    GetWarehouseById.data.details.length_metres > 0
      ? GetWarehouseById.data.details.length_metres
      : FALLBACK_WAREHOUSE_SIZE_METRES;

  const capacity = GetWarehouseById.data?.capacity;
  const totalAreaM2 = capacity?.total_area_m2 ?? 0;
  const usableAreaM2 = capacity?.usable_area_m2 ?? totalAreaM2;
  const occupiedAreaM2 = capacity?.occupied_area_m2 ?? 0;
  const isWarehouseFull =
    usableAreaM2 > 0 && occupiedAreaM2 >= usableAreaM2;

  const layoutEntities = useMemo(() => {
    const fromApi = mapSectionsToLayoutEntities(
      GetLayoutSections.data?.data ?? [],
    );
    const apiNames = new Set(fromApi.map((entity) => entity.name));
    const pendingSession = sessionEntities.filter(
      (entity) => !apiNames.has(entity.name),
    );
    return [...fromApi, ...pendingSession];
  }, [GetLayoutSections.data?.data, sessionEntities]);

  useEffect(() => {
    if (!GetSections.isError || !GetSections.error) return;
    try {
      const mappedError = getMappedError(GetSections.error as ApiErrorResponse);
      handleRequestError(
        mappedError?.description || "Error al cargar las secciones",
      );
    } catch {
      handleRequestError("Error al cargar las secciones");
    }
  }, [
    GetSections.isError,
    GetSections.error,
    getMappedError,
    handleRequestError,
  ]);

  const handleApplyFilters = useCallback((filters: SectionFilters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_SECTION_FILTERS);
    setCurrentPage(1);
  }, []);

  const sectionStorageTypeOptions = useMemo(
    () => [
      {
        value: SectionStorageTypeEnum.Lots.textValue,
        label: SectionStorageTypeEnum.Lots.label,
      },
      {
        value: SectionStorageTypeEnum.Racks.textValue,
        label: SectionStorageTypeEnum.Racks.label,
      },
    ],
    [],
  );

  const sectionCollisionValidator = useMemo(
    () => createSectionCollisionValidator(draftStorageType),
    [draftStorageType],
  );

  const handleSectionCreated = useCallback(
    (payload: {
      code: string;
      storage_type: SectionStorageTypeValue;
    }) => {
      if (!spatialDraft) {
        return;
      }

      setSessionEntities((current) => [
        ...current,
        buildSectionLayoutEntity({
          id: `session-${payload.code}-${current.length}`,
          name: payload.code,
          spatialDraft,
          storageType: payload.storage_type,
        }),
      ]);
    },
    [spatialDraft],
  );

  const handleViewLots = useCallback(
    (section: SectionResponse) => {
      navigate(
        `${baseUrl}/warehouse-admin/management/sections/${warehouseId}/lots/${section.section_id}`,
      );
    },
    [baseUrl, navigate, warehouseId],
  );

  const handleViewRacks = useCallback(
    (section: SectionResponse) => {
      navigate(
        `${baseUrl}/warehouse-admin/management/sections/${warehouseId}/racks/${section.section_id}`,
      );
    },
    [baseUrl, navigate, warehouseId],
  );

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
      {(GetSections.isPending ||
        GetLayoutSections.isPending ||
        GetWarehouseById.isPending) && (
        <Loader title="Cargando secciones..." />
      )}

      {alertState?.open ? (
        <AnimatedAlertWrapper open>
          <Alert
            type={alertState.type}
            title={alertState.title}
            message={alertState.message}
            onClose={handleCloseAlert}
          />
        </AnimatedAlertWrapper>
      ) : null}

      <SectionsHeader warehouseId={warehouseId} />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Acciones</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Registre una nueva sección
            </small>
          </div>
        </div>

        <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
          {isWarehouseFull ? (
            <Alert
              type="warning"
              title="Bodega sin espacio disponible"
              message="El área de la bodega ya está completamente ocupada por secciones. No es posible registrar más secciones."
            />
          ) : (
            <>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Dibuje la sección en el plano ({warehouseWidthMetres.toFixed(1)}
                m × {warehouseLengthMetres.toFixed(1)}m). Las secciones de
                Racks pueden crearse sobre secciones de Tramos. Las demás
                colisiones no están permitidas.
              </p>
              <LayoutBuilder2D
                containerWidthMetres={warehouseWidthMetres}
                containerLengthMetres={warehouseLengthMetres}
                entityKind="section"
                existingEntities={layoutEntities}
                draftStorageType={draftStorageType}
                showStorageTypeSelector
                storageTypeOptions={sectionStorageTypeOptions}
                onDraftStorageTypeChange={setDraftStorageType}
                collisionValidator={sectionCollisionValidator}
                onDrawComplete={(draft) => {
                  setSpatialDraft(draft);
                  setIsSectionModalOpen(true);
                }}
              />
            </>
          )}
        </div>
      </div>

      <SectionsFiltersBar
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <SectionsTable
        data={sectionsData}
        currentPage={currentPage}
        totalRecords={totalRecords}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        onViewLots={handleViewLots}
        onViewRacks={handleViewRacks}
        isFetching={GetSections.isFetching}
      />

      <SectionModal
        isOpen={isSectionModalOpen}
        warehouseId={warehouseId}
        spatialDraft={spatialDraft}
        defaultStorageType={draftStorageType}
        onClose={() => {
          setIsSectionModalOpen(false);
          setSpatialDraft(null);
        }}
        onSubmit={(payload) => {
          handleSectionCreated({
            code: payload.code,
            storage_type: payload.storage_type,
          });
        }}
      />
    </m.div>
  );
}
