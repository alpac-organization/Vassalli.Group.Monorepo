import { useCallback, useEffect, useRef, useState } from "react";
import { Button, InputText, Modal } from "@alpac/design-system";
import { CircleAlert, Info } from "lucide-react";
import type { PayrollCycleFormalizationProps } from "@app/modules/payroll/ui/pages/nomina/components/payroll-cycle-formalization/types/payroll-cycle-formalization.types";
import { useNavigate, useParams } from "react-router-dom";

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
  existPayrollInProgress,
  statusLoading = false,
  statusError = false,
  onRetryProcessStatus,
}: PayrollCycleFormalizationProps) {
  const [isFormalizeModalOpen, setIsFormalizeModalOpen] = useState(false);
  //   const [showInProgressModal, setShowInProgressModal] = useState(false);
  const [showCanProceedModal, setShowCanProceedModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const presentedRef = useRef<string | null>(null);
  const prevErrorRef = useRef(false);
  const navigate = useNavigate();
  const { alias_company: aliasCompany } = useParams();
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
      return;
    }
    //  if (existPayrollInProgress === true) {
    //    if (presentedRef.current !== "in_progress") {
    //      presentedRef.current = "in_progress";
    //      setShowInProgressModal(true);
    //    }
    //    return;
    //  }
    if (existPayrollInProgress === false) {
      if (presentedRef.current !== "can_proceed") {
        presentedRef.current = "can_proceed";
        setShowCanProceedModal(true);
      }
    }
  }, [statusLoading, statusError, existPayrollInProgress]);

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

  //   const handleCloseInProgressModal = useCallback(() => {
  //     setShowInProgressModal(false);
  //   }, []);

  const handleCloseCanProceedModal = useCallback(() => {
    setShowCanProceedModal(false);
    if (aliasCompany) {
      navigate(`/${aliasCompany}/dashboard/payroll/collaborators`);
    } else {
      navigate("../collaborators", { relative: "path" });
    }
  }, [aliasCompany, navigate]);

  const handleContinueCanProceed = useCallback(() => {
    setShowCanProceedModal(false);
  }, []);

  const handleCloseErrorModal = useCallback(() => {
    setShowErrorModal(false);
  }, []);

  const handleRetryProcessStatus = useCallback(async () => {
    await onRetryProcessStatus?.();
  }, [onRetryProcessStatus]);

  const formalizeDisabled =
    statusLoading ||
    statusError ||
    existPayrollInProgress === true ||
    existPayrollInProgress === undefined;

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
          <div className="flex min-w-0 flex-col sm:col-span-2 lg:col-span-1 gap-2">
            <Button
              type="button"
              size="giant"
              label="Formalizar nómina"
              onClick={handleOpenFormalizeModal}
              disabled={formalizeDisabled}
              className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            />
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
      {/* 
      <Modal
        isOpen={showInProgressModal}
        onClose={handleCloseInProgressModal}
        variant="warning"
        size="md"
        title="Nómina en progreso"
        description={
          <span className="flex gap-2.5 items-start text-left">
            <AlertTriangle
              className="shrink-0 mt-0.5 text-amber-500"
              size={20}
              strokeWidth={1.8}
            />
            <span>
              ya Existe una nómina en progreso para esta empresa 
              y este tipo de nómina.Debe terminar o cancelar ese proceso antes de formalizar otra.
            </span>
          </span>
        }
      >
        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            size="giant"
            label="Entendido"
            onClick={handleCloseInProgressModal}
            className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:w-auto!"
          />
        </div>
      </Modal> */}

      <Modal
        isOpen={showCanProceedModal}
        onClose={handleCloseCanProceedModal}
        variant="info"
        size="md"
        title="Estado de la nómina"
        description={
          <span className="flex gap-2.5 items-start text-left">
            <Info
              className="shrink-0 mt-0.5 text-blue-500"
              size={20}
              strokeWidth={1.8}
            />
            <span>
              No hay ninguna nómina en progreso. Puede formalizar la nómina del
              ciclo actual. ¿Desea continuar?
            </span>
          </span>
        }
      >
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            size="giant"
            label="Ahora no"
            onClick={handleCloseCanProceedModal}
            className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:w-auto!"
          />
          <Button
            type="button"
            size="giant"
            label="Continuar"
            onClick={handleContinueCanProceed}
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
