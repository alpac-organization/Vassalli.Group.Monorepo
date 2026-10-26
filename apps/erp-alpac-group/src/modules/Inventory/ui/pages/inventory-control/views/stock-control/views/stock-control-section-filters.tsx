import { Filter, FilterX } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { Button, Dropdown, InputText } from "@alpac/design-system"
import { dropdownClassName, inputClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style"

import { useProduct } from "@app/modules/product/ui/hooks/useProduct"
import { useUserStore } from "@app/shared/stores/useUserStore"
import { GetProductCategoryOptions } from "./stock-control-section-filters.variant"

import type { StockControlFilters } from "../stock-control.types"
import type { StockControlSectionFiltersProps } from "./stock-control-section-filters.types"

export const StockControlSectionFilters = function(props: StockControlSectionFiltersProps){
   
   const { control, handleSubmit, reset, formState: { isDirty, isValid }, register, watch } = useForm<StockControlFilters>({
      defaultValues: props.filters,
   });

   const { companyId, moduleCode } = useUserStore();
   const { GetProductCategories } = useProduct({
      getProductCategoryPayload: { 
         company_id: companyId, 
         module_code: moduleCode 
      },
   });

   const { isPending, isFetching, data: productCategoriesData } = GetProductCategories;
   const categoryOptions = GetProductCategoryOptions(productCategoriesData ?? []);

   const onSubmit = (values: StockControlFilters) => {
      props.onApply(values);
      reset(values);
   }

   const handleClear = () => {
      reset(props.filters);
      props.onClear();
   };

   return (
		<form 
         className="flex gap-5 justify-between items-end"
         onSubmit={handleSubmit(onSubmit)}
      >
         <div className="flex gap-6 ">
            <InputText
               label="Producto"
               className={inputClassName}
               placeholder="Nombre producto"
               labelClassName={labelClassName}
               {
                  ...register("product_name")
               }
            />

            <InputText
               label="Codigo producto"
               value={watch("product_code")}
               placeholder="ALP-MGA-01-01-001"
               className={inputClassName}
               labelClassName={labelClassName}
               {
                  ...register("product_code")
               }
            />

            <Controller
               name="category_id"
               control={control}
               render={({ field }) => (
                  <Dropdown
                     isLoading={isPending || isFetching}
                     label="Categoria"
                     options={categoryOptions}
                     value={field.value}
                     onChange={(e) => field.onChange(e.value)}
                     placeholder="Seleccionar Categoria"
                     labelClassName={labelClassName}
                     className={dropdownClassName}
                     valueClassName={labelClassName}
                  />
               )}
            />
         </div>

         <section className="flex gap-5">
            <div className="flex flex-col">
               <Button
                  icon={
                     <Filter 
                        size={15}
                     />
                  }
                  type="submit"
                  size="giant"
                  className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                  label="Aplicar filtros"
                  disabled={!isDirty || !isValid}
               />
            </div>

            <div className="flex flex-col">
               <Button
                  icon={
                     <FilterX 
                        size={15}
                     />
                  }
                  type="button"
                  size="giant"
                  className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
                  label="Limpiar filtros"
                  onClick={handleClear}
               />
            </div>
         </section>
		</form>
	)
}