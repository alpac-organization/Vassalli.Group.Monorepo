import { Controller, useForm } from "react-hook-form";
import { Button, DatePicker, Dropdown } from "@alpac/design-system";
import type { DatePickerValue } from "@alpac/design-system";
import { Filter, FilterX } from "lucide-react";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { useCostCenters } from "@app/modules/admin/ui/hooks/cost-centers/useCostCenters";
import { RoleEnum } from "@app/core/enums/role.enum";

import { GetBranchesOptions, GetCostCenterOptions } from "@app/modules/Inventory/ui/pages/inventory-control/views/stock-control/stock-control.variants";
import { dropdownClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style";

export interface InventoryPeriodReportFiltersValues {
   from: DatePickerValue | null;
   to: DatePickerValue | null;
   branch_id?: string;
   cost_center_id?: string;
}

export const InventoryPeriodReportFilters = function (props: {
   filters: InventoryPeriodReportFiltersValues;
   onApply: (filters: InventoryPeriodReportFiltersValues) => void;
   onClear: () => void;
}) {
   const { companyId, moduleCode, role, branchId } = useUserStore();

   const { control, handleSubmit, reset } = useForm<InventoryPeriodReportFiltersValues>({
      defaultValues: {
         ...props.filters,
         branch_id: props.filters.branch_id ?? branchId,
      },
   });

   const { GetBranchesQuery } = useCompanies({ company_id: companyId });
   const branchesOptions = GetBranchesOptions(GetBranchesQuery.data ?? []);

   const { GetCostCentersByBranch } = useCostCenters({
      getCostCentersByBranchPayload: {
         company_id: companyId,
         module_code: moduleCode,
      },
   });
   const costCenterOptions = GetCostCenterOptions(GetCostCentersByBranch.data ?? []);

   const onSubmit = (values: InventoryPeriodReportFiltersValues) => {
      props.onApply(values);
      reset(values);
   };

   const handleClear = () => {
      reset({
         from: null,
         to: null,
         branch_id: branchId,
         cost_center_id: undefined,
      });
      props.onClear();
   };

   return (
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="w-full">
               <Controller
                  name="from"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                     <DatePicker
                        label="Fecha de inicio"
                        labelAbove
                        isRequired
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                        labelClassName={labelClassName}
                        className={dropdownClassName}
                     />
                  )}
               />
            </div>

            <div className="w-full">
               <Controller
                  name="to"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                     <DatePicker
                        label="Fecha fin"
                        labelAbove
                        isRequired
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                        labelClassName={labelClassName}
                        className={dropdownClassName}
                     />
                  )}
               />
            </div>

            <div className="w-full">
               <Controller
                  name="branch_id"
                  control={control}
                  rules={{
                     validate: (value) =>
                        role !== RoleEnum.ADMINISTRATOR || Boolean(value) || "Debe seleccionar la sucursal.",
                  }}
                  render={({ field }) => (
                     <Dropdown
                        isLoading={GetBranchesQuery.isPending || GetBranchesQuery.isFetching}
                        label="Sucursal"
                        isRequired={role === RoleEnum.ADMINISTRATOR}
                        value={field.value ?? ""}
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
                  name="cost_center_id"
                  control={control}
                  render={({ field }) => (
                     <Dropdown
                        isLoading={GetCostCentersByBranch.isPending || GetCostCentersByBranch.isFetching}
                        label="Centro de costo"
                        value={field.value ?? ""}
                        options={costCenterOptions}
                        onChange={(e) => field.onChange(e)}
                        placeholder="Todos los centros de costo"
                        appearance="dark"
                        labelClassName={labelClassName}
                        className={dropdownClassName}
                     />
                  )}
               />
            </div>
         </div>

         <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end sm:gap-5">
            <Button
               icon={<Filter size={15} />}
               type="submit"
               size="giant"
               className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:w-auto!"
               label="Generar"
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
