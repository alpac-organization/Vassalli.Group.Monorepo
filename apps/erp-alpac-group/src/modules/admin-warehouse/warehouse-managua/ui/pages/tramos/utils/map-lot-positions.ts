import type { LotPositionResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-detail";

export function getLotPositionMap(
  positions: LotPositionResponse[],
): Map<string, LotPositionResponse> {
  const positionsByRowColumn = new Map<string, LotPositionResponse>();

  for (const position of positions) {
    positionsByRowColumn.set(
      `${position.row_number}-${position.column_number}`,
      position,
    );
  }

  return positionsByRowColumn;
}
