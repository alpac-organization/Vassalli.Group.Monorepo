import type { SupplierDetailsInformation } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-details";

export interface CreateSupplierRequest {
   company_id: string;
   module_code: string;
   suppliers_legal_name: string;
   identification_number?: string;
   constitution_type?: number;
   identification_type?: number;
   supplier_details: SupplierDetailsInformation;
}