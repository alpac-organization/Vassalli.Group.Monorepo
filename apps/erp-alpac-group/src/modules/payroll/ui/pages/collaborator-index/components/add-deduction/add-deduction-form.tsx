import { useForm, Controller } from "react-hook-form";
// InputText: packages/ui/src/components/inputs/input-text/input-text.tsx (exportado por @alpac/design-system)
import {
  Button,
  Dropdown,
  InputText,
  RadioButton,
  Textarea,
} from "@alpac/design-system";
import { motion, type Variants } from "framer-motion";
import { DEDUCTION_TYPE_OPTIONS } from "@app/modules/payroll/ui/pages/collaborator-index/components/add-deduction/constants/add-deduction.constants";
import type {
  AddDeductionFormProps,
  DeductionFormValues,
} from "@app/modules/payroll/ui/pages/collaborator-index/components/add-deduction/types/add-deduction.types";

const inputClassName =
  "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export function AddDeductionForm({
  isPending,
  onSubmit,
  onCancel,
  companyId: _companyId,
  moduleCode: _moduleCode,
  identificationNumber: _identificationNumber,
}: AddDeductionFormProps) {
  const defaultValues: DeductionFormValues = {
    type: undefined,
    fortnight_type: undefined,
    fortnight_quantity: undefined,
    description: "",
  };

  const formContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.04,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.15,
        staggerChildren: 0.04,
        staggerDirection: -1,
      },
    },
  };

  const formFieldVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 14,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: 6,
      transition: {
        duration: 0.15,
      },
    },
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DeductionFormValues>({
    defaultValues,
    mode: "onChange",
  });

  const selectedType = watch("type");
  const selectedFortnightType = watch("fortnight_type");

  const handleFormSubmit = (values: DeductionFormValues) => {
    onSubmit({
      ...values,
    });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex min-w-0 flex-col gap-4 sm:gap-5"
    >
      <Controller
        name="type"
        control={control}
        rules={{
          required: "El tipo de deducción es requerido.",
        }}
        render={({ field }) => (
          <Dropdown
            placeholder="Tipo de deducción"
            appearance="dark"
            value={field.value ?? ""}
            onChange={(value) => {
              field.onChange(value);
            }}
            labelClassName={labelClassName}
            valueClassName={labelClassName}
            className={inputClassName}
            options={DEDUCTION_TYPE_OPTIONS}
            error={errors.type?.message}
          />
        )}
      />

      {selectedType && (
        <motion.div
          variants={formContainerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col gap-4 sm:gap-5"
        >
          <motion.div
            variants={formFieldVariants}
            className="flex flex-col flex-wrap gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4"
          >
            <RadioButton
              id="fortnight-current"
              value="Quincena actual"
              label="Quincena actual"
              labelPosition="right"
              labelClassName={labelClassName}
              checked={selectedFortnightType === "Quincena actual"}
              onChange={() => {
                setValue("fortnight_type", "Quincena actual", {
                  shouldValidate: true,
                });
              }}
            />

            <RadioButton
              id="fortnight-next"
              value="Quincena siguiente"
              label="Quincena siguiente"
              labelPosition="right"
              labelClassName={labelClassName}
              checked={selectedFortnightType === "Quincena siguiente"}
              onChange={() => {
                setValue("fortnight_type", "Quincena siguiente", {
                  shouldValidate: true,
                });
              }}
            />
          </motion.div>

          <input
            type="hidden"
            {...register("fortnight_type", {
              required:
                "Debe seleccionar quincena actual o quincena siguiente.",
            })}
          />
          {errors.fortnight_type?.message && (
            <p
              className="text-[13px] text-red-500 dark:text-red-400"
              role="alert"
            >
              {errors.fortnight_type.message}
            </p>
          )}

          <motion.div
            variants={formFieldVariants}
            className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <div className="min-w-0 flex flex-col gap-1.5 sm:col-span-2">
              <InputText
                label="Indicar la cantidad de quincena"
                labelClassName={labelClassName}
                type="number"
                isRequired
                placeholder="Ej. 2500"
                className={`${inputClassName} dark:text-white!`}
                error={errors.fortnight_quantity?.message}
                {...register("fortnight_quantity", {
                  valueAsNumber: true,
                  validate: (value) => {
                    if (
                      value === undefined ||
                      value === null ||
                      (typeof value === "number" && Number.isNaN(value))
                    ) {
                      return "Indique la cantidad de quincena.";
                    }
                    if (Number(value) < 1) {
                      return "La cantidad debe ser mayor a 0.";
                    }
                    return true;
                  },
                })}
              />
            </div>
          </motion.div>

          <motion.div variants={formFieldVariants}>
            <Textarea
              label="Descripción"
              isRequired
              labelClassName={labelClassName}
              rows={3}
              placeholder="Propósito o detalles de la deducción..."
              className={`${inputClassName} resize-none`}
              error={errors.description?.message}
              {...register("description", {
                required: "La descripción es requerida.",
              })}
            />
          </motion.div>
        </motion.div>
      )}

      <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6"></div>

      <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
        <Button
          type="button"
          size="giant"
          label="Cancelar"
          onClick={onCancel}
          className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
        />
        <Button
          type="submit"
          size="giant"
          label={isPending ? "Agregando..." : "Agregar deducción"}
          disabled={isPending}
          isLoading={isPending}
          className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
        />
      </div>
    </form>
  );
}
