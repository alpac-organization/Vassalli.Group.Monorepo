import type { IHttpHandler } from "@app/core/ports";
import { isDevMockSessionActive } from "@app/core/config/dev-mock-auth";
import { getDevMockModulesList } from "@app/core/config/dev-mock-modules";
import type { IModuleServices } from "@app/modules/dashboard/application/interfaces/IModuleServices";
import type { ModulesAvailableResponse } from "@app/modules/dashboard/domain/ApiContract/Responses/modules-available.response";

export class ModuleServices implements IModuleServices {
  private apiHandler: IHttpHandler;

  public constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }

  public async ObtainActiveModulesByCompanyId(
    company_id: string,
  ): Promise<ModulesAvailableResponse[]> {
    if (isDevMockSessionActive()) {
      return getDevMockModulesList(company_id);
    }

    try {
      const modules = await this.apiHandler.get<ModulesAvailableResponse[]>(
        `/companies/${company_id}/users/modules`,
      );
      return modules;
    } catch (error) {
      throw error;
    }
  }
}
