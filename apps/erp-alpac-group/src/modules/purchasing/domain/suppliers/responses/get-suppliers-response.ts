export interface GetSuppliersResponse {
  supplier_id: string;
  supplier_legal_name: string;
  identification_number: string;  
  identification_type: number;
  constitution_type: number;  
}

export interface GetSuppliersResponseList {
  data: GetSuppliersResponse[];
  page_number: number;
  page_size: number;
  total: number;
}