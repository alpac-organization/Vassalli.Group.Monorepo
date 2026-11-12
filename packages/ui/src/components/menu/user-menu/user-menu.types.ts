import { LucideIcon } from "lucide-react";

export interface UserMenuItem {
   id:          string;
   label:       string;
   badge?:      string;
   icon?:       LucideIcon;
   variant?:    "default" | "danger";
   onClick?: () => void;
   disabled?:   boolean;
   hidden?:     boolean;
}

export interface UserMenuProps {
    userName?:       string;
    email?:          string;
    costCenterName?: string;
    pictureUrl?:     string | null; // 👈 nuevo
    items:           UserMenuItem[];
}
