import { useState } from "react";
import { Button, InputText, Modal } from "@alpac/design-system";
import { Plus, RotateCcw } from "lucide-react";
import { useMerchandise } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useMerchandise";
import type { RegisterNavieraModalProps } from "./types/register-naviera-modal.types";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

const labelClassName =
  "text-slate-600! dark:text-slate-300! text-[13px]! font-medium!";

export function RegisterNavieraModal({
  isOpen,
  company_id,
  module_code,
  onClose,
  onCreated,
}: RegisterNavieraModalProps) {
  const [name, setName] = useState("");
  const { getMappedError } = useMappedError();
  const { handleRequestError, handleRequestSuccess, AlertComponent } =
    useAlertState();

  const { CreateShippingCompany } = useMerchandise({
    payloadGetShippingCompany: { company_id, module_code },
  });

  const handleClose = () => {
    setName("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await CreateShippingCompany.mutateAsync({
        name: name.trim(),
        company_id,
        module_code,
      });
      handleRequestSuccess("Naviera registrada exitosamente.");
      setName("");
      onCreated?.();
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      const mappedError = getMappedError(error as ApiErrorResponse);
      handleRequestError(
        mappedError?.description || "Error al registrar la naviera.",
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar nueva naviera"
      description="Ingrese el nombre de la naviera que desea registrar."
    >
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="pt-2">
            <InputText
              label="Nombre de naviera"
              labelClassName={labelClassName}
              isRequired
              placeholder="Ej. Acme Corp."
              value={name}
              onChange={(e) => setName(e.target.value)}
              errorVariant="text"
              className="rounded-md! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-neutral-600">
            <Button
              type="button"
              size="small"
              label="Cancelar"
              icon={<RotateCcw size={16} />}
              isHiddenLabelOnMobile
              onClick={handleClose}
              disabled={CreateShippingCompany.isPending}
              className="text-[15px]! rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!"

            />
            <Button
              type="submit"
              size="giant"
              label="Registrar naviera"
              icon={<Plus size={16} />}
              isHiddenLabelOnMobile
              isLoading={CreateShippingCompany.isPending}
              className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            />
          </div>
        </form>

        {AlertComponent}
      </div>
    </Modal>
  );
}