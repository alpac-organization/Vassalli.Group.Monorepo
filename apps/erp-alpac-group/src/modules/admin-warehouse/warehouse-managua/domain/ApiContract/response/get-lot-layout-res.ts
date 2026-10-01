export interface LotLayoutItemResponse {
  lot_id: string;
  code: string;
  status: string | number | null;
  allows_stacking: boolean;
  /** Ancho del tramo en metros; 0 cuando no tiene capacidad registrada. */
  width: number;
  /** Largo del tramo en metros; 0 cuando no tiene capacidad registrada. */
  length: number;
  /** Indica si ya existen coordenadas persistidas; define POST vs PATCH al guardar. */
  has_coordinates: boolean;
  position_x: number;
  position_y: number;
  position_z: number;
  rotation_y: number;
}

export interface LotLayoutResponse {
  section_id: string;
  section_code: string | null;
  section_is_active: boolean;
  /** Ancho de la sección en metros; 0 cuando no tiene capacidad registrada. */
  section_width: number;
  /** Largo de la sección en metros; 0 cuando no tiene capacidad registrada. */
  section_length: number;
  section_position_x: number;
  section_position_y: number;
  /** Todos los tramos de la sección, sin paginar. */
  lots: LotLayoutItemResponse[];
}
