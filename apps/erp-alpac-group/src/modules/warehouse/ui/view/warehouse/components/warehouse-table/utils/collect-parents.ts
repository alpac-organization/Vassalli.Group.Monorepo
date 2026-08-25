import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";
/**
 * Esta función itera recursivamente una estructura de datos de warehouses para recopilar los parentIDs de Warehouse
 *  que tienen hijos. Es útil para identificar los almacenes padres que requieren
 * una consulta adicional para traer subwarehouses en la UI, optimizando así la carga progresiva de datos.
 */
export function collectParentIdsToFetch(
  warehouses: WarehouseDto[],
  childrenByParentId: Record<string, WarehouseDto[]>,
): string[] {
  const ids = new Set<string>();

  const walk = (items: WarehouseDto[]) => {
    for (const warehouse of items) {
      if (warehouse.has_children) {
        ids.add(warehouse.warehouse_id);
      }

      const children = childrenByParentId[warehouse.warehouse_id];
      if (children) {
        walk(children);
      }
    }
  };

  walk(warehouses);
  return Array.from(ids);
}
