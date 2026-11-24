import type { EquipmentInformation } from "@app/shared/interfaces/organization-information/organization-information";

export interface OutputLineEquipmentItem {
   output_code: string | null;
   request_code: string | null;
   output_date: string;
   quantity: number;
   cost: number;
   total_cost: number;
   cost_center: string | null;
   service_order_code: string | null;
   customer: string | null;
}

export interface OutputLineEquipmentProduct {
   stock_code: string | null;
   supply: string | null;
   items: OutputLineEquipmentItem[];
   total_quantity: number;
   total_cost: number;
   total_total_cost: number;
}

export interface OutputLineEquipmentEquipment {
   equipment_information: EquipmentInformation;
   products: OutputLineEquipmentProduct[];
}

export interface OutputLineEquipmentCategory {
   category_name: string | null;
   equipments: OutputLineEquipmentEquipment[];
}

export interface OutputLineEquipmentReport {
   generated_at: string;
   generated_by: string | null;
   from: string;
   to: string;
   categories: OutputLineEquipmentCategory[];
}
