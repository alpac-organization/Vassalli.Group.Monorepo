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
import { getPriorityLevelBadge } from "@app/modules/purchasing/ui/pages/purchase-order/utils/purchase-order-status.variants";
import { purchaseRequestTypeBadgeVariants } from "@app/modules/purchasing/ui/pages/purchase-requests/purchase-request.variants";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

const contextMenuButton =
	"rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

export function getAnalyzedQuotesColumns(
	onViewDetail?: (row: RequisitionManagementReviewDto) => void,
	processPurchaseOrder?: (row: RequisitionManagementReviewDto) => void,
	onAnnul?: (row: RequisitionManagementReviewDto) => void,
): TableColumn<RequisitionManagementReviewDto>[] {

	return [
		{
			key: "code",
			label: "Código de la Requisición",
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
					<Avatar
						label={fullname}
						description={email}
						pictureUrl={pictureUrl}
					/>
				);
			},
		},
		{
			key: "request_type",
			label: "Tipo de Solicitud",
			render: (row: RequisitionManagementReviewDto) => {
				const requestType = row.purchase_request?.request_type;
				const variant =
					purchaseRequestTypeBadgeVariants[
						requestType as keyof typeof purchaseRequestTypeBadgeVariants
					] ?? purchaseRequestTypeBadgeVariants.default;

				return (
					<Badges
						label={variant.label || requestType || "—"}
						color={variant.badgeColor}
					/>
				);
			},
		},
		{
			key: "priority_level",
			label: "Nivel de Prioridad",
			render: (row: RequisitionManagementReviewDto) => {
				const badge = getPriorityLevelBadge(
					row.purchase_request?.priority_level,
				);

				return <Badges label={badge.label} color={badge.color} />;
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

				if (canManageApproval) {
					items.push({
						label: "Gestionar aprobación",
						onClick: () => processPurchaseOrder?.(row),
					});
					items.push({
						label: "Anular / Retornar",
						onClick: () => onAnnul?.(row),
					});
				}

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
