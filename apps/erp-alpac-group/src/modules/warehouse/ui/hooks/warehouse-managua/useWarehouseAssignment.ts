import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { WarehouseAssignmentServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/WarehouseAssignmentServices";

import type { CreateAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/create-assignment";
import type { GetAssignmentsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignments";
import type { GetAssignmentDetailsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignment-details";
import type { UpdateAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/update-assignment";
import type { DeleteAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/delete-assignment";

import type { AssignCollaboratorsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assign-collaborators";
import type { AssignMachineryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assign-machinery";
import type { DeleteAssignmentCollaboratorRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/delete-assignment-collaborator";
import type { DeleteAssignmentMachineryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/delete-assignment-machinery";
import type { GetAssignmentCollaboratorsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignment-collaborators";
import type { GetAssignmentMachineryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignment-machinery";

import type { GetAssignmentsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignments";
import type { GetAssignmentDetailsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-details";
import type { GetAssignmentCollaboratorsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-collaborators";
import type { GetAssignmentMachineryResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-machinery";

const warehouseAssignmentServices = new WarehouseAssignmentServices(
  warehouseHttpHandler,
);

type UseWarehouseAssignmentProps = {
  payloadAssignments?: GetAssignmentsRequest | null;
  payloadAssignmentDetails?: GetAssignmentDetailsRequest | null;
  payloadCollaborators?: GetAssignmentCollaboratorsRequest | null;
  payloadMachinery?: GetAssignmentMachineryRequest | null;
};

export const useWarehouseAssignment = (props?: UseWarehouseAssignmentProps) => {
  const {
    payloadAssignments,
    payloadAssignmentDetails,
    payloadCollaborators,
    payloadMachinery,
  } = props ?? {};
  const queryClient = useQueryClient();

  // ─── QUERIES ──────────────────────────────────────────────────────────────

  /** GET listado de asignaciones operativas */
  const GetAssignments = useQuery<GetAssignmentsResponse, ApiErrorResponse>({
    queryKey: ["assignments", payloadAssignments],
    queryFn: () =>
      warehouseAssignmentServices.getAssignments(
        payloadAssignments as GetAssignmentsRequest,
      ),
    enabled: Boolean(
      payloadAssignments?.company_id &&
        payloadAssignments?.module_code &&
        payloadAssignments?.operational_order_id,
    ),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  /** GET detalle de asignación operativa */
  const GetAssignmentDetails = useQuery<
    GetAssignmentDetailsResponse,
    ApiErrorResponse
  >({
    queryKey: ["assignment-details", payloadAssignmentDetails],
    queryFn: () =>
      warehouseAssignmentServices.getAssignmentDetails(
        payloadAssignmentDetails as GetAssignmentDetailsRequest,
      ),
    enabled: Boolean(
      payloadAssignmentDetails?.company_id &&
        payloadAssignmentDetails?.module_code &&
        payloadAssignmentDetails?.operational_order_id &&
        payloadAssignmentDetails?.assignment_id,
    ),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  /** GET colaboradores asignados */
  const GetAssignmentCollaborators = useQuery<
    GetAssignmentCollaboratorsResponse,
    ApiErrorResponse
  >({
    queryKey: ["assignment-collaborators", payloadCollaborators],
    queryFn: () =>
      warehouseAssignmentServices.getAssignmentCollaborators(
        payloadCollaborators as GetAssignmentCollaboratorsRequest,
      ),
    enabled: Boolean(
      payloadCollaborators?.company_id &&
        payloadCollaborators?.module_code &&
        payloadCollaborators?.operational_order_id &&
        payloadCollaborators?.assignment_id,
    ),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  /** GET maquinaria asignada */
  const GetAssignmentMachinery = useQuery<
    GetAssignmentMachineryResponse,
    ApiErrorResponse
  >({
    queryKey: ["assignment-machinery", payloadMachinery],
    queryFn: () =>
      warehouseAssignmentServices.getAssignmentMachinery(
        payloadMachinery as GetAssignmentMachineryRequest,
      ),
    enabled: Boolean(
      payloadMachinery?.company_id &&
        payloadMachinery?.module_code &&
        payloadMachinery?.operational_order_id &&
        payloadMachinery?.assignment_id,
    ),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // ─── MUTATIONS ────────────────────────────────────────────────────────────

  /** POST crear asignación operativa */
  const CreateAssignment = useMutation<
    void,
    ApiErrorResponse,
    CreateAssignmentRequest
  >({
    mutationFn: (payload) =>
      warehouseAssignmentServices.createAssignment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
      });
    },
  });

  /** PATCH actualizar asignación operativa */
  const UpdateAssignment = useMutation<
    void,
    ApiErrorResponse,
    UpdateAssignmentRequest
  >({
    mutationFn: (payload) =>
      warehouseAssignmentServices.updateAssignment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["assignment-details"],
      });
    },
  });

  /** DELETE eliminar asignación operativa */
  const DeleteAssignment = useMutation<
    void,
    ApiErrorResponse,
    DeleteAssignmentRequest
  >({
    mutationFn: (payload) =>
      warehouseAssignmentServices.deleteAssignment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
      });
    },
  });

  /** POST asignar colaboradores */
  const AssignCollaborators = useMutation<
    void,
    ApiErrorResponse,
    AssignCollaboratorsRequest
  >({
    mutationFn: (payload) =>
      warehouseAssignmentServices.assignCollaborators(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignment-collaborators"],
      });
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
      });
    },
  });

  /** POST asignar maquinaria */
  const AssignMachinery = useMutation<
    void,
    ApiErrorResponse,
    AssignMachineryRequest
  >({
    mutationFn: (payload) =>
      warehouseAssignmentServices.assignMachinery(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignment-machinery"],
      });
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
      });
    },
  });

  /** DELETE desasignar colaborador */
  const DeleteAssignmentCollaborator = useMutation<
    void,
    ApiErrorResponse,
    DeleteAssignmentCollaboratorRequest
  >({
    mutationFn: (payload) =>
      warehouseAssignmentServices.deleteAssignmentCollaborator(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignment-collaborators"],
      });
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
      });
    },
  });

  /** DELETE desasignar maquinaria */
  const DeleteAssignmentMachinery = useMutation<
    void,
    ApiErrorResponse,
    DeleteAssignmentMachineryRequest
  >({
    mutationFn: (payload) =>
      warehouseAssignmentServices.deleteAssignmentMachinery(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignment-machinery"],
      });
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
      });
    },
  });

  return {
    // Queries
    GetAssignments,
    GetAssignmentDetails,
    GetAssignmentCollaborators,
    GetAssignmentMachinery,
    // Mutations
    CreateAssignment,
    UpdateAssignment,
    DeleteAssignment,
    AssignCollaborators,
    AssignMachinery,
    DeleteAssignmentCollaborator,
    DeleteAssignmentMachinery,
  };
};
