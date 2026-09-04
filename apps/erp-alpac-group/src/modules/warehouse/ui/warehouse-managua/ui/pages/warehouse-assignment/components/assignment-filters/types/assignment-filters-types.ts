import type { AssignmentFilters } from "../../../types/assignment.types";


export type AssignmentFiltersProps = {
  onApply: (filters: AssignmentFilters) => void;
  onClear: () => void;
  defaultValues?: AssignmentFilters;
};