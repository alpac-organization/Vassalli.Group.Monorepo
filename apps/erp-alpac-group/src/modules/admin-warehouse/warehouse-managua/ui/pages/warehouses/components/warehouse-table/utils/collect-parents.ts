import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";

/**
 * Recopila IDs de bodegas ya cargadas como hijos, útil si más adelante
 * se vuelve a habilitar la carga progresiva de subwarehouses.
 */
export function collectParentIdsToFetch(
  warehouses: WarehouseDto[],
  childrenByParentId: Record<string, WarehouseDto[]>,
): string[] {
  const ids = new Set<string>();

  const walk = (items: WarehouseDto[]) => {
    for (const warehouse of items) {
      const children = childrenByParentId[warehouse.warehouse_id];
      if (children?.length) {
        ids.add(warehouse.warehouse_id);
        walk(children);
      }
    }
  };

  walk(warehouses);
  return Array.from(ids);
}
