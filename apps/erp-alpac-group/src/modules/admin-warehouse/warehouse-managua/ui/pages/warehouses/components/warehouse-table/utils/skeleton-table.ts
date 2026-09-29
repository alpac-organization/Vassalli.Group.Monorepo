import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";

export type WarehouseTableRow = WarehouseDto & {
  depth?: number;
  isSkeleton?: boolean;
};

export function createSkeletonRow(parentId: string, depth = 0): WarehouseTableRow {
  return {
    warehouse_id: `skeleton-${parentId}`,
    code: "",
    is_active: false,
    warehouse_type: null,
    depth,
    isSkeleton: true,
  };
}
