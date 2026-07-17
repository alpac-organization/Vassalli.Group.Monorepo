import { Button, DataTable, Pagination, type TableColumn } from "@alpac/design-system";
import { useMemo, useState } from "react";
import { CustomerDetails } from "../customer-details/customer-details";
import type { CustomerTableProps } from "./customer-table.types";

const mockCustomers = [
   { name: "Compañia Azucarera del Sur", identification: "J0310000000000", origin: "Nacional" },
];

export const CustomerTable = ({ data }: CustomerTableProps) => {

   const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);
   const [customer, setCustomer] = useState<(typeof mockCustomers)[number] | null>(null);

   const columnConfig: TableColumn<(typeof mockCustomers)[number]>[] = [
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
                     setIsCustomerDetailsOpen(true);
                     setCustomer(row);
                  }}
                  className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
               />
            );
         }
      },
   ];

   const testingData = useMemo(() => {
      if (!Array.isArray(data)) return [];
      return !!data.length ? data : mockCustomers;
   }, [data])

   return (
      <>
         <DataTable
            title="Lista de clientes"
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
         <CustomerDetails
            customer={customer}
            isOpen={isCustomerDetailsOpen}
            onClose={() => {
               setIsCustomerDetailsOpen(false)
            }}
         />
      </>
   );
}