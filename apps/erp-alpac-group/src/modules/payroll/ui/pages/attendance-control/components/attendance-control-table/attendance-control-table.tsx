import { Badges, DataTable, type TableColumn } from "@alpac/design-system";
import type { AttendanceRecordDto } from "@app/modules/payroll/domain/ApiContract/Responses/attendance-responses/get-attendance-records.response";
import { getAttendanceRecordTypeLabel } from "@app/modules/payroll/domain/enums/attendance-enums/attendance-record-type.enum";
import { formatDate, formatTime } from "@app/shared/utils/string.utils";
import type { AttendanceControlTableProps } from "./attendance-control-table.types";

const columns: TableColumn<AttendanceRecordDto>[] = [
  {
    key: "collaborator_fullname",
    label: "Colaborador",
    render: (row) => row.collaborator_fullname?.trim() || "—",
  },
  {
    key: "identification_number",
    label: "Identificación",
    render: (row) => row.identification_number?.trim() || "—",
  },
  {
    key: "record_date",
    label: "Fecha",
    render: (row) => formatDate(row.record_date) || "—",
  },
  {
    key: "record_time",
    label: "Hora",
    render: (row) => formatTime(row.record_date),
  },
  {
    key: "record_type",
    label: "Tipo",
    render: (row) => (
      <Badges
        label={getAttendanceRecordTypeLabel(row.record_type)}
        color="transparent"
        className="bg-blue-500/10 text-blue-600 dark:text-blue-400"
      />
    ),
  },
  {
    key: "device_name",
    label: "Dispositivo",
    render: (row) => row.device_name?.trim() || "—",
  },
];

export const AttendanceControlTable = ({
  data,
  pagination,
}: AttendanceControlTableProps) => {
  return (
    <DataTable
      title="Marcaciones de colaboradores"
      data={data}
      columns={columns}
      pagination={pagination}
    />
  );
};
