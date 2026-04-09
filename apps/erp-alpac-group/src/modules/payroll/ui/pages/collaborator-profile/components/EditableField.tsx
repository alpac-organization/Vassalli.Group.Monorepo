import { useState } from "react";
import type { FieldValues } from "react-hook-form";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { InputText } from "@alpac/design-system";

import type { EditableFieldProps } from "@app/modules/payroll/ui/pages/collaborator-profile/types/fields.utils.type";

import {
  isValueMissing,
  missingDataInInputClassName,
} from "@app/modules/payroll/ui/pages/collaborator-profile/utils/field-missing-message";

function formatDateLikeValue(value: unknown): string {
  if (value == null || value === "") return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return String(value);
}

function formatValueForSubmit(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return String(value ?? "");
}

export function EditableField<TFieldValues extends FieldValues>({
  name,
  label,
  className = "",
  type = "text",
  validation = {},
  formMethods,
  isEditing,
  onEditStart,
  onEditEnd,
  onConfirmUpdate,
  missingMessage,
  fieldVariant = "text",
  selectOptions = [],
  formatDisplayValue,
  allowEdit = true,
}: EditableFieldProps<TFieldValues>) {
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
    setOriginalValue(
      type === "date"
        ? formatDateLikeValue(currentValue)
        : String(currentValue ?? ""),
    );
    onEditStart(name as string);
  };

  const handleCancel = () => {
    setValue(name, originalValue as never, {
      shouldValidate: true,
      shouldDirty: true,
    });
    onEditEnd(name as string);
  };

  const handleConfirm = async () => {
    if (fieldVariant === "text") {
      const empty =
        currentValue === "" ||
        currentValue === undefined ||
        currentValue === null ||
        (typeof currentValue === "string" && currentValue.trim() === "");
      if (empty) return;
    } else {
      if (
        currentValue === "" ||
        currentValue === undefined ||
        currentValue === null
      )
        return;
    }

    setIsUpdating(true);
    try {
      await onConfirmUpdate(name, formatValueForSubmit(currentValue));
      onEditEnd(name as string);
    } catch (error) {
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const isConfirmDisabled =
    fieldVariant === "text"
      ? !currentValue ||
        (typeof currentValue === "string" && currentValue.trim() === "") ||
        isUpdating
      : currentValue === "" ||
        currentValue === undefined ||
        currentValue === null ||
        isUpdating;

  const showMissingInline =
    !isEditing && Boolean(missingMessage) && isValueMissing(currentValue);

  /** Dato vacío en lectura: mensaje explícito o placeholder vía formatDisplayValue. */
  const showMissingStyle =
    !isEditing &&
    isValueMissing(currentValue) &&
    (Boolean(missingMessage) || Boolean(formatDisplayValue));

  const rawTextForDisplay =
    type === "date"
      ? formatDateLikeValue(currentValue)
      : String(currentValue ?? "");

  const displayForText = showMissingInline
    ? (missingMessage as string)
    : isEditing
      ? rawTextForDisplay
      : formatDisplayValue
        ? formatDisplayValue(rawTextForDisplay)
        : rawTextForDisplay;

  const displayForSelect = showMissingInline
    ? (missingMessage as string)
    : isEditing
      ? String(currentValue ?? "")
      : formatDisplayValue
        ? formatDisplayValue(String(currentValue ?? ""))
        : String(currentValue ?? "");

  const inputType = showMissingInline ? "text" : type;
  const errorMessage = errors[name]?.message as string | undefined;

  const inputClassBase = `transition-all! duration-200! dark:bg-[#1e2229]! dark:border-slate-600/50! dark:px-3!
                        focus:dark:border-cyan-500/60! focus:dark:ring-2! focus:dark:ring-cyan-500/20!
                        disabled:dark:bg-[#1e2229]! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium!
                        min-w-0 w-full max-w-full`;

  const valueToneClasses = showMissingStyle
    ? missingDataInInputClassName
    : "text-white! dark:text-white!";
  const readonlyMutedWhenFilled = !showMissingStyle && !isEditing;

  const selectClassName = `${inputClassBase} rounded-lg border border-slate-600/50 bg-[#1e2229] py-2.5 px-3 text-sm text-white`;

  return (
    <div className="flex min-w-0 flex-col gap-2 w-full max-w-full">
      <div className="flex min-w-0 items-end gap-2 sm:gap-2.5">
        <div className="min-w-0 flex-1 relative">
          {fieldVariant === "select" ? (
            <>
              <label className="block text-[13px] sm:text-[14px] font-medium ml-0.5 text-white mb-2">
                {label}
              </label>

              {isEditing && allowEdit ? (
                <select
                  {...register(name, validation)}
                  disabled={isUpdating}
                  className={selectClassName}
                  defaultValue={currentValue ?? ""}
                >
                  <option value="">Seleccione…</option>
                  {selectOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <InputText
                  label=""
                  labelClassName="hidden"
                  type="text"
                  disabled
                  editable={false}
                  error={errorMessage}
                  className={`${inputClassBase} ${valueToneClasses}
                    ${readonlyMutedWhenFilled ? "disabled:dark:text-slate-200!" : ""}`}
                  value={displayForSelect}
                />
              )}
            </>
          ) : (
            <InputText
              label={label}
              labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
              type={inputType}
              disabled={!isEditing || !allowEdit || isUpdating}
              editable={false}
              error={errorMessage}
              className={`${inputClassBase} ${className} ${valueToneClasses}
                ${readonlyMutedWhenFilled ? "disabled:dark:text-slate-200!" : ""}`}
              value={displayForText}
              {...register(name, validation)}
            />
          )}
        </div>

        {allowEdit ? (
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
        ) : null}
      </div>
    </div>
  );
}
