import { Modal } from "@alpac/design-system"
import type { EditStockModalProps } from "./edit-stock-modal.types"
import { useInventoryStocks } from "@app/modules/Inventory/ui/hooks/useInventoryStocks";

export const EditStockModal = function(props: EditStockModalProps){

   const { 
      isOpen  = false,
      onClose = () => {},
      stockSelected
   } = props;

   const { } = useInventoryStocks({});
   
   console.log(JSON.stringify(stockSelected, null, 3));

   return (
      <Modal 
         isOpen={ isOpen }
         title="Editar niveles de stock" 
         onClose={() => onClose()}

         size="2xl"
         variant="form"
         description="Edita los niveles de stock para tener controlado los niveles de minimos para alertas"
      >
         <h2>Contenido</h2>
      </Modal>
   )
}