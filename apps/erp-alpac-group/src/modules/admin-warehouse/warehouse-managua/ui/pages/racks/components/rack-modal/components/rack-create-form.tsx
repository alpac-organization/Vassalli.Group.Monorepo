import {useMemo, useState } from "react";
import {Alert,Button,Dropdown,InputText,Stepper} from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import type {RackCreateFormProps,RackCreateFormValues} from "../types/rack-modal.types";
import {
  RackUsageProfileEnum,
  RackUsageProfileOptions,
} from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";
import { RackDimensionFields } from "./rack-dimension-fields";
import { validateIntegerNumber } from "@app/shared/utils/number.utils";
import { useRack } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useRack";
import { useSection } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useSection";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import {cancelButtonClass,dropdownClassName,inputClassName,labelClassName,primaryButtonClass} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/style.racks";
import { parseDecimal } from "../utils/rack.utils";
import { isSectionVertical } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/rack-coordinates.utils";
import { buildRackPositions } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/rack-modal/utils/build-rack-positions.utils";
import { parseRackPositionCode } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/position-shape/position-shape.utils";
import { CoordinateTargetTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/coordinate-target-type";
import {
  RACK_HEIGHT_METER,
  RACK_LENGTH_METER,
  RACK_POSITIONS_PER_RACK,
  RACK_WIDTH_METER,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/warehouse-config";
import type { RegisterRackPositionsCoordinatesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/register-coordinates-req";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

const COORDINATES_REQUEST_DELAY_MS = 300;

const STEPS = ["Datos Generales", "Dimensiones", "Ubicación 2D"];

export const RackCreateForm = ({
  warehouseId,
  sectionId,
  sectionWidth = 0,
  sectionLength = 0,
  onClose,
  onSubmitSuccess,
}: RackCreateFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { handleRequestError, handleRequestSuccess, AlertComponent } =
    useAlertState();

  const { RegisterRacksBulk } = useRack();
  const { RegisterCoordinates, GetPositions } = useSection();

  const isVertical = isSectionVertical(sectionLength, sectionWidth);
  const aisleMax = isVertical ? sectionLength : sectionWidth;
  const aisleAxis = isVertical ? "Y" : "X";

  const {
    control,
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RackCreateFormValues>({
    defaultValues: {
      quantity: 1,
      row_number: 1,
      level_number: 1,
      max_pulleys: RACK_POSITIONS_PER_RACK,
      width: RACK_WIDTH_METER,
      length: RACK_LENGTH_METER,
      height: RACK_HEIGHT_METER,
      usage_profile: RackUsageProfileEnum.ActiveFlow.value,
      initial_position_x: 0,
      initial_position_y: 0,
      spacing_x: RACK_LENGTH_METER,
    },
  });

  const watchQuantity = Number(watch("quantity") || 0);
  const watchLength = Number(watch("length") || 0);
  const watchInitX = Number(watch("initial_position_x") || 0);
  const watchInitY = Number(watch("initial_position_y") || 0);
  const watchSpacingX = Number(watch("spacing_x") || 0);

  const spanInfo = useMemo(() => {
    if (!watchQuantity || !watchLength) {
      return {
        fits: true,
        title: `Distribución en Pasillo (${aisleAxis})`,
        message: `Ingrese cantidad y dimensiones para proyectar el espacio (Largo disponible: ${aisleMax.toFixed(2)}m en Eje ${aisleAxis}).`,
      };
    }
    const spacing = watchSpacingX || watchLength;
    const startAisle = isVertical ? watchInitY : watchInitX;
    const endAisle = startAisle + (watchQuantity - 1) * spacing + watchLength;
    const fits = endAisle <= aisleMax + 0.1;
    return {
      fits,
      title: fits
        ? `Distribución Proyectada (Eje ${aisleAxis})`
        : `Límite de Pasillo Excedido (Eje ${aisleAxis})`,
      message: fits
        ? `${watchQuantity} racks abarcarán desde ${aisleAxis}=${startAisle.toFixed(2)}m hasta ${aisleAxis}=${endAisle.toFixed(2)}m (Largo disponible: ${aisleMax.toFixed(2)}m).`
        : `${watchQuantity} racks abarcarán desde ${aisleAxis}=${startAisle.toFixed(2)}m hasta ${aisleAxis}=${endAisle.toFixed(2)}m, excediendo el largo disponible de la sección (${aisleMax.toFixed(2)}m).`,
    };
  }, [watchQuantity, watchLength, watchInitX, watchInitY, watchSpacingX, isVertical, aisleMax, aisleAxis]);

  const handleNextStep = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (currentStep === 0) {
      const isValid = await trigger([
        "quantity",
        "row_number",
        "level_number",
        "max_pulleys",
        "usage_profile",
      ]);
      if (isValid) setCurrentStep(1);
    } else if (currentStep === 1) {
      const isValid = await trigger(["width", "length", "height"]);
      if (isValid) {
        setCurrentStep(2);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onFormSubmit = async (data: RackCreateFormValues) => {
    if (currentStep !== STEPS.length - 1) return;

    const width = Number(data.width);
    const length = Number(data.length);
    const maxPulleys = Number(data.max_pulleys);
    const height = parseDecimal(data.height) ?? 0;

    const rackPositions = buildRackPositions({
      width,
      length,
      maxPulleys,
      height,
    });

    if (!rackPositions.fits) {
      handleRequestError(rackPositions.message);
      return;
    }

    try {
      const spacingValue = data.spacing_x ? Number(data.spacing_x) : Number(data.length || 2.44);
      const initX = data.initial_position_x !== "" && data.initial_position_x !== undefined ? Number(data.initial_position_x) : 0;
      const initY = data.initial_position_y !== "" && data.initial_position_y !== undefined ? Number(data.initial_position_y) : 0;

      const positionsBefore = await GetPositions({
        company_id: companyId,
        module_code: moduleCode,
        warehouse_id: warehouseId,
        section_id: sectionId,
      });
      const existingRackIds = new Set(
        positionsBefore.blocks.map((block) => block.id),
      );

      await RegisterRacksBulk.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        warehouse_id: warehouseId,
        section_id: sectionId,
        quantity: Number(data.quantity),
        row_number: Number(data.row_number),
        level_number: Number(data.level_number),
        max_pulleys: maxPulleys,
        width,
        length,
        height,
        usage_profile: Number(data.usage_profile),
        initial_position_x: initX,
        initial_position_y: initY,
        spacing_x: spacingValue,
        rotation_y: isVertical ? 90 : 0,
      });

      const positionsAfter = await GetPositions({
        company_id: companyId,
        module_code: moduleCode,
        warehouse_id: warehouseId,
        section_id: sectionId,
      });
      const newRacks = positionsAfter.blocks.filter(
        (block) => !existingRackIds.has(block.id),
      );

      if (newRacks.length === 0) {
        handleRequestError(
          "Los racks se crearon, pero no se encontraron posiciones para registrar coordenadas.",
        );
        return;
      }

      for (let i = 0; i < newRacks.length; i++) {
        const rack = newRacks[i];
        const sortedPositions = [...rack.positions].sort((a, b) => {
          const columnA = parseRackPositionCode(a.code)?.column ?? 0;
          const columnB = parseRackPositionCode(b.code)?.column ?? 0;
          return columnA - columnB;
        });

        const positionsWithoutCoordinates = sortedPositions.filter(
          (position) => position.coordinates == null,
        );

        if (positionsWithoutCoordinates.length === 0) {
          continue;
        }

        const coordinatesPayload: RegisterRackPositionsCoordinatesRequest = {
          company_id: companyId,
          module_code: moduleCode,
          warehouse_id: warehouseId,
          section_id: sectionId,
          target_type: CoordinateTargetTypeEnum.RackPositions.value,
          rack_id: rack.id,
          rack_positions_information: positionsWithoutCoordinates.map(
            (position, index) => {
              const slotIndex =
                (parseRackPositionCode(position.code)?.column ?? index + 1) - 1;
              const coordinate =
                rackPositions.positions[slotIndex] ??
                rackPositions.positions[index] ?? {
                  position_x: 0,
                  position_y: 0,
                  position_z: 0,
                  rotation_y: 0,
                };

              return {
                rack_position_id: position.id,
                position_x: coordinate.position_x,
                position_y: coordinate.position_y,
                position_z: coordinate.position_z,
                rotation_y: coordinate.rotation_y,
              };
            },
          ),
          lots_positions_information: [],
        };

        await RegisterCoordinates.mutateAsync(coordinatesPayload);

        if (i < newRacks.length - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, COORDINATES_REQUEST_DELAY_MS),
          );
        }
      }

      handleRequestSuccess(
        "Racks y coordenadas de posiciones registrados exitosamente.",
      );
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

  const isPending =
    RegisterRacksBulk.isPending || RegisterCoordinates.isPending;

  return (
    <>
      {AlertComponent}

      {/* Stepper visual */}
      <div className="py-2 mb-2">
        <Stepper steps={STEPS} currentStep={currentStep} />
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (currentStep < STEPS.length - 1) {
              void handleNextStep();
            }
          }
        }}
        className="flex flex-col gap-6 mt-2"
      >
        <div className="min-h-56">
          {/* PASO 1: Datos Generales */}
          {currentStep === 0 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputText
                  label="Cantidad de Racks a Crear"
                  isRequired
                  type="number"
                  placeholder="ej. 24"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  error={errors.quantity?.message}
                  {...register("quantity", {
                    required: "La cantidad es requerida",
                    validate: {
                      isInteger: validateIntegerNumber,
                      min: (v) => Number(v) > 0 || "Debe ser mayor a 0",
                      max: (v) => Number(v) <= 60 || "Máximo 60 racks",
                    },
                  })}
                />

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

                <InputText
                  label="Nivel del Rack"
                  isRequired
                  type="number"
                  placeholder="ej. 1"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  error={errors.level_number?.message}
                  {...register("level_number", {
                    required: "El nivel del rack es requerido",
                    validate: {
                      isInteger: validateIntegerNumber,
                      range: (v) =>
                        (Number(v) >= 1 && Number(v) <= 10) || "Entre 1 y 10",
                    },
                  })}
                />

                <InputText
                  label="Polines por Rack"
                  isRequired
                  type="number"
                  placeholder="ej. 2"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  error={errors.max_pulleys?.message}
                  {...register("max_pulleys", {
                    required: "El máximo de polines es requerido",
                    validate: {
                      isInteger: validateIntegerNumber,
                      range: (v) =>
                        (Number(v) >= 1 && Number(v) <= 10) || "Entre 1 y 10",
                    },
                  })}
                />
              </div>

              <Controller
                name="usage_profile"
                control={control}
                rules={{ required: "El perfil de uso es requerido" }}
                render={({ field }) => (
                  <Dropdown
                    label="Perfil de Uso Operativo"
                    isRequired
                    options={RackUsageProfileOptions}
                    value={field.value}
                    appearance="dark"
                    placeholder="Seleccione perfil de uso..."
                    className={dropdownClassName}
                    labelClassName={labelClassName}
                    onChange={(val) => field.onChange(val)}
                    error={errors.usage_profile?.message}
                  />
                )}
              />
            </div>
          )}

          {/* PASO 2: Dimensiones Métricas */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-slate-400">
                Defina las medidas estándar en metros para cada uno de los
                módulos de rack de la hilera.
              </p>

              <RackDimensionFields register={register} errors={errors} />
            </div>
          )}

          {/* PASO 3: Ubicación y Distribución 2D */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputText
                  label={
                    isVertical
                      ? "Posición X (Hilera en Ancho) (m)"
                      : "Posición Inicial X (Inicio Pasillo) (m)"
                  }
                  type="number"
                  step="0.01"
                  placeholder="ej. 0.00"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  error={errors.initial_position_x?.message}
                  {...register("initial_position_x", {
                    validate: (v) =>
                      v === "" || v === undefined || Number(v) >= 0 || "Debe ser mayor o igual a 0",
                  })}
                />

                <InputText
                  label={
                    isVertical
                      ? "Posición Inicial Y (Inicio Pasillo) (m)"
                      : "Posición Y (Hilera en Alto) (m)"
                  }
                  type="number"
                  step="0.01"
                  placeholder="ej. 0.00"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  error={errors.initial_position_y?.message}
                  {...register("initial_position_y", {
                    validate: (v) =>
                      v === "" || v === undefined || Number(v) >= 0 || "Debe ser mayor o igual a 0",
                  })}
                />

                <InputText
                  label={`Separación en Pasillo ${aisleAxis} (m)`}
                  type="number"
                  step="0.01"
                  placeholder={watchLength ? `ej. ${watchLength.toFixed(2)}` : "ej. 2.44"}
                  className={inputClassName}
                  labelClassName={labelClassName}
                  error={errors.spacing_x?.message}
                  {...register("spacing_x", {
                    validate: (v) => {
                      if (v === "" || v === undefined) return true;
                      const num = Number(v);
                      if (num <= 0) return "Debe ser mayor a 0";
                      const len = Number(watch("length") || 0);
                      if (len > 0 && num < len) {
                        return `Debe ser al menos igual al largo (${len.toFixed(2)}m)`;
                      }
                      return true;
                    },
                  })}
                />
              </div>

              <Alert
                type={spanInfo.fits ? "info" : "error"}
                title={spanInfo.title}
                message={spanInfo.message}
                showCloseButton={false}
              />
            </div>
          )}
        </div>

        {/* Separador */}
        <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6 my-2" />

        {/* Botones de acción y navegación */}
        <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-between sm:gap-3 items-center">
          <div className="w-full sm:w-auto">
            {currentStep > 0 ? (
              <Button
                type="button"
                size="giant"
                label="Anterior"
                className={primaryButtonClass}
                onClick={handlePrevStep}
                disabled={isPending}
              />
            ) : (
              <Button
                type="button"
                size="giant"
                label="Cancelar"
                onClick={onClose}
                disabled={isPending}
                className={cancelButtonClass}
              />
            )}
          </div>

          <div className="flex w-full sm:w-auto items-center justify-end gap-3">
            {currentStep < STEPS.length - 1 ? (
              <Button
                key="btn-next-step"
                type="button"
                size="giant"
                label="Siguiente"
                className={primaryButtonClass}
                onClick={(e) => {
                  void handleNextStep(e);
                }}
              />
            ) : (
              <Button
                key="btn-submit-action"
                type="button"
                size="giant"
                label="Registrar Racks"
                className={primaryButtonClass}
                onClick={(e) => {
                  void handleSubmit(onFormSubmit)(e);
                }}
                isLoading={isPending}
                disabled={isPending}
              />
            )}
          </div>
        </div>
      </form>
    </>
  );
};
