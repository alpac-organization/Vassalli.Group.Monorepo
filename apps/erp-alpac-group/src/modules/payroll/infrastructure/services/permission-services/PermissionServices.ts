import type { IHttpHandler } from "@app/core/ports";
import type { IPermissionRequestServices } from "@app/modules/payroll/application/interfaces/permission-interfaces/IPermissionServices";
import type { CreatePermissionRequestBase } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";
import type { PermissionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-request";
import type { PermissionListResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";
import type { CancelPermissionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/cancel-permission-request";
import type { GeneratePermissionDocumentRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/generate-permission-docs-request";
import { cleanParams } from "@app/shared/utils/object.utils";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { PermitTypePolicyResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-policies";
import type { CreatePermissionPoliciesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-policies";
import type {
  PermissionFormsOptions,
} from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-forms";
import { getPermissionTypeLabel } from "@app/modules/payroll/domain/enums/permission-enums/permissionType.enum";
import { getPermitBeneficiaryScopeLabel } from "@app/modules/payroll/domain/enums/permission-enums/permit-beneficiary-scope.enum";
import { getPermitFamilyRelationshipLabel } from "@app/modules/payroll/domain/enums/permission-enums/permit-family-relationship.enum";
import { mapCatalogItem, type ApiCatalogItem } from "@app/modules/payroll/ui/pages/permission-policies/utils/build-permission-policy-payload";


export class PermissionServices implements IPermissionRequestServices {
  private apiHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }

  public async createPermissionRequest(
    payload: CreatePermissionRequestBase,
  ): Promise<void> {
    try {
      const { company_id, module_code, ...body } = payload;
      const response = await this.apiHandler.post<void>(
        `companies/${company_id}/modules/${module_code}/permit-applications`,
        body,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getPermissions(
    payload: PermissionRequest,
  ): Promise<PermissionListResponse> {
    try {
      const { companie_id, module_code, ...queryParams } = payload;
      const params = cleanParams(queryParams);
      const response = await this.apiHandler.get<PermissionListResponse>(
        `/companies/${companie_id}/modules/${module_code}/permit-applications`,
        { params },
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async cancelPermissionRequest(
    payload: CancelPermissionRequest,
  ): Promise<void> {
    try {
      const { company_id, module_code, permit_application_id } = payload;
      const response = await this.apiHandler.get<void>(
        `/companies/${company_id}/modules/${module_code}/permit-applications/${permit_application_id}/abort`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async generatePermissionDocument(
    payload: GeneratePermissionDocumentRequest,
  ): Promise<void> {
    try {
      const { company_id, module_code, permit_application_id } = payload;
      const response = await this.apiHandler.get<void>(
        `/companies/${company_id}/modules/${module_code}/permit-applications/${permit_application_id}/documents`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getPermissionPolicies(
    payload: BaseRequest,
  ): Promise<PermitTypePolicyResponse> {
    const { company_id, module_code } = payload;
    const response = await this.apiHandler.get<PermitTypePolicyResponse>(
      `/companies/${company_id}/modules/${module_code}/permit-type-policies`,
    );

    return (response ?? []).map((policy) => {
      const typeName = String(policy.permit_application_type ?? "");
      const scopeName = String(policy.permit_beneficiary_scope ?? "");
      const relationshipName = String(policy.family_relationship ?? "");

      return {
        ...policy,
        permit_application_type_label: getPermissionTypeLabel(typeName),
        permit_beneficiary_label: getPermitBeneficiaryScopeLabel(scopeName),
        family_relationship_label:
          getPermitFamilyRelationshipLabel(relationshipName),
      };
    });
  }

  public async CreatePermissionPolicies(
    payload: CreatePermissionPoliciesRequest,
  ): Promise<void> {
    const {
      company_id,
      module_code,
      max_amount_days,
      is_active,
      permit_application_type,
      permit_beneficiary_scope,
      family_relationship,
      is_paid,
      requires_evidence,
      consumes_vacation_balance,
      min_evidence_count,
      max_evidence_count,
      required_approval_steps,
    } = payload;

    const body: Record<string, unknown> = {
      permit_application_type,
      permit_beneficiary_scope,
      family_relationship,
      is_paid,
      requires_evidence,
      consumes_vacation_balance,
      min_evidence_count,
      max_evidence_count,
      required_approval_steps,
    };

    if (is_active !== undefined) {
      body.is_active = is_active;
    }

    if (max_amount_days != null && max_amount_days > 0) {
      body.max_amount_days = max_amount_days;
    }

    await this.apiHandler.post<void>(
      `/companies/${company_id}/modules/${module_code}/permit-type-policies`,
      body,
    );
  }

  public async getPermissionFormsOptions(
    payload: BaseRequest,
  ): Promise<PermissionFormsOptions> {
    const { company_id, module_code } = payload;
    const response = await this.apiHandler.get<{
      permit_types: ApiCatalogItem[];
      beneficiary_scopes: ApiCatalogItem[];
      family_relationships: ApiCatalogItem[];
    }>(`/companies/${company_id}/modules/${module_code}/permit-form-options`);

    return {
      permit_types: (response.permit_types ?? []).map((item) =>
        mapCatalogItem(item, getPermissionTypeLabel),
      ),
      beneficiary_scopes: (response.beneficiary_scopes ?? []).map((item) =>
        mapCatalogItem(item, getPermitBeneficiaryScopeLabel),
      ),
      family_relationships: (response.family_relationships ?? []).map((item) =>
        mapCatalogItem(item, getPermitFamilyRelationshipLabel),
      ),
    };
  }
}
