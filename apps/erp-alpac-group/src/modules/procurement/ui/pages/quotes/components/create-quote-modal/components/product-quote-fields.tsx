import { Controller, useFormContext } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Button, Dropdown, InputText, Textarea } from "@alpac/design-system";
import type { CreateQuoteFormValues } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-form.types";
import { QuoteImageUploader } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/components/quote-image-uploader";
import {
  quoteFormDropdownClassName,
  quoteFormInputClassName,
  quoteFormLabelClassName,
} from "../create-quote-form.styles";

type ProductQuoteFieldsProps = {
  supplierIndex: number;
  productIndex: number;
  canRemove: boolean;
  onRemove: () => void;
};

const UNIT_OPTIONS = [
  { label: "Unidad (UND)", value: "UND" },
  { label: "Paquete (PAQ)", value: "PAQ" },
  { label: "Par (PAR)", value: "PAR" },
  { label: "Set (SET)", value: "SET" },
  { label: "Kilogramo (KG)", value: "KG" },
  { label: "Litro (L)", value: "L" },
  { label: "Galón (GAL)", value: "GAL" },
];

export function ProductQuoteFields({
  supplierIndex,
  productIndex,
  canRemove,
  onRemove,
}: ProductQuoteFieldsProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CreateQuoteFormValues>();

  const productErrors =
    errors.suppliers?.[supplierIndex]?.products?.[productIndex];
  const path = `suppliers.${supplierIndex}.products.${productIndex}` as const;

  return (
    <div className="flex flex-col gap-6 pt-1">
      {canRemove && (
        <div className="flex justify-end">
          <Button
            type="button"
            size="small"
            label="Eliminar producto"
            icon={<Trash2 size={16} />}
            onClick={onRemove}
            className="rounded-md! bg-red-500! text-[13px]! text-white! hover:bg-red-600! dark:bg-red-700!"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <InputText
          label="ID del producto"
          placeholder="prod-uuid"
          className={quoteFormInputClassName}
          labelClassName={quoteFormLabelClassName}
          {...register(`${path}.product_id`)}
        />
        <InputText
          label="Nombre del producto"
          placeholder="Ej: Aceite Motor 15W40"
          isRequired
          error={productErrors?.product_name?.message}
          className={quoteFormInputClassName}
          labelClassName={quoteFormLabelClassName}
          {...register(`${path}.product_name`, {
            required: "Ingrese el nombre del producto.",
            validate: (value) =>
              value.trim().length >= 2 ||
              "El nombre debe tener al menos 2 caracteres.",
          })}
        />
        <InputText
          type="number"
          step="0.01"
          min="0"
          label="Costo del producto"
          placeholder="0.00"
          isRequired
          error={productErrors?.product_cost?.message}
          className={quoteFormInputClassName}
          labelClassName={quoteFormLabelClassName}
          {...register(`${path}.product_cost`, {
            valueAsNumber: true,
            required: "Ingrese el costo del producto.",
            min: {
              value: 0.01,
              message: "El costo debe ser mayor que cero.",
            },
          })}
        />
        <Controller
          control={control}
          name={`${path}.unit_measure_id`}
          rules={{ required: "Seleccione una unidad de medida." }}
          render={({ field }) => (
            <Dropdown
              label="Unidad de medida"
              placeholder="Seleccionar unidad"
              options={UNIT_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              isRequired
              appearance="dark"
              error={productErrors?.unit_measure_id?.message}
              labelClassName={quoteFormLabelClassName}
              className={quoteFormDropdownClassName}
            />
          )}
        />
      </div>

      <Textarea
        label="Observaciones del producto"
        placeholder="Ej: Presentación de 1 galón, sin garantía de fábrica..."
        rows={3}
        className={`${quoteFormInputClassName} resize-none`}
        labelClassName={quoteFormLabelClassName}
        {...register(`${path}.observations`)}
      />

      <Controller
        control={control}
        name={`${path}.images_base_64`}
        render={({ field }) => (
          <QuoteImageUploader
            value={field.value ?? []}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  );
}
