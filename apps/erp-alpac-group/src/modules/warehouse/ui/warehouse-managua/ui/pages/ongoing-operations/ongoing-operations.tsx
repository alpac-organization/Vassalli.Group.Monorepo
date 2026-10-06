import { m } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { useOperationalOrders } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useOperationalOrders";
import { OperationsHeader } from "./components/operations-header/operations-header";
import { OperationsFilters } from "./components/operations-filters/operations-filters";
import { OperationsTable } from "./components/operations-table/operations-table";
import { OperationalOrderDetailModal } from "./components/operational-order-detail-modal/operational-order-detail-modal";
import { UpdateReceptionInformationModal } from "./components/update-reception-info-modal/update-reception-info-modal";
import type {
  OngoingOperationsFilters,
  SelectedOperationTarget,
} from "./types/ongoing-operations.types";
import type { OperationalOrderListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-orders-response";

const PAGE_SIZE = 10;
const EMPTY_FILTERS: OngoingOperationsFilters = {
  code: "",
  customer_cif: "",
  status: "",
};

export function OngoingOperationsPage() {
  const { companyId, moduleCode } = useUserStore();

  const [pageNumber, setPageNumber] = useState(1);
  const [appliedFilters, setAppliedFilters] =
    useState<OngoingOperationsFilters>(EMPTY_FILTERS);

  // Estados de modales
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);
  const [updateTarget, setUpdateTarget] =
    useState<SelectedOperationTarget | null>(null);

  const payloadOperationalOrders = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      page_number: pageNumber,
      page_size: PAGE_SIZE,
      code: appliedFilters.code || undefined,
      customer_cif: appliedFilters.customer_cif || undefined,
      status: appliedFilters.status || undefined,
    }),
    [companyId, moduleCode, pageNumber, appliedFilters],
  );

  const { GetOperationalOrders } = useOperationalOrders({
    payloadOperationalOrders,
  });

  const { data: ordersData, isLoading, isFetching, refetch } =
    GetOperationalOrders;

  const handleApplyFilters = useCallback((filters: OngoingOperationsFilters) => {
    setAppliedFilters(filters);
    setPageNumber(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_FILTERS);
    setPageNumber(1);
  }, []);

  const handleViewDetail = useCallback((order: OperationalOrderListItem) => {
    setDetailOrderId(order.operation_order_id);
  }, []);

  const handleUpdateInfo = useCallback((order: OperationalOrderListItem) => {
    setUpdateTarget({
      operation_order_id: order.operation_order_id,
      po_code: order.po_code,
      customer_id: order.customer_information?.customer_id ?? null,
      customer_name: order.customer_information?.customer_name ?? null,
      customer_cif: order.customer_information?.cif ?? null,
    });
  }, []);

  const handleOpenUpdateFromDetail = useCallback(
    (orderId: string) => {
      const order = ordersData?.data.find((o) => o.operation_order_id === orderId);
      setDetailOrderId(null);
      setUpdateTarget({
        operation_order_id: orderId,
        po_code: order?.po_code || "",
        customer_id: order?.customer_information?.customer_id ?? null,
        customer_name: order?.customer_information?.customer_name ?? null,
        customer_cif: order?.customer_information?.cif ?? null,
      });
    },
    [ordersData?.data],
  );

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
      {isLoading && <Loader title="Cargando órdenes operacionales..." />}

      <OperationsHeader />

      <OperationsFilters
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <OperationsTable
        data={ordersData?.data ?? []}
        currentPage={ordersData?.page_number ?? pageNumber}
        totalRecords={ordersData?.total ?? 0}
        pageSize={ordersData?.page_size ?? PAGE_SIZE}
        isFetching={isFetching}
        onPageChange={setPageNumber}
        onViewDetail={handleViewDetail}
        onUpdateInfo={handleUpdateInfo}
      />

      {/* Modal de Detalle de Orden Operacional */}
      <OperationalOrderDetailModal
        isOpen={Boolean(detailOrderId)}
        onClose={() => setDetailOrderId(null)}
        orderId={detailOrderId}
        onOpenUpdateInfo={handleOpenUpdateFromDetail}
      />

      {/* Modal de Registro / Actualización de Información de Recepción */}
      <UpdateReceptionInformationModal
        isOpen={Boolean(updateTarget)}
        onClose={() => setUpdateTarget(null)}
        orderId={updateTarget?.operation_order_id ?? null}
        poCode={updateTarget?.po_code}
        initialData={{
          customerId: updateTarget?.customer_id,
          packageAmount: updateTarget?.package_amount,
          merchandiseWeight: updateTarget?.merchandise_weight,
        }}
        onSuccess={() => {
          refetch();
        }}
      />
    </m.div>
  );
}
