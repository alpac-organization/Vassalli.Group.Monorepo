import type { Positions } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-res";

export function sortRackPositions(positions: Positions[]) {
  return [...positions].sort(
    (left, right) => left.position_number - right.position_number,
  );
}
