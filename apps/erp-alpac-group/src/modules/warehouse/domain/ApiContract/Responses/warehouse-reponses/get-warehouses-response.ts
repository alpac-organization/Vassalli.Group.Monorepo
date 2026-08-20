export interface GetWarehousesResponse {
    data: WarehouseListItem[];
    page_number: number;
    page_size: number;
    total: number;
}

export interface WarehouseListItem {
    warehouse_id: string;
    warehouse_name: string;
    warehouse_code: string;
    is_active: boolean;
    warehouse_type: string;
    sub_warehouses?: WarehouseListItem[];
}
