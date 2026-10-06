import { m } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@alpac/design-system";
import { Rows4 } from "lucide-react";
import { useParams } from "react-router-dom";
import { RacksHeader } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-header/racks-header";
import { RacksFiltersBar } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-filters/racks-filters";
import { RacksTable } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-table/racks-table";
import { RackModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/rack-modal/rack-modal";
import { RackDetailModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/rack-detail-modal/rack-detail-modal";
import { RackViewer } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/rack-viewer/rack-viewer";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import { EMPTY_RACK_FILTERS, type RackFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/types/racks.types";
import { useRack } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useRack";
import { useSection } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useSection";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import type { RackDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-racks-res";
import type { DeleteRackRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/racks/delete-rack-req";
import { filtersToGetRacksParams } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/filter-racks";
import { mapWarehouseDetailsToLayout } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/utils/warehouse-details.mapper";
import { deleteButtonClass, cancelButtonClass, PAGE_SIZE } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/style.racks";

export function RacksPage() {
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

  // Modales y selección
  const [isRackModalOpen, setIsRackModalOpen] = useState(false);
  const [editingRack, setEditingRack] = useState<RackDto | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rackToDelete, setRackToDelete] = useState<RackDto | null>(null);
  const [selectedRackId, setSelectedRackId] = useState<string | null>(null);
  const [isPositionsModalOpen, setIsPositionsModalOpen] = useState(false);
  const [selectedRackForDetail, setSelectedRackForDetail] = useState<RackDto | null>(null);

  // Filtros y paginación
  const [appliedFilters, setAppliedFilters] = useState<RackFilters>(EMPTY_RACK_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const getSectionDetailsPayload = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
      section_id: sectionId,
    }),
    [companyId, moduleCode, warehouseId, sectionId],
  );

  const { GetSectionDetails } = useSection({
    getSectionDetailsPayload,
  });

  const { GetWarehouseDetails } = useWarehouse({
    getWarehouseDetailsPayload: {
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
    },
  });

  const warehouseDetails = GetWarehouseDetails.data;
  const warehouseLayout = warehouseDetails
    ? mapWarehouseDetailsToLayout(warehouseDetails)
    : undefined;
  const warehouseName = warehouseDetails?.code || "BODEGA";

  const sectionCode = GetSectionDetails.data?.section_code ?? undefined;
  const sectionWidth = GetSectionDetails.data?.capacity?.width ?? 0.0;
  const sectionLength = GetSectionDetails.data?.capacity?.length ?? 0.0;
  const sectionPositionX = GetSectionDetails.data?.coordinates?.position_x ?? 0;
  const sectionPositionY = GetSectionDetails.data?.coordinates?.position_y ?? 0;

  const getRacksPayload = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
      section_id: sectionId,
      ...filtersToGetRacksParams(appliedFilters),
      page_number: currentPage,
      page_size: PAGE_SIZE,
    }),
    [companyId, moduleCode, warehouseId, sectionId, appliedFilters, currentPage],
  );

  const getAllRacksPayload = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
      section_id: sectionId,
      ...filtersToGetRacksParams(appliedFilters),
      page_number: 1,
      page_size: 100,
    }),
    [companyId, moduleCode, warehouseId, sectionId, appliedFilters],
  );

  const { GetRacks, GetAllRacks, DeleteRack } = useRack({
    getRacksPayload,
    getAllRacksPayload,
  });

  const racksTableData = GetRacks.data?.data ?? [];
  const allRacksData = GetAllRacks.data?.data ?? racksTableData;
  const totalRecords = GetRacks.data?.total ?? 0;

  const totalPositions = useMemo(
    () => allRacksData.reduce((acc, r) => acc + (r.total_positions ?? 0), 0),
    [allRacksData],
  );

  const totalOccupied = useMemo(
    () => allRacksData.reduce((acc, r) => acc + (r.occupied_positions ?? 0), 0),
    [allRacksData],
  );

  const occupancyPercentage = useMemo(
    () => (totalPositions > 0 ? Math.round((totalOccupied / totalPositions) * 100) : 0),
    [totalPositions, totalOccupied],
  );

  useEffect(() => {
    const error = GetRacks.error || GetAllRacks.error;
    if (!error) return;
    try {
      const mappedError = getMappedError(error);
      handleRequestError(mappedError?.description || "Error al cargar los racks");
    } catch {
      handleRequestError("Error al cargar los racks");
    }
  }, [GetRacks.error, GetAllRacks.error, getMappedError, handleRequestError]);

  useEffect(() => {
    if (!GetWarehouseDetails.isError || !GetWarehouseDetails.error) return;
    try {
      const mappedError = getMappedError(GetWarehouseDetails.error);
      handleRequestError(mappedError?.description || "Error al cargar la bodega");
    } catch {
      handleRequestError("Error al cargar la bodega");
    }
  }, [
    GetWarehouseDetails.isError,
    GetWarehouseDetails.error,
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

  const handleSelectRow = (rack: RackDto) => {
    setSelectedRackId(rack.rack_id || null);
  };

  const handleOpenCreateModal = () => {
    setEditingRack(null);
    setIsRackModalOpen(true);
  };

  const handleUpdateRack = (rack: RackDto) => {
    setEditingRack(rack);
    setIsRackModalOpen(true);
  };

  const handleViewPositions = (rack: RackDto) => {
    setSelectedRackForDetail(rack);
    setIsPositionsModalOpen(true);
  };

  const handleDeleteRack = (rack: RackDto) => {
    setRackToDelete(rack);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!rackToDelete) return;

    try {
      const targetId = rackToDelete.rack_id;
      if (!targetId) throw new Error("ID de rack no encontrado");

      const payload: DeleteRackRequest = {
        company_id: companyId,
        module_code: moduleCode,
        warehouse_id: warehouseId,
        section_id: sectionId,
        rack_id: targetId,
      };
      await DeleteRack.mutateAsync(payload);
      handleRequestSuccess("Rack eliminado con éxito.");
      setIsDeleteModalOpen(false);
      setRackToDelete(null);
    } catch {
      handleRequestError("Error al eliminar el rack.");
    }
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
      {(GetRacks.isPending || GetAllRacks.isPending) && (
        <Loader title="Cargando racks de la sección..." />
      )}

      {AlertComponent}

      <RacksHeader
        warehouseId={warehouseId}
        sectionId={sectionId}
        sectionCode={sectionCode}
        location={warehouseName}
        rackQuantity={GetAllRacks.data?.total ?? totalRecords}
        totalPositions={totalPositions}
        ocuppation={occupancyPercentage}
        registerButton={
          <Button
            type="button"
            size="giant"
            label="Registrar Nuevos Racks"
            icon={<Rows4 size={30} />}
            className="w-full! lg:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={handleOpenCreateModal}
          />
        }
      />

      <RacksFiltersBar
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 min-w-0 w-full">
        <div className="min-w-0 w-full flex flex-col h-full min-h-25">
          <RacksTable
            data={racksTableData}
            currentPage={currentPage}
            totalRecords={totalRecords}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            onSelectRow={handleSelectRow}
            onViewPositions={handleViewPositions}
            onUpdateRack={handleUpdateRack}
            onDeleteRack={handleDeleteRack}
            isFetching={GetRacks.isFetching}
            height="100%"
            minHeight="580px"
          />
        </div>

        <RackViewer
          className="min-h-175 min-w-0 overflow-y-auto"
          warehouse={warehouseLayout}
          racks={allRacksData}
          selectedRackId={selectedRackId}
          sectionCode={sectionCode}
          warehouseName={warehouseName}
          sectionWidth={sectionWidth}
          sectionLength={sectionLength}
          sectionPositionX={sectionPositionX}
          sectionPositionY={sectionPositionY}
          onSelectRack={(rack) => setSelectedRackId(rack.rack_id || null)}
        />
      </div>

      <RackModal
        isOpen={isRackModalOpen}
        warehouseId={warehouseId}
        sectionId={sectionId}
        sectionWidth={sectionWidth}
        sectionLength={sectionLength}
        rack={editingRack}
        onClose={() => {
          setIsRackModalOpen(false);
          setEditingRack(null);
        }}
      />

      <RackDetailModal
        isOpen={isPositionsModalOpen}
        warehouseId={warehouseId}
        sectionId={sectionId}
        rackId={selectedRackForDetail?.rack_id}
        rackSummary={selectedRackForDetail}
        onClose={() => {
          setIsPositionsModalOpen(false);
          setSelectedRackForDetail(null);
        }}
      />

      <ConfirmModal
        type="DELETE"
        title={`¿Está seguro que desea eliminar el rack ${rackToDelete?.code ?? ""}?`}
        isOpen={isDeleteModalOpen}
        handleFinalAction={(actionType) => {
          if (actionType === "DELETE") {
            void handleConfirmDelete();
          }
        }}
        onClose={() => {
          if (DeleteRack.isPending) return;
          setIsDeleteModalOpen(false);
          setRackToDelete(null);
        }}
        buttonActionLabel="Eliminar"
        buttonActionClass={deleteButtonClass}
        buttonCancelClass={cancelButtonClass}
        isLoading={DeleteRack.isPending}
        disabled={DeleteRack.isPending}
      />
    </m.div>
  );
}
