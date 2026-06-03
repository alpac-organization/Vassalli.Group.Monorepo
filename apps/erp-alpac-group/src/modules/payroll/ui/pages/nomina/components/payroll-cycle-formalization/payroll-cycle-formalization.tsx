import { useCallback, useState } from "react";
import { Button, InputText, Modal } from "@alpac/design-system";
import type { PayrollCycleFormalizationProps } from "@app/modules/payroll/ui/pages/nomina/components/payroll-cycle-formalization/types/payroll-cycle-formalization.types";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

const cycleInputClassName = `
  w-full! h-12! min-h-[48px]! rounded-md! text-[15px]! text-white!
  dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-white
`.replace(/\s+/g, " ");

const formalizeButtonClassName = `
  w-full! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! font-normal!
  rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!
`.replace(/\s+/g, " ");

const labelClassName = "text-black! dark:text-white!";

export default function PayrollCycleFormalization({
  cicloInicial,
  cicloFinal,
  onConfirmFormalizacion,
  existPayrollInProgress,
  statusLoading = false,
  formalizeLoading = false,
}: PayrollCycleFormalizationProps) {
  const [isFormalizeModalOpen, setIsFormalizeModalOpen] = useState(false);

  const handleOpenFormalizeModal = useCallback(() => {
    setIsFormalizeModalOpen(true);
  }, []);

  const handleCloseFormalizeModal = useCallback(() => {
    if (formalizeLoading) return;
    setIsFormalizeModalOpen(false);
  }, [formalizeLoading]);

  const handleConfirmFormalize = useCallback(async () => {
    try {
      await onConfirmFormalizacion?.();
    } catch {
    } finally {
      setIsFormalizeModalOpen(false);
    }
  }, [onConfirmFormalizacion]);

  const formalizeDisabled =
    statusLoading ||
    formalizeLoading ||
    existPayrollInProgress === false ||
    existPayrollInProgress === undefined;
  return (
    <>
      <div className="w-full max-w-full">
        <div className="flex w-full flex-col gap-5 sm:gap-4">
          <div className="w-full flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-start">
            <div className="w-full lg:w-[20rem]">
              <InputText
                label="Inicio del ciclo"
                labelClassName={labelClassName}
                disabled
                readOnly
                value={
                  typeof cicloInicial === "string" &&
                  cicloInicial.trim().length > 0
                    ? formatDateToSpanishWords(cicloInicial.trim())
                    : "—"
                }
                className={cycleInputClassName}
              />
            </div>
            <div className="w-full lg:w-[20rem]">
              <InputText
                label="Fin del ciclo"
                labelClassName={labelClassName}
                disabled
                readOnly
                value={
                  typeof cicloFinal === "string" && cicloFinal.trim().length > 0
                    ? formatDateToSpanishWords(cicloFinal.trim())
                    : "—"
                }
                className={cycleInputClassName}
              />
            </div>
            <div className="w-full lg:w-[20rem]">
              <Button
                type="button"
                size="giant"
                label="Formalizar nómina"
                onClick={handleOpenFormalizeModal}
                disabled={formalizeDisabled}
                className={formalizeButtonClassName}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isFormalizeModalOpen}
        onClose={handleCloseFormalizeModal}
        variant="warning"
        size="md"
        title="Confirmación de formalización"
        description="Va a formalizar la nómina del ciclo actual. Esta acción no se puede deshacer. ¿Desea continuar?"
      >
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleCloseFormalizeModal}
            disabled={formalizeLoading}
            className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:w-auto!"
          />
          <Button
            type="button"
            size="giant"
            label={formalizeLoading ? "Formalizando..." : "Confirmar"}
            onClick={handleConfirmFormalize}
            disabled={formalizeLoading}
            className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:w-auto!"
          />
        </div>
      </Modal>
    </>
  );
}
