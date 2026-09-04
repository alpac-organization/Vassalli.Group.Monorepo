import { useEffect } from "react";
import {
  Alert,
  AnimatedAlertWrapper,
  Button,
  Dropdown,
  InputText,
  Modal,
} from "@alpac/design-system";
import { Plus, Trash2 } from "lucide-react";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import type { RackModalProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/rack-modal/types/rack-modal.types";
import {
  RackStatusEnum,
  RackStatusOptions,
} from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import {
  RackUsageProfileEnum,
  RackUsageProfileOptions,
} from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";
import {
  formatAmount,
  validateDecimalNumber,
  validateIntegerNumber,
  validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/style.racks";
import type { FormValues } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/rack-modal/types/rack-modal.types";
import {
  parseDecimal,
  isUnavailableStatus,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/rack-modal/utils/rack.utils";

export const RackModal = ({
  isOpen,
  spatialDraft,
  onClose,
  onSubmit,
}: RackModalProps) => {
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
      shelf_code: "",
      levels: [
        {
          level_number: "1",
          usage_profile: RackUsageProfileEnum.ActiveFlow.value,
          max_pulleys: "2",
          status: RackStatusEnum.Available.value,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "levels",
  });

  const levelsWatch = useWatch({ control });
  const baseWidth = useWatch({
    control,
    name: "levels.0.width_metres",
  });
  const baseLength = useWatch({
    control,
    name: "levels.0.length_metres",
  });

  useEffect(() => {
    if (!spatialDraft) return;

    fields.forEach((_, index) => {
      setValue(
        `levels.${index}.width_metres`,
        spatialDraft.width_metres.toString(),
      );
      setValue(
        `levels.${index}.length_metres`,
        spatialDraft.length_metres.toString(),
      );
    });
  }, [fields, setValue, spatialDraft]);

  useEffect(() => {
    fields.slice(1).forEach((_, offset) => {
      const index = offset + 1;
      setValue(`levels.${index}.width_metres`, baseWidth);
      setValue(`levels.${index}.length_metres`, baseLength);
    });
  }, [baseLength, baseWidth, fields, setValue]);

  const handleCreateRacks = (data: FormValues) => {
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

  const handleAddLevel = () => {
    const nextLevel = fields.length + 1;
    append({
      level_number: String(nextLevel),
      width_metres: baseWidth,
      length_metres: baseLength,
      usage_profile: RackUsageProfileEnum.ActiveFlow.value,
      max_pulleys: "2",
      status: RackStatusEnum.Available.value,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registro de racks"
      variant="form"
      size="7xl"
      description="Defina la base del rack y sus niveles. Después podrá ubicarla con precisión en el plano."
    >
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(handleCreateRacks)}
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
          <InputText
            label="Código del estante"
            placeholder="Ej. EST-01"
            isRequired
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("shelf_code", {
              required: "El código del estante es requerido",
            })}
            error={errors.shelf_code?.message}
          />
        </div>

        <div className="flex flex-col gap-6">
          {fields.map((field, index) => {
            const levelStatus = Number(levelsWatch?.levels?.[index]?.status);
            const showUnavailableReason = isUnavailableStatus(levelStatus);

            return (
              <div
                key={field.id}
                className="rounded-md border border-slate-600 dark:border-neutral-600 dark:bg-[#272b34]! p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-black dark:text-white">
                    Nivel #{index + 1}
                    {index === 0
                      ? " (base que se ubicará en el plano 2D)"
                      : " (apilado sobre el nivel 1)"}
                  </p>
                  {fields.length > 1 && index > 0 && (
                    <Button
                      type="button"
                      size="small"
                      label="Eliminar"
                      icon={<Trash2 size={14} />}
                      onClick={() => remove(index)}
                      className="text-[13px]! rounded-md! bg-red-600/15! border! border-red-700/40! text-red-400! hover:bg-red-600/25!"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <InputText
                    label="Nivel"
                    type="text"
                    inputMode="numeric"
                    placeholder="1"
                    isRequired
                    readOnly
                    className={inputClassName}
                    labelClassName={labelClassName}
                    {...register(`levels.${index}.level_number`, {
                      required: "El nivel es requerido",
                      validate: {
                        validateInteger: (value) =>
                          !value || validateIntegerNumber(value),
                        validatePositive: (value) =>
                          !value || validatePositiveNumber(value),
                      },
                      setValueAs: parseDecimal,
                    })}
                    error={errors.levels?.[index]?.level_number?.message}
                  />

                  <InputText
                    label="Ancho (m)"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    isRequired
                    readOnly={index > 0}
                    className={inputClassName}
                    labelClassName={labelClassName}
                    {...register(`levels.${index}.width_metres`, {
                      required: "El ancho es requerido",
                      validate: {
                        validateDecimal: (value) =>
                          !value || validateDecimalNumber(value),
                        validatePositive: (value) =>
                          !value || validatePositiveNumber(value),
                      },
                      setValueAs: parseDecimal,
                    })}
                    error={errors.levels?.[index]?.width_metres?.message}
                  />

                  <InputText
                    label="Largo (m)"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    isRequired
                    readOnly={index > 0}
                    className={inputClassName}
                    labelClassName={labelClassName}
                    {...register(`levels.${index}.length_metres`, {
                      required: "El largo es requerido",
                      validate: {
                        validateDecimal: (value) =>
                          !value || validateDecimalNumber(value),
                        validatePositive: (value) =>
                          !value || validatePositiveNumber(value, true),
                      },
                      setValueAs: parseDecimal,
                    })}
                    error={errors.levels?.[index]?.length_metres?.message}
                  />

                  <InputText
                    label="Altura (m)"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    isRequired
                    className={inputClassName}
                    labelClassName={labelClassName}
                    {...register(`levels.${index}.height_metres`, {
                      required: "La altura es requerida para calcular el nivel Y",
                      validate: {
                        validateDecimal: (value) =>
                          !value || validateDecimalNumber(value),
                        validatePositive: (value) =>
                          !value || validatePositiveNumber(value),
                      },
                      setValueAs: parseDecimal,
                      onChange: (evt) => {
                        evt.target.value = formatAmount(
                          evt.target.value,
                          10,
                          2,
                        );
                      },
                    })}
                    error={errors.levels?.[index]?.height_metres?.message}
                  />

                  <Controller
                    control={control}
                    name={`levels.${index}.usage_profile`}
                    rules={{ required: "El perfil de uso es requerido" }}
                    render={({ field: profileField }) => (
                      <Dropdown
                        label="Perfil de uso"
                        placeholder="Seleccione..."
                        isRequired
                        options={RackUsageProfileOptions}
                        value={profileField.value}
                        appearance="dark"
                        className={dropdownClassName}
                        labelClassName={labelClassName}
                        onChange={(val) => profileField.onChange(val)}
                        error={errors.levels?.[index]?.usage_profile?.message}
                      />
                    )}
                  />

                  <InputText
                    label="Máximo de polines"
                    type="text"
                    inputMode="numeric"
                    placeholder="2"
                    isRequired
                    className={inputClassName}
                    labelClassName={labelClassName}
                    {...register(`levels.${index}.max_pulleys`, {
                      required: "El máximo de polines es requerido",
                      validate: {
                        validateInteger: (value) =>
                          !value || validateIntegerNumber(value),
                        validatePositive: (value) =>
                          !value || validatePositiveNumber(value),
                      },
                      setValueAs: parseDecimal,
                    })}
                    error={errors.levels?.[index]?.max_pulleys?.message}
                  />

                  <Controller
                    control={control}
                    name={`levels.${index}.status`}
                    rules={{ required: "El estado es requerido" }}
                    render={({ field: statusField }) => (
                      <Dropdown
                        label="Estado"
                        placeholder="Seleccione..."
                        isRequired
                        options={RackStatusOptions}
                        value={statusField.value}
                        appearance="dark"
                        className={dropdownClassName}
                        labelClassName={labelClassName}
                        onChange={(val) => statusField.onChange(val)}
                        error={errors.levels?.[index]?.status?.message}
                      />
                    )}
                  />

                  {showUnavailableReason && (
                    <InputText
                      label="Motivo de indisponibilidad"
                      placeholder="Ej. Estructura dañada, en reparación"
                      isRequired
                      className={inputClassName}
                      labelClassName={labelClassName}
                      {...register(`levels.${index}.unavailable_reason`, {
                        required: "El motivo es requerido para este estado",
                      })}
                      error={
                        errors.levels?.[index]?.unavailable_reason?.message
                      }
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <Button
            type="button"
            size="medium"
            label="Agregar nivel"
            icon={<Plus size={16} />}
            onClick={handleAddLevel}
            className="text-[14px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30!"
          />
        </div>

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
