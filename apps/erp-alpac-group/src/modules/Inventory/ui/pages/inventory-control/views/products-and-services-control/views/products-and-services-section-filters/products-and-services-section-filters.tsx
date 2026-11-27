import { Filter, FilterX } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { Button, Dropdown, InputText } from "@alpac/design-system"
import { dropdownClassName, inputClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style"

import { useProduct } from "@app/modules/product/ui/hooks/useProduct"
import { CategoryType } from "@app/modules/product/domain/enums/category-type.enum"
import { useUserStore } from "@app/shared/stores/useUserStore"
import { DEFAULT_PRODUCT_FILTERS } from "../../products-and-services-control.variant"

import { BranchFilter } from "../../../stock-control/views/stock-control-section-filters/components/branch-filter/branch-filter"
import { statusOptions } from "./products-and-services-section-filters.options"
import { CostCenterFilter } from "../../../stock-control/views/stock-control-section-filters/components/cost-center-filter/cost-center-filter"
import { GetProductCategoryOptions } from "../../../stock-control/stock-control.variants"
import type { ProductsAndServicesFilters, ProductsAndServicesProps } from "./products-and-services-section-filters.types"

export const ProductsAndServicesSectionFilters = function(props: ProductsAndServicesProps){

   const { companyId, moduleCode, role } = useUserStore();

   const { control, handleSubmit, reset, formState: { isDirty, isValid }, register } = useForm({
      defaultValues: props.filters,
   });
   
   const { GetProductCategories } = useProduct({
      getProductCategoryPayload: { 
         company_id: companyId, 
         module_code: moduleCode,
         category_type: CategoryType.Operational.textValue,
      },
   });

   const { data: productCategoriesData } = GetProductCategories;
   const categoryOptions = GetProductCategoryOptions(productCategoriesData ?? []);
   //#endregion

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
         className="flex flex-col gap-5 w-full xl:flex-row xl:justify-between xl:items-end"
         onSubmit={handleSubmit(onSubmit)}
      >
         <div className="grid grid-cols-1 gap-4 w-full sm:grid-cols-2 lg:flex lg:flex-wrap lg:gap-6 lg:items-start xl:w-auto">

            <div className="w-full lg:w-64">
               <InputText
                  label="Codigo producto"
                  placeholder="ALP-MGA-01-01-001"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("product_code")}
               />
            </div>

            <div className="w-full lg:w-64">
               <Controller
                  name="category_product_id"
                  control={control}
                  render={({ field }) => (
                     <Dropdown
                        isLoading={GetProductCategories.isPending || GetProductCategories.isFetching}
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

            <div className="w-full lg:w-64">
               <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                     <Dropdown
                        label="Estado"
                        value={field.value ?? ""}
                        options={statusOptions}
                        onChange={(value) => field.onChange(value ? String(value) : undefined)}
                        placeholder="Seleccionar estado"
                        appearance="dark"
                        labelClassName={labelClassName}
                        className={dropdownClassName}
                     />
                  )}
               />
            </div>

            {
               role === "Administrator" && (
                  <BranchFilter control={control} />
               )
            }

            {
               (role === "Administrator" || role === "Manager") && (
                  <CostCenterFilter control={control} />
               )
            }
         </div>
         
         <section className="flex flex-col gap-3 w-full sm:flex-row sm:gap-5 xl:w-auto">
            <div className="flex flex-col w-full sm:flex-1 xl:flex-none xl:w-auto">
               <Button
                  icon={<Filter size={15} />}
                  type="submit"
                  size="giant"
                  className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                  label="Aplicar filtros"
                  disabled={!isDirty || !isValid}
               />
            </div>

            <div className="flex flex-col w-full sm:flex-1 xl:flex-none xl:w-auto">
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