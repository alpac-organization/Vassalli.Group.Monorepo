import { ReactNode } from "react";
import { TooltipPlacement } from "../../tooltips";

export interface AvatarProps {   
   pictureUrl?: string;
   label: string;
   description?: string;
   hasLabel?: boolean;
   tooltip?: ReactNode;
   tooltipPlacement?: TooltipPlacement;
}