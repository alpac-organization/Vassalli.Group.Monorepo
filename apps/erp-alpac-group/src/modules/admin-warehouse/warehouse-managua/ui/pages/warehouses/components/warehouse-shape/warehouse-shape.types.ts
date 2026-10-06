import type { ReactNode } from "react";
import type { GaleronDto } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-shape/galeron-shape.types";
import type { GaleronMenuState } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-shape/components/galeron-shape-menu.types";

export interface WarehouseViewerProps {
   width: number;
   length: number;
   marginTop?: number;
   marginBottom?: number;
   marginLeft?: number;
   marginRight?: number;
   draggable?: boolean;
   galerons?: GaleronDto[];
   children?: ReactNode;
   title?: ReactNode;
   selectedLabel?: ReactNode;
   overlay?: ReactNode;
   containerClassName?: string;
   editingGalerongId?: string | null;
   selectedGaleronId?: string | null;
   onGaleronContextMenu?: (menu: GaleronMenuState) => void;
   onSelectGaleron?: (galeron: GaleronDto) => void;
   onGaleronCoordinateChange?: (id: string, x: number, y: number) => void;
   onGaleronResizeChange?: (id: string, width: number, length: number) => void;
}

export interface Coordinate {
   x: number;
   y: number;
   z?: number;
}

export interface Rotation {
   rotationY: number;
}

export interface Size {
   width: number;
   length: number;
}

export interface VisibleViewport {
   viewX: number;
   viewY: number;
   viewW: number;
   viewH: number;
   scale: number;
}

export interface Shape<Data> {

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

   /** Color del contorno. */
   strokeColor?: string;

   /** Si fue seleccionado o no. */
   selected?: boolean;

   /** Si se puede arrastrar el objeto */
   draggable?: boolean;

   /** Si es redimensionable el objeto */
   resizable?: boolean;

   onSelect?: (shapeData: Data) => void;
   onCoordinateChange?: (id: string, x: number, y: number) => void;
   onResizeChange?: (id: string, width: number, length: number) => void;
}
