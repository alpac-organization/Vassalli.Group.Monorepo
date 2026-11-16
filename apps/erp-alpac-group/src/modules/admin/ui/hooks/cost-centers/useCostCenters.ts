import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CostCentersServices } from "@app/modules/admin/infrastructure/cost-centers/CostCentersServices";
import type { GetCostCentersRequest } from "@app/modules/admin/domain/ApiContract/requests/cost-centers/get-cost-centers.request";
import type { CreateCostCenterRequest } from "@app/modules/admin/domain/ApiContract/requests/cost-centers/create-cost-center.request";
import type { DeleteCostCentersRequest } from "@app/modules/admin/domain/ApiContract/requests/cost-centers/delete-cost-centers";
import type { GetCostCentersByCompanyRequest } from "@app/modules/admin/domain/ApiContract/requests/cost-centers/get-cost-centers-by-company.request";

const costCenterServices = new CostCentersServices(httpHandler);

interface UseCostCenterProps {
   getCostCentersPayload?: GetCostCentersRequest,
   getCostCentersByBranchPayload?:GetCostCentersByCompanyRequest,
}

export const useCostCenters = (props: UseCostCenterProps) => {

   const { 
      getCostCentersPayload,
      getCostCentersByBranchPayload
   } = props;


   const queryClient = useQueryClient();

   const GetCostCenters = useQuery({
      queryKey: ["cost-centers", getCostCentersPayload?.company_id, getCostCentersPayload?.area_id],
      queryFn: () => costCenterServices.getCostCenters(getCostCentersPayload!),
      staleTime: 1000 * 60 * 5,
      enabled: Boolean(getCostCentersPayload?.company_id && getCostCentersPayload?.area_id),
      refetchOnWindowFocus: false,
      retry: 1,
   });

   const createCostCenter = useMutation({
      mutationKey: ["create-cost-center"],
      mutationFn: (payload: CreateCostCenterRequest) =>
         costCenterServices.createCostCenter(payload),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({
         queryKey: ["cost-centers", variables.company_id, variables.area_id],
         });
      },
   });

   const deleteCostCenter = useMutation({
      mutationKey: ["delete-cost-center"],
      mutationFn: (payload: DeleteCostCentersRequest) =>
         costCenterServices.deleteCostCenter(payload),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({
         queryKey: ["cost-centers", variables.company_id, variables.area_id],
         });
      },
   });

   const GetCostCentersByBranch = useQuery({
      queryKey: [
         "cost-centers-by-company",
         getCostCentersByBranchPayload?.company_id,
         getCostCentersByBranchPayload?.module_code,
         getCostCentersByBranchPayload?.only_operational,
      ],
      queryFn: () =>
         costCenterServices.getCostCentersByCompany({
         company_id: getCostCentersByBranchPayload?.company_id ?? "",
         module_code: getCostCentersByBranchPayload?.module_code ?? "",
         only_operational: getCostCentersByBranchPayload?.only_operational,
         }),
      staleTime: 1000 * 60 * 5,
      enabled: Boolean(getCostCentersByBranchPayload?.company_id && getCostCentersByBranchPayload?.module_code),
      refetchOnWindowFocus: false,
      retry: 1,
   });

   return { 
      GetCostCenters, 
      createCostCenter,
      deleteCostCenter,
      GetCostCentersByBranch 
   };
};
