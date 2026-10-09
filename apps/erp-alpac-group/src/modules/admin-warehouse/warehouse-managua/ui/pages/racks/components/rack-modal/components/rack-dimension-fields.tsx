import { InputText } from "@alpac/design-system";
import type { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import { validateDecimalNumber } from "@app/shared/utils/number.utils";
import {
  inputClassName,
  labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/style.racks";

export interface RackDimensionFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  heightLabel?: string;
  heightPlaceholder?: string;
}

export const RackDimensionFields = <T extends FieldValues>({
  register,
  errors,
  heightLabel = "Altura del rack (m)",
  heightPlaceholder = "ej. 1.52",
}: RackDimensionFieldsProps<T>) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <InputText
        label="Ancho / Profundidad (m)"
        isRequired
        type="number"
        step="0.01"
        inputMode="decimal"
        placeholder="ej. 1.07"
        className={inputClassName}
        labelClassName={labelClassName}
        error={errors.width?.message as string | undefined}
        {...register("width" as Path<T>, {
          required: "El ancho es requerido",
          validate: {
            isDecimal: validateDecimalNumber,
            range: (v: unknown) =>
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
        inputMode="decimal"
        placeholder="ej. 2.44"
        className={inputClassName}
        labelClassName={labelClassName}
        error={errors.length?.message as string | undefined}
        {...register("length" as Path<T>, {
          required: "El largo es requerido",
          validate: {
            isDecimal: validateDecimalNumber,
            range: (v: unknown) =>
              (Number(v) >= 1.0 && Number(v) <= 10.0) ||
              "Debe estar entre 1.00m y 10.00m",
          },
        })}
      />

      <InputText
        label={heightLabel}
        isRequired
        type="number"
        step="0.01"
        inputMode="decimal"
        placeholder={heightPlaceholder}
        className={inputClassName}
        labelClassName={labelClassName}
        error={errors.height?.message as string | undefined}
        {...register("height" as Path<T>, {
          required: "La altura es requerida",
          validate: {
            isDecimal: validateDecimalNumber,
            range: (v: unknown) =>
              (Number(v) >= 0.5 && Number(v) <= 15.0) ||
              "Debe estar entre 0.50m y 15.00m",
          },
        })}
      />
    </div>
  );
};
