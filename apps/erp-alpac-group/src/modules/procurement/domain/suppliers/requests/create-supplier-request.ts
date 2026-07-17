
export interface CreateSupplierRequest {
   company_id: string;
   module_code: string;
   suppliers_legal_name: string;
   identification_number: string;
   constitucion_type: number;
   identifcation_type: number;
   address?: string;
   email_support?: string;
   contact_name?: string;
   contact_email?: string;
   contact_phone_number?: string;
} 