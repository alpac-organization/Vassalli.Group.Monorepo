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
import type { UpdatePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/update-purchase-request-payload";
import type { AnnulPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/annul-purchase-request-payload";
import type { GetPurchaseOrderDetailsResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-details-response";
import type { PurchaseOrderDocumentResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-document-response";
import type { PurchaseRequestDocumentResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-document-response";
import type { GetPurchaseOrdersResponseList } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-orders-response";
import type { GetPurchaseRequestDetailResponse, PurchaseRequestProductInformationList } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { GetPurchaseRequestResponseList } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";

export interface IPurchaseServices {

   GetPurchaseRequests(payload: GetPurchaseRequestPayload): Promise<GetPurchaseRequestResponseList>;

   GetPurchaseRequestDetails(payload: GetPurchaseRequestDetailPayload): Promise<GetPurchaseRequestDetailResponse>;

   GetPurchaseRequestProducts(payload: GetPurchaseRequestProductPayload): Promise<PurchaseRequestProductInformationList>;

   CreatePurchaseRequest(payload: PurchaseRequestMainPayload): Promise<void>;

   UpdatePurchaseRequest(payload: UpdatePurchaseRequestPayload): Promise<void>;

   ProcesssPurchaseRequest(payload: ProcessPurchaseRequestPayload): Promise<void>;

   DeletePurchaseRequest(payload: DeletePurchaseRequestPayload): Promise<void>;

   SendPurchaseRequestToReview(payload: SendPurchaseRequestToReviewPayload): Promise<void>;

   GetPurchaseRequestDocument(params: GetPurchaseRequestDocumentRequest): Promise<PurchaseRequestDocumentResponse>;

   GetPurchaseOrders(payload: GetPurchaseOrdersPayload): Promise<GetPurchaseOrdersResponseList>;

   GetPurchaseOrderDetails(payload: GetPurchaseOrderDetailsPayload): Promise<GetPurchaseOrderDetailsResponse>;

   GetPurchaseOrderDocument(payload: PurchaseOrderDocumentRequest): Promise<PurchaseOrderDocumentResponse>;

   AnnulPurchaseRequest(payload: AnnulPurchaseRequestPayload): Promise<void>;
}
