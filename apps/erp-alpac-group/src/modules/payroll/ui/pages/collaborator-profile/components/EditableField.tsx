import { useState } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { InputText } from "@alpac/design-system";
import type { EditableFieldProps } from "../types/utils.type";

const customInputClasses = `
  !h-[42px] !transition-all !duration-200
  dark:!bg-[#1a1c20] dark:!text-white dark:!border-transparent focus:dark:!border-blue-500/50
  disabled:dark:!bg-transparent disabled:dark:!text-slate-300 disabled:dark:!border-transparent disabled:!px-0 disabled:!opacity-100 disabled:!shadow-none
`;

export const EditableField = ({
  name,
  label,
  type = "text",
  validation = {},
  formMethods,
  isEditing,
  onEditStart,
  onEditEnd,
  onConfirmUpdate,
}: EditableFieldProps) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = formMethods;

  const [originalValue, setOriginalValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const currentValue = watch(name);

  const handleStart = () => {
    setOriginalValue(currentValue ?? "");
    onEditStart(name);
  };

  const handleCancel = () => {
    setValue(name, originalValue, { shouldValidate: true, shouldDirty: true });
    onEditEnd(name);
  };

  const handleConfirm = async () => {
    if (!currentValue || String(currentValue).trim() === "") return;

    setIsUpdating(true);
    try {
      await onConfirmUpdate(name, String(currentValue));
      onEditEnd(name);
    } catch (error) {
      console.error("Error actualizando campo:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const isConfirmDisabled =
    !currentValue || String(currentValue).trim() === "" || isUpdating;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[12px] font-medium text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <InputText
            type={type}
            disabled={!isEditing || isUpdating}
            editable={false}
            error={errors[name]?.message}
            className={customInputClasses}
            {...register(name, validation)}
          />
        </div>
        <div className="flex gap-2 shrink-0">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleStart}
              title="Editar campo"
              className="h-[42px] w-[42px] flex items-center justify-center rounded-[10px] border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-[#1a1c20] dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#25282e] transition-colors"
            >
              <Pencil size={18} />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUpdating}
                title="Cancelar edición"
                className="h-[42px] w-[42px] flex items-center justify-center rounded-[10px] border-transparent bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 disabled:opacity-50 transition-colors"
              >
                <X size={18} />
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={isConfirmDisabled}
                title="Confirmar"
                className="h-[42px] w-[42px] flex items-center justify-center rounded-[10px] border-transparent bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Check size={18} />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
