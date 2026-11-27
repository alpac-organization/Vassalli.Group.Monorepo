import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button, DatePicker, Dropdown } from "@alpac/design-system";
import type { DatePickerValue } from "@alpac/design-system";
import { CheckSquare, FileSpreadsheet, FilterX } from "lucide-react";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { useCostCenters } from "@app/modules/admin/ui/hooks/cost-centers/useCostCenters";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { useInventoryStocks } from "@app/modules/Inventory/ui/hooks/useInventoryStocks";
import { CategoryType } from "@app/modules/product/domain/enums/category-type.enum";
import { RoleEnum } from "@app/core/enums/role.enum";
import {
   GetBranchesOptions,
   GetCostCenterOptions,
   GetProductCategoryOptions,
} from "@app/modules/Inventory/ui/pages/inventory-control/views/stock-control/stock-control.variants";
import {
   dropdownClassName,
   labelClassName,
} from "@app/modules/purchasing/ui/pages/supplier/utils/style";

export interface KardexReportFiltersValues {
   from: DatePickerValue | null;
   to: DatePickerValue | null;
   branch_id?: string;
   cost_center_id?: string;
   category_id?: string;
   product_stock_ids: string[];
}

export const KardexReportFilters = function (props: {
   filters: KardexReportFiltersValues;
   onApply: (filters: KardexReportFiltersValues) => void;
   onClear: () => void;
}) {
   const [formError, setFormError] = useState<string | null>(null);
   const { companyId, moduleCode, role, branchId } = useUserStore();

   const isAdministrator = role === RoleEnum.ADMINISTRATOR;
   const isManager = role === RoleEnum.MANAGER;
   const canFilterByCostCenter = isAdministrator || isManager;

   const { control, handleSubmit, reset, setValue, getValues } =
      useForm<KardexReportFiltersValues>({
         defaultValues: {
            ...props.filters,
            branch_id: isAdministrator
               ? (props.filters.branch_id ?? branchId)
               : undefined,
            product_stock_ids: props.filters.product_stock_ids ?? [],
         },
      });

   const selectedBranchId = useWatch({ control, name: "branch_id" });
   const selectedCostCenterId = useWatch({ control, name: "cost_center_id" });
   const selectedCategoryId = useWatch({ control, name: "category_id" });
   const selectedProductStockIds =
      useWatch({ control, name: "product_stock_ids" }) ?? [];

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

   const { GetProductCategories } = useProduct({
      getProductCategoryPayload: {
         company_id: companyId,
         module_code: moduleCode,
         category_type: CategoryType.Operational.textValue,
      },
   });
   const categoryOptions = GetProductCategoryOptions(
      GetProductCategories.data ?? [],
   );

   const effectiveBranchId = isAdministrator ? selectedBranchId : branchId;
   const canLoadStocks = Boolean(
      companyId && moduleCode && (!isAdministrator || effectiveBranchId),
   );

   const { GetInventoryStocksQuery } = useInventoryStocks({
      payloadGetInventoryStocksRequest: canLoadStocks
         ? {
              company_id: companyId,
              module_code: moduleCode,
              branch_id: isAdministrator
                 ? effectiveBranchId || undefined
                 : undefined,
              cost_center_id: canFilterByCostCenter
                 ? selectedCostCenterId || undefined
                 : undefined,
              category_id: selectedCategoryId || undefined,
              page_number: 1,
              page_size: 200,
           }
         : undefined,
   });

   const stockOptions = useMemo(() => {
      const stocks = GetInventoryStocksQuery.data?.data ?? [];
      return stocks.map((stock) => {
         const code = stock.product_information?.product_code ?? "—";
         const name = stock.product_information?.product_name ?? "Producto";
         const costCenter = stock.cost_center_information?.cost_center_name;
         return {
            value: stock.product_stock_id,
            label: costCenter
               ? `${code} | ${name} (${costCenter})`
               : `${code} | ${name}`,
         };
      });
   }, [GetInventoryStocksQuery.data?.data]);

   const handleSelectAllFilteredStocks = () => {
      const allIds = stockOptions.map((option) => option.value);
      setValue("product_stock_ids", allIds, {
         shouldDirty: true,
         shouldValidate: true,
      });
      setFormError(null);
   };

   const pruneSelectedStocks = (allowedIds?: Set<string>) => {
      if (!allowedIds) {
         setValue("product_stock_ids", [], { shouldDirty: true });
         return;
      }
      const current = getValues("product_stock_ids") ?? [];
      setValue(
         "product_stock_ids",
         current.filter((id) => allowedIds.has(id)),
         { shouldDirty: true },
      );
   };

   const onSubmit = (values: KardexReportFiltersValues) => {
      if (!values.from || !values.to) {
         setFormError("Debe especificar la fecha de inicio y la fecha fin.");
         return;
      }

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

      if (
         fromDate.isValid() &&
         toDate.isValid() &&
         fromDate.isAfter(toDate, "day")
      ) {
         setFormError(
            "La fecha de inicio no puede ser mayor que la fecha fin.",
         );
         return;
      }

      if (isAdministrator && !values.branch_id) {
         setFormError("Debe seleccionar la sucursal.");
         return;
      }

      if (!values.product_stock_ids || values.product_stock_ids.length === 0) {
         setFormError(
            "Debe seleccionar al menos un producto de inventario para generar el Kardex.",
         );
         return;
      }

      const sanitized: KardexReportFiltersValues = {
         from: values.from,
         to: values.to,
         branch_id: isAdministrator ? values.branch_id : undefined,
         cost_center_id: canFilterByCostCenter
            ? values.cost_center_id || undefined
            : undefined,
         category_id: values.category_id || undefined,
         product_stock_ids: values.product_stock_ids,
      };

      setFormError(null);
      props.onApply(sanitized);
      reset(sanitized);
   };

   const handleClear = () => {
      setFormError(null);
      reset({
         from: null,
         to: null,
         branch_id: isAdministrator ? branchId : undefined,
         cost_center_id: undefined,
         category_id: undefined,
         product_stock_ids: [],
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
                           setFormError(null);
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
                           setFormError(null);
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
                           onChange={(value) => {
                              field.onChange(value ? String(value) : "");
                              pruneSelectedStocks();
                              setFormError(null);
                           }}
                           placeholder="Seleccionar sucursal"
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
                           onChange={(value) => {
                              field.onChange(value ? String(value) : "");
                              pruneSelectedStocks();
                              setFormError(null);
                           }}
                           placeholder="Todos los centros de costo"
                           appearance="dark"
                           labelClassName={labelClassName}
                           className={dropdownClassName}
                        />
                     )}
                  />
               </div>
            )}

            <div className="w-full sm:col-span-2">
               <Controller
                  name="category_id"
                  control={control}
                  render={({ field }) => (
                     <Dropdown
                        isLoading={
                           GetProductCategories.isPending ||
                           GetProductCategories.isFetching
                        }
                        label="Línea / Categoría operacional (opcional)"
                        value={field.value ?? ""}
                        options={categoryOptions}
                        onChange={(value) => {
                           field.onChange(value ? String(value) : "");
                           pruneSelectedStocks();
                           setFormError(null);
                        }}
                        placeholder="Todas las líneas operacionales"
                        appearance="dark"
                        labelClassName={labelClassName}
                        className={dropdownClassName}
                     />
                  )}
               />
            </div>

            <div className="flex w-full flex-col gap-1.5 sm:col-span-2">
               <Controller
                  name="product_stock_ids"
                  control={control}
                  rules={{
                     validate: (value) =>
                        (value?.length ?? 0) > 0 ||
                        "Seleccione al menos un producto.",
                  }}
                  render={({ field }) => (
                     <Dropdown
                        isLoading={
                           GetInventoryStocksQuery.isPending ||
                           GetInventoryStocksQuery.isFetching
                        }
                        label="Producto(s) de inventario"
                        isRequired
                        multiple
                        value={field.value ?? []}
                        options={stockOptions}
                        onChange={(value) => {
                           const nextIds = Array.isArray(value)
                              ? value.filter(
                                   (item): item is string =>
                                      typeof item === "string",
                                )
                              : typeof value === "string" && value
                                ? [value]
                                : [];
                           field.onChange(nextIds);
                           setFormError(null);
                        }}
                        placeholder={
                           stockOptions.length === 0
                              ? "No hay productos en existencia con estos filtros"
                              : "Seleccione uno o más productos"
                        }
                        appearance="dark"
                        labelClassName={labelClassName}
                        className={dropdownClassName}
                     />
                  )}
               />

               {stockOptions.length > 0 && (
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                     <span>
                        {selectedProductStockIds.length} de{" "}
                        {stockOptions.length} producto
                        {stockOptions.length === 1 ? "" : "s"} seleccionado
                        {selectedProductStockIds.length === 1 ? "" : "s"}
                     </span>
                     {selectedProductStockIds.length < stockOptions.length && (
                        <button
                           type="button"
                           onClick={handleSelectAllFilteredStocks}
                           className="inline-flex cursor-pointer items-center gap-1 font-medium text-alpac-primary-600 hover:underline dark:text-alpac-primary-300"
                        >
                           <CheckSquare size={13} />
                           Seleccionar todos ({stockOptions.length})
                        </button>
                     )}
                  </div>
               )}
            </div>
         </div>

         {formError && (
            <p
               className="m-0 text-[13px] text-red-500 dark:text-red-400"
               role="alert"
            >
               {formError}
            </p>
         )}

         <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end sm:gap-4">
            <Button
               icon={<FileSpreadsheet size={16} />}
               type="submit"
               size="giant"
               className="w-full! rounded-md! bg-emerald-600! text-[15px]! text-white! hover:bg-emerald-700! dark:bg-emerald-700! dark:hover:bg-emerald-600! sm:w-auto!"
               label="Exportar Excel"
            />
            <Button
               icon={<FilterX size={15} />}
               type="button"
               size="giant"
               className="w-full! rounded-md! bg-slate-500! text-[15px]! text-white! dark:bg-slate-700! sm:w-auto!"
               label="Limpiar"
               onClick={handleClear}
            />
         </div>
      </form>
   );
};
