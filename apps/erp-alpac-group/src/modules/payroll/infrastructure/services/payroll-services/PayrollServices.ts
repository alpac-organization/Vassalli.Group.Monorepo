import type { IHttpHandler } from "@app/core/ports";
import type { PayrollRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-request";
import type { GetPayrollResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { IPayrollServices } from "@app/modules/payroll/application/interfaces/payroll-interfaces/IPayrollServices";
import type { GetPayrollProcessResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-process";
import type { PayrollProcessRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import { cleanParams } from "@app/shared/utils/object.utils";
import type { InitializePayrollParams } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-initialize.request";
import type { GenerateReportPayrollRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/generate-report-payroll";
import type { GetPayrollReportsPayloadResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";

import type { PayrollPeriodsHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-periods-history.request";
import type { PayrollPeriodItem } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-periods";
import type { PayrollCloseRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-close.request";
import type { ClosePayrollResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/payroll-close.response";
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
  public async generateReportsPayroll(
    payload: GenerateReportPayrollRequest,
  ): Promise<GetPayrollReportsPayloadResponse> {
    const { companie_id, report_type, payroll_id } = payload;
    try {
      const response =
        await this.apiHandler.get<GetPayrollReportsPayloadResponse>(
          `companies/${companie_id}/reports`,
          {
            params: { report_type, payroll_id },
          },
        );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async closePayroll(
    payload: PayrollCloseRequest,
  ): Promise<ClosePayrollResponse> {
    try {
      const {
        companie_id,
        module_code,
        payroll_id,
        branch_id,
        payroll_type,
      } = payload;
      return this.apiHandler.post<ClosePayrollResponse>(
        `/companies/${companie_id}/modules/${module_code}/payrolls/${payroll_id}/close`,
        { branch_id, payroll_type },
      );
    } catch (error) {
      throw error;
    }
  }

  public async getPayrollPeriodsHistory(
    payload: PayrollPeriodsHistoryRequest,
  ): Promise<PayrollPeriodItem[]> {
    try {
      const {
        companie_id,
        module_code,
        branch_id,
        type,
        page_number,
        page_size,
      } = payload;
      const params = {
        type,
        page_number,
        page_size,
      };

      const response = await this.apiHandler.get<PayrollPeriodItem[]>(
        `/companies/${companie_id}/modules/${module_code}/branches/${branch_id}/payrolls`,
        {
          params: cleanParams(params),
        },
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
