import { useForm, Controller } from "react-hook-form";
import {
  Button,
  InputText,
  Modal,
} from "@alpac/design-system";
import { Plus } from "lucide-react";
import { useCustomer } from "@app/modules/warehouse/ui/hooks/useCustomer";
import type {
  RegisterCustomerTypeModalProps,
  RegisterCustomerTypeFormValues,
} from "./types/register-customer-type-modal.types";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { baseInputClasses } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/variants/global-variants";

const labelClassName =
  "text-slate-600! dark:text-slate-300! text-[13px]! font-medium!";

export function RegisterCustomerTypeModal({
  isOpen,
  company_id,
  module_code,
  onClose,
  onCreated,
}: RegisterCustomerTypeModalProps) {
  const { getMappedError } = useMappedError();
  const { handleRequestError, handleRequestSuccess, AlertComponent } = useAlertState();

  const { CreateCustomerType } = useCustomer();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterCustomerTypeFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      code: "",
      name: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    CreateCustomerType.mutateAsync({
      company_id,
      module_code,
      code: values.code,
      name: values.name,
    })
      .then((createdId) => {
        handleRequestSuccess("Tipo de cliente registrado correctamente.");
        reset();
        onCreated?.(createdId);
        setTimeout(() => {
          onClose();
        }, 500);
      })
      .catch((error) => {
        const mappedError = getMappedError(error as ApiErrorResponse);
        handleRequestError(
          mappedError?.description || "Error al registrar el tipo de cliente",
        );
      });
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar tipo de cliente"
      size="sm"
    >
      <div className="flex flex-col gap-4 min-w-0">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4">
            <Controller
              name="code"
              control={control}
              rules={{ required: "El código es requerido" }}
              render={({ field }) => (
                <InputText
                  label="Código"
                  labelClassName={labelClassName}
                  isRequired
                  placeholder="Ej. EXT, GOB, JURIDICO..."
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.code?.message}
                  errorVariant="text"
                  className={`${baseInputClasses} h-[42px]! sm:h-[46px]! px-3! uppercase`}
                />
              )}
            />

            <Controller
              name="name"
              control={control}
              rules={{ required: "El nombre es requerido" }}
              render={({ field }) => (
                <InputText
                  label="Nombre"
                  labelClassName={labelClassName}
                  isRequired
                  placeholder="Ej. Cliente Extranjero"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.name?.message}
                  errorVariant="text"
                  className={`${baseInputClasses} h-[42px]! sm:h-[46px]! px-3!`}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-neutral-600 mt-2">
            <Button
              type="button"
              size="medium"
              label="Cancelar"
              ariaLabel="Cancelar registro"
              onClick={onClose}
              disabled={CreateCustomerType.isPending}
              className="w-full sm:w-auto text-[13px]! text-slate-600! dark:text-slate-300! bg-slate-100! dark:bg-slate-700! hover:bg-slate-200! dark:hover:bg-slate-600!"
            />
            <Button
              type="submit"
              size="medium"
              label="Registrar"
              icon={<Plus size={16} />}
              ariaLabel="Guardar nuevo tipo"
              isLoading={CreateCustomerType.isPending}
              className="w-full sm:w-auto text-[13px]! text-white! bg-blue-600! hover:bg-blue-700!"
            />
          </div>
        </form>

        {AlertComponent}
      </div>
    </Modal>
  );
}
