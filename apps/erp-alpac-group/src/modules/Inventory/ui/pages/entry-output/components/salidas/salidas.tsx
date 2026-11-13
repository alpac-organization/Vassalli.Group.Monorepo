import { useCallback, useState } from "react";
import { DataTable, Pagination, SectionHeader } from "@alpac/design-system";

import { StatusTabsOverlay } from "@app/shared/components/status-tabs-overlay/status-tabs-overlay";
import { useInventoryOutputs } from "@app/modules/Inventory/ui/hooks/useInventoryOutputs";
import { useInventoryOutputDetail } from "@app/modules/Inventory/ui/hooks/useInventoryOutputDetail";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { DEFAULT_SALIDAS_FILTERS } from "./salidas.types";
import { SalidasSectionFilters } from "./salidas-section-filters";
import { GetInventoryOutputsColumnsToTable } from "./salidas.variants";
import { SalidasDetailModal } from "./salidas-detail-modal";

import type { SalidasFilters } from "./salidas.types";
import type { InventoryOutputsStatus } from "@app/core/enums/inventory-output-status.enum";

const SALIDAS_STATUS_TABS = [
  { id: "", label: "Todos", color: "#94a3b8" },
  { id: "OutputPending", label: "Pendiente", color: "#F97316" },
  { id: "InProgress", label: "En progreso", color: "#5e57eb" },
  { id: "Dispatched", label: "Despachado", color: "#22c55e" },
  { id: "Rejected", label: "Rechazado", color: "#ef4444" },
] as const;

export const Salidas = function () {
  const { companyId, moduleCode } = useUserStore();
  const [filters, setFilters] = useState<SalidasFilters>(DEFAULT_SALIDAS_FILTERS);
  const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null);

  const payload = {
    company_id: companyId,
    module_code: moduleCode,
    ...filters,
    page_number: filters.page_number ?? 1,
    page_size: filters.page_size ?? 10,
  };

  const { GetInventoryOutputsQuery } = useInventoryOutputs({
    payloadGetInventoryOutputsRequest: payload,
  });

  const { data, isPending, isFetching } = GetInventoryOutputsQuery;

  const selectedOutput = (data?.data ?? []).find(
    (item) => item.inventory_output_id === selectedOutputId,
  );

  const detailPayload = selectedOutputId
    ? {
        company_id: companyId,
        module_code: moduleCode,
        inventory_output_id: selectedOutputId,
      }
    : undefined;

  const { GetInventoryOutputDetailQuery } = useInventoryOutputDetail({
    payloadGetInventoryOutputDetailRequest: detailPayload,
  });

  const isDetailLoading =
    GetInventoryOutputDetailQuery.isPending || GetInventoryOutputDetailQuery.isFetching;

  const columns = GetInventoryOutputsColumnsToTable((item) =>
    setSelectedOutputId(item.inventory_output_id),
  );

  const selectedStatusTab = filters.status ?? "";

  const handleApplyFilters = (newFilters: SalidasFilters) => {
    setFilters({
      ...newFilters,
      page_number: 1,
    });
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_SALIDAS_FILTERS);
  };

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page_number: page,
    }));
  }, []);

  const handleStatusTabChange = useCallback((status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status ? (status as InventoryOutputsStatus) : null,
      page_number: 1,
    }));
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedOutputId(null);
  }, []);

  return (
    <div className="flex flex-col gap-5 bg-transparent">
      <SectionHeader
        title="Filtros de búsqueda"
        subtitle="Utiliza los filtros de búsqueda para una búsqueda más rápida."
      />

      <SalidasSectionFilters
        filters={filters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <div className="relative">
        <DataTable
          isLoading={isPending || isFetching}
          title="Salidas de inventario"
          data={data?.data ?? []}
          columns={columns}
          pagination={
            <Pagination
              pageSize={data?.page_size ?? 0}
              totalRecords={data?.total ?? 0}
              currentPage={data?.page_number ?? 0}
              onPageChange={handlePageChange}
            />
          }
        />
        <StatusTabsOverlay
          tabs={SALIDAS_STATUS_TABS}
          activeTab={selectedStatusTab}
          onChange={handleStatusTabChange}
        />
      </div>

      <SalidasDetailModal
        isOpen={Boolean(selectedOutputId)}
        onClose={handleCloseDetail}
        isLoading={isDetailLoading}
        detailData={GetInventoryOutputDetailQuery.data}
        selectedOutput={selectedOutput}
        requestType={selectedOutput?.request_type}
      />
    </div>
  );
};