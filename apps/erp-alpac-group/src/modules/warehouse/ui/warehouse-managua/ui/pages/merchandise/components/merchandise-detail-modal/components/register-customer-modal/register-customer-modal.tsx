import { useMemo, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Dropdown,
  InputText,
  Modal,
  type Option,
} from "@alpac/design-system";
import { UserRoundPlus, Plus } from "lucide-react";
import { useCustomer } from "@app/modules/warehouse/ui/hooks/useCustomer";
import type {
  RegisterCustomerModalProps,
  RegisterCustomerFormValues,
} from "./types/register-customer-modal.types";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { baseInputClasses } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/variants/global-variants";
import { IdentificationTypeOptions } from "@app/modules/warehouse/domain/enums/customer.enum";
import type { GetCustomerTypesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/customer-responses/get-customer-types.response";
import { ImageUploader } from "@app/shared/components/image-uploader/image-uploader";
import type { ImageOutput } from "@app/shared/components/image-uploader/image-uploader.types";

const labelClassName =
  "text-slate-600! dark:text-slate-300! text-[13px]! font-medium!";

export function RegisterCustomerModal({
  isOpen,
  company_id,
  module_code,
  onClose,
  onCreated,
  onRequestRegisterCustomerType,
  newlyCreatedCustomerTypeId,
}: RegisterCustomerModalProps) {
  const [pictureImages, setPictureImages] = useState<ImageOutput[]>([]);
  const { getMappedError } = useMappedError();
  const { handleRequestError, handleRequestSuccess, AlertComponent } = useAlertState();

  const { CreateCustomer, GetCustomerTypes } = useCustomer();
  const { data: customerTypesData, refetch: refetchCustomerTypes } = GetCustomerTypes({ company_id, module_code });

  const customerTypeOptions = useMemo<Option[]>(() => {
    if (!Array.isArray(customerTypesData)) return [];
    
    return customerTypesData
      .filter((ct: GetCustomerTypesResponse) => ct.is_active === true)
      .map((ct: GetCustomerTypesResponse) => ({
        value: ct.customer_type_id,
        label: ct.name,
      }));
  }, [customerTypesData]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RegisterCustomerFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      cif: "",
      legal_name: "",
      identification_number: "",
      identification_type: 1,
      customer_type_id: "",
      picture_base64: "",
    },
  });


  useEffect(() => {
    if (newlyCreatedCustomerTypeId) {
      refetchCustomerTypes().then(() => {
        setValue("customer_type_id", newlyCreatedCustomerTypeId, { shouldValidate: true });
      });
    }
  }, [newlyCreatedCustomerTypeId, refetchCustomerTypes, setValue]);

  const handlePictureSelect = (images: ImageOutput[]) => {
    setPictureImages(images);
    if (images.length > 0) {
      const img = images[0];
      const fullBase64 = `data:${img.contentType};base64,${img.base64}`;
      setValue("picture_base64", fullBase64, { shouldValidate: true, shouldDirty: true });
    } else {
      setValue("picture_base64", "", { shouldValidate: true, shouldDirty: true });
    }
  };

  const onSubmit = handleSubmit((values) => {
    CreateCustomer.mutateAsync({
      company_id,
      module_code,
      cif: values.cif,
      legal_name: values.legal_name,
      identification_number: values.identification_number,
      identification_type: values.identification_type,
      customer_type_id: values.customer_type_id,
      picture_base64: values.picture_base64 || null,
    })
      .then((createdId) => {
        handleRequestSuccess("Cliente registrado correctamente.");
        reset();
        setPictureImages([]);
        onCreated?.(createdId);
        setTimeout(() => {
          onClose();
        }, 500);
      })
      .catch((error) => {
        const mappedError = getMappedError(error as ApiErrorResponse);
        handleRequestError(
          mappedError?.description || "Error al registrar el cliente",
        );
      });
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar cliente nuevo"
      size="lg"
    >
      <div className="flex flex-col gap-4 min-w-0">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="legal_name"
              control={control}
              rules={{ required: "El nombre legal es requerido" }}
              render={({ field }) => (
                <InputText
                  label="Nombre legal"
                  labelClassName={labelClassName}
                  isRequired
                  placeholder="Ej. Carlos Mendoza"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.legal_name?.message}
                  errorVariant="text"
                  className={`${baseInputClasses} h-[42px]! sm:h-[46px]! px-3!`}
                />
              )}
            />
            <Controller
              name="cif"
              control={control}
              rules={{ required: "El CIF es requerido" }}
              render={({ field }) => (
                <InputText
                  label="CIF"
                  labelClassName={labelClassName}
                  isRequired
                  placeholder="Ej. CIF-168256"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.cif?.message}
                  errorVariant="text"
                  className={`${baseInputClasses} h-[42px]! sm:h-[46px]! px-3!`}
                />
              )}
            />
            <Controller
              name="identification_type"
              control={control}
              rules={{ required: "El tipo de identificación es requerido" }}
              render={({ field }) => (
                <Dropdown
                  appearance="dark"
                  label="Tipo de Identificación"
                  labelClassName={labelClassName}
                  isRequired
                  placeholder="Seleccione el tipo"
                  options={IdentificationTypeOptions}
                  value={field.value}
                  onChange={(val) => field.onChange(Number(val))}
                  error={errors.identification_type?.message}
                  errorVariant="text"
                />
              )}
            />
            <Controller
              name="identification_number"
              control={control}
              rules={{ required: "El número es requerido" }}
              render={({ field }) => (
                <InputText
                  label="No. Identificación"
                  labelClassName={labelClassName}
                  isRequired
                  placeholder="Ej. 001-150892-0003X"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.identification_number?.message}
                  errorVariant="text"
                  className={`${baseInputClasses} h-[42px]! sm:h-[46px]! px-3!`}
                />
              )}
            />

            <div className="sm:col-span-2">
              <Controller
                name="customer_type_id"
                control={control}
                rules={{ required: "El tipo de cliente es requerido" }}
                render={({ field }) => (
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <Dropdown
                        label="Tipo de Cliente"
                        appearance="dark"
                        labelClassName={labelClassName}
                        isRequired
                        placeholder="Seleccione el tipo de cliente"
                        options={customerTypeOptions}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.customer_type_id?.message}
                        errorVariant="text"
                      />
                    </div>
                    <div className="flex shrink-0 mt-[24px] sm:mt-[26px]">
                      <Button
                        type="button"
                        tooltip="Registrar tipo de cliente"
                        onClick={() => onRequestRegisterCustomerType?.()}
                        icon={<Plus size={16} />}
                        className="h-[42px]! sm:h-[46px]! w-[42px]! sm:w-[46px]! bg-slate-100! hover:bg-slate-200! dark:bg-[#20242d]! dark:hover:bg-slate-800/80! text-slate-600! dark:text-slate-400! border border-slate-200! dark:border-slate-700! rounded-lg!"
                      />
                    </div>
                  </div>
                )}
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUploader
                value={pictureImages}
                label="Fotografía del cliente (Opcional)"
                title="Sube o arrastra una imagen"
                maxFiles={1}
                maxSizeMB={5}
                onChange={handlePictureSelect}
                error={errors.picture_base64?.message}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-neutral-600 mt-2">
            <Button
              type="button"
              size="medium"
              label="Cancelar"
              ariaLabel="Cancelar registro de cliente"
              onClick={onClose}
              disabled={CreateCustomer.isPending}
              className="w-full sm:w-auto text-[13px]! text-slate-600! dark:text-slate-300! bg-slate-100! dark:bg-slate-700! hover:bg-slate-200! dark:hover:bg-slate-600!"
            />
            <Button
              type="submit"
              size="medium"
              label="Registrar cliente"
              icon={<UserRoundPlus size={16} />}
              ariaLabel="Guardar nuevo cliente"
              isLoading={CreateCustomer.isPending}
              className="w-full sm:w-auto text-[13px]! text-white! bg-blue-600! hover:bg-blue-700!"
            />
          </div>
        </form>

        {AlertComponent}
      </div>
    </Modal>
  );
}
