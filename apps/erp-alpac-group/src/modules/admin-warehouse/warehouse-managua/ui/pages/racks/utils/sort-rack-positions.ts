import type { GetRackDetailResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-detail";

export function sortRackPositions(
  positions: GetRackDetailResponse["positions"],
) {
  return [...positions].sort(
    (left, right) => left.position_number - right.position_number,
  );
}
