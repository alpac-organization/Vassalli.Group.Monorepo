import type { Dispatch, SetStateAction } from "react";
import type { GaleronDto } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-shape/galeron-shape.types";
import type Konva from "konva";

export interface GaleronMenuState {
   x: number;
   y: number;
   galeronData: GaleronDto;
   galeronNode: Konva.Node;
}

export interface GaleronShapeMenuProps {
   menu: GaleronMenuState | null;
   setMenu: Dispatch<SetStateAction<GaleronMenuState | null>>;
   onEdit: (galeron: GaleronDto) => void;
   onAddGaleronSection: (galeron: GaleronDto) => void;
   bringToFront: (galeronNode: Konva.Node) => void;
   sendToBack: (galeronNode: Konva.Node) => void;
}