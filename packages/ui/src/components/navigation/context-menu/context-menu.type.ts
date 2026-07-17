export type ContextMenuItem = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  /** Si es true, renderiza una línea divisoria en lugar de una acción */
  separator?: boolean;
};

export type ContextMenuProps = {
  items: ContextMenuItem[];
  triggerLabel?: string;
};
