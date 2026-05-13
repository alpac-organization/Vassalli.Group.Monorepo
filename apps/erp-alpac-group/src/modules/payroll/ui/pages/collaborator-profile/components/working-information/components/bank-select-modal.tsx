import { useEffect, useState } from "react";
import { Button, Dropdown, Modal, Spinner } from "@alpac/design-system";
import type { BankSelectModalProps } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/types/bank-information.types";
export function BankSelectModal({
  isOpen,
  onClose,
  currentBankId,
  options,
  isSaving,
  onConfirm,
}: BankSelectModalProps) {
  const [selectedBankId, setSelectedBankId] = useState<string>(
    currentBankId ?? "",
  );

  useEffect(() => {
    setSelectedBankId(currentBankId ?? "");
  }, [currentBankId]);

  const selectedOption = options.find(
    (option) => option.value === selectedBankId,
  );
  const hasChanged = selectedBankId !== (currentBankId ?? "");
  const isConfirmDisabled =
    isSaving || !selectedBankId || !selectedOption || !hasChanged;

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
      title="Seleccionar banco"
      panelClassName="!max-w-md w-full dark:border dark:border-neutral-700"
    >
      <div className="flex flex-col gap-5 items-center justify-between">
        <Dropdown
          appearance="dark"
          label="Bancos"
          labelClassName="text-white"
          placeholder="Seleccione..."
          options={options}
          value={selectedBankId}
          onChange={(value) => setSelectedBankId(String(value))}
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
