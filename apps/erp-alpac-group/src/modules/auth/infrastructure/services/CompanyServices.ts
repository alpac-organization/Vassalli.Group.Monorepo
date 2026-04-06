import type { IHttpHandler } from '@app/core/ports';
import type { ICompanyServices } from '../../application/interfaces/ICompanyServices';
import type { GetCompaniesResponse } from '../../domain/ApiContract/Responses/get-companies.response';

export class CompanyServices implements ICompanyServices {
  private apiHandler: IHttpHandler;

  public constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }

  public async GetCompaniesAvailable(): Promise<GetCompaniesResponse[]> {
    try {
      const companies =
        await this.apiHandler.get<GetCompaniesResponse[]>('/companies');
      return companies;
    } catch (error) {
      throw error;
    }
  }
}
