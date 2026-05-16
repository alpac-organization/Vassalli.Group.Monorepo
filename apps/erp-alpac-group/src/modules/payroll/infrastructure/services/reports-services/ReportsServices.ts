import type { IHttpHandler } from "@app/core/ports";
import type { IReportsServices } from "@app/modules/payroll/application/interfaces/reports-interfaces/IReportsInterfaces";
import type { GenerateReportRequest } from "@app/modules/payroll/domain/ApiContract/Requests/reports-requests/generate-report-request";
export class ReportsServices implements IReportsServices {
  private apiHandler: IHttpHandler;
  constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }

  public async generateReports(payload: GenerateReportRequest) {
    const { companie_id, type } = payload;
    try {
      const response = await this.apiHandler.get<Blob>(
        `companies/${companie_id}/reports`,
        {
          params: { type: type },
        },
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
