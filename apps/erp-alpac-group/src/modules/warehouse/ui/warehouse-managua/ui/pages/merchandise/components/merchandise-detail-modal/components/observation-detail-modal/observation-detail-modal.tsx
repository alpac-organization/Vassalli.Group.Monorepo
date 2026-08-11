import { useEffect } from "react";
import { Button, Modal, Textarea } from "@alpac/design-system";
import { X } from "lucide-react";
import { isValueMissing } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/utils/field-missing";

type ObservationDetailModalProps = {
  isOpen: boolean;
  observation: string;
  title?: string;
  emptyMessage?: string;
  onClose: () => void;
};

export function ObservationDetailModal({
  isOpen,
  observation,
  title = "Observaciones generales",
  emptyMessage = "Observaciones no registradas",
  onClose,
}: ObservationDetailModalProps) {
  const missing = isValueMissing(observation);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopImmediatePropagation();
      onClose();
    };

    window.addEventListener("keydown", handleEscape, true);
    return () => window.removeEventListener("keydown", handleEscape, true);
  }, [isOpen, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant="info"
      size="md"
      panelClassName="flex! flex-col! p-4! sm:p-6!"
    >
      <div className="flex flex-col gap-4">
        <Textarea
          readOnly
          rows={8}
          maxLength={4000}
          value={missing ? emptyMessage : observation}
          labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
          className={`min-h-40 resize-none dark:text-white! ${
            missing
              ? "text-red-500 dark:text-red-400!"
              : "text-slate-800 dark:text-white!"
          }`}
        />

        <div className="shrink-0 flex justify-end pt-3 border-t border-slate-200 dark:border-neutral-600">
          <Button
            type="button"
            size="medium"
            label="Cerrar"
            icon={<X size={16} />}
            ariaLabel="Cerrar observaciones"
            onClick={onClose}
            className="w-full sm:w-auto text-[13px]! text-white! bg-slate-500! dark:bg-slate-700! hover:bg-slate-600! dark:hover:bg-slate-600!"
          />
        </div>
      </div>
    </Modal>
  );
}
