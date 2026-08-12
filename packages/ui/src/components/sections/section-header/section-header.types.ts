import { ReactNode } from "react";

export type SectionHeaderProps = {
   title: string;
   subtitle?: string;
   logoImage?: string;
   headerClassName?: string;
   hasBorder?: boolean;
   children?: ReactNode; 
};
