import { useCallback, useMemo, useState } from "react";

import type { OutflowStatus } from "@app/core/enums/outflow-status.enum";
import { OutflowStatus as OutflowStatusValues } from "@app/core/enums/outflow-status.enum";
import { ReasonUse as ReasonUseValues } from "@app/core/enums/reason-use.enum";
import { Badges, Button, DataTable, Dropdown, Modal, Pagination, SectionHeader } from "@alpac/design-system";

import { Loader } from "@app/shared/components/loaders/loader";
// import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useSupplyRequests } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useSupplyRequests";
import { useSupplyRequestDetail } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useSupplyRequestDetail";
import { useApproveSupplyRequest } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useApproveSupplyRequest";
import { useDeclineSupplyRequest } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useDeclineSupplyRequest";
import { useReasonsInventoryRemoval } from "@app/modules/Inventory/ui/hooks/useReasonsInventoryRemoval";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import type { useReasonsInventoryRemovalProps } from "@app/modules/Inventory/application/interfaces/hooks/useReasonsInventoryRemovalProps";

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

function ModalInfoField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#91A0B5]">
        {label}
      </span>
      <div className="text-[13px] font-medium text-[#E2E8F0]">{value ?? "—"}</div>
    </div>
  );
}

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

  const { AlertComponent, handleRequestSuccess, handleRequestError } =
    useAlertState();
  const { ApproveSupplyRequest } = useApproveSupplyRequest();
  const { DeclineSupplyRequest } = useDeclineSupplyRequest();

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [approveObservations, setApproveObservations] = useState("");
  const [declineObservations, setDeclineObservations] = useState("");
  const [selectedReasonId, setSelectedReasonId] = useState("");
  const [approveError, setApproveError] = useState("");
  const [declineError, setDeclineError] = useState("");

  const getErrorMessage = (error: any) =>
    error?.response?.data?.error?.description ||
    error?.response?.data?.message ||
    error?.message ||
    "Error desconocido";

  const reasonsQueryPayload =
    isApproveModalOpen && companyId && moduleCode
      ? {
          payloadGetReasonsInventoryRemovalRequest: {
            company_id: companyId,
            module_code: moduleCode,
            page_number: 1,
            page_size: 100,
          },
        }
      : {};

  const { GetReasonsInventoryRemovalQuery } = useReasonsInventoryRemoval(
    reasonsQueryPayload as useReasonsInventoryRemovalProps,
  );

  const reasonOptions = (GetReasonsInventoryRemovalQuery.data?.data ?? []).map((reason) => ({
    value: reason.reasons_inventory_removal_id,
    label: reason.description ?? reason.code ?? "Motivo",
  }));

  const handleApprove = async () => {
    if (!selectedSupplyRequestId || !selectedReasonId) {
      setApproveError("Selecciona un motivo de salida de inventario.");
      return;
    }
    setApproveError("");
    try {
      await ApproveSupplyRequest.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        supply_request_id: selectedSupplyRequestId,
        reason_inventory_removal_id: selectedReasonId,
        observations: approveObservations || undefined,
      });
      handleRequestSuccess("Solicitud aprobada correctamente.");
      setIsApproveModalOpen(false);
      setApproveObservations("");
      setSelectedReasonId("");
      handleCloseDetail();
    } catch (error) {
      const message = getErrorMessage(error);
      setApproveError(message);
      handleRequestError(error, "Error");
      console.error("Approve supply request error", error);
    }
  };

  const handleDecline = async () => {
    if (!selectedSupplyRequestId) return;
    setDeclineError("");
    try {
      await DeclineSupplyRequest.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        supply_request_id: selectedSupplyRequestId,
        observations: declineObservations || undefined,
      });
      handleRequestSuccess("Solicitud anulada correctamente.");
      setIsDeclineModalOpen(false);
      setDeclineObservations("");
      handleCloseDetail();
    } catch (error) {
      const message = getErrorMessage(error);
      setDeclineError(message);
      handleRequestError(error, "Error");
      console.error("Decline supply request error", error);
    }
  };

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
            <div className="flex flex-wrap items-center justify-between gap-2">
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
              <Badges
                color="info"
                className={getStatusBadgeClassName(detailData.outflow_status)}
                label={
                  OutflowStatusValues[detailData.outflow_status]?.label ??
                  String(detailData.outflow_status)
                }
              />
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-600 pt-4 dark:border-neutral-600">
              <h3 className="text-sm font-semibold text-slate-200">
                Información general
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ModalInfoField
                  label="ALMACÉN"
                  value={detailData.warehouse_information?.code ?? "—"}
                />
                <ModalInfoField
                  label="SOLICITANTE"
                  value={detailData.requested_by_user_name ?? "—"}
                />
                <ModalInfoField
                  label="FECHA DE SOLICITUD"
                  value={
                    detailData.created_at
                      ? new Date(detailData.created_at).toLocaleDateString()
                      : "—"
                  }
                />
                <ModalInfoField
                  label="MOTIVO DE USO"
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
              </div>

              <div className="mt-4 rounded-md bg-[#303846] p-3">
                <p className="mb-1 text-[10px] font-semibold text-[#91A0B5]">
                  JUSTIFICACIÓN
                </p>
                <p className="text-[13px] text-[#E2E8F0]">
                  {detailData.justification ?? "—"}
                </p>
              </div>

              {detailData.approved_by_user_chief_name ? (
                <div className="mt-3">
                  <ModalInfoField
                    label="APROBADO POR"
                    value={detailData.approved_by_user_chief_name}
                  />
                </div>
              ) : null}

              {detailData.annulled_by_user_chief_name ? (
                <div className="mt-3">
                  <ModalInfoField
                    label="ANULADO POR"
                    value={detailData.annulled_by_user_chief_name}
                  />
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-600 pt-4 dark:border-neutral-600">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200">Ítems</h3>
                <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-200">
                  {detailData.items.length} artículos
                </span>
              </div>

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
            </div>

            {detailData.outflow_status === "PendingReview" ? (
              <div className="flex items-center justify-end gap-3 border-t border-slate-600 pt-4 dark:border-neutral-600">
                <Button
                  label="Anular"
                  size="small"
                  onClick={() => {
                    setDeclineObservations("");
                    setDeclineError("");
                    setIsDeclineModalOpen(true);
                  }}
                  className="rounded-md! h-10 px-4! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200"
                />
                <Button
                  label="Aprobar"
                  size="small"
                  onClick={() => {
                    setApproveObservations("");
                    setSelectedReasonId("");
                    setApproveError("");
                    setIsApproveModalOpen(true);
                  }}
                  className="rounded-md! h-11 px-6! border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 shadow-sm transition-all duration-200 text-[14px] font-semibold"
                />
              </div>
            ) : null}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => {
          setIsApproveModalOpen(false);
          setApproveObservations("");
          setSelectedReasonId("");
          setApproveError("");
        }}
        title="Aprobar solicitud"
        description="Selecciona el motivo de salida de inventario."
        variant="default"
        size="md"
      >
        <div className="flex flex-col gap-3">
          <Dropdown
            label="Motivo de salida"
            value={selectedReasonId}
            options={[
              { value: "", label: "Seleccione un motivo" },
              ...reasonOptions,
            ]}
            onChange={(e: any) => setSelectedReasonId(String(e?.target?.value ?? e ?? ""))}
            placeholder={GetReasonsInventoryRemovalQuery.isPending ? "Cargando..." : "Seleccione un motivo"}
            appearance="dark"
            labelClassName="text-slate-300"
            className="w-full"
            disabled={GetReasonsInventoryRemovalQuery.isPending}
          />
          <textarea
            className="min-h-[80px] rounded-md border border-slate-600 bg-[#252B36] p-2 text-sm text-slate-100"
            placeholder="Observaciones (opcional)"
            value={approveObservations}
            onChange={(e) => setApproveObservations(e.target.value)}
          />
          {approveError ? (
            <p className="text-sm text-red-400">{approveError}</p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button
              label="Cancelar"
              size="small"
              onClick={() => {
                setIsApproveModalOpen(false);
                setApproveObservations("");
                setSelectedReasonId("");
                setApproveError("");
              }}
            />
            <Button
              label={ApproveSupplyRequest.isPending ? "Aprobando..." : "Aprobar"}
              size="small"
              onClick={() => void handleApprove()}
              disabled={!selectedReasonId || ApproveSupplyRequest.isPending}
              className="bg-blue-600! text-white!"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeclineModalOpen}
        onClose={() => {
          setIsDeclineModalOpen(false);
          setDeclineObservations("");
          setDeclineError("");
        }}
        title="Anular solicitud"
        description="Ingresa las observaciones de anulación."
        variant="default"
        size="md"
      >
        <div className="flex flex-col gap-3">
          <textarea
            className="min-h-[80px] rounded-md border border-slate-600 bg-[#252B36] p-2 text-sm text-slate-100"
            placeholder="Observaciones (opcional)"
            value={declineObservations}
            onChange={(e) => setDeclineObservations(e.target.value)}
          />
          {declineError ? <p className="text-sm text-red-400">{declineError}</p> : null}
          <div className="flex justify-end gap-2">
            <Button
              label="Cancelar"
              size="small"
              onClick={() => {
                setIsDeclineModalOpen(false);
                setDeclineObservations("");
                setDeclineError("");
              }}
            />
            <Button
              label={DeclineSupplyRequest.isPending ? "Anulando..." : "Anular"}
              size="small"
              onClick={() => void handleDecline()}
              disabled={DeclineSupplyRequest.isPending}
              className="bg-red-600! text-white!"
            />
          </div>
        </div>
      </Modal>

      {AlertComponent}
    </div>
  );
};
