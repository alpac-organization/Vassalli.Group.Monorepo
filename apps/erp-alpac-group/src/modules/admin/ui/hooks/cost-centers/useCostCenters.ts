import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetCostCentersRequest } from "@app/modules/admin/domain/ApiContract/requests/cost-centers/get-cost-centers.request";
import type { CreateCostCenterRequest } from "@app/modules/admin/domain/ApiContract/requests/cost-centers/create-cost-center.request";
import type { DeleteCostCentersRequest } from "@app/modules/admin/domain/ApiContract/requests/cost-centers/delete-cost-centers";
import { CostCentersServices } from "@app/modules/admin/infrastructure/cost-centers/CostCentersServices";
const costCenterServices = new CostCentersServices(httpHandler);
export const useCostCenters = (payload?: GetCostCentersRequest) => {
  const queryClient = useQueryClient();
  const GetCostCenters = useQuery({
    queryKey: ["cost-centers", payload?.company_id, payload?.area_id],
    queryFn: () => costCenterServices.getCostCenters(payload!),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(payload?.company_id && payload?.area_id),
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const createCostCenter = useMutation({
    mutationKey: ["create-cost-center"],
    mutationFn: (payload: CreateCostCenterRequest) =>
      costCenterServices.createCostCenter(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cost-centers"] });
    },
  });
  const deleteCostCenter = useMutation({
    mutationKey: ["delete-cost-center"],
    mutationFn: (payload: DeleteCostCentersRequest) =>
      costCenterServices.deleteCostCenter(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cost-centers"] });
    },
  });
  return { GetCostCenters, createCostCenter, deleteCostCenter };
};
