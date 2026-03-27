export interface TabOption<T extends string> {
  id: T;
  label: string;
}

export type TabId = "personal" | "work";
export interface TabHeaderProps<T extends string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onTabChange: (id: T) => void;
}
