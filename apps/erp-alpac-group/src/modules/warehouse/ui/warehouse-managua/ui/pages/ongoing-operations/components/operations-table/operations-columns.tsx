import { Badges, ContextMenu, type ContextMenuItem, type TableColumn } from "@alpac/design-system";
import type { OperationalOrderListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-orders-response";
import { getOperationalOrderStatusLabel } from "@app/modules/warehouse/domain/enums/warehouse-managua/operational-order-status.enum";
import { TransportDocuments, type TransportDocumentType } from "@app/core/enums/document.enum";
import type { GetOperationsColumnsProps } from "./operation-columns.types";

const contextMenuButton =
	"rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

export function getOperationsColumns({ onViewDetail, onUpdateInfo }: GetOperationsColumnsProps): TableColumn<OperationalOrderListItem>[] {

	return [
		{
			key: "po_code",
			label: "Código OP",
			render: (row) => (
				<span className="font-semibold text-slate-800 dark:text-slate-100">
					{row.po_code}
				</span>
			),
		},
		{
			key: "document_number",
			label: "Número Documento",
			render: (row) => row.document_number || "—",
		},
		{
			key: "document_type",
			label: "Tipo Documento",
			render: (row) => {
				const documentType = row?.document_type;
				if (!documentType) return "—";
				return (
					TransportDocuments[documentType as TransportDocumentType]?.label ?? "—"
				);
			},
		},
		{
			key: "status",
			label: "Estado",
			render: (row) => (
				<Badges
					label={getOperationalOrderStatusLabel(row.status)}
					color="transparent"
					className="bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800 px-2.5! py-0.5! text-xs font-semibold"
				/>
			),
		},
		{
			key: "is_alerted",
			label: "Alerta",
			render: (row) =>
				row.is_alerted ? (
					<Badges
						label="Alerta"
						color="transparent"
						className="bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800 px-2! py-0.5! text-xs"
					/>
				) : (
					<Badges
						label="Normal"
						color="transparent"
						className="bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-800 px-2! py-0.5! text-xs"
					/>
				),
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
						label: "Registrar / Actualizar",
						onClick: () => onUpdateInfo?.(row),
					},
				];

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
