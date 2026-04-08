import { Breadcrumb, Button, Dropdown, InputText, Pagination } from "@alpac/design-system";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useTheme } from "@alpac/design-system";
import { useApplications } from "@app/modules/applications/ui/hooks/useApplications";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { ApplicationsTable } from "./components/application-table/applications-table";
import { Loader } from "@app/shared/components/loaders/loader";
import { Controller, useForm } from "react-hook-form";
import { PermitApplicationTypeOptions } from "@app/modules/applications/domain/enums/permit-application-type.enum";
import type { ApplicationRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.request";
import { PermitApplicationStatusOptions } from "@app/modules/applications/domain/enums/permit-application-status.enum";
import { useCallback } from "react";

export const ApplicationsPage = function () {
   const navigate = useNavigate();
   const { theme } = useTheme();
   const { urlImage, neutralUrlImage } = useCompanyStore();
   const { control, reset } = useForm<ApplicationRequest>()

   const activeLogo = theme === 'dark' ? neutralUrlImage : urlImage;

   const { companyId, moduleCode } = useUserStore();

   const { GetApplicationsQuery } = useApplications({ company_id: companyId, module_code: moduleCode });

   const { data: applications = [] } = GetApplicationsQuery;

   console.log(applications)

   const handleClearFilters = useCallback(() => {
      reset();
   }, [reset]);

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.5 }}
         className="flex flex-col gap-4"
      >

         {GetApplicationsQuery.isPending && (
            <Loader title={'Cargando Solicitudes...'} />
         )}

         <div className="flex justify-start">
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
         </div>

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

         <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
            <div className="flex flex-col">
               <InputText
                  label="Identificación"
                  className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                  labelClassName="text-black! dark:text-white!"
                  type="text"
                  placeholder="Ingrese la identificación"

               />
            </div>

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
                           labelClassName="text-black! dark:text-white!"
                           valueClassName="text-black! dark:text-white!"
                           className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                           options={PermitApplicationStatusOptions ?? []}
                        />
                     );
                  }}
               />
            </div>

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

         <div className="flex flex-col">
            <ApplicationsTable
               data={applications}
               pagination={
                  <Pagination currentPage={0}
                     pageSize={0}
                     totalRecords={0}
                     onPageChange={() => { }}
                     disabled={true} />
               } />
         </div>

      </motion.div>
   );
};