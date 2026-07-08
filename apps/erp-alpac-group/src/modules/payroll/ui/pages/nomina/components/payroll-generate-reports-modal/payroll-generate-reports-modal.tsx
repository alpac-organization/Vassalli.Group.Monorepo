import { useCallback, useEffect } from "react";
import { Modal, Button, Dropdown, Checkbox } from "@alpac/design-system";
import { m, LazyMotion, AnimatePresence } from "framer-motion";
import type { PayrollGenerateReportsModalProps } from "@app/modules/payroll/ui/pages/nomina/components/payroll-generate-reports-modal/types/payroll-generate-reports-modal.types";
import type { PayrollActionValue } from "@app/modules/payroll/ui/pages/nomina/types/payroll-actions.types";
import { actionSupportsExcel, actionIsExcelOnly } from "@app/modules/payroll/ui/pages/nomina/constants/payroll-generate-formats.constants";
import { AlertTriangle } from "lucide-react";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

const formatSectionTransition = {
  height: { duration: 0.3, ease: "easeInOut" as const },
  opacity: { duration: 0.45, ease: "easeOut" as const, delay: 0.1 },
  y: { duration: 0.3, ease: "easeOut" as const, delay: 0.1 },
};

const excelOptionTransition = {
  height: { duration: 0.25, ease: "easeInOut" as const },
  opacity: { duration: 0.35, ease: "easeOut" as const, delay: 0.08 },
  y: { duration: 0.25, ease: "easeOut" as const, delay: 0.08 },
};

export default function PayrollGenerateReportsModal({
  isOpen,
  onClose,
  options,
  appearance,
  selectedAction,
  onSelectedActionChange,
  generatePdfChecked,
  generateExcelChecked,
  onGeneratePdfChange,
  onGenerateExcelChange,
  onConfirm,
  isConfirmLoading = false,
  confirmDisabled = false,
}: PayrollGenerateReportsModalProps) {
  const isExcelOnlyAction =
    selectedAction !== null && actionIsExcelOnly(selectedAction);
  const showPdfOption =
    selectedAction !== null && !isExcelOnlyAction;
  const showExcelOption =
    selectedAction !== null && actionSupportsExcel(selectedAction);
  const hasAtLeastOneFormat = isExcelOnlyAction
    ? generateExcelChecked
    : generatePdfChecked || generateExcelChecked;
  const canConfirm =
    !confirmDisabled &&
    !isConfirmLoading &&
    selectedAction !== null &&
    hasAtLeastOneFormat;

  useEffect(() => {
    if (!selectedAction || !actionIsExcelOnly(selectedAction)) return;
    onGeneratePdfChange(false);
    onGenerateExcelChange(true);
  }, [selectedAction, onGeneratePdfChange, onGenerateExcelChange]);

  const handleClose = useCallback(() => {
    if (isConfirmLoading) return;
    onClose();
  }, [isConfirmLoading, onClose]);

  const handleConfirm = useCallback(async () => {
    if (!canConfirm) return;
    await onConfirm();
  }, [canConfirm, onConfirm]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      variant="default"
      size="sm"
      title="Generar reporte"
      description="Seleccione la acción a generar y los formatos de salida."
      panelClassName="dark:border dark:border-neutral-700"
    >
      <LazyMotion features={loadFeatures} strict>
        <div className="mt-4 flex flex-col gap-4">
          <Dropdown
            placeholder="Seleccione una acción a generar"
            options={options}
            value={selectedAction ?? undefined}
            appearance={appearance}
            label="Acción"
            labelClassName="text-white!"
            onChange={(value) =>
              onSelectedActionChange(value as PayrollActionValue)
            }
          />

          <AnimatePresence>
            {selectedAction !== null && (
              <m.div
                key="format-options"
                initial={{
                  opacity: 0,
                  y: 16,
                  height: 0,
                  overflow: "hidden",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  height: "auto",
                  overflow: "visible",
                }}
                exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
                transition={formatSectionTransition}
                className="flex flex-col gap-3"
              >
                <AnimatePresence>
                  {showPdfOption && (
                    <m.div
                      key="pdf-option"
                      initial={{
                        opacity: 0,
                        y: 8,
                        height: 0,
                        overflow: "hidden",
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        height: "auto",
                        overflow: "visible",
                      }}
                      exit={{
                        opacity: 0,
                        y: 4,
                        height: 0,
                        overflow: "hidden",
                      }}
                      transition={excelOptionTransition}
                    >
                      <Checkbox
                        label="Generar PDF"
                        checked={generatePdfChecked}
                        onChange={(e) => onGeneratePdfChange(e.target.checked)}
                        disabled={isConfirmLoading}
                      />
                    </m.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showExcelOption && (
                    <m.div
                      key="excel-option"
                      initial={{
                        opacity: 0,
                        y: 8,
                        height: 0,
                        overflow: "hidden",
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        height: "auto",
                        overflow: "visible",
                      }}
                      exit={{
                        opacity: 0,
                        y: 4,
                        height: 0,
                        overflow: "hidden",
                      }}
                      transition={excelOptionTransition}
                    >
                      <Checkbox
                        label="Generar Excel"
                        checked={generateExcelChecked}
                        onChange={(e) =>
                          onGenerateExcelChange(e.target.checked)
                        }
                        disabled={isConfirmLoading}
                      />
                    </m.div>
                  )}
                </AnimatePresence>

                {!hasAtLeastOneFormat && (
                  <div className="flex items-center gap-3 p-3 rounded-lg  border-2 border-red-900 text-[#7C0123]  dark:border-red-400/98 dark:text-[#e15b82] mt-2 mb-2">
                    <AlertTriangle size={18} />
                    <p className="text-sm text-gray-300 dark:text-slate-400 m-0!">
                      Seleccione al menos un formato.
                    </p>
                  </div>
                )}
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </LazyMotion>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          size="giant"
          label="Cancelar"
          onClick={handleClose}
          disabled={isConfirmLoading}
          className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:w-auto!"
        />
        <Button
          type="button"
          size="giant"
          label={isConfirmLoading ? "Generando..." : "Confirmar"}
          onClick={handleConfirm}
          disabled={!canConfirm}
          isLoading={isConfirmLoading}
          className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:w-auto!"
        />
      </div>
    </Modal>
  );
}
