const PAGE_WIDTH = 612;
const PAGE_PADDING = 28 * 2;
const SAFETY_BUFFER = 20;
const COMPANY_NAME_H = 20;

const TITLE_H = 16;
const PERIOD_H = 18;
const HEADER_H = COMPANY_NAME_H + TITLE_H + PERIOD_H;

const INFO_ROW_H = 14;
const INFO_BOX_PADDING = 6 * 2;
const INFO_BOX_BORDER = 2;
const INFO_BOX_MARGIN_B = 12;

const TABLE_BORDER = 2;
const TABLE_HEADER_H = 18;

const LINE_ITEM_H = 14;
const OVERTIME_EXTRA_H = 16;

const TOTALS_ROW_H = 20;
const NET_ROW_H = 16;
const TABLE_MARGIN_B = 12;

const SIGNATURE_MARGIN_T = 24;
const SIGNATURE_LINE_H = 4;
const SIGNATURE_LABEL_H = 14;
const SIGNATURE_H = SIGNATURE_MARGIN_T + SIGNATURE_LINE_H + SIGNATURE_LABEL_H;

const ROUTE_TABLE_MARGIN_T = 8;
const ROUTE_BORDER = 2;
const ROUTE_HEADER_H = 30;
const ROUTE_ROW_H = 18;

/**
 * Calcula el tamaño de la página para el recibo de pago estándar en formato PDF.
 * Esta función estima dinámicamente el alto necesario del recibo de pago,
 * tomando en cuenta la cantidad de filas de ingresos, deducciones,
 *si debe agregarse una fila extra por horas extras.
 *
 * @param incomeRowCount - Número de filas de ingresos a mostrar.
 * @param deductionRowCount - Número de filas de deducciones a mostrar.
 * @param hasOvertimeExtra - Indica si debe agregarse una fila adicional por horas extras.
 * @returns Una tupla con el ancho y alto de la página.
 */
export function getStandardPageSize(
  incomeRowCount: number,
  deductionRowCount: number,
  hasDAEM: boolean,
  hasOvertimeExtra: boolean,
): [number, number] {
  const infoRows = 2 + (hasDAEM ? 1 : 0);
  const infoBoxH =
    INFO_BOX_BORDER +
    INFO_BOX_PADDING +
    infoRows * INFO_ROW_H +
    INFO_BOX_MARGIN_B;

  const bodyRows = Math.max(incomeRowCount, deductionRowCount);
  const bodyH =
    bodyRows * LINE_ITEM_H + (hasOvertimeExtra ? OVERTIME_EXTRA_H : 0);

  const tableH =
    TABLE_BORDER +
    TABLE_HEADER_H +
    bodyH +
    TOTALS_ROW_H +
    NET_ROW_H +
    TABLE_MARGIN_B;

  const height =
    PAGE_PADDING + HEADER_H + infoBoxH + tableH + SIGNATURE_H + SAFETY_BUFFER;

  return [PAGE_WIDTH, Math.ceil(height)];
}

/**
 * Calcula el tamaño de la página para el recibo de pago de transportistas en formato PDF.
 * Esta función estima dinámicamente el alto necesario del recibo de pago de transportistas,
 * tomando en cuenta la cantidad de filas de ingresos y de rutas a mostrar,
 * para asegurar que la información del colaborador y los detalles del pago se visualicen correctamente.
 *
 * @param incomeRowCount - Número de filas de ingresos a mostrar.
 * @param routeCount - Número de rutas (viajes) a mostrar en la tabla de rutas.
 * @returns Una tupla con el ancho y alto de la página.
 */
export function getTransportistasPageSize(
  incomeRowCount: number,
  routeCount: number,
): [number, number] {
  const infoBoxH =
    INFO_BOX_BORDER + INFO_BOX_PADDING + 3 * INFO_ROW_H + INFO_BOX_MARGIN_B;

  const routeTableH =
    routeCount > 0
      ? ROUTE_TABLE_MARGIN_T +
        ROUTE_BORDER +
        ROUTE_HEADER_H +
        routeCount * ROUTE_ROW_H
      : 0;

  const deductRows = 3;
  const bodyH =
    Math.max(incomeRowCount, deductRows) * LINE_ITEM_H + routeTableH;

  const tableH =
    TABLE_BORDER +
    TABLE_HEADER_H +
    bodyH +
    TOTALS_ROW_H +
    NET_ROW_H +
    TABLE_MARGIN_B;

  const height =
    PAGE_PADDING + HEADER_H + infoBoxH + tableH + SIGNATURE_H + SAFETY_BUFFER;

  return [PAGE_WIDTH, Math.ceil(height)];
}
