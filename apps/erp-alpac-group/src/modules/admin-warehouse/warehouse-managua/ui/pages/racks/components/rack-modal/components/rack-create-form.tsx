import {useMemo, useState } from "react";
import {Alert,Button,Dropdown,InputText,Stepper} from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import type {RackCreateFormProps,RackCreateFormValues} from "../types/rack-modal.types";
import {RackUsageProfileOptions} from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";
import {validateDecimalNumber,validateIntegerNumber,} from "@app/shared/utils/number.utils";
import { useRack } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useRack";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import {cancelButtonClass,dropdownClassName,inputClassName,labelClassName,primaryButtonClass} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/style.racks";
import { parseDecimal } from "../utils/rack.utils";
import { isSectionVertical } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/rack-coordinates.utils";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

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
      quantity: "",
      row_number: "",
      level_number: "",
      max_pulleys: "",
      width: "",
      length: "",
      height: "",
      usage_profile: "",
      initial_position_x: "",
      initial_position_y: "",
      spacing_x: "",
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

    try {
      const spacingValue = data.spacing_x ? Number(data.spacing_x) : Number(data.length || 2.44);
      const initX = data.initial_position_x !== "" && data.initial_position_x !== undefined ? Number(data.initial_position_x) : 0;
      const initY = data.initial_position_y !== "" && data.initial_position_y !== undefined ? Number(data.initial_position_y) : 0;

      await RegisterRacksBulk.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        warehouse_id: warehouseId,
        section_id: sectionId,
        quantity: Number(data.quantity),
        row_number: Number(data.row_number),
        level_number: Number(data.level_number),
        max_pulleys: Number(data.max_pulleys),
        width: Number(data.width),
        length: Number(data.length),
        height: parseDecimal(data.height),
        usage_profile: Number(data.usage_profile),
        initial_position_x: initX,
        initial_position_y: initY,
        spacing_x: spacingValue,
        rotation_y: isVertical ? 90 : 0,
      });

      handleRequestSuccess("Racks registrados exitosamente.");
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

  const isPending = RegisterRacksBulk.isPending;

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
              handleNextStep();
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputText
                  label="Ancho / Profundidad (m)"
                  isRequired
                  type="number"
                  step="0.01"
                  placeholder="ej. 1.07"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  error={errors.width?.message}
                  {...register("width", {
                    required: "El ancho es requerido",
                    validate: {
                      isDecimal: validateDecimalNumber,
                      range: (v) =>
                        (Number(v) >= 0.5 && Number(v) <= 5.0) ||
                        "Debe estar entre 0.50m y 5.00m",
                    },
                  })}
                />

                <InputText
                  label="Largo Longitudinal (m)"
                  isRequired
                  type="number"
                  step="0.01"
                  placeholder="ej. 2.44"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  error={errors.length?.message}
                  {...register("length", {
                    required: "El largo es requerido",
                    validate: {
                      isDecimal: validateDecimalNumber,
                      range: (v) =>
                        (Number(v) >= 1.0 && Number(v) <= 10.0) ||
                        "Debe estar entre 1.00m y 10.00m",
                    },
                  })}
                />

                <InputText
                  label="Altura del rack (m)"
                  type="number"
                  step="0.01"
                  placeholder="ej. 1.52"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  error={errors.height?.message}
                  {...register("height", {
                    validate: (v) =>
                      !v ||
                      (Number(v) >= 0.5 && Number(v) <= 15.0) ||
                      "Debe estar entre 0.50m y 15.00m",
                  })}
                />
              </div>
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
                onClick={(e) => handleNextStep(e)}
              />
            ) : (
              <Button
                key="btn-submit-action"
                type="button"
                size="giant"
                label="Registrar Racks"
                className={primaryButtonClass}
                onClick={handleSubmit(onFormSubmit)}
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
