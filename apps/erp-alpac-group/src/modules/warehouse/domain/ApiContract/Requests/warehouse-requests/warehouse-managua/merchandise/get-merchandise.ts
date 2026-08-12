import type { TransportDocumentType } from "@app/core/enums/document.enum";
export interface GetMerchandiseRequest {
  company_id: string;
  module_code: string;
  driver_name: string;
  plate_number: string;
  document_type: TransportDocumentType | "";
  service_order_code: string;
  page_number: number;
  page_size: number;
}
