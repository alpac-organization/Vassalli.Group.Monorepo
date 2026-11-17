import { Alert, Button, Modal } from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";

import { 
   buttonActionClass, 
   buttonCancelClass 
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/generate-exit-modal/utils/style.exit-modal";

import type { DeleteProductModalProps } from "./delete-product-modal.types";

export const DeleteProductModal = function (props: DeleteProductModalProps) {
   const { data, isOpen, onClose, handleRequestSuccess, handleRequestError } = props;

   const { companyId, moduleCode } = useUserStore();
   const { DeleteProduct } = useProduct();

   if (!data) return null;

   const onDeleteProductHandler = async function () {
      try {
         await DeleteProduct.mutateAsync({
            company_id:  companyId,
            module_code: moduleCode,
            product_id:  data.productId,
         });

         handleRequestSuccess(`El producto "${data.name}" fue dado de baja correctamente.`);
         onClose();
      } 
      catch (error) {
         handleRequestError(
            error instanceof Error
               ? error.message
               : "No se pudo dar de baja el producto. Intenta nuevamente."
         );
      }
   };

   return (
      <Modal
         size="2xl"
         title="Dar de baja este producto"
         variant="warning"
         description="Esta acción es permanente y no se puede deshacer. El producto se deshabilitará del catálogo y dejará de estar disponible. Los pedidos anteriores conservarán su registro."
         isOpen={isOpen}
         onClose={onClose}
      >
         <div className="flex flex-col gap-5">

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
               <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                     <span className="inline-block rounded-md bg-[#1e2128] px-2 py-0.5 font-mono text-xs font-medium text-slate-300 ring-1 ring-white/10">
                        {data.code}
                     </span>
                     <h3 className="mt-2 truncate text-lg font-semibold text-slate-100">
                        {data.name}
                     </h3>
                     <p className="mt-1 text-sm text-slate-400">
                        {data.description ?? "Sin descripción"}
                     </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300 ring-1 ring-amber-400/20">
                     {data.categoryName}
                  </span>
               </div>

               <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-sm">
                  <span className="text-slate-500">Centro de costo:</span>
                  <span className="font-medium text-slate-200">{data.costCenterName}</span>
               </div>
            </div>

            {
               data.metrics.length > 0 && (
                  <div
                     className="grid gap-3"
                     style={{ gridTemplateColumns: `repeat(${data.metrics.length}, minmax(0, 1fr))` }}
                  >
                     {
                        data.metrics.map(({ label, value, highlight }) => (
                           <div
                              key={label}
                              className={`rounded-xl border p-3 text-center ${
                                 highlight
                                    ? "border-amber-400/30 bg-amber-400/10"
                                    : "border-white/10 bg-[#1e2128]"
                              }`}
                           >
                              <p className="text-xs text-slate-400">{label}</p>
                              <p className={`mt-1 text-base font-semibold ${highlight ? "text-amber-300" : "text-slate-100"}`}>
                                 {value}
                              </p>
                           </div>
                        ))
                     }
                  </div>
               )
            }

            {
               data.warning && (
                  <Alert
                     type="warning"
                     title={data.warning.title}
                     message={data.warning.message}
                  />
               )
            }

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
               <Button
                  label="Cancelar"
                  onClick={onClose}
                  disabled={DeleteProduct.isPending}
                  className={buttonCancelClass}
               />

               <Button
                  label="Dar de baja"
                  onClick={onDeleteProductHandler}
                  isLoading={DeleteProduct.isPending}
                  disabled={DeleteProduct.isPending}
                  className={buttonActionClass}
               />
            </div>
         </div>
      </Modal>
   );
};