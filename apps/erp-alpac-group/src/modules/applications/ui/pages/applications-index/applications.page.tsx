import { Breadcrumb, DataTable, InputText } from "@alpac/design-system";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useTheme } from "@alpac/design-system";
import { useApplications } from "@app/modules/applications/ui/hooks/useApplications";
import { useUserStore } from "@app/shared/stores/useUserStore";

export const ApplicationsPage = function () {
   const { theme } = useTheme();
   const { urlImage, neutralUrlImage } = useCompanyStore();
   const navigate = useNavigate();

   const activeLogo = theme === 'dark' ? neutralUrlImage : urlImage;

   const { companyId, moduleCode } = useUserStore();

   const { GetApplicationsQuery } = useApplications({ company_id: companyId, module_code: moduleCode });

   const { data: applications = [] } = GetApplicationsQuery;

   console.log(applications)

   const columnConfig = [
      { key: 'permit_apllication_id', label: 'Código' },
      { key: 'type', label: 'Tipo' },
      { key: 'status', label: 'Estado' },
      { key: 'start_date', label: 'Fecha' },
      { key: 'description', label: 'Descripción' },
      { key: 'requested_by', label: 'Solicitado por' },
      { key: 'approved_by', label: 'Aprobado por' },
      { key: 'rejected_by', label: 'Rechazado por' },
      { key: 'created_at', label: 'Fecha de creación' },
      { key: 'start_time', label: 'Hora de inicio' },
      { key: 'end_time', label: 'Hora de fin' },
   ]

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.5 }}
         className="flex flex-col gap-4"
      >

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
         </form>

         <div className="flex flex-col">
            <DataTable
               title="Lista de solicitudes"
               data={applications}
               columns={columnConfig}
            />
         </div>

      </motion.div>
   );
};