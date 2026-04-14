import { useCallback, useEffect, useMemo, useState } from "react";
import { Breadcrumb, Button, Dropdown, InputText, Pagination } from "@alpac/design-system";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useTheme } from "@alpac/design-system";
import { useApplications } from "@app/modules/applications/ui/hooks/useApplications";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { ApplicationsTable } from "./components/application-table/applications-table";
import { Loader } from "@app/shared/components/loaders/loader";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { PermitApplicationTypeOptions } from "@app/modules/applications/domain/enums/permit-application-type.enum";
import { PermitApplicationStatusOptions } from "@app/modules/applications/domain/enums/permit-application-status.enum";
import { ApplicationModal } from "./components/application-modal/application-modal";
import type { ApplicationRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.request";
import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";
import { RoleEnum } from "@app/core/enums/role.enum";
import { formatCollaboratorCode } from "@app/shared/utils/collaborator.utils";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/useCollaborators";
import { ManagerPanel } from "./components/manager-panel/manager-panel";

export const ApplicationsPage = function () {

   const initialFilters: ApplicationRequest = {
      company_id: '',
      module_code: '',
      user_role: '',
      permit_application_type_id: 0,
      permit_application_status_id: 0,
      collaborator_code: '',
   };

   const [isAdministrator, setIsAdministrator] = useState(false);
   const [isManager, setIsManager] = useState(false);
   const [filters, setFilters] = useState<ApplicationRequest>(initialFilters);

   const navigate = useNavigate();

   const { theme } = useTheme();
   const { role } = useUserStore();
   const { urlImage, neutralUrlImage } = useCompanyStore();

   const { control, reset, handleSubmit } = useForm<ApplicationRequest>({
      defaultValues: initialFilters
   })

   const activeLogo = theme === 'dark' ? neutralUrlImage : urlImage;

   const isListEnabled: boolean = isAdministrator
   const isDetailEnabled: boolean = isManager && !!filters.collaborator_code;

   const { companyId, moduleCode } = useUserStore();

    const { 
       GetApplicationsQuery, 
       GetApplicationDetailQuery,
       ApproveApplication, 
       RejectApplication 
    } = useApplications({
       ...filters,
       company_id: companyId,
       module_code: moduleCode,
       user_role: role
    }, {
       enabled: isListEnabled,
       enabledDetail: isDetailEnabled
    });

   const data = isAdministrator
      ? (GetApplicationsQuery.data ?? [])
      : (GetApplicationDetailQuery.data ? [GetApplicationDetailQuery.data] : []);



   const identification = isManager && data.length > 0 ? data[0].identification_collaborator_to_receive : '';

   const { GetProfileDetails: BeneficiaryProfileQuery } = useCollaborators({
      CollaboratorDetailsPayload: {
         company_id: companyId,
         module_code: moduleCode,
         identification_number: identification ?? '',
         QueryEnabled: isDetailEnabled
      }
   })

   const isLoading = GetApplicationsQuery.isLoading || GetApplicationDetailQuery.isLoading;

   useEffect(() => {
      setIsAdministrator(role === RoleEnum.ADMINISTRATOR)
      setIsManager(role === RoleEnum.MANAGER)
   }, [role]);

   const beneficiary = useMemo(() => {
      if (!BeneficiaryProfileQuery.data) return null
      return BeneficiaryProfileQuery.data;
   }, [BeneficiaryProfileQuery.data]);

   const onSubmit: SubmitHandler<ApplicationRequest> = async (data) => {
      setFilters((prev) => ({ ...prev, ...data }));
   };

   const handleClearFilters = useCallback(() => {
      reset(initialFilters);
      setFilters(initialFilters);
   }, [reset]);

   const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
   const [selectedApplication, setSelectedApplication] = useState<GetApplicationsResponse>({} as GetApplicationsResponse);

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }
         }
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.5 }}
         className="flex flex-col gap-4" >

         {
            isLoading && (
               <Loader title={isAdministrator ? 'Cargando Solicitudes...' : 'Cargando Solicitud...'} />
            )
         }

         < div className="flex justify-start" >
            <Breadcrumb
               items={[
                  { label: 'Dashboard', url: '/', onClick: (url) => navigate(url) },
                  {
                     label: 'Solicitudes',
                     url: '/applications',
                     onClick: (url) => navigate(url),
                  },
               ]}
            />
         </div >

         <div className="flex flex-col">
            <div className="flex justify-between items-center">
               <div className="flex flex-col justify-center">
                  <h3 className="p-0! m-0!">Solicitudes</h3>
                  <small className="text-gray-500 dark:text-gray-300">
                     Descripcion de solicitudes
                  </small>
               </div>
               <img
                  className="h-12 sm:h-16 md:h-20 w-auto object-contain"
                  src={activeLogo}
                  alt="logo alpac"
               />
            </div>
         </div>

         <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
            <div className="flex flex-col justify-center">
               <h3 className="p-0! m-0!">Filtros</h3>
               <small className="text-gray-500 dark:text-gray-300">
                  Descripcion de filtros
               </small>
            </div>
         </div>

         <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">

            {isManager && (
               <div className="flex flex-col">

                  <Controller
                     name="collaborator_code"
                     control={control}
                     render={({ field }) => (

                        <InputText
                           {...field}
                           label="Código del Colaborador"
                           className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                           labelClassName="text-black! dark:text-white!"
                           type="text"
                           placeholder="Ingrese el código del colaborador"
                           onChange={(evt) => {
                              const value = evt.target.value;
                              const formattedValue = formatCollaboratorCode(value);
                              field.onChange(formattedValue);
                           }}
                        />

                     )}
                  />

               </div>
            )}

            {isAdministrator && (
               <div className="flex flex-col">
                  <Controller
                     name="permit_application_type_id"
                     control={control}
                     rules={{
                        required: false,
                     }}
                     render={({ field }) => {
                        return (
                           <Dropdown
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Tipo de Solicitud"
                              appearance="dark"
                              placeholder="Seleccione un tipo de solicitud"
                              labelClassName="text-black! dark:text-white!"
                              valueClassName="text-black! dark:text-white!"
                              className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                              options={PermitApplicationTypeOptions ?? []}
                           />
                        );
                     }}
                  />
               </div>
            )}

            {isAdministrator && (
               <div className="flex flex-col">
                  <Controller
                     name="permit_application_status_id"
                     control={control}
                     rules={{
                        required: false,
                     }}
                     render={({ field }) => {
                        return (
                           <Dropdown
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Estado de Solicitud"
                              placeholder="Seleccione un estado de solicitud"
                              appearance="dark"
                              labelClassName="text-black! dark:text-white!"
                              valueClassName="text-black! dark:text-white!"
                              className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                              options={PermitApplicationStatusOptions ?? []}
                           />
                        );
                     }}
                  />
               </div>
            )}

            <div className="flex flex-col">
               <Button
                  type="submit"
                  size="giant"
                  className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                  label="Aplicar filtros"
               />
            </div>

            <div className="flex flex-col">
               <Button
                  type="button"
                  size="giant"
                  className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
                  label="Limpiar filtros"
                  onClick={handleClearFilters}
               />
            </div>

         </form>

         {isAdministrator && (
            <div className="flex flex-col">
               <ApplicationsTable
                  data={data}
                  onOpenApplicationDetailModal={(application) => {
                     setSelectedApplication(application);
                     setIsApplicationModalOpen(true);
                  }}
                  pagination={
                     <Pagination currentPage={0}
                        pageSize={0}
                        totalRecords={0}
                        onPageChange={() => { }}
                        disabled={true} />
                  } />
            </div>
         )}

         {
            isManager && data.length === 0 && !isLoading && (
               <div>
                  <p className="h-[100px] rounded-xl border-2 border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center text-center text-gray-500 dark:text-gray-300">
                     Debe ingresar el código del colaborador para ver las solicitudes
                  </p>
               </div>
            )
         }

         {isManager && data.length > 0 && data.map((item) => (
            <ManagerPanel
               key={item.permit_apllication_id}
               item={item}
               beneficiary={beneficiary}
               isLoadingBeneficiary={BeneficiaryProfileQuery.isLoading}
               onApprove={(id) => ApproveApplication.mutate({ permit_application_id: id ?? '' })}
               onReject={(id) => RejectApplication.mutate({ permit_application_id: id ?? '' })}
            />
         ))}

         <ApplicationModal
            application={selectedApplication}
            isOpen={isApplicationModalOpen}
            onClose={() => setIsApplicationModalOpen(false)}
         />

      </motion.div >
   );
};