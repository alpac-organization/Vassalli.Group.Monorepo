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
import type { LotModalProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/lot-modal/types/lot-modal.types";
import {
  RackStatusEnum,
  RackStatusOptions,
} from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import type {
  CreateLotsRequest,
  LotPlacementCommand,
} from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";
import {
  validateIntegerNumber,
  validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import { getDecimalFieldConfig } from "@app/shared/utils/get-decimal.config";
import { useWarehouseAdmin } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useWarehouseAdmin";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/lot-modal/utils/style.lots";
import type { FormValues } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/lot-modal/types/lot-modal.types";
import {
  parseDecimal,
  isUnavailableStatus,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/lot-modal/utils/lots.utils";

export const LotModal = ({
  isOpen,
  sectionId,
  spatialDraft,
  onClose,
  onSubmit,
}: LotModalProps) => {
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
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      code: "",
      allows_stacking: true,
      status: RackStatusEnum.Available.value,
    },
  });

  const statusWatch = watch("status");
  const showUnavailableReason = isUnavailableStatus(Number(statusWatch));

  const { CreateLots } = useWarehouseAdmin();

  useEffect(() => {
    if (spatialDraft) {
      setValue("width_metres", spatialDraft.width_metres.toString());
      setValue("length_metres", spatialDraft.length_metres.toString());
    }
  }, [spatialDraft, setValue]);

  const handleCreateLots = (data: FormValues) => {
    const statusOption = Object.values(RackStatusEnum).find(
      (option) => option.value === Number(data.status),
    );
    const status = statusOption
      ? statusOption.textValue
      : RackStatusEnum.Available.textValue;

    const placement: LotPlacementCommand = {
      code: data.code.trim(),
      width_metres: Number(data.width_metres),
      length_metres: Number(data.length_metres),
      nominal_rows: Number(data.nominal_rows),
      nominal_columns: Number(data.nominal_columns),
      allows_stacking: data.allows_stacking,
      status,
      layout_transform_3d_dto: spatialDraft
        ? {
            position_x: spatialDraft.position_x,
            position_y: 0,
            position_z: spatialDraft.position_z,
            rotation_y: spatialDraft.rotation_y,
          }
        : null,
      unavailable_reason: isUnavailableStatus(Number(data.status))
        ? (data.unavailable_reason ?? null)
        : null,
    };

    const payload: CreateLotsRequest = {
      company_id: companyId,
      module_code: moduleCode,
      section_id: sectionId,
      placements_lots: [placement],
    };

    CreateLots.mutate(payload, {
      onSuccess() {
        handleRequestSuccess("Tramo registrado exitosamente.");
        reset();
        onSubmit?.(payload);

        setTimeout(() => {
          onClose();
        }, 1000);
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
      title="Registro de tramo"
      variant="form"
      size="5xl"
      description="Complete los datos del tramo dibujado en el plano 2D"
    >
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(handleCreateLots)}
      >
        <AnimatedAlertWrapper open={alertState?.open ?? false}>
          <Alert
            type={alertState?.type ?? "info"}
            title={alertState?.title}
            message={alertState?.message ?? ""}
            onClose={handleCloseAlert}
          />
        </AnimatedAlertWrapper>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <InputText
            label="Código del tramo"
            placeholder="Ej. LOT-A1"
            isRequired
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("code", {
              required: "El código es requerido",
              validate: {
                notEmpty: (value) =>
                  value.trim().length > 0 || "El código es requerido",
              },
            })}
            error={errors.code?.message}
          />

          <InputText
            label="Ancho (m)"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            isRequired
            readOnly
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("width_metres", getDecimalFieldConfig("El ancho es requerido"))}
            error={errors.width_metres?.message}
          />

          <InputText
            label="Largo (m)"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            isRequired
            readOnly
            className={inputClassName}
            labelClassName={labelClassName}
            {...register(
              "length_metres",
              getDecimalFieldConfig("El largo es requerido", true),
            )}
            error={errors.length_metres?.message}
          />

          <InputText
            label="Filas"
            type="text"
            inputMode="numeric"
            placeholder="4"
            isRequired
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("nominal_rows", {
              required: "Las filas son requeridas",
              validate: {
                validateInteger: (value) =>
                  !value || validateIntegerNumber(value),
                validatePositive: (value) =>
                  !value || validatePositiveNumber(value),
              },
              setValueAs: parseDecimal,
            })}
            error={errors.nominal_rows?.message}
          />

          <InputText
            label="Columnas"
            type="text"
            inputMode="numeric"
            placeholder="5"
            isRequired
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("nominal_columns", {
              required: "Las columnas son requeridas",
              validate: {
                validateInteger: (value) =>
                  !value || validateIntegerNumber(value),
                validatePositive: (value) =>
                  !value || validatePositiveNumber(value),
              },
              setValueAs: parseDecimal,
            })}
            error={errors.nominal_columns?.message}
          />

          <Controller
            control={control}
            name="status"
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
                error={errors.status?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="allows_stacking"
            render={({ field: stackingField }) => (
              <Checkbox
                label="Permite apilamiento"
                labelPosition="right"
                className="text-slate-300!"
                checked={stackingField.value}
                onChange={stackingField.onChange}
              />
            )}
          />

          {showUnavailableReason && (
            <InputText
              label="Motivo de indisponibilidad"
              placeholder="Ej. Reparación estructural del piso"
              isRequired
              className={inputClassName}
              labelClassName={labelClassName}
              {...register("unavailable_reason", {
                required: "El motivo es requerido para este estado",
              })}
              error={errors.unavailable_reason?.message}
            />
          )}
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
            isLoading={CreateLots.isPending}
            disabled={CreateLots.isPending}
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
          />
        </div>
      </form>
    </Modal>
  );
};
