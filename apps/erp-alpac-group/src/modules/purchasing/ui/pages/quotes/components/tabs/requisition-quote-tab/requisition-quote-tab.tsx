import { useCallback, useState } from "react";
import { QuotesTable } from "@app/modules/purchasing/ui/pages/quotes/components/quotes-table/quotes-table";
import { CreateQuoteModal } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-modal";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { Loader } from "@app/shared/components/loaders/loader";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";

import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import type { GetPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-payload";
import type { QuotesModalType } from "../../../types/quotes-modal.types";
import type { RequisitionQuoteTabProps } from "./requisition-quote-tab.types";

const PAGE_SIZE = 5;
const sendButtonClass = "rounded-md! h-11 px-6! border border-blue-200 dark:border-blue-500/70 bg-blue-50 dark:bg-blue-500/30 text-blue-600 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/60 hover:text-blue-700 dark:hover:text-blue-300 shadow-sm transition-all duration-200";
const cancelButtonClass = "rounded-md! h-11 px-6! hover:bg-slate-200 bg-slate-500 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600";

export function RequisitionQuoteTab({
	onRequestError,
	onRequestSuccess,
}: RequisitionQuoteTabProps) {

	const { companyId, moduleCode } = useUserStore();

	const [activeModal, setActiveModal] = useState<QuotesModalType>(null);
	const [selectedPurchaseRequest, setSelectedPurchaseRequest] = useState<GetPurchaseRequestResponse | null>();

	const [filters, setFilters] = useState<GetPurchaseRequestPayload>({
		company_id: companyId,
		module_code: moduleCode,
		status: PurchaseRequestStatusEnum.Approved.value,
		page_number: 1,
		page_size: PAGE_SIZE,
	});

	const { GetPurchaseRequests } = usePurchase({
		getPurchaseRequestsPayload: {
			...filters,
			company_id: companyId,
			module_code: moduleCode,
			status: PurchaseRequestStatusEnum.Approved.value,
			request_type: PurchaseRequestEnum.Requisition.value,
			page_size: PAGE_SIZE,
		},
	});

	const purchaseRequests = GetPurchaseRequests.data?.data ?? [];
	const totalRecords = GetPurchaseRequests.data?.total ?? 0;
	const currentPage = filters.page_number ?? 1;

	const handlePageChange = useCallback((page: number) => {
		setFilters((prev) => ({
			...prev,
			page_number: page,
		}));
	}, []);

	const handleViewDetail = useCallback((purchaseRequest: GetPurchaseRequestResponse) => {
		setSelectedPurchaseRequest(purchaseRequest);
		setActiveModal("view-purchase-request-details");
	}, []);

	const handleSendForReview = useCallback((purchaseRequest: GetPurchaseRequestResponse) => {
		setSelectedPurchaseRequest(purchaseRequest);
		setActiveModal("send-purchase-request-for-review");
	}, []);

	const handleCloseModal = useCallback(() => {
		setActiveModal(null);
		setSelectedPurchaseRequest(null);
	}, []);	

	return (
		<div className="flex flex-col gap-4">

			{(GetPurchaseRequests.isPending || GetPurchaseRequests.isFetching) && (
				<Loader title="Cargando solicitudes aprobadas..." />
			)}

			<div className="flex flex-col gap-4">

				<QuotesTable
					data={purchaseRequests}
					currentPage={currentPage}
					pageSize={PAGE_SIZE}
					totalRecords={totalRecords}
					onPageChange={handlePageChange}
					isPaginationDisabled={GetPurchaseRequests.isFetching}
					onViewDetail={handleViewDetail}
					onSendForReview={handleSendForReview}
				/>

				<CreateQuoteModal
					isOpen={activeModal === "view-purchase-request-details"}
					onClose={handleCloseModal}
					purchaseRequest={selectedPurchaseRequest}
					onRequestError={onRequestError}
					onRequestSuccess={onRequestSuccess}
				/>

				<ConfirmModal
					type="SEND"
					title="¿Está seguro de enviar esta solicitud a revisión?"
					isOpen={activeModal === "send-purchase-request-for-review"}
					handleFinalAction={() => { }}
					buttonActionLabel="Enviar"
					onClose={handleCloseModal}
					buttonActionClass={sendButtonClass}
					buttonCancelClass={cancelButtonClass}
				/>
			</div>
		</div>
	);
}
