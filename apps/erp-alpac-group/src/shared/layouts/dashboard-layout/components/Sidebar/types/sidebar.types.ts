import type { ElementType, RefObject } from "react";

export interface SidebarLink {
  id: string;
  label: string;
  path: string;
  icon: ElementType;
  isFooter?: boolean;
  allowsRubRoutes?: boolean;
}

export interface SidebarConfig {
  logoUrl: string;
  nameCompany: string;
  items: SidebarLink[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export interface SidebarToolTipProps {
  nameLink: string;
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
}

export interface SidebarItemsProps {
  item: SidebarLink;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
