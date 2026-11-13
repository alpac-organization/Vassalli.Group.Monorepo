import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetCostCentersRequest } from "@app/modules/admin/domain/ApiContract/requests/cost-centers/get-cost-centers.request";
import type { CreateCostCenterRequest } from "@app/modules/admin/domain/ApiContract/requests/cost-centers/create-cost-center.request";
import type { DeleteCostCentersRequest } from "@app/modules/admin/domain/ApiContract/requests/cost-centers/delete-cost-centers";
import { CostCentersServices } from "@app/modules/admin/infrastructure/cost-centers/CostCentersServices";

const costCenterServices = new CostCentersServices(httpHandler);

export const useCostCenters = (
  payload?: GetCostCentersRequest,
  companyPayload?: { company_id?: string; module_code?: string; only_operational?: boolean },
) => {
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
  const GetCostCentersByCompany = useQuery({
    queryKey: [
      "cost-centers-by-company",
      companyPayload?.company_id,
      companyPayload?.module_code,
      companyPayload?.only_operational,
    ],
    queryFn: () =>
      costCenterServices.getCostCentersByCompany({
        company_id: companyPayload?.company_id ?? "",
        module_code: companyPayload?.module_code ?? "",
        only_operational: companyPayload?.only_operational,
      }),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(companyPayload?.company_id && companyPayload?.module_code),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { GetCostCenters, createCostCenter, deleteCostCenter, GetCostCentersByCompany };
};
