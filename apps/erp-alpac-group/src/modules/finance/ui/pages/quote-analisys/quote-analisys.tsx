import { useCallback, useMemo, useState } from "react";
import { m } from "framer-motion";
import {
	Breadcrumb,
	Button,
	Modal,
	RadioButton,
	Textarea,
} from "@alpac/design-system";
import { useNavigate } from "react-router-dom";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { QuotesPageHeader } from "@app/modules/purchasing/ui/pages/quotes/components/quotes-page-header/quotes-page-header";
import { useQuoteAnalysis } from "@app/modules/finance/ui/hooks/quotes-analysis/useQuoteAnalysis";
import type { accountingReviewStatusType } from "@app/modules/finance/enum/analysis-quotation/accounting-review-status";
import type { GetQuotesAnalysisRequest } from "@app/modules/finance/domain/ApiContract/requests/get-quote-analysis";
import type { RequisitionAccountingReviewDto } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";
import type { QuoteAnalysisFiltersValues } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-analysis-filters/types/quote-analysis-filters.types";
import { QuoteAnalysisFilters } from "./components/quote-analysis-filters/quote-analysis-filters";
import { QuoteAnalysisTable } from "./components/quote-analysis-table/quote-analysis-table";

const PAGE_SIZE = 10;

const textareaClassName =
	"w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500! dark:text-white!";
const textareaLabelClassName = "text-black! dark:text-white!";

export function QuoteAnalisys() {
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();
	const { companyId, moduleCode } = useUserStore();
	const [pageNumber, setPageNumber] = useState(1);
	const [appliedStatus, setAppliedStatus] = useState<
		accountingReviewStatusType | ""
	>("");
	const [appliedAreaId, setAppliedAreaId] = useState("");
	const [pendingReview, setPendingReview] =
		useState<RequisitionAccountingReviewDto | null>(null);
	const [comments, setComments] = useState("");
	const [isApproved, setIsApproved] = useState(true);

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
		setComments("");
		setIsApproved(true);
		setPendingReview(row);
	}, []);

	const handleCloseSendModal = useCallback(() => {
		if (SendReviewToManagement.isPending) return;
		setPendingReview(null);
		setComments("");
		setIsApproved(true);
	}, [SendReviewToManagement.isPending]);

	const handleConfirmSendToReview = useCallback(() => {

		if (!pendingReview || !companyId || !moduleCode) return;

		SendReviewToManagement.mutate(
			{
				company_id: companyId,
				module_code: moduleCode,
				requisition_accounting_review_id:
					pendingReview.requisition_accounting_review_id,
				comments: comments.trim() || null,
				is_approved: isApproved,
			},
			{
				onSuccess: () => {
					setPendingReview(null);
					setComments("");
					setIsApproved(true);
				},
				onError() {

				}
			},
		);
	}, [
		SendReviewToManagement,
		comments,
		companyId,
		isApproved,
		moduleCode,
		pendingReview,
	]);

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

			<Modal
				isOpen={Boolean(pendingReview)}
				onClose={handleCloseSendModal}
				variant="form"
				size="lg"
				title="Enviar a revisión"
				description={`Envíe la solicitud de ${pendingLabel} a revisión gerencial. El comentario es opcional.`}
			>
				<div className="mt-4 flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<p className="m-0 text-sm font-medium text-slate-800 dark:text-white">
							Decisión
						</p>
						<div className="flex flex-wrap gap-4">
							<RadioButton
								label="Aprobar"
								name="review-decision"
								value="approved"
								checked={isApproved}
								onChange={() => setIsApproved(true)}
							/>
							<RadioButton
								label="Rechazar"
								name="review-decision"
								value="rejected"
								checked={!isApproved}
								onChange={() => setIsApproved(false)}
							/>
						</div>
					</div>

					<Textarea
						label="Comentarios"
						placeholder="Escriba un comentario (opcional)..."
						className={textareaClassName}
						labelClassName={textareaLabelClassName}
						value={comments}
						onChange={(e) => setComments(e.target.value)}
						maxLength={500}
						enableCharacterCount
						style={{
							resize: "none",
							minHeight: "100px",
						}}
					/>

					<div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
						<Button
							type="button"
							size="giant"
							label="Cancelar"
							onClick={handleCloseSendModal}
							disabled={SendReviewToManagement.isPending}
							className="w-full! rounded-md! border! border-slate-400! bg-transparent! text-[15px]! text-slate-700! hover:bg-slate-100! dark:border-slate-500! dark:text-slate-200! dark:hover:bg-slate-700/40! sm:w-auto!"
						/>
						<Button
							type="button"
							size="giant"
							label="Enviar a revisión"
							onClick={handleConfirmSendToReview}
							isLoading={SendReviewToManagement.isPending}
							className="w-full! rounded-md! bg-alpac-primary-500! text-[15px]! text-white! dark:bg-alpac-primary-700! sm:w-auto!"
						/>
					</div>
				</div>
			</Modal>
		</m.div>
	);
}
