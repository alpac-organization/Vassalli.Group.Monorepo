import { Filter, FilterX } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { Button, Dropdown, InputText } from "@alpac/design-system"
import { dropdownClassName, inputClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style"

import { useUserStore } from "@app/shared/stores/useUserStore"
import { useProduct } from "@app/modules/product/ui/hooks/useProduct"
import { DEFAULT_KARDEX_MOVEMENT_FILTERS, GetMovementTypeOptions } from "../../kardex-movement.variants"
import { GetProductCategoryOptions } from "../../../stock-control/stock-control.variants"

import type { KardexMovementSectionFiltersProps } from "./kardex-movement-section-filters.types"
import type { KardexMovementFilters } from "../../kardex-movements.types"

export const KardexMovementSectionFilters = function(props: KardexMovementSectionFiltersProps){
   
   const { control, handleSubmit, reset, formState: { isDirty, isValid }, register } = useForm<KardexMovementFilters>({
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
   const momentTypeOptions = GetMovementTypeOptions();

   const onSubmit = (values: KardexMovementFilters) => {
      props.onApply(values);
      reset(values);
   }

   const handleClear = () => {
      reset(DEFAULT_KARDEX_MOVEMENT_FILTERS);
      props.onClear();
   }; 

   return (
      <form 
         className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-5"
         onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex w-full flex-wrap items-start gap-4 lg:flex-1 lg:gap-6">
            <div className="w-full sm:w-64">
               <Controller
                  name="category_id"
                  control={control}
                  render={({ field }) => (
                     <Dropdown
                        isLoading={isPending || isFetching}
                        label="Tipo Movimiento"
                        value={field.value}
                        options={momentTypeOptions}
                        onChange={(e) => {
                           field.onChange(e);
                        }}
                        placeholder="Seleccionar Tipo Movimiento"
                        appearance="dark"
                        labelClassName={labelClassName}
                        className={dropdownClassName}
                     />
                  )}
               />

            </div>

            <div className="w-full sm:w-64">
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

            <div className="w-full sm:w-64">
               <InputText
                  label="Codigo producto"
                  placeholder="ALP-MGA-01-01-001"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("product_code")}
               />
            </div>
         </div>
         
         <section 
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-5"
         >
            <div className="flex w-full flex-col sm:w-auto">
               <Button
                  icon={<Filter size={15} />}
                  type="submit"
                  size="giant"
                  className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                  label="Aplicar filtros"
                  disabled={!isDirty || !isValid}
               />
            </div>

            <div className="flex w-full flex-col sm:w-auto">
               <Button
                  icon={<FilterX size={15} />}
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