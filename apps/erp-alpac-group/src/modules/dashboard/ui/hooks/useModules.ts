import { useMutation } from "@tanstack/react-query"

export const useModules = function(){

   const ObtainActiveModulesByCompanyId = useMutation({
      mutationKey: [""],
      mutationFn: () => () => {}
   })
   
   
   return {

   }
}