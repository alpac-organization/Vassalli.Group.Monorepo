import { useCallback, useState } from "react";
import { Button, InputText, Modal } from "@alpac/design-system";
import type { PayrollCycleFormalizationProps } from "@app/modules/payroll/ui/pages/nomina/components/payroll-cycle-formalization/types/payroll-cycle-formalization.types";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

const cycleInputClassName = `
  w-full! rounded-md! text-[15px]! text-white!
  dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-white
`.replace(/\s+/g, " ");

const labelClassName = "text-black! dark:text-white!";

export default function PayrollCycleFormalization({
  cicloInicial,
  cicloFinal,
  onConfirmFormalizacion,
  existPayrollInProgress,
  statusLoading = false,
}: PayrollCycleFormalizationProps) {
  const [isFormalizeModalOpen, setIsFormalizeModalOpen] = useState(false);

  const handleOpenFormalizeModal = useCallback(() => {
    setIsFormalizeModalOpen(true);
  }, []);

  const handleCloseFormalizeModal = useCallback(() => {
    setIsFormalizeModalOpen(false);
  }, []);

  const handleConfirmFormalize = useCallback(() => {
    onConfirmFormalizacion?.();
    setIsFormalizeModalOpen(false);
  }, [onConfirmFormalizacion]);

  const formalizeDisabled =
    statusLoading ||
    existPayrollInProgress === false ||
    existPayrollInProgress === undefined;
  return (
    <>
      <div className="w-full max-w-full">
        <div className="flex w-full flex-col gap-5 sm:gap-4">
          <div className="grid min-w-0 grid-cols-1 items-end gap-5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 lg:gap-4 xl:grid-cols-3">
            <div className="flex min-w-0 flex-col">
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
            <div className="flex min-w-0 flex-col">
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
            <div className="flex min-w-0 flex-col sm:col-span-2 xl:col-span-1">
              <Button
                type="button"
                size="giant"
                label="Formalizar nómina"
                onClick={handleOpenFormalizeModal}
                disabled={formalizeDisabled}
                className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
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
            className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:w-auto!"
          />
          <Button
            type="button"
            size="giant"
            label="Confirmar"
            onClick={handleConfirmFormalize}
            className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:w-auto!"
          />
        </div>
      </Modal>
    </>
  );
}
