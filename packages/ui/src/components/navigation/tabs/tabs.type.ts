import { TabOption } from "../tabs-header/tabs-header.type";

export interface TabItem<T extends string> extends TabOption<T> {
    render: (id?: T) => React.ReactNode;
}

export interface TabProps<T extends string> {
  tabItems: TabItem<T>[];
  activeTab: T;
  /**
   * Keep all tab panels mounted (CSS-hidden when inactive).
   * Prevents form/input display state from resetting on tab change.
   */
  keepMounted?: boolean;
}