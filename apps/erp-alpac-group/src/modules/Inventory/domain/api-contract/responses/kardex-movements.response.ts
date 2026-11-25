import type { KardexTypeEnum } from "@app/core/enums/kardex-type.enum";
import type { KardexMovementTypeEnum } from "@app/core/enums/kardex-movement-type.enum";
import type { InventoryOutputsStatus } from "@app/core/enums/inventory-output-status.enum";
import type { ReferenceTypeEnum } from "@app/core/enums/reference-type.enum";

export interface KardexUnitMeasureInformation {
   name: string;
   symbol: string;
   type: string;
}

export interface KardexCostCenterInformation {
   cost_center_id: string;
   cost_center_name: string;
   cost_center_code: string;
   coil_code: number;
   description?: string | null;
}

export interface KardexWorkAreaInformation {
   work_area_id: string;
   work_area_name: string;
   work_area_code?: string | null;
   description?: string | null;
}

export interface KardexBranchInformation {
   branch_id: string;
   branch_name: string;
   branch_code?: string | null;
   company_id?: string;
   company_alias?: string | null;
}

export interface KardexUserInformation {
   user_id: string;
   email?: string | null;
   fullname?: string | null;
   picture_url?: string | null;
   user_status?: string | null;
   work_area_information?: KardexWorkAreaInformation | null;
}

export interface KardexMovementsData {
   kardex_id: string;
   kardex_type: KardexTypeEnum;
   reference_type?: ReferenceTypeEnum;
   movement_type: KardexMovementTypeEnum;
   document_number?: string | null;
   inventory_entry_id?: string | null;
   inventory_entry_code?: string | null;
   invoice_number?: string | null;
   inventory_output_id?: string | null;
   inventory_output_code?: string | null;
   output_request_code?: string | null;
   output_request_type?: string | null;
   units: number;
   total_units: number;
   unit_cost: number;
   total_input: number;
   total_output: number;
   average_cost: number;
   total_kardex: number;
   transaction_date?: string;
   transaction_time?: string;
   created_at?: string;
   product_information: KardexProductInformation;
   unit_measure_information?: KardexUnitMeasureInformation | null;
   cost_center_information?: KardexCostCenterInformation | null;
   work_area_information?: KardexWorkAreaInformation | null;
   branch_information?: KardexBranchInformation | null;
}

export interface KardexMovementDetail extends KardexMovementsData {
   previous_units: number;
   previous_kardex: number;
   movement_by_user_information?: KardexUserInformation | null;
   invoice_date?: string | null;
   inventory_entry_status?: string | null;
   entry_observations?: string | null;
   purchase_order_code?: string | null;
   supplier_name?: string | null;
   inventory_output_status?: InventoryOutputsStatus | null;
   reason_removal_description?: string | null;
}

export interface KardexProductInformation {
   product_id: string;
   product_code: string;
   product_name: string;
   description: string;
   product_usage_type: string;
   category_information: KardexCategoryInformation;
}

export interface KardexCategoryInformation {
   code: string;
   name: string;
   category_id: string;
}
