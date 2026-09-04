import { Avatar, Badges, ContextMenu, type ContextMenuItem, type TableColumn } from "@alpac/design-system";
import type { RequisitionAccountingReviewDto } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";
import { AccountingReviewStatus } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";
import { getStatusBadge } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-analysis-table/utils/quote-analysis.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

const contextMenuButton =
	"rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

function AvatarWithTooltip({
	fullname,
	pictureUrl,
	email,
}: {
	fullname: string;
	pictureUrl?: string;
	email: string;
}) {

	return (
		<Avatar
			label={fullname}
			pictureUrl={pictureUrl}
			tooltipPlacement="top"
			tooltip={
				<div className="flex flex-col gap-1 bg-linear-to-b from-white to-gray-100 dark:from-[#272b34] dark:to-[#1e2229]">
					<span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
						Correo
					</span>
					<span className="break-all text-sm font-medium text-slate-900 dark:text-white">
						{email}
					</span>

					<span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
						Correo
					</span>
					<span className="break-all text-sm font-medium text-slate-900 dark:text-white">
						{email}
					</span>
				</div>
			}
		/>
	);
}

export function getQuoteAnalysisColumns(
	onViewDetail?: (row: RequisitionAccountingReviewDto) => void,
	onSendToReview?: (row: RequisitionAccountingReviewDto) => void): TableColumn<RequisitionAccountingReviewDto>[] {

	return [
		{
			key: "enviado_por",
			label: "Enviado por",
			render: (row: RequisitionAccountingReviewDto) => {
				const sender = row.sent_by_user_information;
				const fullname = sender?.fullname?.trim() || "—";
				const pictureUrl = sender?.picture_url?.trim();
				const email = sender?.email?.trim() || "—";

				return (
					<AvatarWithTooltip
						fullname={fullname}
						pictureUrl={pictureUrl}
						email={email}
					/>
				);
			},
		},
		{
			key: "status",
			label: "Estado",
			render: (row: RequisitionAccountingReviewDto) => {
				const badge = getStatusBadge(row.status);
				return <Badges label={badge.label} color={badge.color} />;
			},
		},
		{
			key: "email",
			label: "Email",
			render: (row: RequisitionAccountingReviewDto) => row.sent_by_user_information?.email?.trim() || "—",
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

				let items: ContextMenuItem[] = [
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
					})
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
