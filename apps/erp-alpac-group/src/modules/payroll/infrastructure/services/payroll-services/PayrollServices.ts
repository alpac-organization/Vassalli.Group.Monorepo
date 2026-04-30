import type { IHttpHandler } from "@app/core/ports";
import type { PayrollRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-request";
import type { GetPayrollResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { IPayrollServices } from "@app/modules/payroll/application/interfaces/payroll-interfaces/IPayrollServices";
import type { GetPayrollProcessResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-process";
import type { PayrollProcessRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import { cleanParams } from "@app/shared/utils/object.utils";
import type {
  InitializePayrollParams,
} from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-initialize.request";

export class PayrollServices implements IPayrollServices {
  private apiHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }

  public async getPayrollsProcessStatus(
    payload: PayrollProcessRequest,
  ): Promise<GetPayrollProcessResponse> {
    try {
      const { companie_id, module_code, payrol_type, branch_id } = payload;
      const x = this.apiHandler.get<GetPayrollProcessResponse>(
        `/companies/${companie_id}/modules/${module_code}/payrolls-status`,
        {
          params: { payrol_type, branch_id },
        },
      );
      return x;
    } catch (error) {
      throw error;
    }
  }
  public async getPayroll(
    payload: PayrollRequest,
  ): Promise<GetPayrollResponse> {
    try {
      const {
        companie_id,
        module_code,
        type,
        branch_id,
        page_number,
        page_size,
        identification_number,
        job_position_id,
        work_area_id,
      } = payload;
      const params = {
        type,
        branch_id,
        page_number,
        page_size,
        ...(identification_number ? { identification_number } : {}),
        ...(job_position_id ? { job_position_id } : {}),
        ...(work_area_id ? { work_area_id } : {}),
      };
      const response = await this.apiHandler.get<GetPayrollResponse>(
        `/companies/${companie_id}/modules/${module_code}/payrolls`,
        {
          params: cleanParams(params),
        },
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  public async initializePayroll(
    payload: InitializePayrollParams,
  ): Promise<void | null> {
    try {
      const { companie_id, module_code, type, branch_id } = payload;
      return this.apiHandler.post<void | null>(
        `/companies/${companie_id}/modules/${module_code}/payrolls`,
        { type, branch_id },
      );
    } catch (error) {
      throw error;
    }
  }
}
