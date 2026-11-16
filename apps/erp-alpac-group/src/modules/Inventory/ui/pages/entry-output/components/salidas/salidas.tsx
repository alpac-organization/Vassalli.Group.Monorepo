import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, DataTable, Modal, Pagination, SectionHeader } from "@alpac/design-system";

import { StatusTabsOverlay } from "@app/shared/components/status-tabs-overlay/status-tabs-overlay";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useInventoryOutputs } from "@app/modules/Inventory/ui/hooks/useInventoryOutputs";
import { useInventoryOutputDetail } from "@app/modules/Inventory/ui/hooks/useInventoryOutputDetail";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { warehouseHttpHandler } from "@app/core/adapters";
import { InventoryOutputsServices } from "@app/modules/Inventory/infrastructure/services/inventory-outputs-services";
import { DEFAULT_SALIDAS_FILTERS } from "./salidas.types";
import { SalidasSectionFilters } from "./salidas-section-filters";
import { GetInventoryOutputsColumnsToTable } from "./salidas.variants";
import { SalidasDetailModal } from "./salidas-detail-modal";

import type { SalidasFilters } from "./salidas.types";
import type { InventoryOutputsStatus } from "@app/core/enums/inventory-output-status.enum";

const inventoryOutputsServices = new InventoryOutputsServices(warehouseHttpHandler);

const SALIDAS_STATUS_TABS = [
  { id: "", label: "Todos", color: "#94a3b8" },
  { id: "OutputPending", label: "Pendiente", color: "#F97316" },
  { id: "InProgress", label: "En progreso", color: "#5e57eb" },
  { id: "Dispatched", label: "Despachado", color: "#22c55e" },
  { id: "Rejected", label: "Rechazado", color: "#ef4444" },
] as const;

export const Salidas = function () {
  const { companyId, moduleCode } = useUserStore();
  const { AlertComponent, handleRequestSuccess, handleRequestError } = useAlertState();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<SalidasFilters>(DEFAULT_SALIDAS_FILTERS);
  const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null);
  const [dispatchActionToConfirm, setDispatchActionToConfirm] = useState<"start" | "confirm" | "reject" | null>(null);

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

  const startDispatchMutation = useMutation({
    mutationFn: (inventory_output_id: string) =>
      inventoryOutputsServices.StartInventoryOutput({
        company_id: companyId!,
        module_code: moduleCode!,
        inventory_output_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-outputs"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-output-detail"] });
      handleRequestSuccess("Despacho iniciado correctamente.");
      setDispatchActionToConfirm(null);
    },
    onError: (error) => {
      handleRequestError(error);
      setDispatchActionToConfirm(null);
    },
  });

  const confirmDispatchMutation = useMutation({
    mutationFn: (inventory_output_id: string) =>
      inventoryOutputsServices.ConfirmInventoryOutput({
        company_id: companyId!,
        module_code: moduleCode!,
        inventory_output_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-outputs"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-output-detail"] });
      handleRequestSuccess("Despacho confirmado correctamente.");
      setDispatchActionToConfirm(null);
    },
    onError: (error) => {
      handleRequestError(error);
      setDispatchActionToConfirm(null);
    },
  });

  const rejectDispatchMutation = useMutation({
    mutationFn: (payload: { inventory_output_id: string; dispatched_justification?: string }) =>
      inventoryOutputsServices.RejectInventoryOutput({
        company_id: companyId!,
        module_code: moduleCode!,
        inventory_output_id: payload.inventory_output_id,
        dispatched_justification: payload.dispatched_justification,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-outputs"] });
      handleRequestSuccess("Salida rechazada correctamente.");
      setDispatchActionToConfirm(null);
      setSelectedOutputId(null);
    },
    onError: (error) => {
      handleRequestError(error);
      setDispatchActionToConfirm(null);
    },
  });

  const handleStartDispatch = useCallback(() => {
    if (!selectedOutputId) return;
    setDispatchActionToConfirm("start");
  }, [selectedOutputId]);

  const handleConfirmDispatch = useCallback(() => {
    if (!selectedOutputId) return;
    setDispatchActionToConfirm("confirm");
  }, [selectedOutputId]);

  const handleConfirmDispatchAction = useCallback(() => {
    if (!selectedOutputId) return;
    if (dispatchActionToConfirm === "start") {
      void startDispatchMutation.mutateAsync(selectedOutputId);
    } else if (dispatchActionToConfirm === "confirm") {
      void confirmDispatchMutation.mutateAsync(selectedOutputId);
    } else if (dispatchActionToConfirm === "reject") {
      void rejectDispatchMutation.mutateAsync({ inventory_output_id: selectedOutputId });
    }
  }, [dispatchActionToConfirm, selectedOutputId, startDispatchMutation, confirmDispatchMutation, rejectDispatchMutation]);

  const handleCancelDispatchAction = useCallback(() => {
    setDispatchActionToConfirm(null);
  }, []);

  const handleRejectDispatch = useCallback(() => {
    if (!selectedOutputId) return;
    setDispatchActionToConfirm("reject");
  }, [selectedOutputId]);

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
        onStartDispatch={handleStartDispatch}
        onConfirmDispatch={handleConfirmDispatch}
        onRejectDispatch={handleRejectDispatch}
        isStartingDispatch={startDispatchMutation.isPending}
        isConfirmingDispatch={confirmDispatchMutation.isPending}
        isRejectingDispatch={rejectDispatchMutation.isPending}
      />

      <Modal
        isOpen={dispatchActionToConfirm !== null}
        onClose={handleCancelDispatchAction}
        title={
          dispatchActionToConfirm === "start"
            ? "Iniciar despacho"
            : dispatchActionToConfirm === "confirm"
              ? "Confirmar despacho"
              : "Rechazar salida"
        }
        description={
          dispatchActionToConfirm === "start"
            ? "¿Deseas iniciar el despacho de esta salida?"
            : dispatchActionToConfirm === "confirm"
              ? "¿Deseas confirmar el despacho de esta salida?"
              : "¿Deseas rechazar esta salida de inventario?"
        }
        variant="default"
        size="sm"
      >
        <div className="flex justify-end gap-2 pt-2">
          <Button
            label="Cancelar"
            onClick={handleCancelDispatchAction}
            className="rounded-md! h-10 px-4!"
          />
          <Button
            label="Confirmar"
            onClick={handleConfirmDispatchAction}
            isLoading={
              dispatchActionToConfirm === "start"
                ? startDispatchMutation.isPending
                : dispatchActionToConfirm === "confirm"
                  ? confirmDispatchMutation.isPending
                  : rejectDispatchMutation.isPending
            }
            disabled={
              dispatchActionToConfirm === "start"
                ? startDispatchMutation.isPending
                : dispatchActionToConfirm === "confirm"
                  ? confirmDispatchMutation.isPending
                  : rejectDispatchMutation.isPending
            }
            className="rounded-md! h-10 px-4! bg-blue-600 text-white hover:bg-blue-700"
          />
        </div>
      </Modal>

      {AlertComponent}
    </div>
  );
};