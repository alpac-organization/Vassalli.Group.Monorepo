import { DataTable } from "@alpac/design-system";
import { useMemo } from "react";
import type { ServiceRatesTableProps } from "./service-rates-table.types";

export const ServiceRatesTable = ({ company }: ServiceRatesTableProps): React.ReactNode => {


   const tableColumns = useMemo(() => {
      if (company === "VIGEMSA") {
         return [
            { key: "description", label: "Descripción del Turno" },
            { key: "unit", label: "Unidad de Cobro" },
            { key: "rate", label: "Tarifa" }
         ]
      }

      if (company === "TMN") {
         return [
            { key: "description", label: "Descripción del Servicio" },
            { key: "unit", label: "Unidad de Cobro" },
            { key: "rate", label: "Tarifa" }
         ]
      }

      return []
   }, [company])

   const tableData = useMemo(() => {
      if (company === "VIGEMSA") {
         return [
            {
               description: "Turno de 12 Horas",
               unit: "12 Horas",
               rate: "C$ 360.00"
            },
            {
               description: "Turno de 24 Horas",
               unit: "24 Horas",
               rate: "C$ 720.00"
            },
         ];
      }

      if (company === "TMN") {
         return [
            {
               description: "Transporte",
               unit: "Por Viaje",
               rate: "Precio sujeto a acuerdo previo"
            }
         ];
      }

      return [];
   }, [company]);

   return (
      <div className="mt-4">
         <DataTable
            title={`Tarifas de Prestación de Servicios - ${company}`}
            data={tableData}
            columns={tableColumns}
         />
      </div>
   );
};