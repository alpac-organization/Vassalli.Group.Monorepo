import { ReactNode, RefObject } from "react";

export type TooltipPlacement = "top" | "bottom" | "right" | "left";

export type TooltipProps = {
   children: ReactNode;
   anchorRef: RefObject<HTMLElement | null>;
   placement?: TooltipPlacement;
};

export type TooltipPosition = {
   top: number;
   left: number;
   maxWidth: number;
   placement: TooltipPlacement;
};