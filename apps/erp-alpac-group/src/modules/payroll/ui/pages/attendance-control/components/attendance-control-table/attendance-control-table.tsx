import { Button, DataTable, type TableColumn } from "@alpac/design-system";
import type { AttendanceRecordDto } from "@app/modules/payroll/domain/ApiContract/Responses/attendance-responses/get-attendance-records.response";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { AttendanceControlTableProps } from "./attendance-control-table.types";

const columns: TableColumn<AttendanceRecordDto>[] = [
   {
      key: "identification_number",
      label: "Identificación",
      render: (row) => row.identification_number?.trim() || "—",
   },
   {
      key: "collaborator_fullname",
      label: "Colaborador",
      render: (row) => row.collaborator_fullname?.trim() || "—",
   },
   {
      key: "date",
      label: "Fecha",
      render: (row) => formatDateToSpanishWords(row.date) || "—",
   },
   {
      key: "actions",
      label: "Acciones",
      render: (value: AttendanceRecordDto) => (
         <Button
            label="Ver Detalle"
            size="small"
            className="text-[13px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={() => {
               console.log(value);
            }}
         />
      ),
   },
];

export const AttendanceControlTable = ({ data, pagination }: AttendanceControlTableProps) => {
   return (
      <DataTable
         title="Marcaciones de colaboradores"
         data={data}
         columns={columns}
         pagination={pagination}
      />
   );
};
