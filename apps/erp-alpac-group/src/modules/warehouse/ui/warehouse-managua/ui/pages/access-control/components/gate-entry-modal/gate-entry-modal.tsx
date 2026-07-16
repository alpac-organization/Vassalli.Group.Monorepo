import { Button, Modal, Stepper } from "@alpac/design-system";
import { AnimatePresence, m } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { DucasStep } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/components/ducas-step";
import { VehicleDataStep } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/components/vehicle-data-step";
import {
  GATE_ENTRY_DEFAULT_VALUES,
  GATE_ENTRY_STEPS,
  type GateEntryFormValues,
  type GateEntryModalProps,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/types/gate-entry-modal.types";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 24 : -24,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 24 : -24,
    opacity: 0,
  }),
};

const footerButtonClass =
  "w-full! sm:w-auto! shrink-0! text-[14px]! sm:text-[15px]! rounded-md! justify-center!";

export function GateEntryModal({
  isOpen,
  onClose,
  onSubmit,
}: GateEntryModalProps) {
  const [[currentStep, direction], setStep] = useState([0, 0]);
  const [isDeleteAllDucasConfirmOpen, setIsDeleteAllDucasConfirmOpen] =
    useState(false);
  const [ducasError, setDucasError] = useState<string | null>(null);

  const { register, handleSubmit, control, reset } =
    useForm<GateEntryFormValues>({
      defaultValues: GATE_ENTRY_DEFAULT_VALUES,
    });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "ducas",
  });

  useEffect(() => {
    if (!isOpen) {
      reset(GATE_ENTRY_DEFAULT_VALUES);
      setStep([0, 0]);
      setIsDeleteAllDucasConfirmOpen(false);
      setDucasError(null);
    }
  }, [isOpen, reset]);

  const goToStep = (nextStep: number) => {
    setStep([nextStep, nextStep > currentStep ? 1 : -1]);
  };

  const handleClose = () => {
    reset(GATE_ENTRY_DEFAULT_VALUES);
    setStep([0, 0]);
    setIsDeleteAllDucasConfirmOpen(false);
    setDucasError(null);
    onClose();
  };

  const handleAddDuca = () => {
    append({ value: "" });
    setDucasError(null);
  };

  const handleConfirmDeleteAllDucas = () => {
    replace([]);
    setDucasError(null);
    setIsDeleteAllDucasConfirmOpen(false);
  };

  const handleFormSubmit: SubmitHandler<GateEntryFormValues> = (data) => {
    const hasAtLeastOneDuca = data.ducas.some((duca) => duca.value.trim());

    if (!hasAtLeastOneDuca) {
      setDucasError("Debe agregar al menos una DUCA para guardar el registro.");
      if (currentStep !== 1) goToStep(1);
      return;
    }

    onSubmit(data);
    handleClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Registro de Entrada de Vehículo"
        variant="form"
        size="3xl"
        panelClassName={[
          "flex! flex-col!",
          "max-h-[min(92dvh,46rem)]!",
          "overflow-hidden!",
          "p-4! sm:p-6!",
          "w-[calc(100%-1rem)]! sm:w-full!",
          "[&>div:last-of-type]:flex-1!",
          "[&>div:last-of-type]:min-h-0!",
          "[&>div:last-of-type]:flex!",
          "[&>div:last-of-type]:flex-col!",
          "[&>div:last-of-type]:overflow-hidden!",
        ].join(" ")}
      >
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col flex-1 min-h-0 h-full overflow-hidden"
        >
          <div className="shrink-0 overflow-x-auto">
            <Stepper
              currentStep={currentStep}
              steps={[...GATE_ENTRY_STEPS]}
              className="min-w-[280px] pt-1 pb-9 sm:pt-2 sm:pb-10"
            />
          </div>

          {currentStep === 1 && (
            <div className="shrink-0 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-3 pt-2 sm:pt-1">
              <Button
                type="button"
                label="Eliminar todas"
                size="medium"
                onClick={() => setIsDeleteAllDucasConfirmOpen(true)}
                disabled={fields.length === 0}
                icon={<Trash2Icon size={18} />}
                className="w-full! sm:w-auto! text-[14px]! rounded-md! text-white! bg-red-600! hover:bg-red-500! dark:bg-red-900! dark:hover:bg-red-800! disabled:opacity-40! justify-center!"
              />
              <Button
                type="button"
                label="Agregar Duca"
                size="medium"
                onClick={handleAddDuca}
                icon={<PlusIcon size={18} />}
                className="w-full! sm:w-auto! text-[14px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! justify-center!"
              />
            </div>
          )}

          <div
            className={[
              "relative flex-1 min-h-0",
              "overflow-y-auto overflow-x-hidden",
              "overscroll-contain scrollbar-dashboard",
              "py-2 sm:py-1 pr-1",
            ].join(" ")}
          >
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <m.div
                key={currentStep}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              >
                {currentStep === 0 ? (
                  <VehicleDataStep register={register} />
                ) : (
                  <DucasStep
                    fields={fields}
                    register={register}
                    onRemove={remove}
                  />
                )}
              </m.div>
            </AnimatePresence>
          </div>

          <div className="shrink-0 sticky bottom-0 z-10 bg-white dark:bg-[#272b34] flex flex-col-reverse sm:flex-row sm:flex-nowrap sm:justify-end sm:items-center gap-3 sm:gap-3 mt-4 sm:mt-4 pt-4 sm:pt-4 border-t border-slate-600 dark:border-neutral-600">
            <Button
              type="button"
              label="Cancelar"
              size="giant"
              onClick={handleClose}
              className={`${footerButtonClass} text-white! bg-red-600! hover:bg-red-500! dark:bg-red-900! dark:hover:bg-red-800!`}
              icon={<XIcon size={18} />}
            />

            {currentStep === 0 ? (
              <Button
                type="button"
                label="Siguiente"
                size="giant"
                onClick={() => goToStep(1)}
                className={`${footerButtonClass} text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!`}
                icon={<ArrowRightIcon size={18} />}
              />
            ) : (
              <>
                <Button
                  type="button"
                  label="Atrás"
                  size="giant"
                  onClick={() => goToStep(0)}
                  className={`${footerButtonClass} text-slate-200! bg-slate-600/50! hover:bg-slate-600!`}
                  icon={<ArrowLeftIcon size={18} />}
                />
                <Button
                  type="submit"
                  label="Finalizar y Guardar"
                  size="giant"
                  className={`${footerButtonClass} text-white! bg-emerald-800! hover:bg-emerald-700!`}
                  icon={<SaveIcon size={18} />}
                />
              </>
            )}
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteAllDucasConfirmOpen}
        type="APPROVE"
        title="¿Está seguro de eliminar todas las DUCAs? Esta acción es irreversible."
        buttonActionLabel="Eliminar todas"
        buttonActionClass="border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300"
        onClose={() => setIsDeleteAllDucasConfirmOpen(false)}
        handleFinalAction={handleConfirmDeleteAllDucas}
      />

      <Modal
        isOpen={Boolean(ducasError)}
        onClose={() => setDucasError(null)}
        variant="info"
        size="sm"
        panelClassName="dark:border dark:border-neutral-700"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {ducasError}
          </p>
          <Button
            type="button"
            label="OK"
            size="giant"
            onClick={() => setDucasError(null)}
            className="rounded-md! px-8! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! justify-center!"
          />
        </div>
      </Modal>
    </>
  );
}
