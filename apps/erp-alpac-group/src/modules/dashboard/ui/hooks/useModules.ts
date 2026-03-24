import { httpHandler } from "@app/core/adapters";
import { useQuery } from "@tanstack/react-query"
import { ModuleServices } from "../../infrastructure/services/ModuleServices"

const moduleServices = new ModuleServices(httpHandler);

export const useModules = function(company_id: number){

   const obtainActiveModulesByCompanyId = useQuery({
      queryKey: ["modules"],
      queryFn: () => moduleServices.ObtainActiveModulesByCompanyId(company_id),
      retry: 1,
      refetchOnWindowFocus: false
   })
   
   return {
      obtainActiveModulesByCompanyId
   }
}