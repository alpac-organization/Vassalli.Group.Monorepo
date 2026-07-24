// ============================================================
// MEDIDAS EXTRAÍDAS DEL PLANO — "Bodega #2 Fiscal"
// ============================================================
export const MARGIN = 0.6          // espacio entre pared y tramo
export const PASILLO_W = 4.4       // ancho de cada pasillo
export const DIVIDER_W = 0   // línea de separación centro (tramos 51-70 divididos en 2)

export const COL1_LARGO = 8.85     // ancho (eje X) tramos T-41 a T-50
export const COL2_LARGO = 4.75     // ancho (eje X) tramos T-51 a T-60
export const COL3_LARGO = 4.75     // ancho (eje X) tramos T-61 a T-70
export const COL4_LARGO = 8.85     // ancho (eje X) tramos T-71 a T-80

export const ANCHO_BORDE = 5.23    // profundidad (eje Z) del primer/último tramo de cada columna
export const ANCHO_MEDIO = 6.0     // profundidad (eje Z) de los tramos intermedios
export const GALERON_LARGO = 12.1  // profundidad del galerón (entrada)
export const BODEGA_LARGO = 61.02  // profundidad de la bodega principal (referencia del plano)

export const ALTURA_BAJA = 6.57    // altura lado bajo del techo (lado del galerón)
export const ALTURA_ALTA = 9.05    // altura lado alto del techo (fondo de la bodega)

export const WAREHOUSE_WIDTH =
   2 * MARGIN + COL1_LARGO + PASILLO_W + COL2_LARGO + DIVIDER_W + COL3_LARGO + PASILLO_W + COL4_LARGO
export const TOTAL_LARGO = GALERON_LARGO + BODEGA_LARGO