export interface GetAccessControlRequest {
  company_id: string;
  module_code: string;
  driver_name: string;
  plate_number: string;
  document_type: string;
  ducat_number: string;
  document_number: string;
  start_date: string;
  end_date: string;
  page_number: number;
  page_size: number;
}
