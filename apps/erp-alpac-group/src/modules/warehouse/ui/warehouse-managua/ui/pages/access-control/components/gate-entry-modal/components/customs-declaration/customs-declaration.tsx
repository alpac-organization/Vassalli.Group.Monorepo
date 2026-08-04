import { InputText } from "@alpac/design-system";
import {
  gateEntryInputClassName,
  gateEntryLabelClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/utils/gate-entry-modal.styles";
import type { CustomsDeclarationProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/components/customs-declaration/customs-declaration.types";
import { isAlfaNumericValue } from "@app/shared/utils/string.utils";

export function CustomsDeclaration({
  register,
  errors,
}: CustomsDeclarationProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-3 px-2 pt-3 sm:pt-4">
      <InputText
        label="Número de declaración"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        placeholder="Ingrese declaración"
        {...register("customsDeclarationNumber", {
          required: "El número de declaración es obligatorio.",
          setValueAs: (value: string) => value?.trim(),
          validate: (value: string) => {
            if (!isAlfaNumericValue(value)) {
              return "Digite un número de declaración válido.";
            }
            return true;
          },
        })}
        error={errors.customsDeclarationNumber?.message}
      />

      <InputText
        label="Paquetes"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        type="number"
        placeholder="Cantidad de paquetes"
        {...register("packages", {
          required: "La cantidad de paquetes es obligatoria.",
          setValueAs: (value: string) => value?.trim(),
          validate: {
            notEmpty: (value: string) =>
              Boolean(value?.trim()) || "La cantidad de bultos es obligatoria.",
            positiveInteger: (value: string) => {
              const parsed = Number(value);
              if (!Number.isInteger(parsed) || parsed <= 0) {
                return "Ingrese un número entero mayor a 0.";
              }
              return true;
            },
          },
        })}
        error={errors.packages?.message}
      />

      <InputText
        label="Cliente"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        placeholder="Nombre del cliente"
        {...register("customer", {
          required: "El cliente es obligatorio.",
          setValueAs: (value: string) => value?.trim(),
          validate: {
            notEmpty: (value: string) =>
              Boolean(value?.trim()) || "El cliente es obligatorio.",
          },
        })}
        error={errors.customer?.message}
      />

      <InputText
        label="Producto"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        placeholder="Ingrese el producto"
        {...register("product", {
          required: "El producto es obligatorio.",
          setValueAs: (value: string) => value?.trim(),
          validate: {
            notEmpty: (value: string) =>
              Boolean(value?.trim()) || "El producto es obligatorio.",
          },
        })}
        error={errors.product?.message}
      />

      <InputText
        label="Número de contenedor"
        labelClassName={gateEntryLabelClassName}
        className={gateEntryInputClassName}
        isRequired
        placeholder="Número de contenedor"
        {...register("containerNumber", {
          required: "El número de contenedor es obligatorio.",
          setValueAs: (value: string) => value?.trim(),
          validate: {
            notEmpty: (value: string) =>
              Boolean(value?.trim()) ||
              "El número de contenedor es obligatorio.",
          },
        })}
        error={errors.containerNumber?.message}
      />
    </div>
  );
}
