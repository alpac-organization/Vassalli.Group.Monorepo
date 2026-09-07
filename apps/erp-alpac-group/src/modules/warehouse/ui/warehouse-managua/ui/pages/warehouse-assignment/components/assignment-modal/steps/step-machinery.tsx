import { Button, Dropdown, InputText } from "@alpac/design-system";
import { useForm, Controller } from "react-hook-form";

import type { MachineryDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-machinery-catalogs";

export type StepMaquinariaFormValues =
  | {
      is_outsourced: false;
      machinery_id: string;
      operator_collaborator_id?: string;
    }
  | {
      is_outsourced: true;
      provider_name: string;
      invoice_number?: string;
      machinery_description?: string;
    };

type StepMaquinariaProps = {
  machineryCatalog: MachineryDto[];
  collaboratorsOptions: { value: string; label: string }[];
  isSubmitting: boolean;
  onSubmit: (values: StepMaquinariaFormValues) => void;
  onBack: () => void;
};

type FormValues = {
  is_outsourced: "false" | "true";
  machinery_id: string;
  operator_collaborator_id: string;
  provider_name: string;
  invoice_number: string;
  machinery_description: string;
};

const OUTSOURCED_OPTIONS = [
  { value: "false", label: "Propia / Interna" },
  { value: "true", label: "Alquilada / Tercerizada" },
];

const inputClassName =
  "h-[42px]! sm:h-[46px]! text-sm! rounded-md! border-slate-300! dark:border-slate-600!";
const labelClassName =
  "text-xs! sm:text-sm! font-medium! text-slate-600! dark:text-slate-300!";

export function StepMaquinaria({
  machineryCatalog,
  collaboratorsOptions,
  isSubmitting,
  onSubmit,
  onBack,
}: StepMaquinariaProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      is_outsourced: "false",
      machinery_id: "",
      operator_collaborator_id: "",
      provider_name: "",
      invoice_number: "",
      machinery_description: "",
    },
  });

  const isOutsourced = watch("is_outsourced") === "true";

  const machineryOptions = machineryCatalog.map((m) => ({
    value: m.id,
    label: `${m.code} — ${m.name}`,
  }));

  const handleFormSubmit = (values: FormValues) => {
    if (values.is_outsourced === "true") {
      onSubmit({
        is_outsourced: true,
        provider_name: values.provider_name.trim(),
        invoice_number: values.invoice_number?.trim() || undefined,
        machinery_description: values.machinery_description?.trim() || undefined,
      });
    } else {
      onSubmit({
        is_outsourced: false,
        machinery_id: values.machinery_id,
        operator_collaborator_id:
          values.operator_collaborator_id?.trim() || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
      {/* Toggle Propia / Alquilada */}
      <Controller
        name="is_outsourced"
        control={control}
        render={({ field }) => (
          <Dropdown
            appearance="dark"
            label="Tipo de maquinaria *"
            placeholder="Seleccionar tipo..."
            options={OUTSOURCED_OPTIONS}
            value={field.value}
            onChange={(value) => field.onChange(String(value ?? "false"))}
            labelClassName={labelClassName}
            className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
          />
        )}
      />

      {/* Campos para maquinaria PROPIA */}
      {!isOutsourced && (
        <>
          <div className="flex flex-col gap-1">
            <Controller
              name="machinery_id"
              control={control}
              rules={{ required: "Seleccione una maquinaria" }}
              render={({ field }) => (
                <Dropdown
                  appearance="dark"
                  label="Maquinaria *"
                  placeholder="Seleccionar maquinaria..."
                  options={machineryOptions}
                  value={field.value || undefined}
                  onChange={(value) => field.onChange(String(value ?? ""))}
                  labelClassName={labelClassName}
                  className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
                />
              )}
            />
            {errors.machinery_id && (
              <small className="text-red-500 text-xs">
                {errors.machinery_id.message}
              </small>
            )}
          </div>

          <Controller
            name="operator_collaborator_id"
            control={control}
            render={({ field }) => (
              <Dropdown
                appearance="dark"
                label="Operador (opcional)"
                placeholder="Seleccionar operador..."
                options={collaboratorsOptions}
                value={field.value || undefined}
                onChange={(value) => field.onChange(String(value ?? ""))}
                labelClassName={labelClassName}
                className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
              />
            )}
          />
        </>
      )}

      {/* Campos para maquinaria TERCERIZADA */}
      {isOutsourced && (
        <>
          <div className="flex flex-col gap-1">
            <InputText
              label="Proveedor *"
              className={inputClassName}
              labelClassName={labelClassName}
              type="text"
              placeholder="Nombre del proveedor..."
              errorVariant="tooltip"
              {...register("provider_name", { required: "Campo obligatorio" })}
            />
            {errors.provider_name && (
              <small className="text-red-500 text-xs">
                {errors.provider_name.message}
              </small>
            )}
          </div>

          <InputText
            label="N.º Factura (opcional)"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            placeholder="FAC-8891"
            errorVariant="tooltip"
            {...register("invoice_number")}
          />

          <InputText
            label="Descripción de maquinaria (opcional)"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            placeholder="Ej: Montacargas Toyota 3.5T"
            errorVariant="tooltip"
            {...register("machinery_description")}
          />
        </>
      )}

      <div className="flex justify-between gap-3 pt-2">
        <Button
          type="button"
          label="← Volver"
          onClick={onBack}
          disabled={isSubmitting}
          className="bg-transparent! border! border-slate-300! text-slate-700! dark:border-slate-600! dark:text-slate-300!"
        />
        <div className="flex gap-2">
          <Button
            type="submit"
            label={isSubmitting ? "Guardando..." : "Agregar →"}
            disabled={isSubmitting}
            className="bg-alpac-primary-500! hover:bg-alpac-primary-600! text-white! dark:bg-alpac-primary-700!"
          />
        </div>
      </div>
    </form>
  );
}

