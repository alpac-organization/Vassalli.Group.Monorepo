export interface CreateSupplierRequest {
   company_id: string;
   module_code: string;
   suppliers_legal_name: string;
   identification_number?: string;
   constitution_type?: number;
   identification_type?: number;
   supplier_details: SupplierDetails;
}

export interface SupplierDetails {
   credit_days: number;
   has_credit: boolean;
   address?: string;
   email_support?: string;
   contact_name?: string;
   contact_email?: string;
   contact_phone_number?: string;
}
