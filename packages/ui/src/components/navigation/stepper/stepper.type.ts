/**
 * Indica el estado de un paso en el stepper.
 */
export type StepperStepStatus = "approved" | "rejected" | "pending";

export interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
  stepStatuses?: StepperStepStatus[];
}
