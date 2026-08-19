import { warehouseHttpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { PurchaseRequestMainPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import type { DeletePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/delete-purchase-request-payload";
import type { GetPurchaseRequestDetailPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-details-payload";
import type { GetPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-payload";
import type { GetPurchaseRequestProductPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-product-payload";
import type { ProcessPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/process-purchase-request-payload";
import type { SendPurchaseRequestToReviewPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/send-purchase-request-review-payload";
import { PurchaseServices } from "@app/modules/purchasing/infrastructure/services/purchase/PurchaseServices"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const purchaseServices = new PurchaseServices(warehouseHttpHandler);

type usePurchasePayloads = {
   getPurchaseRequestsPayload?: GetPurchaseRequestPayload,
   getPurchaseRequestDetailsPayload?: GetPurchaseRequestDetailPayload,
   sendPurchaseRequestToReviewPayload?: SendPurchaseRequestToReviewPayload,
   getPurchaseRequestProductsPayload?: GetPurchaseRequestProductPayload
}

export const usePurchase = (props?: usePurchasePayloads) => {

   const {
      getPurchaseRequestsPayload,
      getPurchaseRequestDetailsPayload,
      getPurchaseRequestProductsPayload
   } = props || {};

   const queryClient = useQueryClient();

   const purchaseRequestListEnabled = Boolean(
      (getPurchaseRequestsPayload?.company_id?.trim() &&
         getPurchaseRequestsPayload?.module_code?.trim()) ||
      getPurchaseRequestsPayload?.page_number
   );

   const purchaseRequestDatailEnabled = Boolean(
      getPurchaseRequestDetailsPayload?.company_id?.trim() &&
      getPurchaseRequestDetailsPayload?.module_code?.trim() &&
      getPurchaseRequestDetailsPayload?.purchase_request_id
   );

   const purchaseRequestProductEnabled = Boolean(
      getPurchaseRequestProductsPayload?.company_id?.trim() &&
      getPurchaseRequestProductsPayload?.module_code?.trim() &&
      getPurchaseRequestProductsPayload?.purchase_request_id
   );

   const GetPurchaseRequests = useQuery({
      queryKey: ["get-purchase-requests", getPurchaseRequestsPayload],
      queryFn: () => purchaseServices.GetPurchaseRequests(getPurchaseRequestsPayload!),
      enabled: purchaseRequestListEnabled,
      staleTime: 1000 * 60 * 1,
      refetchOnWindowFocus: false,
      retry: 1,
   });

   const GetPurchaseRequestDetails = useQuery({
      queryKey: ["get-purchase-request-details", getPurchaseRequestDetailsPayload],
      queryFn: () => purchaseServices.GetPurchaseRequestDetails(getPurchaseRequestDetailsPayload!),
      enabled: purchaseRequestDatailEnabled,
      staleTime: 0,
      refetchOnWindowFocus: false,
      retry: 1,
   });

   const GetPurchaseRequestProducts = useQuery({
      queryKey: ["get-purchase-request-products", getPurchaseRequestProductsPayload],
      queryFn: () => purchaseServices.GetPurchaseRequestProducts(getPurchaseRequestProductsPayload!),
      enabled: purchaseRequestProductEnabled,
      staleTime: 0,
      refetchOnWindowFocus: false,
      retry: 1,
   });

   const CreatePurchaseRequest = useMutation<void, ApiErrorResponse, PurchaseRequestMainPayload>({
      mutationKey: ["create-purchase-request"],
      mutationFn: (payload: PurchaseRequestMainPayload) => purchaseServices.CreatePurchaseRequest(payload),
      onSuccess() {
         queryClient.invalidateQueries({ queryKey: ["get-purchase-requests"] });
      },
      retry: 1
   });

   const ProcessPurchaseRequest = useMutation<void, ApiErrorResponse, ProcessPurchaseRequestPayload>({
      mutationKey: ["process-purchase-request"],
      mutationFn: (payload: ProcessPurchaseRequestPayload) => purchaseServices.ProcesssPurchaseRequest(payload),
      onSuccess() {
         queryClient.invalidateQueries({ queryKey: ["get-purchase-requests"] });
         queryClient.invalidateQueries({ queryKey: ["get-purchase-request-details"] });
      },
      retry: 1
   });

   const DeletePurchaseRequest = useMutation<void, ApiErrorResponse, DeletePurchaseRequestPayload>({
      mutationKey: ["delete-purchase-request"],
      mutationFn: (payload: DeletePurchaseRequestPayload) => purchaseServices.DeletePurchaseRequest(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["get-purchase-requests"] });
      },
      retryDelay: 2000,
      retry: 1
   });

   const SendPurchaseRequestToReview = useMutation<void, ApiErrorResponse, SendPurchaseRequestToReviewPayload>({
      mutationKey: ["send-purchase-request-to-review"],
      mutationFn: (payload: SendPurchaseRequestToReviewPayload) => purchaseServices.SendPurchaseRequestToReview(payload),
      onSuccess() {
         queryClient.invalidateQueries({ queryKey: ["get-purchase-requests"] });
         queryClient.invalidateQueries({
            queryKey: ["quotes-analysis"],
            refetchType: "all",
         });
      },
      retry: 1
   });

   return {
      GetPurchaseRequests, GetPurchaseRequestDetails,
      CreatePurchaseRequest, ProcessPurchaseRequest, DeletePurchaseRequest,
      SendPurchaseRequestToReview, GetPurchaseRequestProducts
   }
}
