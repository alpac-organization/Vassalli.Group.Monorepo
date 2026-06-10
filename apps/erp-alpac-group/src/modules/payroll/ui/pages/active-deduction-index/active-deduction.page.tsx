import { Breadcrumb, Button, InputText, Pagination, useTheme } from "@alpac/design-system";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { m, LazyMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ActiveDeductionTable } from "./components/active-deduction-table/active-deduction-table";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export const ActiveDeductionsPage = () => {

   const navigate = useNavigate();

   const { theme } = useTheme();

   const { urlImage, neutralUrlImage } = useCompanyStore();

   const activeLogo = theme === 'dark' ? neutralUrlImage : urlImage;

   const { register, reset, formState: { errors, isValid, isDirty } } = useForm({ mode: "onChange" });

   const handleClearFilters = useCallback(() => {
      reset();
   }, [reset]);

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

            <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
               <div className="flex flex-col justify-center">
                  <h3 className="p-0! m-0!">Accesos Directos</h3>
                  <small className="text-gray-500 dark:text-gray-300">
                     Descripcion de accesos directos
                  </small>
               </div>
            </div>

            <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
               <div className="w-full flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-start">
                  <Button
                     size="giant"
                     label="Acción 1"
                     icon={<ArrowRight size={20} />}
                     className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                     onClick={() => console.log("testing")}
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
               onSubmit={() => console.log("Testing")}
               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end"
            >
               <div className="flex flex-col">
                  <InputText
                     label="Filtrar por"
                     className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                     labelClassName="text-black! dark:text-white!"
                     type="text"
                     placeholder="Filtro"
                     errorVariant="tooltip"
                     {...register("object.attribute", { required: false })}
                  />
               </div>

               <div className="flex flex-col">
                  <Button
                     type="submit"
                     size="giant"
                     disabled={!isValid || !isDirty}
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
               <ActiveDeductionTable
                  data={[]}
                  pagination={
                     <Pagination
                        currentPage={1}
                        pageSize={2}
                        totalRecords={3}
                        onPageChange={() => console.log("Testing")}
                        disabled={false}
                     />
                  }
               />
            </div>

         </m.div>

      </LazyMotion>
   );
}