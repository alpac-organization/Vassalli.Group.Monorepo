
import { Breadcrumb } from '@alpac/design-system';
import { m, domAnimation, LazyMotion } from 'framer-motion';
import { useTheme } from '@alpac/design-system';
import { useCompanyStore } from '@app/shared/stores/useCompanyStore';
import { useNavigate } from 'react-router-dom';

export const ReportsPage = () => {

   const { theme } = useTheme();
   const { urlImage, neutralUrlImage } = useCompanyStore();
   const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;
   const navigate = useNavigate();

   return (
      <LazyMotion features={domAnimation}>
         <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
         >
            <div className="flex justify-start">
               <Breadcrumb
                  items={[
                     {
                        label: "Dashboard",
                        url: "/",
                        onClick: (url) => navigate(url),
                     },
                     {
                        label: "Reportes",
                        url: "/payroll/reports",
                        onClick: (url) => navigate(url),
                     },
                  ]}
               />
            </div>

            <div className="flex flex-col">
               <div className="flex justify-between items-center">
                  <div className="flex flex-col justify-center">
                     <h3 className="p-0! m-0!">Reportes</h3>
                     <small className="text-gray-500 dark:text-gray-300">
                        Aqui puedes encontrar todos los reportes de la nomina
                     </small>
                  </div>
                  <img
                     className="h-12 sm:h-16 md:h-20 w-auto object-contain"
                     src={activeLogo}
                     alt="logo alpac"
                  />
               </div>
            </div>
         </m.div>
      </LazyMotion>
   )
}