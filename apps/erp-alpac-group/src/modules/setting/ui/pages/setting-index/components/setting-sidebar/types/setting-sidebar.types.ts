export interface SettingSidebarMenuItem {
  id: string;
  label: string;
  backgroundColor: string;
  selectedBackgroundColor: string;
}

export interface SettingSidebarProps {
  items: SettingSidebarMenuItem[];
  selectedItemId: string;
  onSelectItem: (itemId: string) => void; 
}

export interface SettingSidebarItemProps {
  item: SettingSidebarMenuItem;
  isSelectedItem: boolean;
  onSelectItem: (itemId: string) => void; 
}
