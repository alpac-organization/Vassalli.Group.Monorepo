import type { IHttpHandler } from "@app/core/ports";
import type { IPayrollServices } from "@app/modules/payroll/application/interfaces/IPayrollServices";
import type { GetPayrollProcessResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-payroll-process";
import type { PayrollProcessRequest } from "../../domain/ApiContract/Requests/payroll-process.request";

export class PayrollServices implements IPayrollServices {
  private apiHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }

  public async getPayrollsProcessStatus(
    payload: PayrollProcessRequest,
  ): Promise<GetPayrollProcessResponse> {
    try {
      const { companyId, moduleCode, payrol_type } = payload;
      var x = this.apiHandler.get<GetPayrollProcessResponse>(
        `/companies/${companyId}/modules/${moduleCode}/payrolls-status`,
        {
          params: { payrol_type: payrol_type },
        },
      );
      return x;
    } catch (error) {
      throw error;
    }
  }
}
