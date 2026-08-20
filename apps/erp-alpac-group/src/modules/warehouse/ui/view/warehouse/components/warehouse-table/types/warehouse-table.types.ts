import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";

export type WarehouseTableRow = WarehouseDto & {
  depth: number;
};

export type WarehouseTableProps = {
  data: WarehouseTableRow[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onViewSections: (warehouse: WarehouseDto) => void;
  isFetching?: boolean;
};

/** Aplana el árbol de `sub_warehouses` para filas de tabla con indentación. */
export function flattenWarehouseRows(
  warehouses: WarehouseDto[],
  depth = 0,
): WarehouseTableRow[] {
  return warehouses.flatMap((warehouse) => [
    { ...warehouse, depth },
    ...flattenWarehouseRows(warehouse.sub_warehouses ?? [], depth + 1),
  ]);
}
