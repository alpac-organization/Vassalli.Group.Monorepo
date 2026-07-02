import type { CreateSubsidyRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/create-subsidy.request";
import type { GetSubsidyTypesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/get-subsidy-types.request";
import type { GetSubsidyTypesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/subsidy-responses/get-subsidy-types.response";
import type { GetSubsidyHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/get-subsidy-history.request";
import type { GetSubsidyHistoryListResponse } from "@app/modules/payroll/domain/ApiContract/Responses/subsidy-responses/get-subsidy-history.response";

export interface ISubsidyServices {
   
   CreateSubsidy(payload: CreateSubsidyRequest): Promise<void>;

   GetSubsidyTypes(payload: GetSubsidyTypesRequest): Promise<GetSubsidyTypesResponse>;

   GetSubsidyHistory(payload: GetSubsidyHistoryRequest): Promise<GetSubsidyHistoryListResponse>;
}