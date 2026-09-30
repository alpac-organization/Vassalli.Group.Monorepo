import type { IHttpHandler } from "@app/core/ports";
import type { IPurchaseServices } from "@app/modules/purchasing/application/interfaces/purchase/IPurchaseServices";
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
import type { PurchaseRequestDocumentResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-document-response";
import type { PurchaseOrderDocumentResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-document-response";
import type { GetPurchaseOrdersResponseList } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-orders-response";
import type { GetPurchaseRequestDetailResponse, PurchaseRequestProductInformationList } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { GetPurchaseRequestResponseList } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import { cleanParams } from "@app/shared/utils/object.utils";

export class PurchaseServices implements IPurchaseServices {

   private readonly apiHandler: IHttpHandler;

   constructor(httpHandler: IHttpHandler) {
      this.apiHandler = httpHandler;
   }

   async GetPurchaseRequests(payload: GetPurchaseRequestPayload): Promise<GetPurchaseRequestResponseList> {
      const { company_id, module_code, ...rest } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/purchase-requests`;
      return this.apiHandler.get<GetPurchaseRequestResponseList>(url, { params: cleanParams(rest) });
   }

   async CreatePurchaseRequest(payload: PurchaseRequestMainPayload): Promise<void> {
      const { company_id, module_code, purchase_requests } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/purchase-requests`;
      await this.apiHandler.post<void>(url, { purchase_requests });
   }

   async UpdatePurchaseRequest(payload: UpdatePurchaseRequestPayload): Promise<void> {
      const { company_id, module_code, purchase_request_id, ...rest } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/purchase-requests/${purchase_request_id}`;
      await this.apiHandler.patch<void>(url, rest);
   }

   async GetPurchaseRequestDetails(payload: GetPurchaseRequestDetailPayload): Promise<GetPurchaseRequestDetailResponse> {
      const { company_id, module_code, purchase_request_id } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/purchase-requests/${purchase_request_id}`;
      return this.apiHandler.get<GetPurchaseRequestDetailResponse>(url);
   }

   async GetPurchaseRequestProducts(payload: GetPurchaseRequestProductPayload): Promise<PurchaseRequestProductInformationList> {
      const { company_id, module_code, purchase_request_id, ...rest } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/purchase-requests/${purchase_request_id}/products`;
      return this.apiHandler.get<PurchaseRequestProductInformationList>(url, { params: cleanParams(rest) });
   }

   async ProcesssPurchaseRequest(payload: ProcessPurchaseRequestPayload): Promise<void> {
      const { company_id, module_code, purchase_request_id, ...rest } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/purchase-requests/${purchase_request_id}/process`;
      await this.apiHandler.post<void>(url, rest);
   }

   async DeletePurchaseRequest(payload: DeletePurchaseRequestPayload): Promise<void> {
      const { company_id, module_code, purchase_request_id } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/purchase-requests/${purchase_request_id}`;
      await this.apiHandler.delete<void>(url);
   }

   async SendPurchaseRequestToReview(payload: SendPurchaseRequestToReviewPayload): Promise<void> {
      const { company_id, module_code, purchase_request_id, ...rest } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/purchase-requests/${purchase_request_id}/send-accounting-review`;
      await this.apiHandler.post<void>(url, rest);
   }

   async GetPurchaseRequestDocument(params: GetPurchaseRequestDocumentRequest): Promise<PurchaseRequestDocumentResponse> {
      const { company_id, module_code, ...rest } = params;
      const url = `/companies/${company_id}/modules/${module_code}/purchase-requests/document-generator`;
      return this.apiHandler.get<PurchaseRequestDocumentResponse>(url, { params: cleanParams(rest) });
   }

   async GetPurchaseOrders(payload: GetPurchaseOrdersPayload): Promise<GetPurchaseOrdersResponseList> {
      const { company_id, module_code, ...rest } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/purchase-orders`;
      const response = await this.apiHandler.get<GetPurchaseOrdersResponseList>(url, { params: cleanParams(rest) }); 
      console.log("response", response);
      return response;
   }

   async GetPurchaseOrderDetails(payload: GetPurchaseOrderDetailsPayload): Promise<GetPurchaseOrderDetailsResponse> {
      const { company_id, module_code, purchase_order_id } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/purchase-orders/${purchase_order_id}/details`;
      return this.apiHandler.get<GetPurchaseOrderDetailsResponse>(url);
   }

   async GetPurchaseOrderDocument(params: PurchaseOrderDocumentRequest): Promise<PurchaseOrderDocumentResponse> {
      const { company_id, module_code, purchase_order_id, payment_method } = params;
      const url = `/companies/${company_id}/modules/${module_code}/purchase-orders/${purchase_order_id}/document-generator`;
      return this.apiHandler.get<PurchaseOrderDocumentResponse>(url, { params: cleanParams({ payment_method }) });
   }

   async AnnulPurchaseRequest(payload: AnnulPurchaseRequestPayload): Promise<void> {
      const { company_id, module_code, purchase_request_id, reason } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/purchase-requests/${purchase_request_id}/annul`;
      await this.apiHandler.post<void>(url, { reason });
   }
}
