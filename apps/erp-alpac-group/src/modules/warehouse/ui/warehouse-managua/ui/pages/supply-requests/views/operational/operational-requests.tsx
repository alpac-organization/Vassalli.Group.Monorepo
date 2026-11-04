import { useCallback, useMemo, useState } from "react";

import type { OutflowStatus } from "@app/core/enums/outflow-status.enum";
import { OutflowStatus as OutflowStatusValues } from "@app/core/enums/outflow-status.enum";
import { ReasonUse as ReasonUseValues } from "@app/core/enums/reason-use.enum";
import { Badges, Button, DataTable, Modal, Pagination, SectionHeader } from "@alpac/design-system";

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

const STATUS_TABS = [
  { id: "", label: "Todos", color: "#94a3b8" },
  { id: "PendingReview", label: "Pendiente revisión", color: "#F97316" },
  { id: "Approved", label: "Aprobado", color: "#22c55e" },
  { id: "Annuled", label: "Anulado", color: "#f87171" },
  { id: "PendingDispatch", label: "En proceso", color: "#5e57eb" },
  { id: "DispatchCancelled", label: "Despacho cancelado", color: "#c084fc" },
] as const;

const getStatusBadgeClassName = (status: OutflowStatus) => {
  switch (status) {
    case "PendingReview":
      return "bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800";
    case "Approved":
      return "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
    case "Annuled":
      return "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
    case "PendingDispatch":
      return "bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800";
    case "DispatchCancelled":
      return "bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
  }
};

const getReasonBadgeClassName = (reasonUse: string) => {
  if (reasonUse === "Sale") {
    return "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
  }
  return "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
};

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

  const selectedStatusTab = filters.status ?? "";

  const handleStatusTabChange = useCallback((status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status ? (status as OutflowStatus) : undefined,
      page_number: 1,
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

      <div className="relative">
        <DataTable
          isLoading={isPending || isFetching}
          title="Solicitudes a inventario"
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
        <div className="pointer-events-none absolute left-0 right-0 top-0 hidden h-[4.5rem] items-center justify-center overflow-hidden md:flex">
          <div className="pointer-events-auto flex items-center gap-1">
            {STATUS_TABS.map((tab) => {
              const active = selectedStatusTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleStatusTabChange(tab.id)}
                  className="min-h-0 shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors text-slate-300 hover:text-white"
                  style={{ borderColor: active ? tab.color : "transparent" }}
                >
                  <span
                    className="rounded px-2 py-1"
                    style={{ backgroundColor: active ? `${tab.color}22` : "transparent" }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

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
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badges
                color="info"
                className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                label={detailData.supply_request_code ?? "—"}
              />
              <Badges
                color="info"
                className="bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                label={
                  detailData.po_code ??
                  detailData.operational_order_information?.po_code ??
                  "—"
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailField
                label="Almacén"
                value={detailData.warehouse_information?.code ?? "—"}
              />
              <DetailField
                label="Estado"
                value={
                  <Badges
                    color="info"
                    className={getStatusBadgeClassName(detailData.outflow_status)}
                    label={
                      OutflowStatusValues[detailData.outflow_status]?.label ??
                      String(detailData.outflow_status)
                    }
                  />
                }
              />
              <DetailField
                label="Solicitante"
                value={detailData.requested_by_user_name ?? "—"}
              />
              <DetailField
                label="Fecha de solicitud"
                value={
                  detailData.created_at
                    ? new Date(detailData.created_at).toLocaleDateString()
                    : "—"
                }
              />
              <DetailField
                label="Motivo de uso"
                value={
                  <Badges
                    color="info"
                    className={getReasonBadgeClassName(detailData.reason_use)}
                    label={
                      ReasonUseValues[detailData.reason_use]?.label ??
                      String(detailData.reason_use)
                    }
                  />
                }
              />
              <DetailField
                label="Justificación"
                value={detailData.justification ?? "—"}
              />
              {detailData.approved_by_user_chief_name ? (
                <DetailField
                  label="Aprobado por"
                  value={detailData.approved_by_user_chief_name}
                />
              ) : null}
              {detailData.annulled_by_user_chief_name ? (
                <DetailField
                  label="Anulado por"
                  value={detailData.annulled_by_user_chief_name}
                />
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Ítems
              </h3>
              {detailData.items.length === 0 ? (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Sin ítems registrados.
                </span>
              ) : (
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-600 dark:border-neutral-600">
                      <th className="px-3 py-2 text-left font-semibold text-gray-500 dark:text-gray-300">
                        Insumo
                      </th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-500 dark:text-gray-300">
                        Cantidad
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailData.items.map((item) => (
                      <tr
                        key={item.supply_request_item_id}
                        className="border-b border-slate-600 dark:border-neutral-600"
                      >
                        <td className="px-3 py-2">
                          {item.product_stock_name ?? "Producto"}
                        </td>
                        <td className="px-3 py-2 text-right font-medium">
                          {item.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {detailData.outflow_status === "PendingReview" ? (
                <div className="flex justify-end gap-2">
                  <Button
                    label="Aprobar"
                    size="small"
                    className="bg-blue-600! text-white!"
                  />
                  <Button
                    label="Anular"
                    size="small"
                    className="bg-red-600! text-white!"
                  />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
