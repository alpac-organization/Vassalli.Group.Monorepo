import { DataTable } from "@alpac/design-system"
import type { TableColumn } from "@alpac/design-system";

type IncomeTableData = {
   description: string;
   unit: string;
   rate: string;
}

export const AddIncomeTable = () => {
   const columns: TableColumn<IncomeTableData>[] = [
      { key: "description", label: "Descripción del Servicio" },
      { key: "unit", label: "Unidad de Cobro" },
      { key: "rate", label: "Tarifa" }
   ]
   return (
      <div>
         <DataTable
            columns={columns}
            data={[]}
         />
      </div>
   )
}