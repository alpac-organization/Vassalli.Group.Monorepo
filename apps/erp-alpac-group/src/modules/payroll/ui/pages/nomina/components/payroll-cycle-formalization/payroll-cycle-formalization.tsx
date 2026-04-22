import { useCallback, useEffect, useRef, useState } from "react";
import { Button, InputText, Modal } from "@alpac/design-system";
import { CircleAlert } from "lucide-react";
import type { PayrollCycleFormalizationProps } from "@app/modules/payroll/ui/pages/nomina/components/payroll-cycle-formalization/types/payroll-cycle-formalization.types";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { useNavigate } from "react-router-dom";

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
  statusError = false,
  onRetryProcessStatus,
}: PayrollCycleFormalizationProps) {
  const [isFormalizeModalOpen, setIsFormalizeModalOpen] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();
  const presentedRef = useRef<string | null>(null);
  const prevErrorRef = useRef(false);

  useEffect(() => {
    if (prevErrorRef.current && !statusError) {
      presentedRef.current = null;
    }
    prevErrorRef.current = statusError;
  }, [statusError]);

  useEffect(() => {
    if (!statusError) {
      setShowErrorModal(false);
    }
  }, [statusError]);

  useEffect(() => {
    if (statusLoading) return;
    if (statusError) {
      if (presentedRef.current !== "error") {
        presentedRef.current = "error";
        setShowErrorModal(true);
      }
    }
  }, [statusLoading, statusError]);

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

  const handleCloseErrorModal = useCallback(() => {
    setShowErrorModal(false);
    navigate("/dashboard");
  }, [navigate]);

  const handleRetryProcessStatus = useCallback(async () => {
    await onRetryProcessStatus?.();
  }, [onRetryProcessStatus]);

  const formalizeDisabled =
    statusLoading ||
    statusError ||
    existPayrollInProgress === false ||
    existPayrollInProgress === undefined;

  return (
    <>
      <div className="w-full max-w-full">
        <div className="flex w-full flex-col gap-5 sm:gap-4">
          <div className="grid min-w-0 grid-cols-1 items-end gap-5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-4">
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
            <div className="flex min-w-0 flex-col">
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
          {statusError && !showErrorModal && (
            <p className="text-[13px] text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-2">
              <span>No se pudo comprobar si hay una nómina en progreso.</span>
              <button
                type="button"
                className="font-medium text-alpac-primary-600 dark:text-alpac-primary-400 underline underline-offset-2"
                onClick={() => void handleRetryProcessStatus()}
              >
                Reintentar
              </button>
            </p>
          )}
        </div>
      </div>

      <Modal
        isOpen={showErrorModal}
        onClose={handleCloseErrorModal}
        variant="error"
        size="md"
        title="No se pudo verificar el estado"
        description={
          <span className="flex gap-2.5 items-start text-left">
            <CircleAlert
              className="shrink-0 mt-0.5 text-red-500"
              size={20}
              strokeWidth={1.8}
            />
            <span>
              No se pudo comprobar si ya existe una nómina en progreso. Revise
              su conexión e inténtelo nuevamente en unos minutos.
            </span>
          </span>
        }
      >
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            size="giant"
            label="Cerrar"
            onClick={handleCloseErrorModal}
            className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:w-auto!"
          />
          <Button
            type="button"
            size="giant"
            label="Reintentar"
            onClick={handleRetryProcessStatus}
            className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:w-auto!"
          />
        </div>
      </Modal>

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
