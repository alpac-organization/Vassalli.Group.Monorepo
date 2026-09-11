import type { LotPositionResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-detail";

// La función siguiente crea un hashMap para acceder en tiempo constante a las posiciones de un lote usando el formato "row-column" como key, facilitando la ubicación de posiciones por su fila y columna , que luego se ocupa en la modal de detalle de un tramo.
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
