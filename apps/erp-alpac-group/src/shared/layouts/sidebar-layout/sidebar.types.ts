export interface SidebarLink {
  id: string;
  label: string;
  path: string;
  icon: string;
}
export interface SidebarGroup {
  id: string;
  title: string;
  items: SidebarLink[];
}
export interface SidebarConfig {
  logoUrl: string;
  appName: string;
  groups: SidebarGroup[];
}

export interface SidebarToolTipProps {
  text: string;
}
export interface SidebarItemsProps {
  item: SidebarLink;
  isOpen: boolean;
}
export interface SidebarProps {
  config: SidebarConfig;
}
