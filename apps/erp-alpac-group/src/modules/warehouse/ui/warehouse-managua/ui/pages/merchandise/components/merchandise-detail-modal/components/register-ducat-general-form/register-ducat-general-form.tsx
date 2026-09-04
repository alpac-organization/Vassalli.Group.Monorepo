import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import {
  Button,
  Checkbox,
  Dropdown,
  Textarea,
} from "@alpac/design-system";
import { ClipboardCheck, Plus, RotateCcw } from "lucide-react";
import { useMerchandise } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useMerchandise";
import type {
  RegisterDucatGeneralFormValues,
  RegisterDucatGeneralFormProps,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/register-ducat-general-form/types/register-ducat-general-form.types";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { fieldsGridClasses } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/variants/global-variants";
import type { GetShippingCompanyResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-shipping-company";
import { RegisterNavieraModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/register-naviera-modal/register-naviera-modal";

const labelClassName =
  "text-slate-600! dark:text-slate-300! text-[13px]! font-medium!";

export function RegisterDucatGeneralForm({
  reception_id,
  company_id,
  module_code,
  startedAt,
  onSuccess,
  onError,
}: RegisterDucatGeneralFormProps) {
  const { getMappedError } = useMappedError();
  const { handleCloseAlert, handleRequestError, handleRequestSuccess, AlertComponent } =
    useAlertState();

  const { CreateDucatRegistry, GetShippingCompany } = useMerchandise({
    payloadGetShippingCompany: { company_id, module_code },
  });
  const { data: ShippingCompany } = GetShippingCompany;

  const [isNavieraModalOpen, setIsNavieraModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<RegisterDucatGeneralFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      shipping_company_id: "",
      general_observations: "",
      is_in_transit: false,
    },
  });

  const shippingOptions = useMemo<{ value: string; label: string }[]>(() => {
    if (!Array.isArray(ShippingCompany)) return [];
    return ShippingCompany.map((company: GetShippingCompanyResponse) => ({
      value: company.id,
      label: company.name,
    }));
  }, [ShippingCompany]);

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={handleSubmit((values) =>
          CreateDucatRegistry.mutateAsync({
            company_id,
            module_code,
            reception_id,
            shipping_company_id: values.shipping_company_id,
            general_observations: values.general_observations,
            is_in_transit: values.is_in_transit,
            registered_start_date: startedAt?.start_date || dayjs().format("YYYY-MM-DD"),
            registered_start_time: startedAt?.start_time || dayjs().format("HH:mm:ss"),
          })
            .then(() => {
              if (onSuccess) {
                onSuccess("Detalle general del DUCA registrado correctamente.");
              } else {
                handleRequestSuccess("Detalle general del DUCA registrado correctamente.");
              }
            })
            .catch((error) => {
              const mappedError = getMappedError(error as ApiErrorResponse);
              const errorMsg = mappedError?.description || "Error al registrar el detalle general del DUCA";
              if (onError) {
                onError(errorMsg);
              } else {
                handleRequestError(errorMsg);
              }
            }),
        )}
        className="flex flex-col gap-4"
      >
        <div className={`min-w-0 pt-1 sm:pt-2 ${fieldsGridClasses}`}>
          <div className="min-w-0">
            <Controller
              name="shipping_company_id"
              control={control}
              rules={{ required: "La naviera es requerida" }}
              render={({ field }) => (
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0 relative">
                    <Dropdown
                      appearance="dark"
                      label="Naviera"
                      labelClassName={labelClassName}
                      isRequired
                      placeholder="Seleccione naviera"
                      options={shippingOptions}
                      value={field.value}
                      onChange={field.onChange}
                      errorVariant="text"
                    />
                  </div>
                  <div className="flex shrink-0 mt-[24px] sm:mt-[26px]">
                    <Button
                      type="button"
                      tooltip="Registrar nueva naviera"
                      onClick={() => setIsNavieraModalOpen(true)}
                      icon={<Plus size={16} />}
                      className="h-[42px]! sm:h-[46px]! w-[42px]! sm:w-[46px]! bg-slate-100! hover:bg-slate-200! dark:bg-[#20242d]! dark:hover:bg-slate-800/80! text-slate-600! dark:text-slate-400! border border-slate-200! dark:border-slate-700! rounded-lg!"
                    />
                  </div>
                </div>
              )}
            />
          </div>

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

          <div className="min-w-0 flex items-center pt-2 sm:pt-6">
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
                shipping_company_id: "",
                general_observations: "",
                is_in_transit: false,
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
            isLoading={CreateDucatRegistry.isPending}
            className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
          />
        </div>
      </form>

      {isNavieraModalOpen && (
        <RegisterNavieraModal
          isOpen={true}
          company_id={company_id}
          module_code={module_code}
          onClose={() => setIsNavieraModalOpen(false)}
        />
      )}

      {AlertComponent}
    </div>
  );
}
