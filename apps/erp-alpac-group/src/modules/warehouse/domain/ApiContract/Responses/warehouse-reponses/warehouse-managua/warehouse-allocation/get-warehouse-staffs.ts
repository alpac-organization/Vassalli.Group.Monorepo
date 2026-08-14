export interface WarehouseStaffItem {
  id: string;
  full_name: string;
  role: string | null;
  is_active: boolean;
}

export type GetWarehouseStaffsResponse = WarehouseStaffItem[];