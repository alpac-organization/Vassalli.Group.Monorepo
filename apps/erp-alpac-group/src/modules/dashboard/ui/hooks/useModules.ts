import { httpHandler } from "@app/core/adapters";
import { useMutation } from "@tanstack/react-query"
import { ModuleServices } from "../../infrastructure/services/ModuleServices"

const moduleServices = new ModuleServices(httpHandler);

export const useModules = function(){

   const ObtainActiveModulesByCompanyId = useMutation({
      mutationKey: ["modules"],
      mutationFn: (company_id: number) => moduleServices.ObtainActiveModulesByCompanyId(company_id)
   })
   
   return {
      ObtainActiveModulesByCompanyId
   }
}