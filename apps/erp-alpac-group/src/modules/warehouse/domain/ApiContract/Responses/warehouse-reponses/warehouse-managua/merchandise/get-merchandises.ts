export interface MerchandiseCategoryInfo {
    name: string;
    code: string | null;
    is_active: boolean;
}

export interface MerchandiseItem {
    merchandise_id: string;
    merchandise_name: string;
    description: string | null;
    category_id: string;
    category: MerchandiseCategoryInfo;
}

export type GetMerchandisesResponse = MerchandiseItem[];
