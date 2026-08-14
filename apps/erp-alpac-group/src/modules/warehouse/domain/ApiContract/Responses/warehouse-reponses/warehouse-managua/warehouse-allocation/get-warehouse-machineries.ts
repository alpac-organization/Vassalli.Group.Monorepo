export interface WarehouseMachineryItem {
  id: string;
  code: string;
  name: string;
  machinery_type: number;
  is_active: boolean;
}

export type GetWarehouseMachineriesResponse = WarehouseMachineryItem[];