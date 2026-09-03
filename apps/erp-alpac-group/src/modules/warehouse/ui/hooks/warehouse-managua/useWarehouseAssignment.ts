import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { WarehouseAssignmentServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/WarehouseAssignmentServices";
import type { GetPendingAssignmentsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-pending-assignments";
import type { CreateWarehouseAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/create-warehouse-assignment";
import type { CreateUnloadingCrewRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/create-unloading-crew";
import type { CreateUnloadingMachineryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/create-unloading-machinery";
import type { CompleteAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/complete-assignment";
import type { GetAssignmentDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignment-detail";
import type { GetAssignmentsHistoryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignments-history";
import type { GetPendingAssignmentsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-pending-assignments";
import type { WarehouseAssignmentDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-detail";
import type { GetMachineryCatalogsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-machinery-catalogs";

const warehouseAssignmentServices = new WarehouseAssignmentServices(
  warehouseHttpHandler,
);

type UseWarehouseAssignmentProps = {
  payloadPending?: GetPendingAssignmentsRequest;
  payloadDetail?: GetAssignmentDetailRequest | null;
  payloadHistory?: GetAssignmentsHistoryRequest;
  payloadMachineryCatalogs?: { company_id: string; module_code: string };
};

export const useWarehouseAssignment = (props?: UseWarehouseAssignmentProps) => {
  const {
    payloadPending,
    payloadDetail,
    payloadHistory,
    payloadMachineryCatalogs,
  } = props ?? {};

  const queryClient = useQueryClient();

  // ─── QUERIES ──────────────────────────────────────────────────────────────

  /** PASO 1 — Recepciones pendientes de asignación */
  const GetPendingAssignments = useQuery<
    GetPendingAssignmentsResponse,
    ApiErrorResponse
  >({
    queryKey: ["warehouse-assignment-pending", payloadPending],
    queryFn: () =>
      warehouseAssignmentServices.getPendingAssignments(
        payloadPending as GetPendingAssignmentsRequest,
      ),
    enabled: Boolean(
      payloadPending?.company_id && payloadPending?.module_code,
    ),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  /** PASO 7 — Detalle consolidado de una asignación */
  const GetAssignmentDetail = useQuery<
    WarehouseAssignmentDetailResponse,
    ApiErrorResponse
  >({
    queryKey: ["warehouse-assignment-detail", payloadDetail],
    queryFn: () =>
      warehouseAssignmentServices.getAssignmentDetail(
        payloadDetail as GetAssignmentDetailRequest,
      ),
    enabled: Boolean(
      payloadDetail?.company_id &&
        payloadDetail?.module_code &&
        payloadDetail?.reception_id,
    ),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  /** PASO 8 — Historial general de asignaciones */
  const GetAssignmentsHistory = useQuery<
    GetPendingAssignmentsResponse,
    ApiErrorResponse
  >({
    queryKey: ["warehouse-assignment-history", payloadHistory],
    queryFn: () =>
      warehouseAssignmentServices.getAssignmentsHistory(
        payloadHistory as GetAssignmentsHistoryRequest,
      ),
    enabled: Boolean(
      payloadHistory?.company_id && payloadHistory?.module_code,
    ),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  /** PASO 2B — Catálogo de maquinarias activas */
  const GetMachineryCatalogs = useQuery<
    GetMachineryCatalogsResponse,
    ApiErrorResponse
  >({
    queryKey: ["machinery-catalogs", payloadMachineryCatalogs],
    queryFn: () =>
      warehouseAssignmentServices.getMachineryCatalogs(
        payloadMachineryCatalogs as { company_id: string; module_code: string },
      ),
    enabled: Boolean(
      payloadMachineryCatalogs?.company_id &&
        payloadMachineryCatalogs?.module_code,
    ),
    staleTime: 1000 * 60 * 10, // catálogo cambia poco — 10 min
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // ─── MUTATIONS ────────────────────────────────────────────────────────────

  /** PASO 3 — Crear asignación base (bodega + jefe) */
  const CreateWarehouseAssignment = useMutation<
    boolean,
    ApiErrorResponse,
    CreateWarehouseAssignmentRequest
  >({
    mutationFn: (payload) =>
      warehouseAssignmentServices.createWarehouseAssignment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouse-assignment-pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["warehouse-assignment-detail"],
      });
    },
  });

  /** PASO 4 — Asignar cuadrilla (interna o tercerizada) */
  const CreateUnloadingCrew = useMutation<
    boolean,
    ApiErrorResponse,
    CreateUnloadingCrewRequest
  >({
    mutationFn: (payload) =>
      warehouseAssignmentServices.createUnloadingCrew(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouse-assignment-detail"],
      });
    },
  });

  /** PASO 5 — Asignar maquinaria (interna o tercerizada) */
  const CreateUnloadingMachinery = useMutation<
    boolean,
    ApiErrorResponse,
    CreateUnloadingMachineryRequest
  >({
    mutationFn: (payload) =>
      warehouseAssignmentServices.createUnloadingMachinery(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouse-assignment-detail"],
      });
    },
  });

  /** PASO 6 — Finalizar / completar asignación */
  const CompleteAssignment = useMutation<
    boolean,
    ApiErrorResponse,
    CompleteAssignmentRequest
  >({
    mutationFn: (payload) =>
      warehouseAssignmentServices.completeAssignment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouse-assignment-pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["warehouse-assignment-detail"],
      });
      queryClient.invalidateQueries({
        queryKey: ["warehouse-assignment-history"],
      });
    },
  });

  return {
    // Queries
    GetPendingAssignments,
    GetAssignmentDetail,
    GetAssignmentsHistory,
    GetMachineryCatalogs,
    // Mutations
    CreateWarehouseAssignment,
    CreateUnloadingCrew,
    CreateUnloadingMachinery,
    CompleteAssignment,
  };
};

