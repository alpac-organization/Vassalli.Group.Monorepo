import { useMemo, useState } from "react";
import {
  AccordionGroup,
  AccordionItem,
  Button,
  InputText,
  Textarea,
} from "@alpac/design-system";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { SelectProductModal } from "@app/modules/product/ui/views/select-product-modal/select-product-modal";
import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";
import {
  formatAmount,
  validateIntegerNumber,
  validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import type { PurchaseRequestDetailProps } from "./purchase-request-detail.types";
import { PurchaseRequestImageUploader } from "../purchase-request-image-uploader/purchase-request-image-uploader";
import type { CreatePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import { getProductUsageTypeByDestination } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";

const inputClassName =
  "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";
const addProductButtonClassName =
  "text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";
const removeProductButtonClassName =
  "h-8 w-8! shrink-0 rounded-md! bg-red-500! text-[13px]! text-white! hover:bg-red-800! dark:bg-red-900!";

const parseIntegerInput = (value: string): number | "" => {
  const formatted = formatAmount(value, 10, 0);
  const raw = formatted.replace(/,/g, "");
  return raw === "" ? "" : Number(raw);
};

const formatIntegerDisplay = (value: number | "" | undefined): string => {
  if (value === "" || value === undefined || value === null) return "";
  return formatAmount(String(value), 10, 0);
};

const hasUnitsPerPackage = (label?: string, symbol?: string) => {
  const unitLabel = label?.toLowerCase() ?? "";
  const unitSymbol = symbol?.toLowerCase() ?? "";

  return (
    unitLabel.includes("caja") ||
    unitLabel.includes("paquete") ||
    unitSymbol.includes("caja") ||
    unitSymbol.includes("paquete") ||
    unitSymbol === "cj" ||
    unitSymbol === "paq"
  );
};

const formatProductUnitDisplay = (
  name?: string | null,
  symbol?: string | null,
): string => {
  const cleanName = name?.trim() ?? "";
  const cleanSymbol = symbol?.trim() ?? "";
  if (cleanName && cleanSymbol) return `${cleanName} (${cleanSymbol})`;
  return cleanName || cleanSymbol || "Asociada al producto";
};

export const PurchaseRequestDetail = ({
  isRequisition,
  disableActions,
  lockItems = false,
  isEditMode = false,
  hasAttemptedSubmit = false,
}: PurchaseRequestDetailProps) => {
  const {
    costCenterId: userCostCenterId,
    branchId: userBranchId,
  } = useUserStore();
  const [isSelectProductOpen, setIsSelectProductOpen] = useState(false);
  const [closedProductIds, setClosedProductIds] = useState<string[]>([]);

  const {
    control,
    watch,
    clearErrors,
    trigger,
    formState: { errors },
  } = useFormContext<CreatePurchaseRequestPayload>();
  const destination = watch("destination");
  const formCostCenterId = watch("cost_center_id");
  const formBranchId = watch("branch_id");
  // aqui el se determina el uso del producto para filtrar el catálogo: en requisición depende del destino
  // interno → administrativo, service order → operacional);
  const productUsageType = isRequisition
    ? getProductUsageTypeByDestination(destination)
    : "Administrative";
  const effectiveCostCenterId =
    isRequisition && productUsageType === "Operational"
      ? (formCostCenterId?.trim() || userCostCenterId?.trim() || undefined)
      : undefined;
  const effectiveBranchId =
    isRequisition && productUsageType === "Operational"
      ? (formBranchId?.trim() || userBranchId?.trim() || undefined)
      : undefined;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "purchase_request_items",
  });

  const openProducts = useMemo(
    () =>
      fields
        .map((field) => field.id)
        .filter((id) => !closedProductIds.includes(id)),
    [fields, closedProductIds],
  );

  const handleSelectProduct = (products: GetProductResponse[]) => {
    const existingIds = new Set(fields.map((item) => item.product_id));

    products.forEach((product) => {
      if (existingIds.has(product.product_id)) return;

      append({
        product_id: product.product_id,
        product_name: product.product_name,
        description: "",
        quantity: 0,
        quantity_unit: 0,
        unit_measure_id:
          product.unit_measure_id ||
          product.unit_measure_information?.unit_measure_id ||
          "",
        unit_measure_name: product.unit_measure_information?.name ?? "",
        unit_measure_symbol: product.unit_measure_information?.symbol ?? "",
        justification: "",
        images: {
          images_product_to_changed: [],
        },
      });
    });

    clearErrors("purchase_request_items");
  };

  const assignedProductIds = useMemo(
    () =>
      fields
        .map((field) => field.product_id)
        .filter((id): id is string => Boolean(id)),
    [fields],
  );

  return (
    <div className="flex flex-col gap-3 border-t border-t-slate-300 pt-2 dark:border-t-neutral-600">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex flex-col">
          <span className="text-[15px] font-medium text-black dark:text-white">
            Productos solicitados
          </span>
          <small className="text-gray-500 dark:text-gray-300">
            {isEditMode
              ? "Puede agregar productos nuevos y editar la cantidad y datos de los existentes"
              : "Seleccione los productos y complete la cantidad solicitada"}
          </small>
        </div>

        {lockItems ? null : (
          <div className="shrink-0 self-stretch sm:self-auto">
            <Button
              type="button"
              size="medium"
              label="Agregar Producto"
              icon={<PlusIcon size={18} />}
              disabled={disableActions}
              className={addProductButtonClassName}
              onClick={() => {
                setIsSelectProductOpen(true);
                clearErrors();
              }}
            />
          </div>
        )}
      </div>

      {errors.purchase_request_items?.root?.message ||
      errors.purchase_request_items?.message ? (
        <p className="m-0 text-sm text-red-500 dark:text-red-400">
          {errors.purchase_request_items?.root?.message ||
            errors.purchase_request_items?.message}
        </p>
      ) : null}

      {fields.length === 0 ? (
        <p className="m-0 text-sm text-slate-500 dark:text-slate-400">
          Aún no hay productos agregados a esta requisición.
        </p>
      ) : null}

      {fields.length > 0 ? (
        <AccordionGroup
          type="multiple"
          value={openProducts}
          onValueChange={(value) => {
            const nextOpen = new Set(
              Array.isArray(value) ? value : value ? [value] : [],
            );
            setClosedProductIds(
              fields
                .map((field) => field.id)
                .filter((id) => !nextOpen.has(id)),
            );
          }}
          className="gap-3"
        >
          {fields.map((item, index) => {
            const unitName = watch(
              `purchase_request_items.${index}.unit_measure_name`,
            );
            const unitSymbol = watch(
              `purchase_request_items.${index}.unit_measure_symbol`,
            );
            const isBoxOrPackage = hasUnitsPerPackage(
              unitName ?? item.unit_measure_name ?? undefined,
              unitSymbol ?? item.unit_measure_symbol ?? undefined,
            );
            const unitDisplayValue = formatProductUnitDisplay(
              unitName ?? item.unit_measure_name,
              unitSymbol ?? item.unit_measure_symbol,
            );
            const isPersistedItem = Boolean(
              item.purchase_request_item_id?.trim(),
            );
            const canRemoveItem = !lockItems && !isPersistedItem;
            const requiresDescription = !isPersistedItem;

            return (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#272b34]!"
                triggerClassName="h-auto! min-h-12! py-2.5! pr-3!"
                contentClassName="flex flex-col gap-5 p-4"
                title={
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-sm font-semibold text-white dark:bg-alpac-primary-700">
                      {index + 1}
                    </span>
                    <span className="min-w-0 truncate text-[15px] font-semibold text-slate-800 dark:text-white">
                      {item.product_name || `#${index + 1}`}
                    </span>
                  </div>
                }
                actions={
                  canRemoveItem ? (
                    <Button
                      type="button"
                      size="small"
                      tooltip="Quitar producto"
                      icon={<Trash2Icon size={16} />}
                      onClick={() => remove(index)}
                      className={removeProductButtonClassName}
                    />
                  ) : null
                }
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <InputText
                      label={`Producto #${index + 1}`}
                      placeholder="Producto seleccionado"
                      className={inputClassName}
                      labelClassName={labelClassName}
                      value={item.product_name ?? ""}
                      disabled
                    />
                  </div>
                  <div>
                    <Controller
                      name={`purchase_request_items.${index}.quantity`}
                      control={control}
                      rules={{
                        required: "La cantidad es requerida",
                        validate: {
                          validateInteger: (value) =>
                            validateIntegerNumber(value),
                          validatePositive: (value) =>
                            validatePositiveNumber(value),
                        },
                      }}
                      render={({ field }) => (
                        <InputText
                          label="Cantidad"
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          isRequired
                          className={inputClassName}
                          labelClassName={labelClassName}
                          value={formatIntegerDisplay(field.value)}
                          onChange={(e) => {
                            field.onChange(parseIntegerInput(e.target.value));
                            if (hasAttemptedSubmit) {
                              void trigger(
                                `purchase_request_items.${index}.quantity`,
                              );
                            }
                          }}
                          error={
                            errors.purchase_request_items?.[index]?.quantity
                              ?.message
                          }
                          errorVariant="text"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <InputText
                      label="Unidad de Medida"
                      placeholder="Unidad del producto"
                      className={inputClassName}
                      labelClassName={labelClassName}
                      value={unitDisplayValue}
                      disabled
                    />
                  </div>

                  <div>
                    <Controller
                      name={`purchase_request_items.${index}.quantity_unit`}
                      control={control}
                      rules={{
                        validate: (value, formValues) => {
                          const rowItem =
                            formValues.purchase_request_items?.[index];
                          const requiresUnitsPerPackage = hasUnitsPerPackage(
                            rowItem?.unit_measure_name ?? undefined,
                            rowItem?.unit_measure_symbol ?? undefined,
                          );

                          if (!requiresUnitsPerPackage) return true;

                          if (
                            value === 0 ||
                            value === undefined ||
                            value === null
                          ) {
                            return "Agregue las unidades por presentación";
                          }

                          const integerResult = validateIntegerNumber(value);
                          if (integerResult !== true) return integerResult;

                          return validatePositiveNumber(value);
                        },
                      }}
                      render={({ field }) => (
                        <InputText
                          label="Unidades por presentación"
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          isRequired={isBoxOrPackage}
                          disabled={!isBoxOrPackage}
                          className={inputClassName}
                          labelClassName={labelClassName}
                          value={formatIntegerDisplay(field.value ?? 0)}
                          onChange={(e) => {
                            field.onChange(parseIntegerInput(e.target.value));
                            if (hasAttemptedSubmit) {
                              void trigger(
                                `purchase_request_items.${index}.quantity_unit`,
                              );
                            }
                          }}
                          error={
                            errors.purchase_request_items?.[index]
                              ?.quantity_unit?.message
                          }
                          errorVariant="text"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Controller
                      name={`purchase_request_items.${index}.description`}
                      control={control}
                      rules={
                        requiresDescription
                          ? {
                              validate: (value) =>
                                (typeof value === "string" &&
                                  value.trim().length > 0) ||
                                "La descripción es requerida",
                            }
                          : undefined
                      }
                      render={({ field }) => (
                        <Textarea
                          label="Descripción"
                          isRequired={requiresDescription}
                          placeholder="Ej. Resma de papel bond carta, 75 g, paquete de 500 hojas."
                          className={inputClassName}
                          labelClassName={labelClassName}
                          value={field.value ?? ""}
                          onChange={(event) => {
                            field.onChange(event);
                            if (hasAttemptedSubmit) {
                              void trigger(
                                `purchase_request_items.${index}.description`,
                              );
                            }
                          }}
                          enableCharacterCount
                          error={
                            errors.purchase_request_items?.[index]?.description
                              ?.message
                          }
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      name={`purchase_request_items.${index}.justification`}
                      control={control}
                      rules={{
                        required: "La justificación de compra es requerida",
                      }}
                      render={({ field }) => (
                        <Textarea
                          label="Justificación"
                          isRequired
                          placeholder="Ej. Se requiere para reponer el inventario de papelería"
                          className={inputClassName}
                          labelClassName={labelClassName}
                          value={field.value ?? ""}
                          onChange={(event) => {
                            field.onChange(event);
                            if (hasAttemptedSubmit) {
                              void trigger(
                                `purchase_request_items.${index}.justification`,
                              );
                            }
                          }}
                          enableCharacterCount
                          error={
                            errors.purchase_request_items?.[index]
                              ?.justification?.message
                          }
                        />
                      )}
                    />
                  </div>
                </div>

                <Controller
                  name={`purchase_request_items.${index}.images.images_product_to_changed`}
                  control={control}
                  render={({ field }) => (
                    <PurchaseRequestImageUploader
                      value={field.value ?? []}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
              </AccordionItem>
            );
          })}
        </AccordionGroup>
      ) : null}

      <Controller
        name="purchase_request_items"
        control={control}
        rules={{
          validate: (value) =>
            (value?.length ?? 0) > 0 ||
            "Debe agregar al menos un producto a la requisición",
        }}
        render={({ field }) => (
          <input
            type="hidden"
            ref={field.ref}
            name={field.name}
            value={JSON.stringify(field.value ?? [])}
            readOnly
          />
        )}
      />

      <SelectProductModal
        isOpen={isSelectProductOpen}
        onClose={() => setIsSelectProductOpen(false)}
        onSelect={handleSelectProduct}
        selectionType="multiple"
        excludeProductIds={assignedProductIds}
        productUsageType={productUsageType}
        categoryType={productUsageType}
        costCenterId={effectiveCostCenterId}
        branchId={effectiveBranchId}
      />
    </div>
  );
};
