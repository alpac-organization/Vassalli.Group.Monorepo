import { Filter, FilterX } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { Button, Dropdown, InputText } from "@alpac/design-system"
import { dropdownClassName, inputClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style"

import { useProduct } from "@app/modules/product/ui/hooks/useProduct"
import { useUserStore } from "@app/shared/stores/useUserStore"
import { DEFAULT_STOCK_FILTERS, GetProductCategoryOptions } from "../stock-control.variants"

import type { StockControlFilters } from "../stock-control.types"
import type { StockControlSectionFiltersProps } from "./stock-control-section-filters.types"

export const StockControlSectionFilters = function(props: StockControlSectionFiltersProps){
   
   const { control, handleSubmit, reset, formState: { isDirty, isValid }, register } = useForm<StockControlFilters>({
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
      reset(DEFAULT_STOCK_FILTERS);
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
                  label="Producto"
                  className={inputClassName}
                  placeholder="Nombre producto"
                  labelClassName={labelClassName}
                  {...register("product_name")}
               />
            </div>

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
                  name="category_id"
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