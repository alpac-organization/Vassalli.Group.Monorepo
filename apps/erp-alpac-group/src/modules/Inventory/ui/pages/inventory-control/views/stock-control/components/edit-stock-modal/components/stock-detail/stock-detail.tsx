import { getInventoryStockStatusLabel } from "@app/core/enums/inventory-stock-status.enum";

import type { StockDetailProps } from "./stock-detail.types";

const DetailItem = ({ label, children }: { label: string; children?: React.ReactNode }) => (
   <div className="space-y-0.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
         {label}
      </dt>

      <dd className="text-sm text-gray-900 dark:text-gray-100">{children ?? "—"}</dd>
   </div>
);

export const StockDetail = ({ stock }: StockDetailProps) => {
   return (
      <section className="rounded-lg border border-gray-200 dark:border-gray-700">
         <header className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">Producto seleccionado</p>
            <h3 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
               {stock.product_information.product_name}
            </h3>
         </header>

         <dl className="grid grid-cols-1 gap-x-6 gap-y-4 px-4 py-4 sm:grid-cols-2">
            <DetailItem label="Código">
               <span className="font-mono">{stock.product_information.product_code}</span>
            </DetailItem>

            <DetailItem label="Categoría">
               {stock.product_information.category_information.name}
            </DetailItem>

            <DetailItem label="Unidad de medida">
               {stock.unit_measure_information.name} ({stock.unit_measure_information.symbol})
            </DetailItem>

            <DetailItem label="Cantidad disponible">{stock.available_quantity}</DetailItem>

            <DetailItem label="Estado">{getInventoryStockStatusLabel(stock.status)}</DetailItem>

            <DetailItem label="Centro de costo">{stock.cost_center_information.cost_center_name}</DetailItem>

            <DetailItem label="Costo promedio">{stock.weighted_average_cost}</DetailItem>
         </dl>
      </section>
   );
};