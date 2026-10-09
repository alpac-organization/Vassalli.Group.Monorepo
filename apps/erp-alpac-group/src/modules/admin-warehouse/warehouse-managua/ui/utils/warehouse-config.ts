export const METRIC_SIZE = 40;
export const CANVAS_PADDING_LEFT = 40;
export const PIXELS_PER_METER = 12;
export const MIN_SCALED_MEASURE_PX = 100;
export const POLIN_WIDTH_METER = 1.0;
export const POLIN_DEEP_METER = 1.2;
/** Ancho / profundidad estándar de un rack (metros). */
export const RACK_WIDTH_METER = 1.07;
/** Largo estándar de un rack (metros). */
export const RACK_LENGTH_METER = 2.44;
/** Altura estándar de un rack / posición (metros). */
export const RACK_HEIGHT_METER = 1.52;
/** Posiciones por rack (apiladas a lo largo del largo). */
export const RACK_POSITIONS_PER_RACK = 2;
/** Largo de cada posición dentro del rack (metros): 2.44 / 2. */
export const RACK_POSITION_LENGTH_METER =
	RACK_LENGTH_METER / RACK_POSITIONS_PER_RACK;