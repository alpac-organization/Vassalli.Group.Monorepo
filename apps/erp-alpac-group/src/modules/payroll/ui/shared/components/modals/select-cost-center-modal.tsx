import {
  useEffect,
  useState
} from "react";
import { Loader } from "@app/shared/components/loaders/loader";
import { Alert, Button, DataTable, Modal, SectionHeader } from "@alpac/design-system";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { getColumnConfig } from "./select-cost-center-modal.variants";
import { useCostCenters } from "@app/modules/admin/ui/hooks/cost-centers/useCostCenters";

import type { SelectCostCenterProps } from "./select-cost-center-modal.type";
import type { GetCostCentersResponse } from "@app/modules/admin/domain/ApiContract/responses/cost-centers/get-cost-centers.response";

export const SelectCostCenterModal = function (props: SelectCostCenterProps) {

   const {
      areaId,
      isOpen,
      onClose,
      onSelect
   } = props;

   const { moduleCode, companyId } = useUserStore();

   const [selectedCostCenter, setSelectedCostCenter] = useState<GetCostCentersResponse | null>(null);
   const shouldFetch = isOpen && Boolean(areaId);

   const { GetCostCenters } = useCostCenters({
      area_id: shouldFetch ? areaId : "",
      company_id: companyId,
      module_code: moduleCode,
   });

   const isLoading = shouldFetch && (GetCostCenters.isPending || GetCostCenters.isFetching);
   const costCenters = shouldFetch ? GetCostCenters.data ?? [] : [];
   const hasResults = shouldFetch && !isLoading && costCenters.length > 0;

   useEffect(() => {
      if (!isOpen) {
         setSelectedCostCenter(null);
      }
   }, [isOpen, areaId]);

   const handleClose = () => {
      setSelectedCostCenter(null);
      onClose();
   };

   const handleOmit = () => {
      onSelect({ 
         costCenterId: "", 
         costCenterName: "" 
      });
      handleClose();
   };

   const configColumn = getColumnConfig({
      selectedCostCenter,
      onSelect: (row) => {
         setSelectedCostCenter(row);
      },
   });

   return (
      <Modal 
         size="5xl" 
         variant="info" 
         isOpen={isOpen} 
         onClose={handleClose}
      >
         {
            hasResults && (
               <SectionHeader
                  title="¿A qué centro de costo pertenece?"
                  subtitle="Selecciona el centro de costo correspondiente a este colaborador (opcional)"
                  headerClassName="mb-7"
               />
            )
         }

         <div className="mb-5">
            <Alert
               type="warning"
               title="Paso opcional"
               message="Sin un centro de costo asignado no podrás generar el código único del colaborador. Se asignara uno temporal"
            />
         </div>

         {
            !areaId ? (
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                  Primero debe seleccionar un área de trabajo.
               </p>
            ) : isLoading   ? ( <Loader title="Cargando centros de costo..." /> 
            ) : !hasResults ? (
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                  No se encontraron centros de costo para esta área.
               </p>
            ) : (
            <>
               <DataTable
                  data={costCenters}
                  title="Listado de centros de costos disponibles"
                  columns={configColumn}
               />

               <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end mt-6">
                  <Button
                     type="button"
                     size="giant"
                     label="Omitir"
                     onClick={handleOmit}
                     className="text-[15px]! rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!"
                  />
                  
                  <Button
                     type="button"
                     size="giant"
                     label="Cancelar"
                     onClick={handleClose}
                     className="text-[15px]! rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!"
                  />

                  <Button
                     type="button"
                     size="giant"
                     label="Seleccionar"
                     disabled={!selectedCostCenter}
                     onClick={() => {
                        if (selectedCostCenter) {
                           onSelect({
                              costCenterId: selectedCostCenter.cost_center_id,
                              costCenterName: selectedCostCenter.cost_center_name
                           })
                           handleClose();
                        }
                     }}
                     className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                  />
               </div>
            </>
            )
         }
      </Modal>
   );
};