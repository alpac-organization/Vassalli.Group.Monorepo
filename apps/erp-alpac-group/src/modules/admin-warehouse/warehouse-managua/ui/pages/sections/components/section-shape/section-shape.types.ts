export type SectionShapeStatus =
  | "available"
  | "occupied"
  | "maintenance"
  | "reserved";

export interface SectionShapeProps {
  /** Identificador de la sección (para key / selección). */
  id: string;

  /** Código visible en el plano (ej. SECTION_001). */
  code?: string | null;

  /** Posición X en metros (relativa al origen de la bodega). */
  x: number;

  /** Posición Y en metros (relativa al origen de la bodega). */
  y: number;

  /** Ancho en metros. */
  width: number;

  /** Largo / profundidad en metros. */
  length: number;

  /** Rotación en grados sobre Y (plano 2D). */
  rotation?: number;

  /** Color de relleno (hex). Si no se pasa, se usa el de status. */
  fill?: string;

  status?: SectionShapeStatus;

  selected?: boolean;

  /** Escala px/m. Por defecto 10, igual que WarehouseViewer. */
  pixelsPerMeter?: number;

  onSelect?: (id: string) => void;
}
