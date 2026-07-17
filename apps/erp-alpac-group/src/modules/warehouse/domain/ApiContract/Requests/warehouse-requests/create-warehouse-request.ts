export interface CreateWarehouseRequest {
   company_id: string;
   module_code: string;
   branch_id: string;
   is_owner: boolean;
   warehouse_name: string;
   assigned_zones: AssignedZone[];
   galleons: Galleon[];
   warehouse_information: WarehouseInformation;
}

interface WarehouseInformation {
   warehouse_type: number;
   total_area: number;
   unusable_area: number;
   max_height: number;
   min_height: number;
   rampas_count: number;
   parking_spaces_count: number;
   total_cubic_capacity: number;
}

interface AssignedZone {}

interface Galleon {}