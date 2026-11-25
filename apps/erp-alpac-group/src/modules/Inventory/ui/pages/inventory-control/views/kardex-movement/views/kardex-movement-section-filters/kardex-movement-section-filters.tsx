import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Filter, FilterX } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button, DatePicker, Dropdown, InputText } from "@alpac/design-system";
import {
   dropdownClassName,
   inputClassName,
   labelClassName,
} from "@app/modules/purchasing/ui/pages/supplier/utils/style";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { useCostCenters } from "@app/modules/admin/ui/hooks/cost-centers/useCostCenters";
import {
   DEFAULT_KARDEX_MOVEMENT_FILTERS,
   getKardexTypeOptions,
   getMovementTypeOptions,
} from "../../kardex-movement.variants";
import {
   GetBranchesOptions,
   GetCostCenterOptions,
   GetProductCategoryOptions,
} from "../../../stock-control/stock-control.variants";

import type { KardexMovementSectionFiltersProps } from "./kardex-movement-section-filters.types";
import type { KardexMovementFilters } from "../../kardex-movements.types";
import type { KardexMovementTypeEnum } from "@app/core/enums/kardex-movement-type.enum";
import type { KardexTypeEnum } from "@app/core/enums/kardex-type.enum";

export const KardexMovementSectionFilters = function (
   props: KardexMovementSectionFiltersProps,
) {
   const [dateError, setDateError] = useState<string | null>(null);
   const { companyId, moduleCode, role } = useUserStore();

   const isAdministrator = role === "Administrator";
   const canFilterByCostCenter = isAdministrator || role === "Manager";

   const {
      control,
      handleSubmit,
      reset,
      register,
      formState: { isDirty, isValid },
   } = useForm<KardexMovementFilters>({
      defaultValues: props.filters,
   });

   useEffect(() => {
      reset(props.filters);
   }, [props.filters, reset]);

   const { GetProductCategories } = useProduct({
      getProductCategoryPayload: {
         company_id: companyId,
         module_code: moduleCode,
      },
   });

   const { GetBranchesQuery } = useCompanies({
      company_id: isAdministrator ? companyId : "",
   });

   const { GetCostCentersByBranch } = useCostCenters({
      getCostCentersByBranchPayload: canFilterByCostCenter
         ? {
              company_id: companyId,
              module_code: moduleCode,
           }
         : undefined,
   });

   const {
      isPending,
      isFetching,
      data: productCategoriesData,
   } = GetProductCategories;

   const categoryOptions = GetProductCategoryOptions(productCategoriesData ?? []);
   const movementTypeOptions = getMovementTypeOptions();
   const kardexTypeOptions = getKardexTypeOptions();
   const branchOptions = GetBranchesOptions(GetBranchesQuery.data ?? []);
   const costCenterOptions = GetCostCenterOptions(
      GetCostCentersByBranch.data ?? [],
   );

   const onSubmit = (values: KardexMovementFilters) => {
      if (values.date_from && values.date_to) {
         const from = dayjs(values.date_from as dayjs.ConfigType);
         const to = dayjs(values.date_to as dayjs.ConfigType);

         if (from.isValid() && to.isValid() && from.isAfter(to, "day")) {
            setDateError("La fecha desde no puede ser mayor que la fecha hasta.");
            return;
         }
      }

      setDateError(null);
      props.onApply(values);
      reset(values);
   };

   const handleClear = () => {
      setDateError(null);
      reset(DEFAULT_KARDEX_MOVEMENT_FILTERS);
      props.onClear();
   };

   return (
      <form
         className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-5"
         onSubmit={handleSubmit(onSubmit)}
      >
         <div className="flex w-full flex-wrap items-start gap-4 lg:flex-1 lg:gap-6">
            {isAdministrator && (
               <div className="w-full sm:w-64">
                  <Controller
                     name="branch_id"
                     control={control}
                     render={({ field }) => (
                        <Dropdown
                           isLoading={
                              GetBranchesQuery.isPending ||
                              GetBranchesQuery.isFetching
                           }
                           label="Sucursal"
                           value={field.value ?? ""}
                           options={branchOptions}
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
               <div className="w-full sm:w-64">
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
                           placeholder="Seleccionar centro de costo"
                           appearance="dark"
                           labelClassName={labelClassName}
                           className={dropdownClassName}
                        />
                     )}
                  />
               </div>
            )}

            <div className="w-full sm:w-64">
               <Controller
                  name="movement_type"
                  control={control}
                  render={({ field }) => (
                     <Dropdown
                        label="Tipo Movimiento"
                        value={field.value ?? ""}
                        options={movementTypeOptions}
                        onChange={(value) =>
                           field.onChange(
                              value ? (String(value) as KardexMovementTypeEnum) : null,
                           )
                        }
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
                  name="kardex_type"
                  control={control}
                  render={({ field }) => (
                     <Dropdown
                        label="Tipo Kardex"
                        value={field.value ?? ""}
                        options={kardexTypeOptions}
                        onChange={(value) =>
                           field.onChange(
                              value ? (String(value) as KardexTypeEnum) : null,
                           )
                        }
                        placeholder="Seleccionar Tipo Kardex"
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
                        value={field.value ?? ""}
                        options={categoryOptions}
                        onChange={(value) =>
                           field.onChange(value ? String(value) : "")
                        }
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

            <div className="w-full sm:w-64">
               <Controller
                  name="date_from"
                  control={control}
                  render={({ field }) => (
                     <DatePicker
                        label="Desde"
                        labelAbove
                        format="DD/MM/YYYY"
                        value={field.value ?? null}
                        onChange={(value) => {
                           field.onChange(value);
                           setDateError(null);
                        }}
                        className={inputClassName}
                        slotProps={{
                           popper: {
                              disablePortal: false,
                              sx: { zIndex: 2000 },
                           },
                        }}
                     />
                  )}
               />
            </div>

            <div className="w-full sm:w-64">
               <Controller
                  name="date_to"
                  control={control}
                  render={({ field }) => (
                     <DatePicker
                        label="Hasta"
                        labelAbove
                        format="DD/MM/YYYY"
                        value={field.value ?? null}
                        onChange={(value) => {
                           field.onChange(value);
                           setDateError(null);
                        }}
                        className={inputClassName}
                        slotProps={{
                           popper: {
                              disablePortal: false,
                              sx: { zIndex: 2000 },
                           },
                        }}
                     />
                  )}
               />
            </div>

            {dateError && (
               <p
                  className="w-full text-[13px] text-red-500 dark:text-red-400"
                  role="alert"
               >
                  {dateError}
               </p>
            )}
         </div>

         <section className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-5">
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
   );
};
