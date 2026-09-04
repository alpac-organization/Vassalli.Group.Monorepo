import type { GetAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-access-control";
import type { GetReceptionEntranceDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-access-control-detail";
import type { CreateAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/create-access-control";
import type { UpdateReceptionEntranceRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/update-access-control";
import type { AddDucatsToReceptionRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/add-ducats-to-reception";
import type { GetReceptionEntrancesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import type { ReceptionEntranceDetail } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control-detail";
import { AccessControlServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/AccessControlServices";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GenerateExitAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/generate-exit";

type UseAccessControlProps = {
  payloadAccessControl?: GetAccessControlRequest;
  detailPayload?: GetReceptionEntranceDetailRequest | null;
};

const warehouseManaguaServices = new AccessControlServices(
  warehouseHttpHandler,
);

export const useAccessControl = (props: UseAccessControlProps) => {
  const queryClient = useQueryClient();
  const { payloadAccessControl, detailPayload } = props;

  const GetAccessControl = useQuery<
    GetReceptionEntrancesResponse,
    ApiErrorResponse
  >({
    queryKey: ["access-control", payloadAccessControl],
    queryFn: () =>
      warehouseManaguaServices.getAccessControl(payloadAccessControl!),
    enabled: Boolean(
      payloadAccessControl?.company_id && payloadAccessControl?.module_code,
    ),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  const GetAccessControlDetail = useQuery<
    ReceptionEntranceDetail,
    ApiErrorResponse
  >({
    queryKey: ["access-control-detail", detailPayload],
    queryFn: () =>
      warehouseManaguaServices.getAccessControlById(detailPayload!),
    enabled: Boolean(
      detailPayload?.company_id &&
      detailPayload?.module_code &&
      detailPayload?.reception_id,
    ),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const CreateAccessControl = useMutation<
    void | null,
    ApiErrorResponse,
    CreateAccessControlRequest
  >({
    mutationFn: (payload) =>
      warehouseManaguaServices.createAccessControl(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-control"] });
    },
  });

  const UpdateAccessControl = useMutation<
    void | null,
    ApiErrorResponse,
    UpdateReceptionEntranceRequest
  >({
    mutationFn: (payload) =>
      warehouseManaguaServices.updateAccessControl(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-control"] });
      queryClient.invalidateQueries({ queryKey: ["access-control-detail"] });
    },
  });

  const AddDucatsToReception = useMutation<
    void | null,
    ApiErrorResponse,
    AddDucatsToReceptionRequest
  >({
    mutationFn: (payload) =>
      warehouseManaguaServices.addDucatsToReception(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-control"] });
      queryClient.invalidateQueries({ queryKey: ["access-control-detail"] });
    },
  });

  const GenerateExitAccessControl = useMutation<
    void | null,
    ApiErrorResponse,
    GenerateExitAccessControlRequest
  >({
    mutationFn: (payload) =>
      warehouseManaguaServices.generateExitAccessControl(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-control"] });
      queryClient.invalidateQueries({ queryKey: ["access-control-detail"] });
    },
  });

  const DeleteAccessControl = useMutation<
    boolean,
    ApiErrorResponse,
    GetReceptionEntranceDetailRequest
  >({
    mutationFn: (payload) =>
      warehouseManaguaServices.deleteAccessControlById(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-control"] });
      queryClient.invalidateQueries({ queryKey: ["access-control-detail"] });
    },
  });

  return {
    GetAccessControl,
    GetAccessControlDetail,
    CreateAccessControl,
    UpdateAccessControl,
    AddDucatsToReception,
    GenerateExitAccessControl,
    DeleteAccessControl,
  };
};
