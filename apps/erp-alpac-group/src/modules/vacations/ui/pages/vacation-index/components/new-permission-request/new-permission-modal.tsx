import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, Modal } from "@alpac/design-system";
import { usePermission } from "@app/modules/vacations/ui/hooks/usePermission";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { NewPermissionCollaboratorSummary } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/collaborator-summary";
import { NewPermissionRequestForm } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/new-permission-form";
import { RoleEnum } from "@app/core/enums/role.enum";
import { CollaboratorSearchForm } from "../collaborator-search-form/collaborator-search-form";

import type { CreatePermissionRequestBase } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { NewPermissionRequestModalProps } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/types/permission-modal.types";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborator-profile.response";

export function NewPermissionRequestModal({
   isOpen,
   onClose,
   collaboratorFullName,
   collaboratorWorkPosition,
   isCollaboratorFullNameLoading = false,
   isCollaboratorWorkPositionLoading = false,
   onRequestSuccess,
   onRequestError,
   channel,
}: NewPermissionRequestModalProps) {

   const { companyId, moduleCode, identificationNumber, role } = useUserStore();
   const { createPermissionRequestMutation } = usePermission();
   const [foundCollaborator, setFoundCollaborator] = useState<GetCollaboratorProfileDetailsResponse | null>(null);
   const [searchError, setSearchError] = useState<string | null>(null);
   const [isSearching, setIsSearching] = useState(false);

   const searchErrorVariants = {
      initial: { opacity: 0, y: 16, height: 0, overflow: 'hidden' },
      animate: { opacity: 1, y: 0, height: 'auto', overflow: 'visible' },
      exit: { opacity: 0, y: 8, height: 0, overflow: 'hidden' },
   }

   const isManager = role === RoleEnum.MANAGER
   const isAdministrator = role === RoleEnum.ADMINISTRATOR
   const isOperator = role === RoleEnum.OPERATOR

   useEffect(() => {
      if (isOpen) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "unset";
         setFoundCollaborator(null);
         setSearchError(null);
      }

      return () => { document.body.style.overflow = "unset" };
   }, [isOpen]);


   const handlePermissionSubmit = (payload: CreatePermissionRequestBase) => {
      createPermissionRequestMutation.mutate(payload, {
         onSuccess: () => {
            onClose?.();
            onRequestSuccess?.();
         },
         onError: (err) => {
            const apiError = err as unknown as ApiErrorResponse;
            onRequestError?.(
               apiError.error?.description ?? "Ocurrió un error inesperado.",
            );
         },
      });
   }

   const targetIdentification = useMemo(() => {
      if (isOperator) return identificationNumber;
      return foundCollaborator?.personal_information?.identification_number ?? "";
   }, [foundCollaborator, identificationNumber, isOperator]);

   return (
      <Modal
         isOpen={isOpen}
         variant="form"
         onClose={() => onClose?.()}
         title="Nueva Solicitud de Permiso"
         size="4xl"
         panelClassName={["dark:bg-[#272b34]"].join(" ")}>

         {/* Formulario de busqueda */}
         <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
            {
               (isManager || isAdministrator) && !isOperator && !foundCollaborator &&
               (
                  <motion.div
                     variants={searchErrorVariants}
                     initial="initial"
                     animate="animate"
                     exit="exit"
                     transition={{
                        height: { duration: 0.3, ease: "easeInOut" },
                        opacity: { duration: 0.45, ease: "easeOut", delay: 0.1 },
                        y: { duration: 0.3, ease: "easeOut", delay: 0.1 },
                     }}
                     onAnimationComplete={(definition) => {
                        if (definition === "animate") {
                           setTimeout(() => setSearchError(null), 3000);
                        }
                     }}>

                     <CollaboratorSearchForm
                        onSuccess={(collaborator) => {
                           setFoundCollaborator(collaborator);
                           setSearchError(null);
                           setIsSearching(false)
                        }}
                        onError={(errorMessage) => {
                           setSearchError(errorMessage);
                           setIsSearching(false);
                           setFoundCollaborator(null);
                        }}
                        onSearchStart={() => {
                           setSearchError(null);
                           setIsSearching(true);
                        }}
                        excludeIdentification={identificationNumber}
                     />
                  </motion.div>
               )
            }

            <AnimatePresence>
               {
                  searchError && (
                     <motion.div
                        key="search-error"
                        variants={searchErrorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{
                           height: { duration: 0.3, ease: "easeInOut" },
                           opacity: { duration: 0.45, ease: "easeOut", delay: 0.1 },
                           y: { duration: 0.3, ease: "easeOut", delay: 0.1 },
                        }}
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
                  )
               }
            </AnimatePresence>


            <AnimatePresence initial={!isOperator}>
               {(((isManager || isAdministrator) && !!foundCollaborator) || isOperator) && (
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
                     className="flex flex-col gap-4 sm:gap-5"
                  >
                     <NewPermissionCollaboratorSummary
                        fullName={collaboratorFullName ?? foundCollaborator?.full_name ?? ""}
                        workPosition={collaboratorWorkPosition ?? foundCollaborator?.work_position ?? ""}
                        isFullNameLoading={isCollaboratorFullNameLoading || isSearching}
                        isWorkPositionLoading={isCollaboratorWorkPositionLoading || isSearching}
                     />

                     <NewPermissionRequestForm
                        isPending={createPermissionRequestMutation.isPending}
                        onSubmit={handlePermissionSubmit}
                        onCancel={() => onClose?.()}
                        companyId={companyId}
                        moduleCode={moduleCode}
                        identificationNumber={targetIdentification}
                        channel={channel}
                     />
                  </motion.div>
               )}
            </AnimatePresence>

         </div>
      </Modal >
   );
}
