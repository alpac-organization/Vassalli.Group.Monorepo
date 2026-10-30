import type { CreatePermissionRequestBase } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";
import { PermissionTypeEnum } from "@app/modules/payroll/domain/enums/permission-enums/permissionType.enum";

import type { ChannelEnum } from "@app/core/enums/channel.enum";
import { VacationTypeEnum } from "@app/modules/payroll/domain/enums/vacation-enums/vacation-type.enum";
import type { PermissionType } from "./permission.types";
import type { ApplicationType } from "./application.types";
import type { CatalogItem } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-forms";
import type { GetPermissionPoliciesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-policies";

export type NewPermissionRequestFormProps = {
  isPending: boolean;
  onSubmit: (payload: CreatePermissionRequestBase) => void;
  onCancel: () => void;
  companyId: string;
  moduleCode: string;
  identificationNumber: string;
  channel: ChannelEnum;
  payrollId?: string;
  onValidationError?: (message: string) => void;
  policies?: GetPermissionPoliciesResponse[];
  beneficiaryScopes?: CatalogItem[];
  familyRelationships?: CatalogItem[];
};

export const PERMISSION_TYPE_TO_ENUM_VALUE: Record<
  ApplicationType | PermissionType,
  number
> = {
  Vacation: VacationTypeEnum.VACATION.value,
  MedicalAppointment: PermissionTypeEnum.MEDICAL_APPOINTMENT.value,
  DonatedVacations: PermissionTypeEnum.DONATED_VACATION.value,
  VacationPay: PermissionTypeEnum.VACATION_PAY.value,
  JudicialAppointment: PermissionTypeEnum.JUDICIAL_APPOINTMENT.value,
  MarriageLeave: PermissionTypeEnum.MARRIAGE_LEAVE.value,
  BirthLeave: PermissionTypeEnum.BIRTH_LEAVE.value,
  BereavementLeave: PermissionTypeEnum.BEREAVEMENT_LEAVE.value,
};
