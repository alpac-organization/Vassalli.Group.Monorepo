import { useEffect, useRef, useState } from "react";
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
// import { m, LazyMotion, AnimatePresence } from "framer-motion";
import { useAlertState } from "@app/shared/hooks/useAlertState";

// const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

const normalizeIdentification = (value?: string | null) =>
   (value ?? "").toString().replace(/-/g, "").toUpperCase().trim();

export const CollaboratorSearchForm = ({
   onSuccess,
   onError,
   onSearchStart,
   excludeIdentifications,
   label,
}: CollaboratorSearchFormProps) => {

   const { companyId, moduleCode } = useUserStore();
   const { getMappedError } = useMappedError();
   const { handleRequestError, handleCloseAlert, InlineAlertComponent } = useAlertState();

   /*    const searchErrorVariants = {
         initial: { opacity: 0, y: 16, height: 0, overflow: 'hidden' },
         animate: { opacity: 1, y: 0, height: 'auto', overflow: 'visible' },
         exit: { opacity: 0, y: 8, height: 0, overflow: 'hidden' },
      } */

   const {
      handleSubmit,
      register,
      formState: { errors },
   } = useForm<CollaboratorProfileDetailsRequest>();

   const [filters, setFilters] = useState<CollaboratorProfileDetailsRequest>({
      company_id: companyId,
      module_code: moduleCode,
      identification_number: "",
      QueryEnabled: false,
   });

   const searchRequestIdRef = useRef(0);
   const handledRequestIdRef = useRef(0);

   const { GetProfileDetails } = useCollaborators({
      CollaboratorDetailsPayload: filters,
   });

   const queryClient = useQueryClient();

   useEffect(() => {
      if (!filters.QueryEnabled) return;
      if (GetProfileDetails.isLoading || GetProfileDetails.isFetching) return;

      const requestId = searchRequestIdRef.current;
      if (requestId === 0 || handledRequestIdRef.current === requestId) return;

      if (GetProfileDetails.isSuccess && GetProfileDetails.data) {
         handledRequestIdRef.current = requestId;
         handleCloseAlert();
         onSuccess(GetProfileDetails.data);
         return;
      }

      if (GetProfileDetails.isError) {
         handledRequestIdRef.current = requestId;
         const mapped = getMappedError(GetProfileDetails.error);
         handleRequestError(mapped.description ?? "Hubo un error al buscar colaborador");
         onError(mapped.description);
      }
   }, [
      filters.QueryEnabled,
      GetProfileDetails.isLoading,
      GetProfileDetails.isFetching,
      GetProfileDetails.isSuccess,
      GetProfileDetails.isError,
      GetProfileDetails.data,
      GetProfileDetails.error,
      getMappedError,
      handleCloseAlert,
      handleRequestError,
      onError,
      onSuccess,
   ]);

   const handleSearchSubmit = (data: CollaboratorProfileDetailsRequest) => {
      const identificationNumber = normalizeIdentification(
         data.identification_number,
      );

      if (!identificationNumber) {
         handleRequestError("El número de identificación es requerido");
         onError("El número de identificación es requerido");
         return;
      }

      const excluded = (excludeIdentifications ?? []).map(normalizeIdentification);
      if (excluded.includes(identificationNumber)) {
         const messageError = `
            Por favor busca el perfil de otro colaborador o 
            inicia el trámite a través de los canales establecidos.`;
         handleRequestError(messageError);
         onError(messageError);
         return;
      }

      handleCloseAlert();
      searchRequestIdRef.current += 1;
      handledRequestIdRef.current = 0;

      queryClient.resetQueries({ queryKey: ["collaboratorProfileDetails"] });

      onSearchStart();

      setFilters({
         company_id: companyId,
         module_code: moduleCode,
         identification_number: identificationNumber,
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
                        required: (value?: string) =>
                           Boolean(normalizeIdentification(value)) ||
                           "El número de identificación es requerido",
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

         {InlineAlertComponent}

      </div>
   );
};
