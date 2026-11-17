import { DataTable } from "@alpac/design-system";
import type { FaultsTableProps } from "@app/modules/payroll/ui/pages/disciplinary-management/components/faults-table/faults-table.types";

import { useMemo } from "react";
import { faultTableColumns } from "./faults-table-columns";

export const FaultsTable = ({
	data,
	pagination,
	onViewDetail,
	onCancel,
	canWrite = true,
}: FaultsTableProps) => {
	const columns = useMemo(
		() => faultTableColumns({ onViewDetail, onCancel, canWrite }),
		[onViewDetail, onCancel, canWrite],
	);

	return (
		<DataTable
			title="Lista de faltas disciplinarias"
			data={data}
			columns={columns}
			pagination={pagination}
		/>
	);
};
