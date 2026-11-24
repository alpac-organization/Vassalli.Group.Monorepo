import { Controller, useForm, useWatch } from "react-hook-form";
import { Button, DatePicker, Dropdown, type DatePickerValue } from "@alpac/design-system";
import { Filter, FilterX } from "lucide-react";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { CategoryType } from "@app/modules/product/domain/enums/category-type.enum";
import { ProductUsageType } from "@app/core/enums/product-usage-type.enum";
import { RoleEnum } from "@app/core/enums/role.enum";
import { useEquipment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useEquipment";

import { GetBranchesOptions, GetProductCategoryOptions } from "@app/modules/Inventory/ui/pages/inventory-control/views/stock-control/stock-control.variants";
import { dropdownClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style";

export interface OutputsByEquipmentReportFiltersValues {
   from: DatePickerValue | null;
   to: DatePickerValue | null;
   branch_id?: string;
   category_ids?: string[];
   equipment_ids?: string[];
   product_ids?: string[];
}

export const OutputsByEquipmentReportFilters = function (props: {
   filters: OutputsByEquipmentReportFiltersValues;
   onApply: (filters: OutputsByEquipmentReportFiltersValues) => void;
   onClear: () => void;
   applyLabel?: string;
   forceEnableApply?: boolean;
}) {
   const { control, handleSubmit, reset, getValues, setValue, formState: { isDirty, isValid } } = useForm<OutputsByEquipmentReportFiltersValues>({
      defaultValues: props.filters,
   });

   const { companyId, moduleCode, role, branchId } = useUserStore();

   const { GetBranchesQuery } = useCompanies({ company_id: companyId });
   const branchesOptions = GetBranchesOptions(GetBranchesQuery.data ?? []);

   const { GetProductCategories, GetProducts } = useProduct({
      getProductCategoryPayload: {
         company_id: companyId,
         module_code: moduleCode,
         category_type: CategoryType.Operational.textValue,
      },
      getProductPayload: {
         company_id: companyId,
         module_code: moduleCode,
         product_usage_type: ProductUsageType.Operational.stringValue,
         page_size: 100,
      },
   });
   const categoryOptions = GetProductCategoryOptions(GetProductCategories.data ?? []);
   const products = GetProducts.data?.data ?? [];
   const selectedCategoryIds = useWatch({ control, name: "category_ids" }) ?? [];
   const productOptions = products
      .filter((product) =>
         selectedCategoryIds.length === 0 || selectedCategoryIds.includes(product.category_id),
      )
      .map((product) => ({
         label: `${product.code} | ${product.product_name}`,
         value: product.product_id,
      }));

   const { GetEquipments } = useEquipment({
      company_id: companyId,
      module_code: moduleCode,
   });
   const equipmentOptions = (GetEquipments.data?.data ?? []).map((equipment) => ({
      label: `${equipment.equipment_code} | ${equipment.equipment_brand} | ${equipment.equipment_model}`,
      value: equipment.equipment_id,
   }));

   const handleCategoryChange = (value: unknown) => {
      const nextCategoryIds: string[] = Array.isArray(value)
         ? value.filter((item): item is string => typeof item === "string")
         : typeof value === "string"
            ? [value]
            : [];

      const allowedProductIds = new Set(
         products
            .filter((product) =>
               nextCategoryIds.length === 0 || nextCategoryIds.includes(product.category_id),
            )
            .map((product) => product.product_id),
      );

      const currentProductIds = getValues("product_ids") ?? [];
      setValue(
         "product_ids",
         currentProductIds.filter((productId) => allowedProductIds.has(productId)),
         { shouldDirty: true },
      );

      return nextCategoryIds;
   };

   const onSubmit = (values: OutputsByEquipmentReportFiltersValues) => {
      props.onApply(values);
      reset(values);
   };

   const handleClear = () => {
      reset({
         from: null,
         to: null,
         branch_id: branchId,
         category_ids: [],
         equipment_ids: [],
         product_ids: [],
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
                        label="Desde"
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
                        label="Hasta"
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
                  name="category_ids"
                  control={control}
                  rules={{
                     validate: (value) =>
                        (value?.length ?? 0) > 0 || "Debe seleccionar al menos una categoría.",
                  }}
                  render={({ field }) => (
                     <Dropdown
                        isLoading={GetProductCategories.isPending || GetProductCategories.isFetching}
                        label="Categoría"
                        multiple
                        value={field.value ?? []}
                        options={categoryOptions}
                        onChange={(e) => field.onChange(handleCategoryChange(e))}
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
                  name="equipment_ids"
                  control={control}
                  render={({ field }) => (
                     <Dropdown
                        isLoading={GetEquipments.isPending || GetEquipments.isFetching}
                        label="Equipo"
                        multiple
                        value={field.value ?? []}
                        options={equipmentOptions}
                        onChange={(e) => field.onChange(e)}
                        placeholder="Seleccionar Equipo"
                        appearance="dark"
                        labelClassName={labelClassName}
                        className={dropdownClassName}
                     />
                  )}
               />
            </div>

            <div className="w-full">
               <Controller
                  name="product_ids"
                  control={control}
                  render={({ field }) => (
                     <Dropdown
                        isLoading={GetProducts.isPending || GetProducts.isFetching}
                        label="Producto / Suministro"
                        multiple
                        value={field.value ?? []}
                        options={productOptions}
                        onChange={(e) => field.onChange(e)}
                        placeholder="Seleccionar Producto"
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
