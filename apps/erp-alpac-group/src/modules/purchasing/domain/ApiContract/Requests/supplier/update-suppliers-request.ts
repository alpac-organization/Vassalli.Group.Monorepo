import type { SupplierDetailsInformation } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-details";

export interface UpdateSupplierRequest {
   company_id: string;
   module_code: string;
   supplier_id: string;
   suppliers_legal_name?: string;
   identification_number?: string | null;
   constitution_type?: number;
   identification_type?: number | null;
   supplier_details?: Partial<SupplierDetailsInformation>;
}