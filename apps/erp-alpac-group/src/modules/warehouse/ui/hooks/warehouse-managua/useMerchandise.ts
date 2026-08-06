import { useQuery } from "@tanstack/react-query";
import type { GetMerchandiseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/get-merchandise";
import type { GetMerchandiseResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandise";
import { MerchandiseServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/MerchandiseServices";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetMerchandiseDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/get-merchandise-detail";
import type { GetMerchandiseDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandise-detail";
const merchandiseServices = new MerchandiseServices(warehouseHttpHandler);

type UseMerchandiseProps = {
  payloadGetMerchandise: GetMerchandiseRequest;
  payloadGetMerchandiseDetail: GetMerchandiseDetailRequest;
};

export const useMerchandise = (props: UseMerchandiseProps) => {
  const { payloadGetMerchandise, payloadGetMerchandiseDetail } = props;
  const GetMerchandiseRegister = useQuery<
    GetMerchandiseResponse,
    ApiErrorResponse
  >({
    queryKey: ["merchandise", payloadGetMerchandise],
    queryFn: () => merchandiseServices.getMerchandise(payloadGetMerchandise),
    enabled: Boolean(
      payloadGetMerchandise.company_id && payloadGetMerchandise.module_code,
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
      merchandiseServices.getMerchandiseById(payloadGetMerchandiseDetail),
    enabled: Boolean(
      payloadGetMerchandiseDetail.company_id &&
      payloadGetMerchandiseDetail.module_code &&
      payloadGetMerchandiseDetail.reception_id,
    ),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
  return {
    GetMerchandiseRegister,
    GetMerchandiseDetail,
  };
};
