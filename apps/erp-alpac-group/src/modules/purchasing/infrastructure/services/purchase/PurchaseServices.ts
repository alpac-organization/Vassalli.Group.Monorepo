import type { IHttpHandler } from "@app/core/ports";
import type { IPurchaseServices } from "@app/modules/purchasing/application/interfaces/purchase/IPurchaseServices";
import type { CreatePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import type { DeletePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/delete-purchase-request-payload";
import type { GetPurchaseRequestDetailPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-details-payload";
import type { GetPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-payload";
import type { ProcessPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/process-purchase-request-payload";
import type { SendPurchaseRequestToReviewPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/send-purchase-request-review-payload";
import type { GetPurchaseRequestDetailResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { GetPurchaseRequestResponseList } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import { cleanParams } from "@app/shared/utils/object.utils";

export class PurchaseServices implements IPurchaseServices {

   private readonly apiHandler: IHttpHandler;

   constructor(httpHandler: IHttpHandler) {
      this.apiHandler = httpHandler;
   }

   async GetPurchaseRequests(payload: GetPurchaseRequestPayload): Promise<GetPurchaseRequestResponseList> {
      try {
         const { company_id, module_code, ...rest } = payload;

         const url = `/companies/${company_id}/modules/${module_code}/purchase-requests`;

         const response = await this.apiHandler.get<GetPurchaseRequestResponseList>(url, { params: cleanParams(rest) });

         return response;

      } catch (error) {

         throw error;
      }
   }

   async CreatePurchaseRequest(payload: CreatePurchaseRequestPayload): Promise<void> {
      try {
         const { company_id, module_code, ...rest } = payload;

         const url = `/companies/${company_id}/modules/${module_code}/purchase-requests`;

         await this.apiHandler.post<void>(url, rest);

      } catch (error) {

         throw error;
      }
   }

   async GetPurchaseRequestDetails(payload: GetPurchaseRequestDetailPayload): Promise<GetPurchaseRequestDetailResponse> {
      try {
         const { company_id, module_code, purchase_request_id, ...rest } = payload;

         const url = `/companies/${company_id}/modules/${module_code}/purchase-requests/${purchase_request_id}/details`;

         const response = await this.apiHandler.get<GetPurchaseRequestDetailResponse>(url, { params: cleanParams(rest) });

         return response;

      } catch (error) {

         throw error;
      }
   }

   async ProcesssPurchaseRequest(payload: ProcessPurchaseRequestPayload): Promise<void> {
      try {
         const { company_id, module_code, purchase_request_id, ...rest } = payload;

         const url = `/companies/${company_id}/modules/${module_code}/purchase-requests/${purchase_request_id}/process`;

         await this.apiHandler.post<void>(url, rest);

      } catch (error) {

         throw error;
      }
   }

   async DeletePurchaseRequest(payload: DeletePurchaseRequestPayload): Promise<void> {
      try {
         const { company_id, module_code, purchase_request_id } = payload;

         const url = `companies/${company_id}/modules/${module_code}/purchase-requests/${purchase_request_id}`;

         await this.apiHandler.delete<void>(url);

      } catch (error) {

         throw error;
      }
   }

   async SendPurchaseRequestToReview(payload: SendPurchaseRequestToReviewPayload): Promise<any> {
      try {
         const { company_id, module_code, purchase_request_id, ...rest } = payload;

         const url = `companies/${company_id}/modules/${module_code}/purchase-requests/${purchase_request_id}/send`;

         const response = await this.apiHandler.get<any>(url, { params: cleanParams(rest) });

         return response;

      } catch (error) {

         throw error;
      }
   }
}