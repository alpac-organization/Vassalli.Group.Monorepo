import { Button, Modal } from "@alpac/design-system";
import type {
  ConfirmActionProps,
  ConfirmActionType,
} from "./confirm-modal.types";

export const ConfirmModal = ({
  isOpen,
  title,
  type,
  buttonActionLabel,
  buttonActionClass,
  onClose,
  handleFinalAction,
  isLoading = false,
  disabled = false,
}: ConfirmActionProps) => {
  const classButton =
    "rounded-md! px-6!  shadow-sm transition-all bg-red-500! text-white! duration-200 hover:bg-red-800! dark:bg-red-900!";
  const classButtonExit =
    "rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!";

  const handleFinalActionInternal = (type: ConfirmActionType) => {
    handleFinalAction(type);
  };

  return (
    <Modal
      size="md"
      variant="warning"
      isOpen={isOpen}
      onClose={() => !isLoading && onClose?.()}
    >
      <div className="flex flex-col gap-4 text-center">
        <p className="text-slate-600 dark:text-slate-300">{title}</p>

        <div className="flex justify-center gap-3 mt-4">
          <Button
            type="button"
            label="Salir"
            size="giant"
            className={`${classButtonExit}`}
            onClick={() => onClose?.()}
            disabled={isLoading || disabled}
          />
          <Button
            type="button"
            label={buttonActionLabel}
            size="giant"
            className={`${classButton} ${buttonActionClass}`}
            onClick={() => handleFinalActionInternal(type)}
            disabled={disabled}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};
