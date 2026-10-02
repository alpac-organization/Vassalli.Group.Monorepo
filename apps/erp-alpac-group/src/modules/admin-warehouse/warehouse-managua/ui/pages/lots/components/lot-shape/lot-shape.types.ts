import type { LotDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { LotMenuState } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lot-shape/components/lot-shape-menu/lot-shape-menu.types";

export interface LotShapeProps {
  lot: LotDto;

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

  /** Color de relleno (hex). */
  fill?: string;

  strokeColor?: string;

  selected?: boolean;

  draggable?: boolean;
  resizable?: boolean;

  onSelect?: (lot: LotDto) => void;
  onContextMenu?: (menu: LotMenuState) => void;
  onCoordinateChange?: (id: string, x: number, y: number) => void;
  onResizeChange?: (id: string, width: number, length: number) => void;
}

/** Acota un valor entre min y max. */
export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
