import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Checkbox,
  DatePicker,
  InputText,
  Textarea,
  TimePicker,
} from "@alpac/design-system";
import { ClipboardCheck, RotateCcw } from "lucide-react";
import dayjs from "dayjs";
import { useMerchandise } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useMerchandise";
import type {
  RegisterDucatGeneralFormProps,
  RegisterDucatGeneralFormValues,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/register-ducat-general-form/types/register-ducat-general-form.types";
import { toApiDate } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/utils/mapping-access-control";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { baseInputClasses, fieldsGridClasses } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/variants/global-variants";

const labelClassName =
  "text-slate-600! dark:text-slate-300! text-[13px]! font-medium!";

export function RegisterDucatGeneralForm({
  reception_id,
  company_id,
  module_code,
  defaultContainerNumber,
  initialStartDate,
  initialStartTime,
}: RegisterDucatGeneralFormProps) {
  const { getMappedError } = useMappedError();
  const { alertState, handleCloseAlert, handleRequestError, handleRequestSuccess, AlertComponent } =
    useAlertState();
  const { CreateDucatRegistry } = useMerchandise();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterDucatGeneralFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      container_number: defaultContainerNumber,
      empresa: "",
      general_observations: "",
      is_in_transit: false,
      registered_start_date: initialStartDate,
      registered_start_time: initialStartTime,
    },
  });

  useEffect(() => {
    if (!defaultContainerNumber) return;
    reset((current) => ({
      ...current,
      container_number: defaultContainerNumber,
    }));
  }, [defaultContainerNumber, reset]);

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={handleSubmit((values) =>
          CreateDucatRegistry.mutateAsync({
            company_id,
            module_code,
            reception_id,
            container_number: values.container_number,
            empresa: values.empresa,
            general_observations: values.general_observations,
            is_in_transit: values.is_in_transit,
            registered_start_date: toApiDate(values.registered_start_date),
            registered_start_time: values.registered_start_time
              ? dayjs(values.registered_start_time as unknown as Date).second(0).format("HH:mm:ss")
              : undefined,
          })
            .then(() => {
              handleRequestSuccess(
                "Detalle general del DUCA registrado correctamente.",
              );
            })
            .catch((error) => {
              const mappedError = getMappedError(error as ApiErrorResponse);
              handleRequestError(
                mappedError?.description || "Error al registrar el detalle general del DUCA",
              );
            }),
        )}
        className="flex flex-col gap-4"
      >
        <div className={`min-w-0 pt-1 sm:pt-2 ${fieldsGridClasses}`}>
          <Controller
            name="container_number"
            control={control}
            rules={{ required: "El número de contenedor es requerido" }}
            render={({ field }) => (
              <InputText
                label="Número de contenedor"
                labelClassName={labelClassName}
                isRequired
                placeholder="Ej. TCNU1234567"
                value={field.value}
                onChange={field.onChange}
                error={errors.container_number?.message}
                errorVariant="text"
                className={`${baseInputClasses} h-[42px]! sm:h-[46px]! px-3!`}
              />
            )}
          />
          <Controller
            name="empresa"
            control={control}
            rules={{ required: "La empresa es requerida" }}
            render={({ field }) => (
              <InputText
                label="Empresa"
                labelClassName={labelClassName}
                isRequired
                placeholder="Empresa del registro"
                value={field.value}
                onChange={field.onChange}
                error={errors.empresa?.message}
                errorVariant="text"
                className={`${baseInputClasses} h-[42px]! sm:h-[46px]! px-3!`}
              />
            )}
          />
          <div className="min-w-0">
            <Controller
              name="general_observations"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Observaciones generales"
                  labelClassName={labelClassName}
                  placeholder="Observaciones generales del registro"
                  value={field.value}
                  onChange={field.onChange}
                  maxLength={500}
                  rows={3}
                />
              )}
            />
          </div>
          <Controller
            name="registered_start_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Fecha de inicio del registro"
                labelAbove
                labelClassName={labelClassName}
                fieldWidth="large"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="registered_start_time"
            control={control}
            render={({ field }) => (
              <TimePicker
                label="Hora de inicio del registro"
                labelAbove
                labelClassName={labelClassName}
                fieldWidth="large"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <div className="flex items-center">
            <Controller
              name="is_in_transit"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label="Mercancía en tránsito"
                  checked={field.value}
                  onChange={field.onChange}
                  labelClassName={labelClassName}
                />
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-neutral-600">
          <Button
            type="button"
            size="medium"
            label="Restablecer"
            icon={<RotateCcw size={16} />}
            ariaLabel="Restablecer formulario del detalle general"
            onClick={() => {
              reset({
                container_number: defaultContainerNumber,
                empresa: "",
                general_observations: "",
                is_in_transit: false,
                registered_start_date: initialStartDate,
                registered_start_time: initialStartTime,
              });
              handleCloseAlert();
            }}
            disabled={CreateDucatRegistry.isPending}
            className="w-full sm:w-auto text-[13px]! text-slate-600! dark:text-slate-300! bg-slate-100! dark:bg-slate-700! hover:bg-slate-200! dark:hover:bg-slate-600!"
          />
          <Button
            type="submit"
            size="medium"
            label="Registrar detalle general"
            icon={<ClipboardCheck size={16} />}
            ariaLabel="Registrar detalle general del DUCA"
            isLoading={CreateDucatRegistry.isPending}
            className="w-full sm:w-auto text-[13px]! text-white! bg-blue-600! hover:bg-blue-700!"
          />
        </div>
      </form>

      {AlertComponent}
    </div>
  );
}