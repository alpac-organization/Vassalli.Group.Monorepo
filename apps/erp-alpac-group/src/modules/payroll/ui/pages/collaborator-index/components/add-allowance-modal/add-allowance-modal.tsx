import { useState } from "react";
import { Modal, Alert } from "@alpac/design-system";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { RoleEnum } from "@app/core/enums/role.enum";
import { AddAllowanceForm } from "../add-allowance-form/add-allowance-form";

import type { AddAllowanceModalProps } from "@app/modules/payroll/ui/pages/collaborator-index/components/add-allowance-modal/add-allowance-modal.types";

export const AddAllowanceModal = (props: AddAllowanceModalProps): React.ReactNode => {

   const { role } = useUserStore();
   const [searchError, setSearchError] = useState<string | null>(null);

   const searchErrorVariants: Variants = {
      initial: { opacity: 0, y: 16, height: 0, overflow: 'hidden' },
      animate: { opacity: 1, y: 0, height: 'auto', overflow: 'visible' },
      exit: { opacity: 0, y: 8, height: 0, overflow: 'hidden' },
   };

   const isAdministrator = role === RoleEnum.ADMINISTRATOR

   const handleClose = () => {
      setSearchError(null);
      props.onClose();
   };

   return (
      <Modal
         isOpen={props.isOpen}
         onClose={handleClose}
         title="Agregar Viáticos"
         variant="form"
         size="3xl"
         description="Complete la información de los viáticos"
      >
         <div className="flex flex-col gap-5">

            <AnimatePresence>
               {searchError && (
                  <motion.div
                     key="search-error"
                     variants={searchErrorVariants}
                     initial="initial"
                     animate="animate"
                     exit="exit"
                     transition={{ duration: 0.3 }}
                     onAnimationComplete={(definition) => {
                        if (definition === "animate") {
                           setTimeout(() => setSearchError(null), 5000);
                        }
                     }}
                  >
                     <Alert
                        type="error"
                        title="Error"
                        message={searchError}
                     />
                  </motion.div>
               )}
            </AnimatePresence>

            <AnimatePresence>
               {((isAdministrator)) && (
                  <motion.div
                     key="collaborator-result"
                     initial={{ opacity: 0, y: 16, height: 0, overflow: 'hidden' }}
                     animate={{ opacity: 1, y: 0, height: 'auto', overflow: 'visible' }}
                     exit={{ opacity: 0, y: 8, height: 0, overflow: 'hidden' }}
                     transition={{
                        height: { duration: 0.3, ease: "easeInOut" },
                        opacity: { duration: 0.45, ease: "easeOut", delay: 0.1 },
                        y: { duration: 0.3, ease: "easeOut", delay: 0.1 },
                     }}
                     className="flex flex-col gap-4 sm:gap-5">

                     <AddAllowanceForm
                        onSubmit={(data) => {
                           props.onSubmit(data.allowances)
                        }}
                        onCancel={handleClose}
                     />

                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </Modal>
   );
};