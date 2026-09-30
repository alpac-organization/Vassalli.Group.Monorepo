import type { ReactNode } from "react";

export type RacksHeaderProps = {
  warehouseId: string;
  sectionId: string;
  warehouseCode?: string;
  sectionCode?: string;
  location?: string;
  rackQuantity?: number;
  totalPositions?: number;
  ocuppation?: number;
  registerButton?: ReactNode;
};
