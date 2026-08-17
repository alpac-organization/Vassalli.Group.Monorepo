import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetPendingAssignmentsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/get-pending-assignments";
import type { GetWarehouseAssignmentsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/get-warehouse-assignments";
import type { GetWarehouseAssignmentDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/get-warehouse-assignment-detail";
import type { GetAvailableWarehousesRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/get-available-warehouses";
import type { GetWarehouseMachineriesRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/get-warehouse-machineries";
import type { GetWarehouseStaffsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/get-warehouse-staffs";
import type { CreateWarehouseAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/create-warehouse-assignment";
import type { CreateUnloadingDetailsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/create-unloading-details";
import type { CreateUnloadingCrewRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/create-unloading-crew";
import type { CreateUnloadingMachineryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/create-unloading-machinery";
import type { CompleteWarehouseAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/complete-warehouse-assignment";
import type { GetPendingAssignmentsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-pending-assignments";
import type { GetWarehouseAssignmentsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-assignments";
import type { GetWarehouseAssignmentDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-assignment-detail";
import type { GetAvailableWarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-available-warehouses";
import type { GetWarehouseMachineriesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-machineries";
import type { GetWarehouseStaffsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-staffs";
import { WarehouseAllocationServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/WarehouseAllocationServices";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

type UseWarehouseAllocationProps = {
  pendingPayload?: GetPendingAssignmentsRequest;
  assignmentsPayload?: GetWarehouseAssignmentsRequest;
  detailPayload?: GetWarehouseAssignmentDetailRequest | null;
  availableWarehousesPayload?: GetAvailableWarehousesRequest | null;
  machineriesPayload?: GetWarehouseMachineriesRequest | null;
  staffsPayload?: GetWarehouseStaffsRequest | null;
};

const warehouseAllocationServices = new WarehouseAllocationServices(
  warehouseHttpHandler,
);

export const useWarehouseAllocation = (props: UseWarehouseAllocationProps) => {
  const queryClient = useQueryClient();
  const {
    pendingPayload,
    assignmentsPayload,
    detailPayload,
    availableWarehousesPayload,
    machineriesPayload,
    staffsPayload,
  } = props;

  const GetPendingAssignments = useQuery<
    GetPendingAssignmentsResponse,
    ApiErrorResponse
  >({
    queryKey: ["warehouse-allocation-pending", pendingPayload],
    queryFn: () =>
      warehouseAllocationServices.getPendingAssignments(pendingPayload!),
    enabled: Boolean(
      pendingPayload?.company_id && pendingPayload?.module_code,
    ),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  const GetWarehouseAssignments = useQuery<
    GetWarehouseAssignmentsResponse,
    ApiErrorResponse
  >({
    queryKey: ["warehouse-assignments", assignmentsPayload],
    queryFn: () =>
      warehouseAllocationServices.getWarehouseAssignments(
        assignmentsPayload!,
      ),
    enabled: Boolean(
      assignmentsPayload?.company_id && assignmentsPayload?.module_code,
    ),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  const GetWarehouseAssignmentDetail = useQuery<
    GetWarehouseAssignmentDetailResponse,
    ApiErrorResponse
  >({
    queryKey: ["warehouse-assignment-detail", detailPayload],
    queryFn: () =>
      warehouseAllocationServices.getWarehouseAssignmentDetail(detailPayload!),
    enabled: Boolean(
      detailPayload?.company_id &&
      detailPayload?.module_code &&
      detailPayload?.reception_id,
    ),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const GetAvailableWarehouses = useQuery<
    GetAvailableWarehousesResponse,
    ApiErrorResponse
  >({
    queryKey: ["available-warehouses", availableWarehousesPayload],
    queryFn: () =>
      warehouseAllocationServices.getAvailableWarehouses(
        availableWarehousesPayload!,
      ),
    enabled: Boolean(
      availableWarehousesPayload?.company_id &&
      availableWarehousesPayload?.module_code,
    ),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const GetWarehouseMachineries = useQuery<
    GetWarehouseMachineriesResponse,
    ApiErrorResponse
  >({
    queryKey: ["warehouse-machineries", machineriesPayload],
    queryFn: () =>
      warehouseAllocationServices.getWarehouseMachineries(machineriesPayload!),
    enabled: Boolean(
      machineriesPayload?.company_id && machineriesPayload?.module_code,
    ),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const GetWarehouseStaffs = useQuery<
    GetWarehouseStaffsResponse,
    ApiErrorResponse
  >({
    queryKey: ["warehouse-staffs", staffsPayload],
    queryFn: () => warehouseAllocationServices.getWarehouseStaffs(staffsPayload!),
    enabled: Boolean(staffsPayload?.company_id && staffsPayload?.module_code),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const CreateWarehouseAssignment = useMutation<
    boolean,
    ApiErrorResponse,
    CreateWarehouseAssignmentRequest
  >({
    mutationFn: (payload) =>
      warehouseAllocationServices.createWarehouseAssignment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse-allocation-pending"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse-assignments"] });
    },
  });

  const CreateUnloadingDetails = useMutation<
    boolean,
    ApiErrorResponse,
    CreateUnloadingDetailsRequest
  >({
    mutationFn: (payload) =>
      warehouseAllocationServices.createUnloadingDetails(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse-assignment-detail"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse-assignments"] });
    },
  });

  const CreateUnloadingCrew = useMutation<
    boolean,
    ApiErrorResponse,
    CreateUnloadingCrewRequest
  >({
    mutationFn: (payload) =>
      warehouseAllocationServices.createUnloadingCrew(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse-assignment-detail"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse-assignments"] });
    },
  });

  const CreateUnloadingMachinery = useMutation<
    boolean,
    ApiErrorResponse,
    CreateUnloadingMachineryRequest
  >({
    mutationFn: (payload) =>
      warehouseAllocationServices.createUnloadingMachinery(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse-assignment-detail"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse-assignments"] });
    },
  });

  const CompleteWarehouseAssignment = useMutation<
    boolean,
    ApiErrorResponse,
    CompleteWarehouseAssignmentRequest
  >({
    mutationFn: (payload) =>
      warehouseAllocationServices.completeWarehouseAssignment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse-assignment-detail"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse-allocation-pending"] });
    },
  });

  return {
    GetPendingAssignments,
    GetWarehouseAssignments,
    GetWarehouseAssignmentDetail,
    GetAvailableWarehouses,
    GetWarehouseMachineries,
    GetWarehouseStaffs,
    CreateWarehouseAssignment,
    CreateUnloadingDetails,
    CreateUnloadingCrew,
    CreateUnloadingMachinery,
    CompleteWarehouseAssignment,
  };
};