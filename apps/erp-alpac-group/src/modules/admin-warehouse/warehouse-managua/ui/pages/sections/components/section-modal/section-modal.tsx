import { useEffect } from "react";
import {
  Alert,
  AnimatedAlertWrapper,
  Button,
  Checkbox,
  Dropdown,
  InputText,
  Modal,
} from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import type { SectionModalProps } from "./section-modal.types";
import {
  SectionStorageTypeEnum,
  SectionStorageTypeOptions,
} from "@app/modules/warehouse/domain/enums/section-storage-type.enum";
import {
  SectionTypeEnum,
  SectionTypeOptions,
} from "@app/modules/warehouse/domain/enums/section-type.enum";
import type { CreateSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-section-req";
import {
  formatAmount,
  validateDecimalNumber,
  validateIntegerNumber,
  validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import { useWarehouseAdmin } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useWarehouseAdmin";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import {
  inputClassName,
  dropdownClassName,
  labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-modal/utils/style.sections";

const parseDecimal = (value: unknown) => {
  const trimmed = String(value ?? "").trim();
  return trimmed ? parseFloat(trimmed.replace(/,/g, "")) : undefined;
};

type FormValues = {
  code: string;
  name: string;
  section_type: number;
  storage_type: number;
  width_metres?: number;
  length_metres?: number;
  overflow: {
    allows_overflow_storage: boolean;
    is_overflow_enabled: boolean;
    max_overflow_polines?: number;
  };
};

export const SectionModal = ({
  isOpen,
  warehouseId,
  onClose,
  onSubmit,
}: SectionModalProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const {
    alertState,
    handleCloseAlert,
    handleRequestError,
    handleRequestSuccess,
  } = useAlertState();

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      section_type: SectionTypeEnum.Storage.value,
      storage_type: SectionStorageTypeEnum.Empty.value,
      overflow: {
        allows_overflow_storage: false,
        is_overflow_enabled: false,
      },
    },
  });

  const { CreateSection } = useWarehouseAdmin();

  const isAisle = Number(watch("section_type")) === SectionTypeEnum.Aisle.value;

  const handleCreateSection = (data: FormValues) => {
    const sectionTypeOption = Object.values(SectionTypeEnum).find(
      (option) => option.value === Number(data.section_type),
    );
    const storageTypeOption = Object.values(SectionStorageTypeEnum).find(
      (option) => option.value === Number(data.storage_type),
    );

    const payload: CreateSectionRequest = {
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
      code: data.code,
      name: data.name,
      section_type: sectionTypeOption
        ? sectionTypeOption.textValue
        : SectionTypeEnum.Storage.textValue,
      storage_type: storageTypeOption
        ? storageTypeOption.textValue
        : SectionStorageTypeEnum.Empty.textValue,
      width_metres: data.width_metres ?? 0,
      length_metres: data.length_metres ?? 0,
      overflow_capacity: isAisle
        ? {
            allows_overflow_storage: data.overflow.allows_overflow_storage,
            is_overflow_enabled: data.overflow.is_overflow_enabled,
            max_overflow_polines: data.overflow.max_overflow_polines ?? null,
          }
        : null,
    };

    CreateSection.mutate(payload, {
      onSuccess() {
        handleRequestSuccess("Sección registrada exitosamente.");
        reset();
        onSubmit?.(payload);

        setTimeout(() => {
          onClose();
        }, 2000);
      },
      onError(error) {
        const mappedError = getMappedError(error);
        handleRequestError(mappedError.description);
      },
    });
  };

  const handleClose = () => {
    handleCloseAlert();
    reset();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registro de nueva sección"
      variant="form"
      size="6xl"
      description="Complete el registro de la sección del almacén"
    >
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(handleCreateSection)}
      >
        <AnimatedAlertWrapper open={alertState?.open ?? false}>
          <Alert
            type={alertState?.type!}
            title={alertState?.title}
            message={alertState?.message!}
            onClose={handleCloseAlert}
          />
        </AnimatedAlertWrapper>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Controller
            control={control}
            name="code"
            rules={{ required: "El código es requerido" }}
            render={({ field }) => (
              <InputText
                label="Código"
                placeholder="Ej. SEC-001"
                isRequired
                className={inputClassName}
                labelClassName={labelClassName}
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.code?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="name"
            rules={{ required: "El nombre es requerido" }}
            render={({ field }) => (
              <InputText
                label="Nombre de la sección"
                placeholder="Ej. Sección A - Almacenamiento General"
                isRequired
                className={inputClassName}
                labelClassName={labelClassName}
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="section_type"
            rules={{ required: "El tipo de sección es requerido" }}
            render={({ field }) => (
              <Dropdown
                label="Tipo de sección"
                placeholder="Seleccione..."
                isRequired
                options={SectionTypeOptions}
                value={field.value}
                appearance="dark"
                className={dropdownClassName}
                labelClassName={labelClassName}
                onChange={(val) => field.onChange(val)}
                error={errors.section_type?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="storage_type"
            rules={{ required: "El tipo de almacenamiento es requerido" }}
            render={({ field }) => (
              <Dropdown
                label="Tipo de almacenamiento"
                placeholder="Seleccione..."
                isRequired
                options={SectionStorageTypeOptions}
                value={field.value}
                appearance="dark"
                className={dropdownClassName}
                labelClassName={labelClassName}
                onChange={(val) => field.onChange(val)}
                error={errors.storage_type?.message}
              />
            )}
          />

          <InputText
            label="Ancho (m)"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            isRequired
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("width_metres", {
              required: "El ancho es requerido",
              validate: {
                validateDecimal: (value) =>
                  !value || validateDecimalNumber(value),
                validatePositive: (value) =>
                  !value || validatePositiveNumber(value),
              },
              setValueAs: parseDecimal,
              onChange: (evt) => {
                evt.target.value = formatAmount(evt.target.value, 10, 2);
              },
            })}
            error={errors.width_metres?.message}
          />

          <InputText
            label="Largo (m)"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            isRequired
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("length_metres", {
              required: "El largo es requerido",
              validate: {
                validateDecimal: (value) =>
                  !value || validateDecimalNumber(value),
                validatePositive: (value) =>
                  !value || validatePositiveNumber(value, true),
              },
              setValueAs: parseDecimal,
              onChange: (evt) => {
                evt.target.value = formatAmount(evt.target.value, 10, 2);
              },
            })}
            error={errors.length_metres?.message}
          />
        </div>

        {isAisle && (
          <div className="rounded-xl border border-[#2a2d3d] bg-[#1b1e27] p-4">
            <p className="mb-3 text-sm font-medium text-slate-300">
              Capacidad de desborde (solo pasillos)
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Controller
                control={control}
                name="overflow.allows_overflow_storage"
                render={({ field }) => (
                  <Checkbox
                    label="Permite almacenamiento de desborde"
                    labelPosition="right"
                    className="text-slate-300!"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="overflow.is_overflow_enabled"
                render={({ field }) => (
                  <Checkbox
                    label="Desborde habilitado"
                    labelPosition="right"
                    className="text-slate-300!"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <InputText
                label="Máximo de polines"
                type="text"
                inputMode="numeric"
                placeholder="0"
                className={inputClassName}
                labelClassName={labelClassName}
                {...register("overflow.max_overflow_polines", {
                  validate: {
                    validateInteger: (value) =>
                      value === undefined ||
                      value === null ||
                      validateIntegerNumber(value),
                    validatePositive: (value) =>
                      value === undefined ||
                      value === null ||
                      validatePositiveNumber(value, true),
                  },
                  setValueAs: parseDecimal,
                  onChange: (evt) => {
                    evt.target.value = formatAmount(evt.target.value, 6, 0);
                  },
                })}
                error={errors.overflow?.max_overflow_polines?.message}
              />
            </div>
          </div>
        )}

        <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6" />

        <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleClose}
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
          />
          <Button
            type="submit"
            size="giant"
            label="Guardar"
            isLoading={CreateSection.isPending}
            disabled={CreateSection.isPending}
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
          />
        </div>
      </form>
    </Modal>
  );
};
