import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";
import type { SectionMenuState } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-shape/components/section-shape-menu/section-shape-menu.types";

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

  strokeColor?: string;

  selected?: boolean;

  draggable?: boolean;
  resizable?: boolean;

  onSelect?: (section: SectionDto) => void;
  onContextMenu?: (menu: SectionMenuState) => void;
  onCoordinateChange?: (id: string, x: number, y: number) => void;
  onResizeChange?: (id: string, width: number, length: number) => void;  
}