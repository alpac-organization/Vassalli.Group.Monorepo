import { useCallback } from "react";
import { Modal, Button, Dropdown } from "@alpac/design-system";
import type {
  RequisitionGenerateReportsModalProps,
  RequisitionReportAction,
} from "./generate-reports-modal.types";

export function RequisitionGenerateReportsModal({
  isOpen,
  onClose,
  options,
  appearance,
  selectedAction,
  onSelectedActionChange,
  onConfirm,
  isConfirmLoading = false,
}: RequisitionGenerateReportsModalProps) {
  const canConfirm = !isConfirmLoading && selectedAction !== null;

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
      title="Generar informes"
      description="Seleccione el tipo de informe a generar."
      panelClassName="dark:border dark:border-neutral-700"
    >
      <div className="mt-4 flex flex-col gap-4">
        <Dropdown
          placeholder="Seleccione un tipo de informe"
          options={options}
          value={selectedAction ?? undefined}
          appearance={appearance}
          label="Tipo de informe"
          labelClassName="text-white!"
          onChange={(value) =>
            onSelectedActionChange(value as RequisitionReportAction)
          }
        />
      </div>

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
