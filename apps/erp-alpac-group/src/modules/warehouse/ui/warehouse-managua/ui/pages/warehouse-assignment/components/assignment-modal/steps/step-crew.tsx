import { Button, Dropdown, InputText, Chips } from "@alpac/design-system";
import { useForm, Controller } from "react-hook-form";
import { inputClassName, labelClassName } from "../../assignment-filters/utils/styles";

export type StepCuadrillaFormValues =
  | {
      is_outsourced: false;
      collaborator_ids: string[];
    }
  | {
      is_outsourced: true;
      person_count: number;
      provider_name: string;
      invoice_number?: string;
    };

type StepCuadrillaProps = {
  collaboratorsOptions: { value: string; label: string }[];
  isSubmitting: boolean;
  onSubmit: (values: StepCuadrillaFormValues) => void;
  onBack: () => void;
};

type FormValues = {
  is_outsourced: "false" | "true";
  collaborator_ids: string[];
  person_count: string;
  provider_name: string;
  invoice_number: string;
};

const OUTSOURCED_OPTIONS = [
  { value: "false", label: "Interna (propia)" },
  { value: "true", label: "Tercerizada / Externa" },
];


export function StepCuadrilla({
  collaboratorsOptions,
  isSubmitting,
  onSubmit,
  onBack,
}: StepCuadrillaProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      is_outsourced: "false",
      collaborator_ids: [],
      person_count: "",
      provider_name: "",
      invoice_number: "",
    },
  });

  const isOutsourced = watch("is_outsourced") === "true";

  const handleFormSubmit = (values: FormValues) => {
    if (values.is_outsourced === "true") {
      onSubmit({
        is_outsourced: true,
        person_count: Number(values.person_count),
        provider_name: values.provider_name.trim(),
        invoice_number: values.invoice_number?.trim() || undefined,
      });
    } else {
      onSubmit({
        is_outsourced: false,
        collaborator_ids: values.collaborator_ids,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
      {/* Toggle Interna / Externa */}
      <Controller
        name="is_outsourced"
        control={control}
        render={({ field }) => (
          <Dropdown
            appearance="dark"
            label="Tipo de cuadrilla *"
            placeholder="Seleccionar tipo..."
            options={OUTSOURCED_OPTIONS}
            value={field.value}
            onChange={(value) => field.onChange(String(value ?? "false"))}
            labelClassName={labelClassName}
            className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
          />
        )}
      />

      {/* Campos para cuadrilla INTERNA */}
      {!isOutsourced && (
        <div className="flex flex-col gap-2">
          <Controller
            name="collaborator_ids"
            control={control}
            rules={{
              validate: (val) =>
                val.length > 0 || "Seleccione al menos un colaborador",
            }}
            render={({ field }) => {
              const availableOptions = collaboratorsOptions.filter(
                (opt) => !field.value.includes(opt.value),
              );

              return (
                <div className="flex flex-col gap-2">
                  <Dropdown
                    appearance="dark"
                    label="Colaboradores *"
                    placeholder={
                      field.value.length === 0
                        ? "Seleccionar colaboradores..."
                        : "Agregar otro colaborador..."
                    }
                    options={availableOptions}
                    value=""
                    onChange={(value) => {
                      const str = String(value ?? "");
                      if (str && !field.value.includes(str)) {
                        field.onChange([...field.value, str]);
                      }
                    }}
                    labelClassName={labelClassName}
                    className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
                  />

                  {field.value.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Colaboradores seleccionados ({field.value.length}):
                      </span>
                      <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1.5 border border-slate-200 dark:border-slate-700/60 rounded-md bg-slate-50/50 dark:bg-[#1a1d23]/50">
                        {field.value.map((id) => {
                          const col = collaboratorsOptions.find(
                            (c) => c.value === id,
                          );
                          return (
                            <Chips
                              key={id}
                              label={col?.label || id}
                              onClose={() => {
                                field.onChange(
                                  field.value.filter((item) => item !== id),
                                );
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }}
          />
          {errors.collaborator_ids && (
            <small className="text-red-500 text-xs">
              {errors.collaborator_ids.message as string}
            </small>
          )}
        </div>
      )}

      {/* Campos para cuadrilla TERCERIZADA */}
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

          <div className="flex flex-col gap-1">
            <InputText
              label="Cantidad de personas *"
              className={inputClassName}
              labelClassName={labelClassName}
              type="number"
              placeholder="Ej: 4"
              errorVariant="tooltip"
              {...register("person_count", {
                required: "Campo obligatorio",
                min: { value: 1, message: "Debe ser mayor a 0" },
              })}
            />
            {errors.person_count && (
              <small className="text-red-500 text-xs">
                {errors.person_count.message}
              </small>
            )}
          </div>

          <InputText
            label="N.º Factura (opcional)"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            placeholder="FAC-2026-001"
            errorVariant="tooltip"
            {...register("invoice_number")}
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

