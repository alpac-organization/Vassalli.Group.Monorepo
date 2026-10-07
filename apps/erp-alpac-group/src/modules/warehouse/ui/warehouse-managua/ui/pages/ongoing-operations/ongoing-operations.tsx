import { m } from "framer-motion";
import { useCallback, useState } from "react";
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
import { OperationalOrderStatusEnum } from "@app/modules/warehouse/domain/enums/warehouse-managua/operational-order-status.enum";

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

	const { GetOperationalOrders } = useOperationalOrders({
		payloadOperationalOrders: {
			company_id: companyId,
			module_code: moduleCode,
			page_size: PAGE_SIZE,
			code: appliedFilters.code ?? "",
			customer_cif: appliedFilters.customer_cif ?? "",
			status: OperationalOrderStatusEnum["PendingDocument"].value,
		}
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
		});
	}, []);

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
