export interface CreateDucatRegistryDetailRequest {
    company_id: string;
    module_code: string;
    reception_id: string;
    ducat_id: string;
    service_order_id?: string;
    merchandise_id: string;
    total_bultos: number;
    total_weight: number;
    merchandise_description?: string;
    remitente: string;
    destination_area_observation?: string;
    type?: number;
    registered_start_date?: string;
    registered_start_time?: string;
}
