import type { UserStatusKey } from "@app/shared/enum/user-status";

export interface CostCenterInformation {
   cost_center_id: string;
   description: string | null;
   cost_center_name: string | null;
   coil_code: number;
   cost_center_code: string | number;
}

export interface WorkAreaInformation {
   work_area_id: string;
   work_area_code: number;
   description: string | null;
   work_area_name: string | null;
   cost_centers: CostCenterInformation[] | null;
}

export interface BranchInformation {
   branch_id: string;
   branch_code: string | null;
   branch_name: string | null;
   company_alias: string | null;
}

export interface UserInformation {
   user_id: string;
   email: string | null;
   fullname: string | null;
   picture_url: string | null;
   user_status: UserStatusKey;
   work_area_information: WorkAreaInformation | null;
}

export interface WarehouseInformation {
   warehouse_id: string;
   code: string;
   warehouse_type: number;
}

export interface OperationalOrderInformation {
   operational_order_id: string;
   po_code: string | null;
   packages_count: number | null;
   is_alerted: boolean;
}

export interface MachineryInformation {
   machinery_type: number;
   machinery_code: string;
   machinery_brand: string;
   machinery_model?: string | null;
}
