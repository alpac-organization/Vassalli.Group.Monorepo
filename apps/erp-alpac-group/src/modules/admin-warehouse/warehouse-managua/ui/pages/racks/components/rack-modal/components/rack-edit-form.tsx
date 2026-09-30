import { Button, Dropdown, InputText } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import type {RackEditFormProps,RackEditFormValues} from "../types/rack-modal.types";
import {RackStatusEnum,RackStatusOptions} from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import {RackUsageProfileEnum,RackUsageProfileOptions} from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";
import { RackDimensionFields } from "./rack-dimension-fields";
import { validateIntegerNumber } from "@app/shared/utils/number.utils";
import { useRack } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useRack";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import {cancelButtonClass,dropdownClassName,inputClassName,labelClassName,primaryButtonClass} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/style.racks";
import { isUnavailableStatus, parseDecimal } from "../utils/rack.utils";
import { isSectionVertical } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/rack-coordinates.utils";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

const RACK_ROTATION_OPTIONS = [
  { value: 90, label: "Vertical (90°)" },
  { value: 0, label: "Horizontal (0°)" },
];

const normalizeRotation = (rot?: number | null, isVert?: boolean) => {
  const num = Math.round(Number(rot));
  if (num === 0 || num === 90) return num;
  return isVert ? 90 : 0;
};

