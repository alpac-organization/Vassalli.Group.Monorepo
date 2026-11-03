import { Badges, ContextMenu, DataTable, type ContextMenuItem, type TableColumn } from "@alpac/design-system";
import type { SanctionDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-sanctions.response";
import { SanctionStatusEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-status.enum";
import { SanctionTypeEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";
import type { SanctionsTableProps } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanctions-table/sanctions-table.types";
import {
	getSanctionStatusBadgeClass,
	getSanctionTypeBadgeClass,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-labels.utils";
import { formatDate, formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { useMemo } from "react";

const contextMenuButton =
	"rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

const buildColumns = (
	onViewDetail: (row: SanctionDto) => void,
): TableColumn<SanctionDto>[] => [
		{
			key: "collaborator_name",
			label: "Colaborador",
			render: (row) => row.collaborator_name?.trim() || "—",
		},
		{
			key: "sanction_type",
			label: "Tipo",
			render: (row) => (
				<Badges
					label={SanctionTypeEnum[row.sanction_type].label ?? ""}
					color="transparent"
					className={getSanctionTypeBadgeClass(row.sanction_type)}
				/>
			),
		},
		{
			key: "sanction_status",
			label: "Estado",
			render: (row) => (
				<Badges
					label={SanctionStatusEnum[row.sanction_status].label ?? ""}
					color="transparent"
					className={getSanctionStatusBadgeClass(row.sanction_status)}
				/>
			),
		},
		{
			key: "suspension_start_date",
			label: "Suspensión",
			render: (row) =>
				row.suspension_start_date && row.suspension_end_date
					? `${formatDate(row.suspension_start_date)} → ${formatDate(row.suspension_end_date)}`
					: "—",
		},
		{
			key: "created_at",
			label: "Registrada",
			render: (row) => formatDateToSpanishWords(row.created_at?.slice(0, 10)) || "—",
		},
		{
			key: "actions",
			label: "Acciones",
			render: (row: SanctionDto) => {

				const items: ContextMenuItem[] = [
					{
						label: "Ver detalle",
						onClick: () => onViewDetail?.(row),
					},
				];

				return (
					<ContextMenu
						items={items}
						triggerClassName={contextMenuButton}
					/>
				);
			},
		},
	];

export const SanctionsTable = ({
	data,
	pagination,
	onViewDetail,
}: SanctionsTableProps) => {
	const columns = useMemo(() => buildColumns(onViewDetail), [onViewDetail]);

	return (
		<DataTable
			title="Lista de sanciones disciplinarias"
			data={data}
			columns={columns}
			pagination={pagination}
		/>
	);
};
