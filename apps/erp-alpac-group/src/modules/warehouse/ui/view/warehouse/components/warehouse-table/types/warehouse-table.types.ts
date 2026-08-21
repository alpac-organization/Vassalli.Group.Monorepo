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
  onAttachSubwarehouse: (warehouse: WarehouseDto) => void;
  isFetching?: boolean;
};

// Esta función toma una lista de bodegas (y sus posibles sub-bodegas anidadas)
// y las convierte en una lista plana, asignando a cada una un nivel de profundidad .
// Es útil aui para mostrar estructuras jerárquicas en la tabla donde se necesita una representación lineal.
export function flattenWarehouseRows(
  warehouses: WarehouseDto[],
  depth = 0,
): WarehouseTableRow[] {
  return warehouses.flatMap((warehouse) => [
    { ...warehouse, depth },
    ...flattenWarehouseRows(warehouse.sub_warehouses ?? [], depth + 1),
  ]);
}
