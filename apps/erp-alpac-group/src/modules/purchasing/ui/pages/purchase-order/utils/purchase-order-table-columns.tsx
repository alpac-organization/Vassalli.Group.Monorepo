import {
	Avatar,
	Badges,
	ContextMenu,
	type ContextMenuItem,
	type TableColumn,
} from "@alpac/design-system";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import type { GetPurchaseOrdersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-orders-response";
import { purchaseRequestStatusBadgeVariants } from "@app/modules/purchasing/ui/pages/purchase-requests/purchase-request.variants";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

const contextMenuButton =
	"rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

const emptyCell = "—";

function displayText(value?: string | null) {
	return value?.trim() || emptyCell;
}

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

export type PurchaseOrderTableColumnHandlers = {
	onViewDetail?: (row: GetPurchaseOrdersResponse) => void;
	onGeneratePurchaseOrderPdf?: (row: GetPurchaseOrdersResponse) => void;
};

export function getPurchaseOrderTableColumns({
	onViewDetail,
	onGeneratePurchaseOrderPdf,
}: PurchaseOrderTableColumnHandlers = {}): TableColumn<GetPurchaseOrdersResponse>[] {
	return [
		{
			key: "purchase_order_code",
			label: "Orden",
			render: (row) => displayText(row.purchase_order_code),
		},
		{
			key: "payment_request_code",
			label: "Solicitud de pago",
			render: (row) => displayText(row.payment_request_code),
		},
		{
			key: "supplier_name",
			label: "Proveedor",
			render: (row) => displayText(row.supplier_name),
		},
		{
			key: "request_code",
			label: "Solicitud",
			render: (row) => displayText(row.purchase_request?.code),
		},
		{
			key: "request_status",
			label: "Estado",
			render: (row) => {
				const status = row.purchase_request?.request_status;
				const statusLabel =
					Object.values(PurchaseRequestStatusEnum).find(
						(entry) => entry.textValue === status,
					)?.label ?? status;

				return (
					<Badges
						label={statusLabel || emptyCell}
						color={
							purchaseRequestStatusBadgeVariants[
								status as keyof typeof purchaseRequestStatusBadgeVariants
							]?.badgeColor ??
							purchaseRequestStatusBadgeVariants.default.badgeColor
						}
					/>
				);
			},
		},
		{
			key: "sent_by",
			label: "Enviado por",
			render: (row) => {
				const sender = row.sent_by_user_information;
				const fullname = sender?.fullname?.trim() || emptyCell;
				const pictureUrl = sender?.picture_url?.trim();
				const email = sender?.email?.trim() || emptyCell;

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
			key: "sent_to_review_at",
			label: "Enviado a revisión",
			render: (row) => formatDateToSpanishWords(row.sent_to_review_at),
		},
		{
			key: "actions",
			label: "Acciones",
			render: (row) => {
				const items: ContextMenuItem[] = [
					{
						label: "Ver detalle",
						onClick: () => onViewDetail?.(row),
					},
					{
						label: "Generar orden de compra",
						onClick: () => onGeneratePurchaseOrderPdf?.(row),
					},
				];

				return (
					<ContextMenu items={items} triggerClassName={contextMenuButton} />
				);
			},
		},
	];
}
