import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
   Alert,
   Badges,
   Button,
   InputText,
   MetricCard,
   Modal,
   SectionHeader,
} from "@alpac/design-system";
import {
   ArrowDownIcon,
   ArrowUpIcon,
   LandmarkIcon,
   PackageIcon,
   RulerIcon,
} from "lucide-react";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { InventoryStockStatus } from "@app/core/enums/inventory-stock-status.enum";
import { ProductStatus } from "@app/core/enums/product-status.enum";
import { ProductUsageType } from "@app/core/enums/product-usage-type.enum";
import { useInventoryStocks } from "@app/modules/Inventory/ui/hooks/useInventoryStocks";
import {
   inputClassName,
   labelClassName,
} from "@app/modules/purchasing/ui/pages/supplier/utils/style";
import {
   buttonActionClass,
   buttonCancelClass,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/generate-exit-modal/utils/style.exit-modal";
import { InventoryStockStatusColorBadges } from "../../stock-control.variants";
import {
   parseStockInput,
   validateMaximumStock,
   validateMinimumStock,
} from "./edit-stock-modal.rules";

import type { KeyboardEvent } from "react";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { InventoryStockStatusEnum } from "@app/core/enums/inventory-stock-status.enum";
import type { EditStockModalProps } from "./edit-stock-modal.types";

const BLOCKED_NUMBER_KEYS = new Set(["e", "E", "+"]);
const ICON_CLASS = "text-slate-500 dark:text-slate-300";
const CATEGORY_BADGE_COLOR =
   "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
const CODE_BADGE_COLOR =
   "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700";

const NUMBER_FORMATTER = new Intl.NumberFormat("es-NI", {
   minimumFractionDigits: 0,
   maximumFractionDigits: 2,
});

interface EditStockFormValues {
   minimum_stock: string;
   maximum_stock: string;
}

const preventScientificKeys = (event: KeyboardEvent<HTMLInputElement>) => {
   if (BLOCKED_NUMBER_KEYS.has(event.key)) {
      event.preventDefault();
   }
};

export const EditStockModal = function (props: EditStockModalProps) {
   const {
      isOpen = false,
      onClose = () => {},
      stockSelected,
      handleRequestSuccess,
      handleRequestError,
   } = props;

   const { companyId, moduleCode } = useUserStore();
   const { getMappedError } = useMappedError();
   const { PatchInventoryStock } = useInventoryStocks({});
   const [submitError, setSubmitError] = useState<string | null>(null);

   const {
      control,
      register,
      handleSubmit,
      getValues,
      formState: { errors },
   } = useForm<EditStockFormValues>({
      mode: "all",
      reValidateMode: "onChange",
      defaultValues: {
         minimum_stock:
            stockSelected?.minimum_stock !== undefined &&
            stockSelected?.minimum_stock !== null
               ? String(stockSelected.minimum_stock)
               : "",
         maximum_stock:
            stockSelected?.maximum_stock && stockSelected.maximum_stock > 0
               ? String(stockSelected.maximum_stock)
               : "",
      },
   });

   const watchedMinimum = useWatch({ control, name: "minimum_stock" });

   const product = stockSelected?.product_information ?? null;
   const costCenter = stockSelected?.cost_center_information ?? null;
   const unit = stockSelected?.unit_measure_information ?? null;

   const isOperational =
      product?.product_usage_type === ProductUsageType.Operational.stringValue;
   const isActive =
      !product?.product_status ||
      product.product_status === ProductStatus.Active.stringValue;
   const canEditProduct = Boolean(stockSelected && isOperational && isActive);

   const restrictionMessage = useMemo(() => {
      if (!product) return null;

      if (!isOperational) {
         return "Solo se pueden editar los niveles de stock de productos operacionales.";
      }

      if (!isActive) {
         const statusLabel = product.product_status
            ? (ProductStatus[product.product_status]?.label ?? product.product_status)
            : "No activo";
         return `Este producto tiene estado "${statusLabel}". Solo se pueden editar los niveles de stock de productos activos.`;
      }

      return null;
   }, [product, isOperational, isActive]);

   const projectedStatus = useMemo<InventoryStockStatusEnum | null>(() => {
      if (!stockSelected) return null;

      const parsedMin = parseStockInput(watchedMinimum);
      const effectiveMin =
         parsedMin !== undefined && !Number.isNaN(parsedMin) && parsedMin >= 0
            ? parsedMin
            : stockSelected.minimum_stock;

      if (stockSelected.available_quantity <= 0) return "Empty";
      if (stockSelected.available_quantity <= effectiveMin) return "LowBalance";
      return "Stable";
   }, [stockSelected, watchedMinimum]);

   if (!stockSelected || !product) return null;

   const formatWithUnit = (value?: number | null) => {
      if (value === null || value === undefined) return "—";
      const formatted = NUMBER_FORMATTER.format(value);
      return unit?.symbol ? `${formatted} ${unit.symbol}` : formatted;
   };

   const handleClose = () => {
      if (PatchInventoryStock.isPending) return;
      onClose();
   };

   const onSubmit = async (values: EditStockFormValues) => {
      if (!canEditProduct) {
         setSubmitError(
            restrictionMessage ??
               "Solo se pueden editar los niveles de stock de productos operacionales y activos.",
         );
         return;
      }

      const minimumStock = parseStockInput(values.minimum_stock);
      const maximumStock = parseStockInput(values.maximum_stock);

      if (minimumStock === undefined && maximumStock === undefined) {
         setSubmitError("Debe proporcionar al menos el stock mínimo o el stock máximo.");
         return;
      }

      try {
         setSubmitError(null);

         await PatchInventoryStock.mutateAsync({
            company_id: companyId,
            module_code: moduleCode,
            inventory_stock_id: stockSelected.product_stock_id,
            ...(minimumStock !== undefined ? { minimum_stock: minimumStock } : {}),
            ...(maximumStock !== undefined ? { maximum_stock: maximumStock } : {}),
         });

         handleRequestSuccess?.(
            `Los niveles de stock de "${product.product_name}" fueron actualizados correctamente.`,
         );
         onClose();
      } catch (error) {
         const mapped = getMappedError(error as ApiErrorResponse);
         setSubmitError(mapped.description);
         handleRequestError?.(mapped.description);
      }
   };

   return (
      <Modal
         isOpen={isOpen}
         title="Editar niveles de stock"
         onClose={handleClose}
         size="2xl"
         variant="form"
         description="Edita los niveles de stock para tener controlados los niveles mínimos para alertas."
      >
         <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
         >
            <SectionHeader
               title={product.product_name}
               subtitle={product.description ?? undefined}
            >
               <Badges label={product.product_code} color={CODE_BADGE_COLOR} />
               <Badges
                  label={product.category_information.name}
                  color={CATEGORY_BADGE_COLOR}
               />
               {product.product_status && ProductStatus[product.product_status] && (
                  <Badges
                     label={ProductStatus[product.product_status].label}
                     color={ProductStatus[product.product_status].colorBadge}
                  />
               )}
               {projectedStatus && (
                  <Badges
                     label={InventoryStockStatus[projectedStatus]?.label ?? projectedStatus}
                     color={InventoryStockStatusColorBadges[projectedStatus]}
                  />
               )}
            </SectionHeader>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
               <MetricCard
                  size="compact"
                  title="Disponible actual"
                  value={formatWithUnit(stockSelected.available_quantity)}
                  icon={<PackageIcon size={14} />}
                  themeClass="bg-sky-500"
               />
               <MetricCard
                  size="compact"
                  title="Stock mínimo actual"
                  value={formatWithUnit(stockSelected.minimum_stock)}
                  icon={<ArrowDownIcon size={14} />}
                  themeClass="bg-amber-500"
               />
               <MetricCard
                  size="compact"
                  title="Stock máximo actual"
                  value={
                     stockSelected.maximum_stock > 0
                        ? formatWithUnit(stockSelected.maximum_stock)
                        : "—"
                  }
                  icon={<ArrowUpIcon size={14} />}
                  themeClass="bg-emerald-500"
               />
            </div>

            <SectionHeader
               title="Ubicación y medida"
               subtitle="Centro de costo y unidad asignados al producto."
               hasBorder
            >
               <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  <DetailField
                     label="Centro de costo"
                     value={costCenter?.cost_center_name ?? "—"}
                     description={
                        costCenter?.cost_center_code
                           ? `Código: ${costCenter.cost_center_code}`
                           : undefined
                     }
                     icon={<LandmarkIcon size={18} className={ICON_CLASS} aria-hidden />}
                  />
                  <DetailField
                     label="Unidad de medida"
                     value={unit?.name ?? "—"}
                     description={unit?.symbol ? `Símbolo: ${unit.symbol}` : undefined}
                     icon={<RulerIcon size={18} className={ICON_CLASS} aria-hidden />}
                  />
               </div>
            </SectionHeader>

            {restrictionMessage ? (
               <Alert
                  type="warning"
                  title="Edición restringida"
                  message={restrictionMessage}
               />
            ) : (
               <Alert
                  type="warning"
                  title="Alertas de stock"
                  message="Recibirás una alerta cuando las existencias de este producto estén por debajo del stock mínimo configurado."
               />
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
               <InputText
                  label="Stock mínimo"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="Ej: 10"
                  isRequired
                  suffix={unit?.symbol}
                  error={errors.minimum_stock?.message}
                  errorVariant="text"
                  aria-invalid={Boolean(errors.minimum_stock)}
                  onKeyDown={preventScientificKeys}
                  className={inputClassName}
                  labelClassName={labelClassName}
                  disabled={!canEditProduct || PatchInventoryStock.isPending}
                  {...register("minimum_stock", {
                     deps: ["maximum_stock"],
                     onChange: () => setSubmitError(null),
                     validate: validateMinimumStock,
                  })}
               />

               <InputText
                  label="Stock máximo"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="Ej: 100"
                  suffix={unit?.symbol}
                  error={errors.maximum_stock?.message}
                  errorVariant="text"
                  aria-invalid={Boolean(errors.maximum_stock)}
                  onKeyDown={preventScientificKeys}
                  className={inputClassName}
                  labelClassName={labelClassName}
                  disabled={!canEditProduct || PatchInventoryStock.isPending}
                  {...register("maximum_stock", {
                     deps: ["minimum_stock"],
                     onChange: () => setSubmitError(null),
                     validate: (value) =>
                        validateMaximumStock({
                           value,
                           minimumStockInput: getValues("minimum_stock"),
                           currentMinimumStock: stockSelected.minimum_stock,
                           currentMaximumStock: stockSelected.maximum_stock,
                        }),
                  })}
               />
            </div>

            {submitError && (
               <Alert
                  type="error"
                  title="No se pudo actualizar"
                  message={submitError}
               />
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
               <Button
                  type="button"
                  label="Cancelar"
                  onClick={handleClose}
                  disabled={PatchInventoryStock.isPending}
                  className={buttonCancelClass}
               />

               <Button
                  type="submit"
                  label="Guardar cambios"
                  isLoading={PatchInventoryStock.isPending}
                  disabled={!canEditProduct || PatchInventoryStock.isPending}
                  className={buttonActionClass}
               />
            </div>
         </form>
      </Modal>
   );
};
