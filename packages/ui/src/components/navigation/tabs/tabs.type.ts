import { TabOption } from "../tabs-header/tabs-header.type";

export interface TabItem<T extends string> extends TabOption<T> {
    render: (id?: T) => React.ReactNode;
}

export interface TabProps<T extends string> {
    tabItems: TabItem<T>[];
    activeTab: T;
}