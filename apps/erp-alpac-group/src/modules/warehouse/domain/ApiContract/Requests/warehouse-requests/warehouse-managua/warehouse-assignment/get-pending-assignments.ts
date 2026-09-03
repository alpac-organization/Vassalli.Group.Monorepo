export interface GetPendingAssignmentsRequest {
  company_id: string;
  module_code: string;
  page_number?: number;
  page_size?: number;
  driver_name?: string;
  license_plate?: string;
  document_type?: number; // 1 = DUCA | 2 = CustomsDeclaration
}

