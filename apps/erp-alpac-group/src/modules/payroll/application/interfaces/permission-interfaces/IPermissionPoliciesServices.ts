import type { CreatePermissionPoliciesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-policies";
import type { PermitTypePolicyResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-policies";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { PermissionFormsOptions } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-forms";

export interface IPermissionPoliciesServices {
  CreatePermissionPolicies(
    request: CreatePermissionPoliciesRequest,
  ): Promise<void>;
  getPermissionPolicies(req: BaseRequest): Promise<PermitTypePolicyResponse>;
  getPermissionFormsOptions(req: BaseRequest): Promise<PermissionFormsOptions>;
}