import { useMemo } from "react";
import {
	Badges,
	ContextMenu,
	DataTable,
	Pagination,
	type TableColumn,
} from "@alpac/design-system";
import type { QuotesTableProps } from "@app/modules/purchasing/ui/pages/quotes/components/quotes-table/quotes-table.types";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import {
	purchaseRequestStatusBadgeVariants,
	purchaseRequestTypeBadgeVariants,
} from "@app/modules/purchasing/ui/pages/purchase-requests/purchase-request.variants";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";

const contextMenuButton =
	"rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

const buildColumns = (
	onViewDetail: (row: GetPurchaseRequestResponse) => void,
	onCreateQuote: (row: GetPurchaseRequestResponse) => void,
): TableColumn<GetPurchaseRequestResponse>[] => [
	{ key: "code", label: "Código" },
	{
		key: "request_date",
		label: "Fecha de Solicitud",
		render: (row: GetPurchaseRequestResponse) => {
			return formatDateToSpanishWords(row.request_date ?? "");
		},
	},
	{
		key: "request_status",
		label: "Estado",
		render: (row: GetPurchaseRequestResponse) => {
			const statusLabel =
				Object.values(PurchaseRequestStatusEnum).find(
					(status) => status.textValue === row.request_status,
				)?.label ?? row.request_status;

			return (
				<Badges
					label={statusLabel}
					color={
						purchaseRequestStatusBadgeVariants[
							row.request_status as keyof typeof purchaseRequestStatusBadgeVariants
						]?.badgeColor ??
						purchaseRequestStatusBadgeVariants.default.badgeColor
					}
				/>
			);
		},
	},
	{
		key: "request_type",
		label: "Tipo",
		render: (row: GetPurchaseRequestResponse) => {
			const typeLabel =
				Object.values(PurchaseRequestEnum).find(
					(type) => type.textValue === row.request_type,
				)?.label ?? row.request_type;

			return (
				<Badges
					label={typeLabel}
					color={
						purchaseRequestTypeBadgeVariants[
							row.request_type as keyof typeof purchaseRequestTypeBadgeVariants
						]?.badgeColor ??
						purchaseRequestTypeBadgeVariants.default.badgeColor
					}
				/>
			);
		},
	},
	{
		key: "revision_date",
		label: "Fecha de revisión",
		render: (row: GetPurchaseRequestResponse) => {
			return formatDateToSpanishWords(row.revision_date ?? "");
		},
	},
	{
		key: "actions",
		label: "Acciones",
		render: (row: GetPurchaseRequestResponse) => (
			<ContextMenu
				items={[
					{ label: "Crear cotización", onClick: () => onCreateQuote(row) },
					{ label: "Ver detalle", onClick: () => onViewDetail(row) },
				]}
				triggerClassName={contextMenuButton}
			/>
		),
	},
];

export function QuotesTable({
	data,
	onViewDetail,
	onCreateQuote,
	currentPage,
	pageSize,
	totalRecords,
	onPageChange,
	isPaginationDisabled = false,
}: QuotesTableProps) {
	const columns = useMemo(
		() => buildColumns(onViewDetail, onCreateQuote),
		[onViewDetail, onCreateQuote],
	);

	return (
		<DataTable
			title="Historial de cotizaciones"
			data={data}
			columns={columns}
			pagination={
				<Pagination
					currentPage={currentPage}
					pageSize={pageSize}
					totalRecords={totalRecords}
					onPageChange={onPageChange}
					disabled={isPaginationDisabled}
				/>
			}
		/>
	);
}
