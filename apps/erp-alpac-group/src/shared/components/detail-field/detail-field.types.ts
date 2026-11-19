import type { ReactNode } from "react";

export interface DetailFieldAvatar {
   label: string;
   pictureUrl?: string;
}

export interface DetailFieldProps {
   label: string;
   value: ReactNode;          // se mantiene igual, no rompe nada
   containerClass?: string;
   icon?: ReactNode;
   avatar?: DetailFieldAvatar; // nuevo, opcional
   description?: string;       // nuevo, opcional
}