import { useState } from "react";
import { Alert, AnimatedAlertWrapper, Button } from "@alpac/design-system";
import { Stethoscope } from "lucide-react";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { AddSubsidyModal } from "@app/modules/payroll/ui/pages/collaborator-index/components/add-subsidy-modal/add-subsidy-modal";
import type { SubsidyManagementSectionProps } from "./types/subsidy-management.types";

export const SubsidyManagementSection = ({ profile }: SubsidyManagementSectionProps) => {


   const [showModal, setShowModal] = useState(false);
   const { alertState, handleCloseAlert, handleRequestError, handleRequestSuccess } = useAlertState();

   return (
      <section className="flex flex-col gap-3 p-4 border dark:bg-[#272b34] bg-white border-slate-200 dark:border-neutral-700 shadow-sm">

         <div className="flex items-center justify-between">

            <Button
               type="button"
               label="Iniciar Proceso de Subsidio"
               size="giant"
               onClick={() => setShowModal(true)}
               icon={<Stethoscope size={20} />}
               className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            />
         </div>

         <AnimatedAlertWrapper open={alertState?.open ?? false}>
            <Alert
               type={alertState?.type!}
               title={alertState?.title}
               message={alertState?.message!}
               onClose={handleCloseAlert}
            />
         </AnimatedAlertWrapper>

         <AddSubsidyModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            collaborator={profile}
            onRequestSuccess={(message) => handleRequestSuccess(message)}
            onRequestError={(errorMessage) => handleRequestError(errorMessage)}
         />

      </section>
   );
};