import type { ReactNode } from "react";

export interface DetailFieldProps {
   label: string;
   value: ReactNode;
   containerClass?: string;
   icon?: ReactNode;
}