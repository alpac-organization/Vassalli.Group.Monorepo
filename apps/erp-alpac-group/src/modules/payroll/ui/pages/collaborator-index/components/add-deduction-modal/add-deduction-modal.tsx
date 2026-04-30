import { Modal } from "@alpac/design-system";
import type { AddDeductionModalProps } from "@app/modules/payroll/ui/pages/collaborator-index/components/add-deduction-modal/add-deduction-modal.types";

export const AddDeductionModal = (
   props: AddDeductionModalProps
): React.ReactNode => {
   return (
      <Modal
         isOpen={props.isOpen}
         onClose={props.onClose}
         title="Agregar Deducción"
         variant="form"
         size="7xl"
         description="Complete la información de la deducción"
      >
         <div>
            <p>Agregar Deducción</p>
         </div>
      </Modal>
   );
};