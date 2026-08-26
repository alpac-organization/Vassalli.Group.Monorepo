import { createSkeletonRow } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-table/utils/skeleton-table";
import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";
import type { WarehouseTableRow } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-table/utils/skeleton-table";

/**
 * La función utility transforma una lista plana de objetos WarehouseDto, junto con un map de relaciones padre-hijo (childrenByParentId),
 * en una estructura de datos lineal  que refleja el árbol de bodegas para las filas de la tabla en la UI.
 * Esta Usa recursión porque cada bodega puede tener hijos (sub-bodegas) y la profundidad de anidamiento es dinamica.
 */
export function buildWarehouseTableRows(
  warehouses: WarehouseDto[],
  childrenByParentId: Record<string, WarehouseDto[]>,
  loadingParentIds: ReadonlySet<string> = new Set(),
  depth = 0,
): WarehouseTableRow[] {
  return warehouses.flatMap((warehouse) => {
    const row: WarehouseTableRow = { ...warehouse, depth };
    const children = childrenByParentId[warehouse.warehouse_id];
    const isLoadingChildren = loadingParentIds.has(warehouse.warehouse_id);

    if (!children?.length) {
      if (isLoadingChildren) {
        return [row, createSkeletonRow(warehouse.warehouse_id, depth + 1)];
      }
      return [row];
    }

    const childRows = buildWarehouseTableRows(
      children,
      childrenByParentId,
      loadingParentIds,
      depth + 1,
    );

    return [row, ...childRows];
  });
}
