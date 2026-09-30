/**
 * Determina si la sección tiene orientación horizontal o vertical según sus dimensiones.
 * @param sectionLength - Longitud de la sección (en metros).
 * @param sectionWidth - Ancho de la sección (en metros).
 * @returns `true` si la sección es vertical (longitud >= ancho), `false` si es horizontal.
 */
export const isSectionVertical = (
  sectionLength: number = 0,
  sectionWidth: number = 0,
): boolean => {
  return (sectionLength || 0) >= (sectionWidth || 0);
};
