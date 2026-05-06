import { useState } from "react";
import { Alert, AnimatedAlertWrapper, Button } from "@alpac/design-system";
import { PlusIcon } from "lucide-react";
import { VacationManagementModal } from "./vacation-management-modal";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import type { VacationManagementSectionProps } from "./types/vacation-managment.types";

/**
 * @description
 * Componente que muestra la gestión de vacaciones del colaborador
 * @param props - Props del componente
 * @param props.profile - Perfil del colaborador
 */
export const VacationManagementSection = ({ profile }: VacationManagementSectionProps) => {
   const [showModal, setShowModal] = useState(false);
   const { alertState, handleCloseAlert, handleRequestError, handleRequestSuccess } = useAlertState();

   return (
      <section className="flex flex-col gap-3 p-4 border dark:bg-[#272b34] bg-white border-slate-200 dark:border-neutral-700 shadow-sm">

         <div className="flex items-center justify-between">
            <h5 className="text-lg font-semibold dark:text-white">Nombre: {profile.full_name}</h5>

            <Button
               type="button"
               label="Agregar Vacaciones Generadas"
               size="giant"
               onClick={() => setShowModal(true)}
               icon={<PlusIcon size={20} />}
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

         <VacationManagementModal
            profile={profile}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onRequestError={handleRequestError}
            onRequestSuccess={handleRequestSuccess}
         />

      </section>
   );
};