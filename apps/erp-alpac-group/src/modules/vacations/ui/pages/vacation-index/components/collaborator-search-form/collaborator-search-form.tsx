import { Button, InputText } from "@alpac/design-system";
import type { CollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-profile.request";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/useCollaborators";
import { formatIdentificationNumber, validateIdentificationNumber } from "@app/shared/utils/string.utils";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { CollaboratorSearchFormProps } from "./collaborator-search-form.types";
import { IdentificationEnum } from "@app/core/enums/identifcation.enum";

export const CollaboratorSearchForm = ({ onSuccess, onError, onSearchStart, excludeIdentification, label }: CollaboratorSearchFormProps) => {

   const { companyId, moduleCode } = useUserStore();
   const { getMappedError } = useMappedError();

   const initialFilters: CollaboratorProfileDetailsRequest = {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: '',
      QueryEnabled: false
   }

   const { handleSubmit, register, formState: { errors } } = useForm<CollaboratorProfileDetailsRequest>();

   const [filters, setFilters] = useState<CollaboratorProfileDetailsRequest>(initialFilters);

   const { GetProfileDetails } = useCollaborators({ CollaboratorDetailsPayload: filters });

   useEffect(() => {
      if (GetProfileDetails.data) {
         onSuccess(GetProfileDetails.data);
      }
      if (GetProfileDetails.isError) {
         const mapped = getMappedError(GetProfileDetails.error);
         onError(mapped.description);
      }
   }, [GetProfileDetails.data, GetProfileDetails.isError]);

   const handleSearchSubmit = (data: CollaboratorProfileDetailsRequest) => {
      if (excludeIdentification === data.identification_number) {
         onError("Por favor busca el perfil de otro colaborador o solicita tu permiso a través de los canales establecidos.");
         return;
      }

      onSearchStart();
      setFilters({
         ...filters,
         identification_number: data.identification_number,
         QueryEnabled: true
      });
   }

   return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">

         <div className="col-span-2">
            <InputText
               label={label ?? "Buscar por número de cédula"}
               placeholder="Ej. 001-010190-0001A"
               className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
               labelClassName="text-black! dark:text-white!"
               errorVariant="tooltip"
               {...register('identification_number', {
                  validate: {
                     validateIdentification: (value?: string) => validateIdentificationNumber(value!, IdentificationEnum.NATIONAL_ID.value)
                  },
                  setValueAs: (value: string) =>
                     value ? value.toString().replace(/-/g, "").toUpperCase()
                        : "",
                  required: false,
                  onChange: (e) => {
                     e.target.value = formatIdentificationNumber(e.target.value)
                  }
               })}
               error={errors.identification_number?.message}
            />
         </div>

         <div className="col-span-1">
            <Button
               type="button"
               label="Buscar"
               onClick={handleSubmit(handleSearchSubmit)}
               size="giant"
               disabled={GetProfileDetails.isLoading}
               isLoading={GetProfileDetails.isLoading}
               icon={<SearchIcon size={18} />}
               className="text-[15px]! w-full rounded-md!"
            />
         </div>

      </div>
   );
}