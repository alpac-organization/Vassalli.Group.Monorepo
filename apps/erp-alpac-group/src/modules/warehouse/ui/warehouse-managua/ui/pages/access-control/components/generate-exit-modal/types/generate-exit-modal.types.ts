import type { DatePickerValue, TimePickerValue } from "@alpac/design-system";

export type GenerateExitFormValues = {
  specifyDateTime: boolean;
  exitDate: DatePickerValue | null;
  exitTime: TimePickerValue | null;
};

export type GenerateExitModalProps = {
  onClose: () => void;
  onSubmit: (data: GenerateExitFormValues) => void;
  isSubmitting?: boolean;
  entryAt?: string | null;
};
