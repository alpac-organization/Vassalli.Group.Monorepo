import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";


export interface RequestedProducts {
  requested_products: PurchaseRequestProductInformation[];
}