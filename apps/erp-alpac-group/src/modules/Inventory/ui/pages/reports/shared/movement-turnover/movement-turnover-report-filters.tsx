import { useState } from "react";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { Button, DatePicker, Dropdown, InputText } from "@alpac/design-system";
import type { DatePickerValue } from "@alpac/design-system";
import { Filter, FilterX } from "lucide-react";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { useCostCenters } from "@app/modules/admin/ui/hooks/cost-centers/useCostCenters";
import { RoleEnum } from "@app/core/enums/role.enum";
import {
   GetBranchesOptions,
   GetCostCenterOptions,
} from "@app/modules/Inventory/ui/pages/inventory-control/views/stock-control/stock-control.variants";
import {
   dropdownClassName,
   inputClassName,
   labelClassName,
} from "@app/modules/purchasing/ui/pages/supplier/utils/style";

export interface MovementTurnoverReportFiltersValues {
   from: DatePickerValue | null;
   to: DatePickerValue | null;
   branch_id?: string;
   cost_center_id?: string;
   product_code?: string;
}

export const MovementTurnoverReportFilters = function (props: {
   filters: MovementTurnoverReportFiltersValues;
   onApply: (filters: MovementTurnoverReportFiltersValues) => void;
   onClear: () => void;
}) {
   const [dateError, setDateError] = useState<string | null>(null);
   const { companyId, moduleCode, role, branchId } = useUserStore();

   const isAdministrator = role === RoleEnum.ADMINISTRATOR;
   const isManager = role === RoleEnum.MANAGER;
   const canFilterByCostCenter = isAdministrator || isManager;

   const { control, handleSubmit, register, reset } =
      useForm<MovementTurnoverReportFiltersValues>({
         defaultValues: {
            ...props.filters,
            branch_id: isAdministrator
               ? (props.filters.branch_id ?? branchId)
               : undefined,
         },
      });

   const { GetBranchesQuery } = useCompanies({
      company_id: isAdministrator ? companyId : "",
   });
   const branchesOptions = GetBranchesOptions(GetBranchesQuery.data ?? []);

   const { GetCostCentersByBranch } = useCostCenters({
      getCostCentersByBranchPayload: canFilterByCostCenter
         ? {
              company_id: companyId,
              module_code: moduleCode,
              ...(isManager ? { only_operational: true } : {}),
           }
         : undefined,
   });
   const costCenterOptions = GetCostCenterOptions(
      GetCostCentersByBranch.data ?? [],
   );

   const onSubmit = (values: MovementTurnoverReportFiltersValues) => {
      if (values.from && values.to) {
         const rawFrom =
            typeof values.from === "object" && "$d" in values.from
               ? values.from.$d
               : values.from;
         const rawTo =
            typeof values.to === "object" && "$d" in values.to
               ? values.to.$d
               : values.to;

         const fromDate = dayjs(rawFrom as dayjs.ConfigType);
         const toDate = dayjs(rawTo as dayjs.ConfigType);

         if (fromDate.isValid() && toDate.isValid() && fromDate.isAfter(toDate, "day")) {
            setDateError("La fecha de inicio no puede ser mayor que la fecha fin.");
            return;
         }
      }

      const sanitized: MovementTurnoverReportFiltersValues = {
         from: values.from,
         to: values.to,
         branch_id: isAdministrator ? values.branch_id : undefined,
         cost_center_id: canFilterByCostCenter ? values.cost_center_id : undefined,
         product_code: values.product_code?.trim() || undefined,
      };

      setDateError(null);
      props.onApply(sanitized);
      reset(sanitized);
   };

   const handleClear = () => {
      setDateError(null);
      reset({
         from: null,
         to: null,
         branch_id: isAdministrator ? branchId : undefined,
         cost_center_id: undefined,
         product_code: "",
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
                        format="DD/MM/YYYY"
                        value={field.value}
                        onChange={(value) => {
                           field.onChange(value);
                           setDateError(null);
                        }}
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
                        format="DD/MM/YYYY"
                        value={field.value}
                        onChange={(value) => {
                           field.onChange(value);
                           setDateError(null);
                        }}
                        labelClassName={labelClassName}
                        className={dropdownClassName}
                     />
                  )}
               />
            </div>

            {isAdministrator && (
               <div className="w-full">
                  <Controller
                     name="branch_id"
                     control={control}
                     rules={{
                        validate: (value) =>
                           Boolean(value) || "Debe seleccionar la sucursal.",
                     }}
                     render={({ field }) => (
                        <Dropdown
                           isLoading={
                              GetBranchesQuery.isPending ||
                              GetBranchesQuery.isFetching
                           }
                           label="Sucursal"
                           isRequired
                           value={field.value ?? ""}
                           options={branchesOptions}
                           onChange={(value) =>
                              field.onChange(value ? String(value) : "")
                           }
                           placeholder="Seleccionar Sucursal"
                           appearance="dark"
                           labelClassName={labelClassName}
                           className={dropdownClassName}
                        />
                     )}
                  />
               </div>
            )}

            {canFilterByCostCenter && (
               <div className="w-full">
                  <Controller
                     name="cost_center_id"
                     control={control}
                     render={({ field }) => (
                        <Dropdown
                           isLoading={
                              GetCostCentersByBranch.isPending ||
                              GetCostCentersByBranch.isFetching
                           }
                           label="Centro de costo"
                           value={field.value ?? ""}
                           options={costCenterOptions}
                           onChange={(value) =>
                              field.onChange(value ? String(value) : "")
                           }
                           placeholder="Todos los centros de costo"
                           appearance="dark"
                           labelClassName={labelClassName}
                           className={dropdownClassName}
                        />
                     )}
                  />
               </div>
            )}

            <div className="w-full">
               <InputText
                  label="Código de producto"
                  placeholder="Ej. 117-09-3-005"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("product_code")}
               />
            </div>
         </div>

         {dateError && (
            <p className="text-[13px] text-red-500 dark:text-red-400" role="alert">
               {dateError}
            </p>
         )}

         <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end sm:gap-5">
            <Button
               icon={<Filter size={15} />}
               type="submit"
               size="giant"
               className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:w-auto!"
               label="Generar PDF"
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
