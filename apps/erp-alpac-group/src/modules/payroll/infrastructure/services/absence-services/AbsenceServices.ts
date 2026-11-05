import type { IHttpHandler } from "@app/core/ports";
import type { IAbsenceServices } from "@app/modules/payroll/application/interfaces/absence-interfaces/IAbsenceServices";
import type { RegisterAbsenceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/register-absence.request";
import type { GetAbsencesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/get-absences.request";
import type { GetAbsenceDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/get-absence-details.request";
import type { ApplyAbsenceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/apply-absence.request";
import type { CancelAbsenceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/cancel-absence.request";
import type { DeleteAbsenceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/delete-absence.request";
import type { GetAbsencesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/absence-responses/get-absences.response";
import type { AbsenceDetailDto } from "@app/modules/payroll/domain/ApiContract/Responses/absence-responses/get-absence-details.response";
import { cleanParams } from "@app/shared/utils/object.utils";

export class AbsenceServices implements IAbsenceServices {
  private apiHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }

  public async registerAbsence(payload: RegisterAbsenceRequest): Promise<void> {
    const { company_id, module_code, ...body } = payload;
    return await this.apiHandler.post<void>(
      `companies/${company_id}/modules/${module_code}/absences`,
      body,
    );
  }

  public async getAbsences(
    payload: GetAbsencesRequest,
  ): Promise<GetAbsencesResponse> {
    const { company_id, module_code, ...queryParams } = payload;
    const params = cleanParams(queryParams);
    return await this.apiHandler.get<GetAbsencesResponse>(
      `companies/${company_id}/modules/${module_code}/absences`,
      { params },
    );
  }

  public async getAbsenceDetails(
    payload: GetAbsenceDetailsRequest,
  ): Promise<AbsenceDetailDto> {
    const { company_id, module_code, absence_id } = payload;
    return await this.apiHandler.get<AbsenceDetailDto>(
      `companies/${company_id}/modules/${module_code}/absences/${absence_id}`,
    );
  }

  public async applyAbsence(payload: ApplyAbsenceRequest): Promise<void> {
    const { company_id, module_code, absence_id, ...body } = payload;
    return await this.apiHandler.post<void>(
      `companies/${company_id}/modules/${module_code}/absences/${absence_id}/apply`,
      body,
    );
  }

  public async cancelAbsence(payload: CancelAbsenceRequest): Promise<void> {
    const { company_id, module_code, absence_id, ...body } = payload;
    return await this.apiHandler.post<void>(
      `companies/${company_id}/modules/${module_code}/absences/${absence_id}/cancel`,
      body,
    );
  }

  public async deleteAbsence(payload: DeleteAbsenceRequest): Promise<void> {
    const { company_id, module_code, absence_id } = payload;
    return await this.apiHandler.delete<void>(
      `companies/${company_id}/modules/${module_code}/absences/${absence_id}`,
    );
  }
}
