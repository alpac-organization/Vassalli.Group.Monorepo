import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetMerchandiseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/get-merchandise";
import type { GetMerchandiseResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandise";
import { MerchandiseServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/MerchandiseServices";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetMerchandiseDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/get-merchandise-detail";
import type { GetMerchandiseDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandise-detail";
import type { GetMerchandisesRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/get-merchandises";
import type { GetMerchandisesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandises";
import type { CreateDucatRegistryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/create-ducat-registry";
import type { CreateDucatRegistryDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/create-ducat-registry-detail";
import type { AssignServiceOrderToCustomsDeclarationRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/assign-service-order-to-customs-declaration";
import type { RegisterMerchandiseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/register-merchandise";
const merchandiseServices = new MerchandiseServices(warehouseHttpHandler);

type UseMerchandiseProps = {
  payloadGetMerchandise?: GetMerchandiseRequest;
  payloadGetMerchandiseDetail?: GetMerchandiseDetailRequest;
  payloadGetMerchandises?: GetMerchandisesRequest;
};

export const useMerchandise = (props?: UseMerchandiseProps) => {
  const {
    payloadGetMerchandise,
    payloadGetMerchandiseDetail,
    payloadGetMerchandises,
  } = props ?? {};
  const queryClient = useQueryClient();

  const invalidateMerchandiseRegistry = () => {
    queryClient.invalidateQueries({ queryKey: ["merchandise"] });
    queryClient.invalidateQueries({ queryKey: ["merchandise-detail"] });
  };

  const GetMerchandiseRegister = useQuery<
    GetMerchandiseResponse,
    ApiErrorResponse
  >({
    queryKey: ["merchandise", payloadGetMerchandise],
    queryFn: () =>
      merchandiseServices.getMerchandise(
        payloadGetMerchandise as GetMerchandiseRequest,
      ),
    enabled: Boolean(
      payloadGetMerchandise?.company_id && payloadGetMerchandise?.module_code,
    ),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
  const GetMerchandiseDetail = useQuery<
    GetMerchandiseDetailResponse,
    ApiErrorResponse
  >({
    queryKey: ["merchandise-detail", payloadGetMerchandiseDetail],
    queryFn: () =>
      merchandiseServices.getMerchandiseById(
        payloadGetMerchandiseDetail as GetMerchandiseDetailRequest,
      ),
    enabled: Boolean(
      payloadGetMerchandiseDetail?.company_id &&
      payloadGetMerchandiseDetail?.module_code &&
      payloadGetMerchandiseDetail?.reception_id,
    ),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
  const GetMerchandises = useQuery<
    GetMerchandisesResponse,
    ApiErrorResponse
  >({
    queryKey: ["merchandises", payloadGetMerchandises],
    queryFn: () =>
      merchandiseServices.getMerchandises(
        payloadGetMerchandises as GetMerchandisesRequest,
      ),
    enabled: Boolean(
      payloadGetMerchandises?.company_id && payloadGetMerchandises?.module_code,
    ),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const CreateDucatRegistry = useMutation<
    boolean,
    ApiErrorResponse,
    CreateDucatRegistryRequest
  >({
    mutationFn: (payload) => merchandiseServices.createDucatRegistry(payload),
    onSuccess: invalidateMerchandiseRegistry,
    retry: 1,
  });

  const CreateDucatRegistryDetail = useMutation<
    boolean,
    ApiErrorResponse,
    CreateDucatRegistryDetailRequest
  >({
    mutationFn: (payload) =>
      merchandiseServices.createDucatRegistryDetail(payload),
    onSuccess: invalidateMerchandiseRegistry,
    retry: 1,
  });

  const AssignServiceOrderToCustomsDeclaration = useMutation<
    boolean,
    ApiErrorResponse,
    AssignServiceOrderToCustomsDeclarationRequest
  >({
    mutationFn: (payload) =>
      merchandiseServices.assignServiceOrderToCustomsDeclaration(payload),
    onSuccess: invalidateMerchandiseRegistry,
    retry: 1,
  });

  const RegisterMerchandise = useMutation<
    string,
    ApiErrorResponse,
    RegisterMerchandiseRequest
  >({
    mutationFn: (payload) => merchandiseServices.registerMerchandise(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["merchandises"] }),
    retry: 1,
  });

  return {
    GetMerchandiseRegister,
    GetMerchandiseDetail,
    GetMerchandises,
    CreateDucatRegistry,
    CreateDucatRegistryDetail,
    AssignServiceOrderToCustomsDeclaration,
    RegisterMerchandise,
  };
};