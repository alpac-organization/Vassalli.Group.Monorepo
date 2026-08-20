import type { DatePickerValue, TimePickerValue } from "@alpac/design-system";

export type GenerateExitFormValues = {
  specifyDateTime: boolean;
  exitDate: DatePickerValue | null;
  exitTime: TimePickerValue | null;
  exit_vehicle: boolean;
  exit_container: boolean;
};

export type GenerateExitModalProps = {
  onClose: () => void;
  onSubmit: (data: GenerateExitFormValues) => void;
  isSubmitting?: boolean;
  entryDate?: string | null;
  entryTime?: string | null;
};
