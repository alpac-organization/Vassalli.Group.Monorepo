/** Rango aplicado en la página: `null` = sin filtro (fechas vacías). */
export type AppliedDateRange = {
  start_date: string | null;
  end_date: string | null;
};

export function emptyDateRange(): AppliedDateRange {
  return { start_date: null, end_date: null };
}

/**
 * Sin total del backend: si la página está llena, asumimos que puede haber más;
 * si viene incompleta, es la última página.
 */
export function estimateTotalRecordsForPagination(
  itemsLength: number,
  pageNumber: number,
  pageSize: number,
): number {
  if (itemsLength < pageSize) {
    return (pageNumber - 1) * pageSize + itemsLength;
  }
  return pageNumber * pageSize + 1;
}
