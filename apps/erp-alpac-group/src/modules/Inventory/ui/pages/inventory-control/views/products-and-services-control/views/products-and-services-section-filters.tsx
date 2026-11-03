import { Filter, FilterX } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { Button, Dropdown, InputText } from "@alpac/design-system"
import { dropdownClassName, inputClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style"

import { useProduct } from "@app/modules/product/ui/hooks/useProduct"
import { useUserStore } from "@app/shared/stores/useUserStore"
import { GetProductCategoryOptions } from "../../stock-control/stock-control.variants"
import { DEFAULT_PRODUCT_FILTERS } from "../products-and-services-control.variant"

import type { ProductsAndServicesFilters, ProductsAndServicesProps } from "./products-and-services-section-filters.types"

export const ProductsAndServicesSectionFilters = function(props: ProductsAndServicesProps){
   
   const { control, handleSubmit, reset, formState: { isDirty, isValid }, register } = useForm({
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

   const onSubmit = (values: ProductsAndServicesFilters) => {
      props.onApply(values);
      reset(values);    
   }

   const handleClear = () => {
      reset(DEFAULT_PRODUCT_FILTERS);
      props.onClear();
   }; 

   return (
      <form 
         className="flex gap-5 justify-between items-end"
         onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-6 items-start">

            <div className="w-64">
               <InputText
                  label="Codigo producto"
                  placeholder="ALP-MGA-01-01-001"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("product_code")}
               />
            </div>

            <div className="w-64">
               <Controller
                  name="category_product_id"
                  control={control}
                  render={({ field }) => (
                     <Dropdown
                        isLoading={isPending || isFetching}
                        label="Categoria"
                        value={field.value}
                        options={categoryOptions}
                        onChange={(e) => {
                           field.onChange(e);
                        }}
                        placeholder="Seleccionar Categoria"
                        appearance="dark"
                        labelClassName={labelClassName}
                        className={dropdownClassName}
                     />
                  )}
               />
            </div>
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