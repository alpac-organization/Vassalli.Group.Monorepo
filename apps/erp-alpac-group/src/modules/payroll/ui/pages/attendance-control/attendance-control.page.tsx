import { Breadcrumb } from "@alpac/design-system";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@alpac/design-system";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { FileUploader } from "@app/shared/components/file-uploader/file-uploader";

export const AttendanceControlPage = () => {

   const navigate = useNavigate();
   const { theme } = useTheme();
   const { urlImage, neutralUrlImage } = useCompanyStore();

   const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

   return (
      <LazyMotion features={domAnimation} strict>
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
                        label: "Control de asistencia",
                        url: "/payroll/attendance-control",
                        onClick: (url) => navigate(url),
                     },
                  ]}
               />
            </div>

            <div className="flex flex-col">
               <div className="flex justify-between items-center">
                  <div className="flex flex-col justify-center">
                     <h3 className="p-0! m-0!">Control de asistencia</h3>
                     <small className="text-gray-500 dark:text-gray-300">
                        Descripcion de control de asistencia y sus estadisticas
                     </small>
                  </div>
                  <img
                     className="h-12 sm:h-16 md:h-20 w-auto object-contain"
                     src={activeLogo}
                     alt="logo alpac"
                  />
               </div>
            </div>

            <div className="flex flex-col">

               <FileUploader extensions={["xls", "xlsx", "csv"]} />

            </div>

         </m.div>
      </LazyMotion>
   );
};