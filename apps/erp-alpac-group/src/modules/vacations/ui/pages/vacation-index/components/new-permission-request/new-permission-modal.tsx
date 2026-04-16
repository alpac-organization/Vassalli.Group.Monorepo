import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, Button, InputText, Modal } from "@alpac/design-system";
import { usePermission } from "@app/modules/vacations/ui/hooks/usePermission";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { NewPermissionCollaboratorSummary } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/collaborator-summary";
import { NewPermissionRequestForm } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/new-permission-form";
import { RoleEnum } from "@app/core/enums/role.enum";
import { formatIdentificationNumber } from "@app/shared/utils/string.utils";
import { SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/useCollaborators";

import type { CreatePermissionRequestBase } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { NewPermissionRequestModalProps } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/types/permission-modal.types";
import type { CollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-profile.request";
import { useMappedError } from "@app/shared/hooks/useMappedError";

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

   const { getMappedError } = useMappedError();

   const initialFilters: CollaboratorProfileDetailsRequest = {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: '',
      QueryEnabled: false
   }

   const searchErrorVariants = {
      initial: { opacity: 0, y: 16, height: 0, overflow: 'hidden' },
      animate: { opacity: 1, y: 0, height: 'auto', overflow: 'visible' },
      exit: { opacity: 0, y: 8, height: 0, overflow: 'hidden' },
   }

   const [isManager, setIsManager] = useState(false)
   const [isAdministrator, setIsAdministrator] = useState(false)
   const [isOperator, setIsOperator] = useState(false)
   const [filters, setFilters] = useState<CollaboratorProfileDetailsRequest>(initialFilters);
   const [searchError, setSearchError] = useState<string | null>(null);

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

   useEffect(() => {
      setIsManager(role === RoleEnum.MANAGER)
      setIsAdministrator(role === RoleEnum.ADMINISTRATOR)
      setIsOperator(role === RoleEnum.OPERATOR)
   }, [role]);

   const { handleSubmit: handleSearch, register, reset } = useForm<CollaboratorProfileDetailsRequest>();

   const { GetProfileDetails } = useCollaborators({ CollaboratorDetailsPayload: filters });

   const collaborator = useMemo(() => {
      if (GetProfileDetails.data) {
         setSearchError(null)
         return GetProfileDetails.data
      }
   }, [GetProfileDetails.data]);

   useEffect(() => {

      if (GetProfileDetails.isError && GetProfileDetails.error) {
         const mappedError = getMappedError(GetProfileDetails.error);
         setSearchError(mappedError.description);
      }

      if (!GetProfileDetails.isError) {
         setSearchError(null);
      }

   }, [GetProfileDetails.isError, GetProfileDetails.error])

   const handleSearchSubmit = (data: CollaboratorProfileDetailsRequest) => {

      setSearchError(null);

      const newFilters: CollaboratorProfileDetailsRequest = {
         company_id: companyId,
         module_code: moduleCode,
         identification_number: data.identification_number,
         QueryEnabled: true
      };

      if (identificationNumber === newFilters.identification_number) {
         setSearchError(`
            Por favor busca el perfil de otro colaborador o 
            solicita tu permiso a través de los canales establecidos.`
         );
         return;
      }

      const isSameQuery = filters.identification_number === newFilters.identification_number;

      if (isSameQuery) {
         GetProfileDetails.refetch();
      } else {
         setFilters(newFilters);
      }
   };

   const handleCloseModal = () => {
      onClose?.();
      setFilters(initialFilters);
      setSearchError(null);
      reset();
   }

   const handleSubmit = (payload: CreatePermissionRequestBase) => {
      createPermissionRequestMutation.mutate(payload, {
         onSuccess: () => {
            onClose?.();
            onRequestSuccess?.();
            setFilters(initialFilters);
            setSearchError(null);
            reset();
         },
         onError: (err) => {
            const apiError = err as unknown as ApiErrorResponse;
            onClose?.();
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
         onClose={handleCloseModal}
         title="Nueva Solicitud de Permiso"
         size="4xl"
         panelClassName={["dark:bg-[#272b34]"].join(" ")}>

         {/* Formulario de busqueda */}
         <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
            {
               (isManager || isAdministrator) && !GetProfileDetails.data && !isOperator &&
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
                     }}
                  >
                     <form onSubmit={handleSearch(handleSearchSubmit)}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">

                        <div className="col-span-2">
                           <InputText
                              label="Buscar por número de cédula"
                              placeholder="Ej. 001-010190-0001A"
                              className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                              labelClassName="text-black! dark:text-white!"
                              {...register('identification_number', {
                                 setValueAs: (value: string) =>
                                    value ? value.toString().replace(/-/g, "").toUpperCase()
                                       : "",
                                 required: false,
                                 onChange: (e) => {
                                    e.target.value = formatIdentificationNumber(e.target.value)
                                 }
                              })}
                           />
                        </div>

                        <div className="col-span-1">
                           <Button
                              type="submit"
                              label="Buscar"
                              size="giant"
                              disabled={GetProfileDetails.isLoading}
                              isLoading={GetProfileDetails.isLoading}
                              icon={<SearchIcon size={18} />}
                              className="text-[15px]! w-full rounded-md!"
                           />
                        </div>

                     </form>
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
               {(((isManager || isAdministrator) && !!GetProfileDetails.data) || isOperator) && (
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
                        fullName={collaboratorFullName ?? collaborator?.full_name ?? ""}
                        workPosition={collaboratorWorkPosition ?? collaborator?.work_position ?? ""}
                        isFullNameLoading={isCollaboratorFullNameLoading || GetProfileDetails.isLoading}
                        isWorkPositionLoading={isCollaboratorWorkPositionLoading || GetProfileDetails.isLoading}
                     />

                     <NewPermissionRequestForm
                        isPending={createPermissionRequestMutation.isPending}
                        onSubmit={handleSubmit}
                        onCancel={handleCloseModal}
                        companyId={companyId}
                        moduleCode={moduleCode}
                        identificationNumber={collaborator?.personal_information?.identification_number ?? ""}
                     />
                  </motion.div>
               )}
            </AnimatePresence>

         </div>
      </Modal >
   );
}
