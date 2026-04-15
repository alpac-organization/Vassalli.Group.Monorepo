import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, AnimatedAlertWrapper, Breadcrumb, Button, Dropdown, InputText, Pagination } from "@alpac/design-system";
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
import { RoleEnum } from "@app/core/enums/role.enum";
import { formatCollaboratorCode } from "@app/shared/utils/collaborator.utils";
import { ManagerForm } from "./components/application-forms/manager-form/manager-form";
import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";
import type { ApplicationRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.request";
import { useMappedError } from "@app/shared/hooks/useMappedError";

export const ApplicationsPage = function () {

   const initialFilters: ApplicationRequest = {
      company_id: '',
      module_code: '',
      user_role: '',
      permit_application_type_id: 0,
      permit_application_status_id: 0,
      collaborator_code: '',
   };

   const navigate = useNavigate();

   const [isAdministrator, setIsAdministrator] = useState(false);
   const [isManager, setIsManager] = useState(false);
   const [filters, setFilters] = useState<ApplicationRequest>(initialFilters);
   const [showAlert, setShowAlert] = useState<{
      show: boolean;
      type: "success" | "error" | "warning" | "info";
      title: string;
      message: string;
   }>({
      show: false,
      type: "info",
      title: "",
      message: "",
   });

   const { theme } = useTheme();
   const { role } = useUserStore();
   const { urlImage, neutralUrlImage } = useCompanyStore();
   const { companyId, moduleCode } = useUserStore();
   const { getMappedError } = useMappedError();

   const { control, reset, handleSubmit } = useForm<ApplicationRequest>({
      defaultValues: initialFilters
   })

   const activeLogo = theme === 'dark' ? neutralUrlImage : urlImage;
   const isListEnabled: boolean = isAdministrator
   const isDetailEnabled: boolean = isManager && !!filters.collaborator_code;

   const {
      GetApplicationsQuery,
      GetApplicationDetailQuery,
   } = useApplications({
      ...filters,
      company_id: companyId,
      module_code: moduleCode,
      user_role: role
   }, {
      enabled: isListEnabled,
      enabledDetail: isDetailEnabled
   });

   const applicationsData = useMemo(() =>
      isAdministrator
         ? (GetApplicationsQuery.data ?? [])
         : (GetApplicationDetailQuery.data ? [GetApplicationDetailQuery.data] : []),
      [isAdministrator, GetApplicationsQuery.data, GetApplicationDetailQuery.data]
   );

   const query = useMemo(() => {
      return isAdministrator ? GetApplicationsQuery : GetApplicationDetailQuery;
   }, [isAdministrator, GetApplicationsQuery, GetApplicationDetailQuery]);

   const isLoading = GetApplicationsQuery.isLoading || GetApplicationDetailQuery.isLoading;

   const isFetching = GetApplicationsQuery.isFetching || GetApplicationDetailQuery.isFetching;

   const isSuccess = GetApplicationsQuery.isSuccess || GetApplicationDetailQuery.isSuccess;

   const isError = GetApplicationsQuery.isError || GetApplicationDetailQuery.isError;

   const errors = GetApplicationsQuery.error || GetApplicationDetailQuery.error;

   useEffect(() => {
      setIsAdministrator(role === RoleEnum.ADMINISTRATOR)
      setIsManager(role === RoleEnum.MANAGER)
   }, [role]);

   useEffect(() => {
      if (isFetching) return;

      if (isError && errors) {

         const mappedError = getMappedError(errors);
         setShowAlert({
            show: true,
            type: "error",
            title: "Error al cargar",
            message:
               mappedError.description ||
               "Error al cargar las solicitudes",
         });
      }

      if (applicationsData.length === 0 && isSuccess && isManager) {
         setShowAlert({
            show: true,
            type: "error",
            title: "Error",
            message: "No se encontraron solicitudes",
         });
      }

      if (applicationsData.length > 0 && isSuccess) {
         setShowAlert({
            show: false,
            type: "info",
            title: "",
            message: "",
         });
      }
   }, [applicationsData, isFetching, isSuccess, isError, errors])

   const onSubmit: SubmitHandler<ApplicationRequest> = async (data) => {

      const isSameQuery = filters.collaborator_code === data.collaborator_code;

      if (isSameQuery) {
         query.refetch();
         return;
      }

      setFilters((prev) => ({ ...prev, ...data }));
   };

   const handleClearFilters = useCallback(() => {
      reset(initialFilters);
      setFilters(initialFilters);
      setShowAlert({
         show: false,
         type: "info",
         title: "",
         message: "",
      });
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
            isFetching && (
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


         {
            isManager && applicationsData.length === 0 && !isLoading && (
               <div>
                  <p className="h-[100px] rounded-xl border-2 border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center text-center text-gray-500 dark:text-gray-300">
                     Debe ingresar el código del colaborador para ver las solicitudes
                  </p>
               </div>
            )
         }

         {isManager && applicationsData.length > 0 && applicationsData.map((application) => (
            <div key={application.permit_apllication_id} className="flex flex-col gap-4">
               <ManagerForm application={application} />
            </div>
         ))}

         <AnimatedAlertWrapper open={showAlert.show}>
            {showAlert.show && (
               <Alert
                  type={showAlert.type}
                  title={showAlert.title}
                  message={showAlert.message}
                  showCloseButton
                  onClose={() => {
                     setShowAlert({
                        show: false,
                        type: "info",
                        title: "",
                        message: "",
                     });
                  }}
               />
            )}
         </AnimatedAlertWrapper>

         {isAdministrator && (
            <div className="flex flex-col">
               <ApplicationsTable
                  data={applicationsData}
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

         {isAdministrator && (
            <ApplicationModal
               application={selectedApplication}
               isOpen={isApplicationModalOpen}
               onClose={() => setIsApplicationModalOpen(false)}
            />
         )}

      </motion.div >
   );
};