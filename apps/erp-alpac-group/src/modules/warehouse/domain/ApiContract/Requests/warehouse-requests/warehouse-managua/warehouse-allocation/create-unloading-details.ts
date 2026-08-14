export interface CreateUnloadingDetailsRequest {
  company_id: string;
  module_code: string;
  reception_id: string;
  unloading_start_time: string;
  warehouse_chief_user_id: string;
  prepared_pallets?: number;
}