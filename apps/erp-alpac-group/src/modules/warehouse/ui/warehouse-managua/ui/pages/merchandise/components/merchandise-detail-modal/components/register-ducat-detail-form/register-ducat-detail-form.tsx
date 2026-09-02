import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  DatePicker,
  Dropdown,
  InputText,
  Textarea,
  TimePicker,
  type Option,
} from "@alpac/design-system";
import { FilePlus2, PackagePlus, RotateCcw, Save } from "lucide-react";
import dayjs from "dayjs";
import { useMerchandise } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useMerchandise";
import type { CreateServiceOrderResponse } from "@app/modules/service-order/domain/ApiContract/Responses/service-order-responses/create-service-order.response";
import type {
  RegisterDucatDetailFormProps,
  RegisterDucatDetailFormValues,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/register-ducat-detail-form/types/register-ducat-detail-form.types";
import { CreateServiceOrderModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/create-service-order-modal/create-service-order-modal";
import { RegisterMerchandiseModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/register-merchandise-modal/register-merchandise-modal";
import { toApiDate } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/utils/mapping-access-control";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { baseInputClasses, fieldsGridClasses } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/variants/global-variants";

const labelClassName =
  "text-slate-600! dark:text-slate-300! text-[13px]! font-medium!";

export function RegisterDucatDetailForm({
  reception_id,
  ducat_id,
  company_id,
  module_code,
  initialStartDate,
  initialStartTime,
}: RegisterDucatDetailFormProps) {
  const { getMappedError } = useMappedError();
  const {handleCloseAlert,handleRequestError, handleRequestSuccess, handleRequestWarning, AlertComponent } =
    useAlertState();
  const { GetMerchandises, CreateDucatRegistryDetail } = useMerchandise({
    payloadGetMerchandises: { company_id, module_code },
  });

  const merchandiseOptions = useMemo<Option[]>(
    () =>
      (GetMerchandises.data ?? []).map((merchandise) => ({
        value: merchandise.merchandise_id,
        label: merchandise.merchandise_name,
      })),
    [GetMerchandises.data],
  );

  const [openCreateServiceOrderModal, setOpenCreateServiceOrderModal] = useState(false);
  const [openRegisterMerchandiseModal, setOpenRegisterMerchandiseModal] = useState(false);
  const [serviceOrder, setServiceOrder] =
    useState<CreateServiceOrderResponse | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterDucatDetailFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      merchandise_id: "",
      total_bultos: "0",
      total_weight: "0",
      product_description: "",
      remitente: "",
      destination_area_observation: "",
      registered_start_date: initialStartDate,
      registered_start_time: initialStartTime,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={handleSubmit((values) => {
          if (!serviceOrder) {
            handleRequestWarning(
              "Debe crear una orden de servicio antes de guardar el detalle del DUCA",
            );
            return;
          }
          CreateDucatRegistryDetail.mutateAsync({
            company_id,
            module_code,
            reception_id,
            ducat_id,
            service_order_id: serviceOrder.service_order_id,
            merchandise_id: values.merchandise_id,
            total_bultos: Number(values.total_bultos),
            total_weight: Number(values.total_weight),
            product_description: values.product_description,
            remitente: values.remitente,
            destination_area_observation: values.destination_area_observation,
            registered_start_date: toApiDate(values.registered_start_date),
            registered_start_time: values.registered_start_time
              ? dayjs(values.registered_start_time as unknown as Date).second(0).format("HH:mm:ss")
              : undefined,
          })
            .then(() => {
              handleRequestSuccess(
                "Detalle del DUCA registrado correctamente.",
              );
            })
            .catch((error) => {
              const mappedError = getMappedError(error as ApiErrorResponse);
              handleRequestError(
                mappedError?.description || "Error al registrar el detalle del DUCA",
              );
            });
        })}
        className="flex flex-col gap-4"
      >
        <div className={`min-w-0 pt-1 sm:pt-2 ${fieldsGridClasses}`}>
          <Controller
            name="merchandise_id"
            control={control}
            rules={{ required: "La mercancía es requerida" }}
            render={({ field }) => (
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0 relative">
                  <Dropdown
                    appearance="dark"
                    label="Mercancía"
                    labelClassName={labelClassName}
                    isRequired
                    placeholder="Seleccione la mercancía"
                    options={merchandiseOptions}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.merchandise_id?.message}
                    errorVariant="text"
                    className="min-w-0"
                  />
                </div>
                <div className="flex shrink-0 mt-[24px] sm:mt-[26px]">
                  <Button
                    type="button"
                    tooltip="Registrar nueva mercancía"
                    onClick={() => setOpenRegisterMerchandiseModal(true)}
                    icon={<PackagePlus size={16} />}
                    className="h-[42px]! sm:h-[46px]! w-[42px]! sm:w-[46px]! bg-slate-100! hover:bg-slate-200! dark:bg-[#20242d]! dark:hover:bg-slate-800/80! text-slate-600! dark:text-slate-400! border border-slate-200! dark:border-slate-700! rounded-lg!"
                  />
                </div>
              </div>
            )}
          />
          <Controller
            name="total_bultos"
            control={control}
            rules={{
              required: "El total de bultos es requerido",
              min: { value: 1, message: "El total de bultos debe ser mayor a 0" },
            }}
            render={({ field }) => (
              <InputText
                label="Total de bultos"
                labelClassName={labelClassName}
                isRequired
                type="number"
                placeholder="0"
                value={field.value}
                onChange={field.onChange}
                error={errors.total_bultos?.message}
                errorVariant="text"
                className={`${baseInputClasses} h-[42px]! sm:h-[46px]! px-3!`}
              />
            )}
          />
          <Controller
            name="total_weight"
            control={control}
            rules={{
              required: "El peso total es requerido",
              min: { value: 0.1, message: "El peso total debe ser mayor a 0" },
            }}
            render={({ field }) => (
              <InputText
                label="Peso total (kg)"
                labelClassName={labelClassName}
                isRequired
                type="number"
                placeholder="0"
                value={field.value}
                onChange={field.onChange}
                error={errors.total_weight?.message}
                errorVariant="text"
                className={`${baseInputClasses} h-[42px]! sm:h-[46px]! px-3!`}
              />
            )}
          />
          <Controller
            name="remitente"
            control={control}
            rules={{ required: "El remitente es requerido" }}
            render={({ field }) => (
              <InputText
                label="Remitente"
                labelClassName={labelClassName}
                isRequired
                placeholder="Nombre del remitente"
                value={field.value}
                onChange={field.onChange}
                error={errors.remitente?.message}
                errorVariant="text"
                className={`${baseInputClasses} h-[42px]! sm:h-[46px]! px-3!`}
              />
            )}
          />
          <div className="min-w-0">
            <Controller
              name="product_description"
              control={control}
              rules={{ required: "La descripción es requerida" }}
              render={({ field }) => (
                <Textarea
                  label="Descripción"
                  labelClassName={labelClassName}
                  isRequired
                  placeholder="Descripción de la mercancía"
                  value={field.value}
                  onChange={field.onChange}
                  maxLength={500}
                  rows={3}
                  error={errors.product_description?.message}
                />
              )}
            />
          </div>
          <div className="min-w-0">
            <Controller
              name="destination_area_observation"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Observaciones del área de destino"
                  labelClassName={labelClassName}
                  placeholder="Observaciones del área de destino"
                  value={field.value}
                  onChange={field.onChange}
                  maxLength={500}
                  rows={3}
                />
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex flex-col">
              <span className="text-[13px]! font-medium! text-slate-700! dark:text-slate-200!">
                Orden de servicio
              </span>
              {serviceOrder ? (
                <span className="text-[12px]! text-emerald-600! dark:text-emerald-400! font-semibold!">
                  OS: {serviceOrder.code}
                </span>
              ) : (
                <span className="text-[12px]! text-slate-500! dark:text-slate-400!">
                  Cree una orden de servicio para finalizar el llenado del detalle del DUCA
                </span>
              )}
            </div>
            <Button
              type="button"
              size="small"
              label="Crear orden de servicio"
              icon={<FilePlus2 size={14} />}
              ariaLabel="Crear orden de servicio"
              onClick={() => setOpenCreateServiceOrderModal(true)}
              className="text-[13px]! text-white! bg-amber-500! hover:bg-amber-600!"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-neutral-600">
          <Button
            type="button"
            size="medium"
            label="Restablecer"
            icon={<RotateCcw size={16} />}
            ariaLabel="Restablecer formulario del detalle del DUCA"
            onClick={() => {
              reset({
                merchandise_id: "",
                total_bultos: "0",
                total_weight: "0",
                product_description: "",
                remitente: "",
                destination_area_observation: "",
                registered_start_date: initialStartDate,
                registered_start_time: initialStartTime,
              });
              handleCloseAlert();
            }}
            disabled={CreateDucatRegistryDetail.isPending}
            className="w-full sm:w-auto text-[13px]! text-slate-600! dark:text-slate-300! bg-slate-100! dark:bg-slate-700! hover:bg-slate-200! dark:hover:bg-slate-600!"
          />
          <Button
            type="submit"
            size="medium"
            label="Guardar detalle del DUCA"
            icon={<Save size={16} />}
            ariaLabel="Guardar detalle del DUCA"
            isLoading={CreateDucatRegistryDetail.isPending}
            className="w-full sm:w-auto text-[13px]! text-white! bg-blue-600! hover:bg-blue-700!"
          />
        </div>
      </form>

      {openCreateServiceOrderModal && (
        <CreateServiceOrderModal
          isOpen={true}
          company_id={company_id}
          module_code={module_code}
          onClose={() => setOpenCreateServiceOrderModal(false)}
          onCreated={(createdServiceOrder) => {
            setServiceOrder(createdServiceOrder);
            setOpenCreateServiceOrderModal(false);
          }}
        />
      )}

      {openRegisterMerchandiseModal && (
        <RegisterMerchandiseModal
          isOpen={true}
          company_id={company_id}
          module_code={module_code}
          onClose={() => setOpenRegisterMerchandiseModal(false)}
          onCreated={() => setOpenRegisterMerchandiseModal(false)}
        />
      )}

      {AlertComponent}
    </div>
  );
}
