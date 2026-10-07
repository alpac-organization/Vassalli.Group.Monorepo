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
  enableRowHover?: boolean;
  height?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  enableSelectBorder?: boolean;
  /** Clave de la fila seleccionada (selección controlada desde fuera). */
  selectedRowKey?: string | null;
  /** Cómo obtener la clave de cada fila. Requerido si usas selectedRowKey. */
  getRowKey?: (row: T) => string;
};
