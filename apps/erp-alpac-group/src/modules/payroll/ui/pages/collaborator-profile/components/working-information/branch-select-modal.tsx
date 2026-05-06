import { useEffect, useState } from "react";
import { Button, Dropdown, Modal, Spinner } from "@alpac/design-system";
import type { BranchSelectModalProps } from "./types/work-information.type";

export function BranchSelectModal({
  isOpen,
  onClose,
  currentBranchId,
  options,
  isSaving,
  onConfirm,
}: BranchSelectModalProps) {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    currentBranchId ?? "",
  );

  useEffect(() => {
    setSelectedBranchId(currentBranchId ?? "");
  }, [currentBranchId]);

  const selectedOption = options.find(
    (option) => option.value === selectedBranchId,
  );
  const hasChanged = selectedBranchId !== (currentBranchId ?? "");
  const isConfirmDisabled =
    isSaving || !selectedBranchId || !selectedOption || !hasChanged;

  const handleConfirm = async () => {
    if (!selectedOption) return;
    await onConfirm(selectedOption.value, selectedOption.label);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Seleccionar sucursal"
      panelClassName="!max-w-md w-full dark:border dark:border-neutral-700"
    >
      <div className="flex flex-col gap-5 items-center justify-between">
        <Dropdown
          appearance="dark"
          label="Sucursal"
          labelClassName="text-white"
          placeholder="Seleccione..."
          options={options}
          value={selectedBranchId}
          onChange={(value) => setSelectedBranchId(String(value))}
          className="w-full"
        />

        <div className="flex justify-end gap-3 w-full">
          <Button
            type="button"
            size="medium"
            label="Cancelar"
            onClick={onClose}
            className="..."
          />
          <Button
            type="button"
            size="medium"
            icon={isSaving ? <Spinner size="small" color="white" /> : undefined}
            label={isSaving ? "Guardando..." : "Confirmar"}
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="..."
          />
        </div>
      </div>
    </Modal>
  );
}
