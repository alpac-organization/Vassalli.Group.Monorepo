import type { ReactNode } from "react";

export interface WarehouseViewerProps {
   width: number;
   length: number;
   marginTop?: number;
   marginBottom?: number;
   marginLeft?: number;
   marginRight?: number;
   draggable?: boolean;
   children?: ReactNode;
}

export interface Position {
   x: number;
   y: number;
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
