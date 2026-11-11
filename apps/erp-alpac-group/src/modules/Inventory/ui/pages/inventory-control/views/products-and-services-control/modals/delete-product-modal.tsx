import { useUserStore } from "@app/shared/stores/useUserStore";
import { useState } from "react";
import { secondaryButtonClassName } from "@app/modules/product/ui/views/product-price-edit-modal/constants/product-price.constants";
import { Alert, Button, InputText, Modal } from "@alpac/design-system";
import { inputClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style";

import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { ProductSummary } from "./components/product-summary/product-summary";
import { SectionInstruction } from "./components/section-instruction/section-Instructions";

import type { SubmitEvent } from "react";
import type { DeleteProductModalProps } from "./delete-product-modal.types";

const DEFAULT_ERROR_MESSAGE = "No se pudo dar de baja el producto";

export const DeleteProductModal = (props: DeleteProductModalProps) => {

   const {
      isOpen,
      onClose,
      onRequestError,
      onRequestSuccess,
      productSelected: product,
   } = props;

   const { getMappedError }        = useMappedError();
   const { DeleteProductCommand }  = useProduct();
   const { companyId, moduleCode } = useUserStore();

   const [confirmText, setConfirmText] = useState("");

   const confirmValue   = (product?.code || product?.product_name || "").trim();
   const canConfirm     = confirmValue !== "" && confirmText.trim() === confirmValue;
   const suppliersCount = product?.suppliers_count ?? 0;
   const isDeleting     = DeleteProductCommand.isPending;

   const handleClose = () => {
      if (isDeleting) return;
      setConfirmText("");
      onClose();
   };

   const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!canConfirm || !product || isDeleting) return;

      DeleteProductCommand.mutate(
         {
            company_id:  companyId,
            module_code: moduleCode,
            product_id:  product.product_id,
         },
         {
            onSuccess: () => {
               onRequestSuccess?.("Se realizó con éxito la eliminación del producto");
               setConfirmText("");
               onClose();
            },
            onError: (error) => {
               const message = getMappedError(error)?.description || DEFAULT_ERROR_MESSAGE;

               onRequestError?.(message);
               setConfirmText("");
               onClose();
            },
         },
      );
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

            <SectionInstruction />

            <InputText
               label={`Para confirmar, escribe (${confirmValue}) en el siguiente campo`}
               value={confirmText}
               className={inputClassName}
               placeholder={confirmValue}
               labelClassName={labelClassName}
               onChange={(e) => setConfirmText(e.target.value)}
               autoComplete="off"
               disabled={isDeleting}
            />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
               <Button
                  type="button"
                  size="giant"
                  label="Cancelar"
                  className={secondaryButtonClassName}
                  onClick={handleClose}
                  disabled={isDeleting}
               />

               <Button
                  type="submit"
                  size="giant"
                  label="Dar de baja"
                  isLoading={isDeleting}
                  disabled={!canConfirm || isDeleting}
               />
            </div>
         </form>
      </Modal>
   );
};