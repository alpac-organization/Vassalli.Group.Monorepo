import { useState } from "react";
import { Controller } from "react-hook-form";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { InputText } from "@alpac/design-system";
import type { EditableFieldProps } from "../types/utils.type";
import { isValueMissing, missingDataInInputClassName } from "./field-missing-message";

const customInputClasses = `
  !transition-all !duration-200
  dark:!bg-[#1e2229] dark:!text-white dark:!border-slate-600/50 dark:!px-3
  focus:dark:!border-cyan-500/60 focus:dark:!ring-2 focus:dark:!ring-cyan-500/20
  disabled:dark:!bg-[#1e2229] disabled:dark:!text-slate-200 disabled:dark:!border-slate-700/50 disabled:!px-3 disabled:!opacity-100 disabled:!shadow-none disabled:!font-medium
`;
const labelClasses =
  "text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!";

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
  missingMessage,
}: EditableFieldProps) => {
  const {
    control,
    watch,
    setValue,
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
    <div className="flex min-w-0 flex-col gap-2 w-full max-w-full">
      <div className="flex min-w-0 items-end gap-2 sm:gap-2.5">
        <div className="min-w-0 flex-1 relative">
          <Controller
            name={name}
            control={control}
            rules={validation}
            render={({ field, fieldState }) => {
              const showMissingInline =
                !isEditing &&
                Boolean(missingMessage) &&
                isValueMissing(field.value);
              const displayValue = showMissingInline
                ? (missingMessage as string)
                : (field.value ?? "");
              const inputType = showMissingInline ? "text" : type;

              return (
                <InputText
                  label={label}
                  labelClassName={labelClasses}
                  type={inputType}
                  disabled={!isEditing || isUpdating}
                  editable={false}
                  error={fieldState.error?.message as string | undefined}
                  className={`${customInputClasses} min-w-0 w-full max-w-full ${showMissingInline ? missingDataInInputClassName : ""}`}
                  value={displayValue}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              );
            }}
          />
        </div>
        <div className="flex shrink-0 gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleStart}
              title="Editar campo"
              className="h-[42px] w-[42px] sm:h-12 sm:w-12 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-[#1e2229] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:border-cyan-300 dark:hover:border-blue-600 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all duration-200"
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
                className="h-[42px] w-[42px] sm:h-12 sm:w-12 flex items-center justify-center rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-300 dark:hover:border-red-500/50 disabled:opacity-50 transition-all duration-200"
              >
                <X size={16} />
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={isConfirmDisabled}
                title="Confirmar"
                className="h-[42px] w-[42px] sm:h-12 sm:w-12 flex items-center justify-center rounded-lg border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
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
