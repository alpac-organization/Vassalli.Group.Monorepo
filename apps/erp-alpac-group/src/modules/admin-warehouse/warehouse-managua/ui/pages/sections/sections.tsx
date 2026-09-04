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
import { buildSectionLayoutEntity } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/utils/layout-entity.mapper";
import { createSectionCollisionValidator } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/validators/section-collision.validator";
import { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import type { SectionStorageTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import {
  EMPTY_SECTION_FILTERS,
  type SectionFilters,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-filters/types/sections-filters.types";
import { filtersToGetSectionsParams } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/utils/filter-sections";
import { useWarehouseAdmin } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useWarehouseAdmin";
import { useWarehouseLayoutSections } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useWarehouseLayoutSections";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { SectionResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-res";
import type { GetSectionsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-sections-req";
import type { CreateSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-section-req";
import { Button } from "@alpac/design-system";
import type { FormValues } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-modal/section-modal.types";
import { SectionTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";
import type { GetWarehouseByIdRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouse-by-id.req";
import type { PlacementDraft } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d.types";

const PAGE_SIZE = 10;
const FALLBACK_WAREHOUSE_SIZE_METRES = 50;

export function SectionsPage() {
  const { warehouseId = "" } = useParams<{ warehouseId: string }>();
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { alertState, handleCloseAlert, handleRequestError, handleRequestSuccess } = useAlertState();
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [pendingFormValues, setPendingFormValues] = useState<FormValues | null>(null);
  const [placementDraft, setPlacementDraft] = useState<PlacementDraft | null>(null);
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

  const getWarehouseByIdPayload = useMemo<GetWarehouseByIdRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
    }),
    [companyId, moduleCode, warehouseId],
  );

  const { GetSections, CreateSection } = useWarehouseAdmin({ getSectionsPayload });
  const {
    entities: layoutEntities,
    isPending: isLayoutPending,
  } = useWarehouseLayoutSections({
    companyId,
    moduleCode,
    warehouseId,
    sessionEntities,
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

  const sectionCollisionValidator = useMemo(
    () => createSectionCollisionValidator(draftStorageType),
    [draftStorageType],
  );

  const handleSectionCreated = useCallback(
    (spatialDraft: SpatialDraft) => {
      if (!pendingFormValues) return;

      const isAisle = Number(pendingFormValues.section_type) === SectionTypeEnum.Aisle.value;
      const sectionTypeOption = Object.values(SectionTypeEnum).find(
        (option) => option.value === Number(pendingFormValues.section_type),
      );
      const storageTypeOption = Object.values(SectionStorageTypeEnum).find(
        (option) => option.value === Number(pendingFormValues.storage_type),
      );

      const payload: CreateSectionRequest = {
        company_id: companyId,
        module_code: moduleCode,
        warehouse_id: warehouseId,
        code: pendingFormValues.code,
        name: pendingFormValues.name,
        section_type: sectionTypeOption ? sectionTypeOption.textValue : SectionTypeEnum.Storage.textValue,
        storage_type: storageTypeOption ? storageTypeOption.textValue : SectionStorageTypeEnum.Empty.textValue,
        width_metres: pendingFormValues.width_metres ?? 0,
        length_metres: pendingFormValues.length_metres ?? 0,
        layout_transform_3d_dto: {
          position_x: spatialDraft.position_x,
          position_y: spatialDraft.position_y,
          position_z: spatialDraft.position_z,
          rotation_y: spatialDraft.rotation_y ?? 0,
        },
        overflow_capacity: isAisle
          ? {
              allows_overflow_storage: pendingFormValues.overflow.allows_overflow_storage,
              is_overflow_enabled: pendingFormValues.overflow.is_overflow_enabled,
              max_overflow_polines: pendingFormValues.overflow.max_overflow_polines ?? null,
            }
          : null,
      };

      CreateSection.mutate(payload, {
        onSuccess: () => {
          handleRequestSuccess("Sección registrada exitosamente.");
          setSessionEntities((current) => [
            ...current,
            buildSectionLayoutEntity({
              id: `session-${payload.code}-${current.length}`,
              name: payload.code,
              spatialDraft,
              storageType: payload.storage_type,
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
    [pendingFormValues, companyId, moduleCode, warehouseId, CreateSection, handleRequestSuccess, handleRequestError, getMappedError],
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
        isLayoutPending ||
        GetWarehouseById.isPending ||
        CreateSection.isPending) && (
        <Loader
          title={
            CreateSection.isPending
              ? "Registrando sección..."
              : "Cargando secciones..."
          }
        />
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
          <Button
            label="Añadir Sección"
            onClick={() => setIsSectionModalOpen(true)}
            size="small"
            className="bg-alpac-primary-500 hover:bg-alpac-primary-600 text-white rounded-md px-4 py-2"
          />
        </div>

        <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
          {isWarehouseFull ? (
            <Alert
              type="warning"
              title="Superficie de piso ocupada"
              message="Solo podrá colocar una sección elevada de racks completamente sobre una sección de tramos existente."
            />
          ) : null}
          <p className="mb-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
            Añada una sección, defina sus medidas y arrástrela a su ubicación
            exacta ({warehouseWidthMetres.toFixed(1)}m ×{" "}
            {warehouseLengthMetres.toFixed(1)}m).
          </p>
          <LayoutBuilder2D
            containerWidthMetres={warehouseWidthMetres}
            containerLengthMetres={warehouseLengthMetres}
            entityKind="section"
            existingEntities={layoutEntities}
            draftStorageType={draftStorageType}
            placementDraft={placementDraft}
            isSaving={CreateSection.isPending}
            collisionValidator={sectionCollisionValidator}
            onPlacementConfirm={handleSectionCreated}
            onPlacementCancel={() => {
              setPendingFormValues(null);
              setPlacementDraft(null);
            }}
          />
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
        defaultStorageType={draftStorageType}
        onClose={() => {
          setIsSectionModalOpen(false);
        }}
        onSubmit={(formValues) => {
          setPendingFormValues(formValues);
          const storageTypeOption = Object.values(SectionStorageTypeEnum).find(
            (option) => option.value === Number(formValues.storage_type),
          );
          if (storageTypeOption) setDraftStorageType(storageTypeOption.textValue);

          setPlacementDraft({
            width_metres: formValues.width_metres ?? 0,
            length_metres: formValues.length_metres ?? 0,
            position_y: formValues.is_elevated
              ? (formValues.position_y_metres ?? 0)
              : 0,
            rotation_y: 0,
          });
        }}
      />
    </m.div>
  );
}
