export interface TabOption<T extends string> {
  id: T;
  label: string;
  disabled?: boolean;
}

export interface TabHeaderProps<T extends string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onTabChange: (id: T) => void;
}
