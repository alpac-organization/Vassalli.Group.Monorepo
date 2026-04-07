import { Breadcrumb } from "@alpac/design-system";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const ApplicationsPage = function () {
   const navigate = useNavigate();
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
                  src={"https://"}
                  alt="logo alpac"
               />
            </div>
         </div>
      </motion.div>
   );
};