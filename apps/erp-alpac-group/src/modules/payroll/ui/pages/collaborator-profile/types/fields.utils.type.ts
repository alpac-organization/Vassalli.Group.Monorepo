import type { Path, FieldValues } from "react-hook-form";
export interface EditableFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  type?: "text" | "email" | "tel" | "date";
  className?: string;
  validation?: Record<string, any>;
  formMethods: any;
  isEditing: boolean;
  onEditStart: (name: string) => void;
  onEditEnd: (name: string) => void;
  onConfirmUpdate: (name: Path<TFieldValues>, value: string) => Promise<void>;
  missingMessage?: string;
  allowEdit?: boolean;
  displayFormat?: (value: string) => string;
}
