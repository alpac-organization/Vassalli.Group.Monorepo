import { useEffect, useState } from "react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Alert, Button, InputText, Modal } from "@alpac/design-system";
import { inputClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style";
import { secondaryButtonClassName } from "@app/modules/product/ui/views/product-price-edit-modal/constants/product-price.constants";
import { quoteFormDangerButtonClassName } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/styles/create-quote-form.styles";

import { ProductSummary } from "./components/product-summary/product-summary";
import { SectionInstruction } from "./components/section-instruction/section-Instructions";

import type { SubmitEvent } from "react";
import type { DeleteProductModalProps } from "./delete-product-modal.types";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { useMappedError } from "@app/shared/hooks/useMappedError";

export const DeleteProductModal = (props: DeleteProductModalProps) => {
   
   const { 
      isOpen, 
      onClose, 
      onRequestError, 
      onRequestSuccess, 
      productSelected: product 
   } = props;

   const { getMappedError }        = useMappedError();
   const { DeleteProductCommand }  = useProduct();
   const { companyId, moduleCode } = useUserStore();

   const [confirmText, setConfirmText] = useState("");

   const confirmValue   = product?.code ?? product?.product_name ?? "";
   const canConfirm     = confirmValue !== "" && confirmText.trim() === confirmValue;
   const suppliersCount = product?.suppliers_count ?? 0;


   useEffect(() => {
      setConfirmText("");
   }, [isOpen, product?.product_id]);

   const handleClose = () => {
      
      setConfirmText("");
      onClose();
   };

   const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!canConfirm || !product) return;

      //your code here...

      try
      {
         await DeleteProductCommand.mutateAsync({
            company_id:  companyId,
            module_code: moduleCode,
            product_id:  product.product_id
         });
         
         onRequestSuccess?.("Se realizo con exito la eliminación del producto");
         handleClose();
      }
      catch(error: unknown){
         // getMappedError(error);
         onRequestError?.();
      }
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={handleClose}
         title="Dar de baja al producto"
         description="Al dar de baja un producto, este se elimina del catálogo de inventario y deja de estar disponible en los procesos que dependen de él."
         variant="form"
         size="3xl"
      >
         <form onSubmit={handleSubmit} className="space-y-5">
            <Alert
               type="warning"
               title="Esta acción es permanente y no se puede deshacer"
               message="Una vez dado de baja, el producto no podrá recuperarse."
            />

            <ProductSummary product={product} />

            {suppliersCount > 0 && (
               <Alert
                  type="info"
                  title="Este producto tiene proveedores asociados"
                  message={`Se desvincularán ${suppliersCount} proveedor(es) de este producto.`}
               />
            )}

            <SectionInstruction 
            />

            <InputText
               label={`Para confirmar, escribe (${confirmValue}) en el siguiente campo`}
               className={inputClassName}
               labelClassName={labelClassName}
               placeholder={confirmValue}
               value={confirmText}
               onChange={(e) => setConfirmText(e.target.value)}
               autoComplete="off"
               // disabled={isDeleting}
            />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
               <Button
                  type="button"
                  size="giant"
                  label="Cancelar"
                  className={secondaryButtonClassName}
                  onClick={handleClose}
                  // disabled={isDeleting}
               />

               <Button
                  type="submit"
                  size="giant"
                  label="Dar de baja"
                  className={quoteFormDangerButtonClassName}
                  // isLoading={isDeleting}
                  // disabled={!canConfirm || isDeleting}
               />
            </div>
         </form>
      </Modal>
   );
};