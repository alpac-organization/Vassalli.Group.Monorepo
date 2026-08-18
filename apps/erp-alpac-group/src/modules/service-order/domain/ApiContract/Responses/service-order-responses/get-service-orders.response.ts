export interface GetServiceOrdersResponse {
   service_order_id: string;
   code: string;
   status: string;
   observations: string | null;
   customer: ServiceOrderCustomerInformation | null;
}

export interface ServiceOrderCustomerInformation {
   customer_id: string;
   cif: string | null;
   legal_name: string | null;
   picture_url: string | null;
   identification_number: string | null;
   identification_type: number;
}

export interface GetServiceOrdersResponseList {
   data: GetServiceOrdersResponse[],
   page_number: number;
   page_size: number;
   total: number;
}
