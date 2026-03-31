import type { PersonalFormData } from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
import type { UseFormReturn } from "react-hook-form";
export interface EditableFieldProps {
  name: keyof PersonalFormData;
  label: string;
  type?: string;
  validation?: object;
  formMethods: UseFormReturn<PersonalFormData>;
  isEditing: boolean;
  onEditStart: (name: string) => void;
  onEditEnd: (name: string) => void;
  onConfirmUpdate: (
    name: keyof PersonalFormData,
    value: string,
  ) => Promise<void>;
  /** Si el valor está vacío y no se está editando, se muestra dentro del input. */
  missingMessage?: string;
}
