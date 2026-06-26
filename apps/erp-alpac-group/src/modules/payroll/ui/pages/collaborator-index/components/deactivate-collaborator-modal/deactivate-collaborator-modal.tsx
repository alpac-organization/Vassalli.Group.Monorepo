import { Button, Modal } from "@alpac/design-system";
import type { DeactivateCollaboratorModalProps } from "./deactivate-collaborator-modal.types";
import { useCallback, useMemo, useState } from "react";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import { CollaboratorSearchForm } from "../../../permissions/components/collaborator-search-form/collaborator-search-form";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { RoleEnum } from "@app/core/enums/role.enum";
import { CollaboratorSummary } from "../../../permissions/components/new-permission-request/collaborator-summary";
import { UserMinus, X } from "lucide-react";

export const DeactivateCollaboratorModal = (props: DeactivateCollaboratorModalProps) => {

   const { companyId, moduleCode, identificationNumber, role } = useUserStore();

   const isAdministrator = role === RoleEnum.ADMINISTRATOR;

   const [foundCollaborator, setFoundCollaborator] = useState<GetCollaboratorProfileDetailsResponse | null>(null);
   const [isSearching, setIsSearching] = useState(false);

   const displayFullName = useMemo(() => {
      return foundCollaborator?.full_name ?? "";
   }, [foundCollaborator]);

   const displayWorkPosition = useMemo(() => {
      return foundCollaborator?.work_position ?? "";
   }, [foundCollaborator]);

   const handleCloseModal = useCallback(() => {
      props.onClose?.();
      // reset();
   }, []);

   const handleClearCollaborator = useCallback(() => {
      setFoundCollaborator(null);
      setIsSearching(false);
   }, []);

   return (
      <Modal
         isOpen={props.isOpen}
         title="Iniciar baja de collaborator"
         variant="form"
         size="2xl"
         onClose={handleCloseModal}
      >
         {!isAdministrator && "No tiene permiso para iniciar procesos de baja de un colaborador"}

         {(isAdministrator && !foundCollaborator) &&
            (<CollaboratorSearchForm
               onSuccess={(collaborator) => {
                  setFoundCollaborator(collaborator);
                  setIsSearching(false);
               }}
               onError={() => {
                  setIsSearching(false);
                  setFoundCollaborator(null);
               }}
               onSearchStart={() => {
                  setIsSearching(true);
               }}
               excludeIdentifications={[identificationNumber]}
            />)
         }

         {isAdministrator && foundCollaborator && (
            <div className="flex flex-col gap-4">
               <div className="relative flex w-full flex-row items-center gap-4">
                  <div className="min-w-0 flex-1">
                     <CollaboratorSummary
                        fullName={displayFullName}
                        workPosition={displayWorkPosition}
                        isFullNameLoading={isSearching}
                        isWorkPositionLoading={isSearching}
                     />
                  </div>
                  <div className="group flex items-center">
                     <button
                        type="button"
                        className="rounded-full p-1.5 text-slate-700 transition-all hover:bg-slate-300 hover:text-slate-900 dark:text-white dark:hover:bg-white/15 dark:hover:text-white"
                        onClick={handleClearCollaborator}
                        aria-label="Quitar Colaborador"
                     >
                        <X size={20} />
                     </button>
                     <div className="pointer-events-none absolute -top-10 right-0 z-50 mt-2 rounded bg-slate-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                        Quitar Colaborador
                     </div>
                  </div>
               </div>

               <div className="flex justify-end pt-2">
                  <Button
                     type="button"
                     label="Iniciar Proceso de Baja"
                     icon={<UserMinus size={20} />}
                     className="rounded-md! w-full h-11 px-6! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200"
                  />
               </div>
            </div>
         )}
      </Modal>
   );
}