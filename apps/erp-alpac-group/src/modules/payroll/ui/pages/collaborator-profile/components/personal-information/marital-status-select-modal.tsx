import { useEffect, useMemo, useState } from "react";
import { Modal, Button, Dropdown } from "@alpac/design-system";
import { MaritalStatusOptions } from "@app/core/enums/marital-status.enum";
import {
  isValidMaritalStatusCode,
  MARITAL_STATUS_MIN,
} from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/normalizeMaritalStatusFromApi";
import type { MaritalStatusSelectModalProps } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/types/MaritalStatusSelectModalProps";

const dropdownOptions = MaritalStatusOptions.map((o) => ({
  value: o.value as number,
  label: o.label,
}));

export function MaritalStatusSelectModal({
  isOpen,
  onClose,
  companyId,
  currentMaritalStatus,
  identificationNumber,
  moduleCode,
  updateMutation,
  onMaritalSaved,
  onSuccessMessage,
  onErrorMessage,
}: MaritalStatusSelectModalProps) {
  const [selected, setSelected] = useState<number>(MARITAL_STATUS_MIN);

  const initialSelection = useMemo(() => {
    if (!isValidMaritalStatusCode(currentMaritalStatus)) {
      return MARITAL_STATUS_MIN;
    }
    return currentMaritalStatus;
  }, [currentMaritalStatus]);

  useEffect(() => {
    if (isOpen) {
      setSelected(initialSelection);
    }
  }, [isOpen, initialSelection]);

  const contextMissing =
    !companyId.trim() || !moduleCode.trim() || !identificationNumber.trim();

  const handleConfirm = () => {
    if (contextMissing) {
      onErrorMessage("Falta contexto de empresa o identificación.");
      return;
    }
    if (!isValidMaritalStatusCode(selected)) {
      onErrorMessage("Seleccione un estado civil válido.");
      return;
    }

    updateMutation.mutate(
      {
        company_id: companyId,
        module_code: moduleCode,
        identification_number: identificationNumber,
        personal_information: {
          marital_status: selected,
        },
      },
      {
        onSuccess: () => {
          onMaritalSaved(selected);
          onSuccessMessage();
          onClose();
        },
        onError: () => {
          onErrorMessage("No se pudo actualizar el estado civil.");
        },
      },
    );
  };

  const confirmDisabled =
    updateMutation.isPending ||
    !isValidMaritalStatusCode(selected) ||
    contextMissing;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Seleccionar estado civil"
      description="Elige el estado civil registrado para el colaborador."
      panelClassName="!max-w-md w-full dark:border dark:border-neutral-700"
    >
      <div className="flex flex-col gap-5">
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
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={onClose}
            className="min-w-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-white! border! border-slate-300! dark:border-neutral-400!"
          />
          <Button
            type="button"
            size="giant"
            label={updateMutation.isPending ? "Guardando…" : "Confirmar"}
            onClick={handleConfirm}
            disabled={confirmDisabled}
            className="min-w-0 text-[15px]! rounded-md! bg-alpac-primary-500! text-white! dark:bg-alpac-primary-500! dark:text-white! disabled:opacity-50!"
          />
        </div>
      </div>
    </Modal>
  );
}
