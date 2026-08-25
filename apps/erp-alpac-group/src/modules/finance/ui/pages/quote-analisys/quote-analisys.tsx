import { useCallback, useMemo, useState } from "react";
import { m } from "framer-motion";
import { Alert, AnimatedAlertWrapper, Breadcrumb } from "@alpac/design-system";
import { useNavigate } from "react-router-dom";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { Loader } from "@app/shared/components/loaders/loader";
import { QuotesPageHeader } from "@app/modules/purchasing/ui/pages/quotes/components/quotes-page-header/quotes-page-header";
import { useQuoteAnalysis } from "@app/modules/finance/ui/hooks/quotes-analysis/useQuoteAnalysis";
import type { accountingReviewStatusType } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";
import type { GetQuotesAnalysisRequest } from "@app/modules/finance/domain/ApiContract/requests/get-quote-analysis";
import type { RequisitionAccountingReviewDto } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";
import type { QuoteAnalysisFiltersValues } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-analysis-filters/types/quote-analysis-filters.types";
import type { SendReviewModalConfirmPayload } from "@app/modules/finance/ui/pages/quote-analisys/components/send-review-modal/send-review-modal.types";
import { QuoteAnalysisFilters } from "./components/quote-analysis-filters/quote-analysis-filters";
import { QuoteAnalysisTable } from "./components/quote-analysis-table/quote-analysis-table";
import { SendReviewModal } from "./components/send-review-modal/send-review-modal";
import { useMappedError } from "@app/shared/hooks/useMappedError";

const PAGE_SIZE = 10;

export function QuoteAnalisys() {
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();
	const { getMappedError } = useMappedError();
	const { companyId, moduleCode } = useUserStore();
	const [pageNumber, setPageNumber] = useState(1);
	const [appliedStatus, setAppliedStatus] = useState<
		accountingReviewStatusType | ""
	>("");
	const [appliedAreaId, setAppliedAreaId] = useState("");
	const [pendingReview, setPendingReview] =
		useState<RequisitionAccountingReviewDto | null>(null);
	const { alertState, handleCloseAlert, handleRequestSuccess, handleRequestError } =
		useAlertState();

	const payloadGetQuoteAnalysis = useMemo<GetQuotesAnalysisRequest>(
		() => ({
			company_id: companyId,
			module_code: moduleCode,
			page_number: pageNumber,
			page_size: PAGE_SIZE,
			...(appliedStatus && { status: appliedStatus }),
			...(appliedAreaId && { area_id: appliedAreaId }),
		}),
		[companyId, moduleCode, pageNumber, appliedStatus, appliedAreaId],
	);

	const { GetQuoteAnalysis, SendReviewToManagement } = useQuoteAnalysis({
		payloadGetQuoteAnalysis,
	});

	const { data: quoteAnalysis, isLoading, isFetching } = GetQuoteAnalysis;
	const quotes = quoteAnalysis?.data ?? [];
	const totalRecords = quoteAnalysis?.total ?? 0;

	const handleApplyFilters = useCallback(
		(filters: QuoteAnalysisFiltersValues) => {
			setAppliedStatus(filters.status);
			setAppliedAreaId(filters.area_id);
			setPageNumber(1);
		},
		[],
	);

	const handleClearFilters = useCallback(() => {
		setAppliedStatus("");
		setAppliedAreaId("");
		setPageNumber(1);
	}, []);

	const handlePageChange = useCallback((page: number) => {
		setPageNumber(page);
	}, []);

	const handleViewDetail = useCallback(
		(row: { requisition_accounting_review_id: string }) => {
			navigate(
				`${baseUrl}/finance/analisys/${row.requisition_accounting_review_id}`,
			);
		},
		[navigate, baseUrl],
	);

	const handleSendToReview = useCallback((row: RequisitionAccountingReviewDto) => {
		setPendingReview(row);
	}, []);

	const handleCloseSendModal = useCallback(() => {
		if (SendReviewToManagement.isPending) return;
		setPendingReview(null);
	}, [SendReviewToManagement.isPending]);

	const handleConfirmSendToReview = useCallback(
		(payload: SendReviewModalConfirmPayload) => {
			if (!pendingReview || !companyId || !moduleCode) return;

			SendReviewToManagement.mutate(
				{
					company_id: companyId,
					module_code: moduleCode,
					requisition_accounting_review_id:
						pendingReview.requisition_accounting_review_id,
					comments: payload.comments,
					is_approved: payload.isApproved,
				},
				{
					onSuccess: () => {
						setPendingReview(null);
						handleRequestSuccess("La solicitud se envió a revisión gerencial.");
					},
					onError: (error) => {
						const errorMessage = getMappedError(error);
						handleRequestError(errorMessage.description ?? "Error al enviar la solicitud a revisión gerencial.");
					},
				},
			);
		},
		[
			SendReviewToManagement,
			companyId,
			handleRequestSuccess,
			handleRequestError,
			moduleCode,
			pendingReview,
		],
	);

	const pendingLabel =
		pendingReview?.purchase_request?.code?.trim() ||
		pendingReview?.sent_by_user_information?.fullname?.trim() ||
		"esta solicitud";

	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
		>
			{isLoading && <Loader title="Cargando análisis de cotizaciones..." />}

			<div className="flex justify-start">
				<Breadcrumb
					items={[
						{
							label: "Dashboard",
							url: `${baseUrl}/`,
							onClick: (url) => navigate(url),
						},
						{
							label: "Análisis comparativo",
							url: `${baseUrl}/finance/analisys`,
							onClick: (url) => navigate(url),
						},
					]}
				/>
			</div>

			<QuotesPageHeader
				title="Análisis comparativo"
				subtitle="Revise y compare las solicitudes de cotización enviadas a revisión contable"
			/>

			<QuoteAnalysisFilters
				onApply={handleApplyFilters}
				onClear={handleClearFilters}
			/>

			<QuoteAnalysisTable
				data={quotes}
				currentPage={quoteAnalysis?.page_number ?? pageNumber}
				totalRecords={totalRecords}
				pageSize={quoteAnalysis?.page_size ?? PAGE_SIZE}
				onPageChange={handlePageChange}
				isFetching={isFetching}
				onViewDetail={handleViewDetail}
				onSendToReview={handleSendToReview}
			/>

			<SendReviewModal
				isOpen={Boolean(pendingReview)}
				pendingLabel={pendingLabel}
				isSubmitting={SendReviewToManagement.isPending}
				onClose={handleCloseSendModal}
				onConfirm={handleConfirmSendToReview}
			/>

			<AnimatedAlertWrapper open={alertState?.open ?? false}>
				<Alert
					type={alertState?.type!}
					title={alertState?.title}
					message={alertState?.message!}
					onClose={handleCloseAlert}
				/>
			</AnimatedAlertWrapper>
		</m.div>
	);
}
