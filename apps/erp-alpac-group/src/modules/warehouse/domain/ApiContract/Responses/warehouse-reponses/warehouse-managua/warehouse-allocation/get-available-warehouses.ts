export interface AvailableRack {
  id: string;
  code: string;
  status: number;
  positions: AvailablePosition[] | null;
}

export interface AvailablePosition {
  id: string;
  position_code: string;
}

export interface AvailableLot {
  id: string;
  code: string;
  positions: AvailablePosition[] | null;
}

export interface AvailableSection {
  id: string;
  code: string;
  storage_type: number;
  racks: AvailableRack[];
  lots: AvailableLot[];
}

export interface AvailableWarehouse {
  id: string;
  code: string;
  name: string;
  warehouse_type: number;
  sections: AvailableSection[];
}

export type GetAvailableWarehousesResponse = AvailableWarehouse[];