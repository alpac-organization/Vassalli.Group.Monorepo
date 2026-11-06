import { useCallback, useMemo, useState } from "react";

import type { OutflowStatus } from "@app/core/enums/outflow-status.enum";
import { OutflowStatus as OutflowStatusValues } from "@app/core/enums/outflow-status.enum";
import { Badges, Button, DataTable, Modal, Pagination, SectionHeader } from "@alpac/design-system";

import { Loader } from "@app/shared/components/loaders/loader";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAssignment";
import { useFuelRequests } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useFuelRequests";
import { useFuelRequestDetail } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useFuelRequestDetail";

import { FuelRequestsSectionFilters } from "./fuel-requests-section-filters";
import type { FuelRequestsFilters } from "./fuel-requests-section-filters.types";
import type { FuelRequestDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/fuel-requests/fuel-requests.response";

const DEFAULT_FUEL_FILTERS: FuelRequestsFilters = {
  page_number: 1,
  page_size: 10,
};

const FUEL_STATUS_TABS = [
  { id: "", label: "Todos", color: "#94a3b8" },
  { id: "PendingReview", label: "Pendiente revisión", color: "#F97316" },
  { id: "Approved", label: "Aprobado", color: "#22c55e" },
  { id: "Annuled", label: "Anulado", color: "#f87171" },
  { id: "PendingDispatch", label: "En proceso", color: "#5e57eb" },
  { id: "DispatchCancelled", label: "Despacho cancelado", color: "#c084fc" },
] as const;

const getFuelStatusBadgeClassName = (status: OutflowStatus) => {
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

export const CombustibleRequests = function () {
  const { companyId, moduleCode } = useUserStore();
  const { AlertComponent } = useAlertState();

  const [filters, setFilters] = useState<FuelRequestsFilters>(DEFAULT_FUEL_FILTERS);
  const [selectedFuelRequestId, setSelectedFuelRequestId] = useState<string | null>(null);

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
            {item.machinery_code} - {item.machinery_brand} - {item.machinery_model}
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
            className={getFuelStatusBadgeClassName(item.outflow_status)}
            label={OutflowStatusValues[item.outflow_status]?.label ?? String(item.outflow_status)}
          />
        ),
      },
      {
        key: "created_at",
        label: "Fecha - Hora de solicitud",
        render: (item: FuelRequestDto) => (
          <span>{new Date(item.created_at).toLocaleDateString()}</span>
        ),
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
          toolbarEnd={
            <div className="flex items-center gap-1">
              {FUEL_STATUS_TABS.map((tab) => {
                const active = selectedStatusTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleStatusTabChange(tab.id)}
                    className={`min-h-0 shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                      active ? "text-white" : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                    style={{ borderColor: active ? tab.color : "transparent", color: active ? tab.color : undefined }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          }
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
            <Badges
              color="info"
              className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
              label={detailData.fuel_request_code}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailField
                label="Estado"
                value={
                  <Badges
                    color="info"
                    className={getFuelStatusBadgeClassName(detailData.outflow_status)}
                    label={
                      OutflowStatusValues[detailData.outflow_status]?.label ??
                      String(detailData.outflow_status)
                    }
                  />
                }
              />
              <DetailField label="Solicitante" value={detailData.requested_by_user_name ?? "—"} />
              <DetailField label="Maquinaria" value={`${detailData.machinery_information.machinery_code} - ${detailData.machinery_information.machinery_brand}`} />
              <DetailField label="Producto" value={detailData.product_stock_name ?? "—"} />
              <DetailField label="Cantidad solicitada" value={detailData.requested_quantity} />
              <DetailField label="Kilometraje" value={detailData.mileage ?? "—"} />
              <DetailField label="Horas motor" value={detailData.engine_hours ?? "—"} />
              <DetailField label="Fecha de solicitud" value={detailData.created_at ? new Date(detailData.created_at).toLocaleDateString() : "—"} />
              <DetailField label="Aprobado por" value={detailData.approved_by_user_chief_name ?? "—"} />
              <DetailField label="Anulado por" value={detailData.annulled_by_user_chief_name ?? "—"} />
            </div>
          </div>
        )}
      </Modal>

      {AlertComponent}
    </div>
  );
};