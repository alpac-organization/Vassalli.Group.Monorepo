import type { PaymentMethodType } from "@app/core/enums/payment-method.enum";
export interface SupplierAreaInformation {
  area_id: string;
  area_code: number;
  work_area_name: string;
}

export interface SupplierUserInformation {
  user_id: string;
  user_fullname: string;
  email: string;
  area_information: SupplierAreaInformation;
}

export interface GetSuppliersResponse {
  supplier_id: string;
  suppliers_legal_name?: string;
  supplier_legal_name?: string;
  commercial_name?: string | null;
  identification_number: string;
  identification_type: string;
  constitution_type: string;
  user_information?: SupplierUserInformation;
	supplier_payment_methods:SupplierPaymentMethod[];
}

export interface SupplierPaymentMethod {
	notes?: string;
	is_active?: boolean;
	payment_method_type?: PaymentMethodType;
}
export interface GetSuppliersResponseList {
  data: GetSuppliersResponse[];
  page_number: number;
  page_size: number;
  total?: number;
  total_records?: number;
  total_pages?: number;
  has_previous_page?: boolean;
  has_next_page?: boolean;
}
