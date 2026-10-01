import type { ReactNode } from "react";

export interface WarehouseViewerProps {
   width: number;
   length: number;
   marginTop?: number;
   marginBottom?: number;
   marginLeft?: number;
   marginRight?: number;
   children?: ReactNode;
   title?: ReactNode;
   selectedLabel?: ReactNode;
   overlay?: ReactNode;
   /** Permite sobrescribir las clases del contenedor del stage (altura, bordes). */
   containerClassName?: string;
}

export interface StagePosition {
   x: number;
   y: number;
}

export interface StageSize {
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
