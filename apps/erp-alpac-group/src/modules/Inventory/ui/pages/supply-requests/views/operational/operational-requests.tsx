import { useCallback, useState } from "react";

import { DataTable, Pagination, SectionHeader } from "@alpac/design-system";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useSupplyRequests } from "@app/modules/Inventory/ui/hooks/useSupplyRequests";

import { OperationalRequestsSectionFilters } from "./operational-requests-section-filters";
import { DEFAULT_OPERATIONAL_FILTERS } from "./operational-requests.types";
import { GetOperationalSupplyRequestColumnsToTable } from "./operational-requests.variants";

import type { OperationalRequestsFilters } from "./operational-requests.types";

export const OperationalRequests = function () {
  const { companyId, moduleCode } = useUserStore();

  const [filters, setFilters] = useState<OperationalRequestsFilters>(DEFAULT_OPERATIONAL_FILTERS);

  const { GetSupplyRequestsQuery } = useSupplyRequests({
    payloadGetSupplyRequestsRequest: {
      company_id: companyId,
      module_code: moduleCode,
      ...filters,
    },
  });

  const { data: supplyRequestsData, isPending, isFetching } = GetSupplyRequestsQuery;
  const columns = GetOperationalSupplyRequestColumnsToTable();

  const handleApplyFilters = (newFilters: OperationalRequestsFilters) => {
    setFilters({
      ...newFilters,
      page_number: 1,
    });
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_OPERATIONAL_FILTERS);
  };

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page_number: page,
    }));
  }, []);

  return (
    <div className="flex flex-col gap-5 bg-transparent">
      <SectionHeader
        title="Filtros de búsqueda"
        subtitle="Utiliza los filtros de busqueda para una busqueda mas rapida."
      />

      <OperationalRequestsSectionFilters
        filters={filters}
        onClear={handleClearFilters}
        onApply={handleApplyFilters}
      />

      <DataTable
        isLoading={isPending || isFetching}
        title="Solicitudes operacionales"
        data={supplyRequestsData?.data ?? []}
        columns={columns}
        pagination={
          <Pagination
            pageSize={supplyRequestsData?.page_size ?? 0}
            totalRecords={supplyRequestsData?.total ?? 0}
            currentPage={supplyRequestsData?.page_number ?? 0}
            onPageChange={handlePageChange}
          />
        }
      />
    </div>
  );
};
