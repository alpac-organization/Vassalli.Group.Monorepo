export type ContextMenuItem = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  /** Si es true, renderiza una línea divisoria en lugar de una acción */
  separator?: boolean;
};

import type { ReactNode } from "react";

export type ContextMenuProps = {
  items: ContextMenuItem[];
  triggerLabel?: string;
  /** Clases adicionales para el botón trigger, permite sobreescribir su apariencia por separado */
  triggerClassName?: string;
  /** Ícono (o cualquier nodo) a mostrar en el botón trigger, junto al triggerLabel si existe */
  triggerIcon?: ReactNode;
};
