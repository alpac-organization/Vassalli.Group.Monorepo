import type {
  PersonalFormData,
  WorkFormData,
} from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
import type {
  FieldPath,
  FieldValues,
  UseFormRegister,
  UseFormReturn,
  UseFormWatch,
} from "react-hook-form";

export interface EditableFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  type?: string;
  validation?: object;
  formMethods: UseFormReturn<TFieldValues>;
  isEditing: boolean;
  onEditStart: (name: string) => void;
  onEditEnd: (name: string) => void;
  onConfirmUpdate: (
    name: FieldPath<TFieldValues>,
    value: string,
  ) => Promise<void>;
  /** Si el valor está vacío y no se está editando, se muestra dentro del input. */
  missingMessage?: string;
  fieldVariant?: "text" | "select";
  selectOptions?: { value: string; label: string }[];
  /** Texto mostrado en modo lectura cuando `fieldVariant` es `select`. */
  formatDisplayValue?: (storedValue: string) => string;
  className?: string;
  /**
   * Si es false, no se muestran acciones de edición (solo lectura). Por defecto true.
   */
  allowEdit?: boolean;
}

export type ReadonlyPersonalFieldProps = {
  name: keyof PersonalFormData;
  label: string;
  missingLabel: string;
  formMethods: UseFormReturn<PersonalFormData>;
  readOnlyInputClasses: string;
  type?: "text" | "email" | "date" | "tel";
  formatDisplay?: (raw: string) => string;
};

export type ReadonlyWorkFieldProps = {
  name: keyof WorkFormData;
  label: string;
  missingLabel: string;
  register: UseFormRegister<WorkFormData>;
  watch: UseFormWatch<WorkFormData>;
  readOnlyInputClasses: string;
  type?: "text" | "email" | "date" | "tel";
};
