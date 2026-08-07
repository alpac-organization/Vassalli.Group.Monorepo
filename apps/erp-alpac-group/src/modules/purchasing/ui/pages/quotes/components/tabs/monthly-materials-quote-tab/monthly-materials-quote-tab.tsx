import { useCallback, useState } from "react";
import { QuotesTable } from "@app/modules/purchasing/ui/pages/quotes/components/quotes-table/quotes-table";
import { CreateQuoteModal } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-modal";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { Loader } from "@app/shared/components/loaders/loader";
import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import type { GetPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-payload";
import type { QuotesModalType } from "../../../types/quotes-modal.types";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";

const PAGE_SIZE = 5;

export function MonthlyMaterialsQuoteTab() {

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
			request_type: PurchaseRequestEnum.Monthly.value,
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

	const handleQuoteCreated = useCallback(() => { }, []);

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
					onQuoteCreated={handleQuoteCreated}
					purchaseRequest={selectedPurchaseRequest}
				/>
			</div>
		</div>
	);
}
