import {
  DeductionStatusEnum,
  type DeductionStatusEnum as DeductionStatusEnumType,
} from "@app/modules/payroll/domain/enums/deduction-enums/deduction-status.enum";
import {
  DeductionTypeEnum,
  type DeductionTypeEnum as DeductionTypeEnumType,
} from "@app/modules/payroll/domain/enums/deduction-enums/deduction-type.enum";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetDeductionsRequest extends BaseRequest {
  type?: keyof typeof DeductionTypeEnum | DeductionTypeEnumType | number;
  status?:
    | keyof typeof DeductionStatusEnum
    | DeductionStatusEnumType
    | number
    | string;
  identification_number?: string;

  page_number?: number;
  page_size?: number;
}
