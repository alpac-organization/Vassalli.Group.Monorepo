import { useState } from "react";
import { Modal, Button, Dropdown } from "@alpac/design-system";
import { MaritalStatusOptions } from "@app/core/enums/marital-status.enum";
import { isValidMaritalStatusCode } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/marital-status.utils";
import type { MaritalStatusSelectModalProps } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/types/MaritalStatusSelectModalProps";
import { Spinner } from "@alpac/design-system";
const dropdownOptions = MaritalStatusOptions.map((o) => ({
  value: o.value as number,
  label: o.label,
}));

export function MaritalStatusSelectModal({
  isOpen,
  onClose,
  currentMaritalStatus,
  isSaving,
  onConfirm,
}: MaritalStatusSelectModalProps) {
  const [selected, setSelected] = useState<number>(currentMaritalStatus);

  const handleConfirm = async () => {
    if (!isValidMaritalStatusCode(selected)) return;
    await onConfirm(selected);
    onClose();
  };

  const hasChanged = selected !== currentMaritalStatus;
  const isConfirmDisabled =
    isSaving || !isValidMaritalStatusCode(selected) || !hasChanged;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Seleccionar estado civil"
      panelClassName="!max-w-md w-full dark:border dark:border-neutral-700"
    >
      <div className="flex flex-col gap-5 items-center justify-between">
        <Dropdown
          appearance="dark"
          label="Estado civil"
          labelClassName="text-white"
          placeholder="Seleccione…"
          options={dropdownOptions}
          value={selected}
          onChange={(v) => setSelected(Number(v))}
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
            label={isSaving ? "Guardando…" : "Confirmar"}
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="..."
          />
        </div>
      </div>
    </Modal>
  );
}
