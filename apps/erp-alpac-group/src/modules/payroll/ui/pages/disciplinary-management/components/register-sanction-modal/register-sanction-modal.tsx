import {
  Button,
  Dropdown,
  InputText,
  Modal,
} from "@alpac/design-system";
import { SanctionTypeEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";
import type { RegisterSanctionModalProps } from "@app/modules/payroll/ui/pages/disciplinary-management/components/register-sanction-modal/register-sanction-modal.types";
import {
  disciplinaryDropdownClassName,
  disciplinaryInputClassName,
  disciplinaryLabelClassName,
  disciplinaryPrimaryButtonClassName,
  disciplinarySecondaryButtonClassName,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-form.constants";
import { Controller, useForm, useWatch } from "react-hook-form";

type RegisterSanctionFormValues = {
  sanction_type: string;
  reason: string;
  suspension_start_date: string;
  suspension_end_date: string;
};

const SANCTION_TYPE_OPTIONS = Object.entries(SanctionTypeEnum).map(
  ([key, item]) => ({
    label: item.label,
    value: key,
  }),
);

export const RegisterSanctionModal = ({
  isOpen,
  onClose,
  faultSummary,
}: RegisterSanctionModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RegisterSanctionFormValues>({
    defaultValues: {
      sanction_type: "VerbalWarning",
      reason: "",
      suspension_start_date: "",
      suspension_end_date: "",
    },
  });

  const sanctionType = useWatch({ control, name: "sanction_type" });
  const isSuspension = sanctionType === "Suspension";

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      variant="default"
      title="Aplicar sanción"
      panelClassName={[
        "!max-w-2xl w-[min(calc(100vw-1rem),42rem)] min-w-0",
        "max-h-[min(94dvh,46rem)] overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-dashboard",
        "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
      ].join(" ")}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(() => {
          handleClose();
        })}
      >
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-100">
          La sugerencia (`suggested-sanction`) y el target de escalamiento se
          conectarán después. Falta:{" "}
          <strong>{faultSummary?.fault_id ?? "—"}</strong>
        </div>

        <Controller
          name="sanction_type"
          control={control}
          rules={{ required: "El tipo es requerido" }}
          render={({ field }) => (
            <Dropdown
              label="Tipo de sanción"
              appearance="dark"
              placeholder="Seleccionar tipo"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              options={SANCTION_TYPE_OPTIONS}
              labelClassName={disciplinaryLabelClassName}
              valueClassName={disciplinaryLabelClassName}
              className={disciplinaryDropdownClassName}
            />
          )}
        />

        <InputText
          label="Motivo"
          className={disciplinaryInputClassName}
          labelClassName={disciplinaryLabelClassName}
          placeholder="Describe el motivo (máx. 500)"
          errorVariant="tooltip"
          error={errors.reason?.message}
          {...register("reason", {
            required: "El motivo es requerido",
            maxLength: { value: 500, message: "Máximo 500 caracteres" },
          })}
        />

        {isSuspension && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InputText
              label="Inicio suspensión"
              type="date"
              className={disciplinaryInputClassName}
              labelClassName={disciplinaryLabelClassName}
              errorVariant="tooltip"
              error={errors.suspension_start_date?.message}
              {...register("suspension_start_date", {
                required: isSuspension ? "Fecha inicio requerida" : false,
              })}
            />
            <InputText
              label="Fin suspensión"
              type="date"
              className={disciplinaryInputClassName}
              labelClassName={disciplinaryLabelClassName}
              errorVariant="tooltip"
              error={errors.suspension_end_date?.message}
              {...register("suspension_end_date", {
                required: isSuspension ? "Fecha fin requerida" : false,
              })}
            />
          </div>
        )}

        <div className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-neutral-600 dark:text-slate-400">
          Evidencias (requeridas salvo amonestación verbal) — uploader pendiente
        </div>

        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            className={disciplinarySecondaryButtonClassName}
            onClick={handleClose}
          />
          <Button
            type="submit"
            size="giant"
            label="Aplicar sanción"
            className={disciplinaryPrimaryButtonClassName}
          />
        </div>
      </form>
    </Modal>
  );
};
