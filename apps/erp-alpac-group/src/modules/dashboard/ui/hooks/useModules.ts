import { httpHandler } from "@app/core/adapters";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ModuleServices } from "../../infrastructure/services/ModuleServices";

const moduleServices = new ModuleServices(httpHandler);
export const useModules = function (company_id: number) {
  const obtainActiveModulesByCompanyId = useQuery({
    queryKey: ["modules"],
    queryFn: () => moduleServices.ObtainActiveModulesByCompanyId(company_id),
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const verifyAccessMutation = useMutation({
    mutationFn: (module_code: string) =>
      moduleServices.VerifyAccessToModule({ company_id, module_code }),
  });

  return {
    obtainActiveModulesByCompanyId,
    verifyAccessMutation,
  };
};
