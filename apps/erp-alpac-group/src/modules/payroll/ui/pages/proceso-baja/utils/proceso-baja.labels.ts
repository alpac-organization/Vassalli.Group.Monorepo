import { LiquidationStatusEnum } from "@app/modules/payroll/domain/enums/liquidation-enums/liquidation-status.enum";
import type { LiquidationStatusEnumMap } from "@app/modules/payroll/domain/enums/liquidation-enums/liquidation-status.enum";
import { TerminationStatusEnum } from "@app/modules/payroll/domain/enums/termination-enums/termination-status.enum";
import type { TerminationStatusEnumMap } from "@app/modules/payroll/domain/enums/termination-enums/termination-status.enum";
import { TerminationTypeEnum } from "@app/modules/payroll/domain/enums/termination-enums/termination-type.enum";
import type { TerminationTypeEnumMap } from "@app/modules/payroll/domain/enums/termination-enums/termination-type.enum";

export const isTerminationType = (key?: string | null): key is TerminationTypeEnumMap =>
  Boolean(key && key in TerminationTypeEnum);

const isTerminationStatus = (key?: string | null): key is TerminationStatusEnumMap =>
  Boolean(key && key in TerminationStatusEnum);

const isLiquidationStatus = (key?: string | null): key is LiquidationStatusEnumMap =>
  Boolean(key && key in LiquidationStatusEnum);

export const getTerminationTypeLabel = (key?: string | null) =>
  isTerminationType(key) ? TerminationTypeEnum[key].label : "—";

export const getTerminationStatusLabel = (key?: string | null) =>
  isTerminationStatus(key) ? TerminationStatusEnum[key].label : "—";

export const getLiquidationStatusLabel = (key?: string | null) =>
  isLiquidationStatus(key) ? LiquidationStatusEnum[key].label : "—";
