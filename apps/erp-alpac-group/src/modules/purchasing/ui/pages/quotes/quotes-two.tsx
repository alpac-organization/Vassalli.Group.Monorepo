import { useCallback, useState } from "react";
import { m } from "framer-motion";
import { Breadcrumb } from "@alpac/design-system";
import { useNavigate } from "react-router-dom";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { QuotesPageHeader } from "@app/modules/purchasing/ui/pages/quotes/components/quotes-page-header/quotes-page-header";
import { QuotesTable } from "@app/modules/purchasing/ui/pages/quotes/components/quotes-table/quotes-table";
import { CreateQuoteModal } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-modal";
import { usePurchase } from "../../hooks/purchase/usePurchase";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { Loader } from "@app/shared/components/loaders/loader";
import type { QuotesModalType } from "./types/quotes-modal.types";
import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import type { GetPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-payload";

const PAGE_SIZE = 5;

export function QuotesTwo() {
	const navigate = useNavigate();

	const { baseUrl } = useBaseUrl();
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

	const handleCreateQuote = useCallback(
		(purchaseRequest: GetPurchaseRequestResponse) => {
			setSelectedPurchaseRequest(purchaseRequest);
			setActiveModal("create-quote");
		},
		[],
	);

	const handleViewDetail = useCallback(
		(purchaseRequest: GetPurchaseRequestResponse) => {
			setSelectedPurchaseRequest(purchaseRequest);
			setActiveModal("quote-details");
		},
		[],
	);

	const handleCloseModal = useCallback(() => {
		setActiveModal(null);
	}, []);

	const handleQuoteCreated = useCallback(() => {}, []);

	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col gap-4"
		>
			{(GetPurchaseRequests.isPending || GetPurchaseRequests.isFetching) && (
				<Loader title="Cargando solicitudes aprobadas..." />
			)}

			<div className="flex flex-col gap-4">
				<div className="flex justify-start">
					<Breadcrumb
						items={[
							{
								label: "Dashboard",
								url: `${baseUrl}/`,
								onClick: (url) => navigate(url),
							},
							{
								label: "Cotizaciones",
								url: `${baseUrl}/purchasing/quotes`,
								onClick: (url) => navigate(url),
							},
						]}
					/>
				</div>

				<QuotesPageHeader />

				<QuotesTable
					data={purchaseRequests}
					onCreateQuote={handleCreateQuote}
					onViewDetail={handleViewDetail}
					currentPage={currentPage}
					pageSize={PAGE_SIZE}
					totalRecords={totalRecords}
					onPageChange={handlePageChange}
					isPaginationDisabled={GetPurchaseRequests.isFetching}
				/>

				<CreateQuoteModal
					isOpen={activeModal === "create-quote"}
					onClose={handleCloseModal}
					onQuoteCreated={handleQuoteCreated}
          purchaseRequest={selectedPurchaseRequest!}
				/>
			</div>
		</m.div>
	);
}
