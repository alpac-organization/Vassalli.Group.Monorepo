import { AreasServices } from "@app/modules/admin/infrastructure/areas/AreasServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import type { GetAreasRequest } from "@app/modules/admin/domain/ApiContract/requests/areas/get-areas.request";
import type { CreateAreaRequest } from "@app/modules/admin/domain/ApiContract/requests/areas/create-area.request";
import type { DeleteAreaRequest } from "@app/modules/admin/domain/ApiContract/requests/areas/delete-cost-center";
const areasServices = new AreasServices(httpHandler);
export const useAreas = (payload: GetAreasRequest) => {
  const queryClient = useQueryClient();
  const GetAreasByCompany = useQuery({
    queryKey: ["areas"],
    queryFn: () => areasServices.getAreas(payload),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(payload.company_id),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const CreateArea = useMutation({
    mutationKey: ["create-area"],
    mutationFn: (payload: CreateAreaRequest) =>
      areasServices.createArea(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
  const deleteArea = useMutation({
    mutationKey: ["delete-area"],
    mutationFn: (payload: DeleteAreaRequest) =>
      areasServices.deleteArea(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
  return { GetAreasByCompany, CreateArea, deleteArea };
};