export const RackEditForm = ({
  rack,
  warehouseId,
  sectionId,
  sectionWidth = 0,
  sectionLength = 0,
  onClose,
  onSubmitSuccess,
  }: RackEditFormProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { handleRequestError, handleRequestSuccess, AlertComponent } =
    useAlertState();

  const { UpdateRack } = useRack();

  const isVertical = isSectionVertical(sectionLength, sectionWidth);

  const usageProfileOption = Object.values(RackUsageProfileEnum).find(
    (o) => o.textValue === rack.usage_profile,
  );
  const statusOption = Object.values(RackStatusEnum).find(
    (o) => o.textValue === rack.status,
  );

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RackEditFormValues>({
    defaultValues: {
      row_number: rack.row_number,
      usage_profile:
        usageProfileOption?.value ?? RackUsageProfileEnum.ActiveFlow.value,
      status: statusOption?.value ?? RackStatusEnum.Available.value,
      unavailable_reason: "",
      width: rack.width,
      length: rack.length,
      height: rack.height ?? 1.52,
      position_x: rack.position_x ?? 0,
      position_y: rack.position_y ?? 0,
      position_z: rack.position_z ?? 0,
      rotation_y: normalizeRotation(rack.rotation_y, isVertical),
    },
  });

  const selectedStatus = watch("status");
  const requiresUnavailableReason = isUnavailableStatus(Number(selectedStatus));
  const isPending = UpdateRack.isPending;

  const onFormSubmit = async (data: RackEditFormValues) => {
    try {
      const rackId = rack.rack_id;
      if (!rackId) throw new Error("ID de rack no encontrado");

      await UpdateRack.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        warehouse_id: warehouseId,
        section_id: sectionId,
        rack_id: rackId,
        row_number: Number(data.row_number),
        usage_profile: Number(data.usage_profile),
        status: Number(data.status),
        unavailable_reason: requiresUnavailableReason
          ? data.unavailable_reason?.trim()
          : null,
        width: Number(data.width),
        length: Number(data.length),
        height: parseDecimal(data.height),
        position_x: Number(data.position_x),
        position_y: Number(data.position_y),
        position_z: Number(data.position_z ?? 0),
        rotation_y: Number(data.rotation_y ?? (isVertical ? 90 : 0)),
      });

      handleRequestSuccess("Rack actualizado exitosamente.");
      onSubmitSuccess?.();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      const mappedError = getMappedError(error as ApiErrorResponse);
      handleRequestError(
        mappedError?.description || "Error al procesar la solicitud.",
      );
    }
  };

  return (
    <>
      {AlertComponent}

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col gap-6 mt-2"
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputText
              label="Número de Hilera"
              isRequired
              type="number"
              placeholder="ej. 1"
              className={inputClassName}
              labelClassName={labelClassName}
              error={errors.row_number?.message}
              {...register("row_number", {
                required: "La hilera es requerida",
                validate: {
                  isInteger: validateIntegerNumber,
                  min: (v) => Number(v) > 0 || "Debe ser mayor a 0",
                },
              })}
            />

            <Controller
              name="usage_profile"
              control={control}
              rules={{ required: "El perfil de uso es requerido" }}
              render={({ field }) => (
                <Dropdown
                  label="Perfil de Uso"
                  isRequired
                  options={RackUsageProfileOptions}
                  value={field.value}
                  appearance="dark"
                  placeholder="Seleccione perfil..."
                  className={dropdownClassName}
                  labelClassName={labelClassName}
                  onChange={(val) => field.onChange(val)}
                  error={errors.usage_profile?.message}
                />
              )}
            />

            <Controller
              name="status"
              control={control}
              rules={{ required: "El estado es requerido" }}
              render={({ field }) => (
                <Dropdown
                  label="Estado del Rack"
                  isRequired
                  options={RackStatusOptions}
                  value={field.value}
                  appearance="dark"
                  placeholder="Seleccione estado..."
                  className={dropdownClassName}
                  labelClassName={labelClassName}
                  onChange={(val) => field.onChange(val)}
                  error={errors.status?.message}
                />
              )}
            />

            {requiresUnavailableReason && (
              <InputText
                label="Motivo de no disponibilidad"
                isRequired
                placeholder="ej. Reparación de largueros nivel 2"
                className={inputClassName}
                labelClassName={labelClassName}
                error={errors.unavailable_reason?.message}
                {...register("unavailable_reason", {
                  required: "El motivo es requerido si no está disponible",
                })}
              />
            )}
          </div>

          <h4 className="text-sm font-semibold text-slate-200 border-b border-slate-700 pb-1 mt-2">
            Dimensiones (Metros)
          </h4>
          <RackDimensionFields
            register={register}
            errors={errors}
            heightLabel="Altura Columna (m)"
            heightPlaceholder="ej. 4.50"
          />

          <h4 className="text-sm font-semibold text-slate-200 border-b border-slate-700 pb-1 mt-2">
            Coordenadas en el Plano 2D/3D
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <InputText
              label={
                isVertical
                  ? "Posición X (Hilera) (m)"
                  : "Posición X (Pasillo) (m)"
              }
              type="number"
              step="0.01"
              placeholder="0.00"
              className={inputClassName}
              labelClassName={labelClassName}
              error={errors.position_x?.message}
              {...register("position_x", {
                required: "La posición X es requerida",
                validate: (v) => Number(v) >= 0 || "No puede ser menor a 0",
              })}
            />

            <InputText
              label={
                isVertical
                  ? "Posición Y (Pasillo) (m)"
                  : "Posición Y (Hilera) (m)"
              }
              type="number"
              step="0.01"
              placeholder="0.00"
              className={inputClassName}
              labelClassName={labelClassName}
              error={errors.position_y?.message}
              {...register("position_y", {
                required: "La posición Y es requerida",
                validate: (v) => Number(v) >= 0 || "No puede ser menor a 0",
              })}
            />

            <InputText
              label="Posición Z (m)"
              type="number"
              step="0.01"
              placeholder="0.00"
              className={inputClassName}
              labelClassName={labelClassName}
              {...register("position_z")}
            />

            <Controller
              name="rotation_y"
              control={control}
              render={({ field }) => (
                <Dropdown
                  label="Rotación Y"
                  options={RACK_ROTATION_OPTIONS}
                  value={field.value}
                  appearance="dark"
                  placeholder="Seleccione rotación..."
                  className={dropdownClassName}
                  labelClassName={labelClassName}
                  onChange={(val) => field.onChange(Number(val))}
                  error={errors.rotation_y?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6 my-2" />

        {/* Botones de acción */}
        <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-between sm:gap-3 items-center">
          <div className="w-full sm:w-auto">
            <Button
              type="button"
              size="giant"
              label="Cancelar"
              onClick={onClose}
              disabled={isPending}
              className={cancelButtonClass}
            />
          </div>

          <div className="flex w-full sm:w-auto items-center justify-end gap-3">
            <Button
              type="submit"
              size="giant"
              label="Actualizar"
              className={primaryButtonClass}
              isLoading={isPending}
              disabled={isPending}
            />
          </div>
        </div>
      </form>
    </>
  );
};
