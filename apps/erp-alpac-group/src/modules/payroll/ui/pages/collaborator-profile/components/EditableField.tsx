import { useState } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { InputText } from "@alpac/design-system";
import type { EditableFieldProps } from "../types/utils.type";

const customInputClasses = `
  !h-[42px] !transition-all !duration-200
  dark:!bg-[#1e2229] dark:!text-white dark:!border-slate-600/50 dark:!px-3
  focus:dark:!border-cyan-500/60 focus:dark:!ring-2 focus:dark:!ring-cyan-500/20
  disabled:dark:!bg-[#1e2229] disabled:dark:!text-slate-200 disabled:dark:!border-slate-700/50 disabled:!px-3 disabled:!opacity-100 disabled:!shadow-none disabled:!font-medium
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
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-blue-500" />
        {label}
      </label>
      <div className="flex items-start gap-2.5">
        <div className="flex-1 relative">
          <InputText
            type={type}
            disabled={!isEditing || isUpdating}
            editable={false}
            error={errors[name]?.message}
            className={customInputClasses}
            {...register(name, validation)}
          />
          {isEditing && (
            <div className="absolute -top-2 -right-2 w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-lg shadow-cyan-500/50" />
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleStart}
              title="Editar campo"
              className="h-[42px] w-[42px] flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-[#1e2229] text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-300 dark:hover:border-cyan-500/50 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all duration-200"
            >
              <Pencil size={16} />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUpdating}
                title="Cancelar edición"
                className="h-[42px] w-[42px] flex items-center justify-center rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-300 dark:hover:border-red-500/50 disabled:opacity-50 transition-all duration-200"
              >
                <X size={16} />
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={isConfirmDisabled}
                title="Confirmar"
                className="h-[42px] w-[42px] flex items-center justify-center rounded-lg border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isUpdating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
