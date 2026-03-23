import type { IHttpHandler } from "@app/core/ports";
import type { IModuleServices } from "../../application/interfaces/IModuleServices";
import type { ModulesAvailableResponse } from "../../domain/ApiContract/Responses/modules-available.response";

export class ModuleServices implements IModuleServices {

   private apiHandler: IHttpHandler;
   
   public constructor(httpHandler: IHttpHandler){
      this.apiHandler = httpHandler;
   }

   public async ObtainActiveModulesByCompanyId(company_id: number): Promise<ModulesAvailableResponse[]>{
      try {
         const modules = await this.apiHandler.get<ModulesAvailableResponse[]>(`/companies/${company_id}/modules`);
         return modules;
      }
      catch(error){
         throw error;
      }
   }

}
