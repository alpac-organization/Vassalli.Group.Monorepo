import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses-response";
import {
  createSkeletonRow,
  type WarehouseTableRow,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-table/utils/skeleton-table";

/**
 * Transforma una lista plana de WarehouseDto, junto con un map de relaciones padre-hijo,
 * en filas lineales para la tabla (útil si se vuelve a habilitar subwarehouses).
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
