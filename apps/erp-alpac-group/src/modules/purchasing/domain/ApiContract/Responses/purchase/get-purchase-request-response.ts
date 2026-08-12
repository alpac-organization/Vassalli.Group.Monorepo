
export interface GetPurchaseRequestResponse {
   code: string;
   purchase_request_id: string;
   request_date: string;
   request_status: string;
   request_type: string;
   revision_date: string;
}

export interface GetPurchaseRequestResponseList {
   data: GetPurchaseRequestResponse[];
   page_number: number;
   page_size: number;
   total: number;
}