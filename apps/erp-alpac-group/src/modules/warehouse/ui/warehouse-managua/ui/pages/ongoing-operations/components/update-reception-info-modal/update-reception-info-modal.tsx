import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Checkbox,
  Dropdown,
  InputText,
  Modal,
  Textarea,
  type Option,
} from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCustomer } from "@app/modules/warehouse/ui/hooks/useCustomer";
import { useOperationalOrders } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useOperationalOrders";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "../../utils/styles";
import type {
  UpdateReceptionInfoFormValues,
  UpdateReceptionInformationModalProps,
} from "./types/update-reception-info-modal.types";

export function UpdateReceptionInformationModal({
  isOpen,
  onClose,
  orderId,
  poCode,
  initialData,
  onSuccess,
}: UpdateReceptionInformationModalProps) {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const {
    handleRequestError,
    handleRequestSuccess,
    AlertComponent,
  } = useAlertState();

  const { GetCustomer } = useCustomer();
  const { UpdateOperationalOrderInformation } = useOperationalOrders();

  const customersQuery = GetCustomer(
    {
      company_id: companyId,
      module_code: moduleCode,
    },
    { enabled: Boolean(isOpen && companyId) },
  );

  const customerOptions = useMemo<Option[]>(() => {
    const records = customersQuery.data ?? [];
    return records.map((customer) => ({
      value: customer.customer_id,
      label: customer.identification_number
        ? `${customer.legal_name || "Cliente"} (${customer.identification_number})`
        : customer.legal_name || customer.customer_id,
    }));
  }, [customersQuery.data]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateReceptionInfoFormValues>({
    mode: "onChange",
    defaultValues: {
      customer_id: initialData?.customerId || "",
      package_amount: initialData?.packageAmount ?? 0,
      merchandise_weight: initialData?.merchandiseWeight ?? 0,
      has_merchandise: false,
      merchandise: "",
      merchandise_description: "",
    },
  });

  const hasMerchandise = watch("has_merchandise");

  useEffect(() => {
    if (isOpen) {
      reset({
        customer_id: initialData?.customerId || "",
        package_amount: initialData?.packageAmount ?? 0,
        merchandise_weight: initialData?.merchandiseWeight ?? 0,
        has_merchandise: false,
        merchandise: "",
        merchandise_description: "",
      });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (values: UpdateReceptionInfoFormValues) => {
    if (!orderId || !companyId || !moduleCode) return;

    try {
      await UpdateOperationalOrderInformation.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        operational_order_id: orderId,
        customer_id: values.customer_id,
        package_amount: Number(values.package_amount),
        merchandise_weight: Number(values.merchandise_weight),
        has_merchandise: Boolean(values.has_merchandise),
        merchandise_information:
          values.has_merchandise && values.merchandise?.trim()
            ? {
                merchandise: values.merchandise.trim(),
                merchandise_description:
                  values.merchandise_description?.trim() || "",
              }
            : null,
      });

      handleRequestSuccess("Información de recepción registrada correctamente.");
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (error) {
      const mapped = getMappedError(error as ApiErrorResponse);
      handleRequestError(
        mapped?.description || "Error al actualizar la información de la orden operacional.",
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen && Boolean(orderId)}
      onClose={onClose}
      variant="form"
      size="5xl"
      title={poCode ? `Registrar Información — ${poCode}` : "Registrar Información de Recepción"}
      description="Asigna el cliente, bultos y peso a la orden operacional, y opcionalmente la mercadería contenida TESTING."
    >
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {AlertComponent}

        <div className="flex items-stretch flex-col gap-6">
          {/* Fila 1: Cliente, Bultos y Peso */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Controller
              name="customer_id"
              control={control}
              rules={{ required: "El cliente es obligatorio" }}
              render={({ field }) => (
                <Dropdown
                  appearance="dark"
                  label="Cliente"
                  labelClassName={labelClassName}
                  isRequired
                  placeholder="Seleccione el cliente..."
                  options={customerOptions}
                  value={field.value || undefined}
                  onChange={(val) => field.onChange(String(val))}
                  error={errors.customer_id?.message}
                  className={dropdownClassName}
                />
              )}
            />

            <Controller
              name="package_amount"
              control={control}
              rules={{
                required: "La cantidad de bultos es obligatoria",
                min: { value: 0, message: "No puede ser menor a 0" },
              }}
              render={({ field }) => (
                <InputText
                  label="Cantidad de bultos"
                  labelClassName={labelClassName}
                  isRequired
                  type="number"
                  placeholder="0"
                  value={field.value !== undefined ? String(field.value) : ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  error={errors.package_amount?.message}
                  className={inputClassName}
                />
              )}
            />

            <Controller
              name="merchandise_weight"
              control={control}
              rules={{
                required: "El peso es obligatorio",
                min: { value: 0, message: "No puede ser menor a 0" },
              }}
              render={({ field }) => (
                <InputText
                  label="Peso total (kg)"
                  labelClassName={labelClassName}
                  isRequired
                  type="number"
                  placeholder="0.00"
                  value={field.value !== undefined ? String(field.value) : ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  error={errors.merchandise_weight?.message}
                  className={inputClassName}
                />
              )}
            />
          </div>

          <div className="border-t border-t-slate-300 dark:border-t-neutral-600" />

          {/* Sección de mercadería opcional */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="m-0! text-[14px] font-semibold text-slate-700 dark:text-slate-200">
                Información de mercadería (Opcional)
              </p>
              <p className="m-0! mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                Activa esta casilla para registrar la descripción y contenido de los artículos de la orden.
              </p>
            </div>

            <Controller
              name="has_merchandise"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label="Registrar información de mercadería adicional"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {hasMerchandise && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-2">
                <Controller
                  name="merchandise"
                  control={control}
                  rules={{
                    required: hasMerchandise
                      ? "El nombre de la mercadería es obligatorio"
                      : false,
                  }}
                  render={({ field }) => (
                    <InputText
                      label="Nombre de mercadería"
                      labelClassName={labelClassName}
                      isRequired={hasMerchandise}
                      placeholder="Ej. Cajas de repuestos, Bobinas"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      error={errors.merchandise?.message}
                      className={inputClassName}
                    />
                  )}
                />

                <div className="md:col-span-2">
                  <Controller
                    name="merchandise_description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        label="Descripción de mercadería"
                        labelClassName={labelClassName}
                        placeholder="Observaciones o notas adicionales de la mercadería..."
                        rows={3}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        error={errors.merchandise_description?.message}
                        className={inputClassName}
                      />
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Separador de footer */}
        <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6" />

        {/* Botones de acción estándar */}
        <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={onClose}
            disabled={UpdateOperationalOrderInformation.isPending}
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
          />
          <Button
            type="submit"
            size="giant"
            label="Guardar"
            isLoading={UpdateOperationalOrderInformation.isPending}
            disabled={UpdateOperationalOrderInformation.isPending}
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
          />
        </div>
      </form>
    </Modal>
  );
}
