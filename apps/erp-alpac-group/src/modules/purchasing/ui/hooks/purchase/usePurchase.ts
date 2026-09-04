import { warehouseHttpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { PurchaseRequestMainPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import type { DeletePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/delete-purchase-request-payload";
import type { GetPurchaseOrderDetailsPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-order-details-payload";
import type { PurchaseOrderDocumentRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-order-request";
import type { GetPurchaseOrdersPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-orders-payload";
import type { GetPurchaseRequestDetailPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-details-payload";
import type { GetPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-payload";
import type { GetPurchaseRequestProductPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-product-payload";
import type { GetPurchaseRequestDocumentRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-document-request";
import type { ProcessPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/process-purchase-request-payload";
import type { SendPurchaseRequestToReviewPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/send-purchase-request-review-payload";
import type { GetPurchaseOrderDetailsResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-details-response";
import type { PurchaseOrderDocumentResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-document-response";
import type { GetPurchaseOrdersResponseList } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-orders-response";
import type { PurchaseRequestDocumentResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-document-response";
import { PurchaseServices } from "@app/modules/purchasing/infrastructure/services/purchase/PurchaseServices"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const purchaseServices = new PurchaseServices(warehouseHttpHandler);

type usePurchasePayloads = {
   getPurchaseRequestsPayload?: GetPurchaseRequestPayload,
   getPurchaseRequestDetailsPayload?: GetPurchaseRequestDetailPayload,
   sendPurchaseRequestToReviewPayload?: SendPurchaseRequestToReviewPayload,
   getPurchaseRequestProductsPayload?: GetPurchaseRequestProductPayload,
   getPurchaseOrdersPayload?: GetPurchaseOrdersPayload,
   getPurchaseOrderDetailsPayload?: GetPurchaseOrderDetailsPayload,
}

export const usePurchase = (props?: usePurchasePayloads) => {

   const {
      getPurchaseRequestsPayload,
      getPurchaseRequestDetailsPayload,
      getPurchaseRequestProductsPayload,
      getPurchaseOrdersPayload,
      getPurchaseOrderDetailsPayload,
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

   const purchaseOrdersEnabled = Boolean(
      getPurchaseOrdersPayload?.company_id?.trim() &&
      getPurchaseOrdersPayload?.module_code?.trim() &&
      getPurchaseOrdersPayload?.page_number &&
      getPurchaseOrdersPayload?.page_size
   );

   const purchaseOrderDetailsEnabled = Boolean(
      getPurchaseOrderDetailsPayload?.company_id?.trim() &&
      getPurchaseOrderDetailsPayload?.module_code?.trim() &&
      getPurchaseOrderDetailsPayload?.purchase_order_id?.trim()
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

   const GetPurchaseRequestDocument = useMutation<PurchaseRequestDocumentResponse, ApiErrorResponse, GetPurchaseRequestDocumentRequest>({
      mutationKey: ["get-purchase-request-document"],
      mutationFn: (payload: GetPurchaseRequestDocumentRequest) => purchaseServices.GetPurchaseRequestDocument(payload),
      retry: 1,
   });

   const GetPurchaseOrders = useQuery<GetPurchaseOrdersResponseList, ApiErrorResponse>({
      queryKey: ["get-purchase-orders", getPurchaseOrdersPayload],
      queryFn: () => purchaseServices.GetPurchaseOrders(getPurchaseOrdersPayload!),
      enabled: purchaseOrdersEnabled,
      staleTime: 1000 * 60 * 1,
      refetchOnWindowFocus: false,
      retry: 1,
   });

   const GetPurchaseOrderDetails = useQuery<GetPurchaseOrderDetailsResponse, ApiErrorResponse>({
      queryKey: ["get-purchase-order-details", getPurchaseOrderDetailsPayload],
      queryFn: () => purchaseServices.GetPurchaseOrderDetails(getPurchaseOrderDetailsPayload!),
      enabled: purchaseOrderDetailsEnabled,
      staleTime: 0,
      refetchOnWindowFocus: false,
      retry: 1,
   });

   const GetPurchaseOrderDocument = useMutation<PurchaseOrderDocumentResponse, ApiErrorResponse, PurchaseOrderDocumentRequest>({
      mutationKey: ["get-purchase-order-document"],
      mutationFn: (payload: PurchaseOrderDocumentRequest) => purchaseServices.GetPurchaseOrderDocument(payload),
      retry: 1,
   });

   return {
      GetPurchaseRequests, GetPurchaseRequestDetails,
      CreatePurchaseRequest, ProcessPurchaseRequest, DeletePurchaseRequest,
      SendPurchaseRequestToReview, GetPurchaseRequestProducts,
      GetPurchaseOrders, GetPurchaseOrderDetails, GetPurchaseOrderDocument,
      GetPurchaseRequestDocument,
   }
}
