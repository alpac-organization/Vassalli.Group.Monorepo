import { DataTable, Modal, SectionHeader } from "@alpac/design-system";


import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCostCenters } from "@app/modules/admin/ui/hooks/cost-centers/useCostCenters";

//all types here..
import type { SelectCostCenterProps } from "./select-cost-center-modal.type";
import { getColumnConfig } from "./select-cost-center-modal.variants";

export const SelectCostCenterModal = function(props: SelectCostCenterProps){

   const { areaId, isOpen, onClose, onSelect } = props;

   const { moduleCode, companyId } = useUserStore();

   const { GetCostCenters } = useCostCenters({
      area_id: areaId,
      company_id: companyId,
      module_code: moduleCode
   });
   
   //Obtener utils table
   const configColumn = getColumnConfig();

   return (
      <Modal
         size="5xl"
         variant="info"
         isOpen={ isOpen }
         onClose={() => onClose()}
      >
         <SectionHeader 
            title="¿A qué centro de costo pertenece?"
            subtitle="Selecciona el centro de costo correspondiente a este colaborador"
            headerClassName="mb-7"
         />

         <DataTable 
            data={[]}
            title="Listado de centros de costos disponibles"
            columns={configColumn}
         />

      </Modal>
   )
}