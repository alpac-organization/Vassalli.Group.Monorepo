export interface GetPendingAssignmentsRequest {
    company_id: string;
    module_code: string;
    driver_name?: string;
    plate_number?: string;
    document_type?: string;
    document_number?: string;
    page_number?: number;
    page_size?: number;
}