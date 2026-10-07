import type Konva from "konva";
import type { Dispatch, SetStateAction } from "react";

export interface MenuState<Data> {
   x: number;
   y: number;
   data: Data;
   node: Konva.Node;
}

export interface ShapeContextMenuProps<Data> {
   menu: MenuState<Data> | null;   
   setMenu: Dispatch<SetStateAction<MenuState<Data> | null>>;
   onEdit: (data: Data) => void;
}