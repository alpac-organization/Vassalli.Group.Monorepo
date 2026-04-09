import { useEffect } from "react";
import { Modal } from "@alpac/design-system";
import { usePermission } from "@app/modules/vacations/ui/hooks/usePermission";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { CreatePermissionRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { NewPermissionCollaboratorSummary } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/collaborator-summary";
import { NewPermissionRequestForm } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/new-permission-form";
import type { NewPermissionRequestModalProps } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/types/permission-modal.types";

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
   const { companyId, moduleCode, identificationNumber } = useUserStore();

   useEffect(() => {
      if (isOpen) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "unset";
      }
      return () => {
         document.body.style.overflow = "unset";
      };
   }, [isOpen]);

   const { createPermissionRequestMutation } = usePermission();

   const handleSubmit = (payload: CreatePermissionRequest) => {
      createPermissionRequestMutation.mutate(payload, {
         onSuccess: () => {
            onClose();
            onRequestSuccess?.();
         },
         onError: (err) => {
            const apiError = err as unknown as ApiErrorResponse;
            onClose();
            onRequestError?.(
               apiError.error?.description ?? "Ocurrió un error inesperado.",
            );
         },
      });
   };

   return (
      <Modal
         isOpen={isOpen}
         variant="form"
         onClose={onClose}
         title="Nueva Solicitud de Permiso"
         size="4xl"
         panelClassName={["dark:bg-[#272b34]"].join(" ")}
      >
         <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
            <NewPermissionCollaboratorSummary
               fullName={collaboratorFullName}
               workPosition={collaboratorWorkPosition}
               isFullNameLoading={isCollaboratorFullNameLoading}
               isWorkPositionLoading={isCollaboratorWorkPositionLoading}
            />
            <NewPermissionRequestForm
               isPending={createPermissionRequestMutation.isPending}
               onSubmit={handleSubmit}
               onCancel={onClose}
               companyId={companyId}
               moduleCode={moduleCode}
               identificationNumber={identificationNumber}
            />
         </div>
      </Modal>
   );
}
