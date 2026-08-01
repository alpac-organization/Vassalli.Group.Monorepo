import type { CreatePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import type { GetPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-payload";
import type { GetPurchaseRequestDetailResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { GetPurchaseRequestResponseList } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";


export interface IPurchaseServices {

   GetPurchaseRequests(payload: GetPurchaseRequestPayload): Promise<GetPurchaseRequestResponseList>;

   GetPurchaseRequestDetails(payload: any): Promise<GetPurchaseRequestDetailResponse>;

   CreatePurchaseRequest(payload: CreatePurchaseRequestPayload): Promise<void>;

   ProcesssPurchaseRequest(payload: any): Promise<void>;
}