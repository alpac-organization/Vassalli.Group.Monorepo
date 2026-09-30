import { warehouseHttpHandler } from "@app/core/adapters";
import { RackService } from "@app/modules/admin-warehouse/warehouse-managua/infrastructure/services/RackService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { RegisterRacksBulkRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/racks/register-racks-bulk-req";
import type { GetRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/racks/get-racks-req";
import type { GetRackDetailsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/racks/get-rack-details-req";
import type { UpdateRackRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/racks/update-rack-req";
import type { DeleteRackRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/racks/delete-rack-req";
import type { GetRacksResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-racks-res";
import type { GetRackDetailsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-rack-details-res";

const rackService = new RackService(warehouseHttpHandler);

interface UseRackProps {
  getRacksPayload?: GetRacksRequest;
  getAllRacksPayload?: GetRacksRequest;
  getRackDetailsPayload?: GetRackDetailsRequest;
}

const hasCompanyContext = (payload?: {
  company_id?: string;
  module_code?: string;
}) => Boolean(payload?.company_id?.trim() && payload?.module_code?.trim());

export const useRack = (props?: UseRackProps) => {
  const queryClient = useQueryClient();
  const { getRacksPayload, getAllRacksPayload, getRackDetailsPayload } = props || {};

  const GetRacks = useQuery<GetRacksResponse, ApiErrorResponse>({
    queryKey: ["get-section-racks-records", getRacksPayload],
    queryFn: () => rackService.GetRacksBySection(getRacksPayload!),
    enabled:
      hasCompanyContext(getRacksPayload) &&
      Boolean(getRacksPayload?.warehouse_id && getRacksPayload?.section_id),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const GetAllRacks = useQuery<GetRacksResponse, ApiErrorResponse>({
    queryKey: ["get-all-section-racks-records", getAllRacksPayload],
    queryFn: async () => {
      const firstPage = await rackService.GetRacksBySection({
        ...getAllRacksPayload!,
        page_number: 1,
        page_size: 100,
      });

      const total = firstPage.total ?? firstPage.data.length;
      if (total <= 100) {
        return firstPage;
      }

      const totalPages = Math.ceil(total / 100);
      const remainingPromises = [];
      for (let p = 2; p <= totalPages; p++) {
        remainingPromises.push(
          rackService.GetRacksBySection({
            ...getAllRacksPayload!,
            page_number: p,
            page_size: 100,
          }),
        );
      }
      const remainingPages = await Promise.all(remainingPromises);
      const allData = [
        ...firstPage.data,
        ...remainingPages.flatMap((page) => page.data),
      ];
      return {
        ...firstPage,
        data: allData,
        total,
      };
    },
    enabled:
      hasCompanyContext(getAllRacksPayload) &&
      Boolean(
        getAllRacksPayload?.warehouse_id && getAllRacksPayload?.section_id,
      ),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const GetRackDetails = useQuery<GetRackDetailsResponse, ApiErrorResponse>({
    queryKey: ["get-rack-details-record", getRackDetailsPayload],
    queryFn: () => rackService.GetRackDetails(getRackDetailsPayload!),
    enabled:
      hasCompanyContext(getRackDetailsPayload) &&
      Boolean(
        getRackDetailsPayload?.warehouse_id &&
          getRackDetailsPayload?.section_id &&
          getRackDetailsPayload?.rack_id,
      ),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const RegisterRacksBulk = useMutation<
    void,
    ApiErrorResponse,
    RegisterRacksBulkRequest
  >({
    mutationKey: ["register-racks-bulk-record"],
    mutationFn: (payload) => rackService.RegisterRacksBulk(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-section-racks-records"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-section-racks-records"],
      });
    },
    retry: 1,
  });

  const UpdateRack = useMutation<void, ApiErrorResponse, UpdateRackRequest>({
    mutationKey: ["update-rack-record"],
    mutationFn: (payload) => rackService.UpdateRack(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-section-racks-records"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-section-racks-records"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-rack-details-record"],
      });
    },
    retry: 1,
  });

  const DeleteRack = useMutation<void, ApiErrorResponse, DeleteRackRequest>({
    mutationKey: ["delete-rack-record"],
    mutationFn: (payload) => rackService.DeleteRack(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-section-racks-records"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-section-racks-records"],
      });
    },
    retry: 1,
  });

  return {
    GetRacks,
    GetAllRacks,
    GetRackDetails,
    RegisterRacksBulk,
    UpdateRack,
    DeleteRack,
  };
};
