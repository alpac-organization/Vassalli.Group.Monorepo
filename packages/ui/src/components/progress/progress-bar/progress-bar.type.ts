export type ProgressBarProps = {
  total: number;
  completed: number;
  remaining?: number;
  color?: string;
  totalLabel?: string;
  completedLabel?: string;
  remainingLabel?: string;
  unitOfMeasurement?: string;
};
