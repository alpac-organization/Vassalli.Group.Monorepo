import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type AccessControlEditableFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "number";
  className?: string;
  validation?: Record<string, unknown>;
  formMethods: UseFormReturn<TFieldValues>;
  isEditing: boolean;
  onEditStart: (name: string) => void;
  onEditEnd: (name: string) => void;
  onConfirmUpdate: (name: Path<TFieldValues>, value: string) => Promise<void>;
  missingMessage?: string;
  allowEdit?: boolean;
  allowEmptySubmit?: boolean;
};
