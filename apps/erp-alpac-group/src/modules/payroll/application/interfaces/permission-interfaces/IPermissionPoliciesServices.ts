import type { CreatePermissionPoliciesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-policies";
import type { GetPermitTypePoliciesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/get-permit-type-policies";
import type { UpdatePermitTypePolicyRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/update-permit-type-policy";
import type { PagedPermitTypePoliciesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-policies";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { PermissionFormsOptions } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-forms";

export interface IPermissionPoliciesServices {
  CreatePermissionPolicies(
    request: CreatePermissionPoliciesRequest,
  ): Promise<void>;
  getPermissionPolicies(
    req: GetPermitTypePoliciesRequest,
  ): Promise<PagedPermitTypePoliciesResponse>;
  updatePermitTypePolicy(request: UpdatePermitTypePolicyRequest): Promise<void>;
  getPermissionFormsOptions(req: BaseRequest): Promise<PermissionFormsOptions>;
}
