import { useState } from "react";
import { PlusSquare } from "lucide-react";
import { Button, SectionHeader, Tabs } from "@alpac/design-system"

import { GetSectionViewsToInventoryControl } from "./inventory-control.variants"
import { CreateProductModal } from "@app/modules/product/ui/views/create-product-modal/create-product-modal";

export const InventoryControl = function() {

   const [productModal, setProductModal] = useState(false);

   //Obtener los items de secciones de inventario...
   const tabsItems = GetSectionViewsToInventoryControl();

   return (
      <div className="flex flex-col gap-4">
         <div className="flex flex-baseline justify-between">

            <SectionHeader 
               title="Control de Inventario"
               subtitle="Gestiona niveles de stock, solicitudes por área y movimientos de almacén"
            />
            
            {/* Si se agrega mas botones, pasar esto a un componente Independiente */}
            <div className="flex gap-5 flex-end">
               <Button 
                  icon={
                     <PlusSquare 
                        size={15}
                     />
                  }
                  size="medium"
                  label="Nuevo producto"
                  onClick={() => {
                     setProductModal(true);
                  }}
               />
            </div>
         </div>

         <Tabs 
            activeTab="stock-control"
            tabItems={tabsItems}
         />

         {/* Modales interactivas  */}

         <CreateProductModal 
            typeProductToRegister="Operational"
            isOpen={productModal}
            onClose={() => {
               setProductModal(false)
            }}
         />

      </div>
   )
}
