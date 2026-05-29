import type { SettingSidebarItemProps } from "@app/modules/setting/ui/pages/setting-index/components/setting-sidebar/types/setting-sidebar.types";

export const SettingSidebarItem = ({ item, isSelectedItem, onSelectItem }: SettingSidebarItemProps) => {
  const backgroundColor = isSelectedItem
    ? item.selectedBackgroundColor
    : item.backgroundColor;

  return (
    <button
      type="button"
      style={{ backgroundColor }}
      onClick={() => onSelectItem(item.id)}
      className={`
        w-full rounded-md px-3 py-2 text-left text-sm transition-colors
        ${isSelectedItem ? "text-white" : "text-neutral-200 hover:brightness-110"}
      `}
      aria-current={isSelectedItem ? "true" : undefined}
    >
      {item.label}
    </button>
  );
};
