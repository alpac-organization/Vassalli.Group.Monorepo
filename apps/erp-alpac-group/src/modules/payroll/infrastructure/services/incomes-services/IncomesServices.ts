import type { IHttpHandler } from "@app/core/ports";
import type { IIncomesServices } from "@app/modules/payroll/application/interfaces/incomes-interfaces/IIncomeServices";
import type { CreateIncomeRequest } from "@app/modules/payroll/domain/ApiContract/Requests/incomes-requests/create-income.request";
import type { GetIncomeTypesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/incomes-requests/get-income-types.request";
import type { IncomesTypesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/incomes-responses/incomes-types.response";
import { cleanParams } from "@app/shared/utils/object.utils";

export class IncomesServices implements IIncomesServices {
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  public async GetIncomesTypes(
    payload: GetIncomeTypesRequest,
  ): Promise<IncomesTypesResponse[]> {
    try {
      const { company_id, ...rest } = payload;

      const url = `/companies/${company_id}/types-income`;

      const response = await this.httpHandler.get<IncomesTypesResponse[]>(url, {
        params: cleanParams(rest),
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  public async CreateIncome(payload: CreateIncomeRequest): Promise<void> {
    try {
      const { company_id, module_code, ...rest } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/incomes`;
      await this.httpHandler.post<void>(url, rest);
    } catch (error) {
      throw error;
    }
  }
}
