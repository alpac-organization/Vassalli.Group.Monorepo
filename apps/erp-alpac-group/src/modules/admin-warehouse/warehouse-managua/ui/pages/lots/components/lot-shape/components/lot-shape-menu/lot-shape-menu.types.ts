import type { LotDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { Dispatch, SetStateAction } from "react";

export type LotMenuState = {
  x: number;
  y: number;
  lot: LotDto;
};

export interface LotShapeMenuProps {
  menu: LotMenuState | null;
  setMenu: Dispatch<SetStateAction<LotMenuState | null>>;
  onEdit: (lot: LotDto) => void;
}
