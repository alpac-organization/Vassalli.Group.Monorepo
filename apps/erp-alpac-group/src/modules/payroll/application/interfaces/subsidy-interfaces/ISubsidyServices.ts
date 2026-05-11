import type { CreateSubsidyRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/create-subsidy.request";

export interface ISubsidyServices {
   CreateSubsidy(payload: CreateSubsidyRequest): Promise<void>;
}