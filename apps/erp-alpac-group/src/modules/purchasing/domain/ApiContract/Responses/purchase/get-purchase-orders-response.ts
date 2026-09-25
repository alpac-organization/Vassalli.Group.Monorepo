import type { UserInformation, WorkAreaInformation } from "@app/shared/interfaces/organization-information/organization-information";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { GetPurchaseRequestDetailResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export interface GetPurchaseOrdersResponse {
   comments: string | null;
   sent_to_review_at: string;
   purchase_order_id: string;
   /** Código formal de la OC (ej. OC-ALP-17851). Backend lo proveerá. */
   purchase_order_code?: string | null;
   /** Nombre del proveedor adjudicado. Backend lo proveerá. */
   supplier_name?: string | null;
   /** Condición de pago (ej. Crédito). Backend lo proveerá. */
   payment_condition?: string | null;
   /** Texto de "Solicitud de Materiales" en el documento. */
   materials_request?: string | null;
   discount?: number | null;
   exo?: number | null;
   sent_by_user_information: UserInformation;
   purchase_request: GetPurchaseRequestDetailResponse;
   work_area_information: WorkAreaInformation;
}

export type GetPurchaseOrdersResponseList = PaginateBaseResponse<GetPurchaseOrdersResponse[]>;
