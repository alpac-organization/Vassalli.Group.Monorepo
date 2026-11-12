import { useState } from "react";
import { StockDetail } from "./components/stock-detail/stock-detail";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useInventoryStocks } from "@app/modules/Inventory/ui/hooks/useInventoryStocks";
import { Alert, Button, InputText, Modal } from "@alpac/design-system";
import { inputClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { EditStockModalProps } from "./edit-stock-modal.types";

export const EditStockModal = function(props: EditStockModalProps) {
   const {
      isOpen = false,
      onClose = () => {},
      stockSelected,
      onRequestSuccess,
      onRequestError,
   } = props;

   const { companyId, moduleCode } = useUserStore();
   const { getMappedError } = useMappedError();
   const { PatchInventoryStock } = useInventoryStocks({});

   const [minimumStock, setMinimumStock] = useState(stockSelected?.minimum_stock?.toString() ?? "");
   const [maximumStock, setMaximumStock] = useState(stockSelected?.maximum_stock?.toString() ?? "");
   const [errorMessage, setErrorMessage] = useState<string | null>(null);

   const isSaving = PatchInventoryStock.isPending;

   const handleClose = () => {
      if (isSaving) return;
      setErrorMessage(null);
      onClose();
   };

   const handleSave = () => {
      if (!stockSelected) return;

      const minimum = minimumStock.trim() === "" ? undefined : Number(minimumStock);
      const maximum = maximumStock.trim() === "" ? undefined : Number(maximumStock);

      if (minimum !== undefined && Number.isNaN(minimum)) {
         setErrorMessage("El stock mínimo ingresado no es válido.");
         return;
      }

      if (maximum !== undefined && Number.isNaN(maximum)) {
         setErrorMessage("El stock máximo ingresado no es válido.");
         return;
      }

      if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
         setErrorMessage("El stock mínimo no puede ser mayor al stock máximo.");
         return;
      }

      setErrorMessage(null);

      PatchInventoryStock.mutate(
         {
            company_id: companyId,
            module_code: moduleCode,
            inventory_stock_id: stockSelected.product_stock_id,
            minimum_stock: minimum,
            maximum_stock: maximum,
         },
         {
            onSuccess: () => {
               onRequestSuccess?.("Niveles de stock actualizados correctamente.");
               onClose();
            },
            onError: (error) => {
               const mapped = getMappedError(error as ApiErrorResponse);
               const message = mapped.description || "No se pudieron actualizar los niveles de stock.";
               setErrorMessage(message);
               onRequestError?.(message);
            },
         },
      );
   };

   if (!stockSelected) return null;

   return (
      <Modal
         isOpen={isOpen}
         title="Editar niveles de stock"
         onClose={handleClose}
         size="2xl"
         variant="form"
         description="Edita los niveles de stock para tener controlado los niveles mínimos para alertas"
      >
         <div className="flex flex-col gap-4">
            <Alert
               type="warning"
               title="Control de stock"
               message="Los niveles mínimo y máximo determinan cuándo el sistema genera alertas de reposición. Mantenerlos actualizados evita quiebres o excesos de inventario."
            />


            {
               errorMessage && (
                  <Alert 
                     type="error" 
                     message={errorMessage} 
                     showCloseButton 
                     onClose={() => setErrorMessage(null)} 
                  />
               )
            }

            <StockDetail 
               stock={stockSelected} 
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               <InputText
                  label="Stock mínimo"
                  type="number"
                  value={minimumStock}
                  className={inputClassName}
                  labelClassName={labelClassName}
                  onChange={(event) => setMinimumStock(event.target.value)}
                  disabled={isSaving}
               />
               
               <InputText
                  label="Stock máximo"
                  type="number"
                  value={maximumStock}
                  className={inputClassName}
                  labelClassName={labelClassName}
                  onChange={(event) => setMaximumStock(event.target.value)}
                  disabled={isSaving}
               />
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
               <Button
                  type="button"
                  size="giant"
                  label="Cancelar"
                  disabled={isSaving}
                  onClick={handleClose}
               />

               <Button
                  type="button"
                  size="giant"
                  label="Guardar niveles"
                  isLoading={isSaving}
                  disabled={isSaving}
                  onClick={handleSave}
               />
            </div>
         </div>
      </Modal>
   );
};