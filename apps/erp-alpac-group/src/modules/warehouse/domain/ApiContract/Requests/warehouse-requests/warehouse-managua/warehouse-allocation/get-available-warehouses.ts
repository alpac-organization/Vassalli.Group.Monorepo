export interface GetAvailableWarehousesRequest {
    company_id: string;
    module_code: string;
    document_type: string;
    rack_id?: string;
    lot_id?: string;
}