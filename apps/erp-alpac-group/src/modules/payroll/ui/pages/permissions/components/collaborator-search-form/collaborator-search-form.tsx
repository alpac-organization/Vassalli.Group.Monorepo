import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Alert, Button, InputText } from "@alpac/design-system";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/collaborator/useCollaborators";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { IdentificationEnum } from "@app/core/enums/identification.enum";
import { formatIdentificationNumber, validateIdentificationNumber } from "@app/shared/utils/string.utils";

import type { CollaboratorSearchFormProps } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form.types";
import type { CollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/collaborator-profile.request";
import { useQueryClient } from "@tanstack/react-query";
import { m, LazyMotion, AnimatePresence } from "framer-motion";
import { useAlertState } from "@app/shared/hooks/useAlertState";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export const CollaboratorSearchForm = ({
   onSuccess,
   onError,
   onSearchStart,
   excludeIdentifications,
   label,
}: CollaboratorSearchFormProps) => {
   const { companyId, moduleCode } = useUserStore();
   const { getMappedError } = useMappedError();
   const { alertState, handleRequestError } = useAlertState();

   const initialFilters: CollaboratorProfileDetailsRequest = {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: "",
      QueryEnabled: false,
   };

   const searchErrorVariants = {
      initial: { opacity: 0, y: 16, height: 0, overflow: 'hidden' },
      animate: { opacity: 1, y: 0, height: 'auto', overflow: 'visible' },
      exit: { opacity: 0, y: 8, height: 0, overflow: 'hidden' },
   }

   const {
      handleSubmit,
      register,
      formState: { errors },
   } = useForm<CollaboratorProfileDetailsRequest>();

   const [filters, setFilters] =
      useState<CollaboratorProfileDetailsRequest>(initialFilters);

   const { GetProfileDetails } = useCollaborators({
      CollaboratorDetailsPayload: filters,
   });

   const queryClient = useQueryClient();

   useEffect(() => {

      if (GetProfileDetails.data) {
         onSuccess(GetProfileDetails.data);
      }

      if (GetProfileDetails.isError) {
         const mapped = getMappedError(GetProfileDetails.error);
         handleRequestError(mapped.description);
         onError(mapped.description);
      }

   }, [GetProfileDetails.data, GetProfileDetails.isError, GetProfileDetails.fetchStatus]);

   const handleSearchSubmit = (data: CollaboratorProfileDetailsRequest) => {


      if (excludeIdentifications && excludeIdentifications.includes(data.identification_number!)) {

         const messageError = `
            Por favor busca el perfil de otro colaborador o 
            inicia el trámite a través de los canales establecidos.`;
         handleRequestError(messageError)
         onError(messageError);

         return;
      }

      queryClient.resetQueries({ queryKey: ["collaboratorProfileDetails"] });

      onSearchStart();

      setFilters({
         ...filters, identification_number: data.identification_number,
         QueryEnabled: true,
      });
   };

   const onSubmit = handleSubmit(handleSearchSubmit)

   return (
      <div className="flex flex-col gap-5">
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="col-span-2">
               <InputText
                  label={label ?? "Buscar por número de cédula"}
                  placeholder="Ej. 001-010190-0001A"
                  className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                  labelClassName="text-black! dark:text-white!"
                  errorVariant="tooltip"
                  {...register("identification_number", {
                     validate: {
                        validateIdentification: (value?: string) =>
                           validateIdentificationNumber(
                              value!,
                              IdentificationEnum.NATIONAL_ID.value,
                           ),
                     },
                     setValueAs: (value: string) =>
                        value ? value.toString().replace(/-/g, "").toUpperCase() : "",
                     required: false,
                     onChange: (e) => {
                        e.target.value = formatIdentificationNumber(e.target.value);
                     },
                  })}
                  onKeyDown={(evt) => {
                     if (evt.key === 'Enter') {
                        evt.preventDefault();
                        onSubmit();
                     }
                  }}
                  error={errors.identification_number?.message}
               />
            </div>

            <Button
               type="button"
               label="Buscar"
               onClick={(evt) => {
                  evt.stopPropagation();
                  onSubmit();
               }}
               size="giant"
               disabled={GetProfileDetails.isLoading}
               isLoading={GetProfileDetails.isLoading}
               icon={<SearchIcon size={18} />}
               className="text-[15px]! w-full! rounded-md!"
            />

         </div>

         <LazyMotion features={loadFeatures} strict>
            <AnimatePresence>
               {
                  (alertState?.open || GetProfileDetails.isError) && (
                     <m.div
                        key="search-error"
                        variants={searchErrorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="col-span-3"
                        transition={{
                           height: { duration: 0.3, ease: "easeInOut" },
                           opacity: { duration: 0.45, ease: "easeOut", delay: 0.1 },
                           y: { duration: 0.3, ease: "easeOut", delay: 0.1 },
                        }}>

                        <Alert
                           type="error"
                           title="Error"
                           message={alertState?.message ?? "Hubo un error al buscar colaborador"}
                        />
                     </m.div>
                  )
               }
            </AnimatePresence>
         </LazyMotion>
      </div>
   );
};
