import { TabOption } from "../tabs-header/tabs-header.type";

export type TabsAnimation = "fade" | "slide";

export interface TabItem<T extends string> extends TabOption<T> {
  render: (id?: T) => React.ReactNode;
}

export interface TabProps<T extends string> {
  tabItems: TabItem<T>[];
  activeTab: T;
  /** `"fade"` (default): opacidad. `"slide"`: desliza según dirección del tab. */
  animation?: TabsAnimation;
  /**
   * Keep all tab panels mounted (CSS-hidden when inactive).
   * Prevents form/input display state from resetting on tab change.
   */
  keepMounted?: boolean;
}
