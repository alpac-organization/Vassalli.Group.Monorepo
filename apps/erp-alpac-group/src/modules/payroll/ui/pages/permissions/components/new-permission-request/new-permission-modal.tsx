import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@alpac/design-system";
import { usePermission } from "@app/modules/payroll/ui/hooks/permission/usePermission";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { CollaboratorSummary } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/collaborator-summary";
import { NewPermissionRequestForm } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/new-permission-form";
import { RoleEnum } from "@app/core/enums/role.enum";
import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";
import { ChannelEnum } from "@app/core/enums/channel.enum";

import type { CreatePermissionRequestBase } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { NewPermissionRequestModalProps } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/types/permission-modal.types";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";

export function NewPermissionRequestModal({
   isOpen,
   onClose,
   collaboratorFullName,
   collaboratorWorkPosition,
   isCollaboratorFullNameLoading = false,
   isCollaboratorWorkPositionLoading = false,
   onRequestSuccess,
   onRequestError,
}: NewPermissionRequestModalProps) {

   const { companyId, moduleCode, identificationNumber, role } = useUserStore();
   const { createPermissionRequestMutation } = usePermission();
   const [foundCollaborator, setFoundCollaborator] = useState<GetCollaboratorProfileDetailsResponse | null>(null);
   const [isSearching, setIsSearching] = useState(false);

   const isManager = role === RoleEnum.MANAGER
   const isAdministrator = role === RoleEnum.ADMINISTRATOR
   const isOperator = role === RoleEnum.OPERATOR

   const channel = role === RoleEnum.ADMINISTRATOR ?
      ChannelEnum.AdministrativePanel : role === RoleEnum.MANAGER ?
         ChannelEnum.DirectManagerPanel : ChannelEnum.PersonalPanel;

   useEffect(() => {
      if (isOpen) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "unset";
         setFoundCollaborator(null);
      }

      return () => { document.body.style.overflow = "unset" };
   }, [isOpen]);


   const handlePermissionSubmit = (payload: CreatePermissionRequestBase) => {
      createPermissionRequestMutation.mutate(payload, {
         onSuccess: () => {
            onClose?.();
            onRequestSuccess?.("Solicitud de permiso creada exitosamente");
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
                  <div>
                     <CollaboratorSearchForm
                        onSuccess={(collaborator) => {
                           setFoundCollaborator(collaborator);
                           setIsSearching(false)
                        }}
                        onError={() => {
                           setIsSearching(false);
                           setFoundCollaborator(null);
                        }}
                        onSearchStart={() => {
                           setIsSearching(true);
                        }}
                        excludeIdentifications={[identificationNumber]}
                     />
                  </div>
               )
            }

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
                     <CollaboratorSummary
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
