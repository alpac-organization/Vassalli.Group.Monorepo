import { useCallback, useMemo, useState } from "react";

import type { OutflowStatus } from "@app/core/enums/outflow-status.enum";
import { OutflowStatus as OutflowStatusValues } from "@app/core/enums/outflow-status.enum";
import { Badges, Button, DataTable, Modal, Pagination, SectionHeader } from "@alpac/design-system";

import { Loader } from "@app/shared/components/loaders/loader";
import { formatSpanishDateTime } from "@app/shared/utils/date.utils";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAssignment";
import { useFuelRequests } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useFuelRequests";
import { useFuelRequestDetail } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useFuelRequestDetail";
import { useSupplyRequestDecision } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useSupplyRequestDecision";
import { useReasonsInventoryRemoval } from "@app/modules/Inventory/ui/hooks/useReasonsInventoryRemoval";
import type { useReasonsInventoryRemovalProps } from "@app/modules/Inventory/application/interfaces/hooks/useReasonsInventoryRemovalProps";

import { FuelRequestsSectionFilters } from "./fuel-requests-section-filters";
import type { FuelRequestsFilters } from "./fuel-requests-section-filters.types";
import type { FuelRequestDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/fuel-requests/fuel-requests.response";

import { ModalInfoField as SharedModalInfoField } from "../modal-info-field/modal-info-field";
import { ApproveRequestModal } from "../approve-request-modal/approve-request-modal";
import { DeclineRequestModal } from "../decline-request-modal/decline-request-modal";
import { REQUEST_STATUS_TABS, getStatusBadgeClassName } from "../../utils/request-status";
import { StatusTabsOverlay } from "../status-tabs-overlay/status-tabs-overlay";

const DEFAULT_FUEL_FILTERS: FuelRequestsFilters = {
  page_number: 1,
  page_size: 10,
};

function ModalInfoField(props: { label: string; value: React.ReactNode }) {
  return <SharedModalInfoField {...props} valueClassName="text-[15px]" />;
}

export const CombustibleRequests = function () {
  const { companyId, moduleCode } = useUserStore();

  const [filters, setFilters] = useState<FuelRequestsFilters>(DEFAULT_FUEL_FILTERS);
  const [selectedFuelRequestId, setSelectedFuelRequestId] = useState<string | null>(null);

  const { AlertComponent, handleRequestSuccess, handleRequestError } = useAlertState();
  const { ApproveSupplyRequest: ApproveFuelRequest, DeclineSupplyRequest: DeclineFuelRequest } =
    useSupplyRequestDecision({
      listKey: "fuel-requests",
      detailKey: "fuel-request-detail",
    });

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
    if (!selectedFuelRequestId || !selectedReasonId) {
      setApproveError("Selecciona un motivo de salida de inventario.");
      return;
    }
    setApproveError("");
    try {
      await ApproveFuelRequest.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        supply_request_id: selectedFuelRequestId,
        code: detailData?.fuel_request_code ?? "",
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
      console.error("Approve fuel request error", error);
    }
  };

  const handleDecline = async () => {
    if (!selectedFuelRequestId) return;
    setDeclineError("");
    try {
      await DeclineFuelRequest.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        supply_request_id: selectedFuelRequestId,
        code: detailData?.fuel_request_code ?? "",
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
      console.error("Decline fuel request error", error);
    }
  };

  const { GetMachineryCatalog } = useWarehouseAssignment({
    payloadMachineryCatalog: { company_id: companyId, module_code: moduleCode },
  });

  const machineryOptions = useMemo(
    () =>
      (GetMachineryCatalog.data?.data ?? []).map((machinery) => ({
        value: machinery.machinery_id,
        label: [machinery.code, machinery.brand, machinery.model]
          .filter(Boolean)
          .join(" - ") || machinery.machinery_id,
      })),
    [GetMachineryCatalog.data],
  );

  const payloadGetFuelRequestsRequest = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      ...filters,
      page_number: filters.page_number ?? 1,
      page_size: filters.page_size ?? 10,
    }),
    [companyId, moduleCode, filters],
  );

  const { GetFuelRequestsQuery } = useFuelRequests({
    payloadGetFuelRequestsRequest,
  });

  const { data: fuelRequestsData, isPending, isFetching } = GetFuelRequestsQuery;
  const memoizedRows = useMemo(() => fuelRequestsData?.data ?? [], [fuelRequestsData?.data]);

  const { GetFuelRequestDetailQuery } = useFuelRequestDetail({
    payloadGetFuelRequestDetailRequest: selectedFuelRequestId
      ? { company_id: companyId, module_code: moduleCode, fuel_request_id: selectedFuelRequestId }
      : undefined,
  });

  const detailData = GetFuelRequestDetailQuery.data;
  const isDetailLoading =
    GetFuelRequestDetailQuery.isPending || GetFuelRequestDetailQuery.isFetching;

  const columns = useMemo(
    () => [
      {
        key: "fuel_request_code",
        label: "Código de solicitud",
        render: (item: FuelRequestDto) => <span>{item.fuel_request_code}</span>,
      },
      {
        key: "machinery_code",
        label: "Maquinaria",
        render: (item: FuelRequestDto) => (
          <span>
            {[item.machinery_code, item.machinery_brand, item.machinery_model]
              .filter(Boolean)
              .join(" - ") || "—"}
          </span>
        ),
      },
      {
        key: "requested_by_user_name",
        label: "Solicitante",
        render: (item: FuelRequestDto) => <span>{item.requested_by_user_name}</span>,
      },
      {
        key: "outflow_status",
        label: "Estado",
        render: (item: FuelRequestDto) => (
          <Badges
            color="info"
            className={getStatusBadgeClassName(item.outflow_status)}
            label={OutflowStatusValues[item.outflow_status]?.label ?? String(item.outflow_status)}
          />
        ),
      },
      {
        key: "created_at",
        label: "Fecha - Hora de solicitud",
        render: (item: FuelRequestDto) => {
          const datePart = item.created_at ? item.created_at.slice(0, 10) : "";
          const timePart = item.created_at ? item.created_at.slice(11, 19) : "";
          return <span>{formatSpanishDateTime(datePart, timePart)}</span>;
        },
      },
      {
        key: "actions",
        label: "Acciones",
        render: (item: FuelRequestDto) => (
          <Button
            label="Ver detalle"
            size="small"
            onClick={() => setSelectedFuelRequestId(item.fuel_request_id)}
          />
        ),
      },
    ],
    [],
  );

  const selectedStatusTab = filters.status ?? "";

  const handleApplyFilters = (newFilters: FuelRequestsFilters) => {
    setFilters({
      ...newFilters,
      page_number: 1,
    });
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FUEL_FILTERS);
  };

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page_number: page }));
  }, []);

  const handleStatusTabChange = useCallback((status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: (status || undefined) as OutflowStatus | undefined,
      page_number: 1,
    }));
  }, []);

  const handleCloseDetail = useCallback(() => setSelectedFuelRequestId(null), []);

  return (
    <div className="flex flex-col gap-5 bg-transparent">
      <SectionHeader
        title="Filtros de búsqueda"
        subtitle="Utiliza los filtros de busqueda para una busqueda mas rapida."
      />

      <FuelRequestsSectionFilters
        filters={filters}
        machineryOptions={machineryOptions}
        isMachineryLoading={GetMachineryCatalog.isPending || GetMachineryCatalog.isFetching}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <div className="relative">
        <DataTable
          isLoading={isPending || isFetching}
          title="Solicitudes de combustible"
          data={memoizedRows}
          columns={columns}
          pagination={
            <Pagination
              pageSize={fuelRequestsData?.page_size ?? 0}
              totalRecords={fuelRequestsData?.total ?? 0}
              currentPage={fuelRequestsData?.page_number ?? 0}
              onPageChange={handlePageChange}
            />
          }
        />
        <StatusTabsOverlay
          tabs={REQUEST_STATUS_TABS}
          activeTab={selectedStatusTab}
          onChange={handleStatusTabChange}
        />
      </div>

      <Modal
        isOpen={Boolean(selectedFuelRequestId)}
        onClose={handleCloseDetail}
        title="Detalle de solicitud de combustible"
        description="Consulta la información general y auditoría de la solicitud."
        variant="default"
        size="2xl"
      >
        {isDetailLoading ? (
          <div className="py-8">
            <Loader title="Cargando detalle..." />
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
                  label={detailData.fuel_request_code}
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
                  label="MAQUINARIA"
                  value={
                    [
                      detailData.machinery_code,
                      detailData.machinery_brand,
                      detailData.machinery_model,
                    ]
                      .filter(Boolean)
                      .join(" - ") || "—"
                  }
                />
                {detailData.mileage != null ? (
                  <ModalInfoField
                    label="KILOMETRAJE"
                    value={detailData.mileage}
                  />
                ) : detailData.engine_hours != null ? (
                  <ModalInfoField
                    label="HORAS MOTOR"
                    value={detailData.engine_hours}
                  />
                ) : null}
                <ModalInfoField
                  label="PRODUCTO SOLICITADO"
                  value={detailData.product_stock_name ?? "—"}
                />
                <ModalInfoField
                  label="CANTIDAD SOLICITADA"
                  value={Number(detailData.requested_quantity).toLocaleString(
                    "es-NI",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                  )}
                />
                <div className="sm:col-span-2">
                  <ModalInfoField
                    label="SOLICITANTE"
                    value={detailData.requested_by_user_name ?? "—"}
                  />
                  <div className="mt-4 rounded-md bg-[#303846] p-3">
                    <p className="mb-1 text-[10px] font-semibold text-[#91A0B5]">
                      JUSTIFICACIÓN
                    </p>
                    <p className="text-[13px] text-[#E2E8F0]">
                      {detailData.justification ?? "—"}
                    </p>
                  </div>
                </div>
                {detailData.approved_by_user_chief_name ? (
                  <>
                    <ModalInfoField
                      label="APROBADO POR"
                      value={detailData.approved_by_user_chief_name}
                    />
                    <ModalInfoField
                      label="FECHA DE SOLICITUD"
                      value={
                        detailData.created_at
                          ? formatSpanishDateTime(
                            detailData.created_at.slice(0, 10),
                            detailData.created_at.slice(11, 19),
                          )
                          : "—"
                      }
                    />
                  </>
                ) : null}
                {detailData.annulled_by_user_chief_name ? (
                  <>
                    <ModalInfoField
                      label="ANULADO POR"
                      value={detailData.annulled_by_user_chief_name}
                    />
                    <ModalInfoField
                      label="FECHA DE SOLICITUD"
                      value={
                        detailData.created_at
                          ? formatSpanishDateTime(
                            detailData.created_at.slice(0, 10),
                            detailData.created_at.slice(11, 19),
                          )
                          : "—"
                      }
                    />
                  </>
                ) : null}
                {!detailData.approved_by_user_chief_name && !detailData.annulled_by_user_chief_name ? (
                  <ModalInfoField
                    label="FECHA DE SOLICITUD"
                    value={
                      detailData.created_at
                        ? formatSpanishDateTime(
                          detailData.created_at.slice(0, 10),
                          detailData.created_at.slice(11, 19),
                        )
                        : "—"
                    }
                  />
                ) : null}
              </div>

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

      <ApproveRequestModal
      isOpen={isApproveModalOpen}
      onClose={() => {
        setIsApproveModalOpen(false);
        setApproveObservations("");
        setSelectedReasonId("");
        setApproveError("");
      }}
      reasonOptions={reasonOptions}
      isLoadingReasons={GetReasonsInventoryRemovalQuery.isPending}
      selectedReasonId={selectedReasonId}
      onReasonChange={setSelectedReasonId}
      observations={approveObservations}
      onObservationsChange={setApproveObservations}
      error={approveError}
      isPending={ApproveFuelRequest.isPending}
      onConfirm={() => void handleApprove()}
    />

      <DeclineRequestModal
      isOpen={isDeclineModalOpen}
      onClose={() => {
        setIsDeclineModalOpen(false);
        setDeclineObservations("");
        setDeclineError("");
      }}
      observations={declineObservations}
      onObservationsChange={setDeclineObservations}
      error={declineError}
      isPending={DeclineFuelRequest.isPending}
      onConfirm={() => void handleDecline()}
    />

      {AlertComponent}
    </div>
  );
};