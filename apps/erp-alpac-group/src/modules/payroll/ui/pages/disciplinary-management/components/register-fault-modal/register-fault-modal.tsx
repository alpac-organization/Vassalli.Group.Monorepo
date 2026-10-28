import {
  Button,
  Dropdown,
  InputText,
  Modal,
} from "@alpac/design-system";
import type { RegisterFaultModalProps } from "@app/modules/payroll/ui/pages/disciplinary-management/components/register-fault-modal/register-fault-modal.types";
import {
  disciplinaryDropdownClassName,
  disciplinaryInputClassName,
  disciplinaryLabelClassName,
  disciplinaryPrimaryButtonClassName,
  disciplinarySecondaryButtonClassName,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-form.constants";
import { Controller, useForm } from "react-hook-form";

type RegisterFaultFormValues = {
  collaborator_id: string;
  fault_catalog_id: string;
  occurrence_date: string;
};

export const RegisterFaultModal = ({
  isOpen,
  onClose,
}: RegisterFaultModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RegisterFaultFormValues>({
    defaultValues: {
      collaborator_id: "",
      fault_catalog_id: "",
      occurrence_date: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      variant="default"
      title="Registrar falta disciplinaria"
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
        <p className="m-0 text-sm text-slate-500 dark:text-slate-400">
          Completa los datos de la falta. El origen se enviará como registro
          manual. Las evidencias se conectarán en un paso posterior.
        </p>

        <InputText
          label="Colaborador"
          className={disciplinaryInputClassName}
          labelClassName={disciplinaryLabelClassName}
          placeholder="Seleccionar colaborador (próximo)"
          errorVariant="tooltip"
          error={errors.collaborator_id?.message}
          {...register("collaborator_id", {
            required: "El colaborador es requerido",
          })}
        />

        <Controller
          name="fault_catalog_id"
          control={control}
          rules={{ required: "El tipo de falta es requerido" }}
          render={({ field }) => (
            <Dropdown
              label="Tipo de falta (catálogo)"
              appearance="dark"
              placeholder="Seleccionar del catálogo"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              options={[]}
              labelClassName={disciplinaryLabelClassName}
              valueClassName={disciplinaryLabelClassName}
              className={disciplinaryDropdownClassName}
            />
          )}
        />

        <InputText
          label="Fecha de ocurrencia"
          type="date"
          className={disciplinaryInputClassName}
          labelClassName={disciplinaryLabelClassName}
          errorVariant="tooltip"
          error={errors.occurrence_date?.message}
          {...register("occurrence_date", {
            required: "La fecha es requerida",
          })}
        />

        <div className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-neutral-600 dark:text-slate-400">
          Zona de evidencias (imágenes) — diseño pendiente de uploader
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
            label="Registrar"
            className={disciplinaryPrimaryButtonClassName}
          />
        </div>
      </form>
    </Modal>
  );
};
