import { Box } from "lucide-react"
import { MetricCard } from "@alpac/design-system"
import type { StockControlSectionCardsProps } from "./stock-control-section-cards.types"

export const StockControlSectionCards = function(props: StockControlSectionCardsProps): React.ReactElement {
   const { data } = props;

   //Estados de existencias de stock para mostrar en las tarjetas de resumen
   const totalProductsInStock = data?.total ?? 0;
   const totalProductsInMinStock = data?.in_minimum_stock ?? 0;
   const totalProductsInNormalStock = totalProductsInStock - totalProductsInMinStock;

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4 gap-4">
         <MetricCard
            title="Productos en stock total"
            value={totalProductsInStock.toString()}
            trend="Representa el total de productos en stock"
            icon={<Box size={24} />}
         />

         <MetricCard
            title="Total en stock minimo"
            value={totalProductsInMinStock.toString()}
            trend="Total de productos en stock mínimo"
            themeClass="bg-red-500"
            icon={<Box size={24} />}
         />

         <MetricCard
            title="Total en stock normal"
            value={totalProductsInNormalStock.toString()}
            trend="Total de productos en stock normal"
            themeClass="bg-green-500"
            icon={<Box size={24} />}
         />
      </div>
   )
}