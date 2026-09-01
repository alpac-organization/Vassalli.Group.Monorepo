import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CreateDucatRegistryRequest extends BaseRequest {
    reception_id: string;
    shipping_company_id: string;
    general_observations?: string;
    is_in_transit: boolean;
    registered_start_date?: string;
    registered_start_time?: string;
}
