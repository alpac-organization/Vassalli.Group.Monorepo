import type { SettingSidebarProps } from "@app/modules/setting/ui/pages/setting-index/components/setting-sidebar/types/setting-sidebar.types";
import { SettingSidebarItem } from "@app/modules/setting/ui/pages/setting-index/components/setting-sidebar/setting-sidebar-item";

export const SettingSidebar = ({ items = [], selectedItemId, onSelectItem }: SettingSidebarProps) => {
  return (
    <nav className="flex w-48 shrink-0 flex-col gap-1.5 pr-2 sm:pr-3 md:pr-4">
      {items.map((item) => (
        <SettingSidebarItem
          key={item.id}
          item={item} 
          onSelectItem={() => onSelectItem(item.id)} 
          isSelectedItem={selectedItemId === item.id} />
      ))}
    </nav>
  );
};
