export type TableColumn<T> = {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
};

export type DataTableProps<T> = {
  title?: string;
  data: T[];
  columns: TableColumn<T>[];
  rowClassName?: string;
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
  pagination?: React.ReactNode;
  toolbarEnd?: React.ReactNode;
  onDelete?: (row: T) => void;
  deleteIcon?: React.ReactNode;
  deleteText?: string;
  isLoading?: boolean;
  loadingTitle?: string;
};
