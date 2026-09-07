import {
	Avatar, Badges, ContextMenu,
	type ContextMenuItem,
	type TableColumn
} from "@alpac/design-system";
import type { RequisitionManagementReviewDto } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-reviews";
import { ManagementReviewStatus } from "@app/modules/management/domain/enum/management-review-status";
import {
	getManagementReviewStatusBadge,
} from "@app/modules/management/ui/pages/analyzed-quotes/components/analyzed-quotes-table/utils/analyzed-quotes.utils";
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
				<div className="flex flex-col gap-0.5">
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

export function getAnalyzedQuotesColumns(
	onViewDetail?: (row: RequisitionManagementReviewDto) => void,
	processPurchaseOrder?: (row: RequisitionManagementReviewDto) => void,
): TableColumn<RequisitionManagementReviewDto>[] {

	return [
		{
			key: "code",
			label: "Código de Solicitud",
			render: (row: RequisitionManagementReviewDto) => row.purchase_request?.code?.trim() || "—",
		},
		{
			key: "enviado_por",
			label: "Enviado por",
			render: (row: RequisitionManagementReviewDto) => {
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
			render: (row: RequisitionManagementReviewDto) => {
				const badge = getManagementReviewStatusBadge(row.status);
				return <Badges label={badge.label} color={badge.color} />;
			},
		},
		{
			key: "email",
			label: "Email",
			render: (row: RequisitionManagementReviewDto) => row.sent_by_user_information?.email?.trim() || "—",
		},
		{
			key: "area",
			label: "Área Solicitante",
			render: (row: RequisitionManagementReviewDto) =>
				row.sent_by_user_information?.work_area_information?.work_area_name?.trim() ||
				"—",
		},
		{
			key: "sent_to_review_at",
			label: "Enviado a Revisión",
			render: (row: RequisitionManagementReviewDto) => formatDateToSpanishWords(row.sent_to_review_at),
		},
		{
			key: "actions",
			label: "Acciones",
			render: (row: RequisitionManagementReviewDto) => {

				const canManageApproval =
					row.status === ManagementReviewStatus.Pending.textValue;

				const items: ContextMenuItem[] = [
					{
						label: "Ver detalle",
						onClick: () => onViewDetail?.(row),
					},
				];

				if (canManageApproval) items.push({
					label: "Gestionar aprobación",
					onClick: () => processPurchaseOrder?.(row),
				})

				return (
					<ContextMenu
						items={items}
						triggerClassName={contextMenuButton}
					/>
				);
			},
		},
	];
}
