import type { GetPermissionPoliciesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-policies";

export type ActiveFilterValue = "all" | "active";

export type PolicyFilters = {
	type: string;
	active: ActiveFilterValue;
};

export type PolicyFormState =
	| { status: "closed" }
	| { status: "create" }
	| { status: "edit"; policy: GetPermissionPoliciesResponse };

export const DEFAULT_POLICY_FILTERS: PolicyFilters = {
	type: "all",
	active: "all",
};
