export interface  UpdateSupplierRequest {
   company_id: string;
   module_code: string;
   supplier_id: string;
   address?: string;
   email_support?: string;
   contact_name?: string;
   contact_email?: string;
   contact_phone_number?: string;
   suppliers_legal_name?: string;
   identification_number?: string;
   constitution_type?: number;
   identification_type?: number;
}