export type StatusTab = {
  id: string;
  label: string;
  color: string;
};

export type StatusTabsOverlayProps = {
  tabs: readonly StatusTab[];
  activeTab: string;
  onChange: (status: string) => void;
};