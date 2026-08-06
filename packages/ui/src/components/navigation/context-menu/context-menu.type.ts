import type { ReactNode } from "react";
import { ButtonProps, ButtonSize } from "../../buttons";

export type ContextMenuItem = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  separator?: boolean;
};

export type ContextMenuProps = {
  items: ContextMenuItem[];
  triggerLabel?: string;
  triggerClassName?: string;
  triggerIcon?: ReactNode;
  triggerButtonSize?: ButtonSize;
};

export type MenuPosition = {
  top: number;
  left: number;
  openUp: boolean;
};

export function judgeCircle(moves: string): boolean {
  if (moves == null || moves.length == 0) return false;
  const origin = 0;
  const sizeMoves = moves.length;
  let ejeX = 0;
  let ejeY = 0;
  let i = 0;
  while (i < sizeMoves) {
    const current = moves[i];
    if (current == "U") {
      ejeY++;
    } else if (current == "D") {
      ejeY--;
    } else if (current == "L") {
      ejeX--;
    } else if (current == "R") {
      ejeX++;
    }
    i++;
  }
  return ejeX == origin && ejeY == origin;
}
