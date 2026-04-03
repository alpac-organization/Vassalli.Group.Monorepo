import type { CreateVacationRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-vacation-request";

export interface IVacationRequestServices {
  createVacationRequest(payload: CreateVacationRequest): Promise<void>;
}
