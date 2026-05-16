import { Modal } from "@alpac/design-system";
import { RoleEnum } from "@app/core/enums/role.enum";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { m, LazyMotion, AnimatePresence } from "framer-motion";
import { AddDeductionForm } from "@app/modules/payroll/ui/pages/nomina/components/deductions/add-deduction-form/add-deduction-form";
import type { AddDeductionModalProps } from "@app/modules/payroll/ui/pages/nomina/components/deductions/add-deduction-modal/add-deduction-modal.types";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export const AddDeductionModal = (props: AddDeductionModalProps): React.ReactNode => {

   const { role } = useUserStore();
   const isAdministrator = role === RoleEnum.ADMINISTRATOR;

   const handleCancel = () => {
      props.onClose?.()
   }

   return (
      <Modal
         isOpen={props.isOpen}
         onClose={handleCancel}
         title="Registro de Deducciones"
         variant="form"
         size="4xl"
      >
         <LazyMotion features={loadFeatures}>
            <div className="flex flex-col gap-5">

               <AnimatePresence>
                  {isAdministrator && (
                     <m.div
                        key="subsidy-form"
                        initial={{ opacity: 0, y: 16, height: 0, overflow: 'hidden' }}
                        animate={{ opacity: 1, y: 0, height: 'auto', overflow: 'visible' }}
                        exit={{ opacity: 0, y: 8, height: 0, overflow: 'hidden' }}
                        transition={{
                           height: { duration: 0.3, ease: "easeInOut" },
                           opacity: { duration: 0.45, ease: "easeOut", delay: 0.1 },
                           y: { duration: 0.3, ease: "easeOut", delay: 0.1 },
                        }}
                        className="flex flex-col gap-4 sm:gap-5"
                     >

                        <AddDeductionForm
                           payrollId={props.payrollId}
                           onCancel={handleCancel}
                           onRequestError={props.onRequestError}
                           onRequestSuccess={props.onRequestSuccess}
                        />
                     </m.div>
                  )}
               </AnimatePresence>
            </div>
         </LazyMotion>
      </Modal >
   );
};