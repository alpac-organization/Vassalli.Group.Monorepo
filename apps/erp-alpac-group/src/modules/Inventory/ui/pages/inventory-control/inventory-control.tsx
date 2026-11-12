
import { useEffect, useState } from "react";
import { PlusSquare } from "lucide-react";
import { Button, SectionHeader, Tabs } from "@alpac/design-system";

import { GetSectionViewsToInventoryControl } from "./inventory-control.variants";
import { CreateProductModal } from "@app/modules/product/ui/views/create-product-modal/create-product-modal";
import { useParams } from "@app/shared/hooks/useParams";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { BreadcrumbSection } from "./views/breadcrumb-section/breadcrumb-section";

export const InventoryControl = function () {
   const [productModal, setProductModal] = useState(false);
   
   const { 
      AlertComponent,
      handleRequestError, 
      handleRequestSuccess, 
   } = useAlertState();

   const { setParam, searchParams } = useParams();

   const tabsItems = GetSectionViewsToInventoryControl();
   const tabFromUrl = searchParams.get("tab");

   const isValidTab = tabsItems.some(
      (item) => item.id === tabFromUrl
   );
   
   const activeTab = isValidTab
      ? tabFromUrl!
      : "stock-control";

   const activeTabLabel = tabsItems.find((item) => item.id === activeTab)?.label ?? "";
   
   useEffect(() => {
      if (!isValidTab) {
         setParam("tab", "stock-control");
      }
   }, [isValidTab, setParam]);

   const handleTabChange = (tabId: string) => {
      setParam("tab", tabId);
   };

   return (
      <div className="flex flex-col gap-4">
         <BreadcrumbSection 
            currentLabel={activeTabLabel}
            onInventoryClick={() => setParam("tab", "stock-control")}
         />

         <div className="flex flex-baseline justify-between">
            <SectionHeader
               title="Control de Inventario"
               subtitle="Gestiona niveles de stock, solicitudes por área y movimientos de almacén"
            />

            <div className="flex gap-5 flex-end">
               <Button
                  icon={<PlusSquare size={15} />}
                  size="medium"
                  label="Nuevo producto"
                  onClick={() => setProductModal(true)}
               />
            </div>
         </div>

         <Tabs
            activeTab={activeTab}
            tabItems={tabsItems}
            onTabChange={handleTabChange}
         />

         {
            productModal && (
               <CreateProductModal
                  typeProductToRegister="Operational"
                  isOpen={productModal}
                  onClose={() => setProductModal(false)}
                  onRequestError={handleRequestError}
                  onRequestSuccess={handleRequestSuccess}
               />
            )
         }

         { AlertComponent }
      </div>
   );
};
