export interface CreateServiceOrderRequest {
    company_id: string;
    module_code: string;
    branch_id: string;
    customer_id: string;
    observations?: string;
}