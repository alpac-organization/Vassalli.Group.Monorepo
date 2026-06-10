import { Breadcrumb, useTheme } from "@alpac/design-system";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { m, LazyMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export const ActiveDeductionsPage = () => {

   const navigate = useNavigate();

    const { theme } = useTheme();
    const { urlImage, neutralUrlImage } = useCompanyStore();

   const activeLogo = theme === 'dark' ? neutralUrlImage : urlImage;

   return (
      <LazyMotion features={loadFeatures}>

         <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4">

            <div className="flex justify-start">
               <Breadcrumb
                  items={[
                     { label: "Dashboard", url: "/", onClick: (url) => navigate(url) },
                     {
                        label: "Deducciones Activas",
                        url: "/active-deductions",
                        onClick: (url) => navigate(url),
                     },
                  ]}
               />
            </div>

            <div className="flex flex-col">
               <div className="flex justify-between items-center">
                  <div className="flex flex-col justify-center">
                     <h3 className="p-0! m-0!">
                        Deducciones Activas
                     </h3>
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
   );
}