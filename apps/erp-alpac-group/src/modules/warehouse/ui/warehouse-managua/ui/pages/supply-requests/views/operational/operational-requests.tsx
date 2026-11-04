import { useCallback, useMemo, useState } from "react";

import { DataTable, Modal, Pagination, SectionHeader } from "@alpac/design-system";

import { Loader } from "@app/shared/components/loaders/loader";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useSupplyRequests } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useSupplyRequests";
import { useSupplyRequestDetail } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useSupplyRequestDetail";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";

import { OperationalRequestsSectionFilters } from "./operational-requests-section-filters";
import { DEFAULT_OPERATIONAL_FILTERS } from "./operational-requests.types";
import { GetOperationalSupplyRequestColumnsToTable } from "./operational-requests.variants";

import type { OperationalRequestsFilters } from "./operational-requests.types";
import type { SupplyRequestDetailDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/supply-requests/supply-requests.response";

export const OperationalRequests = function () {
  const { companyId, moduleCode } = useUserStore();

  const [filters, setFilters] = useState<OperationalRequestsFilters>(DEFAULT_OPERATIONAL_FILTERS);
  const [selectedSupplyRequestId, setSelectedSupplyRequestId] = useState<string | null>(null);

  const payloadGetSupplyRequestsRequest = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      ...filters,
      page_number: filters.page_number ?? 1,
      page_size: filters.page_size ?? 10,
    }),
    [companyId, moduleCode, filters],
  );

  const { GetSupplyRequestsQuery } = useSupplyRequests({
    payloadGetSupplyRequestsRequest,
  });

  const { data: supplyRequestsData, isPending, isFetching } = GetSupplyRequestsQuery;

  const { GetBranchesQuery } = useCompanies(
    companyId ? { company_id: companyId } : undefined,
  );

  const branchOptions = useMemo(
    () =>
      (GetBranchesQuery.data ?? []).map((branch) => ({
        value: branch.branch_id,
        label: branch.branch_name,
      })),
    [GetBranchesQuery.data],
  );

  const handleViewDetail = useCallback((item: { supply_request_id: string }) => {
    setSelectedSupplyRequestId(item.supply_request_id);
  }, []);

  const columns = useMemo(
    () => GetOperationalSupplyRequestColumnsToTable(handleViewDetail),
    [handleViewDetail],
  );

  const memoizedRows = useMemo(
    () => supplyRequestsData?.data ?? [],
    [supplyRequestsData?.data],
  );

  const { GetSupplyRequestDetailQuery } = useSupplyRequestDetail({
    payloadGetSupplyRequestDetailRequest: selectedSupplyRequestId
      ? {
          company_id: companyId,
          module_code: moduleCode,
          supply_request_id: selectedSupplyRequestId,
        }
      : undefined,
  });

  const detailData: SupplyRequestDetailDto | undefined = GetSupplyRequestDetailQuery.data;
  const isDetailLoading =
    GetSupplyRequestDetailQuery.isPending || GetSupplyRequestDetailQuery.isFetching;

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

  const handleCloseDetail = useCallback(() => {
    setSelectedSupplyRequestId(null);
  }, []);

  return (
    <div className="flex flex-col gap-5 bg-transparent">
      <SectionHeader
        title="Filtros de búsqueda"
        subtitle="Utiliza los filtros de busqueda para una busqueda mas rapida."
      />

      <OperationalRequestsSectionFilters
        filters={filters}
        branchOptions={branchOptions}
        isBranchesLoading={GetBranchesQuery.isPending || GetBranchesQuery.isFetching}
        onClear={handleClearFilters}
        onApply={handleApplyFilters}
      />

      <DataTable
        isLoading={isPending || isFetching}
        title="Solicitudes operativas"
        data={memoizedRows}
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

      <Modal
        isOpen={Boolean(selectedSupplyRequestId)}
        onClose={handleCloseDetail}
        title="Detalle de solicitud de inventario"
        description="Consulta la información general, ítems y auditoría de la solicitud."
        variant="default"
        size="2xl"
      >
        {isDetailLoading ? (
          <div className="py-8">
            <Loader title="Cargando detalle de la solicitud..." />
          </div>
        ) : !detailData ? (
          <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
            No se encontró información de la solicitud.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField label="Codigo" value={detailData.supply_request_code ?? "—"} />
            <DetailField label="Codigo PO" value={detailData.po_code ?? "—"} />
            <DetailField label="Area de trabajo" value={detailData.work_area_name ?? "—"} />
            <DetailField label="Solicitante" value={detailData.requested_by_user_name ?? "—"} />
            <DetailField label="Estado" value={detailData.outflow_status ?? "—"} />
            <DetailField label="Items" value={detailData.items_count ?? 0} />
            <DetailField
              label="Aprobado por"
              value={detailData.approved_by_user_chief_name ?? "—"}
            />
            <DetailField
              label="Anulado por"
              value={detailData.annulled_by_user_chief_name ?? "—"}
            />
            <DetailField
              label="Motivo"
              value={detailData.reason_use ? String(detailData.reason_use) : "—"}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
