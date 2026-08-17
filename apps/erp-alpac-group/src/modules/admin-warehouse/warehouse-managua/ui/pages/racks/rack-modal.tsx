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
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { RackModalProps } from "./rack-modal.types";
import {
  RackStatusEnum,
  RackStatusOptions,
} from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import {
  RackUsageProfileEnum,
  RackUsageProfileOptions,
} from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";
import type {
  CreateRacksRequest,
  RackLevelSpecRequest,
} from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-racks-req";
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
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/style.racks";

const parseDecimal = (value: unknown) => {
  const trimmed = String(value ?? "").trim();
  return trimmed ? parseFloat(trimmed.replace(/,/g, "")) : undefined;
};

type RackLevelFormValues = {
  level_number?: string;
  racks_count?: string;
  width_metres?: string;
  length_metres?: string;
  height_metres?: string;
  usage_profile: number;
  max_pulleys?: string;
  status: number;
  unavailable_reason?: string;
};

type FormValues = {
  shelf_code: string;
  starting_deposit_number?: string;
  levels: RackLevelFormValues[];
};

const isUnavailableStatus = (status: number) =>
  status === RackStatusEnum.UnderMaintenance.value ||
  status === RackStatusEnum.Blocked.value;

export const RackModal = ({
  isOpen,
  sectionId,
  onClose,
  onSubmit,
}: RackModalProps) => {
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

  const { CreateRacks } = useWarehouseAdmin();

  const handleCreateRacks = (data: FormValues) => {
    const levels: RackLevelSpecRequest[] = data.levels.map((level) => {
      const usageProfileOption = Object.values(RackUsageProfileEnum).find(
        (option) => option.value === Number(level.usage_profile),
      );
      const statusOption = Object.values(RackStatusEnum).find(
        (option) => option.value === Number(level.status),
      );

      return {
        level_number: Number(level.level_number),
        racks_count: Number(level.racks_count),
        width_metres: Number(level.width_metres),
        length_metres: Number(level.length_metres),
        height_metres: level.height_metres ? Number(level.height_metres) : null,
        usage_profile: usageProfileOption
          ? usageProfileOption.textValue
          : RackUsageProfileEnum.ActiveFlow.textValue,
        max_pulleys: Number(level.max_pulleys),
        status: statusOption
          ? statusOption.textValue
          : RackStatusEnum.Available.textValue,
        unavailable_reason: isUnavailableStatus(Number(level.status))
          ? (level.unavailable_reason ?? null)
          : null,
      };
    });

    const payload: CreateRacksRequest = {
      company_id: companyId,
      module_code: moduleCode,
      section_id: sectionId,
      shelf_code: data.shelf_code ?? null,
      starting_deposit_number: data.starting_deposit_number
        ? Number(data.starting_deposit_number)
        : null,
      levels,
    };

    CreateRacks.mutate(payload, {
      onSuccess() {
        handleRequestSuccess("Racks registrados exitosamente.");
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
      title="Registro de racks"
      variant="form"
      size="7xl"
      description="Registre los estantes y niveles de racks para la sección"
    >
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(handleCreateRacks)}
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
          <InputText
            label="Código del estante"
            placeholder="Ej. EST-01"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("shelf_code")}
            error={errors.shelf_code?.message}
          />

          <InputText
            label="Número de depósito inicial"
            type="text"
            inputMode="numeric"
            placeholder="1"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("starting_deposit_number", {
              validate: {
                validateInteger: (value) =>
                  value === undefined ||
                  value === null ||
                  value === "" ||
                  validateIntegerNumber(value),
                validatePositive: (value) =>
                  value === undefined ||
                  value === null ||
                  value === "" ||
                  validatePositiveNumber(value),
              },
              setValueAs: parseDecimal,
            })}
            error={errors.starting_deposit_number?.message}
          />
        </div>

        <div className="flex flex-col gap-6">
          {fields.map((field, index) => {
            const levelStatus = Number(watch(`levels.${index}.status`));
            const showUnavailableReason = isUnavailableStatus(levelStatus);

            return (
              <div
                key={field.id}
                className="rounded-md border border-slate-600 dark:border-neutral-600 dark:bg-[#272b34]! p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-black dark:text-white">
                    Nivel #{index + 1}
                  </p>
                  {fields.length > 1 && (
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
                    label="Cantidad de racks"
                    type="text"
                    inputMode="numeric"
                    placeholder="5"
                    isRequired
                    className={inputClassName}
                    labelClassName={labelClassName}
                    {...register(`levels.${index}.racks_count`, {
                      required: "La cantidad de racks es requerida",
                      validate: {
                        validateInteger: (value) =>
                          !value || validateIntegerNumber(value),
                        validatePositive: (value) =>
                          !value || validatePositiveNumber(value),
                      },
                      setValueAs: parseDecimal,
                    })}
                    error={errors.levels?.[index]?.racks_count?.message}
                  />

                  <InputText
                    label="Ancho (m)"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    isRequired
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
                      onChange: (evt) => {
                        evt.target.value = formatAmount(evt.target.value, 10, 2);
                      },
                    })}
                    error={errors.levels?.[index]?.width_metres?.message}
                  />

                  <InputText
                    label="Largo (m)"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    isRequired
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
                      onChange: (evt) => {
                        evt.target.value = formatAmount(evt.target.value, 10, 2);
                      },
                    })}
                    error={errors.levels?.[index]?.length_metres?.message}
                  />

                  <InputText
                    label="Altura (m)"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    className={inputClassName}
                    labelClassName={labelClassName}
                    {...register(`levels.${index}.height_metres`, {
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
            onClick={() =>
              append({
                usage_profile: RackUsageProfileEnum.ActiveFlow.value,
                max_pulleys: "2",
                status: RackStatusEnum.Available.value,
              })
            }
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
            label="Guardar"
            isLoading={CreateRacks.isPending}
            disabled={CreateRacks.isPending}
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
          />
        </div>
      </form>
    </Modal>
  );
};
