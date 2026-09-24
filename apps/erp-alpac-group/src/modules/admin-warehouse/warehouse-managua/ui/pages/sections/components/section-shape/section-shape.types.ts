import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";
import type { SectionMenuState } from "./components/section-shape-menu/section-shape-menu.types";

export type SectionShapeStatus =
  | "available"
  | "occupied"
  | "maintenance"
  | "reserved";

export interface SectionShapeProps {
  
  section: SectionDto;

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

  draggable?: boolean;
  resizable?: boolean;

  onSelect?: (section: SectionDto) => void;
  onContextMenu?: (menu: SectionMenuState) => void;
  onPositionChange?: (id: string, x: number, y: number) => void;
  onResizeChange?: (id: string, width: number, length: number) => void;
  // onResizePreview?: (id: string, width: number, length: number) => void;
}