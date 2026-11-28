import type { LiquidationDto } from "@app/modules/payroll/domain/ApiContract/Responses/liquidation-responses/get-liquidations.response";
import type { ReactNode } from "react";

export type LiquidationsTableMode = "in-progress" | "approved";

export type LiquidationsTableProps = {
  data: LiquidationDto[];
  pagination?: ReactNode;
  mode: LiquidationsTableMode;
  onViewDetail: (row: LiquidationDto) => void;
  onApprove?: (row: LiquidationDto) => void;
  onPay?: (row: LiquidationDto) => void;
  onCancel?: (row: LiquidationDto) => void;
};
