import { Alert, Button, Modal } from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import type { DeleteProductModalProps } from "./delete-product-modal.types";
import { buttonActionClass, buttonCancelClass } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/generate-exit-modal/utils/style.exit-modal";

const numberFormatter = new Intl.NumberFormat("es-NI", {
   minimumFractionDigits: 0,
   maximumFractionDigits: 2,
});

export const DeleteProducModal = function (props: DeleteProductModalProps) {
   const { stockSelected, isOpen, onClose, handleRequestSuccess, handleRequestError } = props;

   const { companyId, moduleCode } = useUserStore();
   const { DeleteProduct } = useProduct();

   if (!stockSelected) return null;

   const {
      product_information:      product,
      cost_center_information:  costCenter,
      unit_measure_information: unit,
   } = stockSelected;

   const hasStock = stockSelected.available_quantity > 0;

   const onDeleteProductHandler = async function () {
      try {
         await DeleteProduct.mutateAsync({
            company_id:  companyId,
            module_code: moduleCode,
            product_id:  product.product_id,
         });

         handleRequestSuccess(`El producto "${product.product_name}" fue dado de baja correctamente.`);
         onClose();
      } catch (error) {
         handleRequestError(
            error instanceof Error
               ? error.message
               : "No se pudo dar de baja el producto. Intenta nuevamente."
         );
      }
   };

   const stockMetrics = [
      { label: "Disponible",   value: `${numberFormatter.format(stockSelected.available_quantity)} ${unit.symbol}`, highlight: hasStock },
      { label: "Stock mínimo", value: `${numberFormatter.format(stockSelected.minimum_stock)} ${unit.symbol}` },
      { label: "Stock máximo", value: `${numberFormatter.format(stockSelected.maximum_stock)} ${unit.symbol}` },
   ];

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
                        {product.product_code}
                     </span>
                     <h3 className="mt-2 truncate text-lg font-semibold text-slate-100">
                        {product.product_name}
                     </h3>
                     <p className="mt-1 text-sm text-slate-400">
                        {product.description ?? "Sin descripción"}
                     </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300 ring-1 ring-amber-400/20">
                     {product.category_information.name}
                  </span>
               </div>

               <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-sm">
                  <span className="text-slate-500">Centro de costo:</span>
                  <span className="font-medium text-slate-200">{costCenter.cost_center_name}</span>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
               {
                  stockMetrics.map(({ label, value, highlight }) => (
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

            {
               hasStock && (
                  <Alert
                     type="warning"
                     title="Este producto aún tiene existencias"
                     message={`Quedan ${numberFormatter.format(stockSelected.available_quantity)} ${unit.symbol} disponibles. Al darlo de baja dejarán de estar disponibles en el catálogo.`}
                  />
               )
            }
            
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
               <Button
                  label="Cancelar"
                  onClick={onClose}
                  disabled={DeleteProduct.isPending}
                  className={buttonActionClass}
               />

               <Button
                  label="Dar de baja"
                  onClick={onDeleteProductHandler}
                  isLoading={DeleteProduct.isPending}
                  disabled={DeleteProduct.isPending}
                  className={buttonCancelClass}
               />
            </div>
         </div>
      </Modal>
   );
};