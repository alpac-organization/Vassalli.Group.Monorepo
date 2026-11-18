import { useMemo } from "react";
import {
  Button,
  Dropdown,
  InputText,
  Textarea,
} from "@alpac/design-system";
import { Loader } from "@app/shared/components/loaders/loader";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useInventoryStocks } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useInventoryStocks";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import type { InventoryStockDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/inventory-stocks/get-inventory-stocks-response";
import type { ReasonUse } from "@app/core/enums/reason-use.enum";
import { ReasonUse as ReasonUseValues } from "@app/core/enums/reason-use.enum";

export interface SupplyRequestFormProps {
  isSubmitting?: boolean;
  showWarehouse?: boolean;
  showReasonUse?: boolean;
  onSubmit: (payload: {
    items: { product_stock_id: string; amount: number }[];
    justification: string;
    warehouse_id?: string;
    reason_use?: ReasonUse;
  }) => void | Promise<void>;
}

interface SupplyRequestFormValues {
  justification: string;
  warehouse_id: string;
  reason_use: string;
  items: { product_stock_id: string; amount: string }[];
}

export function SupplyRequestForm({
  isSubmitting = false,
  showWarehouse = false,
  showReasonUse = false,
  onSubmit,
}: SupplyRequestFormProps) {
  const { companyId, moduleCode, costCenterId } = useUserStore();

  const stockPayload =
    companyId && moduleCode
      ? {
          company_id: companyId,
          module_code: moduleCode,
          page_size: 100,
          page_number: 1,
          is_material: true,
          cost_center_id: costCenterId || undefined,
        }
      : null;

  const { GetInventoryStocks } = useInventoryStocks(stockPayload);

  const stocks: InventoryStockDto[] = useMemo(
    () => GetInventoryStocks.data?.data ?? [],
    [GetInventoryStocks.data],
  );

  const productOptions = useMemo(
    () =>
      stocks.map((stock) => ({
        value: stock.product_stock_id,
        label: stock.product_information?.product_name?.trim() || "Insumo",
      })),
    [stocks],
  );

  const { GetWarehouses } = useWarehouse({
    getWarehousesPayload: {
      company_id: companyId ?? "",
      module_code: moduleCode ?? "",
    },
  });

  const warehouseOptions = useMemo(
    () =>
      (GetWarehouses.data?.data ?? []).map((warehouse) => ({
        value: warehouse.warehouse_id,
        label: warehouse.code ?? "-",
      })),
    [GetWarehouses.data],
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplyRequestFormValues>({
    mode: "onSubmit",
    defaultValues: {
      justification: "",
      warehouse_id: "",
      reason_use: "Operation",
      items: [{ product_stock_id: "", amount: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const isStockLoading = GetInventoryStocks.isLoading;
  const isWarehouseLoading = GetWarehouses.isLoading;

  const onFormSubmit = async (values: SupplyRequestFormValues) => {
    const validItems = values.items
      .map((item) => ({
        product_stock_id: item.product_stock_id.trim(),
        amount: Number(item.amount),
      }))
      .filter(
        (item) =>
          item.product_stock_id.length > 0 &&
          Number.isFinite(item.amount) &&
          item.amount > 0,
      );

    if (!validItems.length) return;
    if (!values.justification.trim()) return;
    if (showWarehouse && !values.warehouse_id.trim()) return;

    await onSubmit({
      items: validItems,
      justification: values.justification.trim(),
      warehouse_id: showWarehouse ? values.warehouse_id.trim() : undefined,
      reason_use: showReasonUse
        ? (values.reason_use as ReasonUse)
        : undefined,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {isSubmitting && <Loader title="Registrando solicitud de insumos..." />}

      {showWarehouse ? (
        <Controller
          control={control}
          name="warehouse_id"
          rules={{ required: "Seleccione un almacén" }}
          render={({ field: controllerField }) => (
            <Dropdown
              label="Almacén"
              placeholder="Seleccione un almacén"
              options={warehouseOptions}
              value={controllerField.value}
              onChange={controllerField.onChange}
              error={errors.warehouse_id?.message}
              appearance="dark"
              labelClassName="text-black! dark:text-white!"
              className="bg-transparent!"
              disabled={isSubmitting || isWarehouseLoading}
            />
          )}
        />
      ) : null}

      {showReasonUse ? (
        <Controller
          control={control}
          name="reason_use"
          render={({ field: controllerField }) => (
            <Dropdown
              label="Motivo de uso"
              placeholder="Seleccione un motivo"
              options={Object.values(ReasonUseValues).map((r) => ({
                value: r.label === "Venta" ? "Sale" : "Operation",
                label: r.label,
              }))}
              value={controllerField.value}
              onChange={controllerField.onChange}
              appearance="dark"
              labelClassName="text-black! dark:text-white!"
              className="bg-transparent!"
              disabled={isSubmitting}
            />
          )}
        />
      ) : null}

      <Textarea
        label="Justificación"
        isRequired
        className="bg-transparent! text-white!"
        labelClassName="text-black! dark:text-white!"
        {...register("justification", {
          required: "La justificación es obligatoria",
        })}
        error={errors.justification?.message}
        placeholder="Describe el motivo de la solicitud de insumos"
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Insumos
          </label>
          <Button
            type="button"
            label="Agregar otro insumo"
            size="small"
            icon={<PlusIcon size={16} />}
            onClick={() => append({ product_stock_id: "", amount: "" })}
            disabled={isSubmitting || isStockLoading}
          />
        </div>

        {isStockLoading ? (
          <Loader title="Cargando insumos disponibles..." />
        ) : (
          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 gap-2 sm:grid-cols-[3.5fr_1fr_auto]"
              >
                <Controller
                  control={control}
                  name={`items.${index}.product_stock_id`}
                  rules={{ required: "Seleccione un insumo" }}
                  render={({ field: controllerField }) => (
                    <Dropdown
                      label="Insumo"
                      placeholder="Seleccione un insumo"
                      options={productOptions}
                      value={controllerField.value}
                      onChange={controllerField.onChange}
                      error={
                        errors.items?.[index]?.product_stock_id?.message
                      }
                      appearance="dark"
                      labelClassName="text-black! dark:text-white!"
                      className="bg-transparent!"
                      disabled={isSubmitting}
                    />
                  )}
                />
                <InputText
                  label="Cantidad"
                  type="number"
                  className="bg-transparent! text-white!"
                  labelClassName="text-black! dark:text-white!"
                  {...register(`items.${index}.amount`, {
                    required: "La cantidad es obligatoria",
                    min: {
                      value: 0.0001,
                      message: "La cantidad debe ser mayor a cero",
                    },
                    valueAsNumber: true,
                  })}
                  error={errors.items?.[index]?.amount?.message}
                  disabled={isSubmitting}
                />
                <div className="flex items-end">
                  <Button
                    type="button"
                    size="small"
                    icon={<Trash2Icon size={16} />}
                    onClick={() => remove(index)}
                    disabled={isSubmitting || fields.length === 1}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            label={isSubmitting ? "Registrando..." : "Registrar insumos"}
            onClick={() => void handleSubmit(onFormSubmit)()}
            disabled={isSubmitting || isStockLoading}
            className="rounded-md! h-10 px-4! bg-blue-600 text-white hover:bg-blue-700"
          />
        </div>
      </div>
    </div>
  );
}