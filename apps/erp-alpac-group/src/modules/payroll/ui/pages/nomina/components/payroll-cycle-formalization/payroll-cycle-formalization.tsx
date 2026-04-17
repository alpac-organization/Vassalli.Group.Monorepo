import { useCallback, useState } from "react";
import { Button, InputText, Modal } from "@alpac/design-system";
import type { PayrollCycleFormalizationProps } from "@app/modules/payroll/ui/pages/nomina/components/payroll-cycle-formalization/types/payroll-cycle-formalization.types";

const readOnlyInputClassName = `
  transition-all! duration-200! dark:bg-[#272b34]! border-b border-neutral-700 dark:px-3! 
  disabled:dark:bg-[#272b34]! disabled:dark:border-slate-600 disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium!
  min-w-0 w-full max-w-full text-[14px]! font-medium! ml-0.5!
  text-slate-900! dark:text-white!
`.replace(/\s+/g, " ");

const labelClassName =
  "text-[13px]! sm:text-[14px]! font-medium! text-slate-800! dark:text-white! ml-0.5!";

function displayCycle(value: string | undefined) {
  const t = value?.trim();
  return t && t.length > 0 ? t : "—";
}

export default function PayrollCycleFormalization({
  cicloInicial,
  cicloFinal,
  onConfirmFormalizacion,
}: PayrollCycleFormalizationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirmFormalizacion?.();
    setIsModalOpen(false);
  }, [onConfirmFormalizacion]);

  return (
    <>
      <div className="w-full max-w-full">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-end">
          <div className="flex min-w-0 flex-col sm:col-span-1">
            <InputText
              label="Inicio del ciclo"
              labelClassName={labelClassName}
              disabled
              readOnly
              value={displayCycle(cicloInicial)}
              className={`${readOnlyInputClassName} w-full!`}
            />
          </div>
          <div className="flex min-w-0 flex-col sm:col-span-1">
            <InputText
              label="Fin del ciclo"
              labelClassName={labelClassName}
              disabled
              readOnly
              value={displayCycle(cicloFinal)}
              className={`${readOnlyInputClassName} w-full!`}
            />
          </div>
          <div className="flex min-w-0 flex-col sm:col-span-2 lg:col-span-1">
            <Button
              type="button"
              size="giant"
              label="Formalizar nómina"
              onClick={handleOpenModal}
              className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        variant="warning"
        size="md"
        title="Formalizar nómina"
        description="Va a formalizar la nómina del ciclo actual. Esta acción requiere su confirmación. ¿Desea continuar?"
      >
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleCloseModal}
            className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:w-auto!"
          />
          <Button
            type="button"
            size="giant"
            label="Confirmar"
            onClick={handleConfirm}
            className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:w-auto!"
          />
        </div>
      </Modal>
    </>
  );
}
