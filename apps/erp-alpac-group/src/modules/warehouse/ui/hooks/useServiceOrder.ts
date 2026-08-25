import { warehouseHttpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { CreateServiceOrderRequest } from "@app/modules/service-order/domain/ApiContract/Requests/service-order-requests/create-service-order.request";
import type { GetServiceOrdersRequest } from "@app/modules/service-order/domain/ApiContract/Requests/service-order-requests/get-service-orders.request";
import type { CreateServiceOrderResponse } from "@app/modules/service-order/domain/ApiContract/Responses/service-order-responses/create-service-order.response";
import { ServiceOrderServices } from "@app/modules/service-order/infrastructure/services/service-order-services/ServiceOrderServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const serviceOrderService = new ServiceOrderServices(warehouseHttpHandler);

type UseServiceOrderPayloads = {
   getServiceOrdersPayload?: GetServiceOrdersRequest;
};

export const useServiceOrder = (props?: UseServiceOrderPayloads) => {

   const { getServiceOrdersPayload } = props || {};
   const queryClient = useQueryClient();

   const getServiceOrdersEnabled = Boolean(
      getServiceOrdersPayload?.company_id?.trim() &&
      getServiceOrdersPayload?.module_code?.trim() &&
      getServiceOrdersPayload?.page_number,
   );

   const GetServiceOrders = useQuery({
      queryKey: ["get-service-orders", getServiceOrdersPayload],
      queryFn: () => serviceOrderService.GetServiceOrders(getServiceOrdersPayload!),
      enabled: getServiceOrdersEnabled,
      staleTime: 1000 * 60 * 1,
      refetchOnWindowFocus: false,
      retry: 1,
   });

   const CreateServiceOrder = useMutation<CreateServiceOrderResponse, ApiErrorResponse, CreateServiceOrderRequest>({
      mutationKey: ["create-service-order"],
      mutationFn: (payload: CreateServiceOrderRequest) => serviceOrderService.CreateServiceOrder(payload),
      onSuccess() {
         queryClient.invalidateQueries({ queryKey: ["get-service-orders"] });
      },
      retry: 1,
   });

   return {
      GetServiceOrders,
      CreateServiceOrder,
   };
};
