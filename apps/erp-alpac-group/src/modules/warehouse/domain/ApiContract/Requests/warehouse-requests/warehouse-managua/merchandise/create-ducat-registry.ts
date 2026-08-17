export interface CreateDucatRegistryRequest {
    company_id: string;
    module_code: string;
    reception_id: string;
    container_number: string;
    empresa: string;
    general_observations?: string;
    is_in_transit: boolean;
    registered_start_date?: string;
    registered_start_time?: string;
}
