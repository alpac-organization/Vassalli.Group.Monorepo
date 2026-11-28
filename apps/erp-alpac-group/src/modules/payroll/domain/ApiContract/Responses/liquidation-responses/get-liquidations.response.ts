import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { LiquidationStatusEnumMap } from "@app/modules/payroll/domain/enums/liquidation-enums/liquidation-status.enum";

export interface LiquidationDto {
  liquidation_id: string;
  collaborator_id: string;
  collaborator_name: string;
  identification_number?: string | null;
  termination_id: string;
  collaborator_period_id: string;
  status: LiquidationStatusEnumMap;
  gross_total: number;
  deductions_total: number;
  net_total: number;
  calculated_at: string;
  approved_at?: string | null;
  paid_at?: string | null;
  cancellation_reason?: string | null;
}

export type GetLiquidationsResponse = PaginateBaseResponse<LiquidationDto>;

export interface LiquidationDetailLineDto {
  detail_id: string;
  concept: string;
  description: string;
  quantity: number;
  unit_amount: number;
  amount: number;
  income_id?: string | null;
  deduction_id?: string | null;
  sort_order: number;
}

export interface LiquidationDetailDto extends LiquidationDto {
  details: LiquidationDetailLineDto[];
}
