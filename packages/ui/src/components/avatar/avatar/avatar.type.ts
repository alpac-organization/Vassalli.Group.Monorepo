import { ReactNode } from "react";
import { TooltipPlacement } from "../../tooltips";

export interface AvatarProps {   
   pictureUrl?: string;
   label: string;
   hasLabel?: boolean;
   tooltip?: ReactNode;
   tooltipPlacement?: TooltipPlacement;
}