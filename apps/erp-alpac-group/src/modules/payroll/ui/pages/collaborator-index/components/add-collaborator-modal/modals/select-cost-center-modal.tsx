import { Modal } from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCostCenters } from "@app/modules/admin/ui/hooks/cost-centers/useCostCenters";

//all types here..
import type { SelectCostCenterProps } from "./select-cost-center-modal.type";

export const SelectCostCenterModal = function(props: SelectCostCenterProps){

   const { areaId, isOpen, onClose, onSelect } = props;
   const { moduleCode, companyId } = useUserStore();

   const { GetCostCenters } = useCostCenters({
      area_id: areaId,
      company_id: companyId,
      module_code: moduleCode
   });

   return (
      <Modal
         size="5xl"
         variant="info"
         isOpen={ isOpen }
         onClose={() => onClose()}
      >
         <div className="p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
               Seleccionar Centro de Costo
            </h3>
            {GetCostCenters.data && GetCostCenters.data.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {GetCostCenters.data.map((costCenter) => (
                     <button
                        key={costCenter.cost_center_id}
                        type="button"
                        onClick={() => {
                           onSelect(costCenter.cost_center_id);
                           onClose();
                        }}
                        className="text-left p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                     >
                        <p className="text-sm font-medium text-slate-800 dark:text-white">
                           {costCenter.cost_center_name}
                        </p>
                        {costCenter.descripcion && (
                           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {costCenter.descripcion}
                           </p>
                        )}
                     </button>
                  ))}
               </div>
            ) : (
               <p className="text-slate-500 dark:text-slate-400">No se encontraron centros de costo para esta área.</p>
            )}
         </div>
      </Modal>
   )
}