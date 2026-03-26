import type { IHttpHandler } from "@app/core/ports";
import type { IModuleServices } from "../../application/interfaces/IModuleServices";
import type { ModulesAvailableResponse } from "../../domain/ApiContract/Responses/modules-available.response";
import type { ModuleAccessValidateResponse } from "../../domain/ApiContract/Responses/module-access-validate.response";
export class ModuleServices implements IModuleServices {
  private apiHandler: IHttpHandler;

  public constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }

  public async ObtainActiveModulesByCompanyId(
    company_id: number,
  ): Promise<ModulesAvailableResponse[]> {
    try {
      const modules = await this.apiHandler.get<ModulesAvailableResponse[]>(
        `/companies/${company_id}/modules`,
      );
      return modules;
    } catch (error) {
      throw error;
    }
  }
  public async VerifyAccessToModule(paylaod: {
    company_id: number;
    module_code: string;
  }) {
    try {
      const isAccessModule =
        await this.apiHandler.post<ModuleAccessValidateResponse>(
          `/companies/${paylaod.company_id}/users/verify-access`,
          { module_code: paylaod.module_code },
        );
      return isAccessModule;
    } catch (error) {
      throw error;
    }
  }
}
