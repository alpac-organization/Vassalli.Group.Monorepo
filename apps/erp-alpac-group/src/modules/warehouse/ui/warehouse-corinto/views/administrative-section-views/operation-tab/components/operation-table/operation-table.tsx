import { Button, DataTable, Pagination, type TableColumn } from "@alpac/design-system";
import { useMemo } from "react";
import type { OperationTableProps } from "./operation-table.types";

export const OperationTable = ({ data }: OperationTableProps) => {

   const columnConfig: TableColumn<any>[] = [
      { key: "name", label: "Nombre" },
      { key: "identification", label: "RUC / Identificación" },
      { key: "origin", label: "Origen" },
      {
         key: "action", label: "Acciones", render(row) {
            return (
               <Button
                  type="button"
                  size="medium"
                  label="Ver detalle"
                  onClick={() => {
                     console.log(row)
                  }}
                  className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
               />
            );
         }
      },
   ];

   const testingData = useMemo(() => {
      if (!Array.isArray(data)) return [];
      return !!data.length ? data : [];
   }, [data])

   return (
      <>
         <DataTable
            title="Lista de operaciones de recepción"
            data={testingData}
            columns={columnConfig}
            pagination={
               <Pagination
                  currentPage={0}
                  pageSize={0}
                  totalRecords={0}
                  onPageChange={() => { }}
                  disabled={false}
               />
            }
         />
      </>
   );
}