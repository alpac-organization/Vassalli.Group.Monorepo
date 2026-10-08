import { m } from "framer-motion";
import { useCallback, useState } from "react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { Loader } from "@app/shared/components/loaders/loader";
import { useOperationalOrders } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useOperationalOrders";
import { OperationalOrderStatusEnum } from "@app/modules/warehouse/domain/enums/warehouse-managua/operational-order-status.enum";
import type { OperationalOrderListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-orders-response";
import { AssignmentHeader } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-header/assignment-header";
import { AssignmentFilters } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-filters/assignment-filters";
import { AssignmentOrdersTable } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-orders-table/assignment-orders-table";
import { AssignmentsListModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignments-list-modal/assignments-list-modal";
import { OperationalOrderDetailModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/components/operational-order-detail-modal/operational-order-detail-modal";
import type { AssignmentPageFilters } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/types/assignment-page.types";

const PAGE_SIZE = 10;
const EMPTY_FILTERS: AssignmentPageFilters = {
  code: "",
};

export function AssignmentPage() {
  const { companyId, moduleCode } = useUserStore();
  const { AlertComponent, handleRequestError, handleRequestSuccess } =
    useAlertState();

  const [pageNumber, setPageNumber] = useState(1);
  const [appliedFilters, setAppliedFilters] =
    useState<AssignmentPageFilters>(EMPTY_FILTERS);


  const [selectedOrderForAssignments, setSelectedOrderForAssignments] =
    useState<OperationalOrderListItem | null>(null);
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);

  const { GetOperationalOrders } = useOperationalOrders({
    payloadOperationalOrders: {
      company_id: companyId,
      module_code: moduleCode,
      page_size: PAGE_SIZE,
      page_number: pageNumber,
      code: appliedFilters.code ?? "",
      status: OperationalOrderStatusEnum.Assignment.value
    },
  });

  const { data: ordersData, isLoading, isFetching } = GetOperationalOrders;

  const handleApplyFilters = useCallback((filters: AssignmentPageFilters) => {
    setAppliedFilters(filters);
    setPageNumber(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_FILTERS);
    setPageNumber(1);
  }, []);

  const handleViewAssignments = useCallback(
    (order: OperationalOrderListItem) => {
      setSelectedOrderForAssignments(order);
    },
    [],
  );

  const handleViewOrderDetail = useCallback(
    (order: OperationalOrderListItem) => {
      setDetailOrderId(order.operation_order_id);
    },
    [],
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

      <AssignmentHeader />

      <AssignmentFilters
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <AssignmentOrdersTable
        data={ordersData?.data ?? []}
        currentPage={ordersData?.page_number ?? pageNumber}
        totalRecords={ordersData?.total ?? 0}
        pageSize={ordersData?.page_size ?? PAGE_SIZE}
        isFetching={isFetching}
        onPageChange={setPageNumber}
        onViewAssignments={handleViewAssignments}
        onViewOrderDetail={handleViewOrderDetail}
      />

      {/* Modal Principal de Asignaciones */}
      <AssignmentsListModal
        isOpen={Boolean(selectedOrderForAssignments)}
        onClose={() => setSelectedOrderForAssignments(null)}
        order={selectedOrderForAssignments}
        onAlertSuccess={handleRequestSuccess}
        onAlertError={handleRequestError}
      />

      {/* Modal opcional para ver el detalle de la OP */}
      <OperationalOrderDetailModal
        isOpen={Boolean(detailOrderId)}
        onClose={() => setDetailOrderId(null)}
        orderId={detailOrderId}
      />

      {AlertComponent}
    </m.div>
  );
}
export default AssignmentPage;
