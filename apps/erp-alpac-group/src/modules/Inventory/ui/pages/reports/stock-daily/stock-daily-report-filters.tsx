import { Controller, useForm } from "react-hook-form";
import { Button, Dropdown, InputText } from "@alpac/design-system";
import { Filter, FilterX } from "lucide-react";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import { useCostCenters } from "@app/modules/admin/ui/hooks/cost-centers/useCostCenters";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";

import { GetBranchesOptions, GetCostCenterOptions, GetProductCategoryOptions } from "@app/modules/Inventory/ui/pages/inventory-control/views/stock-control/stock-control.variants";
import { dropdownClassName, inputClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style";

export interface StockDailyReportFiltersValues {
   branch_ids?: string[];
   area_ids?: string[];
   cost_center_ids?: string[];
   category_ids?: string[];
   usage_types?: string[];
   product_code?: string;
   product_name?: string;
}

export const StockDailyReportFilters = function (props: {
   filters: StockDailyReportFiltersValues;
   onApply: (filters: StockDailyReportFiltersValues) => void;
   onClear: () => void;
   applyLabel?: string;
   forceEnableApply?: boolean;
}) {
   const { control, handleSubmit, reset, register, formState: { isDirty, isValid } } = useForm<StockDailyReportFiltersValues>({
      defaultValues: props.filters,
   });

   const { companyId, moduleCode } = useUserStore();

   const { GetBranchesQuery } = useCompanies({ company_id: companyId });
   const branchesOptions = GetBranchesOptions(GetBranchesQuery.data ?? []);

   const { GetAreasByCompany } = useAreas({ company_id: companyId, module_code: moduleCode });
   const areaOptions = (GetAreasByCompany.data ?? []).map((area) => ({
      label: area.work_area_name,
      value: area.work_area_id,
   }));

   const { GetCostCentersByBranch } = useCostCenters({
      getCostCentersByBranchPayload: {
         company_id: companyId,
         module_code: moduleCode,
      },
   });
   const costCenterOptions = GetCostCenterOptions(GetCostCentersByBranch.data ?? []);

   const { GetProductCategories } = useProduct({
      getProductCategoryPayload: {
         company_id: companyId,
         module_code: moduleCode,
      },
   });
   const categoryOptions = GetProductCategoryOptions(GetProductCategories.data ?? []);

   const onSubmit = (values: StockDailyReportFiltersValues) => {
      props.onApply(values);
      reset(values);
   };

   const handleClear = () => {
      reset({
         product_code: "",
         product_name: "",
         branch_ids: [],
         area_ids: [],
         cost_center_ids: [],
         category_ids: [],
         usage_types: [],
      });
      props.onClear();
   };

   return (
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="w-full">
               <Controller
                  name="branch_ids"
                  control={control}
                  render={({ field }) => (
                     <Dropdown
                        isLoading={GetBranchesQuery.isPending || GetBranchesQuery.isFetching}
                        label="Sucursal"
                        multiple
                        value={field.value ?? []}
                        options={branchesOptions}
                        onChange={(e) => field.onChange(e)}
                        placeholder="Seleccionar Sucursal"
                        appearance="dark"
                        labelClassName={labelClassName}
                        className={dropdownClassName}
                     />
                  )}
               />
            </div>

            <div className="w-full">
               <Controller
                  name="area_ids"
                  control={control}
                  render={({ field }) => (
                     <Dropdown
                        isLoading={GetAreasByCompany.isPending || GetAreasByCompany.isFetching}
                        label="Área"
                        multiple
                        value={field.value ?? []}
                        options={areaOptions}
                        onChange={(e) => field.onChange(e)}
                        placeholder="Seleccionar Área"
                        appearance="dark"
                        labelClassName={labelClassName}
                        className={dropdownClassName}
                     />
                  )}
               />
            </div>

            <div className="w-full">
               <Controller
                  name="cost_center_ids"
                  control={control}
                  render={({ field }) => (
                     <Dropdown
                        isLoading={GetCostCentersByBranch.isPending || GetCostCentersByBranch.isFetching}
                        label="Centro de costo"
                        multiple
                        value={field.value ?? []}
                        options={costCenterOptions}
                        onChange={(e) => field.onChange(e)}
                        placeholder="Seleccionar centro de costo"
                        appearance="dark"
                        labelClassName={labelClassName}
                        className={dropdownClassName}
                     />
                  )}
               />
            </div>

            <div className="w-full">
               <Controller
                  name="category_ids"
                  control={control}
                  render={({ field }) => (
                     <Dropdown
                        isLoading={GetProductCategories.isPending || GetProductCategories.isFetching}
                        label="Categoría"
                        multiple
                        value={field.value ?? []}
                        options={categoryOptions}
                        onChange={(e) => field.onChange(e)}
                        placeholder="Seleccionar Categoría"
                        appearance="dark"
                        labelClassName={labelClassName}
                        className={dropdownClassName}
                     />
                  )}
               />
            </div>

            <div className="w-full">
               <Controller
                  name="usage_types"
                  control={control}
                  render={({ field }) => (
                     <Dropdown
                        label="Tipo de uso"
                        multiple
                        value={field.value ?? []}
                        options={[
                           { label: "Administrativo", value: "Administrative" },
                           { label: "Operacional", value: "Operational" },
                        ]}
                        onChange={(e) => field.onChange(e)}
                        placeholder="Seleccionar tipo de uso"
                        appearance="dark"
                        labelClassName={labelClassName}
                        className={dropdownClassName}
                     />
                  )}
               />
            </div>

            <div className="w-full">
               <InputText
                  label="Código"
                  placeholder="ALP-MGA-01-01-001"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("product_code")}
               />
            </div>

            <div className="w-full">
               <InputText
                  label="Nombre"
                  placeholder="Nombre producto"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("product_name")}
               />
            </div>
         </div>

         <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end sm:gap-5">
            <Button
               icon={<Filter size={15} />}
               type="submit"
               size="giant"
               className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:w-auto!"
               label={props.applyLabel ?? "Generar"}
               disabled={props.forceEnableApply ? false : (!isDirty || !isValid)}
            />
            <Button
               icon={<FilterX size={15} />}
               type="button"
               size="giant"
               className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:w-auto!"
               label="Limpiar"
               onClick={handleClear}
            />
         </div>
      </form>
   );
};