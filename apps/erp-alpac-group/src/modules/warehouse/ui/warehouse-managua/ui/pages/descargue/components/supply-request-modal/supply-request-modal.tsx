import { useMemo } from "react";
import {
  Button,
  Dropdown,
  InputText,
  Modal,
  Textarea,
} from "@alpac/design-system";
import { Loader } from "@app/shared/components/loaders/loader";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useInventoryStocks } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useInventoryStocks";
import type { InventoryStockDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/inventory-stocks/get-inventory-stocks-response";

interface SupplyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting?: boolean;
  onSubmit: (
    items: { product_stock_id: string; amount: number }[],
    justification: string,
  ) => void | Promise<void>;
  onSkip?: () => void;
}

interface SupplyRequestFormValues {
  justification: string;
  items: { product_stock_id: string; amount: string }[];
}

export function SupplyRequestModal({
  isOpen,
  onClose,
  isSubmitting = false,
  onSubmit,
  onSkip,
}: SupplyRequestModalProps) {
  const { companyId, moduleCode } = useUserStore();

  const stockPayload =
    isOpen && companyId && moduleCode
      ? {
        company_id: companyId,
        module_code: moduleCode,
        page_size: 100,
        page_number: 1,
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

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplyRequestFormValues>({
    mode: "onSubmit",
    defaultValues: {
      justification: "",
      items: [{ product_stock_id: "", amount: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const isStockLoading = GetInventoryStocks.isLoading;

  const handleSkip = () => {
    if (isSubmitting) return;
    if (onSkip) {
      onSkip();
      return;
    }
    onClose();
  };

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

    await onSubmit(validItems, values.justification.trim());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleSkip}
      variant="form"
      size="lg"
      title="Solicitud de insumos"
      description={<>Solicita los insumos requeridos para la descarga. <br /> Este paso es opcional.</>}
    >
      <div className="flex flex-col gap-4">
        {isSubmitting && <Loader title="Registrando solicitud de insumos..." />}

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col gap-4"
        >
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
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              label="Omitir"
              onClick={handleSkip}
              disabled={isSubmitting}
            />
            <Button
              type="button"
              label={isSubmitting ? "Registrando..." : "Registrar insumos"}
              onClick={() => void handleSubmit(onFormSubmit)()}
              disabled={isSubmitting || isStockLoading}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}
