import { useEffect } from "react";
import {
  Accordion,
  Alert,
  AnimatedAlertWrapper,
  Button,
  Checkbox,
  Dropdown,
  InputText,
  Modal,
} from "@alpac/design-system";
import { AnimatePresence, m } from "framer-motion";
import { ChevronDown, Layers } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { SectionModalProps } from "./section-modal.types";
import {
  SectionStorageTypeEnum,
  SectionStorageTypeOptions,
} from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import {
  SectionTypeEnum,
  SectionTypeOptions,
} from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";
import {
  formatAmount,
  validateDecimalNumber,
  validateIntegerNumber,
  validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import {
  inputClassName,
  dropdownClassName,
  labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-modal/utils/style.sections";
import type { FormValues } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-modal/section-modal.types";
import {
  parseDecimal,
  overflowAccordionTransition,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-modal/utils/style.sections";

export const SectionModal = ({
  isOpen,
  spatialDraft,
  defaultStorageType,
  onClose,
  onSubmit,
}: SectionModalProps) => {
  const { alertState, handleCloseAlert } = useAlertState();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      section_type: SectionTypeEnum.Storage.value,
      storage_type: SectionStorageTypeEnum.Empty.value,
      is_elevated: false,
      overflow: {
        allows_overflow_storage: false,
        is_overflow_enabled: false,
      },
    },
  });

  useEffect(() => {
    if (spatialDraft) {
      setValue("width_metres", spatialDraft.width_metres);
      setValue("length_metres", spatialDraft.length_metres);
    }

    if (defaultStorageType) {
      const storageTypeOption = Object.values(SectionStorageTypeEnum).find(
        (option) => option.textValue === defaultStorageType,
      );

      if (storageTypeOption) {
        setValue("storage_type", storageTypeOption.value);
      }
    }
  }, [defaultStorageType, spatialDraft, setValue]);

  const sectionType = useWatch({ control, name: "section_type" });
  const storageType = useWatch({ control, name: "storage_type" });
  const isElevated = useWatch({ control, name: "is_elevated" });
  const isAisle = Number(sectionType) === SectionTypeEnum.Aisle.value;
  const isRackStorage =
    Number(storageType) === SectionStorageTypeEnum.Racks.value;

  useEffect(() => {
    if (isAisle) {
      setValue("storage_type", SectionStorageTypeEnum.Empty.value);
    }
  }, [isAisle, setValue]);

  useEffect(() => {
    if (!isRackStorage) {
      setValue("is_elevated", false);
      setValue("position_y_metres", 0);
    }
  }, [isRackStorage, setValue]);

  const handleCreateSection = (data: FormValues) => {
    onSubmit?.(data);
    onClose();
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
            type={alertState?.type ?? "info"}
            title={alertState?.title}
            message={alertState?.message ?? ""}
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
                disabled={isAisle}
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
            })}
            error={errors.length_metres?.message}
          />

          {isRackStorage ? (
            <Controller
              control={control}
              name="is_elevated"
              render={({ field }) => (
                <Checkbox
                  label="Elevar sobre una sección de tramos"
                  labelPosition="right"
                  className="text-slate-300!"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          ) : null}

          {isRackStorage && isElevated ? (
            <InputText
              label="Altura sobre el piso · Y (m)"
              type="text"
              inputMode="decimal"
              placeholder="Ej. 6.00"
              isRequired
              className={inputClassName}
              labelClassName={labelClassName}
              {...register("position_y_metres", {
                required: "La altura es requerida para una sección elevada",
                validate: {
                  validateDecimal: (value) =>
                    !value || validateDecimalNumber(value),
                  validatePositive: (value) =>
                    !value || validatePositiveNumber(value),
                },
                setValueAs: parseDecimal,
              })}
              error={errors.position_y_metres?.message}
            />
          ) : null}
        </div>

        <AnimatePresence initial={false}>
          {isAisle ? (
            <m.div
              key="overflow-capacity-accordion"
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 8, height: 0 }}
              transition={overflowAccordionTransition}
              className="mx-2 overflow-hidden sm:mx-0"
            >
              <Accordion
                title={
                  <span className="flex min-w-0 items-center gap-2">
                    <Layers
                      className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-300"
                      aria-hidden
                    />
                    <span>Capacidad de desborde (solo pasillos)</span>
                  </span>
                }
                defaultOpen
                icon={ChevronDown}
                className="rounded-md! border! border-slate-300! bg-transparent! dark:border-slate-600! dark:bg-[#272b34]! dark:hover:border-neutral-600!"
                triggerClassName="h-auto! min-h-10! rounded-md! bg-transparent! px-3! py-2.5! sm:px-4! dark:bg-transparent! hover:bg-slate-50! dark:hover:bg-white/5!"
                contentClassName="border-t border-slate-300 px-3 py-3 sm:px-4 sm:py-4 dark:border-slate-600"
              >
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
              </Accordion>
            </m.div>
          ) : null}
        </AnimatePresence>

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
            label="Colocar en plano"
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
          />
        </div>
      </form>
    </Modal>
  );
};
