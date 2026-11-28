import type { CancelTerminationRequest } from "@app/modules/payroll/domain/ApiContract/Requests/termination-requests/cancel-termination.request";
import type { CloseTerminationRequest } from "@app/modules/payroll/domain/ApiContract/Requests/termination-requests/close-termination.request";
import type { GetTerminationDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/termination-requests/get-termination-details.request";
import type { GetTerminationsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/termination-requests/get-terminations.request";
import type { RegisterTerminationRequest } from "@app/modules/payroll/domain/ApiContract/Requests/termination-requests/register-termination.request";
import type {
  GetTerminationsResponse,
  TerminationDetailDto,
} from "@app/modules/payroll/domain/ApiContract/Responses/termination-responses/get-terminations.response";

export interface ITerminationServices {
  getTerminations(payload: GetTerminationsRequest): Promise<GetTerminationsResponse>;
  getTerminationDetails(payload: GetTerminationDetailsRequest): Promise<TerminationDetailDto>;
  registerTermination(payload: RegisterTerminationRequest): Promise<void>;
  closeTermination(payload: CloseTerminationRequest): Promise<void>;
  cancelTermination(payload: CancelTerminationRequest): Promise<void>;
}
