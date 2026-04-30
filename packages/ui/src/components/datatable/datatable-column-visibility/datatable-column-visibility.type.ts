export type DataTableColumnVisibilityProps = {
  title?: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (next: string[]) => void;
};
