import { useMemo } from "react";
import {
  Button,
  Dropdown,
  InputText,
  Textarea,
} from "@alpac/design-system";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useForm, Controller } from "react-hook-form";
import { useInventoryStocks } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useInventoryStocks";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAssignment";
import type { InventoryStockDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/inventory-stocks/get-inventory-stocks-response";
import type { MachineryCatalogItemDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-machinery-catalog";

const inputClassName =
  "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

interface FuelRequestFormProps {
  isSubmitting?: boolean;
  onSubmit: (data: {
    machinery_id: string;
    product_stock_id: string;
    requested_quantity: number;
    mileage?: number;
    engine_hours?: number;
    justification: string;
  }) => void | Promise<void>;
}

interface FuelRequestFormValues {
  machinery_id: string;
  product_stock_id: string;
  requested_quantity: string;
  mileage: string;
  engine_hours: string;
  justification: string;
}

export function FuelRequestForm({
  isSubmitting = false,
  onSubmit,
}: FuelRequestFormProps) {
  const { companyId, moduleCode } = useUserStore();

  const stockPayload =
    companyId && moduleCode
      ? {
          company_id: companyId,
          module_code: moduleCode,
          page_size: 100,
          page_number: 1,
        }
      : null;

  const machineryPayload =
    companyId && moduleCode
      ? {
          company_id: companyId,
          module_code: moduleCode,
          page_size: 100,
          page_number: 1,
        }
      : null;

  const { GetInventoryStocks } = useInventoryStocks(stockPayload);
  const { GetMachineryCatalog } = useWarehouseAssignment({
    payloadMachineryCatalog: machineryPayload,
  });

  const stocks: InventoryStockDto[] = useMemo(
    () => GetInventoryStocks.data?.data ?? [],
    [GetInventoryStocks.data],
  );

  const machineries: MachineryCatalogItemDto[] = useMemo(
    () => GetMachineryCatalog.data?.data ?? [],
    [GetMachineryCatalog.data],
  );

  const stockOptions = useMemo(
    () =>
      stocks.map((stock) => ({
        value: stock.product_stock_id,
        label:
          stock.product_information?.product_name?.trim() || "Combustible",
      })),
    [stocks],
  );

  const machineryOptions = useMemo(
    () =>
      machineries.map((m) => ({
        value: m.machinery_id,
        label: `${m.code ?? ""} ${m.brand ?? ""} ${m.model ?? ""}`.trim() || "Maquinaria",
      })),
    [machineries],
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FuelRequestFormValues>({
    mode: "onSubmit",
    defaultValues: {
      machinery_id: "",
      product_stock_id: "",
      requested_quantity: "",
      mileage: "",
      engine_hours: "",
      justification: "",
    },
  });

  const isStockLoading = GetInventoryStocks.isLoading;
  const isMachineryLoading = GetMachineryCatalog.isLoading;

  const onFormSubmit = async (values: FuelRequestFormValues) => {
    const quantity = Number(values.requested_quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) return;
    if (!values.machinery_id.trim() || !values.product_stock_id.trim()) return;
    if (!values.justification.trim()) return;

    await onSubmit({
      machinery_id: values.machinery_id.trim(),
      product_stock_id: values.product_stock_id.trim(),
      requested_quantity: quantity,
      mileage: values.mileage.trim() ? Number(values.mileage) : undefined,
      engine_hours: values.engine_hours.trim()
        ? Number(values.engine_hours)
        : undefined,
      justification: values.justification.trim(),
    });

    reset();
  };

  return (
    <div className="flex flex-col gap-4">
      {(isStockLoading || isMachineryLoading) && (
        <Loader title="Cargando datos..." />
      )}

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            control={control}
            name="machinery_id"
            rules={{ required: "Seleccione una maquinaria" }}
            render={({ field: controllerField }) => (
              <Dropdown
                label="Maquinaria"
                placeholder="Seleccione una maquinaria"
                options={machineryOptions}
                value={controllerField.value}
                onChange={controllerField.onChange}
                error={errors.machinery_id?.message}
                appearance="dark"
                labelClassName={labelClassName}
                className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
                disabled={isSubmitting || isMachineryLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="product_stock_id"
            rules={{ required: "Seleccione un stock de combustible" }}
            render={({ field: controllerField }) => (
              <Dropdown
                label="Stock de combustible"
                placeholder="Seleccione un stock"
                options={stockOptions}
                value={controllerField.value}
                onChange={controllerField.onChange}
                error={errors.product_stock_id?.message}
                appearance="dark"
                labelClassName={labelClassName}
                className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
                disabled={isSubmitting || isStockLoading}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <InputText
            label="Cantidad solicitada"
            type="number"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("requested_quantity", {
              required: "La cantidad es obligatoria",
              min: { value: 0.0001, message: "La cantidad debe ser mayor a cero" },
              valueAsNumber: true,
            })}
            error={errors.requested_quantity?.message}
            disabled={isSubmitting}
          />

          <InputText
            label="Kilometraje (opcional)"
            type="number"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("mileage", {
              min: { value: 0, message: "No puede ser negativo" },
              valueAsNumber: true,
            })}
            error={errors.mileage?.message}
            disabled={isSubmitting}
          />

          <InputText
            label="Horas motor (opcional)"
            type="number"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("engine_hours", {
              min: { value: 0, message: "No puede ser negativo" },
              valueAsNumber: true,
            })}
            error={errors.engine_hours?.message}
            disabled={isSubmitting}
          />
        </div>

        <Textarea
          label="Justificación"
          isRequired
          className={inputClassName}
          labelClassName={labelClassName}
          {...register("justification", {
            required: "La justificación es obligatoria",
          })}
          error={errors.justification?.message}
          placeholder="Describe el motivo de la solicitud de combustible"
          disabled={isSubmitting}
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="submit"
            label={isSubmitting ? "Registrando..." : "Registrar solicitud"}
            disabled={isSubmitting || isStockLoading || isMachineryLoading}
          />
        </div>
      </form>
    </div>
  );
}

export default FuelRequestForm;