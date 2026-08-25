import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";
export type WarehouseTableRow = WarehouseDto & {
  depth: number;
  isSkeleton?: boolean;
};
// Esta función se utiliza para generar un  "skeleton" (de loading) en la tabla de bodegas mientras se obtienen los datos reales.
//  mostrando un placeholder visual durante la carga de datos.
export function createSkeletonRow(
  parentId: string,
  depth: number,
): WarehouseTableRow {
  return {
    warehouse_id: `skeleton-${parentId}`,
    warehouse_name: null,
    warehouse_code: null,
    is_active: false,
    warehouse_type: null,
    has_children: false,
    sections_count: 0,
    is_owner: false,
    capacity: { total_area_m2: 0 },
    depth,
    isSkeleton: true,
  };
}
