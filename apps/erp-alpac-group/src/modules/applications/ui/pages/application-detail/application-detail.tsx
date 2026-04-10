import { Breadcrumb } from "@alpac/design-system";
import { useNavigate, useLocation } from "react-router-dom";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useTheme } from "@alpac/design-system";
import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

export const ApplicationDetailPage = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { theme } = useTheme();
   const { urlImage, neutralUrlImage } = useCompanyStore();
   const activeLogo = theme === 'dark' ? neutralUrlImage : urlImage;
   const applicationState = location.state as GetApplicationsResponse;

   console.log(applicationState.permit_apllication_id, applicationState.collaborator_id)

   return (
      <div className="flex flex-col gap-4">
         <div className="flex justify-start">
            <Breadcrumb
               items={[
                  {
                     label: 'Dashboard',
                     url: '/', onClick: (url) => navigate(url)
                  },
                  {
                     label: 'Solicitudes',
                     url: '..',
                     onClick: (url) => navigate(url),
                  },
                  {
                     label: 'Detalle de Solicitud',
                     url: 'applications/application-detail',
                     onClick: (url) => navigate(url),
                  },
               ]}
            />
         </div>

         <div className="flex flex-col">
            <div className="flex justify-between items-center">
               <div className="flex flex-col justify-center">
                  <h3 className="p-0! m-0!">Detalles de Solicitud</h3>
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
      </div>
   )
}