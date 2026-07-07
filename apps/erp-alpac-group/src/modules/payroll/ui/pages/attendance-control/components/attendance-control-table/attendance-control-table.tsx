import { Button, DataTable, type TableColumn } from "@alpac/design-system";
import type { AttendanceRecordDto } from "@app/modules/payroll/domain/ApiContract/Responses/attendance-responses/get-attendance-records.response";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { AttendanceControlTableProps } from "./attendance-control-table.types";

/*{
    "data": [
        {
            "user_id": 18,
            "date": "2026-05-15T00:00:00",
            "identification_number": "0012210790054K",
            "collaborator_fullname": "Alba Encarnacion Gutierrez Morales",
            "markings": [
                {
                    "read_time": "2026-05-15T08:09:55",
                    "device_name": "ALPAC-MGA"
                },
                {
                    "read_time": "2026-05-15T17:10:57",
                    "device_name": "ALPAC-MGA"
                }
            ]
        },
        {
            "user_id": 18,
            "date": "2026-05-14T00:00:00",
            "identification_number": "0012210790054K",
            "collaborator_fullname": "Alba Encarnacion Gutierrez Morales",
            "markings": [
                {
                    "read_time": "2026-05-14T08:11:05",
                    "device_name": "ALPAC-MGA"
                },
                {
                    "read_time": "2026-05-14T17:02:31",
                    "device_name": "ALPAC-MGA"
                }
            ]
        },
    ],
    "page_number": 1,
    "page_size": 10,
    "total": 10
}*/



export const AttendanceControlTable = ({ data, pagination, onSelect }: AttendanceControlTableProps) => {

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
                  onSelect(value);
               }}
            />
         ),
      },
   ];

   return (
      <DataTable
         title="Marcaciones de colaboradores"
         data={data}
         columns={columns}
         pagination={pagination}
      />
   );
};
