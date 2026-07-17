import { ReactNode } from "react";
import { AccordionType } from "../../types/accordion.type";

export type AccordionGroupProps = {
  children: ReactNode;
  type?: AccordionType;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
  collapsible?: boolean;
};
