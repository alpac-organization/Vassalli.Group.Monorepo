import { Avatar, Badges, ContextMenu } from "@alpac/design-system";
import { getPriorityLevelBadge, getStatusBadge } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-analysis-table/utils/quote-analysis.utils";
import { AccountingReviewStatus } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { RequisitionAccountingReviewDto } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";
import type { ContextMenuItem, TableColumn } from "@alpac/design-system"

const contextMenuButton =
	"rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";


export function getQuoteAnalysisColumns(
	onViewDetail?: 	 (row: RequisitionAccountingReviewDto) => void,
	onSendToReview?: (row: RequisitionAccountingReviewDto) => void,
	onAnnul?: 		 (row: RequisitionAccountingReviewDto) => void,
	onGeneratePdf?:  (row: RequisitionAccountingReviewDto) => void,
): TableColumn<RequisitionAccountingReviewDto>[] {

	return [
		{
			key: "purchase_request_code",
			label: "Codigo de solicitud",
			render: (row: RequisitionAccountingReviewDto) => {
				return <span>{row.purchase_request_information.code}</span>
			},
		},
		{
			key: "enviado_por",
			label: "Enviado por",
			render: (row: RequisitionAccountingReviewDto) => {
				const sender 	 = row.sent_by_user_information;
				
				const email 	 = sender?.email?.trim() 		|| "—";
				const fullname 	 = sender?.fullname?.trim() 	|| "—";
				const pictureUrl = sender?.picture_url?.trim() 	|| "-";

				return (
					<Avatar
						label={fullname}
						pictureUrl={pictureUrl}
						description={email}
					/>
				);
			},
		},
		{
			key: "status",
			label: "Estado de revición",
			render: (row: RequisitionAccountingReviewDto) => {
				const badge = getStatusBadge(row.status);
				return <Badges label={badge.label} color={badge.color} />;
			},
		},
		{
			key: "priority_level",
			label: "Prioridad de la solicitud",
			render: (row: RequisitionAccountingReviewDto) => {
				const badge = getPriorityLevelBadge(
					row.purchase_request_information?.priority_level,
				);

				return <Badges label={badge.label} color={badge.color} />;
			},
		},
		{
			key: "area",
			label: "Área",
			render: (row: RequisitionAccountingReviewDto) =>
				row.sent_by_user_information?.work_area_information?.work_area_name?.trim() ||
				"—",
		},
		{
			key: "sent_to_review_at",
			label: "Enviado a Revisión",
			render: (row: RequisitionAccountingReviewDto) => formatDateToSpanishWords(row.sent_to_review_at),
		},
		{
			key: "actions",
			label: "Acciones",
			render: (row: RequisitionAccountingReviewDto) => {

				const items: ContextMenuItem[] = [
					{
						label: "Ver detalle",
						onClick: () => onViewDetail?.(row),
					},
				];

				const isPending = row.status === AccountingReviewStatus.Pending.textValue;

				if (isPending) {
					items.push({
						label: "Enviar a revisión",
						onClick: () => onSendToReview?.(row),
					});
					items.push({
						label: "Anular / Retornar",
						onClick: () => onAnnul?.(row),
					});
				}
				else {
					items.push({
						label: "Generar PDF",
						onClick: () => onGeneratePdf?.(row),
					});
				}

				return (
					<ContextMenu
						items={items}
						triggerClassName={contextMenuButton}
					/>
				)
			}
		},
	];
}
