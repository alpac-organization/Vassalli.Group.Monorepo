import { SectionHeader, Tabs } from "@alpac/design-system"
import { GetSectionViewsToInventoryControl } from "./inventory-control.variants"

export const InventoryControl = function() {

   //Obtener los items de secciones de inventario...
   const tabsItems = GetSectionViewsToInventoryControl();

   return (
      <div className="flex flex-col gap-4">

         <SectionHeader 
            title="Inventario"
            subtitle="Gestiona niveles de stock, solicitudes por área y movimientos de almacén"
         />

         <Tabs 
            activeTab="stock-control"
            tabItems={tabsItems}
         />

      </div>
   )
}
