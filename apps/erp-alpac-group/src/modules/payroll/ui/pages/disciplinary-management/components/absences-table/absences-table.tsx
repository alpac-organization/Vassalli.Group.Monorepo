import { DataTable } from "@alpac/design-system";
import { buildColumns } from "@app/modules/payroll/ui/pages/disciplinary-management/components/absences-table/absences-table.columns";
import type { AbsencesTableProps } from "@app/modules/payroll/ui/pages/disciplinary-management/components/absences-table/absences-table.types";
import { useMemo } from "react";

export const AbsencesTable = ({
  data,
  pagination,
  onViewDetail,
  onApply,
  onCancel,
  onDelete,
  canWrite = false,
}: AbsencesTableProps) => {
  const columns = useMemo(
    () => buildColumns(onViewDetail, onApply, onCancel, onDelete, canWrite),
    [onViewDetail, onApply, onCancel, onDelete, canWrite],
  );

  return (
    <DataTable
      title="Lista de ausencias"
      data={data}
      columns={columns}
      pagination={pagination}
    />
  );
};
